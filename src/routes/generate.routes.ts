import type { FastifyPluginAsync } from 'fastify';
import { RenderService } from '../services/render.service.js';
import { TemplateService } from '../services/template.service.js';
import type { GenerateImageRequest, GenerateImageResponse } from '../types/index.js';
import { config } from '../config/index.js';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

const renderService = new RenderService();
const templateService = new TemplateService();

export const generateRoutes: FastifyPluginAsync = async (fastify) => {
  // Inicializar serviços
  await renderService.loadFonts();
  
  // Rota para listar templates disponíveis
  fastify.get('/templates', async (_request, reply) => {
    const templates = templateService.getTemplates();
    return reply.send({
      success: true,
      data: templates,
    });
  });
  
  // Rota para gerar imagem única
  fastify.post<{
    Body: GenerateImageRequest;
  }>('/generate', async (request, reply) => {
    try {
      const { template: templateId, variables, format = 'png', quality = 90 } = request.body;
      
      // Obter configuração do template
      const templateConfig = templateService.getTemplate(templateId);
      if (!templateConfig) {
        return reply.status(404).send({
          success: false,
          error: 'Template não encontrado',
        } as GenerateImageResponse);
      }
      
      // Processar variáveis
      const processedVariables = renderService.processVariables(variables);
      
      // Renderizar template
      const element = templateService.renderTemplate(templateId, processedVariables);
      if (!element) {
        return reply.status(500).send({
          success: false,
          error: 'Erro ao renderizar template',
        } as GenerateImageResponse);
      }
      
      // Gerar imagem
      const imageBuffer = await renderService.renderToImage(element, {
        width: templateConfig.largura,
        height: templateConfig.altura,
        format,
        quality,
      });
      
      // Salvar imagem (você pode adaptar para S3 ou outro storage)
      const imageId = randomUUID();
      const fileName = `${imageId}.${format}`;
      const outputDir = join(process.cwd(), 'public', 'generated');
      const filePath = join(outputDir, fileName);
      
      // Criar diretório se não existir
      await mkdir(outputDir, { recursive: true });
      
      // Salvar arquivo
      await writeFile(filePath, imageBuffer);
      
      // Retornar resposta
      const imageUrl = `${config.baseUrl}/generated/${fileName}`;
      
      const response: GenerateImageResponse = {
        success: true,
        imageUrl,
        imageBase64: request.body.returnBase64 
          ? imageBuffer.toString('base64') 
          : undefined,
      };
      
      // Chamar webhook se fornecido
      if (request.body.webhook) {
        // Implementar chamada webhook assíncrona
        fastify.log.info(`Webhook será chamado: ${request.body.webhook}`);
      }
      
      return reply.send(response);
      
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno',
      } as GenerateImageResponse);
    }
  });
  
  // Rota para geração em lote
  fastify.post('/generate/batch', async (_request, reply) => {
    // TODO: Implementar geração em lote com filas
    return reply.status(501).send({
      success: false,
      error: 'Funcionalidade em desenvolvimento',
    });
  });
  
  // Rota de validação de template
  fastify.post<{
    Body: {
      template: string;
      variables: Record<string, any>;
    };
  }>('/validate', async (request, reply) => {
    const { template, variables } = request.body;
    
    const validation = templateService.validateVariables(template, variables);
    
    return reply.send({
      success: validation.valid,
      errors: validation.errors,
    });
  });
  
  // Health check
  fastify.get('/health', async (_request, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });
}; 
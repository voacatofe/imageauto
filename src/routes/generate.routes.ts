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
  fastify.get('/templates', {
    schema: {
      description: 'Lista todos os templates disponíveis',
      tags: ['Templates'],
      response: {
        200: {
          description: 'Lista de templates',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  nome: { type: 'string' },
                  descricao: { type: 'string' },
                  tipo: { type: 'string' },
                  largura: { type: 'number' },
                  altura: { type: 'number' },
                  redeSocial: { type: 'string' },
                  variaveisObrigatorias: { type: 'array', items: { type: 'string' } },
                  variaveisOpcionais: { type: 'array', items: { type: 'string' } }
                }
              }
            }
          }
        }
      }
    }
  }, async (_request, reply) => {
    const templates = templateService.getTemplates();
    return reply.send({
      success: true,
      data: templates,
    });
  });
  
  // Rota para gerar imagem única
  fastify.post<{
    Body: GenerateImageRequest;
  }>('/generate', {
    schema: {
      description: 'Gera uma imagem baseada em um template e variáveis',
      tags: ['Geração'],
      body: {
        type: 'object',
        required: ['template', 'variables'],
        properties: {
          template: { 
            type: 'string', 
            description: 'ID do template a ser usado',
            examples: ['instagram-feed-basico', 'instagram-feed-quadrado']
          },
          variables: { 
            type: 'object', 
            description: 'Variáveis para substituir no template',
            examples: [{ titulo: 'Meu Post', subtitulo: 'Descrição do post' }]
          },
          format: { 
            type: 'string', 
            enum: ['png', 'jpeg', 'webp'], 
            default: 'png',
            description: 'Formato da imagem de saída'
          },
          quality: { 
            type: 'number', 
            minimum: 1, 
            maximum: 100, 
            default: 90,
            description: 'Qualidade da imagem (1-100)'
          },
          returnBase64: { 
            type: 'boolean', 
            default: false,
            description: 'Se deve retornar a imagem em base64'
          },
          webhook: { 
            type: 'string', 
            format: 'uri',
            description: 'URL do webhook para notificação (opcional)'
          }
        }
      },
      response: {
        200: {
          description: 'Imagem gerada com sucesso',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            imageUrl: { type: 'string' },
            imageBase64: { type: 'string' }
          }
        },
        404: {
          description: 'Template não encontrado',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        },
        500: {
          description: 'Erro interno do servidor',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (request, reply) => {
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
  fastify.post('/generate/batch', {
    schema: {
      description: 'Gera múltiplas imagens em lote (em desenvolvimento)',
      tags: ['Geração'],
      body: {
        type: 'object',
        properties: {
          requests: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                template: { type: 'string' },
                variables: { type: 'object' }
              }
            }
          }
        }
      },
      response: {
        501: {
          description: 'Funcionalidade não implementada',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            error: { type: 'string' }
          }
        }
      }
    }
  }, async (_request, reply) => {
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
  }>('/validate', {
    schema: {
      description: 'Valida se as variáveis fornecidas são compatíveis com o template',
      tags: ['Validação'],
      body: {
        type: 'object',
        required: ['template', 'variables'],
        properties: {
          template: { 
            type: 'string', 
            description: 'ID do template a ser validado',
            examples: ['instagram-feed-basico']
          },
          variables: { 
            type: 'object', 
            description: 'Variáveis para validar'
          }
        }
      },
      response: {
        200: {
          description: 'Resultado da validação',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            errors: { 
              type: 'array', 
              items: { type: 'string' },
              description: 'Lista de erros de validação (se houver)'
            }
          }
        }
      }
    }
  }, async (request, reply) => {
    const { template, variables } = request.body;
    
    const validation = templateService.validateVariables(template, variables);
    
    return reply.send({
      success: validation.valid,
      errors: validation.errors,
    });
  });
  
  // Health check
  fastify.get('/health', {
    schema: {
      description: 'Verifica o status de saúde da API',
      tags: ['Sistema'],
      response: {
        200: {
          description: 'Status da API',
          type: 'object',
          properties: {
            status: { 
              type: 'string', 
              enum: ['ok'],
              description: 'Status atual da API'
            },
            timestamp: { 
              type: 'string', 
              format: 'date-time',
              description: 'Timestamp da verificação'
            }
          }
        }
      }
    }
  }, async (_request, reply) => {
    return reply.send({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });
}; 
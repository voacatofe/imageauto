import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import staticPlugin from '@fastify/static';
import { config } from './config/index.js';
import { generateRoutes } from './routes/generate.routes.js';
import { join } from 'path';

// Configuração do logger
const fastify = Fastify({
  logger: config.env === 'production' 
    ? { level: config.logging.level }
    : true,
});

// Função principal de inicialização
async function start() {
  try {
    // Registrar plugins
    await fastify.register(cors, {
      origin: true, // Permite qualquer origem (ajuste conforme necessário)
      credentials: true,
    });
    
    await fastify.register(multipart, {
      limits: {
        fileSize: config.limits.maxFileSize,
      },
    });
    
    // Servir arquivos estáticos
    await fastify.register(staticPlugin, {
      root: join(process.cwd(), 'public'),
      prefix: '/',
    });
    
    // Middleware de rate limiting (simplificado)
    fastify.addHook('onRequest', async (request, _reply) => {
      // TODO: Implementar rate limiting real com Redis
      fastify.log.info(`${request.method} ${request.url}`);
    });
    
    // Middleware de autenticação (se habilitado)
    if (config.apiKeys.enabled) {
      fastify.addHook('onRequest', async (request, reply) => {
        // Pular autenticação para health check e arquivos estáticos
        if (request.url === '/health' || !request.url.startsWith(config.apiPrefix)) {
          return;
        }
        
        const apiKey = request.headers['x-api-key'] as string;
        if (!apiKey || !config.apiKeys.keys.includes(apiKey)) {
          return reply.status(401).send({
            success: false,
            error: 'API key inválida ou ausente',
          });
        }
      });
    }
    
    // Registrar rotas
    await fastify.register(generateRoutes, { prefix: config.apiPrefix });
    
    // Rota raiz
    fastify.get('/', async (_request, reply) => {
      return reply.send({
        name: 'ImageAuto',
        version: '1.0.0',
        description: 'Sistema de geração automatizada de templates para mídias sociais',
        documentation: `${config.baseUrl}${config.apiPrefix}/docs`,
        endpoints: {
          health: `${config.baseUrl}${config.apiPrefix}/health`,
          templates: `${config.baseUrl}${config.apiPrefix}/templates`,
          generate: `${config.baseUrl}${config.apiPrefix}/generate`,
          validate: `${config.baseUrl}${config.apiPrefix}/validate`,
        },
      });
    });
    
    // Tratamento de erros global
    fastify.setErrorHandler((error, _request, reply) => {
      fastify.log.error(error);
      
      // Não expor detalhes do erro em produção
      if (config.env === 'production') {
        return reply.status(500).send({
          success: false,
          error: 'Erro interno do servidor',
        });
      }
      
      return reply.status(500).send({
        success: false,
        error: error.message,
        stack: error.stack,
      });
    });
    
    // Iniciar servidor
    await fastify.listen({
      port: config.port,
      host: config.host,
    });
    
    fastify.log.info(`Servidor rodando em ${config.baseUrl}`);
    fastify.log.info(`Documentação disponível em ${config.baseUrl}${config.apiPrefix}/docs`);
    
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Tratamento de sinais para shutdown gracioso
process.on('SIGINT', async () => {
  fastify.log.info('SIGINT recebido, encerrando servidor...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('SIGTERM recebido, encerrando servidor...');
  await fastify.close();
  process.exit(0);
});

// Iniciar aplicação
start(); 
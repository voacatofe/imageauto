import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Servidor
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',
  
  // URLs
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  
  // Cache
  cache: {
    enabled: process.env.CACHE_ENABLED === 'true',
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },
  
  // Redis
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  // Storage
  storage: {
    type: process.env.STORAGE_TYPE || 'local',
    s3: {
      bucket: process.env.S3_BUCKET,
      region: process.env.S3_REGION,
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  },
  
  // Limites
  limits: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10), // 10MB
    rateLimit: {
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
      window: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutos
    },
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  
  // N8N
  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL,
  },
  
  // API Keys
  apiKeys: {
    enabled: process.env.API_KEY_ENABLED === 'true',
    keys: process.env.API_KEYS?.split(',') || [],
  },
};

// Templates padrão disponíveis
export const TEMPLATES = {
  // Feed Instagram (4:5 - Novo padrão)
  'instagram-feed-basico': {
    id: 'instagram-feed-basico',
    nome: 'Feed Instagram Básico',
    descricao: 'Template básico para posts do feed do Instagram (4:5)',
    tipo: 'feed' as const,
    largura: 1080,
    altura: 1350,
    redeSocial: 'instagram' as const,
    variaveisObrigatorias: ['titulo'],
    variaveisOpcionais: ['subtitulo', 'imagemFundo', 'logo', 'corPrimaria', 'corSecundaria'],
  },
  
  // Feed Instagram Quadrado (1:1 - Formato clássico)
  'instagram-feed-quadrado': {
    id: 'instagram-feed-quadrado',
    nome: 'Feed Instagram Quadrado',
    descricao: 'Template quadrado para posts do feed do Instagram (1:1)',
    tipo: 'feed' as const,
    largura: 1080,
    altura: 1080,
    redeSocial: 'instagram' as const,
    variaveisObrigatorias: ['titulo'],
    variaveisOpcionais: ['subtitulo', 'imagemFundo', 'logo', 'corPrimaria', 'corSecundaria'],
  },
  
  // Stories Instagram
  'instagram-stories-basico': {
    id: 'instagram-stories-basico',
    nome: 'Stories Instagram Básico',
    descricao: 'Template básico para stories do Instagram',
    tipo: 'stories' as const,
    largura: 1080,
    altura: 1920,
    redeSocial: 'instagram' as const,
    variaveisObrigatorias: ['titulo'],
    variaveisOpcionais: ['subtitulo', 'imagemFundo', 'logo', 'cta', 'corPrimaria'],
  },
  
  // Feed Facebook
  'facebook-feed-link': {
    id: 'facebook-feed-link',
    nome: 'Feed Facebook Link',
    descricao: 'Template para compartilhamento de links no Facebook',
    tipo: 'feed' as const,
    largura: 1200,
    altura: 630,
    redeSocial: 'facebook' as const,
    variaveisObrigatorias: ['titulo', 'descricao'],
    variaveisOpcionais: ['imagemFundo', 'logo', 'autor', 'data'],
  },
  
  // LinkedIn
  'linkedin-post': {
    id: 'linkedin-post',
    nome: 'Post LinkedIn',
    descricao: 'Template para posts no LinkedIn',
    tipo: 'feed' as const,
    largura: 1200,
    altura: 627,
    redeSocial: 'linkedin' as const,
    variaveisObrigatorias: ['titulo'],
    variaveisOpcionais: ['subtitulo', 'autor', 'empresa', 'logo'],
  },
}; 
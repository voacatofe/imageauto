# 🚀 Deploy no EasyPanel - Guia Completo

Este guia te ajudará a fazer o deploy do ImageAuto no EasyPanel usando Docker Compose.

## 📋 Pré-requisitos

1. **Servidor com EasyPanel instalado**
2. **Repositório Git** (GitHub, GitLab, etc.) com o código
3. **Domínio configurado** (opcional, mas recomendado)

## 🔧 Passos para Deploy

### 1. Preparar o Repositório

Certifique-se de que seu repositório tenha:
- ✅ `docker-compose.yml` (já otimizado para EasyPanel)
- ✅ `Dockerfile` 
- ✅ Código fonte completo

### 2. Criar Serviço no EasyPanel

1. **Acesse o EasyPanel**
2. **Clique em "+ Service"**
3. **Selecione "Compose"**
4. **Configure o Source:**

#### Opção A: Via Git Repository
```
Repository URL: https://github.com/seu-usuario/imageauto
Branch: main
```

#### Opção B: Via Upload do docker-compose.yml
- Cole o conteúdo do `docker-compose.yml` diretamente

### 3. Configurar Variáveis de Ambiente

No EasyPanel, adicione estas variáveis de ambiente:

```env
# Configurações Básicas
NODE_ENV=production
BASE_URL=https://seu-dominio.com
API_PREFIX=/api/v1

# Cache e Performance
CACHE_ENABLED=true
CACHE_TTL=3600
REDIS_URL=redis://redis:6379

# Limites e Segurança
MAX_FILE_SIZE=10485760
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=900000

# Logs
LOG_LEVEL=info

# Opcional: API Keys
API_KEY_ENABLED=false
# API_KEYS=sua-chave-1,sua-chave-2

# Opcional: Storage S3
# STORAGE_TYPE=s3
# S3_BUCKET=imageauto-assets
# S3_REGION=us-east-1
# S3_ACCESS_KEY_ID=sua-access-key
# S3_SECRET_ACCESS_KEY=seu-secret-key

# Opcional: N8N Webhook
# N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/callback
```

### 4. Configurar Domínio

1. **Vá para a aba "Domains"**
2. **Clique em "Add Domain"**
3. **Configure:**
   ```
   Domain: seu-dominio.com
   Container: app
   Port: 3000
   ```
4. **Ative SSL automático** (recomendado)

### 5. Deploy e Verificação

1. **Clique em "Deploy"**
2. **Aguarde o build e inicialização** (pode levar alguns minutos)
3. **Verifique os logs** na aba "Logs"
4. **Teste a aplicação:**
   ```bash
   curl https://seu-dominio.com/api/v1/health
   ```

## 📊 Monitoramento

### Health Checks
O EasyPanel monitora automaticamente a saúde dos containers através dos health checks configurados:

- **App**: Verifica endpoint `/api/v1/health` a cada 30s
- **Redis**: Verifica comando `redis-cli ping` a cada 30s

### Logs
Acesse os logs através da interface do EasyPanel:
- **Logs da aplicação**: Container `app`
- **Logs do Redis**: Container `redis`

### Recursos
Monitor de uso no dashboard do EasyPanel:
- CPU e Memória
- Network I/O
- Storage usage

## 🔧 Configurações Avançadas

### Volumes Persistentes
O docker-compose.yml já está configurado com volumes persistentes:

```yaml
volumes:
  - generated-images:/app/public/generated  # Imagens geradas
  - fonts-data:/app/public/fonts           # Fontes customizadas
  - redis-data:/data                       # Dados do Redis
```

### Scaling (Opcional)
Para aumentar a capacidade, você pode escalar o serviço:

1. Edite o `docker-compose.yml`
2. Adicione:
   ```yaml
   services:
     app:
       deploy:
         replicas: 3  # Número de instâncias
   ```

### Backup
Configure backup automático no EasyPanel:
1. Vá para "Backups"
2. Configure backup dos volumes
3. Defina frequência (diário/semanal)

## 🐛 Troubleshooting

### App não inicia
1. **Verifique os logs**: Container `app`
2. **Problemas comuns:**
   - Falta de fonte: Adicione fonte em `/app/public/fonts/`
   - Variáveis de ambiente incorretas
   - Erro de build: Verifique Dockerfile

### Redis não conecta
1. **Verifique logs do Redis**
2. **Teste conectividade:**
   ```bash
   # No container app
   redis-cli -h redis ping
   ```

### Imagens não são geradas
1. **Verifique permissões** do volume `generated-images`
2. **Teste endpoint:**
   ```bash
   curl -X POST https://seu-dominio.com/api/v1/generate \
     -H "Content-Type: application/json" \
     -d '{
       "template": "instagram-feed-basico",
       "variables": {"titulo": "Teste"}
     }'
   ```

### Performance lenta
1. **Aumente recursos** no EasyPanel
2. **Configure cache Redis**
3. **Otimize templates** (fontes menores, menos elementos)

## 📝 Exemplo de Configuração Completa

```yaml
# Configuração final no EasyPanel
Environment Variables:
  NODE_ENV: production
  BASE_URL: https://imageauto.meudominio.com
  CACHE_ENABLED: true
  REDIS_URL: redis://redis:6379
  LOG_LEVEL: info

Domain Configuration:
  Domain: imageauto.meudominio.com
  Container: app
  Port: 3000
  SSL: Enabled (Auto)

Resources:
  CPU: 1 vCPU
  Memory: 1GB
  Storage: 20GB
```

## 🔗 Links Úteis

- **EasyPanel Docs**: https://easypanel.io/docs
- **Docker Compose Spec**: https://docs.docker.com/compose/
- **Traefik (usado pelo EasyPanel)**: https://doc.traefik.io/traefik/

## 🆘 Suporte

Se encontrar problemas:

1. **Verifique logs** no EasyPanel
2. **Consulte documentação** oficial do EasyPanel
3. **Issues GitHub**: Para problemas específicos do ImageAuto
4. **Community EasyPanel**: Discord/Forum oficial

---

**✅ Após seguir este guia, seu ImageAuto estará rodando no EasyPanel e pronto para integrar com N8N!** 
# ImageAuto - Gerador de Templates para Mídias Sociais

Sistema automatizado de geração de imagens para mídias sociais com integração nativa ao N8N, baseado em Satori.

## 🚀 Características

- ✅ Geração dinâmica de imagens para feed e stories
- ✅ Templates pré-configurados para Instagram, Facebook, LinkedIn e Twitter
- ✅ API REST para integração fácil com N8N
- ✅ Suporte a variáveis customizáveis
- ✅ Cache inteligente de imagens
- ✅ Deploy otimizado para EasyPanel
- ✅ Múltiplos formatos de saída (PNG, JPEG, WebP)

## 📋 Pré-requisitos

- Node.js 18+ 
- NPM ou Yarn
- Redis (opcional, para cache distribuído)

## 🛠️ Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/imageauto.git
cd imageauto
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Adicione fontes (opcional)
```bash
# Baixe a fonte Roboto ou outra de sua preferência
# Coloque em public/fonts/
```

## 🚀 Executando

### Desenvolvimento Local

#### Opção 1: Node.js Direto
```bash
npm run dev
```

#### Opção 2: Docker (Recomendado)
```bash
# Primeira vez
npm run docker:dev:build

# Próximas execuções
npm run docker:dev

# Parar
npm run docker:dev:down
```

### Produção
```bash
# Build e start local
npm run build
npm start

# Ou via Docker
npm run docker:prod:build
```

## 📡 API Endpoints

### Listar Templates Disponíveis
```http
GET /api/v1/templates
```

### Gerar Imagem
```http
POST /api/v1/generate
Content-Type: application/json

{
  "template": "instagram-feed-basico",
  "variables": {
    "titulo": "Promoção Black Friday",
    "subtitulo": "Até 70% OFF",
    "corPrimaria": "#FF6B6B",
    "corSecundaria": "#4ECDC4"
  },
  "format": "png",
  "quality": 90,
  "returnBase64": false
}
```

**Exemplo com formato quadrado:**
```http
POST /api/v1/generate
Content-Type: application/json

{
  "template": "instagram-feed-quadrado",
  "variables": {
    "titulo": "Post Quadrado",
    "subtitulo": "Formato 1:1",
    "corPrimaria": "#E4405F",
    "corSecundaria": "#FFFFFF"
  }
}
```

### Validar Template
```http
POST /api/v1/validate
Content-Type: application/json

{
  "template": "instagram-feed-basico",
  "variables": {
    "titulo": "Teste"
  }
}
```

## 🔧 Integração com N8N

### Método 1: HTTP Request Node

1. Adicione um nó HTTP Request no N8N
2. Configure:
   - **Method**: POST
   - **URL**: `https://seu-dominio.com/api/v1/generate`
   - **Authentication**: None (ou API Key se configurado)
   - **Body Content Type**: JSON
   - **Body**:
   ```json
   {
     "template": "instagram-feed-basico",
     "variables": {
       "titulo": "{{ $json.titulo }}",
       "subtitulo": "{{ $json.subtitulo }}",
       "corPrimaria": "{{ $json.cor }}"
     }
   }
   ```

### Método 2: Webhook para Processamento Assíncrono

Configure o webhook no corpo da requisição:
```json
{
  "template": "instagram-feed-basico",
  "variables": { ... },
  "webhook": "https://seu-n8n.com/webhook/abc123"
}
```

## 🎨 Templates Disponíveis

### Instagram Feed (1080x1350 - 4:5)
- ID: `instagram-feed-basico`
- Variáveis obrigatórias: `titulo`
- Variáveis opcionais: `subtitulo`, `imagemFundo`, `logo`, `corPrimaria`, `corSecundaria`

### Instagram Feed Quadrado (1080x1080 - 1:1)
- ID: `instagram-feed-quadrado`
- Variáveis obrigatórias: `titulo`
- Variáveis opcionais: `subtitulo`, `imagemFundo`, `logo`, `corPrimaria`, `corSecundaria`

### Instagram Stories (1080x1920)
- ID: `instagram-stories-basico`
- Variáveis obrigatórias: `titulo`
- Variáveis opcionais: `subtitulo`, `imagemFundo`, `logo`, `cta`, `corPrimaria`

### Facebook Feed (1200x630)
- ID: `facebook-feed-link`
- Variáveis obrigatórias: `titulo`, `descricao`
- Variáveis opcionais: `imagemFundo`, `logo`, `autor`, `data`

### LinkedIn Post (1200x627)
- ID: `linkedin-post`
- Variáveis obrigatórias: `titulo`
- Variáveis opcionais: `subtitulo`, `autor`, `empresa`, `logo`

## 🐳 Deploy com Docker

### Desenvolvimento Local
```bash
# Com Docker Compose
docker-compose up -d

# Build manual
docker build -t imageauto:latest .
docker run -p 3000:3000 --env-file .env imageauto:latest
```

### Deploy no EasyPanel

**📋 Guia Completo**: Consulte o arquivo [`EASYPANEL-DEPLOY.md`](./EASYPANEL-DEPLOY.md) para instruções detalhadas.

**Resumo Rápido**:
1. **Crie serviço** "Compose" no EasyPanel
2. **Configure repositório Git** ou cole o `docker-compose.yml`
3. **Configure variáveis de ambiente** (BASE_URL, etc.)
4. **Configure domínio** e SSL automático
5. **Deploy** e monitore logs

```yaml
# docker-compose.yml já otimizado para EasyPanel
services:
  app:
    ports: ["3000"]  # Apenas porta de serviço
    environment:
      - NODE_ENV=production
      - BASE_URL=https://seu-dominio.com
    volumes:
      - generated-images:/app/public/generated
```

## 🔐 Segurança

### Habilitando API Keys

1. Configure no `.env`:
```env
API_KEY_ENABLED=true
API_KEYS=sua-chave-secreta-1,sua-chave-secreta-2
```

2. Use nas requisições:
```http
POST /api/v1/generate
X-API-Key: sua-chave-secreta-1
```

## 📈 Escalabilidade

### Cache com Redis

1. Configure Redis no `.env`:
```env
REDIS_URL=redis://seu-redis:6379
CACHE_ENABLED=true
```

### Storage em S3

1. Configure S3 no `.env`:
```env
STORAGE_TYPE=s3
S3_BUCKET=imageauto-assets
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=sua-key
S3_SECRET_ACCESS_KEY=seu-secret
```

## 🛠️ Desenvolvimento

### Criando Novos Templates

1. Crie o arquivo em `src/templates/meu-template.tsx`
2. Registre em `src/config/index.ts`
3. Adicione o caso no switch de `src/services/template.service.ts`

### Estrutura do Projeto
```
imageAuto/
├── src/
│   ├── config/         # Configurações
│   ├── routes/         # Rotas da API
│   ├── services/       # Lógica de negócio
│   ├── templates/      # Templates de imagem
│   ├── types/          # TypeScript types
│   └── index.ts        # Entry point
├── public/
│   ├── fonts/          # Fontes customizadas
│   └── generated/      # Imagens geradas
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 📝 Licença

MIT

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

- Issues: [GitHub Issues](https://github.com/seu-usuario/imageauto/issues)
- Email: seu-email@exemplo.com 
# Script de configuração inicial para ImageAuto
Write-Host "=== ImageAuto Setup ===" -ForegroundColor Cyan

# Verificar se Node.js está instalado
Write-Host "`nVerificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js $nodeVersion encontrado ✓" -ForegroundColor Green
} catch {
    Write-Host "Node.js não encontrado! Por favor, instale Node.js 18+" -ForegroundColor Red
    exit 1
}

# Instalar dependências
Write-Host "`nInstalando dependências..." -ForegroundColor Yellow
npm install

# Criar arquivo .env se não existir
if (!(Test-Path .env)) {
    Write-Host "`nCriando arquivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Arquivo .env criado ✓" -ForegroundColor Green
} else {
    Write-Host "`nArquivo .env já existe ✓" -ForegroundColor Green
}

# Criar diretórios necessários
Write-Host "`nCriando diretórios..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path public/fonts | Out-Null
New-Item -ItemType Directory -Force -Path public/generated | Out-Null
Write-Host "Diretórios criados ✓" -ForegroundColor Green

# Tentar baixar fonte Roboto
Write-Host "`nBaixando fonte Roboto..." -ForegroundColor Yellow
try {
    $fontUrl = "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf"
    $fontPath = "public/fonts/Roboto-Regular.ttf"
    
    if (!(Test-Path $fontPath)) {
        Invoke-WebRequest -Uri $fontUrl -OutFile $fontPath -UseBasicParsing
        Write-Host "Fonte Roboto baixada ✓" -ForegroundColor Green
    } else {
        Write-Host "Fonte Roboto já existe ✓" -ForegroundColor Green
    }
} catch {
    Write-Host "Não foi possível baixar a fonte automaticamente" -ForegroundColor Red
    Write-Host "Por favor, baixe manualmente de: https://fonts.google.com/specimen/Roboto" -ForegroundColor Yellow
}

# Build inicial
Write-Host "`nCompilando TypeScript..." -ForegroundColor Yellow
npm run build

Write-Host "`n=== Setup Concluído! ===" -ForegroundColor Green
Write-Host "`nPara iniciar o servidor de desenvolvimento:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nPara iniciar em produção:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host "`nAcesse: http://localhost:3000" -ForegroundColor Yellow 
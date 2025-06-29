# Script para testar a API do ImageAuto
param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$Template = "instagram-feed-basico"
)

Write-Host "=== Testando API do ImageAuto ===" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow

# Teste 1: Health Check
Write-Host "`n1. Testando Health Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "$BaseUrl/api/v1/health" -Method GET
    Write-Host "✓ Health Check OK" -ForegroundColor Green
    Write-Host "Response: $($healthResponse | ConvertTo-Json)" -ForegroundColor White
} catch {
    Write-Host "✗ Health Check falhou: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Teste 2: Listar Templates
Write-Host "`n2. Listando templates disponíveis..." -ForegroundColor Yellow
try {
    $templatesResponse = Invoke-RestMethod -Uri "$BaseUrl/api/v1/templates" -Method GET
    Write-Host "✓ Templates listados com sucesso" -ForegroundColor Green
    Write-Host "Templates disponíveis:" -ForegroundColor White
    foreach ($template in $templatesResponse.data) {
        Write-Host "  - $($template.id): $($template.nome)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "✗ Erro ao listar templates: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Teste 3: Validar Template
Write-Host "`n3. Validando template '$Template'..." -ForegroundColor Yellow
$validateBody = @{
    template = $Template
    variables = @{
        titulo = "Teste API"
    }
} | ConvertTo-Json -Depth 3

try {
    $validateResponse = Invoke-RestMethod -Uri "$BaseUrl/api/v1/validate" -Method POST -Body $validateBody -ContentType "application/json"
    if ($validateResponse.success) {
        Write-Host "✓ Template validado com sucesso" -ForegroundColor Green
    } else {
        Write-Host "⚠ Template inválido: $($validateResponse.errors -join ', ')" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Erro na validação: $($_.Exception.Message)" -ForegroundColor Red
}

# Teste 4: Gerar Imagem
Write-Host "`n4. Gerando imagem..." -ForegroundColor Yellow
$generateBody = @{
    template = $Template
    variables = @{
        titulo = "🚀 ImageAuto"
        subtitulo = "Teste da API funcionando!"
        corPrimaria = "#FF6B6B"
        corSecundaria = "#4ECDC4"
    }
    format = "png"
    quality = 90
} | ConvertTo-Json -Depth 3

try {
    $generateResponse = Invoke-RestMethod -Uri "$BaseUrl/api/v1/generate" -Method POST -Body $generateBody -ContentType "application/json"
    if ($generateResponse.success) {
        Write-Host "✓ Imagem gerada com sucesso!" -ForegroundColor Green
        Write-Host "URL da imagem: $($generateResponse.imageUrl)" -ForegroundColor Cyan
        
        # Tentar abrir a imagem no navegador
        if ($generateResponse.imageUrl) {
            try {
                Start-Process $generateResponse.imageUrl
                Write-Host "🌐 Imagem aberta no navegador" -ForegroundColor Green
            } catch {
                Write-Host "⚠ Não foi possível abrir a imagem automaticamente" -ForegroundColor Yellow
            }
        }
    } else {
        Write-Host "✗ Erro na geração: $($generateResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "✗ Erro ao gerar imagem: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Body enviado: $generateBody" -ForegroundColor Yellow
}

Write-Host "`n=== Teste da API Concluído ===" -ForegroundColor Cyan

# Exemplos de uso
Write-Host "`n📚 Exemplos de uso:" -ForegroundColor Yellow
Write-Host "# Testar com template específico:" -ForegroundColor White
Write-Host "  .\scripts\test-api.ps1 -Template 'instagram-feed-quadrado'" -ForegroundColor Cyan
Write-Host "# Testar em ambiente remoto:" -ForegroundColor White  
Write-Host "  .\scripts\test-api.ps1 -BaseUrl 'https://seu-dominio.com'" -ForegroundColor Cyan 
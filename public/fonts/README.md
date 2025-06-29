# Fontes

Este diretório deve conter as fontes que serão usadas nos templates.

## Como adicionar fontes

1. Baixe a fonte desejada (recomendamos Roboto do Google Fonts)
2. Coloque o arquivo .ttf ou .otf neste diretório
3. Atualize o arquivo `src/services/render.service.ts` para carregar a nova fonte

## Fontes recomendadas

- **Roboto**: https://fonts.google.com/specimen/Roboto
- **Inter**: https://fonts.google.com/specimen/Inter
- **Open Sans**: https://fonts.google.com/specimen/Open+Sans

## Baixar Roboto manualmente

```bash
# Windows PowerShell
Invoke-WebRequest -Uri "https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf" -OutFile "Roboto-Regular.ttf"

# Linux/Mac
wget https://github.com/google/fonts/raw/main/apache/roboto/Roboto-Regular.ttf
``` 
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { readFile } from 'fs/promises';
import { join } from 'path';
import React from 'react';
import type { Font, TemplateVariables } from '../types/index.js';

export class RenderService {
  private fonts: Font[] = [];
  
  async loadFonts() {
    try {
      // Carregando fonte padrão (você pode adicionar suas fontes aqui)
      const fontPath = join(process.cwd(), 'public', 'fonts', 'Roboto-Regular.ttf');
      const fontData = await readFile(fontPath);
      
      this.fonts = [
        {
          name: 'Roboto',
          data: fontData,
          weight: 400,
          style: 'normal',
        },
      ];
    } catch (error) {
      console.warn('Fonte padrão não encontrada, usando fonte do sistema');
      // Você pode fazer fallback para uma fonte web aqui
    }
  }
  
  async renderToSvg(
    element: React.ReactElement,
    options: {
      width: number;
      height: number;
      fonts?: Font[];
      debug?: boolean;
    }
  ): Promise<string> {
    const svg = await satori(element, {
      width: options.width,
      height: options.height,
      fonts: options.fonts || this.fonts,
      debug: options.debug,
    });
    
    return svg;
  }
  
  async renderToImage(
    element: React.ReactElement,
    options: {
      width: number;
      height: number;
      format?: 'png' | 'jpeg' | 'webp';
      quality?: number;
      fonts?: Font[];
      debug?: boolean;
    }
  ): Promise<Buffer> {
    // Renderizar para SVG primeiro
    const svg = await this.renderToSvg(element, options);
    
    // Converter SVG para PNG usando resvg
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: options.width,
      },
    });
    
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    
    // Se o formato solicitado for PNG, retornar direto
    if (!options.format || options.format === 'png') {
      return Buffer.from(pngBuffer);
    }
    
    // Converter para outros formatos usando sharp
    const sharpInstance = sharp(pngBuffer);
    
    switch (options.format) {
      case 'jpeg':
        return sharpInstance
          .jpeg({ quality: options.quality || 90 })
          .toBuffer();
      
      case 'webp':
        return sharpInstance
          .webp({ quality: options.quality || 90 })
          .toBuffer();
      
      default:
        return Buffer.from(pngBuffer);
    }
  }
  
  // Método auxiliar para processar variáveis de template
  processVariables(variables: TemplateVariables): TemplateVariables {
    // Processar cores (garantir formato válido)
    const processed = { ...variables };
    
    // Adicionar # se não tiver nas cores
    ['corPrimaria', 'corSecundaria', 'corTexto'].forEach(key => {
      if (processed[key] && !processed[key].startsWith('#')) {
        processed[key] = `#${processed[key]}`;
      }
    });
    
    // Processar data se fornecida
    if (processed.data && typeof processed.data === 'string') {
      try {
        const date = new Date(processed.data);
        processed.dataFormatada = date.toLocaleDateString('pt-BR');
      } catch {
        processed.dataFormatada = processed.data;
      }
    }
    
    return processed;
  }
} 
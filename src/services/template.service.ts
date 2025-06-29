import React from 'react';
import { TEMPLATES } from '../config/index.js';
import type { TemplateConfig, TemplateVariables } from '../types/index.js';
import { InstagramFeedBasico } from '../templates/instagram-feed-basico.js';
import { InstagramFeedQuadrado } from '../templates/instagram-feed-quadrado.js';

export class TemplateService {
  private templates: Map<string, TemplateConfig> = new Map();
  
  constructor() {
    // Registrar templates padrão
    Object.values(TEMPLATES).forEach(template => {
      this.templates.set(template.id, template);
    });
  }
  
  // Obter lista de templates disponíveis
  getTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }
  
  // Obter template por ID
  getTemplate(id: string): TemplateConfig | undefined {
    return this.templates.get(id);
  }
  
  // Validar variáveis do template
  validateVariables(templateId: string, variables: TemplateVariables): {
    valid: boolean;
    errors: string[];
  } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { valid: false, errors: ['Template não encontrado'] };
    }
    
    const errors: string[] = [];
    
    // Verificar variáveis obrigatórias
    template.variaveisObrigatorias.forEach(varName => {
      if (!variables[varName]) {
        errors.push(`Variável obrigatória ausente: ${varName}`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  // Renderizar template
  renderTemplate(templateId: string, variables: TemplateVariables): React.ReactElement | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error('Template não encontrado');
    }
    
    // Validar variáveis
    const validation = this.validateVariables(templateId, variables);
    if (!validation.valid) {
      throw new Error(`Erro de validação: ${validation.errors.join(', ')}`);
    }
    
    // Mapear ID do template para componente React
    switch (templateId) {
      case 'instagram-feed-basico':
        return React.createElement(InstagramFeedBasico, { variables });
      
      case 'instagram-feed-quadrado':
        return React.createElement(InstagramFeedQuadrado, { variables });
      
      case 'instagram-stories-basico':
        // TODO: Criar template de stories
        return React.createElement(InstagramStoriesBasico, { variables });
      
      case 'facebook-feed-link':
        // TODO: Criar template Facebook
        return React.createElement(FacebookFeedLink, { variables });
      
      case 'linkedin-post':
        // TODO: Criar template LinkedIn
        return React.createElement(LinkedInPost, { variables });
      
      default:
        throw new Error(`Template ${templateId} não possui implementação`);
    }
  }
  
  // Adicionar template customizado (para futuro)
  addCustomTemplate(template: TemplateConfig): void {
    this.templates.set(template.id, template);
  }
}

// Componentes temporários (você deve criar arquivos separados para cada um)
const InstagramStoriesBasico = ({ variables }: { variables: TemplateVariables }) => {
  const {
    titulo = 'Título',
    subtitulo = '',
    cta = 'Saiba Mais',
    corPrimaria = '#E4405F',
    corSecundaria = '#FFFFFF',
  } = variables;
  
  return React.createElement('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px',
      backgroundColor: corPrimaria,
      color: corSecundaria,
    }
  }, [
    React.createElement('h1', {
      key: 'titulo',
      style: { fontSize: '64px', margin: 0 }
    }, titulo),
    subtitulo && React.createElement('p', {
      key: 'subtitulo',
      style: { fontSize: '32px', margin: 0 }
    }, subtitulo),
    cta && React.createElement('div', {
      key: 'cta',
      style: {
        backgroundColor: corSecundaria,
        color: corPrimaria,
        padding: '20px 40px',
        borderRadius: '50px',
        fontSize: '28px',
        fontWeight: 'bold',
        alignSelf: 'center',
      }
    }, cta)
  ]);
};

const FacebookFeedLink = ({ variables }: { variables: TemplateVariables }) => {
  const { titulo = 'Título', descricao = '' } = variables;
  return React.createElement('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '60px',
      backgroundColor: '#FFFFFF',
    }
  }, [
    React.createElement('h1', { key: 'titulo', style: { fontSize: '48px' } }, titulo),
    React.createElement('p', { key: 'desc', style: { fontSize: '24px' } }, descricao),
  ]);
};

const LinkedInPost = ({ variables }: { variables: TemplateVariables }) => {
  const { titulo = 'Título', autor = '' } = variables;
  return React.createElement('div', {
    style: {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '60px',
      backgroundColor: '#0077B5',
      color: '#FFFFFF',
    }
  }, [
    React.createElement('h1', { key: 'titulo', style: { fontSize: '48px' } }, titulo),
    autor && React.createElement('p', { key: 'autor', style: { fontSize: '24px' } }, autor),
  ]);
}; 
// Tipos para templates de mídias sociais
export interface TemplateVariables {
  titulo?: string;
  subtitulo?: string;
  texto?: string;
  imagemFundo?: string;
  logo?: string;
  corPrimaria?: string;
  corSecundaria?: string;
  corTexto?: string;
  autor?: string;
  data?: string;
  cta?: string;
  textoRodape?: string;
  [key: string]: any;
}

export interface TemplateConfig {
  id: string;
  nome: string;
  descricao: string;
  tipo: 'feed' | 'stories';
  largura: number;
  altura: number;
  redeSocial: 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'whatsapp';
  variaveisObrigatorias: string[];
  variaveisOpcionais: string[];
}

export interface GenerateImageRequest {
  template: string;
  variables: TemplateVariables;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  webhook?: string;
  returnBase64?: boolean;
}

export interface GenerateImageResponse {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  jobId?: string;
}

export interface BatchGenerateRequest {
  template: string;
  items: TemplateVariables[];
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
  webhook?: string;
}

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export interface Font {
  name: string;
  data: Buffer | ArrayBuffer;
  weight?: FontWeight;
  style?: 'normal' | 'italic';
} 
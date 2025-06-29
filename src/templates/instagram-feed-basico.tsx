import React from 'react';
import type { TemplateVariables } from '../types/index.js';

export const InstagramFeedBasico = ({ variables }: { variables: TemplateVariables }) => {
  const {
    titulo = 'Título do Post',
    subtitulo = '',
    imagemFundo = '',
    logo = '',
    corPrimaria = '#E4405F', // Cor do Instagram
    corSecundaria = '#FFFFFF',
    corTexto = '#262626',
  } = variables;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: corSecundaria,
        backgroundImage: imagemFundo ? `url(${imagemFundo})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      {/* Overlay para melhorar legibilidade */}
      {imagemFundo && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
          }}
        />
      )}
      
      {/* Conteúdo */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '100px 60px',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        {/* Logo */}
        {logo && (
          <img
            src={logo}
            style={{
              width: '140px',
              height: '140px',
              objectFit: 'contain',
              marginBottom: '50px',
            }}
          />
        )}
        
        {/* Título */}
        <h1
          style={{
            fontSize: '80px',
            fontWeight: 'bold',
            color: corPrimaria,
            margin: 0,
            marginBottom: '30px',
            lineHeight: 1.1,
            maxWidth: '960px',
            wordBreak: 'break-word',
          }}
        >
          {titulo}
        </h1>
        
        {/* Subtítulo */}
        {subtitulo && (
          <p
            style={{
              fontSize: '42px',
              color: corTexto,
              margin: 0,
              lineHeight: 1.3,
              maxWidth: '860px',
              wordBreak: 'break-word',
            }}
          >
            {subtitulo}
          </p>
        )}
      </div>
      
      {/* Rodapé decorativo */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: corPrimaria,
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: corPrimaria,
            opacity: 0.6,
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: corPrimaria,
            opacity: 0.3,
          }}
        />
      </div>
    </div>
  );
}; 
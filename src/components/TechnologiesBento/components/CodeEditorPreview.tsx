import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useTypewriter } from '../hooks/useTypewriter';

export const CodeEditorPreview: React.FC = () => {
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  // Textos completos de cada línea de código
  const codeLines = [
    "import { Controller, Get, Post } from '@nestjs/common';",
    "import { AppService } from './app.service';",
    "",
    "@Controller('api')",
    "export class AppController {",
    "  constructor(",
    "    private readonly appService: AppService",
    "  ) {}",
    "",
    "  @Get()",
    "  getHello(): string {",
    "    return this.appService.getHello();",
    "  }",
    "}",
  ];

  const { displayedText: line1, isTyping: typing1 } = useTypewriter(codeLines[0], 40, 500);
  const { displayedText: line2, isTyping: typing2 } = useTypewriter(codeLines[1], 40, 2000);
  const { displayedText: line3, isTyping: typing3 } = useTypewriter(codeLines[2], 40, 3500);
  const { displayedText: line4, isTyping: typing4 } = useTypewriter(codeLines[3], 40, 4000);
  const { displayedText: line5, isTyping: typing5 } = useTypewriter(codeLines[4], 40, 5500);
  const { displayedText: line6, isTyping: typing6 } = useTypewriter(codeLines[5], 40, 7000);
  const { displayedText: line7, isTyping: typing7 } = useTypewriter(codeLines[6], 40, 8500);
  const { displayedText: line8, isTyping: typing8 } = useTypewriter(codeLines[7], 40, 10000);
  const { displayedText: line9, isTyping: typing9 } = useTypewriter(codeLines[8], 40, 11500);
  const { displayedText: line10, isTyping: typing10 } = useTypewriter(codeLines[9], 40, 12000);
  const { displayedText: line11, isTyping: typing11 } = useTypewriter(codeLines[10], 40, 13500);
  const { displayedText: line12, isTyping: typing12 } = useTypewriter(codeLines[11], 40, 15000);
  const { displayedText: line13, isTyping: typing13 } = useTypewriter(codeLines[12], 40, 16500);
  const { displayedText: line14, isTyping: typing14 } = useTypewriter(codeLines[13], 40, 18000);

  const isAnyTyping = typing1 || typing2 || typing3 || typing4 || typing5 || typing6 || typing7 || typing8 || typing9 || typing10 || typing11 || typing12 || typing13 || typing14;

  useEffect(() => {
    if (!cursorRef.current) return;
    
    const blinkAnimation = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });

    return () => {
      blinkAnimation.kill();
    };
  }, []);

  // Función para aplicar colores de sintaxis al texto
  const applySyntaxHighlighting = (text: string): React.ReactNode => {
    if (!text) return null;

    const matches: Array<{ index: number; endIndex: number; text: string; type: string }> = [];
    const keywords = ['import', 'from', 'export', 'class', 'constructor', 'private', 'readonly', 'return'];
    const types = ['AppService', 'string'];
    const decorators = ['Controller', 'Get', 'Post'];
    const stringRegex = /'[^']+'/g;

    // Encontrar todas las coincidencias
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ index: match.index, endIndex: match.index + match[0].length, text: match[0], type: 'keyword' });
      }
    });

    types.forEach(type => {
      const regex = new RegExp(`\\b${type}\\b`, 'g');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ index: match.index, endIndex: match.index + match[0].length, text: match[0], type: 'type' });
      }
    });

    decorators.forEach(decorator => {
      const regex = new RegExp(`@${decorator}|\\b${decorator}\\b`, 'g');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push({ index: match.index, endIndex: match.index + match[0].length, text: match[0], type: 'decorator' });
      }
    });

    let match;
    while ((match = stringRegex.exec(text)) !== null) {
      matches.push({ index: match.index, endIndex: match.index + match[0].length, text: match[0], type: 'string' });
    }

    // Ordenar y eliminar solapamientos
    matches.sort((a, b) => a.index - b.index);
    const filteredMatches: typeof matches = [];
    matches.forEach(m => {
      const overlaps = filteredMatches.some(fm => 
        (m.index >= fm.index && m.index < fm.endIndex) ||
        (m.endIndex > fm.index && m.endIndex <= fm.endIndex) ||
        (m.index <= fm.index && m.endIndex >= fm.endIndex)
      );
      if (!overlaps) filteredMatches.push(m);
    });

    // Construir el resultado
    const result: React.ReactNode[] = [];
    let currentPos = 0;

    filteredMatches.forEach((m, idx) => {
      if (m.index > currentPos) {
        result.push(<span key={`text-${currentPos}-${idx}`}>{text.slice(currentPos, m.index)}</span>);
      }
      
      let color = '#1f2937';
      if (m.type === 'keyword') color = '#7c3aed';
      else if (m.type === 'type' || m.type === 'decorator') color = '#2563eb';
      else if (m.type === 'string') color = '#ea580c';
      
      result.push(
        <span key={`${m.type}-${m.index}-${idx}`} style={{ color }}>
          {m.text}
        </span>
      );
      
      currentPos = m.endIndex;
    });

    if (currentPos < text.length) {
      result.push(<span key={`text-end-${currentPos}`}>{text.slice(currentPos)}</span>);
    }

    return result.length > 0 ? <>{result}</> : <span>{text}</span>;
  };

  return (
    <div
      className="absolute bottom-0 right-0 pointer-events-none z-0"
      style={{
        width: 'calc(100% - 2rem)',
        maxWidth: '480px',
        height: 'calc(100% - 1rem)',
        maxHeight: '240px',
        transform: 'translate(-0.5rem, 0)',
      }}
    >
      <div
        className="w-full h-full rounded-lg shadow-xl overflow-hidden"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
        }}
      >
        {/* Barra superior del editor */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{
            backgroundColor: 'rgba(248, 249, 250, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          {/* Botones de ventana macOS */}
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffbd2e' }} />
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28ca42' }} />
          </div>

          {/* Barra de búsqueda */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#4b5563',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <span style={{ fontSize: '11px' }}>Ask AI & Search</span>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                fontSize: '10px',
              }}
            >
              ⌘K
            </span>
          </div>
        </div>

        {/* Pestañas de archivos */}
        <div
          className="flex items-center gap-0.5 px-2"
          style={{
            backgroundColor: 'rgba(241, 245, 249, 0.5)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <div
            className="px-3 py-2 text-xs font-medium flex items-center gap-2 relative"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              color: '#1f2937',
              borderTop: '2px solid #e11d48',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            }}
          >
            <span style={{ fontSize: '10px', color: '#e11d48' }}>●</span>
            <span style={{ fontSize: '11px' }}>app.controller.ts</span>
          </div>
          <div
            className="px-3 py-2 text-xs flex items-center gap-2"
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
            }}
          >
            <span style={{ fontSize: '10px' }}>●</span>
            <span style={{ fontSize: '11px' }}>app.service.ts</span>
          </div>
          <div
            className="px-3 py-2 text-xs flex items-center gap-2"
            style={{
              backgroundColor: 'transparent',
              color: '#6b7280',
            }}
          >
            <span style={{ fontSize: '10px' }}>●</span>
            <span style={{ fontSize: '11px' }}>main.ts</span>
          </div>
        </div>

        {/* Área de código */}
        <div
          className="p-3 font-mono text-xs leading-relaxed"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            color: '#1f2937',
            height: 'calc(100% - 80px)',
            overflow: 'hidden',
          }}
        >
          <div className="flex">
            {/* Números de línea */}
            <div
              className="pr-2.5 text-right select-none"
              style={{
                color: '#9ca3af',
                fontSize: '10px',
                lineHeight: '1.6',
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map(line => (
                <div key={line} style={{ minHeight: '16px' }}>{line}</div>
              ))}
            </div>

            {/* Código NestJS/TypeScript con efecto typewriter */}
            <div className="flex-1" style={{ fontSize: '10px', lineHeight: '1.6' }}>
              {line1 && <div>{applySyntaxHighlighting(line1)}</div>}
              {line2 && <div>{applySyntaxHighlighting(line2)}</div>}
              {line3 && <div style={{ marginTop: '4px' }}></div>}
              {line4 && <div>{applySyntaxHighlighting(line4)}</div>}
              {line5 && <div>{applySyntaxHighlighting(line5)}</div>}
              {line6 && <div style={{ paddingLeft: '1rem' }}>{applySyntaxHighlighting(line6)}</div>}
              {line7 && <div style={{ paddingLeft: '2rem' }}>{applySyntaxHighlighting(line7)}</div>}
              {line8 && <div style={{ paddingLeft: '1rem' }}>{applySyntaxHighlighting(line8)}</div>}
              {line9 && <div style={{ paddingLeft: '1rem', marginTop: '4px' }}></div>}
              {line10 && <div style={{ paddingLeft: '1rem' }}>{applySyntaxHighlighting(line10)}</div>}
              {line11 && <div style={{ paddingLeft: '1rem' }}>{applySyntaxHighlighting(line11)}</div>}
              {line12 && <div style={{ paddingLeft: '2rem' }}>{applySyntaxHighlighting(line12)}</div>}
              {line13 && <div style={{ paddingLeft: '1rem' }}>{applySyntaxHighlighting(line13)}</div>}
              {line14 && <div>{applySyntaxHighlighting(line14)}</div>}
              {isAnyTyping && (
                <span
                  ref={cursorRef}
                  style={{
                    display: 'inline-block',
                    width: '2px',
                    height: '1em',
                    backgroundColor: '#1f2937',
                    marginLeft: '2px',
                    verticalAlign: 'baseline',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

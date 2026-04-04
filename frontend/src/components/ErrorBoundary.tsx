import React from 'react';
import { theme } from '@/styles/theme';

interface Props  { children: React.ReactNode; }
interface State  { hasError: boolean; error: Error | null; }

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[Fluxa ErrorBoundary] Erro capturado:', error);
    console.error('[Fluxa ErrorBoundary] Component stack:', info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const msg = this.state.error?.message || 'Erro desconhecido';

    return (
      <div style={{
        minHeight: '100vh',
        background: theme.colors.bg.dark,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        fontFamily: theme.typography.fontFamily.body,
      }}>
        {/* Fluxa logo mark */}
        <div style={{
          width: 64, height: 64,
          borderRadius: theme.radius.xl,
          background: theme.gradients.brand,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: theme.shadows.brand,
          marginBottom: '1.5rem',
        }}>
          <svg viewBox="0 0 24 24" fill="none" width="36">
            <rect x="2" y="3" width="3.5" height="18" rx="1.5" fill="white"/>
            <rect x="5.5" y="3" width="8" height="3.5" rx="1.5" fill="white"/>
            <rect x="5.5" y="10.5" width="5.5" height="3" rx="1.5" fill="#00E5A0"/>
          </svg>
        </div>

        <h1 style={{
          fontFamily: theme.typography.fontFamily.display,
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 900,
          color: 'white',
          letterSpacing: '-0.03em',
          marginBottom: '0.75rem',
          textAlign: 'center',
        }}>
          Algo deu errado
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: theme.typography.fontSize.md,
          marginBottom: '0.5rem',
          textAlign: 'center',
          maxWidth: 480,
          lineHeight: 1.7,
        }}>
          A aplicação encontrou um erro inesperado. Isso já foi registrado no console.
        </p>

        {/* Error detail — visible only in dev */}
        {import.meta.env.DEV && (
          <pre style={{
            marginTop: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem 1.25rem',
            background: 'rgba(255,59,48,0.08)',
            border: '1px solid rgba(255,59,48,0.25)',
            borderRadius: theme.radius.md,
            color: '#FF6B6B',
            fontSize: theme.typography.fontSize.xs,
            maxWidth: 560,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontFamily: theme.typography.fontFamily.mono,
          }}>
            {msg}
          </pre>
        )}

        <button
          onClick={this.handleReload}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.875rem 2rem',
            borderRadius: theme.radius.lg,
            background: theme.gradients.brand,
            color: 'white',
            fontFamily: theme.typography.fontFamily.body,
            fontSize: theme.typography.fontSize.md,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: theme.shadows.brand,
          }}
        >
          ↺ Recarregar página
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;

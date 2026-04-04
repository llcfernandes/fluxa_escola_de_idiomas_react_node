import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { Button } from '@/components/ui/Button';
import Mascot from '@/components/mascot/Mascot';

const wrap = (ui: React.ReactElement) =>
  render(<MemoryRouter><ThemeProvider theme={theme}>{ui}</ThemeProvider></MemoryRouter>);

describe('Button', () => {
  it('renderiza o texto', () => {
    wrap(<Button>Clique</Button>);
    expect(screen.getByText('Clique')).toBeInTheDocument();
  });

  it('fica desabilitado quando loading=true', () => {
    wrap(<Button loading>Enviar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('chama onClick', () => {
    const fn = vi.fn();
    wrap(<Button onClick={fn}>Ação</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('não chama onClick quando disabled', () => {
    const fn = vi.fn();
    wrap(<Button disabled onClick={fn}>Ação</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('Mascot (Kai)', () => {
  it('renderiza SVG sem erros', () => {
    const { container } = wrap(<Mascot/>);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renderiza todos os moods', () => {
    const moods = ['idle','happy','thinking','excited','correct','wrong','speaking'] as const;
    moods.forEach(mood => {
      const { container } = wrap(<Mascot mood={mood}/>);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('aplica tamanho customizado', () => {
    const { container } = wrap(<Mascot size={200}/>);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper?.style.width).toBe('200px');
  });
});

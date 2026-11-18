// Carrossel acessível (padrão APG): botões anterior/próximo, pontos, pausa/iniciar.
// - Com movimento reduzido (prefers-reduced-motion) NÃO há rotação automática.
// - A rotação pausa com o mouse em cima, com foco dentro e no botão de pausa.
// - Sem JavaScript, os slides ficam empilhados e todo o conteúdo aparece.

const INTERVALO = 6000;

function iniciar(raiz: HTMLElement) {
  const slides = [...raiz.querySelectorAll<HTMLElement>('[data-slide]')];
  const pontos = [...raiz.querySelectorAll<HTMLButtonElement>('[data-ponto]')];
  const botaoPausa = raiz.querySelector<HTMLButtonElement>('[data-pausa]');
  const anterior = raiz.querySelector<HTMLButtonElement>('[data-anterior]');
  const proximo = raiz.querySelector<HTMLButtonElement>('[data-proximo]');
  const regiao = raiz.querySelector<HTMLElement>('[data-slides]');
  if (slides.length < 2 || !regiao) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  let atual = 0;
  let timer: number | undefined;
  // O usuário pediu pausa (ou o sistema pede menos movimento): não gira sozinho
  let pausadoPeloUsuario = mq.matches;
  let pausadoPorInteracao = false;

  function mostrar(i: number) {
    atual = (i + slides.length) % slides.length;
    slides.forEach((s, n) => {
      const ativo = n === atual;
      s.dataset.ativo = String(ativo);
      s.toggleAttribute('inert', !ativo);
      s.setAttribute('aria-hidden', String(!ativo));
    });
    pontos.forEach((p, n) => {
      if (n === atual) p.setAttribute('aria-current', 'true');
      else p.removeAttribute('aria-current');
    });
  }

  function rodando() {
    return !pausadoPeloUsuario && !pausadoPorInteracao;
  }

  function atualizarEstado() {
    raiz.dataset.rodando = String(!pausadoPeloUsuario);
    // Enquanto gira, o leitor de tela não é interrompido; parado, anuncia a troca.
    regiao!.setAttribute('aria-live', rodando() ? 'off' : 'polite');
    if (botaoPausa) {
      botaoPausa.setAttribute(
        'aria-label',
        pausadoPeloUsuario ? 'Iniciar a troca automática dos destaques' : 'Pausar a troca automática dos destaques',
      );
    }
  }

  function agendar() {
    window.clearTimeout(timer);
    if (rodando()) timer = window.setTimeout(() => { mostrar(atual + 1); agendar(); }, INTERVALO);
  }

  function ir(i: number) {
    mostrar(i);
    agendar();
  }

  anterior?.addEventListener('click', () => ir(atual - 1));
  proximo?.addEventListener('click', () => ir(atual + 1));
  pontos.forEach((p, n) => p.addEventListener('click', () => ir(n)));
  botaoPausa?.addEventListener('click', () => {
    pausadoPeloUsuario = !pausadoPeloUsuario;
    atualizarEstado();
    agendar();
  });

  raiz.addEventListener('mouseenter', () => { pausadoPorInteracao = true; atualizarEstado(); agendar(); });
  raiz.addEventListener('mouseleave', () => { pausadoPorInteracao = raiz.matches(':focus-within'); atualizarEstado(); agendar(); });
  raiz.addEventListener('focusin', () => { pausadoPorInteracao = true; atualizarEstado(); agendar(); });
  raiz.addEventListener('focusout', (e) => {
    if (!raiz.contains((e as FocusEvent).relatedTarget as Node | null)) {
      pausadoPorInteracao = raiz.matches(':hover');
      atualizarEstado();
      agendar();
    }
  });
  raiz.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') ir(atual - 1);
    else if (e.key === 'ArrowRight') ir(atual + 1);
  });

  // Se o usuário ligar "reduzir movimento" no sistema depois de abrir a página, para de girar
  mq.addEventListener('change', () => {
    if (mq.matches) pausadoPeloUsuario = true;
    atualizarEstado();
    agendar();
  });
  // Aba em segundo plano: não acumula trocas
  document.addEventListener('visibilitychange', () => (document.hidden ? window.clearTimeout(timer) : agendar()));

  mostrar(0);
  atualizarEstado();
  agendar();
}

document.querySelectorAll<HTMLElement>('[data-carrossel]').forEach(iniciar);

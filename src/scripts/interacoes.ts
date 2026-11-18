// Interações da página (docs/transicoes.md). Tudo aqui é melhoria: se este arquivo
// não carregar, a página continua funcionando com âncoras e CSS puros.

const raiz = document.documentElement;
const reduzido = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Tema (botão sol/lua) ----
const botaoTema = document.querySelector<HTMLButtonElement>('[data-tema-botao]');
if (botaoTema) {
  const sincronizar = () => {
    const escuro = raiz.dataset.theme === 'dark';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', escuro ? '#0b151b' : '#f4f7f7');
    // Rótulo dinâmico (diz a ação), sem aria-pressed, para o leitor de tela não se contradizer.
    botaoTema.setAttribute('aria-label', (escuro ? botaoTema.dataset.rotuloClaro : botaoTema.dataset.rotuloEscuro) ?? '');
  };
  sincronizar();
  new MutationObserver(sincronizar).observe(raiz, { attributes: true, attributeFilter: ['data-theme'] });
  let temporizador: number | undefined;
  botaoTema.addEventListener('click', () => {
    const proximo = raiz.dataset.theme === 'dark' ? 'light' : 'dark';
    raiz.classList.add('tema-trocando');
    raiz.dataset.theme = proximo;
    try {
      localStorage.setItem('faistinvest-tema', proximo);
    } catch {
      /* sem armazenamento: a troca vale só nesta visita */
    }
    window.clearTimeout(temporizador);
    const duracao = parseFloat(getComputedStyle(raiz).getPropertyValue('--dur-layout')) || 250;
    temporizador = window.setTimeout(() => raiz.classList.remove('tema-trocando'), duracao + 50);
  });
  window.addEventListener('storage', (e) => {
    if (e.key === 'faistinvest-tema' && (e.newValue === 'dark' || e.newValue === 'light')) raiz.dataset.theme = e.newValue;
  });
}

// ---- Rolagem das âncoras com a curva do sistema, cubic-bezier(0.22, 1, 0.36, 1) ----
function curvaSuave(t: number): number {
  const x1 = 0.22, y1 = 1, x2 = 0.36, y2 = 1;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (u: number) => ((ax * u + bx) * u + cx) * u;
  const dsx = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 6; i++) {
    const d = dsx(u);
    if (Math.abs(d) < 1e-6) break;
    u -= (sx(u) - t) / d;
  }
  u = Math.min(1, Math.max(0, u));
  return ((ay * u + by) * u + cy) * u;
}

let rolagemAtual = 0;
function rolarAte(y: number, aoTerminar?: () => void) {
  cancelAnimationFrame(rolagemAtual);
  const inicio = window.scrollY;
  const distancia = y - inicio;
  if (Math.abs(distancia) < 2) {
    window.scrollTo(0, y);
    aoTerminar?.();
    return;
  }
  const duracao = reduzido() ? 300 : Math.min(900, Math.max(450, Math.abs(distancia) * 0.25));
  const t0 = performance.now();
  const passo = (agora: number) => {
    const p = Math.min(1, (agora - t0) / duracao);
    window.scrollTo(0, inicio + distancia * curvaSuave(p));
    if (p < 1) rolagemAtual = requestAnimationFrame(passo);
    else aoTerminar?.();
  };
  rolagemAtual = requestAnimationFrame(passo);
}
for (const ev of ['wheel', 'touchstart', 'keydown'] as const) {
  window.addEventListener(ev, () => cancelAnimationFrame(rolagemAtual), { passive: true });
}

// ---- Menu do celular (só âncoras) ----
const botaoMenu = document.querySelector<HTMLButtonElement>('[data-menu-botao]');
const painelMenu = document.getElementById('menu-painel');
function menu(abrir: boolean) {
  if (!botaoMenu || !painelMenu) return;
  painelMenu.hidden = !abrir;
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
}
botaoMenu?.addEventListener('click', () => menu(painelMenu?.hidden !== false));
painelMenu?.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    menu(false);
    botaoMenu?.focus();
  }
});

document.addEventListener('click', (e) => {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
  if (!link) return;
  const url = new URL(link.href, location.href);
  if (!url.hash || url.pathname !== location.pathname || url.origin !== location.origin) return;
  const id = decodeURIComponent(url.hash.slice(1));
  const alvo = id ? document.getElementById(id) : null;
  if (!alvo) return;
  e.preventDefault();
  if (link.closest('#menu-painel')) menu(false);
  history.pushState(null, '', `#${id}`);
  const margem = parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0;
  const y = alvo.getBoundingClientRect().top + window.scrollY - margem;
  rolarAte(Math.max(0, y), () => {
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });
  });
});

// ---- Cabeçalho: borda aparece quando a página sai do topo ----
const cabecalho = document.querySelector<HTMLElement>('[data-cabecalho]');
if (cabecalho) {
  const marcar = () => (cabecalho.dataset.rolado = String(window.scrollY > 8));
  marcar();
  window.addEventListener('scroll', marcar, { passive: true });
}

// ---- Diálogos nativos: devolvem o foco a quem abriu; fecham com Esc, X e clique no fundo ----
const origens = new Map<HTMLDialogElement, HTMLElement>();
const toast = document.getElementById('toast');
let tempoToast: number | undefined;
function avisar(texto: string) {
  if (!toast) return;
  toast.textContent = texto;
  toast.dataset.visivel = 'true';
  window.clearTimeout(tempoToast);
  tempoToast = window.setTimeout(() => (toast.dataset.visivel = 'false'), 6000);
}

document.querySelectorAll<HTMLDialogElement>('dialog.dialogo').forEach((dlg) => {
  dlg.addEventListener('click', (e) => {
    // Só o fundo (o próprio <dialog>): o conteúdo tem padding num div interno.
    if (e.target === dlg) dlg.close();
    else if ((e.target as Element).closest('[data-fechar]')) dlg.close();
  });
  dlg.addEventListener('close', () => {
    const origem = origens.get(dlg);
    origens.delete(dlg);
    origem?.focus();
    if (dlg.returnValue === 'enviado') {
      avisar('Nada foi enviado: a lista de espera ainda não existe. Quando o produto abrir, a divulgação será feita nesta página.');
      const form = dlg.querySelector('form');
      form?.reset();
    }
    dlg.returnValue = '';
  });
});

document.addEventListener('click', (e) => {
  const gatilho = (e.target as Element | null)?.closest<HTMLElement>('[data-abrir]');
  if (!gatilho) return;
  const dlg = document.getElementById(gatilho.dataset.abrir ?? '') as HTMLDialogElement | null;
  if (dlg && !dlg.open) {
    origens.set(dlg, gatilho);
    dlg.showModal();
  }
});

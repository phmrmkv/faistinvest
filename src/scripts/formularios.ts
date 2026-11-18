// Formulários de demonstração: validação do navegador (Constraint Validation API) com
// mensagens em português ao lado de cada campo, e aviso de que nada é enviado.
// Sem este arquivo o formulário continua com a validação nativa do navegador.

type Campo = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

function mensagem(c: Campo): string {
  const v = c.validity;
  if (v.valueMissing) {
    if (c instanceof HTMLInputElement && c.type === 'checkbox') return 'Marque esta opção para continuar.';
    if (c instanceof HTMLSelectElement) return 'Escolha uma opção.';
    return 'Preencha este campo.';
  }
  if (v.typeMismatch && c instanceof HTMLInputElement && c.type === 'email') {
    return 'Informe um e-mail válido, como nome@exemplo.com.';
  }
  if (v.patternMismatch) return c.dataset.erroPadrao || 'O formato informado não é válido.';
  if (v.tooShort) return `Use pelo menos ${(c as HTMLInputElement).minLength} caracteres.`;
  return c.validationMessage || 'Valor inválido.';
}

function erroDe(c: Campo): HTMLElement | null {
  const ids = (c.getAttribute('aria-describedby') || '').split(/\s+/);
  const id = ids.find((x) => x.startsWith('erro-'));
  return id ? document.getElementById(id) : null;
}

function mostrar(c: Campo) {
  const e = erroDe(c);
  c.setAttribute('aria-invalid', 'true');
  if (e) e.textContent = mensagem(c);
}

function limpar(c: Campo) {
  const e = erroDe(c);
  c.removeAttribute('aria-invalid');
  if (e) e.textContent = '';
}

function campos(form: HTMLFormElement): Campo[] {
  return [...form.elements].filter(
    (el): el is Campo =>
      (el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement) &&
      el.type !== 'submit' &&
      el.type !== 'radio',
  );
}

function iniciarForm(form: HTMLFormElement) {
  form.noValidate = true;
  const estado = form.querySelector<HTMLElement>('[data-estado]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (estado) estado.hidden = true;
    const invalidos = campos(form).filter((c) => !c.disabled && !c.checkValidity());
    campos(form).forEach((c) => (invalidos.includes(c) ? mostrar(c) : limpar(c)));
    if (invalidos.length) {
      const primeiro = invalidos[0];
      primeiro.focus();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        primeiro.classList.remove('campo-tremida');
        void primeiro.offsetWidth;
        primeiro.classList.add('campo-tremida');
      }
      return;
    }
    if (estado) {
      estado.textContent = form.dataset.sucesso || 'Demonstração: nada foi enviado nem guardado.';
      estado.hidden = false;
      estado.focus();
    }
    form.reset();
    sincronizarPagamento(form);
  });

  form.addEventListener('input', (e) => {
    const c = e.target as Campo;
    if (c.getAttribute?.('aria-invalid') === 'true' && c.checkValidity()) limpar(c);
  });
  form.addEventListener('change', (e) => {
    const c = e.target as Campo;
    if (c.getAttribute?.('aria-invalid') === 'true' && c.checkValidity()) limpar(c);
  });
  form.addEventListener('animationend', (e) => (e.target as HTMLElement).classList.remove('campo-tremida'));

  // Forma de pagamento: só o painel escolhido participa da validação
  form.querySelectorAll<HTMLInputElement>('input[name="pagamento"]').forEach((r) =>
    r.addEventListener('change', () => sincronizarPagamento(form)),
  );
  form.addEventListener('reset', () => {
    setTimeout(() => {
      campos(form).forEach(limpar);
      sincronizarPagamento(form);
    });
  });
  sincronizarPagamento(form);
}

function sincronizarPagamento(form: HTMLFormElement) {
  const escolhido = form.querySelector<HTMLInputElement>('input[name="pagamento"]:checked')?.value;
  if (!escolhido) return;
  form.querySelectorAll<HTMLElement>('[data-painel-pagamento]').forEach((painel) => {
    const ativo = painel.dataset.painelPagamento === escolhido;
    painel.dataset.ativo = String(ativo);
    painel.querySelectorAll<Campo>('input, select').forEach((c) => {
      c.disabled = !ativo;
      if (!ativo) limpar(c);
    });
  });
}

document.querySelectorAll<HTMLFormElement>('form[data-form-demo]').forEach(iniciarForm);

// Diálogo de login: botão fechar, clique no fundo e limpeza ao fechar
const dlg = document.getElementById('dialogo-login') as HTMLDialogElement | null;
if (dlg) {
  dlg.querySelector('[data-fechar-dialogo]')?.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dlg.close(); // o padding vive no div interno, então só o fundo (::backdrop) chega aqui
  });
  dlg.addEventListener('close', () => {
    const f = dlg.querySelector('form');
    f?.reset();
    const est = dlg.querySelector<HTMLElement>('[data-estado]');
    if (est) est.hidden = true;
  });
}

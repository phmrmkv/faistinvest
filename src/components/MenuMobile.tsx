import { useState } from 'react';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type Link = { href: string; texto: string };

export default function MenuMobile({
  atual,
  noticias,
  links,
}: {
  atual: string;
  noticias: Link[];
  links: Link[];
}) {
  const [aberto, setAberto] = useState(false);
  let i = 0;
  const estilo = () => ({ '--i': i++ }) as React.CSSProperties;
  const classeLink =
    'link-menu flex min-h-12 items-center rounded-lg px-3 text-lg font-medium text-foreground aria-[current=page]:bg-muted aria-[current=page]:shadow-[inset_3px_0_0_var(--primary)]';

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger
        className="press -mr-2 inline-flex size-11 items-center justify-center rounded-full text-sobre-nav hover:bg-white/10 md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="size-6" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="right"
        rotuloFechar="Fechar menu"
        className="w-[82vw] max-w-sm gap-0 px-2"
        onCloseAutoFocus={(e) => {
          // Se o menu fechou para abrir o login, o foco vai para o diálogo.
          if (document.querySelector('dialog[open]')) e.preventDefault();
        }}
      >
        <SheetHeader className="px-4 pt-6">
          <SheetTitle className="text-left text-lg font-semibold">Menu</SheetTitle>
          <SheetDescription className="sr-only">Links para as páginas da FastInvest</SheetDescription>
        </SheetHeader>
        <nav aria-label="Principal" className="px-2 pt-2">
          <p className="menu-item px-3 pb-1 text-sm font-semibold tracking-wide text-muted-foreground uppercase" style={estilo()}>
            Notícias
          </p>
          <ul className="flex flex-col">
            {noticias.map((l) => (
              <li key={l.href} className="menu-item" style={estilo()}>
                <a href={l.href} aria-current={atual === l.href ? 'page' : undefined} className={classeLink + ' pl-6'}>
                  {l.texto}
                </a>
              </li>
            ))}
          </ul>
          <ul className="mt-2 flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="menu-item" style={estilo()}>
                <a href={l.href} aria-current={atual === l.href ? 'page' : undefined} className={classeLink}>
                  {l.texto}
                </a>
              </li>
            ))}
            <li className="menu-item" style={estilo()}>
              <button
                type="button"
                className={classeLink + ' w-full text-left'}
                onClick={() => {
                  setAberto(false);
                  window.setTimeout(() => {
                    const dlg = document.getElementById('dialogo-login') as HTMLDialogElement | null;
                    if (dlg && !dlg.open) dlg.showModal();
                  }, 180);
                }}
              >
                Login
              </button>
            </li>
          </ul>
        </nav>
        <div className="menu-item mt-auto px-4 pb-8" style={estilo()}>
          <a href="/inscricao/" className="press botao botao-amarelo w-full">
            Inscreva-se
          </a>
        </div>
      </SheetContent>
    </Sheet>
  );
}

# fAIstInvest

Landing page de demonstração do **fAIstInvest**, um assistente com IA para acompanhar investimentos: a pessoa liga a carteira (em desenvolvimento) e a IA resume as notícias que afetam cada ativo, explica em linguagem simples por que algo subiu ou caiu e avisa quando há um evento importante (resultado, dividendo, mudança de juros). Não recomenda compra nem venda: não é recomendação de investimento.

**Produto em desenvolvimento pela PHMR Tech Solutions. Esta página é uma demonstração**: os ativos, as notícias e as conversas exibidos são fictícios, e nenhum botão envia dados.

Origem: começou como estudo de curso (FastInvest, Digital House).

## Como rodar

- `npm install`
- `npm run dev` (desenvolvimento), `npm run check` (tipos), `npm run build` (saída em `dist/`), `npm run preview`
- `node scripts/icones.mjs` regenera favicon, ícones e `og-image` (logo tipográfico provisório)

## Stack

Astro 7 (estático, TypeScript estrito), Tailwind CSS 4, sem React. Tema claro/escuro, movimento descrito em `docs/transicoes.md`. Diálogos com `<dialog>` nativo.

Site: https://faistinvest.libertycondominio.online. Os arquivos do estudo original ficam em `referencias/original/` (fora do build); o site de estudo anterior está no histórico do Git.

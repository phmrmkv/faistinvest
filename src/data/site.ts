export const SITE = {
  nome: 'FastInvest',
  url: 'https://fastinvest.libertycondominio.online',
  autorUrl: 'https://phmr.libertycondominio.online',
} as const;

export type Pagina = { href: string; texto: string };

export const noticias: Pagina[] = [
  { href: '/bovespa/', texto: 'Bovespa' },
  { href: '/nasdaq/', texto: 'Nasdaq' },
  { href: '/ny/', texto: 'NY' },
];

// Links principais da barra (a ordem é a do site original)
export const linksPrincipais: Pagina[] = [
  { href: '/planos/', texto: 'Planos' },
  { href: '/contato/', texto: 'Contato' },
];

export const linksRodapePaginas: Pagina[] = [
  { href: '/planos/', texto: 'Planos' },
  { href: '/contato/', texto: 'Contato' },
  { href: '/inscricao/', texto: 'Inscreva-se' },
];

export const linksRodapeSobre: Pagina[] = [
  { href: '/politicas/', texto: 'Políticas de Privacidade' },
  { href: '/termos/', texto: 'Termos e Condições de Uso' },
  { href: '/quem-somos/', texto: 'Quem Somos' },
];

// Dados de contato FALSOS, mantidos do site original e marcados como demonstração.
export const contatoDemo = {
  email: 'contato@fastinvest.com.br',
  telefone: '11 99999-9999',
  horario: 'De Seg. à Sex. das 8h às 18h',
  escritorios: ['São Paulo', 'New York', 'Dublin'],
  redes: ['Facebook', 'Twitter', 'Youtube'],
};

export const perguntas = [
  {
    p: 'É possível cancelar?',
    r: 'Sim. Em um serviço real, o cancelamento poderia ser pedido a qualquer momento pelo contato da empresa. Aqui é só um exemplo de resposta, porque o site é de demonstração.',
  },
  {
    p: 'Qual a garantia que tenho se perder?',
    r: 'Investir envolve risco e nenhum resultado é garantido. Este texto é um exemplo de resposta em um site de demonstração, sem promessa de ganho.',
  },
  {
    p: 'Qual a principal forma?',
    r: 'Texto de exemplo: a forma de pagamento principal seria escolhida na inscrição, entre cartão de crédito e boleto bancário.',
  },
  {
    p: 'Qual o melhor plano?',
    r: 'Texto de exemplo: o melhor plano depende de quanto tempo e de que tipo de notícia e relatório você quer acompanhar. Veja a página de planos.',
  },
  {
    p: 'Posso confiar?',
    r: 'Este é um projeto de estudo: não há serviço de investimento real, nem atendimento, nem dados enviados. Nada aqui é recomendação de investimento.',
  },
];

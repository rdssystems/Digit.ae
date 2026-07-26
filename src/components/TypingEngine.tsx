import React, {
  useState, useEffect, useRef, useCallback, useMemo
} from 'react';
import { useUserStore } from '../store/useUserStore';
import { LogOut, User as UserIcon, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { useAppSounds } from '../hooks/useAppSounds';

const MSG_APROVADO = [
  "Fantástico! Seus dedos estão voando pelo teclado! 🚀",
  "Excelente! Você está dominando a arte da digitação! 🏆",
  "Perfeito! Velocidade e precisão trabalhando em harmonia! ⭐",
  "Incrível! Quase não dá para ver seus dedos se movendo de tão rápido! 🔥",
  "Maravilhoso! Continue nesse ritmo, você está imbatível! 🎯",
  "Que show! Você está a um passo de virar um mestre do teclado! 💻"
];

const MSG_REPROVADO = [
  "Quase lá! Respire fundo e tente focar mais na precisão desta vez. 💪",
  "Não desista! Todo mestre começou devagar. Vamos mais uma vez! 🐢",
  "Foi por pouco! Concentre-se em acertar as teclas, a velocidade vem com o tempo. 🎯",
  "Calma! Reduza um pouquinho o ritmo e preste atenção na posição dos dedos. 👐",
  "Um pequeno tropeço no caminho do sucesso. Dê uma pausa e retorne com tudo! 🚧",
  "Você consegue! Tente novamente mantendo os olhos na tela e a mente limpa. 🧘‍♂️"
];

const MSG_START = [
  { h: "Preparar...", m: "VAI! 🚀" },
  { h: "Atenção...", m: "FOCO! 🔥" },
  { h: "Posicionando...", m: "DIGITE! ⌨️" },
  { h: "Respire fundo...", m: "COMEÇOU! 🏁" },
  { h: "Dedos no lugar...", m: "VOE! 🦅" },
  { h: "Tudo pronto?", m: "VELOCIDADE MÁXIMA! ⚡" },
  { h: "Concentração...", m: "AGORA! 🎯" }
];

const TUTORIAL_SLIDES = [
  {
    title: "Posicionamento das Mãos",
    description: "Mantenha os dedos nas teclas ASDF e JKLÇ. Os polegares ficam sobre a barra de espaço.",
    tip: "A base de tudo: Sinta as saliências nas teclas F e J para guiar seus indicadores sem olhar.",
    img: "/assets/tutorial_fingers.png"
  },
  {
    title: "Linha Superior",
    description: "Alcance a linha de cima estendendo os dedos suavemente. Mantenha os pulsos parados.",
    tip: "MOVIMENTO SEGURO: Retorne sempre para a base (Home Row) após cada toque na linha superior.",
    img: "/assets/tutorial_top.png"
  },
  {
    title: "Linha Inferior",
    description: "Flexione os dedos para baixo com precisão. Mantenha as mãos relaxadas.",
    tip: "PONTAS DOS DEDOS: Digite com as pontas e não com as unhas para maior controle e silêncio.",
    img: "/assets/tutorial_bottom.png"
  }
];

// ─── GERADOR DE EXERCÍCIO ─────────────────────────────────────────────────────
// 7 colunas × 4 linhas = 28 repetições
/*
function gerarGrade(seq: string): string[] {
  const linha = Array(7).fill(seq).join(' ');
  return [linha, linha, linha, linha]; // 4 linhas
}
*/

// ─── LIÇÕES ───────────────────────────────────────────────────────────────────
interface Licao {
  id: number;
  titulo: string;
  subtitulo: string;
  linhas: string[]; // 4 linhas de texto
  teclasFoco: string[]; // teclas para destacar no teclado
  key: string;       // Identificador único global (ex: 'm1-l1')
  isScrolling?: boolean; // Se true, usa o modo de rolagem horizontal
}

interface Fase {
  titulo: string;
  descricao: string;
  licoes: Licao[];
}

const TEXTO_MODULO_3 = "o rato preto roeu a rede. a porta da sala de estar esta aberta. paula pediu aquele prato de peixe frito. hoje o dia esta legal para caminhar perto do lago. o poeta escreve o texto direto no papel. a grafite do lapis quebrou. tudo esta quase pronto para a festa de hoje. o gato pula o muro alto e foge para a rua. jorge quer ler o jornal que esta ali. a pipa subiu alto no ar. falta sorte para aquele jogador de elite. o teclado do computador esta quieto. a ideia era sair cedo para o teatro. agora a luz do sol brilha forte.";

const TEXTO_MODULO_3_DESAFIO = "o café esta quente, mas o pão com mel ja acabou. a vida na cidade exige calma, foco e muita coragem. fiz o exame de vista hoje e tudo parece exato. o juiz deu o prazo final para o processo. talvez a gente possa viajar de navio ou de avião no verão. a caixa de madeira trazia um xale azul e uma foto antiga. o rapaz era muito capaz, mas precisava de mais prática no teclado. marchar no campo exige ritmo e força. a luz do sol brilha na mesa da sala. por favor, feche a porta e traga o jornal agora. o sucesso vem para quem treina com zelo e paciência. o ponto final indica que a lição acabou.";

const TEXTO_MODULO_4 = "o vento soprava forte na varanda da casa amarela. as folhas secas dançavam pelo quintal enquanto o gato observava tudo de cima do muro. dona clara preparava um bolo de fuba para o cafe da tarde e o cheiro se espalhava pela rua inteira. os vizinhos sorriam e acenavam da janela. era um dia simples, daqueles que a gente guarda na memoria sem nem saber por que. a vida tem dessas coisas bonitas e gratuitas que so a rotina revela.";

const TEXTO_MODULO_5 = "havia uma vez um velho relojoeiro que morava no alto da colina. todos os dias, ele subia as escadas de madeira ate sua oficina e se sentava diante de dezenas de relogios antigos, cada um marcando uma hora diferente. ele dizia que o tempo nao existia dentro daquelas paredes, que cada ponteiro girava no seu proprio ritmo, assim como as pessoas. um dia, uma menina entrou na loja e perguntou se ele consertava relogios quebrados. o velho sorriu e respondeu que so consertava aqueles que ainda tinham vontade de funcionar.";

const TEXTO_MODULO_6 = "no dia 15 de Março de 2024, a empresa TechSol Brasil S.A. inaugurou sua nova sede na Av. Paulista, 1500, em São Paulo. o evento contou com 320 convidados e 12 palestrantes internacionais. o CEO Carlos Mendes anunciou a contratação de 50 novos funcionarios e a meta de R$ 10 milhões em faturamento ate Dezembro. foi um marco histórico.";

const TEXTO_MODULO_7 = "prezado(a) Sr(a). Carlos Almeida, agradecemos seu contato (protocolo #4521-2026). conforme solicitado, enviamos o orçamento revisado: Item 1 — R$ 350,00; Item 2 — R$ 890,50; Taxa de serviço (5%) — R$ 62,03; Total = R$ 1.302,53. o pagamento pode ser feito via PIX (chave: financeiro@empresa.com) ou boleto com vencimento em 20/07/2026. duvidas? Ligue: (11) 3456-7890. Atenciosamente, Equipe Comercial.";

const TEXTO_MODULO_8 = "todas as manhas ele saia cedo para andar pelo parque perto de casa. o caminho era simples e tranquilo, com passaros cantando e o sol ainda fraco atras das arvores. ele gostava de sentir o vento no rosto enquanto pensava nas coisas simples da vida. algumas pessoas passavam correndo, outras caminhavam devagar com seus cachorros. tudo era calmo e perfeito.";

const TEXTO_MODULO_9 = "Ilmo. Sr. Diretor de Compras, vimos por meio desta apresentar nossa proposta comercial para fornecimento de materiais de escritorio. nossa empresa atua no mercado desde 2005 e atende mais de 300 clientes corporativos em todo o Brasil. os valores unitarios seguem na tabela anexa, com desconto progressivo a partir de R$ 5.000,00. o prazo de entrega e de ate 7 dias uteis e o pagamento pode ser parcelado em ate 12 vezes. colocamo-nos a disposicao para uma reuniao presencial ou por videochamada. Cordialmente, Equipe Comercial.";

const TEXTO_MODULO_10 = "prezados membros do Conselho Diretor, apresentamos a seguir o relatorio consolidado do 3º trimestre de 2026. a receita liquida atingiu R$ 2.847.300,00 — um crescimento de 18,7% em relacao ao mesmo periodo do ano anterior (R$ 2.400.000,00). os custos operacionais totalizaram R$ 1.120.450,80, resultando em um lucro operacional de R$ 1.726.849,20. destacamos: (1) abertura de 3 novas filiais em Campinas, Curitiba e Belo Horizonte; (2) contratação de 42 colaboradores — sendo 15 para TI e 27 para operacoes; (3) lancamento da plataforma digital (app mobile + web) com investimento de R$ 480.000,00. para o 4º trimestre, a projecao e de R$ 3.100.000,00 em receita. Contatos: diretoria@empresa.com — Tel: (11) 4002-8922.";

const FASES: Fase[] = [
  {
    titulo: 'Fase 1 — Treinando os Dedos',
    descricao: 'Posição básica das mãos: dedo indicador esquerdo no F, indicador direito no J',
    licoes: [
      { 
        id: 1, key: 'm1-l1', titulo: 'Lição 1', subtitulo: 'Posição Base: A S D F e Ç L K J', 
        linhas: [
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('asdf çlkj').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','ç','l','k','j'] 
      },
      { 
        id: 2, key: 'm1-l2', titulo: 'Lição 2', subtitulo: 'Inversão: F D S A e J K L Ç', 
        linhas: [
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('fdsa jklç').join(' ')
        ], 
        teclasFoco: ['f','d','s','a','j','k','l','ç'] 
      },
      { 
        id: 3, key: 'm1-l3', titulo: 'Lição 3', subtitulo: 'Mesclagem de Sequências', 
        linhas: [
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('fdsa jklç').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','j','k','l','ç'] 
      },
      { 
        id: 4, key: 'm1-l4', titulo: 'Lição 4', subtitulo: 'Variações de Coordenação', 
        linhas: [
          'asdf çlkj fdsa jklç asdf çlkj fdsa jklç',
          'çlkj asdf jklç fdsa çlkj asdf jklç fdsa',
          'fdsa jklç asdf çlkj fdsa jklç asdf çlkj',
          'jklç fdsa çlkj asdf jklç fdsa çlkj asdf'
        ], 
        teclasFoco: ['a','s','d','f','j','k','l','ç'] 
      },
      { 
        id: 5, key: 'm1-l5', titulo: 'Lição 5', subtitulo: 'Ampliando para o G', 
        linhas: [
          Array(4).fill('asdfg çlkj').join(' '),
          Array(4).fill('asdfg çlkj').join(' '),
          Array(4).fill('asdfg çlkj').join(' '),
          Array(4).fill('asdfg çlkj').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','g','ç','l','k','j'] 
      },
      { 
        id: 6, key: 'm1-l6', titulo: 'Lição 6', subtitulo: 'Retorno com G', 
        linhas: [
          Array(4).fill('gfdsa jklç').join(' '),
          Array(4).fill('gfdsa jklç').join(' '),
          Array(4).fill('gfdsa jklç').join(' '),
          Array(4).fill('gfdsa jklç').join(' ')
        ], 
        teclasFoco: ['g','f','d','s','a','j','k','l','ç'] 
      },
      { 
        id: 7, key: 'm1-l7', titulo: 'Lição 7', subtitulo: 'Linha Central Completa: G e H', 
        linhas: [
          Array(4).fill('asdfg hjklç').join(' '),
          Array(4).fill('asdfg hjklç').join(' '),
          Array(4).fill('asdfg hjklç').join(' '),
          Array(4).fill('asdfg hjklç').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','g','h','j','k','l','ç'] 
      },
      { 
        id: 8, key: 'm1-l8', titulo: 'Lição 8', subtitulo: 'Retorno: Linha Central Completa', 
        linhas: [
          Array(4).fill('gfdsa çlkjh').join(' '),
          Array(4).fill('gfdsa çlkjh').join(' '),
          Array(4).fill('gfdsa çlkjh').join(' '),
          Array(4).fill('gfdsa çlkjh').join(' ')
        ], 
        teclasFoco: ['g','f','d','s','a','ç','l','k','j','h'] 
      },
    ],
  },
  {
    titulo: 'Módulo 2 — Linha Superior',
    descricao: 'Aprendendo a usar a linha superior do teclado',
    licoes: [
      {
        id: 1, key: 'm2-l1', titulo: 'Lição 1', subtitulo: 'Implementando "e" e "i"',
        linhas: [
          'dede kiki ele ali sei lei ide',
          'dente leila disse feira sede lido esse',
          'eile kide seie leie fiei ddie lise',
          'eleia ideia fedia lesse seque dila sife'
        ], 
        teclasFoco: ['e', 'i'],
      },
      {
        id: 2, key: 'm2-l2', titulo: 'Lição 2', subtitulo: 'Implementando "r" e "u"',
        linhas: [
          'ruru juju rua rir seu leu rui',
          'surfa lura russa durar suar criar furar',
          'daria feria seria curar subir luisa rufar',
          'reuse rular suser duras jura frias rudes'
        ], 
        teclasFoco: ['r', 'u'],
      },
      {
        id: 3, key: 'm2-l3', titulo: 'Lição 3', subtitulo: 'Implementando "t" e "y"',
        linhas: [
          'tata yaya teto tudo teu tela tiro',
          'trata jeito festa suite forte tinta tute',
          'stay taty tyra treta titi luta yard',
          'tente teste texto toras tery trua tula'
        ], 
        teclasFoco: ['t', 'y'],
      },
      {
        id: 4, key: 'm2-l4', titulo: 'Lição 4', subtitulo: 'Implementando "q" e "p"',
        linhas: [
          'papa que para pelo aqui pipa peao',
          'quer pele peca pular papel pique poca',
          'queda parte preto pires quilo prata ponto',
          'perpa quila pite quep poia pulas pife'
        ], 
        teclasFoco: ['q', 'p'],
      },
      {
        id: 5, key: 'm2-l5', titulo: 'Lição 5', subtitulo: 'Prática de Integração',
        linhas: [
          'prato toque leite pista preto quase roupa',
          'quilo porta sorte telha festa peixe ruido',
          'pular treta patio dente fraco ideal justo',
          'perito quieto rapido efeito teatro perfil saida'
        ], 
        teclasFoco: ['q','w','e','r','t','y','u','i','o','p'],
      },
      {
        id: 6, key: 'm2-l6', titulo: 'Lição 6', subtitulo: 'Alternância Rápida (Esquerda-Direita)',
        linhas: [
          'para tico pele rico suco lupa feio',
          'rude pipa gato juro sela tipo guia',
          'pato lula roda suor tela rifa sujo',
          'pera jogo ralo situ duto foca luta'
        ], 
        teclasFoco: ['a','s','d','f','j','k','l','ç','q','w','e','r','t','y','u','i','o','p'],
      },
      {
        id: 7, key: 'm2-l7', titulo: 'Lição 7', subtitulo: 'Palavras de Alta Frequência',
        linhas: [
          'que este tudo pois pela dele area',
          'fora hoje qual parte logo seis aqui',
          'dizer ler poder falar tirar pedir saber',
          'agora ideia falta lugar geral ordem porto'
        ], 
        teclasFoco: [],
      },
      {
        id: 8, key: 'm2-l8', titulo: 'Lição 8', subtitulo: 'Desafio de Precisão',
        linhas: [
          'aquele direto escola frente igreja jornal lido',
          'perigo queijo rastro teatro ultrapa vitoria xadrez',
          'projeto estada predio trecho plateia quieto rapido',
          'estuda flauta grafite gloria trilha fofura patio'
        ], 
        teclasFoco: [],
      },
      {
        id: 9, key: 'm2-l9', titulo: 'Desafio de Fluxo', subtitulo: 'Mantenha o ritmo enquanto o texto desliza',
        linhas: [TEXTO_MODULO_3], teclasFoco: [], isScrolling: true,
      }
    ],
  },
  {
    titulo: 'Módulo 3 — A Linha Inferior',
    descricao: 'Dominando as teclas V, M, C, X, Z e pontuação básica',
    licoes: [
      {
        id: 1, key: 'm3-l1', titulo: 'Lição 1', subtitulo: 'Introdução das teclas V e M',
        linhas: [
          'vava mama vem meu vida uma vale',
          'amor vive mesa vovó mapa luva maré',
          'meio vaso meta vila muro vaga mudo',
          'viva mole vera lama vale ramo vime'
        ],
        teclasFoco: ['v', 'm'],
      },
      {
        id: 2, key: 'm3-l2', titulo: 'Lição 2', subtitulo: 'Introdução das teclas C e Vírgula (,)',
        linhas: [
          'caca ,,,, casa mica cedo cada doce',
          'café fica cujo céu, vaca foco peça',
          'carpa face fico liso, caça arco vice',
          'taco, aqui, cujo cedo saco coma toca'
        ],
        teclasFoco: ['c', ','],
      },
      {
        id: 3, key: 'm3-l3', titulo: 'Lição 3', subtitulo: 'Introdução das teclas X e Ponto (.)',
        linhas: [
          'xaxa .... taxa eixo luxo coxa fixo',
          'roxo exato exame táxi. aqui. sair. hoje.',
          'ralo. cedo. fixar oxalá xale boxe fluxo',
          'sexo xote luxar frio. dele. pela. eixo.'
        ],
        teclasFoco: ['x', '.'],
      },
      {
        id: 4, key: 'm3-l4', titulo: 'Lição 4', subtitulo: 'Introdução das teclas Z e Barra (/)',
        linhas: [
          'zaza //// azul zero juiz zona reza',
          'doze traz zeal voz/ luz/ paz/ vez/',
          'azar zelo zumo raiz vaza gaze cozê',
          'zelar dizer fazer vazio feliz prazo capaz'
        ],
        teclasFoco: ['z', '/'],
      },
      {
        id: 5, key: 'm3-l5', titulo: 'Lição 5', subtitulo: 'Consolidação e Salto de Linhas',
        linhas: [
          'cavalo máximo xadrez talvez vacina cinema exame',
          'amizade reflexo música vencer começo vizinho marchar',
          'escola prazer cx. avião caxias voz comer',
          'xerox moça valer feliz marca veraz campo'
        ],
        teclasFoco: ['c','v','m','x','z'],
      },
      {
        id: 6, key: 'm3-l6', titulo: 'Lição 6', subtitulo: 'Frases Curtas (Ritmo)',
        linhas: [
          'a casa. o café. meu pai. vi a luz. fiz tudo.',
          'mesa de some. casa vazia. vida feliz. luz do sol.',
          'campo verde. voar alto. fazer a lição. exame de vista.',
          'vir aqui. ler o mapa. dizer a verdade. talvez amanhã.'
        ],
        teclasFoco: [],
      },
      {
        id: 7, key: 'm3-l7', titulo: 'Lição 7', subtitulo: 'Foco em Pontuação: Vírgula e Ponto',
        linhas: [
          'sim, eu vou. não, hoje não. quero, mas. vi, ouvi, fiz.',
          'azul, verde. luz, câmera. pulei, caí. li, logo sei.',
          'cedo. tarde. agora. depois. fim. pronto. acabou. tchau.',
          'alto. baixo. forte. fraco. perto. longe. certo. errado.'
        ],
        teclasFoco: [',', '.'],
      },
      {
        id: 8, key: 'm3-l8', titulo: 'Lição 8', subtitulo: 'O Grande Mix - Teclado Inteiro',
        linhas: [
          'teclado rápido máximo fluência objetivo produção execução',
          'memória muscular precisão avançado completo perfeito domínio',
          'próximo degrau vencer etapa desafio técnica prática',
          'focar digitar acertar repetir treinar evoluir sucesso'
        ],
        teclasFoco: [],
      },
      {
        id: 9, key: 'm3-l9', titulo: 'Desafio de Fluxo', subtitulo: 'Mantenha o ritmo enquanto o texto desliza',
        linhas: [TEXTO_MODULO_3_DESAFIO], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 4 — Consolidação e Ritmo',
    descricao: 'Consolidando o teclado inteiro com palavras e frases do dia a dia',
    licoes: [
      {
        id: 1, key: 'm4-l1', titulo: 'Lição 1', subtitulo: 'Palavras Cotidianas (2 a 4 letras)',
        linhas: [
          'casa rua sol mar flor lua rio',
          'porta copo mesa bolo dia noite agua',
          'fogo vida jogo filme carro verde azul',
          'amor paz ar luz som cor vez voz'
        ],
        teclasFoco: [],
      },
      {
        id: 2, key: 'm4-l2', titulo: 'Lição 2', subtitulo: 'Frases Curtas do Cotidiano',
        linhas: [
          'o sol brilha forte hoje de manha.',
          'a casa fica perto do rio azul.',
          'quero um copo de agua bem gelada.',
          'vou andar de carro ate o centro.'
        ],
        teclasFoco: [],
      },
      {
        id: 3, key: 'm4-l3', titulo: 'Lição 3', subtitulo: 'Fonemas e Dígrafos: lh, nh, ch, rr, ss',
        linhas: [
          'filho velho palha trilha ilha olho telha',
          'lenha banho ninho linha sonho unha vinho',
          'chave chama chuva cheio choro chefe chapa',
          'carro barro terra guerra serra jarra torre'
        ],
        teclasFoco: ['l', 'h', 'n', 'c', 'r', 's'],
      },
      {
        id: 4, key: 'm4-l4', titulo: 'Lição 4', subtitulo: 'Acentuação e Cedilha: o toque brasileiro',
        linhas: [
          'café você avó avô pé pá fé chá já',
          'coração atenção nação feijão avião balão leão',
          'poção relação canção doação razão função nação',
          'saúde saída baú açaí país herói ideia rainha'
        ],
        teclasFoco: ['´', '~', '^', 'ç'],
      },
      {
        id: 5, key: 'm4-l5', titulo: 'Lição 5', subtitulo: 'Frases de Ritmo Controlado',
        linhas: [
          'hoje o café estava muito forte pela manha.',
          'a menina levou o cachorro para passear no parque.',
          'amanha vou a feira e depois ao cinema com voce.',
          'o relogio da sala parou e atrasou todo o jantar.'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm4-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Mantenha o ritmo enquanto o texto desliza',
        linhas: [TEXTO_MODULO_4], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 5 — Fluência Avançada',
    descricao: 'Textos, pontuação e expressão escrita com confiança',
    licoes: [
      {
        id: 1, key: 'm5-l1', titulo: 'Lição 1', subtitulo: 'Palavras Técnicas e Científicas',
        linhas: [
          'programa sistema digital projeto usuario interface',
          'tecnologia ciencia biologia geografia historia arte',
          'economia politica sociedade documento processo relato',
          'transforme visualize configure automatize organize finalize'
        ],
        teclasFoco: [],
      },
      {
        id: 2, key: 'm5-l2', titulo: 'Lição 2', subtitulo: 'Frases Descritivas: cenas curtas',
        linhas: [
          'a lua cheia iluminava o lago calmo da fazenda antiga.',
          'as crianças corriam alegres atras da pipa colorida no ceu.',
          'o barco balancava devagar enquanto o pescador jogava a rede.',
          'a biblioteca silenciosa guardava livros de capa desgastada.'
        ],
        teclasFoco: [],
      },
      {
        id: 3, key: 'm5-l3', titulo: 'Lição 3', subtitulo: 'Pontuação e Diálogo: o texto ganha voz',
        linhas: [
          '--voce viu o que aconteceu la fora? --perguntou maria.',
          '--ainda nao! --respondeu joao. --que susto!',
          '--como ele conseguiu subir naquela arvore?',
          'o gato miou, o cao latiu e a porta bateu.'
        ],
        teclasFoco: ['-', '?', '!', ','],
      },
      {
        id: 4, key: 'm5-l4', titulo: 'Lição 4', subtitulo: 'Frases Longas com Estrutura',
        linhas: [
          'o professor explicou que o resultado dependia de varios fatores.',
          'enquanto a chuva caia, a familia se reunia ao redor da lareira.',
          'depois de muito esforco, o time conquistou o titulo estadual.',
          'quando o sol nasceu atras das montanhas, os passaros cantaram.'
        ],
        teclasFoco: [],
      },
      {
        id: 5, key: 'm5-l5', titulo: 'Lição 5', subtitulo: 'Parágrafo Integrado',
        linhas: [
          'a cidade acordava devagar naquela manha de domingo. o feirante arrumava as frutas na banca com cuidado, enquanto o padeiro tirava os primeiros paes quentes do forno.',
          'a praca ainda estava vazia e o silencio so era quebrado pelo som distante de um violao. aos poucos, as pessoas chegavam com suas sacolas e sorrisos.',
          'o pao quentinho e o leite fresco alegravam o cafe da manha daquela familia simples. era gostoso ver a alegria nos olhos das crianças.',
          'o dia passou tranquilo e a noite chegou com sua brisa fresca. todos se recolheram felizes, gratos por mais um dia de paz e trabalho bem feito.'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm5-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Uma pequena crônica para fluência total',
        linhas: [TEXTO_MODULO_5], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 6 — Números, Maiúsculas e Shift',
    descricao: 'A fileira superior com números e o domínio das teclas Shift',
    licoes: [
      {
        id: 1, key: 'm6-l1', titulo: 'Lição 1', subtitulo: 'Números Básicos: a fileira numérica',
        linhas: [
          '1 2 3 4 5 6 7 8 9 0 10 20 30 40 50',
          '60 70 80 90 11 22 33 44 55 66 77 88 99',
          '100 200 300 400 500 600 700 800 900',
          '1000 1500 2000 2500 3000 5000 10000'
        ],
        teclasFoco: ['1','2','3','4','5','6','7','8','9','0'],
      },
      {
        id: 2, key: 'm6-l2', titulo: 'Lição 2', subtitulo: 'Datas e Telefones: formatos numéricos do dia a dia',
        linhas: [
          '12/07/2026 25/12/2000 01/01/1990 15/11/1889',
          '11987654321 21912345678 31987651234 41998765432',
          'cep 01234567 87654321 22333444 55666777 88999000',
          'cpf 12345678901 98765432100 11122233344 55566677788'
        ],
        teclasFoco: ['1','2','3','4','5','6','7','8','9','0','/'],
      },
      {
        id: 3, key: 'm6-l3', titulo: 'Lição 3', subtitulo: 'Maiúsculas com Shift: nomes próprios e lugares',
        linhas: [
          'Brasil São Paulo Rio Janeiro Curitiba Salvador',
          'Pedro Maria João Ana Carlos Julia Lucas Beatriz',
          'Google Apple Microsoft Samsung Netflix Amazon Meta',
          'Janeiro Fevereiro Março Abril Maio Junho Julho Agosto'
        ],
        teclasFoco: [],
      },
      {
        id: 4, key: 'm6-l4', titulo: 'Lição 4', subtitulo: 'Siglas e Abreviações: alternando Shift com agilidade',
        linhas: [
          'ONU USB PDF CEO CFO HTML HTTP URL CPU GPU',
          'FGTS INSS IPTU IPVA ICMS IRPF PIS PASEP ISS',
          'km kg cm mm ml m² km/h R$ kW kWh CV HP Ltda',
          'Dr. Sr. Sra. Prof. Eng. Av. Rua Pça. tel. cel. etc.'
        ],
        teclasFoco: [],
      },
      {
        id: 5, key: 'm6-l5', titulo: 'Lição 5', subtitulo: 'Frases com Números e Maiúsculas',
        linhas: [
          'Hoje é 13 de Julho de 2026 e faz 25 graus em São Paulo.',
          'João tem 3 filhos: Ana de 12, Pedro de 8 e Lucas de 5.',
          'A loja vendeu 150 itens por R$ 2.500,00 no sábado passado.',
          'O voo AF 447 sai às 22h30 do Aeroporto de Guarulhos.'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm6-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Texto com números, datas e nomes próprios',
        linhas: [TEXTO_MODULO_6], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 7 — Símbolos e Pontuação Avançada',
    descricao: 'Arroba, cifrão, parênteses e toda a pontuação especial',
    licoes: [
      {
        id: 1, key: 'm7-l1', titulo: 'Lição 1', subtitulo: 'Símbolos Comuns: @, #, $, %, &, *',
        linhas: [
          'email@dominio.com.br vendas@loja.com contato@site.org',
          'senha#2026! codigo@123 valor$50 imposto%18 extra&',
          '& associados * obrigatorio (opcional) + extra - desconto',
          'preco $ 49.90 desconto % 25 total $ 37.43 promocao #2026'
        ],
        teclasFoco: ['2','3','4','5','7','8','@','#','$','%','&','*'],
      },
      {
        id: 2, key: 'm7-l2', titulo: 'Lição 2', subtitulo: 'Parênteses, Colchetes e Chaves',
        linhas: [
          '(valor + taxa) * 2 total = (a + b) / c resultado final',
          '[secao 1] [anexo A] [artigo 5] [inciso II] [paragrafo 3]',
          '{ nome: "Ana", idade: 28, ativo: true, saldo: 1500.00 }',
          'conteudo = (base * (1 + taxa)) - desconto + adicional'
        ],
        teclasFoco: ['(',')','[',']','{','}'],
      },
      {
        id: 3, key: 'm7-l3', titulo: 'Lição 3', subtitulo: 'Aspas, Apóstrofo e Travessão',
        linhas: [
          '"bom dia" \'olá\' — como vai? — estou bem hoje!',
          'a palavra "resiliencia" significa "capacidade de adaptacao".',
          '— quem e voce? — perguntou Alice. — eu sou o Gato risonho.',
          'o termo \'feedback\' vem do ingles \'to feed back\' literalmente.'
        ],
        teclasFoco: ['"','\'','-'],
      },
      {
        id: 4, key: 'm7-l4', titulo: 'Lição 4', subtitulo: 'E-mails e Formatos Profissionais',
        linhas: [
          'ana.silva@empresa.com.br carlos_lima@governo.gov.br',
          'suporte@tecnologia.net rh@industria.com vendas@loja.com',
          'n0va-senha!2026 acc3ss0@s3guro b0m_D1a&forte ok!',
          'nao-responda@banco.com newsletter@portal.org contato@site'
        ],
        teclasFoco: ['@','.','_','-','!'],
      },
      {
        id: 5, key: 'm7-l5', titulo: 'Lição 5', subtitulo: 'Textos com Riqueza Gráfica',
        linhas: [
          'O carro custava R$ 45.900,00 — um bom preco, eu diria.',
          'Conforme o artigo 5º (inciso III): "todos sao iguais perante a lei".',
          'A formula e: resultado = (nota1 + nota2) / 2 * 0,7 = media final.',
          '— E entao? — perguntou. — Esta feito! — respondi com alegria.'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm7-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Texto rico em símbolos e formatação profissional',
        linhas: [TEXTO_MODULO_7], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 8 — Velocidade com Bigramas e Trigramas',
    descricao: 'Padrões de alta frequência para acelerar sua digitação',
    licoes: [
      {
        id: 1, key: 'm8-l1', titulo: 'Lição 1', subtitulo: 'Bigramas Frequentes: pares mais comuns',
        linhas: [
          'de es ra os ar te en co er as ad to se um no',
          'dees raos arte enco eras adto esra coar dear sent',
          'dente resto parte arte contar entrar estado desenho',
          'daremos entarde rasteira restante destaque contador'
        ],
        teclasFoco: [],
      },
      {
        id: 2, key: 'm8-l2', titulo: 'Lição 2', subtitulo: 'Bigramas Frequentes: mais pares comuns',
        linhas: [
          'ta re ma do da se el pa qu no um po ri an ca',
          'tare mado dase elpa quen oum taen repo rica anca',
          'tarefa madera demora parade elefante queda relato',
          'tapete remado damasco elegante pequeno quente rico'
        ],
        teclasFoco: [],
      },
      {
        id: 3, key: 'm8-l3', titulo: 'Lição 3', subtitulo: 'Trigramas Comuns: três letras velozes',
        linhas: [
          'ent est men and ado aci com par tra des der ada',
          'mente estou dando parte muito antes acido comer trazer',
          'entende resultado parado comando trazido descida mente',
          'totalmente finalmente parado comendo acidamente trazido'
        ],
        teclasFoco: [],
      },
      {
        id: 4, key: 'm8-l4', titulo: 'Lição 4', subtitulo: 'Palavras Curtas em Rajada',
        linhas: [
          'sol mar ar paz luz cor vez som voz lar par dom',
          'casa mesa bolo fogo rua rio filme jogo vida cor',
          'verde azul porta copo noite agua carro verde amor',
          'flor amor dia lua ceu pe cha pa fe maio verao'
        ],
        teclasFoco: [],
      },
      {
        id: 5, key: 'm8-l5', titulo: 'Lição 5', subtitulo: 'Sprints de Velocidade: palavras comuns em sequência',
        linhas: [
          'que nao mais muito quando tambem porque depois sobre assim entre',
          'fazer dizer poder saber falar tirar pedir trazer levar ver',
          'agora hoje amanha sempre nunca antes tarde cedo logo depois',
          'grande pequeno melhor pior novo velho bom ruim forte fraco'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm8-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Bigramas e palavras em ritmo acelerado',
        linhas: [TEXTO_MODULO_8], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 9 — Textos do Mundo Real',
    descricao: 'E-mails, currículos, notícias e comunicações profissionais',
    licoes: [
      {
        id: 1, key: 'm9-l1', titulo: 'Lição 1', subtitulo: 'E-mail Profissional: saudação e despedida formal',
        linhas: [
          'Prezado Senhor Carlos,',
          'Segue em anexo o relatorio mensal de vendas conforme solicitado na reuniao de ontem.',
          'Qualquer duvida, estou a disposicao para esclarecimentos adicionais.',
          'Atenciosamente, Ana Souza — Gerente de Vendas — Ramal 342'
        ],
        teclasFoco: [],
      },
      {
        id: 2, key: 'm9-l2', titulo: 'Lição 2', subtitulo: 'Currículo e Dados Pessoais',
        linhas: [
          'Joao Victor de Lima — Brasileiro, 28 anos, Solteiro',
          'Formacao: Administracao — Universidade de Sao Paulo — 2020',
          'Experiencia: Assistente Financeiro — Empresa ABC Ltda — 2021 a 2024',
          'Idiomas: Ingles avancado, Espanhol intermediario, Frances basico'
        ],
        teclasFoco: [],
      },
      {
        id: 3, key: 'm9-l3', titulo: 'Lição 3', subtitulo: 'Notícia Curta: manchete, lide e corpo',
        linhas: [
          'Chuvas fortes atingem o sul e deixam 500 familias desabrigadas',
          'As fortes chuvas que comecaram na madrugada de segunda causaram alagamentos em 12 bairros da capital.',
          'A Defesa Civil informou que equipes trabalham para resgatar moradores ilhados e distribuir donativos.',
          'A previsao e de mais chuva para os proximos dias, e o alerta da Defesa Civil segue ate quinta-feira.'
        ],
        teclasFoco: [],
      },
      {
        id: 4, key: 'm9-l4', titulo: 'Lição 4', subtitulo: 'Receita Culinária: instruções passo a passo',
        linhas: [
          'Bolo de Cenoura com Cobertura de Chocolate — Ingredientes:',
          '3 cenouras medias, 4 ovos, 1 xicara de oleo, 2 xicaras de acucar, 2 xicaras de farinha de trigo, 1 colher de fermento.',
          'Modo de preparo: bata as cenouras, os ovos e o oleo no liquidificador por 3 minutos.',
          'Em uma tigela, misture a farinha e o acucar, adicione a mistura do liquidificador e o fermento. Asse por 40 minutos.'
        ],
        teclasFoco: [],
      },
      {
        id: 5, key: 'm9-l5', titulo: 'Lição 5', subtitulo: 'Mensagem Corporativa: WhatsApp e comunicados',
        linhas: [
          'Bom dia, equipe! Lembramos que hoje as 14h teremos nossa reuniao semanal.',
          'Pauta: resultados de Julho, metas de Agosto e apresentacao do novo colaborador.',
          'Favor confirmar presenca ate as 12h. O link da videochamada sera enviado por e-mail.',
          'Obrigado e boa semana a todos! Atenciosamente, Departamento de RH.'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm9-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Carta comercial completa',
        linhas: [TEXTO_MODULO_9], teclasFoco: [], isScrolling: true,
      }
    ]
  },
  {
    titulo: 'Módulo 10 — Desafio Final Integrado',
    descricao: 'Consolidando tudo: números, símbolos, maiúsculas e textos complexos',
    licoes: [
      {
        id: 1, key: 'm10-l1', titulo: 'Lição 1', subtitulo: 'Mix de Estilos: alternando padrões',
        linhas: [
          'O boleto nº 47823 no valor de R$ 156,90 vence em 20/08/2026.',
          'Email: suporte@empresa.com | Tel: (11) 3456-7890 | CEP: 04567-001',
          'Dr(a). Fernanda — CRM/SP 12345 — atende de 2ª a 6ª, das 8h as 18h.',
          'Codigo: X9K-42M — valido ate 31/12/2026 — use 1 vez por cliente.'
        ],
        teclasFoco: [],
      },
      {
        id: 2, key: 'm10-l2', titulo: 'Lição 2', subtitulo: 'Edital e Documento Legal',
        linhas: [
          'EDITAL DE CONVOCACAO Nº 001/2026 — A Comissao Organizadora convoca os candidatos aprovados na primeira fase.',
          'Art. 5º — O prazo para recurso e de 5 (cinco) dias uteis, contados da publicacao deste edital no Diario Oficial.',
          'Paragrafo unico: os documentos deverao ser entregues na sede, sito a Rua XV de Novembro, 1400, Sala 302.',
          'Publique-se e cumpra-se. Sao Paulo, 13 de julho de 2026. Dr. Roberto Alves — Presidente da Comissao.'
        ],
        teclasFoco: [],
      },
      {
        id: 3, key: 'm10-l3', titulo: 'Lição 3', subtitulo: 'Tabela e Dados Financeiros',
        linhas: [
          'JAN: R$ 2.340,00 | FEV: R$ 3.150,50 | MAR: R$ 1.890,00 | Total Q1: R$ 7.380,50',
          'Despesas: Aluguel R$ 1.200, Luz R$ 340, Agua R$ 180, Internet R$ 99,90, Folha R$ 4.500,00',
          'Lucro Liquido: R$ 5.560,60 | Margem: 32% | Crescimento: +12,4% vs. ano anterior',
          'Projecao Q2: R$ 8.200,00 (base 3 cenarios: conservador, moderado e otimista)'
        ],
        teclasFoco: [],
      },
      {
        id: 4, key: 'm10-l4', titulo: 'Lição 4', subtitulo: 'FAQ e Suporte Técnico',
        linhas: [
          '1. Como redefinir minha senha? Acesse Configuracoes > Seguranca > Alterar Senha.',
          '2. Qual o prazo de entrega? Capital: 3 dias uteis. Interior: ate 7 dias uteis.',
          '3. Posso cancelar meu pedido? Sim, em ate 24h apos confirmacao, pelo portal ou chat.',
          '4. Formas de pagamento: Cartao (ate 12x), Boleto (ate 3 dias), PIX (aprovacao instantanea).'
        ],
        teclasFoco: [],
      },
      {
        id: 5, key: 'm10-l5', titulo: 'Lição 5', subtitulo: 'Redação de Opinião: mini artigo argumentativo',
        linhas: [
          'A tecnologia transformou profundamente a maneira como nos comunicamos no seculo XXI. Em poucos anos, passamos das cartas manuscritas para mensagens instantaneas que cruzam o planeta',
          'em fracoes de segundo. Essa revolucao trouxe beneficios inegaveis, como a democratizacao do acesso a informacao e a possibilidade de manter contato com pessoas em qualquer lugar do mundo.',
          'No entanto, e preciso refletir sobre os impactos dessa hiperconectividade na qualidade das relacoes humanas. O volume excessivo de informacoes pode gerar ansiedade, e a comunicacao superficial',
          'substitui, muitas vezes, o dialogo profundo. O equilibrio entre o digital e o presencial e, portanto, o grande desafio da nossa geracao. Cabe a nos usar a tecnologia com sabedoria e intencao.'
        ],
        teclasFoco: [],
      },
      {
        id: 6, key: 'm10-l6', titulo: 'Desafio Final', subtitulo: 'O grande teste de tudo que voce aprendeu',
        linhas: [TEXTO_MODULO_10], teclasFoco: [], isScrolling: true,
      }
    ]
  }
];

// ─── TECLADO ABNT2 ────────────────────────────────────────────────────────────
const ABNT2_ROWS: { key: string; label?: string; flex?: number }[][] = [
  [
    {key:"'"},{key:'1'},{key:'2'},{key:'3'},{key:'4'},{key:'5'},{key:'6'},
    {key:'7'},{key:'8'},{key:'9'},{key:'0'},{key:'-'},{key:'='},
    {key:'BS', label:'⌫', flex:1.6},
  ],
  [
    {key:'TAB', label:'Tab', flex:1.3},
    {key:'q'},{key:'w'},{key:'e'},{key:'r'},{key:'t'},{key:'y'},
    {key:'u'},{key:'i'},{key:'o'},{key:'p'},{key:'´'},{key:'['},
    {key:'ENTER', label:'↵', flex:1.3},
  ],
  [
    {key:'CAPS', label:'Caps', flex:1.5},
    {key:'a'},{key:'s'},{key:'d'},{key:'f'},{key:'g'},{key:'h'},
    {key:'j'},{key:'k'},{key:'l'},{key:'ç'},{key:'~'},{key:']'},
    {key:'BARRA', label:'\\', flex:1.1},
  ],
  [
    {key:'SHIFL', label:'⇧', flex:1.3},
    {key:'z'},{key:'x'},{key:'c'},{key:'v'},{key:'b'},{key:'n'},
    {key:'m'},{key:','},{key:'.'},{key:';'},{key:'/'},
    {key:'SHIFR', label:'⇧', flex:1.9},
  ],
  [
    {key:'CTRL', label:'Ctrl', flex:1.3},
    {key:'WIN', label:'⊞', flex:1.1},
    {key:'ALT', label:'Alt', flex:1.1},
    {key:'SPC', label:'', flex:5.5},
    {key:'ALTGR', label:'AltGr', flex:1.1},
    {key:'WIN2', label:'⊞', flex:1.1},
    {key:'MENU', label:'☰', flex:1.1},
    {key:'CTRL2', label:'Ctrl', flex:1.3},
  ],
];

// ─── TIPOS ────────────────────────────────────────────────────────────────────

// Texto plano sem separadores — o input HTML não captura \n, então nunca usamos \n no alvo
function flatten(linhas: string[]): string {
  // Se for mais de uma linha, inserimos o enter (\n) entre elas.
  return linhas.join('\n');
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
const TypingEngine: React.FC = () => {
  const { selectedProfile, logout, updateProgress, updateConfig, selectProfile } = useUserStore();
  const { playKey, playError, playStart, playSuccess, playFailure } = useAppSounds();
  
  // Helpers para lidar com dados do Pocketbase que podem vir stringificados


  const config = useMemo(() => selectedProfile?.config || { velocidade: 130, minAcerto: 80, soundEnabled: true }, [selectedProfile]);
  const userProgress = useMemo(() => selectedProfile?.progress || {
    faseIdx: 0, licaoIdx: 0, maxUnlocked: 0, starsByLesson: {}
  }, [selectedProfile]);

  const [faseIdx, setFaseIdx]   = useState(userProgress.faseIdx ?? 0);
  const [licaoIdx, setLicaoIdx] = useState(userProgress.licaoIdx ?? 0);
  const [maxUnlocked, setMaxUnlocked] = useState(userProgress.maxUnlocked ?? 0);

  // Sincroniza estado local se o progresso do usuário mudar (ex: login ou refresh)
  useEffect(() => {
    setFaseIdx(userProgress.faseIdx ?? 0);
    setLicaoIdx(userProgress.licaoIdx ?? 0);
    setMaxUnlocked(userProgress.maxUnlocked ?? 0);
  }, [userProgress.faseIdx, userProgress.licaoIdx, userProgress.maxUnlocked]);

  const [cursorPos, setCursorPos]   = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [inError, setInError]       = useState(false);
  const [startTime, setStartTime]   = useState<number | null>(null);
  const [elapsed, setElapsed]       = useState(0);
  const [isPaused, setIsPaused]     = useState(false);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const [pressedKey, setPressedKey] = useState('');
  const [lastKeyPressStatus, setLastKeyPressStatus] = useState<'correct' | 'wrong' | null>(null);
  const [finished, setFinished]     = useState(false);
  const [showFinalModal, setShowFinalModal] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [animatedStars, setAnimatedStars] = useState(0);

  const [isLost, setIsLost]         = useState(false);
  const [extraScrollOffset, setExtraScrollOffset] = useState(0);
  const [focused, setFocused]       = useState(false);
  const [finalElapsed, setFinalElapsed] = useState(0);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showStartMsg, setShowStartMsg] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenPrompt, setShowFullscreenPrompt] = useState(false);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [m2TutorialSeen, setM2TutorialSeen] = useState(false);
  const [m3TutorialSeen, setM3TutorialSeen] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentStartMsg, setCurrentStartMsg] = useState(MSG_START[0]);

  // Exibe tutorial ao entrar no perfil (somente no início da sessão)
  useEffect(() => {
    // Tutorial do Módulo 1 (Início)
    if (selectedProfile && faseIdx === 0 && licaoIdx < 5 && !tutorialSeen) {
      setTutorialStep(0);
      setShowTutorial(true);
      setTutorialSeen(true);
    }
    // Tutorial do Módulo 2 (Linha Superior)
    if (selectedProfile && faseIdx === 1 && licaoIdx === 0 && !m2TutorialSeen) {
      setTutorialStep(1); // Slide da Linha Superior
      setShowTutorial(true);
      setM2TutorialSeen(true);
    }
    // Tutorial do Módulo 3 (Linha Inferior)
    if (selectedProfile && faseIdx === 2 && licaoIdx === 0 && !m3TutorialSeen) {
      setTutorialStep(2); // Slide da Linha Inferior
      setShowTutorial(true);
      setM3TutorialSeen(true);
    }
  }, [selectedProfile, faseIdx, licaoIdx, tutorialSeen, m2TutorialSeen, m3TutorialSeen]);

  // Sincroniza estado de tela cheia e checa prompt inicial
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const hasPrompted = sessionStorage.getItem('digit_ae_fullscreen_prompted');
    if (!document.fullscreenElement && !hasPrompted) {
      const timer = setTimeout(() => {
        setShowFullscreenPrompt(true);
      }, 800);
      return () => {
        clearTimeout(timer);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Erro ao ativar tela cheia: ${err.message}`);
      });
    } else {
      document.exitFullscreen().catch((err) => {
        console.error(`Erro ao sair da tela cheia: ${err.message}`);
      });
    }
  }, []);

  // ── Sincronização de fase e lição segura ───────────────────────────────────
  const fase  = FASES[faseIdx] || FASES[0];
  const licao = fase.licoes[licaoIdx] || fase.licoes[0];

  const inputRef   = useRef<HTMLInputElement>(null);
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const releaseRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef   = useRef<number | null>(null); // ref para startTime (evita stale em keydown)

  // ── Timer de Alta Precisão (60 FPS para Scrolling) ─────────────────────
  useEffect(() => {
    let requestFrame: number;
    const intervalStart = Date.now();

    const tick = () => {
      const now = Date.now();
      // Cálculo de tempo em segundos com precisão decimal
      const currentSessionSeconds = (now - intervalStart) / 1000;
      setElapsed(accumulatedTime + currentSessionSeconds);
      requestFrame = requestAnimationFrame(tick);
    };

    if (startTime && !finished && !isPaused) {
      if (licao?.isScrolling) {
        requestFrame = requestAnimationFrame(tick);
      } else {
        // Para lições normais, 100ms de intervalo é suficiente e poupa CPU
        timerRef.current = setInterval(() => {
          const now = Date.now();
          const currentSessionSeconds = Math.floor((now - intervalStart) / 1000);
          setElapsed(accumulatedTime + currentSessionSeconds);
        }, 100);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (requestFrame) cancelAnimationFrame(requestFrame);
    };
  }, [startTime, finished, isPaused, accumulatedTime, licao?.isScrolling]);

  const togglePause = useCallback(() => {
    if (!startTime || finished) return;
    if (isPaused) {
      // Retomando
      setIsPaused(false);
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      // Pausando
      setIsPaused(true);
      setAccumulatedTime(elapsed);
    }
  }, [isPaused, startTime, finished, elapsed]);

  // ── Estatísticas ─────────────────────────────────────────────────────────
  const elapsedParaCalc = finished ? finalElapsed : elapsed;
  const { tpm, accuracy, errors } = useMemo(() => {
    const totalAttempts = cursorPos + totalErrors;
    const mins = Math.max(elapsedParaCalc / 60, 1 / 60);
    return {
      tpm:      isLost ? 0 : Math.round(cursorPos / mins),
      accuracy: totalAttempts > 0 ? Math.round((cursorPos / totalAttempts) * 100) : 100,
      errors:   totalErrors,
    };
  }, [cursorPos, totalErrors, elapsedParaCalc, isLost]);

  const totalStars = useMemo(() => {
    if (!userProgress.starsByLesson) return 0;
    return Object.values(userProgress.starsByLesson).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
  }, [userProgress.starsByLesson]);

  const starsCalculated = useMemo(() => {
    if (!finished) return 0;
    let accStars = 0;
    if (accuracy === 100) accStars = 5;
    else if (accuracy >= 98) accStars = 4;
    else if (accuracy >= 95) accStars = 3;
    else if (accuracy >= 90) accStars = 2;
    else accStars = 1;

    let spdStars = 0;
    const ratio = tpm / (config.velocidade || 130);
    if (ratio >= 1.0) spdStars = 5;
    else if (ratio >= 0.85) spdStars = 4;
    else if (ratio >= 0.70) spdStars = 3;
    else if (ratio >= 0.50) spdStars = 2;
    else spdStars = 1;

    return Math.min(10, accStars + spdStars);
  }, [finished, accuracy, tpm, config.velocidade]);

  // ── Sincronização de texto e caracteres ───────────────────────────────────

  // Texto plano e chars sem \n para comparação correta
  const textoTotal = useMemo(() => flatten(licao.linhas), [licao]);
  const chars      = useMemo(() => textoTotal.split(''), [textoTotal]);
  // Offsets acumulados de cada linha para mapeamento de índice global
  const lineOffsets = useMemo(() =>
    licao.linhas.reduce<number[]>((acc, l, i) => {
      const isLast = i === licao.linhas.length - 1;
      const len = l.length + (isLast ? 0 : 1);
      return [...acc, (acc[acc.length-1] ?? 0) + len];
    }, []),
  [licao.linhas]);

  const [endMessage, setEndMessage] = useState('');
  const effectFiredRef = useRef(false);

  useEffect(() => {
    if (!finished) {
      effectFiredRef.current = false;
      return;
    }

    if (finished && !effectFiredRef.current) {
      effectFiredRef.current = true; // Marca como executado para evitar loops

      if (isLost) {
         setEndMessage("Modo scrolling: O tempo acabou!");
         setShowFinalModal(true);
         playFailure();
         return;
      }

      const isPassed = accuracy >= config.minAcerto;
      
      // Simulação de cálculo de pontos
      setIsCalculating(true);
      
      setTimeout(() => {
        setIsCalculating(false);
        setShowFinalModal(true);

        if (isPassed) {
          setEndMessage(MSG_APROVADO[Math.floor(Math.random() * MSG_APROVADO.length)]);
          playSuccess();
          
          // AUTO-SAVE: Salva o progresso imediatamente após a vitória
          const nextL = licaoIdx + 1;
          let newFaseIdx = faseIdx;
          let newLicaoIdx = licaoIdx;
          let newMaxUnlocked = maxUnlocked;

          if (nextL < fase.licoes.length) {
            newMaxUnlocked = Math.max(maxUnlocked, nextL);
            newLicaoIdx = nextL;
          } else if (faseIdx < FASES.length - 1) {
            newMaxUnlocked = 0; 
            newFaseIdx = faseIdx + 1;
            newLicaoIdx = 0;
          } else {
            newLicaoIdx = 0;
          }

          // Dispara salvamento em segundo plano
          updateProgress(newFaseIdx, newLicaoIdx, newMaxUnlocked, tpm, accuracy, licao.key, starsCalculated);
          setMaxUnlocked(newMaxUnlocked);

          // Animação das estrelas em sequência
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setAnimatedStars(count);
            if (count >= starsCalculated) clearInterval(interval);
          }, 100);
        } else {
          setEndMessage(MSG_REPROVADO[Math.floor(Math.random() * MSG_REPROVADO.length)]);
          playFailure();
        }
      }, 1200); // 1.2s de "processamento"
    }
  }, [finished, accuracy, config.minAcerto, playSuccess, playFailure, isLost, starsCalculated, licaoIdx, fase.licoes.length, faseIdx, updateProgress, maxUnlocked, tpm, licao.key]);


  // ── Handler único (modelo bloqueante) ─────────────────────────────────────────────
  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (typeof e.getModifierState === 'function') {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
    if (finished || isPaused) return;
    
    const keyMap: Record<string, string> = {
      Backspace:'BACK', Tab:'TAB', CapsLock:'CAPS', Enter:'ENTER',
      Shift:'SHIFT', Control:'CTRL', Alt:'ALT', ' ':'SPC', Meta:'WIN',
    };
    
    const k = keyMap[e.key] ?? e.key.toLowerCase();
    setPressedKey(k);
    if (releaseRef.current) clearTimeout(releaseRef.current);
    releaseRef.current = setTimeout(() => setPressedKey(''), 200);

    if (e.key.length !== 1 && e.key !== 'Enter') {
       // Just visual reaction for special keys
       setLastKeyPressStatus(null);
       return;
    }
    e.preventDefault();

    const expected = chars[cursorPos];
    const isMatch = (e.key === expected) || (e.key === 'Enter' && expected === '\n');

    if (!startRef.current) {
      const now = Date.now();
      startRef.current = now;
      setStartTime(now);
    }

    if (isMatch) {
      playKey();
      setInError(false);
      setLastKeyPressStatus('correct');
      const next = cursorPos + 1;
      setCursorPos(next);
      if (next === chars.length) {
        setFinalElapsed(elapsed);
        setFinished(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
      
      // Recompensa: se o usuário digitar muito rápido e chegar perto da borda direita, pula o scroll
      if (licao.isScrolling) {
         // Se a distância entre o cursor e o scroll for maior que 480px (quase na borda direita)
         if (cursorDist - scrollOffset > 480) {
            setExtraScrollOffset(prev => prev + 300); // Salta 300px pra frente
         }
      }
    } else {
      playError();
      setInError(true);
      setTotalErrors(prev => prev + 1);
      setLastKeyPressStatus('wrong');
      // Penalidade: Se for modo scrolling, cada erro empurra o texto 48px (aprox 2 letras) à frente
      if (licao.isScrolling) {
        setExtraScrollOffset(prev => prev + 48);
      }
    }
    
    setTimeout(() => {
      setLastKeyPressStatus(null);
    }, 150);
  }, [finished, isLost, isPaused, cursorPos, chars, elapsed]);

  // ── Reset ────────────────────────────────────────────────────────────────
  const resetSession = useCallback((nf?: number, nl?: number) => {
    setCursorPos(0); setTotalErrors(0); setInError(false);
    setStartTime(null); setElapsed(0); setFinalElapsed(0);
    setFinished(false); setIsLost(false); setExtraScrollOffset(0); setPressedKey(''); setIsPaused(false);
    setShowFinalModal(false); setIsCalculating(false); setAnimatedStars(0);
    setAccumulatedTime(0);
    startRef.current = null;
    

    
    if (nf !== undefined) setFaseIdx(nf);
    if (nl !== undefined) setLicaoIdx(nl);
    
    // Tutorial não aparece mais aqui (foi movido para o início da sessão)
    playStart();
    const rand = Math.floor(Math.random() * MSG_START.length);
    setCurrentStartMsg(MSG_START[rand]);
    setShowStartMsg(true);
    setTimeout(() => setShowStartMsg(false), 2000);
    
    setTimeout(() => inputRef.current?.focus(), 60);
  }, [playStart, tutorialSeen, faseIdx]);

  const calcAccuracy = useCallback(() => {
    const total = cursorPos + totalErrors;
    return total > 0 ? Math.round((cursorPos / total) * 100) : 100;
  }, [cursorPos, totalErrors]);



  const avancar = useCallback(() => {
    const acc = calcAccuracy();
    // Salva o progresso sempre local, especialmente as estrelas ganhas!
    if (acc < config.minAcerto) {
      updateProgress(faseIdx, licaoIdx, maxUnlocked, tpm, acc, licao.key, starsCalculated); // saves stars even on fail
      resetSession(faseIdx, licaoIdx);
      return;
    }

    // Agora o salvamento é automático no useEffect de fim de lição
    const nextL = licaoIdx + 1;
    let newFaseIdx = faseIdx;
    let newLicaoIdx = licaoIdx;

    if (nextL < fase.licoes.length) {
      newLicaoIdx = nextL;
    } else if (faseIdx < FASES.length - 1) {
      newFaseIdx = faseIdx + 1;
      newLicaoIdx = 0;
    } else {
      newLicaoIdx = 0;
    }

    resetSession(newFaseIdx, newLicaoIdx);

  }, [licaoIdx, fase.licoes.length, faseIdx, config.minAcerto, resetSession, calcAccuracy, maxUnlocked, updateProgress, tpm, starsCalculated]);

  const irParaLicao = useCallback((idx: number) => {
    if (idx < 0 || idx >= fase.licoes.length) return;
    const isUnlocked = faseIdx < userProgress.faseIdx || (faseIdx === userProgress.faseIdx && idx <= userProgress.maxUnlocked);
    if (!isUnlocked) return;
    resetSession(faseIdx, idx);
  }, [faseIdx, resetSession, fase.licoes.length, userProgress.faseIdx, userProgress.maxUnlocked]);

  const nextCh  = !finished && cursorPos < chars.length ? chars[cursorPos] : '';
  const nextKey = nextCh === ' ' ? 'SPC' : nextCh.toLowerCase();
  // Linha atual pelo offset acumulado
  const linhaAtual = useMemo(() => {
    for (let li = 0; li < lineOffsets.length; li++) {
      if (cursorPos < lineOffsets[li]) return li;
    }
    return licao.linhas.length - 1;
  }, [cursorPos, lineOffsets, licao.linhas.length]);

  // Lógica de Rolagem: Calcula o offset X baseado no tempo (forçada) ou no cursor
  const scrollOffset = useMemo(() => {
    if (!licao.isScrolling) return 0;
    if (!startTime) return 12;

    // Se é modo scrolling, a rolagem é forçada pelo tempo e velocidade mínima
    const timeBasedCharPos = (elapsed / 60) * config.velocidade;
    
    // Calcula o offset real somando a largura de cada caractere + margens (baseado no tempo)
    let offset = 0;
    const charsToSum = Math.floor(timeBasedCharPos);
    for (let i = 0; i < charsToSum; i++) {
       if (i >= chars.length) break;
       offset += 24; 
       if (chars[i] === '.') offset += 100; 
    }
    // Interpola o resto decimal da posição do caractere (para movimento fluido)
    const remainder = timeBasedCharPos - charsToSum;
    if (charsToSum < chars.length) {
       let charWidth = 24 + (chars[charsToSum] === '.' ? 100 : 0);
       offset += remainder * charWidth;
    }

    return offset + 12 + extraScrollOffset;
  }, [elapsed, config.velocidade, licao.isScrolling, startTime, chars, extraScrollOffset]);

  // Distância real percorrida pelo cursor do usuário
  const cursorDist = useMemo(() => {
    let d = 0;
    for (let i = 0; i < cursorPos; i++) {
        if (i >= chars.length) break;
        d += 24;
        if (chars[i] === '.') d += 100;
    }
    return d + 12;
  }, [cursorPos, chars]);

  // Condição de Derrota: Se o caractere atual sair da tela pela esquerda (scroll > cursor + limite)
  useEffect(() => {
    if (licao.isScrolling && startTime && !finished && !isLost && !isPaused) {
       // Se o caractere que o usuário deve digitar está a mais de 500px para trás do centro (scrollOffset), ele perde.
       if (scrollOffset - cursorDist > 500) {
          setIsLost(true);
          setFinished(true);
          setFinalElapsed(elapsed);
       }
    }
  }, [licao.isScrolling, startTime, finished, isLost, isPaused, scrollOffset, cursorDist, elapsed]);

  // Timeline Progress: Quão longe o usuário deveria estar baseado na velocidade mínima
  const targetCursorPos = useMemo(() => {
    if (!startTime || finished || isPaused || !licao.isScrolling) return 0;
    const mins = elapsed / 60;
    return mins * config.velocidade;
  }, [elapsed, config.velocidade, startTime, finished, isPaused, licao.isScrolling]);

  // ─── RENDER ──────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      {/* ── TOPO ──────────────────────────────────────────── */}
      <div style={S.topBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div>
            <div style={S.logo}>Digit.ae</div>
            <div style={S.logoSub}>Tão simples quanto falar</div>
          </div>
          
          <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(139,92,246,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(139,92,246,0.3)' }}>
              <UserIcon size={16} className="text-violet-400" color="#a78bfa" />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}>
                {selectedProfile?.name}
                <span style={{ fontSize: 10, color: '#fbbf24', background: 'rgba(251,191,36,0.1)', padding: '2px 6px', borderRadius: 12, border: '1px solid rgba(251,191,36,0.2)' }}>
                  {totalStars} ⭐
                </span>
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Praticando agora</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {startTime && !finished && (
            <button 
              style={{ ...S.iconBtn, color: isPaused ? '#34d399' : '#fbbf24', width: 'auto', padding: '7px 16px', gap: 8, fontSize: 11, fontWeight: 800 }}
              onClick={togglePause}
            >
              {isPaused ? '▶ RETOMAR' : '⏸ PAUSAR'}
            </button>
          )}

          <div style={{...S.modeToggle, display: 'flex', alignItems: 'center', gap: 12}}>
            <button 
              onClick={() => resetSession(faseIdx - 1, 0)} 
              disabled={faseIdx === 0} 
              style={{ background: 'transparent', border: 'none', color: faseIdx === 0 ? 'rgba(255,255,255,0.1)' : '#a78bfa', cursor: faseIdx === 0 ? 'not-allowed' : 'pointer', fontSize: 16, padding: '0 4px' }}
              title="Módulo Anterior"
            >
              ←
            </button>
            <span style={{ color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight: 700 }}>
              {fase.titulo}
            </span>
            <button 
              onClick={() => resetSession(faseIdx + 1, 0)} 
              disabled={faseIdx >= FASES.length - 1 || faseIdx >= userProgress.faseIdx} 
              style={{ background: 'transparent', border: 'none', color: (faseIdx >= FASES.length - 1 || faseIdx >= userProgress.faseIdx) ? 'rgba(255,255,255,0.1)' : '#a78bfa', cursor: (faseIdx >= FASES.length - 1 || faseIdx >= userProgress.faseIdx) ? 'not-allowed' : 'pointer', fontSize: 16, padding: '0 4px' }}
              title="Próximo Módulo"
            >
              →
            </button>
          </div>

          <button 
            style={{ ...S.iconBtn, color: config.soundEnabled ? '#a78bfa' : '#6b7280' }} 
            onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
            title={config.soundEnabled ? "Mudar para Mudo" : "Ativar Som"}
          >
            {config.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          <button 
            style={{ ...S.iconBtn, color: '#34d399' }} 
            onClick={toggleFullscreen}
            title={isFullscreen ? "Sair da Tela Cheia (F11)" : "Modo Tela Cheia (F11)"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button style={{ ...S.iconBtn, color: '#f87171' }} onClick={logout} title="Sair da Conta">
            <LogOut size={16} />
          </button>

          <button 
            style={{ ...S.iconBtn, color: '#60a5fa' }} 
            onClick={() => selectProfile(null)}
            title="Trocar Aluno"
          >
            <UserIcon size={16} />
          </button>

          <button 
            style={{ ...S.iconBtn, color: '#a78bfa', background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.3)' }} 
            onClick={() => setShowTutorial(true)}
            title="Tutorial de Posição"
          >
            <span style={{ fontSize: 10, fontWeight: 900 }}>DEDOS</span>
          </button>
        </div>
      </div>

      {/* ── PROGRESSO DE LIÇÕES ──────────────────────────── */}
      <div style={S.licaoBar}>
        {fase.licoes.map((l, li) => {
          const lessonStars = (userProgress.starsByLesson as Record<string, number>)?.[l.key];
          const isUnlocked = faseIdx < userProgress.faseIdx || (faseIdx === userProgress.faseIdx && li <= userProgress.maxUnlocked);
          
          return (
            <div key={li} style={S.licaoDot(li === licaoIdx, li < licaoIdx)}>
              <div 
                className={li === licaoIdx ? 'active-lesson-pulse' : ''}
                style={{ ...S.licaoDotCircle(li === licaoIdx, li < licaoIdx), cursor: isUnlocked ? 'pointer' : 'not-allowed' }}
                onClick={() => isUnlocked && irParaLicao(li)}
              >
                {li < licaoIdx ? '✓' : li + 1}
              </div>
              <span style={{ fontSize:9, marginTop:4, color: li===licaoIdx?'#a78bfa': li < licaoIdx ? 'rgba(167, 139, 250, 0.5)' : 'rgba(255,255,255,0.15)', whiteSpace:'nowrap', fontWeight: li === licaoIdx ? 700 : 400 }}>
                L{li+1}
              </span>
              {lessonStars !== undefined && (
                <span style={{ fontSize:10, fontWeight:800, color:'#fbbf24', marginTop: 2 }}>{lessonStars}⭐</span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── CABEÇALHO DA LIÇÃO + NAVEGAÇÃO ──────────────────────────────────── */}
      <div style={{ width:'100%', maxWidth: 1400, display:'flex', flexDirection:'row',
        alignItems:'center', justifyContent:'space-between', gap:12 }}>

        <button
          onClick={() => irParaLicao(licaoIdx - 1)}
          disabled={licaoIdx === 0}
          style={{
            padding:'10px 20px', borderRadius:14, border:'1px solid rgba(255,255,255,0.08)',
            background: licaoIdx === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
            color: licaoIdx === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.5)',
            cursor: licaoIdx === 0 ? 'not-allowed' : 'pointer',
            fontSize:11, fontWeight:800, fontFamily:"'Outfit',sans-serif",
            textTransform: 'uppercase', letterSpacing: '0.05em',
            transition:'all 0.15s', whiteSpace:'nowrap',
          }}
        >
          ← Anterior
        </button>

        <div style={{ textAlign:'center', flex:1 }}>
          <div style={S.licaoTitulo}>{licao.titulo}</div>
          <div style={S.licaoSub}>{licao.subtitulo}</div>
        </div>

        {(() => {
          const proximoIdx = licaoIdx + 1;
          const isProximaUnlocked = faseIdx < userProgress.faseIdx || (faseIdx === userProgress.faseIdx && proximoIdx <= userProgress.maxUnlocked);
          const podeProxima = proximoIdx < fase.licoes.length && isProximaUnlocked;
          return (
            <button
              onClick={() => irParaLicao(licaoIdx + 1)}
              disabled={!podeProxima}
              style={{
                padding:'10px 20px', borderRadius:14,
                border: podeProxima ? '1px solid rgba(139,92,246,0.3)' : '1px solid rgba(255,255,255,0.08)',
                background: podeProxima ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.02)',
                color: podeProxima ? '#c4b5fd' : 'rgba(255,255,255,0.1)',
                cursor: podeProxima ? 'pointer' : 'not-allowed',
                fontSize:11, fontWeight:800, fontFamily:"'Outfit',sans-serif",
                textTransform: 'uppercase', letterSpacing: '0.05em',
                transition:'all 0.15s', whiteSpace:'nowrap',
              }}
            >
              Próxima →
            </button>
          );
        })()}
      </div>


      {/* ── STATS ────────────────────────────────────────── */}
      <div style={S.statsRow}>
        {[
          {l:'TPM', v:tpm, c:'#a78bfa'},
          {l:'Precisão', v:`${accuracy}%`, c:'#34d399'},
          {l:'Erros', v:errors, c:'#f87171'},
          {l:'Tempo', v:`${licao.isScrolling ? elapsed.toFixed(1) : Math.floor(elapsed)}s`, c:'#60a5fa'},
        ].map(s => (
          <div key={s.l} style={S.statCard}>
            <div style={{fontSize:9,fontWeight:700,letterSpacing:'0.2em',textTransform:'uppercase',color:s.c}}>{s.l}</div>
            <div style={{fontSize:22,fontWeight:900,color:'#fff',fontFamily:"'JetBrains Mono',monospace"}}>{s.v}</div>
          </div>
        ))}
        <div style={S.progressWrap}>
          <div style={{fontSize:10,color:'rgba(255,255,255,0.3)',marginBottom:4, display: 'flex', justifyContent: 'space-between'}}>
            <span>Progresso — {Math.round((cursorPos / textoTotal.length) * 100)}%</span>
            {licao.isScrolling && (
              <span style={{color: cursorPos >= targetCursorPos ? '#34d399' : '#f87171'}}>
                {cursorPos >= targetCursorPos ? 'No ritmo ✓' : 'Acelere! ⚡'}
              </span>
            )}
          </div>
          <div style={S.progressBar}>
            <div style={{...S.progressFill,
              width:`${(cursorPos / textoTotal.length) * 100}%`}}/>
          </div>
        </div>
        <button style={S.resetBtn} onClick={() => resetSession(faseIdx, licaoIdx)}>↺ Reiniciar</button>
      </div>

      {/* ── GRADE DE EXERCÍCIO / MODO SCROLLING ───────────────────────────── */}
      <div
        style={{...S.grade, height: licao.isScrolling ? 180 : 'auto', justifyContent: licao.isScrolling ? 'center' : 'flex-start'}}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          ref={inputRef}
          onKeyDown={handleKey}
          onKeyUp={(e) => { if (e.getModifierState) setIsCapsLockOn(e.getModifierState('CapsLock')); }}
          onClick={(e) => { if (e.getModifierState) setIsCapsLockOn(e.getModifierState('CapsLock')); }}
          onFocus={() => { setFocused(true); }}
          onBlur={() => setFocused(false)}
          readOnly
          spellCheck={false} autoComplete="off" autoCorrect="off" autoCapitalize="off"
          style={{ position:'absolute', opacity:0, width:'100%', height:'100%', cursor:'text', zIndex:1 }}
        />

        {licao.isScrolling ? (
          <div style={{ position: 'relative', width: '100%', overflow: 'hidden', height: 120, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: 12 }}>
            
            {/* Linhas de trilha estilo Guitar Hero */}
            <div style={{ position: 'absolute', top: '40%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />
            <div style={{ position: 'absolute', top: '60%', left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.05)' }} />

            <div style={{ 
              display:'flex', 
              alignItems:'center', 
              whiteSpace: 'nowrap',
              position: 'relative',
              left: '50%',
              // Centralizamos o marcador em 50% da largura do container do pai
              transform: `translateX(-${scrollOffset}px)`,
              transition: 'none', // Desativado para permitir animação fluida de 60fps via rAF
            }}>
              {chars.map((ch, gi) => {
                const isCorrecto = gi < cursorPos;
                const isCur      = gi === cursorPos;
                const isCurErr   = isCur && inError;

                return (
                  <span key={gi} style={{
                    display:'inline-block',
                    width: 24,
                    height: 60,
                    lineHeight:'60px',
                    textAlign:'center',
                    fontFamily:"'JetBrains Mono',monospace",
                    fontSize: isCur ? 36 : 28,
                    fontWeight: 800,
                    position:'relative',
                    color:  isCorrecto ? '#34d399'
                          : isCurErr   ? '#f87171'
                          : isCur      ? '#fff'
                          : 'rgba(255,255,255,0.15)',
                    background: isCurErr ? 'rgba(239,68,68,0.3)' : 'transparent',
                    transform: isCur ? 'scale(1.2)' : 'scale(1)',
                    textShadow: isCur ? '0 0 15px rgba(255,255,255,0.5)' : isCorrecto ? '0 0 8px rgba(52,211,153,0.4)' : 'none',
                    transition: 'all 0.1s',
                    filter: isCur ? 'brightness(1.5)' : 'none',
                    // Adiciona um espaço visual extra após o ponto final (que separa as frases)
                    marginRight: ch === '.' ? 100 : 0, 
                  }}>
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                );
              })}
            </div>
            
            {/* Marcador "Strike Zone" (Guitar Hero Style) */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '10%',
              bottom: '10%',
              width: 40,
              marginLeft: -20,
              border: '2px solid #a78bfa',
              borderRadius: 8,
              background: 'rgba(167,139,250,0.1)',
              boxShadow: '0 0 20px rgba(167,139,250,0.4), inset 0 0 10px rgba(167,139,250,0.2)',
              zIndex: 2,
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Brilho pulsante no centro do marcador */}
              <div style={{ 
                width: 4, 
                height: '100%', 
                background: '#a78bfa', 
                opacity: 0.3,
                boxShadow: '0 0 10px #a78bfa'
              }} />
            </div>

            {/* Labels de Ritmo */}
            <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', fontSize: 10, fontWeight: 900, color: '#a78bfa', opacity: 0.6, letterSpacing: '0.1em' }}>
               ZONA DE IMPACTO
            </div>
          </div>
        ) : (
          licao.linhas.map((linha, li) => {
            const startOfLine = lineOffsets[li - 1] ?? 0;
            const isLineAtiva = li === linhaAtual;
            const isLineDone  = li < linhaAtual;
            const isLastLine  = li === licao.linhas.length - 1;
            const charsInLine = isLastLine ? linha.split('') : [...linha.split(''), '\n'];

            return (
              <div key={li} style={S.gradeRow(isLineAtiva, isLineDone)}>
                <div style={S.gradeLineNum(isLineAtiva, isLineDone)}>{li+1}</div>
                <div style={{ display:'flex', flexWrap:'wrap' as const, alignItems:'center', gap:0 }}>
                  {charsInLine.map((ch, ci) => {
                    const gi = startOfLine + ci;
                    const isCorrecto = gi < cursorPos;
                    const isCur      = gi === cursorPos;
                    const isCurErr   = isCur && inError;

                    return (
                      <span key={ci} style={{
                        display:'inline-block',
                        width: ch === ' ' ? 12 : 'auto',
                        minWidth: ch === ' ' ? 12 : 20,
                        height: 40,
                        lineHeight:'40px',
                        textAlign:'center',
                        fontFamily:"'JetBrains Mono',monospace",
                        fontSize: 24,
                        fontWeight: 700,
                        borderRadius: 4,
                        position:'relative',
                        color:  isCorrecto ? '#34d399'
                              : isCurErr   ? '#f87171'
                              : isCur      ? '#fff'
                              : isLineDone ? 'rgba(255,255,255,0.1)'
                              : isLineAtiva ? 'rgba(255,255,255,0.5)'
                              : 'rgba(255,255,255,0.1)',
                        background: isCurErr ? 'rgba(239,68,68,0.2)' : isCur ? 'rgba(139,92,246,0.15)' : 'transparent',
                        borderBottom: isCurErr
                          ? '2px solid #f87171'
                          : isCur ? '2px solid #a78bfa'
                          : '2px solid transparent',
                        textShadow: isCorrecto ? '0 0 10px rgba(52,211,153,0.35)' : isCurErr ? '0 0 8px rgba(248,113,113,0.5)' : 'none',
                        transition: 'color 0.08s, background 0.08s',
                        animation: isCurErr ? 'shake 0.15s ease' : 'none',
                      }}>
                        {ch === ' ' ? '\u00A0' : ch === '\n' ? '↵' : ch}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}

        {isPaused && (
          <div style={S.overlay}>
             <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⏸</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 8 }}>ATIVIDADE PAUSADA</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>O tempo e a timeline estão congelados.</div>
                <button 
                  style={{ ...S.cfgClose, margin: '0 auto', width: 'auto', padding: '12px 32px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}
                  onClick={togglePause}
                >
                  RETOMAR AGORA
                </button>
             </div>
          </div>
        )}

        {showStartMsg && (
          <div style={{ ...S.overlay, background: 'rgba(8,8,15,0.85)', backdropFilter: 'blur(4px)' }}>
             <div style={{ textAlign: 'center', animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', letterSpacing: '0.4em', marginBottom: 4, textTransform: 'uppercase' }}>
                  {currentStartMsg.h}
                </div>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
                  {currentStartMsg.m}
                </div>
             </div>
          </div>
        )}

        {!focused && !finished && !isPaused && (
          <div style={S.overlay}>
            <span style={{fontSize:18}}>⌨️</span>
            <span style={{color:'rgba(167,139,250,0.9)',fontSize:14,fontWeight:600}}>
              Clique aqui · Digite a primeira tecla para começar
            </span>
          </div>
        )}


      </div>

      {!finished && !isPaused && (
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ color:'rgba(255,255,255,0.25)', fontSize:12 }}>Próxima tecla:</span>
          {nextCh && (
            <kbd style={{
              padding:'4px 16px', borderRadius:10,
              background:'rgba(99,102,241,0.18)', border:'1px solid rgba(139,92,246,0.45)',
              color:'#c4b5fd', fontFamily:"'JetBrains Mono',monospace",
              fontWeight:700, fontSize:18,
            }}>
              {nextCh === ' ' ? 'Espaço' : nextCh === '\n' ? 'Enter' : nextCh.toUpperCase()}
            </kbd>
          )}
          {licao.teclasFoco.length > 0 && (
            <span style={{color:'rgba(255,255,255,0.2)',fontSize:11}}>
              Teclas desta lição: [{licao.teclasFoco.join(' ')}]
            </span>
          )}
          {isCapsLockOn && (
            <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, animation: 'blink 1.5s infinite', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 0 12px rgba(239,68,68,0.5)' }}>
               ⚠️ CAPS LOCK ATIVADO
            </span>
          )}
        </div>
      )}

      {/* ── TECLADO ABNT2 ────────────────────────────────── */}
      <div style={S.keyboard}>
        <div style={{textAlign:'center',fontSize:9,color:'rgba(255,255,255,0.15)',
          letterSpacing:'0.2em',textTransform:'uppercase',marginBottom:8}}>
          Teclado ABNT2
        </div>

        {ABNT2_ROWS.map((row, ri) => (
          <div key={ri} style={{ display:'flex', flexDirection:'row', gap:4, justifyContent:'center', width:'100%' }}>
            {row.map(({key, label, flex}) => {
              const displayLabel = label !== undefined ? label : key;
              const match  = key.toLowerCase();
              const isPressed = pressedKey === match || pressedKey === key;
              const isFoco = licao.teclasFoco.includes(match);
              const isNext = match === nextKey || key === nextKey;
              const isCapsActive = key === 'CAPS' && isCapsLockOn;

              return (
                <div key={key} style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  borderRadius:7, height:38,
                  flex: flex ?? 1,
                  minWidth: 0,
                  fontSize: displayLabel.length > 3 ? 9 : 11,
                  fontWeight:800, letterSpacing:'0.05em',
                  textTransform:'uppercase',
                  cursor:'default', transition:'all 0.07s',
                  userSelect:'none', whiteSpace:'nowrap',
                  overflow:'hidden',
                  ...(isCapsActive ? {
                    background:'#ef4444',
                    border:'1px solid #f87171',
                    color:'#fff',
                    boxShadow:'0 0 16px rgba(239,68,68,0.7)',
                  } : isPressed ? {
                    background: lastKeyPressStatus === 'wrong' ? '#ef4444' : 'linear-gradient(135deg,#7c3aed,#4f46e5)',
                    border: '1px solid ' + (lastKeyPressStatus === 'wrong' ? '#f87171' : '#a78bfa'),
                    color: '#fff',
                    transform: 'translateY(2px) scale(0.91)',
                    boxShadow: lastKeyPressStatus === 'wrong' ? '0 0 16px rgba(239,68,68,0.7)' : '0 0 16px rgba(139,92,246,0.7)',
                  } : isNext ? {
                    background:'rgba(59,130,246,0.2)',
                    border:'1px solid rgba(96,165,250,0.7)',
                    color:'#93c5fd',
                    boxShadow:'0 0 10px rgba(59,130,246,0.3)',
                    transform:'translateY(-1px)',
                  } : isFoco ? {
                    background:'rgba(167,139,250,0.1)',
                    border:'1px solid rgba(167,139,250,0.35)',
                    color:'rgba(196,181,253,0.8)',
                    boxShadow:'inset 0 0 8px rgba(139,92,246,0.1)',
                  } : {
                    background:'rgba(255,255,255,0.05)',
                    border:'1px solid rgba(255,255,255,0.09)',
                    color:'rgba(255,255,255,0.35)',
                    boxShadow:'0 2px 0 rgba(0,0,0,0.3)',
                  }),
                }}>
                  {displayLabel}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ── TUTORIAL OVERLAY ──────────────────────────── */}
      {showTutorial && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(35px)', background: 'rgba(5,3,15,0.95)', zIndex: 2000 }}>
           <div style={{ 
             width: '90%', maxWidth: 640, padding: '24px 32px', background: 'rgba(15,10,40,0.6)', 
             border: '1px solid rgba(139,92,246,0.3)', borderRadius: 32, textAlign: 'center',
             boxShadow: '0 30px 100px rgba(0,0,0,0.8)', animation: 'scaleIn 0.3s ease'
           }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
                {TUTORIAL_SLIDES.map((_, i) => (
                  <div key={i} style={{ 
                    width: i === tutorialStep ? 32 : 8, height: 6, borderRadius: 3, 
                    background: i === tutorialStep ? '#a78bfa' : 'rgba(167,139,250,0.2)',
                    transition: 'all 0.3s'
                  }} />
                ))}
              </div>

              <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>
                Passo {tutorialStep + 1} de 3
              </div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
                {TUTORIAL_SLIDES[tutorialStep].title}
              </div>
              
              <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#000', marginBottom: 16, boxShadow: '0 15px 30px rgba(0,0,0,0.4)' }}>
                 <img 
                   src={TUTORIAL_SLIDES[tutorialStep].img} 
                   alt={TUTORIAL_SLIDES[tutorialStep].title} 
                   style={{ width: '100%', display: 'block', height: 260, objectFit: 'cover' }} 
                 />
                 <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px', background: 'linear-gradient(to top, rgba(0,0,0,0.95), transparent)', fontSize: 13, color: 'rgba(255,255,255,0.9)', lineHeight: 1.4 }}>
                    {TUTORIAL_SLIDES[tutorialStep].description}
                 </div>
              </div>

              <div style={{ padding: '12px 20px', borderRadius: 16, background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 24, textAlign: 'left' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#a78bfa', marginBottom: 4, letterSpacing: '0.1em' }}>DICA DE OURO</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
                  {TUTORIAL_SLIDES[tutorialStep].tip}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                {tutorialStep > 0 && (
                  <button 
                    style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '10px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    onClick={() => setTutorialStep(s => s - 1)}
                  >
                    ANTERIOR
                  </button>
                )}

                {tutorialStep < TUTORIAL_SLIDES.length - 1 ? (
                  <button 
                    style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '10px 48px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}
                    onClick={() => setTutorialStep(s => s + 1)}
                  >
                    PRÓXIMO
                  </button>
                ) : (
                  <button 
                    style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '10px 48px', background: 'linear-gradient(135deg,#34d399,#10b981)', border: 'none', color: '#fff', fontSize: 13 }}
                    onClick={() => {
                      setShowTutorial(false);
                      setTutorialSeen(true);
                      setTutorialStep(0);
                      // Inicia sequence de largada
                      playStart();
                      const rand = Math.floor(Math.random() * MSG_START.length);
                      setCurrentStartMsg(MSG_START[rand]);
                      setShowStartMsg(true);
                      setTimeout(() => setShowStartMsg(false), 2000);
                    }}
                  >
                    ENTENDI, VAMOS COMEÇAR!
                  </button>
                )}
              </div>
           </div>
        </div>
      )}

      {/* ── PROMPT DE MODO TELA CHEIA ──────────────────────────── */}
      {showFullscreenPrompt && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(30px)', background: 'rgba(5,3,15,0.95)', zIndex: 3000 }}>
           <div style={{ 
             width: '90%', maxWidth: 440, padding: 32, background: 'rgba(15,10,40,0.6)', 
             border: '1px solid rgba(139,92,246,0.3)', borderRadius: 28, textAlign: 'center',
             boxShadow: '0 30px 100px rgba(0,0,0,0.8)', animation: 'scaleIn 0.3s ease'
           }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📺</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 12, letterSpacing: '-0.02em' }}>
                Modo Tela Cheia
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, marginBottom: 28 }}>
                Deseja ativar a Tela Cheia? Isso expande a área de digitação e ajuda a focar nas lições sem distrações.
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button 
                  style={{ ...S.cfgClose, margin: 0, flex: 1, padding: '12px 20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                  onClick={() => {
                    setShowFullscreenPrompt(false);
                    sessionStorage.setItem('digit_ae_fullscreen_prompted', 'true');
                  }}
                >
                  AGORA NÃO
                </button>
                <button 
                  style={{ ...S.cfgClose, margin: 0, flex: 1, padding: '12px 20px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff' }}
                  onClick={() => {
                    setShowFullscreenPrompt(false);
                    sessionStorage.setItem('digit_ae_fullscreen_prompted', 'true');
                    toggleFullscreen();
                  }}
                >
                  SIM, ATIVAR!
                </button>
              </div>
           </div>
        </div>
      )}

      {/* ── OVERLAY DE CÁLCULO ──────────────────────────── */}
      {isCalculating && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(30px)', background: 'rgba(8,8,15,0.7)', zIndex: 1000 }}>
           <div style={{ textAlign: 'center' }}>
             <div className="calculation-pulse" style={{ fontSize: 64, marginBottom: 24 }}>✨</div>
             <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: '0.1em' }}>CALCULANDO DESEMPENHO...</div>
             <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Analisando velocidade e precisão</div>
           </div>
        </div>
      )}

      {/* ── MODAL GLOBAL DE SUCESSO ──────────────────────────── */}
      {showFinalModal && (
        <div style={{...S.overlay, position: 'fixed', backdropFilter: 'blur(40px)', background: 'rgba(10,5,30,0.85)', zIndex: 1001 }}>
          <div style={{
            textAlign:'center', width:'90%', maxWidth: 640, padding: 48, 
            background: 'linear-gradient(135deg, rgba(30,20,80,0.6), rgba(15,10,40,0.8))', 
            border: '2px solid rgba(139,92,246,0.4)', borderRadius: 40, 
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(139,92,246,0.2)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Efeito de brilho no topo do modal */}
            <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 400, height: 200, background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

            {!isLost && (
               <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 32 }}>
                 {Array.from({ length: 10 }).map((_, i) => (
                   <span key={i} className="star-burst" style={{ 
                     fontSize: 52, 
                     color: i < animatedStars ? '#fbbf24' : 'rgba(255,255,255,0.03)', 
                     filter: i < animatedStars ? 'drop-shadow(0 0 15px rgba(251,191,36,0.6))' : 'none',
                     opacity: i < animatedStars ? 1 : 0.3,
                     transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                   }}>
                     ★
                   </span>
                 ))}
               </div>
            )}

            <div style={{fontSize:22, color: (isLost ? '#ef4444' : '#fbbf24'), fontWeight: 900, marginBottom: 20, letterSpacing: '0.1em' }}>
              {isLost ? 'MISSÃO FRACASSOU' : `${starsCalculated} ESTRELAS CONQUISTADAS`}
            </div>

            <div style={{fontSize:48, fontWeight:900, color: (isLost ? '#ef4444' : accuracy>=config.minAcerto?'#fff':'#f59e0b'), marginBottom: 12, lineHeight: 1 }}>
              {isLost ? 'FIM DE JOGO' : accuracy >= config.minAcerto ? 'LIÇÃO CONCLUÍDA!' : 'NÃO FOI DESTA VEZ'}
            </div>

            <div style={{fontSize:18, color:'rgba(255,255,255,0.6)', marginBottom: 40 }}>
              {accuracy >= config.minAcerto ? 'Excelente progresso! Você está evoluindo rápido.' : 'A precisão foi menor do que o necessário. Vamos tentar de novo?'}
            </div>

            <div style={{fontSize:18, color:'rgba(255,255,255,1)', lineHeight: 1.6, fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '24px 32px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: 40}}>
              "{isLost ? 'O ritmo do texto superou sua velocidade. Mantenha o foco e acelere!' : endMessage}"
            </div>
            
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              {(isLost || accuracy < config.minAcerto) && (
                <button style={{ ...S.cfgClose, margin: 0, width: 'auto', padding: '16px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 14 }} onClick={() => resetSession(faseIdx, licaoIdx)}>
                  ↺ TENTAR NOVAMENTE
                </button>
              )}
              {accuracy >= config.minAcerto && (
                <button style={{...S.cfgClose, margin: 0, width:'auto', padding:'16px 48px', background: 'linear-gradient(135deg,#7c3aed,#4f46e5)', border: 'none', color: '#fff', boxShadow: '0 8px 30px rgba(124,58,237,0.4)', fontSize: 14 }} onClick={avancar}>
                  {licaoIdx < fase.licoes.length-1
                    ? 'PRÓXIMA LIÇÃO →'
                    : faseIdx < FASES.length - 1
                    ? '🎉 AVANÇAR DE FASE'
                    : 'REINICIAR CURSO'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Outfit:wght@400;600;700;900&display=swap');
        * { box-sizing: border-box; }
        body { margin:0; background:#08080f; height: 100vh; overflow: hidden; }
        #root { min-height:100vh; }
        @keyframes blink { from,to{opacity:1} 50%{opacity:0} }
        
        @keyframes starPop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          60% { transform: scale(1.4) rotate(10deg); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        .star-burst {
          animation: starPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes calcPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 20px rgba(139,92,246,0.6)); }
        }
        .calculation-pulse {
          animation: calcPulse 1s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes activePulse {
          0% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.7), 0 0 10px rgba(139,92,246,0.6); transform: scale(1); }
          50% { box-shadow: 0 0 0 10px rgba(167, 139, 250, 0), 0 0 25px rgba(139,92,246,1); transform: scale(1.15); }
          100% { box-shadow: 0 0 0 0 rgba(167, 139, 250, 0), 0 0 10px rgba(139,92,246,0.6); transform: scale(1); }
        }
        .active-lesson-pulse {
          animation: activePulse 1.8s cubic-bezier(0.25, 1, 0.5, 1) infinite;
          background: linear-gradient(135deg, #a78bfa, #7c3aed) !important;
          border: 2px solid #fff !important;
          color: #fff !important;
          z-index: 10;
        }

        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        input[type=range]{-webkit-appearance:none;width:100%;height:4px;border-radius:2px;background:rgba(255,255,255,0.1);outline:none;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#a78bfa;cursor:pointer;}
      `}</style>
    </div>
  );
};

// ─── ESTILOS ─────────────────────────────────────────────────────────────────
const S = {
  page: {
    minHeight:'100vh',
    background:'radial-gradient(ellipse at top,#120d2e 0%,#08080f 65%)',
    display:'flex', flexDirection:'column' as const,
    alignItems:'center', gap:14,
    padding:'20px 16px 32px',
    fontFamily:"'Outfit','Inter',system-ui,sans-serif",
    userSelect:'none' as const,
    overflowX:'hidden' as const,
  },
  topBar: {
    width:'100%', maxWidth: 1400,
    display:'flex', flexDirection:'row' as const,
    alignItems:'center', justifyContent:'space-between', gap:12,
  },
  logo: {
    fontSize:30, fontWeight:900, lineHeight:1,
    background:'linear-gradient(135deg,#a78bfa,#60a5fa,#34d399)',
    WebkitBackgroundClip:'text' as const, WebkitTextFillColor:'transparent' as const,
    letterSpacing:'-0.03em',
  },
  logoSub: {
    fontSize:9, color:'rgba(255,255,255,0.2)',
    letterSpacing:'0.2em', textTransform:'uppercase' as const, marginTop:2,
  },
  modeToggle: {
    padding:'8px 16px', borderRadius:12,
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
  },
  iconBtn: {
    background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
    borderRadius:10, padding:'7px 12px', cursor:'pointer', fontSize:16,
    display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  configPanel: {
    width:'100%', maxWidth: 1400,
    background:'rgba(15,10,40,0.97)', border:'1px solid rgba(139,92,246,0.3)',
    borderRadius:18, padding:'22px 26px', boxShadow:'0 8px 40px rgba(0,0,0,0.5)',
  },
  cfgTitle: { fontSize:15, fontWeight:900, color:'#fff', marginBottom:16 },
  cfgLabel: {
    display:'flex' as const, justifyContent:'space-between', alignItems:'center',
    fontSize:12, color:'rgba(255,255,255,0.55)', marginBottom:8,
  },
  sliderRow: {
    display:'flex', flexDirection:'row' as const, alignItems:'center', gap:10,
  },
  hint: { fontSize:10, color:'rgba(255,255,255,0.3)', minWidth:26 },
  slider: { flex:1 },
  speedTags: {
    display:'flex', flexDirection:'row' as const, gap:6, marginTop:12, flexWrap:'wrap' as const,
  },
  tag: (active: boolean): React.CSSProperties => ({
    padding:'7px 12px', borderRadius:8, cursor:'pointer', border:'none',
    background: active ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)',
    color: active ? '#c4b5fd' : 'rgba(255,255,255,0.4)',
    fontWeight:700, fontSize:10, textAlign:'center',
    fontFamily:"'Outfit',sans-serif",
    outline: active ? '1px solid rgba(139,92,246,0.5)' : 'none',
    transition:'all 0.15s',
  }),
  cfgClose: {
    display:'block', width:'100%', padding:'9px 0', borderRadius:10,
    background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)',
    color:'#a78bfa', cursor:'pointer', fontSize:12, fontWeight:700,
    fontFamily:"'Outfit',sans-serif", marginTop:16, transition:'all 0.15s',
  },
  licaoBar: {
    width:'100%', maxWidth: 1400,
    display:'flex', flexDirection:'row' as const,
    alignItems:'flex-start', gap:0,
  },
  licaoDot: (_a: boolean, _d: boolean): React.CSSProperties => ({
    display:'flex', flexDirection:'column', alignItems:'center', flex:1, cursor:'default',
  }),
  licaoDotCircle: (active: boolean, done: boolean): React.CSSProperties => ({
    width:26, height:26, borderRadius:'50%',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:10, fontWeight:900,
    background: done ? '#7c3aed' : active ? 'linear-gradient(135deg,#7c3aed,#4f46e5)' : 'rgba(255,255,255,0.07)',
    border: active ? '2px solid #a78bfa' : '2px solid rgba(255,255,255,0.1)',
    color: done || active ? '#fff' : 'rgba(255,255,255,0.25)',
    boxShadow: active ? '0 0 10px rgba(139,92,246,0.45)' : 'none',
  }),
  licaoHeader: {
    width:'100%', maxWidth: 1400, textAlign:'center' as const,
  },
  licaoTitulo: {
    fontSize:20, fontWeight:900, color:'#fff',letterSpacing:'-0.02em',
  },
  licaoSub: {
    fontSize:12, color:'rgba(255,255,255,0.4)', marginTop:2,
  },
  statsRow: {
    width:'100%', maxWidth: 1400,
    display:'flex', flexDirection:'row' as const,
    alignItems:'center', gap:8, flexWrap:'wrap' as const,
  },
  statCard: {
    display:'flex', flexDirection:'column' as const, alignItems:'center', gap:1,
    padding:'8px 16px', borderRadius:12,
    background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)',
    minWidth:68,
  },
  progressWrap: {
    flex:1, display:'flex', flexDirection:'column' as const, minWidth:120,
  },
  progressBar: {
    width:'100%', height:4, borderRadius:999, background:'rgba(255,255,255,0.06)', overflow:'hidden',
  },
  progressFill: {
    height:'100%', borderRadius:999,
    background:'linear-gradient(to right,#7c3aed,#3b82f6,#06b6d4)',
    transition:'width 0.2s',
  },
  resetBtn: {
    padding:'8px 16px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)',
    background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.5)',
    cursor:'pointer', fontSize:12, fontWeight:700,
    fontFamily:"'Outfit',sans-serif", transition:'all 0.15s',
  },
  grade: {
    position:'relative' as const,
    width:'100%', maxWidth: 1400,
    borderRadius:18, padding:'20px 28px',
    background:'rgba(255,255,255,0.025)',
    border:'1px solid rgba(255,255,255,0.07)',
    display:'flex', flexDirection:'column' as const, gap:6,
    cursor:'text',
    boxShadow:'inset 0 1px 0 rgba(255,255,255,0.04)',
    overflow:'hidden',
  },
  gradeRow: (active: boolean, done: boolean): React.CSSProperties => ({
    display:'flex', flexDirection:'row', alignItems:'center', gap:8,
    padding:'4px 0',
    borderLeft: active ? '3px solid #a78bfa' : '3px solid transparent',
    paddingLeft: 8,
    opacity: done ? 0.4 : 1,
    transition:'opacity 0.3s',
  }),
  gradeLineNum: (active: boolean, _done: boolean): React.CSSProperties => ({
    fontSize:10, fontWeight:700, color: active ? '#a78bfa' : 'rgba(255,255,255,0.2)',
    width:14, textAlign:'right', flexShrink:0,
  }),
  overlay: {
    position:'absolute' as const, inset:0, zIndex:10,
    display:'flex', alignItems:'center', justifyContent:'center', gap:10,
    background:'rgba(8,8,15,0.9)', backdropFilter:'blur(8px)', borderRadius:18,
  },
  keyboard: {
    width:'100%', maxWidth: 1400, borderRadius:18,
    background:'rgba(255,255,255,0.02)',
    border:'1px solid rgba(255,255,255,0.07)',
    padding:'14px 10px 12px',
    display:'flex', flexDirection:'column' as const, gap:4,
    boxShadow:'inset 0 -2px 0 rgba(0,0,0,0.3)',
  },
};

export default TypingEngine;

export interface Licao {
  id: number;
  dbId?: string;
  titulo: string;
  subtitulo: string;
  linhas: string[];
  teclasFoco: string[];
  key: string;
  isScrolling?: boolean;
  ordem?: number;
}

export interface Fase {
  id?: string;
  titulo: string;
  descricao: string;
  licoes: Licao[];
  ordem?: number;
}

export const TEXTO_MODULO_3 = "o rato preto roeu a rede. a porta da sala de estar esta aberta. paula pediu aquele prato de peixe frito. hoje o dia esta legal para caminhar perto do lago. o poeta escreve o texto direto no papel. a grafite do lapis quebrou. tudo esta quase pronto para a festa de hoje. o gato pula o muro alto e foge para a rua. jorge quer ler o jornal que esta ali. a pipa subiu alto no ar. falta sorte para aquele jogador de elite. o teclado do computador esta quieto. a ideia era sair cedo para o teatro. agora a luz do sol brilha forte.";

export const TEXTO_MODULO_3_DESAFIO = "o café esta quente, mas o pão com mel ja acabou. a vida na cidade exige calma, foco e muita coragem. fiz o exame de vista hoje e tudo parece exato. o juiz deu o prazo final para o processo. talvez a gente possa viajar de navio ou de avião no verão. a caixa de madeira trazia um xale azul e uma foto antiga. o rapaz era muito capaz, mas precisava de mais prática no teclado. marchar no campo exige ritmo e força. a luz do sol brilha na mesa da sala. por favor, feche a porta e traga o jornal agora. o sucesso vem para quem treina com zelo e paciência. o ponto final indica que a lição acabou.";

export const TEXTO_MODULO_4 = "o vento soprava forte na varanda da casa amarela. as folhas secas dançavam pelo quintal enquanto o gato observava tudo de cima do muro. dona clara preparava um bolo de fuba para o cafe da tarde e o cheiro se espalhava pela rua inteira. os vizinhos sorriam e acenavam da janela. era um dia simples, daqueles que a gente guarda na memoria sem nem saber por que. a vida tem dessas coisas bonitas e gratuitas que so a rotina revela.";

export const TEXTO_MODULO_5 = "havia uma vez um velho relojoeiro que morava no alto da colina. todos os dias, ele subia as escadas de madeira ate sua oficina e se sentava diante de dezenas de relogios antigos, cada um marcando uma hora diferente. ele dizia que o tempo nao existia dentro daquelas paredes, que cada ponteiro girava no seu proprio ritmo, assim como as pessoas. um dia, uma menina entrou na loja e perguntou se ele consertava relogios quebrados. o velho sorriu e respondeu que so consertava aqueles que ainda tinham vontade de funcionar.";

export const TEXTO_MODULO_6 = "no dia 15 de Março de 2024, a empresa TechSol Brasil S.A. inaugurou sua nova sede na Av. Paulista, 1500, em São Paulo. o evento contou com 320 convidados e 12 palestrantes internacionais. o CEO Carlos Mendes anunciou a contratação de 50 novos funcionarios e a meta de R$ 10 milhões em faturamento ate Dezembro. foi um marco histórico.";

export const TEXTO_MODULO_7 = "prezado(a) Sr(a). Carlos Almeida, agradecemos seu contato (protocolo #4521-2026). conforme solicitado, enviamos o orçamento revisado: Item 1 — R$ 350,00; Item 2 — R$ 890,50; Taxa de serviço (5%) — R$ 62,03; Total = R$ 1.302,53. o pagamento pode ser feito via PIX (chave: financeiro@empresa.com) ou boleto com vencimento em 20/07/2026. duvidas? Ligue: (11) 3456-7890. Atenciosamente, Equipe Comercial.";

export const TEXTO_MODULO_8 = "todas as manhas ele saia cedo para andar pelo parque perto de casa. o caminho era simples e tranquilo, com passaros cantando e o sol ainda fraco atras das arvores. ele gostava de sentir o vento no rosto enquanto pensava nas coisas simples da vida. algumas pessoas passavam correndo, outras caminhavam devagar com seus cachorros. tudo era calmo e perfeito.";

export const TEXTO_MODULO_9 = "Ilmo. Sr. Diretor de Compras, vimos por meio desta apresentar nossa proposta comercial para fornecimento de materiais de escritorio. nossa empresa atua no mercado desde 2005 e atende mais de 300 clientes corporativos em todo o Brasil. os valores unitarios seguem na tabela anexa, com desconto progressivo a partir de R$ 5.000,00. o prazo de entrega e de ate 7 dias uteis e o pagamento pode ser parcelado em ate 12 vezes. colocamo-nos a disposicao para uma reuniao presencial ou por videochamada. Cordialmente, Equipe Comercial.";

export const TEXTO_MODULO_10 = "prezados membros do Conselho Diretor, apresentamos a seguir o relatorio consolidado do 3º trimestre de 2026. a receita liquida atingiu R$ 2.847.300,00 — um crescimento de 18,7% em relacao ao mesmo periodo do ano anterior (R$ 2.400.000,00). os custos operacionais totalizaram R$ 1.120.450,80, resultando em um lucro operacional de R$ 1.726.849,20. destacamos: (1) abertura de 3 novas filiais em Campinas, Curitiba e Belo Horizonte; (2) contratação de 42 colaboradores — sendo 15 para TI e 27 para operacoes; (3) lancamento da plataforma digital (app mobile + web) com investimento de R$ 480.000,00. para o 4º trimestre, a projecao e de R$ 3.100.000,00 em receita. Contatos: diretoria@empresa.com — Tel: (11) 4002-8922.";

export const DEFAULT_FASES: Fase[] = [
  {
    titulo: 'Fase 1 — Treinando os Dedos',
    descricao: 'Posição básica das mãos: dedo indicador esquerdo no F, indicador direito no J',
    ordem: 1,
    licoes: [
      { 
        id: 1, key: 'm1-l1', titulo: 'Lição 1', subtitulo: 'Posição Base: A S D F e Ç L K J', 
        linhas: [
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('asdf çlkj').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','ç','l','k','j'],
        ordem: 1
      },
      { 
        id: 2, key: 'm1-l2', titulo: 'Lição 2', subtitulo: 'Inversão: F D S A e J K L Ç', 
        linhas: [
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('fdsa jklç').join(' ')
        ], 
        teclasFoco: ['f','d','s','a','j','k','l','ç'],
        ordem: 2
      },
      { 
        id: 3, key: 'm1-l3', titulo: 'Lição 3', subtitulo: 'Mesclagem de Sequências', 
        linhas: [
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('fdsa jklç').join(' '),
          Array(4).fill('asdf çlkj').join(' '),
          Array(4).fill('fdsa jklç').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','j','k','l','ç'],
        ordem: 3
      },
      { 
        id: 4, key: 'm1-l4', titulo: 'Lição 4', subtitulo: 'Variações de Coordenação', 
        linhas: [
          'asdf çlkj fdsa jklç asdf çlkj fdsa jklç',
          'çlkj asdf jklç fdsa çlkj asdf jklç fdsa',
          'fdsa jklç asdf çlkj fdsa jklç asdf çlkj',
          'jklç fdsa çlkj asdf jklç fdsa çlkj asdf'
        ], 
        teclasFoco: ['a','s','d','f','j','k','l','ç'],
        ordem: 4
      },
      { 
        id: 5, key: 'm1-l5', titulo: 'Lição 5', subtitulo: 'Ampliando para o G', 
        linhas: [
          Array(4).fill('asdfg çlkj').join(' '),
          Array(4).fill('asdfg çlkj').join(' '),
          Array(4).fill('asdfg çlkj').join(' '),
          Array(4).fill('asdfg çlkj').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','g','ç','l','k','j'],
        ordem: 5
      },
      { 
        id: 6, key: 'm1-l6', titulo: 'Lição 6', subtitulo: 'Retorno com G', 
        linhas: [
          Array(4).fill('gfdsa jklç').join(' '),
          Array(4).fill('gfdsa jklç').join(' '),
          Array(4).fill('gfdsa jklç').join(' '),
          Array(4).fill('gfdsa jklç').join(' ')
        ], 
        teclasFoco: ['g','f','d','s','a','j','k','l','ç'],
        ordem: 6
      },
      { 
        id: 7, key: 'm1-l7', titulo: 'Lição 7', subtitulo: 'Linha Central Completa: G e H', 
        linhas: [
          Array(4).fill('asdfg hjklç').join(' '),
          Array(4).fill('asdfg hjklç').join(' '),
          Array(4).fill('asdfg hjklç').join(' '),
          Array(4).fill('asdfg hjklç').join(' ')
        ], 
        teclasFoco: ['a','s','d','f','g','h','j','k','l','ç'],
        ordem: 7
      },
      { 
        id: 8, key: 'm1-l8', titulo: 'Lição 8', subtitulo: 'Retorno: Linha Central Completa', 
        linhas: [
          Array(4).fill('gfdsa çlkjh').join(' '),
          Array(4).fill('gfdsa çlkjh').join(' '),
          Array(4).fill('gfdsa çlkjh').join(' '),
          Array(4).fill('gfdsa çlkjh').join(' ')
        ], 
        teclasFoco: ['g','f','d','s','a','ç','l','k','j','h'],
        ordem: 8
      },
    ],
  },
  {
    titulo: 'Módulo 2 — Linha Superior',
    descricao: 'Aprendendo a usar a linha superior do teclado',
    ordem: 2,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
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
        ordem: 6
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
        ordem: 7
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
        ordem: 8
      },
      {
        id: 9, key: 'm2-l9', titulo: 'Desafio de Fluxo', subtitulo: 'Mantenha o ritmo enquanto o texto desliza',
        linhas: [TEXTO_MODULO_3], teclasFoco: [], isScrolling: true,
        ordem: 9
      }
    ],
  },
  {
    titulo: 'Módulo 3 — A Linha Inferior',
    descricao: 'Dominando as teclas V, M, C, X, Z e pontuação básica',
    ordem: 3,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
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
        ordem: 6
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
        ordem: 7
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
        ordem: 8
      },
      {
        id: 9, key: 'm3-l9', titulo: 'Desafio de Fluxo', subtitulo: 'Mantenha o ritmo enquanto o texto desliza',
        linhas: [TEXTO_MODULO_3_DESAFIO], teclasFoco: [], isScrolling: true,
        ordem: 9
      }
    ]
  },
  {
    titulo: 'Módulo 4 — Consolidação e Ritmo',
    descricao: 'Consolidando o teclado inteiro com palavras e frases do dia a dia',
    ordem: 4,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm4-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Mantenha o ritmo enquanto o texto desliza',
        linhas: [TEXTO_MODULO_4], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  },
  {
    titulo: 'Módulo 5 — Fluência Avançada',
    descricao: 'Textos, pontuação e expressão escrita com confiança',
    ordem: 5,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm5-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Uma pequena crônica para fluência total',
        linhas: [TEXTO_MODULO_5], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  },
  {
    titulo: 'Módulo 6 — Números, Maiúsculas e Shift',
    descricao: 'A fileira superior com números e o domínio das teclas Shift',
    ordem: 6,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm6-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Texto com números, datas e nomes próprios',
        linhas: [TEXTO_MODULO_6], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  },
  {
    titulo: 'Módulo 7 — Símbolos e Pontuação Avançada',
    descricao: 'Arroba, cifrão, parênteses e toda a pontuação especial',
    ordem: 7,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm7-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Texto rico em símbolos e formatação profissional',
        linhas: [TEXTO_MODULO_7], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  },
  {
    titulo: 'Módulo 8 — Velocidade com Bigramas e Trigramas',
    descricao: 'Padrões de alta frequência para acelerar sua digitação',
    ordem: 8,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm8-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Bigramas e palavras em ritmo acelerado',
        linhas: [TEXTO_MODULO_8], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  },
  {
    titulo: 'Módulo 9 — Textos do Mundo Real',
    descricao: 'E-mails, currículos, notícias e comunicações profissionais',
    ordem: 9,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm9-l6', titulo: 'Desafio de Fluxo', subtitulo: 'Carta comercial completa',
        linhas: [TEXTO_MODULO_9], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  },
  {
    titulo: 'Módulo 10 — Desafio Final Integrado',
    descricao: 'Consolidando tudo: números, símbolos, maiúsculas e textos complexos',
    ordem: 10,
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
        ordem: 1
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
        ordem: 2
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
        ordem: 3
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
        ordem: 4
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
        ordem: 5
      },
      {
        id: 6, key: 'm10-l6', titulo: 'Desafio Final', subtitulo: 'O grande teste de tudo que voce aprendeu',
        linhas: [TEXTO_MODULO_10], teclasFoco: [], isScrolling: true,
        ordem: 6
      }
    ]
  }
];

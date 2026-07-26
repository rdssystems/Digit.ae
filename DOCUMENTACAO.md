# Manual do Sistema Digit.ae

O **Digit.ae** é uma plataforma moderna e interativa para o ensino e prática de digitação (datilografia) baseada em memória muscular. Desenvolvido com foco em alta fidelidade visual, feedback sonoro dinâmico e gamificação, o app foi desenhado para proporcionar foco total e evolução contínua ao aluno.

---

## 🚀 Como a Aplicação Funciona (Mecânicas e Funcionalidades)

### 1. Sistema de Contas e Perfis de Alunos
* **Contas de Acesso (Administrador/Assinante):** O usuário faz o login principal com e-mail e senha. Esta conta pode representar um professor, uma escola ou o chefe de uma família.
* **Perfis Multi-Usuário (Alunos):** Dentro de uma única conta de acesso, é possível criar múltiplos perfis de alunos (ex: filhos, alunos da escola ou colegas). 
  - Cada aluno tem seu próprio nome e configurações de metas.
  - **Senha do Perfil (Opcional):** Um aluno pode colocar uma senha em seu perfil para evitar que outros acessem ou alterem seu progresso.
  - **Gerenciador de Perfis:** Na tela inicial de seleção (*"Quem está digitando?"*), o administrador pode alternar para o modo de gerenciamento para editar metas (velocidade de TPM e precisão mínima), alterar/redefinir senhas, ou excluir perfis.

### 2. Bloqueio e Evolução de Progresso (Trilha de Aprendizado)
* **Fluxo Vermelho/Bloqueado:** Para garantir a fixação da memória muscular, o aluno não pode pular lições ou módulos. Uma lição só é desbloqueada quando a lição anterior for concluída com sucesso.
* **Critérios de Conclusão:** O aluno deve digitar o texto e atingir as metas configuradas em seu perfil (velocidade em TPM - Toques Por Minuto - e Precisão Mínima em %).
* **Sistema de Estrelas (Gamificação):** Ao concluir uma lição, o aluno recebe estrelas (de 1 a 3) com base em seu desempenho:
  - ⭐ **1 Estrela:** Completou a lição, mas ficou abaixo ou raspando nas metas recomendadas.
  - ⭐⭐ **2 Estrelas:** Bom desempenho, alcançando a meta do perfil.
  - ⭐⭐⭐ **3 Estrelas:** Desempenho excelente, superando a velocidade e precisão exigidas.

### 3. Feedback Interativo e Acessibilidade
* **Teclado Virtual Dinâmico:** Um teclado ABNT2 virtual é exibido na parte inferior da tela. Ele destaca em roxo qual tecla o aluno deve pressionar em seguida, auxiliando na digitação sem olhar para as mãos.
* **Sons de Feedback:** Efeitos sonoros reais de teclado mecânico tocam a cada tecla pressionada. Há um som especial de "sucesso" ao finalizar lições, um "buzzer" de erro em caso de toques errados, e alertas de Caps Lock ativo.
* **Modo Tela Cheia (F11 Nativo):** O app convida o aluno a entrar em modo tela cheia na primeira inicialização da sessão para ocultar distrações (abas do navegador e barras do sistema operacional) e maximizar a área de digitação.

### 4. Modos de Exercício
* **Modo Grade Tradicional (Foco na Precisão):** O texto é exibido em linhas sequenciais enumeradas. O aluno visualiza o cursor sobre a letra atual e digita linha a linha. Letras corretas ficam verdes e erros são destacados em vermelho.
* **Modo Scrolling (Guitar Hero / Fluxo Contínuo):** Ideal para lições de fluxo e agilidade. O texto desliza horizontalmente da direita para a esquerda e o aluno deve pressionar a tecla exatamente quando ela passa pela **"Zona de Impacto"** no centro, exigindo ritmo e fluência constante.

---

## 🛠️ Stack Tecnológica & Arquitetura

A aplicação utiliza uma arquitetura moderna e dividida em microsserviços leves rodando localmente ou na VPS:

* **Frontend:** React 19, Vite, TypeScript, TailwindCSS (estilização inline premium e flexbox).
* **Banco de Dados & Autenticação:** **PocketBase (Go)** rodando na porta `8090`, gerenciando usuários, a tabela relacionável `profiles` (perfis de alunos), migrações de esquema automáticas e segurança.
* **API Server:** Servidor **Express (Node.js)** rodando na porta `3001` localmente e na VPS. Ele serve o build estático do Vite (`dist/`) e hospeda endpoints de cache e validação de sessão em offline fallback.
* **Gerenciamento de Processos:** Gerenciado via **PM2** na VPS (`server` e `pocketbase` independentes), garantindo reinicialização em caso de falhas.

---

## 📚 Estrutura Completa de Módulos e Lições

Aqui está o currículo completo das fases de digitação do **Digit.ae**:

### Fase 1 — Treinando os Dedos
*Foco: Posição básica das mãos na linha central (dedo indicador esquerdo no F, indicador direito no J).*
* **Lição 1:** Posição Base: A S D F e Ç L K J
* **Lição 2:** Inversão: F D S A e J K L Ç
* **Lição 3:** Mesclagem de Sequências (coordenação alternada)
* **Lição 4:** Variações de Coordenação
* **Lição 5:** Ampliando para o G (linha central esquerda)
* **Lição 6:** Retorno com G
* **Lição 7:** Linha Central Completa: G e H
* **Lição 8:** Retorno: Linha Central Completa

### Módulo 2 — Linha Superior
*Foco: Movimento vertical dos dedos para alcançar a fileira de cima do teclado.*
* **Lição 1:** Implementando "e" e "i"
* **Lição 2:** Implementando "r" e "u"
* **Lição 3:** Implementando "t" e "y"
* **Lição 4:** Implementando "q" e "p"
* **Lição 5:** Prática de Integração (palavras completas da linha superior)
* **Lição 6:** Alternância Rápida (Mão Esquerda / Mão Direita)
* **Lição 7:** Palavras de Alta Frequência
* **Lição 8:** Desafio de Precisão
* **Lição 9:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 3 — A Linha Inferior
*Foco: Movimento vertical inferior com os dedos indicador, médio e anelar.*
* **Lição 1:** Introdução das teclas V e M
* **Lição 2:** Introdução das teclas C e Vírgula (,)
* **Lição 3:** Introdução das teclas X e Ponto (.)
* **Lição 4:** Introdução das teclas Z e Barra (/)
* **Lição 5:** Consolidação e Salto de Linhas (C, V, M, X, Z)
* **Lição 6:** Frases Curtas (Ritmo de digitação)
* **Lição 7:** Foco em Pontuação: Vírgula e Ponto
* **Lição 8:** O Grande Mix - Teclado Inteiro
* **Lição 9:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 4 — Consolidação e Ritmo
*Foco: Digitação de palavras reais, dígrafos brasileiros e acentuação gráfica.*
* **Lição 1:** Palavras Cotidianas (2 a 4 letras)
* **Lição 2:** Frases Curtas do Cotidiano
* **Lição 3:** Fonemas e Dígrafos: lh, nh, ch, rr, ss
* **Lição 4:** Acentuação e Cedilha: o toque brasileiro (acento agudo, circunflexo, til e ç)
* **Lição 5:** Frases de Ritmo Controlado
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 5 — Fluência Avançada
*Foco: Estruturas complexas, diálogos e parágrafos completos.*
* **Lição 1:** Palavras Técnicas e Científicas
* **Lição 2:** Frases Descritivas: cenas curtas
* **Lição 3:** Pontuação e Diálogo: o texto ganha voz (hífen, ponto de interrogação/exclamação)
* **Lição 4:** Frases Longas com Estrutura
* **Lição 5:** Parágrafo Integrado (textos corridos estilo crônica)
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 6 — Números, Maiúsculas e Shift
*Foco: A fileira superior numérica e o uso preciso das duas teclas Shift.*
* **Lição 1:** Números Básicos: a fileira numérica
* **Lição 2:** Datas e Telefones: formatos numéricos do dia a dia
* **Lição 3:** Maiúsculas com Shift: nomes próprios e lugares
* **Lição 4:** Siglas e Abreviações: alternando Shift com agilidade
* **Lição 5:** Frases com Números e Maiúsculas
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 7 — Símbolos e Pontuação Avançada
*Foco: Símbolos especiais usados em escritórios e computação (@, $, #, parênteses, colchetes).*
* **Lição 1:** Símbolos Comuns: @, #, $, %, &, *
* **Lição 2:** Parênteses, Colchetes e Chaves
* **Lição 3:** Aspas, Apóstrofo e Travessão
* **Lição 4:** E-mails e Formatos Profissionais
* **Lição 5:** Textos com Riqueza Gráfica
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 8 — Velocidade com Bigramas e Trigramas
*Foco: Agilidade e repetição de padrões e combinações de letras mais comuns na língua portuguesa.*
* **Lição 1:** Bigramas Frequentes: pares mais comuns (de, es, ra, os...)
* **Lição 2:** Bigramas Frequentes: mais pares comuns (ta, re, ma, do...)
* **Lição 3:** Trigramas Comuns: três letras velozes (ent, est, men...)
* **Lição 4:** Palavras Curtas em Rajada (burst typing)
* **Lição 5:** Sprints de Velocidade: palavras comuns em sequência
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 9 — Textos do Mundo Real
*Foco: Prática voltada para a escrita profissional, receitas, notícias e redes sociais.*
* **Lição 1:** E-mail Profissional: saudação e despedida formal
* **Lição 2:** Currículo e Dados Pessoais
* **Lição 3:** Notícia Curta: manchete, lide e corpo
* **Lição 4:** Receita Culinária: instruções passo a passo
* **Lição 5:** Mensagem Corporativa: WhatsApp e comunicados
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

### Módulo 10 — Desafio Final Integrado
*Foco: O teste definitivo de digitação misturando todos os recursos do teclado.*
* **Lição 1:** Mix de Estilos: alternando padrões (boletos, CPF, e-mails na mesma frase)
* **Lição 2:** Edital e Documento Legal
* **Lição 3:** Tabela e Dados Financeiros
* **Lição 4:** FAQ e Suporte Técnico
* **Lição 5:** Redação de Opinião: mini artigo argumentativo
* **Lição 6:** **Desafio de Fluxo (Modo Scrolling)**

---

## 📝 Textos das Lições (Gabarito de Exercícios)

Abaixo estão listados os textos originais que o aluno deve digitar em cada uma das lições de todos os módulos.

### Fase 1 — Treinando os Dedos
* **Lição 1 (Posição Base):**
  - `asdf çlkj asdf çlkj asdf çlkj asdf çlkj`
  - `asdf çlkj asdf çlkj asdf çlkj asdf çlkj`
  - `asdf çlkj asdf çlkj asdf çlkj asdf çlkj`
  - `asdf çlkj asdf çlkj asdf çlkj asdf çlkj`
* **Lição 2 (Inversão):**
  - `fdsa jklç fdsa jklç fdsa jklç fdsa jklç`
  - `fdsa jklç fdsa jklç fdsa jklç fdsa jklç`
  - `fdsa jklç fdsa jklç fdsa jklç fdsa jklç`
  - `fdsa jklç fdsa jklç fdsa jklç fdsa jklç`
* **Lição 3 (Mesclagem de Sequências):**
  - `asdf çlkj asdf çlkj asdf çlkj asdf çlkj`
  - `fdsa jklç fdsa jklç fdsa jklç fdsa jklç`
  - `asdf çlkj asdf çlkj asdf çlkj asdf çlkj`
  - `fdsa jklç fdsa jklç fdsa jklç fdsa jklç`
* **Lição 4 (Variações de Coordenação):**
  - `asdf çlkj fdsa jklç asdf çlkj fdsa jklç`
  - `çlkj asdf jklç fdsa çlkj asdf jklç fdsa`
  - `fdsa jklç asdf çlkj fdsa jklç asdf çlkj`
  - `jklç fdsa çlkj asdf jklç fdsa çlkj asdf`
* **Lição 5 (Ampliando para o G):**
  - `asdfg çlkj asdfg çlkj asdfg çlkj asdfg çlkj`
  - `asdfg çlkj asdfg çlkj asdfg çlkj asdfg çlkj`
  - `asdfg çlkj asdfg çlkj asdfg çlkj asdfg çlkj`
  - `asdfg çlkj asdfg çlkj asdfg çlkj asdfg çlkj`
* **Lição 6 (Retorno com G):**
  - `gfdsa jklç gfdsa jklç gfdsa jklç gfdsa jklç`
  - `gfdsa jklç gfdsa jklç gfdsa jklç gfdsa jklç`
  - `gfdsa jklç gfdsa jklç gfdsa jklç gfdsa jklç`
  - `gfdsa jklç gfdsa jklç gfdsa jklç gfdsa jklç`
* **Lição 7 (Linha Central Completa: G e H):**
  - `asdfg hjklç asdfg hjklç asdfg hjklç asdfg hjklç`
  - `asdfg hjklç asdfg hjklç asdfg hjklç asdfg hjklç`
  - `asdfg hjklç asdfg hjklç asdfg hjklç asdfg hjklç`
  - `asdfg hjklç asdfg hjklç asdfg hjklç asdfg hjklç`
* **Lição 8 (Retorno: Linha Central Completa):**
  - `gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh`
  - `gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh`
  - `gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh`
  - `gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh gfdsa çlkjh`

### Módulo 2 — Linha Superior
* **Lição 1:**
  - `dede kiki ele ali sei lei ide`
  - `dente leila disse feira sede lido esse`
  - `eile kide seie leie fiei ddie lise`
  - `eleia ideia fedia lesse seque dila sife`
* **Lição 2:**
  - `ruru juju rua rir seu leu rui`
  - `surfa lura russa durar suar criar furar`
  - `daria feria seria curar subir luisa rufar`
  - `reuse rular suser duras jura frias rudes`
* **Lição 3:**
  - `tata yaya teto tudo teu tela tiro`
  - `trata jeito festa suite forte tinta tute`
  - `stay taty tyra treta titi luta yard`
  - `tente teste texto toras tery trua tula`
* **Lição 4:**
  - `papa que para pelo aqui pipa peao`
  - `quer pele peca pular papel pique poca`
  - `queda parte preto pires quilo prata ponto`
  - `perpa quila pite quep poia pulas pife`
* **Lição 5:**
  - `prato toque leite pista preto quase roupa`
  - `quilo porta sorte telha festa peixe ruido`
  - `pular treta patio dente fraco ideal justo`
  - `perito quieto rapido efeito teatro perfil saida`
* **Lição 6:**
  - `para tico pele rico suco lupa feio`
  - `rude pipa gato juro sela tipo guia`
  - `pato lula roda suor tela rifa sujo`
  - `pera jogo ralo situ duto foca luta`
* **Lição 7:**
  - `que este tudo pois pela dele area`
  - `fora hoje qual parte logo seis aqui`
  - `dizer ler poder falar tirar pedir saber`
  - `agora ideia falta lugar geral ordem porto`
* **Lição 8:**
  - `aquele direto escola frente igreja jornal lido`
  - `perigo queijo rastro teatro ultrapa vitoria xadrez`
  - `projeto estada predio trecho plateia quieto rapido`
  - `estuda flauta grafite gloria trilha fofura patio`
* **Lição 9 (Desafio de Fluxo):**
  - `o rato preto roeu a rede. a porta da sala de estar esta aberta. paula pediu aquele prato de peixe frito. hoje o dia esta legal para caminhar perto do lago. o poeta escreve o texto direto no papel. a grafite do lapis quebrou. tudo esta quase pronto para a festa de hoje. o gato pula o muro alto e foge para a rua. jorge quer ler o jornal que esta ali. a pipa subiu alto no ar. falta sorte para aquele jogador de elite. o teclado do computador esta quieto. a ideia era sair cedo para o teatro. agora a luz do sol brilha forte.`

### Módulo 3 — A Linha Inferior
* **Lição 1:**
  - `vava mama vem meu vida uma vale`
  - `amor vive mesa vovó mapa luva maré`
  - `meio vaso meta vila muro vaga mudo`
  - `viva mole vera lama vale ramo vime`
* **Lição 2:**
  - `caca ,,,, casa mica cedo cada doce`
  - `café fica cujo céu, vaca foco peça`
  - `carpa face fico liso, caça arco vice`
  - `taco, aqui, cujo cedo saco coma toca`
* **Lição 3:**
  - `xaxa .... taxa eixo luxo coxa fixo`
  - `roxo exato exame táxi. aqui. sair. hoje.`
  - `ralo. cedo. fixar oxalá xale boxe fluxo`
  - `sexo xote luxar frio. dele. pela. eixo.`
* **Lição 4:**
  - `zaza //// azul zero juiz zona reza`
  - `doze traz zeal voz/ luz/ paz/ vez/`
  - `azar zelo zumo raiz vaza gaze cozê`
  - `zelar dizer fazer vazio feliz prazo capaz`
* **Lição 5:**
  - `cavalo máximo xadrez talvez vacina cinema exame`
  - `amizade reflexo música vencer começo vizinho marchar`
  - `escola prazer cx. avião caxias voz comer`
  - `xerox moça valer feliz marca veraz campo`
* **Lição 6:**
  - `a casa. o café. meu pai. vi a luz. fiz tudo.`
  - `mesa de some. casa vazia. vida feliz. luz do sol.`
  - `campo verde. voar alto. fazer a lição. exame de vista.`
  - `vir aqui. ler o mapa. dizer a verdade. talvez amanhã.`
* **Lição 7:**
  - `sim, eu vou. não, hoje não. quero, mas. vi, ouvi, fiz.`
  - `azul, verde. luz, câmera. pulei, caí. li, logo sei.`
  - `cedo. tarde. agora. depois. fim. pronto. acabou. tchau.`
  - `alto. baixo. forte. fraco. perto. longe. certo. errado.`
* **Lição 8:**
  - `teclado rápido máximo fluência objetivo produção execução`
  - `memória muscular precisão avançado completo perfeito domínio`
  - `próximo degrau vencer etapa desafio técnica prática`
  - `focar digitar acertar repetir treinar evoluir sucesso`
* **Lição 9 (Desafio de Fluxo):**
  - `o café esta quente, mas o pão com mel ja acabou. a vida na cidade exige calma, foco e muita coragem. fiz o exame de vista hoje e tudo parece exato. o juiz deu o prazo final para o processo. talvez a gente possa viajar de navio ou de avião no verão. a caixa de madeira trazia um xale azul e uma foto antiga. o rapaz era muito capaz, mas precisava de mais prática no teclado. marchar no campo exige ritmo e força. a luz do sol brilha na mesa da sala. por favor, feche a porta e traga o jornal agora. o sucesso vem para quem treina com zelo e paciência. o ponto final indica que a lição acabou.`

### Módulo 4 — Consolidação e Ritmo
* **Lição 1:**
  - `casa rua sol mar flor lua rio`
  - `porta copo mesa bolo dia noite agua`
  - `fogo vida jogo filme carro verde azul`
  - `amor paz ar luz som cor vez voz`
* **Lição 2:**
  - `o sol brilha forte hoje de manha.`
  - `a casa fica perto do rio azul.`
  - `quero um copo de agua bem gelada.`
  - `vou andar de carro ate o centro.`
* **Lição 3:**
  - `filho velho palha trilha ilha olho telha`
  - `lenha banho ninho linha sonho unha vinho`
  - `chave chama chuva cheio choro chefe chapa`
  - `carro barro terra guerra serra jarra torre`
* **Lição 4:**
  - `café você avó avô pé pá fé chá já`
  - `coração atenção nação feijão avião balão leão`
  - `poção relação canção doação razão função nação`
  - `saúde saída baú açaí país herói ideia rainha`
* **Lição 5:**
  - `hoje o café estava muito forte pela manha.`
  - `a menina levou o cachorro para passear no parque.`
  - `amanha vou a feira e depois ao cinema com voce.`
  - `o relogio da sala parou e atrasou todo o jantar.`
* **Lição 6 (Desafio de Fluxo):**
  - `o vento soprava forte na varanda da casa amarela. as folhas secas dançavam pelo quintal enquanto o gato observava tudo de cima do muro. dona clara preparava um bolo de fuba para o cafe da tarde e o cheiro se espalhava pela rua inteira. os vizinhos sorriam e acenavam da janela. era um dia simples, daqueles que a gente guarda na memoria sem nem saber por que. a vida tem dessas coisas bonitas e gratuitas que so a rotina revela.`

### Módulo 5 — Fluência Avançada
* **Lição 1:**
  - `programa sistema digital projeto usuario interface`
  - `tecnologia ciencia biologia geografia historia arte`
  - `economia politica sociedade documento processo relato`
  - `transforme visualize configure automatize organize finalize`
* **Lição 2:**
  - `a lua cheia iluminava o lago calmo da fazenda antiga.`
  - `as crianças corriam alegres atras da pipa colorida no ceu.`
  - `o barco balancava devagar enquanto o pescador jogava a rede.`
  - `a biblioteca silenciosa guardava livros de capa desgastada.`
* **Lição 3:**
  - `--voce viu o que aconteceu la fora? --perguntou maria.`
  - `--ainda nao! --respondeu joao. --que susto!`
  - `--como ele conseguiu subir naquela arvore?`
  - `o gato miou, o cao latiu e a porta bateu.`
* **Lição 4:**
  - `o professor explicou que o resultado dependia de varios fatores.`
  - `enquanto a chuva caia, a familia se reunia ao redor da lareira.`
  - `depois de muito esforco, o time conquistou o titulo estadual.`
  - `quando o sol nasceu atras das montanhas, os passaros cantaram.`
* **Lição 5:**
  - `a cidade acordava devagar naquela manha de domingo. o feirante arrumava as frutas na banca com cuidado, enquanto o padeiro tirava os primeiros paes quentes do forno.`
  - `a praca ainda estava vazia e o silencio so era quebrado pelo som distante de um violao. aos poucos, as pessoas chegavam com suas sacolas e sorrisos.`
  - `o pao quentinho e o leite fresco alegravam o cafe da manha daquela familia simples. era gostoso ver a alegria nos olhos das crianças.`
  - `o dia passou tranquilo e a noite chegou com sua brisa fresca. todos se recolheram felizes, gratos por mais um dia de paz e trabalho bem feito.`
* **Lição 6 (Desafio de Fluxo):**
  - `havia uma vez um velho relojoeiro que morava no alto da colina. todos os dias, ele subia as escadas de madeira ate sua oficina e se sentava diante de dezenas de relogios antigos, cada um marcando uma hora diferente. ele dizia que o tempo nao existia dentro daquelas paredes, que cada ponteiro girava no seu proprio ritmo, assim como as pessoas. um dia, uma menina entrou na loja e perguntou se ele consertava relogios quebrados. o velho sorriu e respondeu que so consertava aqueles que ainda tinham vontade de funcionar.`

### Módulo 6 — Números, Maiúsculas e Shift
* **Lição 1:**
  - `1 2 3 4 5 6 7 8 9 0 10 20 30 40 50`
  - `60 70 80 90 11 22 33 44 55 66 77 88 99`
  - `100 200 300 400 500 600 700 800 900`
  - `1000 1500 2000 2500 3000 5000 10000`
* **Lição 2:**
  - `12/07/2026 25/12/2000 01/01/1990 15/11/1889`
  - `11987654321 21912345678 31987651234 41998765432`
  - `cep 01234567 87654321 22333444 55666777 88999000`
  - `cpf 12345678901 98765432100 11122233344 55566677788`
* **Lição 3:**
  - `Brasil São Paulo Rio Janeiro Curitiba Salvador`
  - `Pedro Maria João Ana Carlos Julia Lucas Beatriz`
  - `Google Apple Microsoft Samsung Netflix Amazon Meta`
  - `Janeiro Fevereiro Março Abril Maio Junho Julho Agosto`
* **Lição 4:**
  - `ONU USB PDF CEO CFO HTML HTTP URL CPU GPU`
  - `FGTS INSS IPTU IPVA ICMS IRPF PIS PASEP ISS`
  - `km kg cm mm ml m² km/h R$ kW kWh CV HP Ltda`
  - `Dr. Sr. Sra. Prof. Eng. Av. Rua Pça. tel. cel. etc.`
* **Lição 5:**
  - `Hoje é 13 de Julho de 2026 e faz 25 graus em São Paulo.`
  - `João tem 3 filhos: Ana de 12, Pedro de 8 e Lucas de 5.`
  - `A loja vendeu 150 itens por R$ 2.500,00 no sábado passado.`
  - `O voo AF 447 sai às 22h30 do Aeroporto de Guarulhos.`
* **Lição 6 (Desafio de Fluxo):**
  - `no dia 15 de Março de 2024, a empresa TechSol Brasil S.A. inaugurou sua nova sede na Av. Paulista, 1500, em São Paulo. o evento contou com 320 convidados e 12 palestrantes internacionais. o CEO Carlos Mendes anunciou a contratação de 50 novos funcionarios e a meta de R$ 10 milhões em faturamento ate Dezembro. foi um marco histórico.`

### Módulo 7 — Símbolos e Pontuação Avançada
* **Lição 1:**
  - `email@dominio.com.br vendas@loja.com contato@site.org`
  - `senha#2026! codigo@123 valor$50 imposto%18 extra&`
  - `& associados * obrigatorio (opcional) + extra - desconto`
  - `preco $ 49.90 desconto % 25 total $ 37.43 promocao #2026`
* **Lição 2:**
  - `(valor + taxa) * 2 total = (a + b) / c resultado final`
  - `[secao 1] [anexo A] [artigo 5] [inciso II] [paragrafo 3]`
  - `{ nome: "Ana", idade: 28, ativo: true, saldo: 1500.00 }`
  - `conteudo = (base * (1 + taxa)) - desconto + adicional`
* **Lição 3:**
  - `"bom dia" 'olá' — como vai? — estou bem hoje!`
  - `a palavra "resiliencia" significa "capacidade de adaptacao".`
  - `— quem e voce? — perguntou Alice. — eu sou o Gato risonho.`
  - `o termo 'feedback' vem do ingles 'to feed back' literalmente.`
* **Lição 4:**
  - `ana.silva@empresa.com.br carlos_lima@governo.gov.br`
  - `suporte@tecnologia.net rh@industria.com vendas@loja.com`
  - `n0va-senha!2026 acc3ss0@s3guro b0m_D1a&forte ok!`
  - `nao-responda@banco.com newsletter@portal.org contato@site`
* **Lição 5:**
  - `O carro custava R$ 45.900,00 — um bom preco, eu diria.`
  - `Conforme o artigo 5º (inciso III): "todos sao iguais perante a lei".`
  - `A formula e: resultado = (nota1 + nota2) / 2 * 0,7 = media final.`
  - `— E entao? — perguntou. — Esta feito! — respondi com alegria.`
* **Lição 6 (Desafio de Fluxo):**
  - `prezado(a) Sr(a). Carlos Almeida, agradecemos seu contato (protocolo #4521-2026). conforme solicitado, enviamos o orçamento revisado: Item 1 — R$ 350,00; Item 2 — R$ 890,50; Taxa de serviço (5%) — R$ 62,03; Total = R$ 1.302,53. o pagamento pode ser feito via PIX (chave: financeiro@empresa.com) ou boleto com vencimento em 20/07/2026. duvidas? Ligue: (11) 3456-7890. Atenciosamente, Equipe Comercial.`

### Módulo 8 — Velocidade com Bigramas e Trigramas
* **Lição 1:**
  - `de es ra os ar te en co er as ad to se um no`
  - `dees raos arte enco eras adto esra coar dear sent`
  - `dente resto parte arte contar entrar estado desenho`
  - `daremos entarde rasteira restante destaque contador`
* **Lição 2:**
  - `ta re ma do da se el pa qu no um po ri an ca`
  - `tare mado dase elpa quen oum taen repo rica anca`
  - `tarefa madera demora parade elefante queda relato`
  - `tapete remado damasco elegante pequeno quente rico`
* **Lição 3:**
  - `ent est men and ado aci com par tra des der ada`
  - `mente estou dando parte muito antes acido comer trazer`
  - `entende resultado parado comando trazido descida mente`
  - `totalmente finalmente parado comendo acidamente trazido`
* **Lição 4:**
  - `sol mar ar paz luz cor vez som voz lar par dom`
  - `casa mesa bolo fogo rua rio filme jogo vida cor`
  - `verde azul porta copo noite agua carro verde amor`
  - `flor amor dia lua ceu pe cha pa fe maio verao`
* **Lição 5:**
  - `que nao mais muito quando tambem porque depois sobre assim entre`
  - `fazer dizer poder saber falar tirar pedir trazer levar ver`
  - `agora hoje amanha sempre nunca antes tarde cedo logo depois`
  - `grande pequeno melhor pior novo velho bom ruim forte fraco`
* **Lição 6 (Desafio de Fluxo):**
  - `todas as manhas ele saia cedo para andar pelo parque perto de casa. o caminho era simples e tranquilo, com passaros cantando e o sol ainda fraco atras das arvores. ele gostava de sentir o vento no rosto enquanto pensava nas coisas simples da vida. algumas pessoas passavam correndo, outras caminhavam devagar com seus cachorros. tudo era calmo e perfeito.`

### Módulo 9 — Textos do Mundo Real
* **Lição 1:**
  - `Prezado Senhor Carlos,`
  - `Segue em anexo o relatorio mensal de vendas conforme solicitado na reuniao de ontem.`
  - `Qualquer duvida, estou a disposicao para esclarecimentos adicionais.`
  - `Atenciosamente, Ana Souza — Gerente de Vendas — Ramal 342`
* **Lição 2:**
  - `Joao Victor de Lima — Brasileiro, 28 anos, Solteiro`
  - `Formacao: Administracao — Universidade de Sao Paulo — 2020`
  - `Experiencia: Assistente Financeiro — Empresa ABC Ltda — 2021 a 2024`
  - `Idiomas: Ingles avancado, Espanhol intermediario, Frances basico`
* **Lição 3:**
  - `Chuvas fortes atingem o sul e deixam 500 familias desabrigadas`
  - `As fortes chuvas que comecaram na madrugada de segunda causaram alagamentos em 12 bairros da capital.`
  - `A Defesa Civil informou que equipes trabalham para resgatar moradores ilhados e distribuir donativos.`
  - `A previsao e de mais chuva para os proximos dias, e o alerta da Defesa Civil segue ate quinta-feira.`
* **Lição 4:**
  - `Bolo de Cenoura com Cobertura de Chocolate — Ingredientes:`
  - `3 cenouras medias, 4 ovos, 1 xicara de oleo, 2 xicaras de acucar, 2 xicaras de farinha de trigo, 1 colher de fermento.`
  - `Modo de preparo: bata as cenouras, os ovos e o oleo no liquidificador por 3 minutos.`
  - `Em uma tigela, misture a farinha e o acucar, adicione a mistura do liquidificador e o fermento. Asse por 40 minutos.`
* **Lição 5:**
  - `Bom dia, equipe! Lembramos que hoje as 14h teremos nossa reuniao semanal.`
  - `Pauta: resultados de Julho, metas de Agosto e apresentacao do novo colaborador.`
  - `Favor confirmar presenca ate as 12h. O link da videochamada sera enviado por e-mail.`
  - `Obrigado e boa semana a todos! Atenciosamente, Departamento de RH.`
* **Lição 6 (Desafio de Fluxo):**
  - `Ilmo. Sr. Diretor de Compras, vimos por meio desta apresentar nossa proposta comercial para fornecimento de materiais de escritorio. nossa empresa atua no mercado desde 2005 e atende mais de 300 clientes corporativos em todo o Brasil. os valores unitarios seguem na tabela anexa, com desconto progressivo a partir de R$ 5.000,00. o prazo de entrega e de ate 7 dias uteis e o pagamento pode ser parcelado em ate 12 vezes. colocamo-nos a disposicao para uma reuniao presencial ou por videochamada. Cordialmente, Equipe Comercial.`

### Módulo 10 — Desafio Final Integrado
* **Lição 1:**
  - `O boleto nº 47823 no valor de R$ 156,90 vence em 20/08/2026.`
  - `Email: suporte@empresa.com | Tel: (11) 3456-7890 | CEP: 04567-001`
  - `Dr(a). Fernanda — CRM/SP 12345 — atende de 2ª a 6ª, das 8h as 18h.`
  - `Codigo: X9K-42M — valido ate 31/12/2026 — use 1 vez por client.`
* **Lição 2:**
  - `EDITAL DE CONVOCACAO Nº 001/2026 — A Comissao Organizadora convoca os candidatos aprovados na primeira fase.`
  - `Art. 5º — O prazo para recurso e de 5 (cinco) dias uteis, contados da publicacao deste edital no Diario Oficial.`
  - `Paragrafo unico: os documentos deverao ser entregues na sede, sito a Rua XV de Novembro, 1400, Sala 302.`
  - `Publique-se e cumpra-se. Sao Paulo, 13 de julho de 2026. Dr. Roberto Alves — Presidente da Comissao.`
* **Lição 3:**
  - `JAN: R$ 2.340,00 | FEV: R$ 3.150,50 | MAR: R$ 1.890,00 | Total Q1: R$ 7.380,50`
  - `Despesas: Aluguel R$ 1.200, Luz R$ 340, Agua R$ 180, Internet R$ 99,90, Folha R$ 4.500,00`
  - `Lucro Liquido: R$ 5.560,60 | Margem: 32% | Crescimento: +12,4% vs. ano anterior`
  - `Projecao Q2: R$ 8.200,00 (base 3 cenarios: conservador, moderado e otimista)`
* **Lição 4:**
  - `1. Como redefinir minha senha? Acesse Configuracoes > Seguranca > Alterar Senha.`
  - `2. Qual o prazo de entrega? Capital: 3 dias uteis. Interior: ate 7 dias uteis.`
  - `3. Posso cancelar meu pedido? Sim, em ate 24h apos confirmacao, pelo portal ou chat.`
  - `4. Formas de pagamento: Cartao (ate 12x), Boleto (ate 3 dias), PIX (aprovacao instantanea).`
* **Lição 5:**
  - `A tecnologia transformou profundamente a maneira como nos comunicamos no seculo XXI. Em poucos anos, passamos das cartas manuscritas para mensagens instantaneas que cruzam o planeta`
  - `em fracoes de segundo. Essa revolucao trouxe beneficios inegaveis, como a democratizacao do acesso a informacao e a possibilidade de manter contato com pessoas em qualquer lugar do mundo.`
  - `No entanto, e preciso refletir sobre os impactos dessa hiperconectividade na qualidade das relacoes humanas. O volume excessivo de informacoes pode gerar ansiedade, e a comunicacao superficial`
  - `substitui, muitas vezes, o dialogo profundo. O equilibrio entre o digital e o presencial e, portanto, o grande desafio da nossa geracao. Cabe a nos usar a tecnologia com sabedoria e intencao.`
* **Lição 6 (Desafio Final):**
  - `prezados membros do Conselho Diretor, apresentamos a seguir o relatorio consolidado do 3º trimestre de 2026. a receita liquida atingiu R$ 2.847.300,00 — um crescimento de 18,7% em relacao ao mesmo periodo do ano anterior (R$ 2.400.000,00). os custos operacionais totalizaram R$ 1.120.450,80, resultando em um lucro operacional de R$ 1.726.849,20. destacamos: (1) abertura de 3 novas filiais em Campinas, Curitiba e Belo Horizonte; (2) contratação de 42 colaboradores — sendo 15 para TI e 27 para operacoes; (3) lancamento da plataforma digital (app mobile + web) com investimento de R$ 480.000,00. para o 4º trimestre, a projecao e de R$ 3.100.000,00 em receita. Contatos: diretoria@empresa.com — Tel: (11) 4002-8922.`

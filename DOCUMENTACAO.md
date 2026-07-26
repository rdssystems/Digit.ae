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

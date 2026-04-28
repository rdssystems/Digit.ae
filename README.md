# Digit.ae ⌨️

O **Digit.ae** é uma plataforma moderna e interativa de ensino e prática de digitação. Projetado para oferecer uma experiência fluida e engajadora, o sistema acompanha o progresso dos alunos, gerencia perfis de aprendizado e fornece feedback visual e auditivo em tempo real para aprimorar a precisão e velocidade na digitação.

## 🚀 Funcionalidades

- **Motor de Digitação Interativo:** Acompanhamento em tempo real de erros, acertos, WPM (palavras por minuto) e precisão.
- **Feedback em Áudio e Visual:** Sons de teclas dinâmicos, alertas de erro e de sucesso para tornar o aprendizado mais imersivo.
- **Múltiplos Perfis (Multi-Profile):** Suporte a vários estudantes sob uma mesma conta, salvando individualmente o progresso das lições.
- **Autenticação Segura:** Login utilizando Google OAuth2 e credenciais tradicionais.
- **Sincronização em Tempo Real:** Todo o progresso e configurações são persistidos de forma ágil e segura.
- **Multiplataforma:** Aplicação web responsiva com versão Desktop empacotada através do Tauri.

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando tecnologias modernas visando alta performance, segurança e uma excelente experiência para o usuário e desenvolvedor.

### Frontend
- **[React](https://reactjs.org/)** com **[TypeScript](https://www.typescriptlang.org/)**: Construção de interfaces de usuário componentizadas e fortemente tipadas.
- **[Vite](https://vitejs.dev/)**: Bundler e ambiente de desenvolvimento ultra-rápido.
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização utilitária para designs responsivos, dinâmicos e modernos.
- **Gerenciamento de Estado**: Hooks customizados e Stores (zustand) para controle de Sessões e Perfis de alunos.

### Backend & Banco de Dados
- **[PocketBase](https://pocketbase.io/)**: Um backend open-source contido em um único arquivo (Go). Ele atua como:
  - Banco de dados embutido (SQLite) ultrarrápido.
  - Provedor de Autenticação (Email/Senha e Google OAuth2).
  - API RESTful pronta para uso e sincronização de dados.

### Desktop App
- **[Tauri](https://tauri.app/)**: Framework utilizado para construir a versão Desktop nativa leve e segura usando as tecnologias web construídas no frontend.

## ⚙️ Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/rdssystems/Digit.ae.git
   cd Digit.ae
   ```

2. **Instale as dependências do Frontend:**
   ```bash
   npm install
   ```

3. **Inicie o Backend (PocketBase):**
   Execute o binário do PocketBase disponível na raiz do projeto:
   - No Windows:
     ```bash
     .\pocketbase.exe serve
     ```
   - No Linux/macOS:
     ```bash
     ./pocketbase serve
     ```
   *A interface de administração da base de dados ficará disponível em `http://127.0.0.1:8090/_/`*

4. **Inicie o Frontend:**
   Em um novo terminal, inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   *Acesse a aplicação web em `http://localhost:5173/`*

## 📦 Deploy e VPS

O projeto está preparado para ser levado para produção (VPS). 
- O frontend é compilado rodando `npm run build` gerando arquivos estáticos na pasta `dist`, que podem ser servidos pelo Nginx ou Apache.
- O executável do PocketBase (`pocketbase serve`) pode ser mantido online através de um gerenciador de processos como o `systemd` ou `pm2`.

---
*Desenvolvido com foco em aprimorar e acelerar o ensino de digitação de forma engajadora.*

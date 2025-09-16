# Magnum Bank - Simulador de Transações Financeiras

## 📋 Sobre o Projeto

O Magnum Bank é um simulador de transações financeiras desenvolvido para simular operações bancárias reais. A aplicação oferece uma interface segura e intuitiva para gerenciamento de saldo, realização de transações PIX e TED, e consulta de histórico de movimentações.

### ✨ Funcionalidades

- 🔐 **Autenticação segura** com CPF e senha
- 💰 **Gestão de saldo** em tempo real
- 💸 **Transações PIX e TED** com confirmação por senha
- 📊 **Histórico completo** com filtros e ordenação
- 📱 **Design responsivo** otimizado para mobile
- 🔒 **Rotas protegidas** com validação de autenticação
- 🌐 **Internacionalização** com suporte a Português e Inglês

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Estado Global**: Redux Toolkit
- **Roteamento**: React Router v6
- **Internacionalização**: react-i18next
- **Testes**: Vitest + React Testing Library
- **Mock API**: JSON Server

## 📁 Estrutura do Projeto

```
magnum-bank/
├── src/
│   ├── api/
│   │   └── apiService.ts         # Camada de serviço para APIs
│   ├── components/               # Componentes reutilizáveis
│   │   ├── BalanceCard.tsx       # Cartão de exibição de saldo
│   │   ├── HistoryFilters.tsx    # Filtros do histórico
│   │   ├── LatestTransactions.tsx # Últimas transações
│   │   ├── Layout.tsx            # Layout principal da aplicação
│   │   ├── PasswordModal.tsx     # Modal de confirmação por senha
│   │   ├── PrivateRoute.tsx      # Proteção de rotas autenticadas
│   │   ├── SummaryModal.tsx      # Modal de resumo de transação
│   │   ├── TransactionForm.tsx   # Formulário de transações
│   │   └── TransactionList.tsx   # Lista do histórico de transações
│   ├── i18n/                     # Configuração de internacionalização
│   │   ├── components/              # Configuração do i18next
│   │   |    └── LanguageProvider.tsx  # Provider e seletor de idioma
│   │   ├── hooks/
│   │   |    └── useI18n.ts
│   │   ├── locales/              # Arquivos de tradução
│   │   |    ├── en-US.json       # Traduções em inglês
│   │   |    ├── pt-BR.json       # Traduções em português
│   │   |    └── test.json        # Keys para testes
│   │   └── index.ts              # Configuração do i18next
│   ├── pages/                    # Páginas da aplicação
│   │   ├── __tests__/            # Testes unitários das páginas
│   │   │   ├── integration/      # Testes de integração
│   │   │   │   └── userFlows.test.tsx
│   │   │   ├── History.test.tsx
│   │   │   ├── Home.test.tsx
│   │   │   ├── Login.test.tsx
│   │   │   └── Transactions.test.tsx
│   │   ├── History.tsx           # Página de histórico
│   │   ├── Home.tsx              # Dashboard principal
│   │   ├── Login.tsx             # Página de autenticação
│   │   └── Transactions.tsx      # Página de transações
│   ├── redux/                    # Gerenciamento de estado
│   │   ├── store.ts              # Configuração da store
│   │   └── userSlice.ts          # Slice do usuário
│   └── styles/                   # Estilos globais
├── db.json                       # Dados mock para JSON Server
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## ⚙️ Configuração e Instalação

### Pré-requisitos

- Node.js 16+
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/magnum-bank.git
cd magnum-bank

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:5173
```

### Configuração do Mock API

```bash
# Em um terminal separado, inicie o JSON Server
npm run server

# O mock API estará disponível em http://localhost:3001
```

> **Importante**: O arquivo `db.json` contém os dados de usuários e transações para simulação. Você pode modificar este arquivo para testar diferentes cenários.

## 🌐 Internacionalização

A aplicação suporta múltiplos idiomas através do **react-i18next**:

### Idiomas Suportados

- 🇧🇷 **Português (pt-BR)** - Idioma padrão
- 🇺🇸 **Inglês (en-US)**

### Funcionalidades de i18n

- **Troca dinâmica de idioma** sem necessidade de recarregar a página
- **Persistência da preferência** do usuário no localStorage
- **Formatação de valores** adaptada ao contexto regional
- **Testes agnósticos ao idioma** usando chaves de tradução

### Credenciais de Teste

Para testar a aplicação, utilize as seguintes credenciais:

**Login Válido:**

- CPF: `12345678900`
- Senha: `pass123`

**Transação Válido:**

- Senha: `1234`

**Para testar falha de login**, use qualquer combinação diferente das credenciais acima.

> **Nota**: Esta é uma aplicação de demonstração. As credenciais são definidas no arquivo `db.json` e podem ser modificadas conforme necessário para testes.

## 🧪 Executando Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Executar testes com coverage
npm run test:coverage

# Executar testes de integração
npm run test:integration
```

### Estrutura de Testes

- **Testes Unitários**: Componentes individuais
- **Testes de Integração**: Fluxos completos do usuário
- **Testes Multilíngues**: Validação usando chaves de tradução
- **Cobertura**: Inclui componentes, páginas e utilitários

## 🏗️ Arquitetura e Decisões Técnicas

### Padrões Arquiteturais

- **Container/Presentation**: Páginas gerenciam estado, componentes focam na apresentação
- **Service Layer**: Comunicação centralizada com APIs através do `apiService.ts`
- **Protected Routes**: Proteção baseada em autenticação com `PrivateRoute`
- **Modal Pattern**: Implementação consistente de modais para confirmações
- **i18n Pattern**: Internacionalização com hooks e providers React

### Principais Decisões

#### 1. Redux Toolkit para Estado Global

**Decisão**: Utilizar Redux Toolkit para gerenciamento de estado global.
**Justificativa**: Centralização do estado, atualizações imutáveis simplificadas e redução de boilerplate, tornando o fluxo de dados previsível e fácil de debugar.

#### 2. Proteção de Rotas

**Decisão**: Implementar componente `PrivateRoute` usando React Router.
**Justificativa**: Garantir que usuários não autenticados não acessem funcionalidades financeiras, seguindo práticas fundamentais de segurança.

#### 3. Mock API com JSON Server

**Decisão**: Utilizar mock API para simular interações backend.
**Justificativa**: Permite desenvolvimento e teste do frontend sem dependência de backend real, acelerando o processo de desenvolvimento.

#### 4. Separação de Chamadas API

**Decisão**: Refatorar para fazer **chamadas API separadas** para dados do usuário e transações.
**Justificativa**: Modela uma arquitetura de API mais escalável e realista, evitando problemas de performance conforme o número de transações cresce.

#### 5. Layout Responsivo

**Decisão**: Usar layout baseado em **listas** ao invés de tabelas HTML para histórico de transações.
**Justificativa**: Design mais responsivo que oferece melhor experiência em dispositivos móveis, onde tabelas tradicionais são difíceis de navegar.

#### 6. Internacionalização com react-i18next

**Decisão**: Implementar i18n usando react-i18next com hooks de React.
**Justificativas**:

- **Escalabilidade**: Suporte fácil para novos idiomas
- **Performance**: Re-renderização automática apenas dos componentes que usam traduções
- **Testes**: Testes agnósticos ao idioma usando chaves de tradução
- **UX**: Troca de idioma instantânea sem reload da página
- **Persistência**: Preferência do usuário mantida entre sessões

### Design System

#### Paleta de Cores

- **Fundo Principal**: `#EDEDED`
- **Cor de Destaque**: `#d61f0a` (vermelho)
- **Texto Principal**: `#1b1b1b`
- **Fundo de Cards**: `#ffffff`

#### Componentes Base

- **Cards**: Fundo branco com sombras e bordas arredondadas
- **Botões**: Estilo consistente com estados hover e focus
- **Formulários**: Inputs padronizados com validação visual
- **Modais**: Overlay escuro com cards centralizados
- **Language Switcher**: Seletor de idioma integrado ao layout

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build de produção
npm run test         # Executar testes
npm run test:watch   # Testes em modo watch
npm run server       # Iniciar mock API (JSON Server)
npm run lint         # Executar ESLint
npm run type-check   # Verificação de tipos TypeScript
```

## 🚀 Deploy

### Build para Produção

```bash
npm run build
```

Os arquivos de produção serão gerados na pasta `dist/`.

### Demonstração

- **Vercel**: https://magnum-bank-ten.vercel.app/

### Configuração de Deploy

Para plataformas como Vercel/Netlify, configure:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node Version**: 16+

---

<p align="center">
  <img src="public/icons/icon128.png" width="128" height="128" alt="GF Code: Site to Markdown Logo">
</p>

<h1 align="center">GF Code: Site to Markdown</h1>

<p align="center">
  <a href="#english">🇺🇸 English</a> | <a href="#portugues">🇧🇷 Português</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Manifest-V3-blue.svg" alt="Manifest V3">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT">
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="PRs Welcome">
</p>

---

<a name="english"></a>
# English Documentation

**GF Code: Site to Markdown** is a client-side browser extension designed to extract web page content and convert it into clean, well-formatted Markdown optimized for Large Language Models (LLMs). It runs completely locally in the browser with zero external calls, ensuring maximum privacy and speed.

---

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| **Clean Extraction** | Prunes navigation, ads, headers, and footer noise to isolate the main body content using `@mozilla/readability`. |
| **Hybrid Deduplication** | Employs character-similarity metrics to detect and filter out duplicate or redundant text blocks before saving. |
| **LLM-Optimized Output** | Formats markdown with YAML/JSON frontmatter containing page metadata (title, URL, extraction date). |
| **Token-Count Splitting** | Automatically splits large articles into smaller chunks based on configurable token limits. |
| **User-Controlled Popup** | Adjust settings, similarity thresholds, and toggle between single-file and ZIP packages dynamically. |
| **Site Scanning (Crawling)** | Crawls all pages matching the active directory prefix on the same domain and compiles them into a ZIP archive. |

---

## 📦 Installation Guide

To install and run this extension locally on Chromium-based browsers (Chrome, Edge, Brave, etc.) in Developer Mode, follow these steps:

1. **Clone or Download the Repository**:
   Clone the code to your local machine.
2. **Install Project Dependencies**:
   Open a terminal in the project directory and run:
   ```bash
   npm install
   ```
3. **Open Extensions Management Page**:
   In your browser, navigate to:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
4. **Enable Developer Mode**:
   Toggle the **Developer Mode** switch located at the top right of the extensions page.
5. **Load Unpacked Extension**:
   - Click the **Load unpacked** button at the top left.
   - Select the root folder of this repository (the folder containing `manifest.json`).
6. **Confirm Successful Load**:
   The extension should appear under the name **GF Code: Site to Markdown** without any error logs.

---

## 🚀 Usage

1. Click the **GF Code: Site to Markdown** icon in your browser toolbar to open the settings popup.
2. **Adjust Settings**:
   - Set maximum character limits.
   - Configure similarity threshold percentages for deduplication.
   - Toggle between compiling files as a single Markdown file or a ZIP bundle.
3. **Run Extraction**:
   - Click **Start Extraction** to download the current active tab as cleaned Markdown.
   - Click **Scan Directory** to crawl same-domain paths from the current page and download them as a compiled ZIP package.

> [!NOTE]
> For more details about same-domain path crawling, check the [Crawler Documentation](docs/crawler.md).
> To understand site-specific extraction inheritance, read the [Extractor Inheritance Documentation](docs/extractors.md).

---

## 📂 Repository Folder Structure

```text
.
├── .specify/                # Spec Kit configuration and memory templates
├── docs/                    # Internal documentation (crawler.md, extractors.md)
├── public/                  # Static assets
│   └── icons/               # Extension icons (16x16, 32x32, 48x48, 128x128)
├── popup/                   # Extension popup UI
│   ├── popup.html           # Settings interface layout
│   ├── popup.css            # Styles for configuration panel
│   └── popup.js             # Logic for popup settings and actions
├── src/                     # Core extension source files
│   └── extractors/          # Specialized site extraction strategies
│       ├── BaseExtractor.js     # Lifecycle extraction pipeline
│       ├── ExtractorRegistry.js # Hostname matcher registry
│       ├── GenericExtractor.js  # Fallback readability extractor
│       └── WikipediaExtractor.js# Dedicated Wikipedia extractor
├── tests/                   # Extension test suites
│   └── extractors/          # Extractor pipeline unit tests
├── background.js            # Service worker managing extension lifecycle
├── content.js               # Page-isolated content script
├── manifest.json            # Extension entrypoint configuration
├── package.json             # Node dependencies and scripts
└── vitest.config.js         # Testing framework configuration
```

---

## 🛠️ Development & Testing

We use [Vitest](https://vitest.dev/) for unit testing and [jscpd](https://github.com/kucherenko/jscpd) to detect copy-pasted or duplicate code. 

All development tasks are managed via standard NPM scripts:

| Command | Description |
| :--- | :--- |
| `npm install` | Installs dependencies required for development and testing. |
| `npm run test` | Executes the Vitest unit test suite once. |
| `npm run test:watch` | Runs Vitest in interactive watch mode for active development. |
| `npm run test:coverage` | Computes code coverage metrics and reports results. |
| `npm run test:dry` | Runs the duplicate code detector (`jscpd`) across `src/` to ensure DRY compliance. |
| `npm run test:all` | Sequentially executes dry run, test suite, and coverage generation. |

---

## 📜 Constitution: Core Principles & Technical Constraints

Developers contributing to this project must adhere to the project constitution's guidelines:

### Core Principles

1. **Clean Extraction**: Features must extract page content into isolated, layout-free Markdown using the DOM pipeline and prune hidden/non-content nodes.
2. **Hybrid Deduplication & Ambiguity Resolution**: Text blocks must be checked against similarity thresholds before rendering to prevent duplicating headers or repetitive content.
3. **LLM-Optimized Output**: Formatted markdown must be prefixed with structured JSON/YAML frontmatter containing clear page metadata.
4. **Token-Count Splitting & Flexible Packaging**: Configurations must support splitting articles by token/character counts and bundling them dynamically (Single Markdown / ZIP).
5. **User-Controlled Popup**: All parameters (limits, thresholds, formats) must be customizable in a user-facing toolbar UI.

### Technical Constraints

* **Client-Side Execution**: The entire extension must run locally. Absolutely no external server calls, proxy API servers, or external network requests are allowed.
* **Vanilla Stack**: Core styling and logic must be implemented using vanilla HTML/CSS/JavaScript. No heavyweight frameworks (React, Vue, Tailwind) are permitted.
* **Local Bundling**: All third-party libraries (JSZip, Readability, Turndown) must be bundled locally inside the project. No CDN or external script loading.

---

## 📄 License

This project is licensed under the **MIT License**. See the license declaration for details.

---
---

<a name="portugues"></a>
# Documentação em Português

**GF Code: Site to Markdown** é uma extensão de navegador focada na execução cliente (local) projetada para extrair o conteúdo de páginas web e convertê-lo em Markdown limpo, otimizado para Modelos de Linguagem de Larga Escala (LLMs). Ele é executado totalmente no navegador com zero requisições externas, garantindo privacidade absoluta e velocidade.

---

## 🌟 Principais Recursos

| Recurso | Descrição |
| :--- | :--- |
| **Extração Limpa** | Remove menus, anúncios, cabeçalhos e rodapés para isolar o corpo de texto principal usando `@mozilla/readability`. |
| **Deduplicação Híbrida** | Utiliza métricas de similaridade de caracteres para detectar e filtrar blocos de texto duplicados antes do download. |
| **Formatação Otimizada para LLM** | Insere um bloco de metadados frontmatter (JSON/YAML) com o título, URL e data da extração no topo do arquivo. |
| **Divisão por Tokens** | Divide automaticamente artigos longos em múltiplos blocos menores com base em limites de caracteres configuráveis. |
| **Popup Controlado pelo Usuário** | Permite alterar configurações, limites, formato de arquivo e limites de similaridade em tempo real. |
| **Varredura de Diretório (Crawler)** | Rastreia sequencialmente todas as páginas no mesmo domínio com o mesmo prefixo de caminho e exporta tudo em ZIP. |

---

## 📦 Guia de Instalação

Para instalar e rodar a extensão localmente em navegadores baseados no Chromium (Chrome, Edge, Brave, etc.) em Modo de Desenvolvedor, siga os passos abaixo:

1. **Clone ou Baixe o Repositório**:
   Baixe o código para sua máquina local.
2. **Instale as Dependências do Projeto**:
   Abra um terminal no diretório do projeto e execute:
   ```bash
   npm install
   ```
3. **Abra a Página de Extensões do Navegador**:
   No seu navegador, acesse:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
4. **Ative o Modo de Desenvolvedor**:
   Ative a chave **Modo do desenvolvedor** no canto superior direito da página de extensões.
5. **Carregar Extensão sem Compactação**:
   - Clique no botão **Carregar sem compactação** no canto superior esquerdo.
   - Selecione a pasta raiz deste repositório (onde está localizado o arquivo `manifest.json`).
6. **Confirme a Inicialização**:
   A extensão deve aparecer na lista sob o nome **GF Code: Site to Markdown** sem erros registrados.

---

## 🚀 Como Usar

1. Clique no ícone do **GF Code: Site to Markdown** na barra de ferramentas para abrir a interface popup.
2. **Ajuste as Configurações**:
   - Configure o limite de caracteres por arquivo.
   - Ajuste a porcentagem de similaridade para remoção de duplicatas.
   - Escolha o formato de saída (Arquivo Único ou Pacote ZIP).
3. **Inicie a Extração**:
   - Clique em **Start Extraction** para baixar a aba atual formatada em Markdown.
   - Clique em **Scan Directory** para varrer subpáginas do mesmo caminho e exportá-las em um pacote ZIP.

> [!NOTE]
> Para obter detalhes adicionais sobre o crawler de caminhos do mesmo domínio, consulte a [Documentação do Crawler (Inglês)](docs/crawler.md).
> Para entender o design de herança e especialização de extractores, leia a [Documentação de Herança (Inglês)](docs/extractors.md).

---

## 📂 Estrutura de Pastas do Repositório

```text
.
├── .specify/                # Configurações do Spec Kit e templates de memória
├── docs/                    # Documentação interna (crawler.md, extractors.md)
├── public/                  # Arquivos estáticos
│   └── icons/               # Ícones da extensão (16x16, 32x32, 48x48, 128x128)
├── popup/                   # Interface do popup da extensão
│   ├── popup.html           # Layout do painel de controle
│   ├── popup.css            # Estilos da interface
│   └── popup.js             # Lógica e listeners do popup
├── src/                     # Código-fonte principal
│   └── extractors/          # Estratégias de extração especializadas por site
│       ├── BaseExtractor.js     # Pipeline de ciclo de vida da extração
│       ├── ExtractorRegistry.js # Registro de correspondência de domínios
│       ├── GenericExtractor.js  # Extrator padrão usando Readability
│       └── WikipediaExtractor.js# Extrator específico para Wikipedia
├── tests/                   # Suítes de testes automatizados
│   └── extractors/          # Testes unitários do pipeline de extração
├── background.js            # Service worker de segundo plano
├── content.js               # Script de conteúdo isolado na página
├── manifest.json            # Configuração do manifesto do navegador
├── package.json             # Dependências e scripts do Node.js
└── vitest.config.js         # Configuração do framework de testes
```

---

## 🛠️ Desenvolvimento & Testes

Utilizamos o [Vitest](https://vitest.dev/) para testes unitários e o [jscpd](https://github.com/kucherenko/jscpd) para verificação de duplicidade de código.

Comandos NPM de desenvolvimento:

| Comando | Descrição |
| :--- | :--- |
| `npm install` | Instala as dependências de desenvolvimento. |
| `npm run test` | Roda as suítes de testes unitários uma vez. |
| `npm run test:watch` | Executa o Vitest no modo watch interativo. |
| `npm run test:coverage` | Gera e exporta relatórios de cobertura de código. |
| `npm run test:dry` | Executa o jscpd para detectar blocos duplicados em `src/`. |
| `npm run test:all` | Roda sequencialmente a detecção de duplicidade, testes e relatórios de cobertura. |

---

## 📜 Constituição: Princípios e Restrições Técnicas

Qualquer contribuição ao projeto deve seguir rigidamente a constituição interna:

### Princípios Fundamentais

1. **Extração Limpa**: Conversão de conteúdo web para Markdown legível e limpo de anúncios, layouts e cabeçalhos redundantes usando um pipeline DOM.
2. **Deduplicação Híbrida**: Comparação de similaridade de blocos textuais antes do download para eliminar seções repetitivas.
3. **Formatação Otimizada para LLM**: Prefixar metadados do tipo frontmatter (JSON/YAML) com informações da URL original.
4. **Divisão Dinâmica de Conteúdo**: Suportar o fracionamento inteligente de textos muito longos com base em limites de tokens e exportação flexível (Markdown/ZIP).
5. **Popup Controlado**: Todas as regras e preferências de processamento devem ser livremente alteráveis pelo usuário no painel gráfico.

### Restrições Técnicas

* **Execução Local (Client-Side)**: A extensão deve rodar inteiramente na máquina do usuário. Nenhuma requisição a servidores de API externos ou proxies é permitida.
* **Stack Vanilla**: Todo o estilo e comportamento da interface devem usar puramente HTML/CSS/JavaScript padrão. Frameworks pesados ou TailwindCSS não são aceitos.
* **Bibliotecas Locais**: Dependências externas (JSZip, Readability, Turndown) devem ser salvas e carregadas localmente no pacote do navegador, sem CDNs.

---

## 📄 Licença

Este projeto é licenciado sob os termos da licença **MIT**.

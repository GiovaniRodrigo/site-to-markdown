# Política de Privacidade

A sua privacidade é de extrema importância para nós. Esta política de privacidade explica como a extensão **GF Code: Site to Markdown** coleta, usa e protege suas informações.

---

### 1. Coleta de Dados e Privacidade Geral
* **Execução Totalmente Local:** A extensão **GF Code: Site to Markdown** foi projetada para funcionar inteiramente do lado do cliente (client-side). Nós **não coletamos**, não armazenamos e não transmitimos nenhum dado pessoal, histórico de navegação ou conteúdo de páginas para servidores externos controlados pelos desenvolvedores.
* **Sem Rastreamento ou Analytics:** Não utilizamos cookies, ferramentas de rastreamento (analytics) ou telemetria.

### 2. Processamento e Conversão de Conteúdo
* Todo o processo de extração de conteúdo da página web (`@mozilla/readability`), conversão para Markdown (`turndown`), cálculo de similaridade para deduplicação e compactação em arquivos ZIP é executado localmente na sua própria máquina, dentro da sandbox de execução do seu navegador.

### 3. Integração Opcional com APIs de LLM (Inteligência Artificial)
A extensão oferece um recurso opcional de refinamento de Markdown através de modelos de inteligência artificial (LLM). Se você optar por ativar essa funcionalidade:
* **Armazenamento de Chaves de API:** Suas chaves de API do Google Gemini, OpenAI ou Anthropic Claude são armazenadas de forma segura e local na memória do seu navegador (`chrome.storage.local`). Elas nunca são enviadas aos desenvolvedores da extensão.
* **Comunicação Direta com Provedores:** Ao solicitar a melhoria de um texto, a extensão envia o conteúdo extraído diretamente do seu navegador para a API do provedor escolhido (Google, OpenAI ou Anthropic) usando as credenciais configuradas por você. O envio é regido pelos termos de uso e política de privacidade do respectivo provedor.
* **Processamento 100% Offline (Ollama):** Caso utilize o **Ollama**, todo o processamento de IA é feito no seu próprio computador (`http://localhost:11434`), garantindo que nenhuma informação saia da sua rede local.

### 4. Explicação das Permissões Solicitadas
Para funcionar corretamente, a extensão necessita de algumas permissões técnicas do navegador:
* **`storage`:** Usada exclusivamente para salvar suas preferências de configuração (como limites de caracteres, limiar de similaridade e chaves de API locais).
* **`activeTab` e `scripting`:** Usadas para ler o HTML da página ativa e convertê-lo em Markdown no momento em que você clica para extrair.
* **`downloads`:** Usada para salvar o arquivo Markdown ou pacote ZIP diretamente na sua pasta de Downloads local.
* **`<all_urls>`:** Necessária para permitir o funcionamento do crawler (varredura de diretório) em qualquer domínio que você decida executar a extração, além de possibilitar as requisições de API direto do background script.

### 5. Alterações nesta Política
Podemos atualizar nossa Política de Privacidade periodicamente. Quaisquer alterações serão refletidas atualizando a versão e a data neste arquivo ou no repositório oficial do projeto.

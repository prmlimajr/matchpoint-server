# API Matchpoint

## 💻 Sobre o projeto
Esta API foi desenvolvida para servir o projeto Matchpoint Games.

## 🛠 Ferramentas utilizadas
  <ul>
    <li>
      <a href='https://nodejs.org/en/'>NodeJS</a>
    </li>
    <li>
      <a href='https://expressjs.com/'>Express</a>
    </li>
    <li>
      <a href='https://www.mysql.com/'>MySQL</a>
    </li>
    <li>
      <a href='https://knexjs.org/'>Knex</a>
    </li>
  </ul>
  
  ## 🚀 Executando o projeto
  Para executar esta API localmente é necessário que você tenha em sua máquina o Node, os gerenciadores de pacote NPM e/ou Yarn e acesso a um banco de dados MySQL. Também será necessário a ferramenta de versionamento de códigos Git.
  
  Com estas ferramentas instaladas você deve, no terminal, acessar a pasta de destino escolhida para este projeto e clonar este repositório para a sua máquina usando o comando abaixo:
  
  ```bash
    git clone https://github.com/maiconluizanschau/-prd-matchpoint-games-back-end.git
  ```
  
  <p>Após terminar o processo de download do projeto, você deve acessar a pasta com o conteúdo baixado e executar o comando abaixo para instalar as dependências:</p>
  
  ```
    npm install
  ```
  
  ou se preferir:
  
  ```
    yarn
  ```
  Para executar o projeto localmente sera preciso que seja criado um arquivo .env na raiz do projeto. Nele deverao ser armazenadas as variaveis de
  ambiente usadas, seguindo o modelo do arquivo .env.example.
  
  Após a instalação de todos os pacotes, é possível rodar o projeto localmente através do comando:
  
  ```
    npm run dev
  ```
  ou
  ```
    yarn dev
  ```
  
  Uma mensagem será exibida no console indicando que o servidor está sendo executado, na porta 8080.
  
  O projeto usa de migrations para montar a base de dados. Se a base de dados e suas tabelas nao existirem, ou se estiverem desatualizadas sera preciso 
  executar os seguintes passos no terminal:

  ```
    npm install knex -g
  ```
  
  para instalar o pacote do Knex globalmente em seu computador.

  E:

  ```
    knex migrate:latest
  ```

  para que as migrations sejam executadas e as tabelas que ainda nao existam sejam criadas no banco de dados.
 
 ## 😯 Autor
<a href="https://www.linkedin.com/in/prmlimajr/">Paulo Lima</a>

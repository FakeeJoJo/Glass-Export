GLASS EXPORT

Sistema de Backoffice para Exportação de Copos de Vidro

1. Sobre o projeto

O Glass Export é uma aplicação web desenvolvida como projeto acadêmico. O sistema permite cadastrar produtos e países de destino, registrar exportações, consultar o histórico de pedidos, controlar o estoque e converter os preços conforme a moeda do país de destino.

O sistema aplica uma margem de lucro de 100% sobre o custo dos produtos.

2. Tecnologias utilizadas

HTML5

CSS3

JavaScript

Node.js

Express

MySQL

API AwesomeAPI para consulta de cotações cambiais

3. Pré-requisitos

Antes de executar o sistema, é necessário instalar:

Node.js

MySQL Server

MySQL Workbench (recomendado para importar o banco de dados)

4. Configuração do banco de dados

Abra o MySQL Workbench.

Conecte-se ao servidor MySQL.

Importe o arquivo glass_export.sql, disponibilizado na pasta principal do projeto.

Execute a importação para criar o banco de dados e suas tabelas.

5. Configuração do Back-end

Abra o terminal dentro da pasta backend.

Execute o comando:

npm install

Crie um arquivo chamado .env dentro da pasta backend.

Configure as informações de conexão com o MySQL:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=glass_export
DB_PORT=3306
PORT=3000

Substitua sua_senha pela senha definida durante a instalação do MySQL.

6. Inicialização do sistema

Dentro da pasta backend, execute:

node src/server.js

O servidor será iniciado na porta 3000.

7. Acesso ao sistema

Com o servidor em execução, abra o arquivo frontend/index.html em um navegador.

O sistema estará disponível para utilização.

8. Observações

É necessária conexão com a internet para consultar as cotações cambiais pela AwesomeAPI.

O servidor Node.js deve permanecer em execução enquanto o sistema estiver sendo utilizado.

Os dados cadastrados e as exportações são armazenados no banco de dados MySQL.
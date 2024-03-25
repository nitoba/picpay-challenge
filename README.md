# 📊 Pic Pay Challenge

## 🚀 Introdução
Resolução do desafio do PicPay direcionado a backend.
Os requisitos para o desafio podem ser encontrados [aqui](https://github.com/PicPay/picpay-desafio-backend)


## 👨‍💻 Tecnologias

- [Javascript/Typescript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript): Linguagem de programação principal.
- [NodeJS](https://nodejs.org/en): Plataforma para executar Javascript
- [PostgreSQL](https://www.postgresql.org/): Banco de dados relacional para armazenar dados persistentes.
- [NestJS](https://nestjs.com/): Framework web para construir APIs em NodeJS.
- [Prisma ORM](https://www.prisma.io/): ORM (Object-Relational Mapping) para comunicação com o banco de dados.
- [Docker](https://www.docker.com/): Ambiente de desenvolvimento para o PostgreSQL e Redis.
- [RabbitMQ](https://www.rabbitmq.com/): Message broker para lidar com comunicação assíncrona através de filas

## 🏗️ Padrões de Projeto

A aplicação segue os seguintes padrões de projeto:

1. **Clean Architecture**: A estrutura do projeto é organizada em camadas (entidades, use cases, interfaces) para separar as preocupações e facilitar a manutenção.

2. **Domain Driven Design (DDD)**: O design do software é orientado pelo domínio, com foco nas regras de negócio e nas entidades principais.

3. **Injeção de Dependência**: A inversão de controle e injeção de dependência são utilizadas para garantir a flexibilidade e testabilidade do código.

4. **Testes automatizados**: Os testes unitários, integração e end-2-end são escritos para garantir a qualidade do código.

5. **Comunicação assíncrona**: A comunicação assíncrona dentro de um sistema trás a possibilidade de fazem as partes se comunicarem através de mensagens, sem esperar uma resposta imediata.

## 🔄 Domain Events

Um dos diferenciais dessa aplicação é a utilização do conceito de **Domain Events** para atualizar a contagem de votos quando um novo voto é registrado ou alterado. Isso garante que a lógica de negócio relacionada à contagem de votos permaneça consistente.

## 🎯 Principais Funcionalidades

- [x] Executar operações de transferência de dinheiro entre usuários

## 🔧 Rodando o projeto

Para rodar essa aplicação, você precisa ter o [NodeJS](https://golang.org/) e o [Docker](https://www.docker.com/) instalados em sua máquina.

- Rode o comando `touch .env .env.test && cp .env.example .env .env.test` para criar os arquivos de variáveis de ambiente.
- Inicie os serviços do docker usando: `docker-compose up -d`
- Rode o comando `pnpm i` para baixar as dependências. Você pode usar o gerenciado de pacotes que desejar
- Rode o comando `pnpm prisma migrate deploy` para aplicar as migrations ao banco de dados.
- Rode o comando `pnpm prisma db seed` para popular o banco de dados com alguns dados iniciais
- Rode o comando `pnpm dev` para iniciar a aplicação.
- Abra o arquivo `client.http`na raiz do projeto para chamar a rota http que realiza a operação. Importante ter a extensão [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) instalada no VsCode

## 🧪 Testes

- Rode o comando `pnpm test` para executar os testes unitários
- Rode o comando `pnpm test:e2e` para executar os testes end-to-end

## ✍🏽 Aprendizados importantes
- Comunicação entre serviços externos e como trazer resiliência para o projeto visto que serviços externos podem sofrer instabilidades

## 🧑‍💻 Possíveis melhorias
- Serviços de autenticação para o sistema
- Separar o domínio da aplicação em outros bounded contexts para uma maior manutenção, escalabilidade e legibilidade do projeto
- Adicionar recursos de observabilidades para métricas e logs
- Armazenar as mensagens de notificações para histórico
- Possível melhor abstração para lidar com envio de sms ou email

## 📝 Application flow
<img src="./.github/flow.png" style="width: 500px; height: auto;" />

## 📄 Licença

Esse projeto está sob a licença MIT. Acesse o link [LICENSE](https://mit-license.org/) para mais detalhes.

## 🌐 GitHub

O código-fonte da aplicação pode ser encontrado no GitHub: [Link do Projeto](https://github.com/nitoba/picpay-challenge)

## 📧 Contato

Em caso de dúvidas ou sugestões, entre em contato através do e-mail: [nito.ba.dev@gmail.com](mailto:nito.ba.dev@gmail.com).

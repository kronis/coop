# COOP - Case

## General information

For this recruitment process, we want you to solve a technical case assignment to better understand your
experience and skills that we see as important for this position. The main objective for this case assignment is to
understand your thought process and how you would approach such a task/project in a job setting.

## The case

We have various output channels where we want to show data from messaging platforms. One of these
messaging platforms is the micro-blogging service Mastodon.
Given this context build an application and relevant infrastructure to stream public Mastodon posts in near realtime to end users using technologies of your choice.

We suggest that you use some of the listed technologies, but you are not limited to only these. Use any tools you
will excel with. If you want to use another programming language than the ones listed below, please confirm
your choice with one of the technical contact persons, to ensure that we would be able to properly assess your
technical skills.

- Language: Go, **Typescript**, Python
- Containerization: Docker
- Inter-communication: REST, gRPC, WebSocket

## Our expectations

### At a minimum, we expect your solution to:

- Be runnable, with clear instructions on what the reviewer needs to get started
- Be organized, easy to navigate source code, with history of changes in Git
- Have some tests, that verifies that your services work
- Contain at least 2 services, with some form of inter-communication

### It is also beneficial if you think about some of the following points:

- Build steps (Continuous Integration)
- Data modeling and data structures
- Documentation
- Overall architecture and infrastructure

## Instructions

The assignment is open-ended and fictional, and you are free to interpret it and make your own decisions and
assumptions. It is up to you how much time you spend on the assignment and how complete and comprehensive
your solution is, but you should deliver something that is appropriate to be used as a basis for technical
assessment for the job role level you are applying for. The cases should be presented in a manner fit for passing
on knowledge to colleagues.

# Solution

## Good to have links

### Documentation

- https://docs.joinmastodon.org/client/intro/
- https://docs.joinmastodon.org/methods/streaming/

### API Urls

- https://mastodon.social/api/v1/streaming/health
- https://mastodon.social/api/v2/instance

## Decisions

### Backlog

Work with GitHub Project, https://github.com/users/kronis/projects/1

### Work trunk based development or with PRs

Working directly in main branch, since I am the only one working here.

### Testing Framework

Chossing Mocha this time over Jest. Normally I use Jest since it has some coverage and export features, but for this case it is not required.

### Development Versions

| App  | Version |
| ---- | ------- |
| Node | 22.9.0  |
| Docker | 27.2.0 |
| Docker Compose | 2.29.2 |

# Getting Started
There there three applications at the moment. 

## Fetcher
Fetching data from mastodon.social via WebSocket, and putting all data in RabbitMQ. 

### Development in Fetcher
```bash 
cd fetcher
npm run refresh
npm run dev
```

### How to test
```bash
npm run test
```

## Consumer
Small API using express api, fetching data from RabbitMQ and deliver it to frontend via WebSocket.

### Development in Consumer
```bash 
cd consumer
npm run refresh
npm run dev
```

## Frontend
Just a ViteJS app that connects to the Consumer WS and prints out all posts in real time. (Just the ID at the moment)

### Development in Frontend
```bash 
cd frontend
npm run refresh
npm run dev
```


## How to run it all 
```bash
export MASTODON_ACCESS_TOKEN=<access_token>
docker compose up
```

# Architechture
## Docker Compose Service Connections

| Service   | Connects To            | Protocol | Port  | Purpose                          |
|-----------|------------------------|----------|-------|----------------------------------|
| fetcher   | rabbit-mq              | AMQP     | 5672  | Sending messages to RabbitMQ     |
| consumer  | rabbit-mq              | AMQP     | 5672  | Receiving messages from RabbitMQ |
| frontend  | consumer               | WS       | 3000  | Accessing the backend API        |
| fetcher   | Mastodon API           | WSS      | 443   | Fetching Mastodon data           |
| frontend  | user browser           | HTTP     | 8080  | Exposing frontend web interface  |
| rabbit-mq | Admin (Management UI)  | HTTP     | 8081  | RabbitMQ Management interface    |

```mermaid
graph TD;
    A[User Browser] -->|HTTP:8080| B[Frontend];
    B -->|WS:3000| C[Consumer];
    C -->|AMQP:5672| D[RabbitMQ];
    E -->|WSS:443| F[Mastodon API];
    G[RabbitMQ Admin UI] --> |HTTP:15672| D;
    E[Fetcher] --> |AMQP:5672| D;


# MedClinic API

Esse é o projeto MedClinic API, feito pra o Mini-Projeto Avaliativo do Módulo 02 do curso SCTEC/SESI SENAI. Nessa primeira etapa, construí a base de autenticação e autorização de usuários de uma clínica médica — cadastro, login e controle de permissões. As próximas etapas do curso vão adicionar as funcionalidades da clínica em si (médicos, pacientes, consultas), usando essa mesma base.

## Tecnologias usadas

- Node.js + TypeScript
- Express
- TypeORM
- PostgreSQL
- bcrypt (hash de senha)
- jsonwebtoken (JWT)
- class-validator e class-transformer (validação dos dados que chegam na API)

## Arquitetura

O projeto segue uma arquitetura em camadas, separando cada responsabilidade num lugar diferente:

```
Router → Middleware (autenticação/autorização) → Controller → Service → Repository → Entity → PostgreSQL
```

- `entities`: como o usuário é representado (TypeORM)
- `database`: conexão com o banco e migration
- `repositories`: quem conversa com o banco
- `services`: onde ficam as regras de negócio
- `controllers`: recebem a requisição e devolvem a resposta
- `routes`: definem os endpoints
- `middlewares`: autenticação, autorização e tratamento de erro
- `utils`: hash de senha e geração/verificação de token
- `errors`: classe de erro usada em todo o projeto

Qualquer erro lançado em qualquer camada cai num único middleware de erro, que decide o que responder.

### Estrutura de pastas

```
src/
├── controllers/
│   ├── AdminController.ts
│   ├── AuthController.ts
│   ├── UserController.ts
│   └── dto/
│       ├── CreateUserDTO.ts
│       ├── LoginDTO.ts
│       └── UserResponseDTO.ts
├── database/
│   ├── data-source.ts
│   └── migrations/
│       └── 1789065907749-CreateUsersTable.ts
├── entities/
│   └── User.ts
├── errors/
│   └── AppError.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── error-handler.middleware.ts
│   └── rbac.middleware.ts
├── repositories/
│   └── UserRepository.ts
├── routes/
│   ├── admin.routes.ts
│   ├── auth.routes.ts
│   └── user.routes.ts
├── services/
│   ├── AuthService.ts
│   └── UserService.ts
├── utils/
│   ├── hash.ts
│   └── jwt.ts
└── server.ts
```

## Instalação e execução

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando

### Passo a passo

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o banco de dados:

   ```bash
   createdb medclinic
   ```

3. Copie o arquivo de exemplo de variáveis de ambiente e preencha com suas credenciais:

   ```bash
   cp .env.example .env
   ```

   Variáveis do `.env`:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=sua_senha
   DB_DATABASE=medclinic
   JWT_SECRET=uma_chave_secreta_qualquer
   ```

4. Rode o projeto:

   ```bash
   npm run dev
   ```

   Na primeira vez que roda, ele já conecta no banco e cria a tabela `users` sozinho (migration), não precisa rodar nenhum script SQL na mão.

   O comando `dev` roda duas coisas ao mesmo tempo: uma só confere se tem erro de tipo no código (`tsc --watch`), e a outra realmente roda o servidor, recarregando sozinho quando eu salvo um arquivo (`tsx watch`).

   ```json
   "dev": "concurrently -k -p \"[{name}]\" -c \"blue.bold,magenta.bold\" \"npm:dev:tsc\" \"npm:dev:tsx\"",
   "dev:tsc": "tsc --watch --noEmit --preserveWatchOutput",
   "dev:tsx": "tsx watch src/server.ts",
   ```

O servidor sobe em `http://localhost:3000`.

## Perfis de acesso

| Papel | O que pode fazer |
|---|---|
| `atendente` | Papel padrão de todo cadastro novo. Acessa as rotas autenticadas comuns. |
| `admin` | Acesso completo, incluindo rotas restritas. Não existe cadastro público pra virar admin — é feito direto no banco. |

## Endpoints

### `POST /auth/register` — Cadastro

**Body:**
```json
{
  "nome": "Teste da Silva",
  "email": "teste@example.com",
  "senha": "123456"
}
```

**Resposta (201):**
```json
{
  "id": 1,
  "nome": "Teste da Silva",
  "email": "teste@example.com",
  "role": "atendente",
  "createdAt": "2026-09-12T20:18:45.387Z"
}
```

Erro: `409` se o e-mail já estiver cadastrado.

### `POST /auth/login` — Login

**Body:**
```json
{
  "email": "teste@example.com",
  "senha": "123456"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
}
```

Erro: `401` se e-mail ou senha estiverem errados (mesma mensagem pros dois casos).

### `GET /users/me` — Dados do usuário logado

**Header:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "id": 1,
  "nome": "Teste da Silva",
  "email": "teste@example.com",
  "role": "atendente",
  "createdAt": "2026-09-12T20:18:45.387Z"
}
```

Erro: `401` se o token estiver ausente, inválido ou expirado.

### `GET /admin/ping` — Rota só pra admin

**Header:**
```
Authorization: Bearer <token>
```

**Resposta (200):**
```json
{
  "message": "pong",
  "user": { "id": 1, "role": "admin" }
}
```

Erros: `401` (sem token/token inválido) ou `403` (token válido, mas não é admin).

## Tratamento de erros

Todo erro devolve o mesmo formato:
```json
{ "message": "descrição do erro" }
```

Erros que a aplicação já espera (e-mail duplicado, senha errada, token inválido, sem permissão) voltam com o status certo (401, 403, 404, 409). Erros que não eram esperados voltam como `500`, sem mostrar nada do que aconteceu de verdade no servidor.

## Melhorias futuras

- Implementar as próximas entidades da clínica (especialidades, médicos, pacientes, consultas)
- Refresh token, pra não precisar logar de novo toda hora
- Rate limiting no login/cadastro
- Deixar o erro de validação (`class-validator`) devolver `400` em vez de cair no erro genérico
- Testes automatizados e documentação via Swagger

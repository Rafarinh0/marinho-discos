# 🎵 Marinho Discos

> Aplicação fullstack para catalogar, avaliar e explorar álbuns musicais — inspirada em sites como RateYourMusic e Discogs, com integração ao catálogo do **MusicBrainz**.

<p align="center">
  <img alt=".NET" src="https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet&logoColor=white">
  <img alt="React" src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-green">
</p>

---

## ✨ Sobre

**Marinho Discos** é um projeto pessoal de portfólio focado em **boas práticas de arquitetura backend** (.NET 8 com Clean Architecture + CQRS) e uma interface web moderna (React + TypeScript).

A ideia é poder pesquisar álbuns no MusicBrainz, importá-los para uma biblioteca pessoal, escrever resenhas, dar notas e ver estatísticas agregadas por artista e por gênero.

## 🚀 Features

- 🔎 **Busca externa** de álbuns via API do MusicBrainz
- 📥 **Importação** de álbuns com tracks, artistas e gêneros para a biblioteca local
- ⭐ **Resenhas e ratings** (rating como Value Object com validação no domínio)
- 👤 **Páginas de artista** com agregações (média de notas, álbum favorito, etc.)
- 📊 **Estatísticas da biblioteca** (total de álbuns, gêneros mais ouvidos, distribuição de notas)
- 🌐 **Internacionalização** (PT-BR / EN) no frontend
- 🎨 **Tema dinâmico** baseado na cover do álbum (paleta extraída em runtime)
- 🐳 **Docker Compose** com healthchecks e migrations automáticas

## 🛠 Stack

### Backend
- **.NET 8** + ASP.NET Core Web API
- **Entity Framework Core 8** com PostgreSQL (Npgsql)
- **MediatR** para CQRS (Commands / Queries / Handlers)
- **FluentValidation** com pipeline behavior
- **Clean Architecture** (Domain → Application → Infrastructure → API)

### Frontend
- **React 18** + **TypeScript** + **Vite**
- **TanStack Query** (cache e revalidação)
- **React Router** v6
- CSS puro com tokens de design

### Infra
- **PostgreSQL 16**
- **Docker Compose** com healthcheck em todos os serviços
- **nginx** servindo o build do frontend + proxy reverso pra API

---

## 🏛 Arquitetura

```
┌─────────────────┐    HTTP/JSON     ┌──────────────────┐    EF Core    ┌──────────────┐
│   Frontend      │ ───────────────▶ │   API (.NET)     │ ────────────▶ │  PostgreSQL  │
│  React + Vite   │   /api/* proxy   │  Clean Arch +    │               │              │
│   (nginx :80)   │                  │  CQRS + MediatR  │               │              │
└─────────────────┘                  └────────┬─────────┘               └──────────────┘
                                              │
                                              ▼
                                     ┌──────────────────┐
                                     │   MusicBrainz    │
                                     │  External API    │
                                     └──────────────────┘
```

### Camadas (Backend)

| Camada           | Responsabilidade                                              |
|------------------|---------------------------------------------------------------|
| `Domain`         | Entidades, Value Objects, regras de negócio puras             |
| `Application`    | Use cases (Commands/Queries), validação, contratos            |
| `Infrastructure` | EF Core, repositórios, integrações externas (MusicBrainz)     |
| `API`            | Controllers, middlewares, composição de DI, configuração HTTP |

---

## 🐳 Como rodar (Docker)

**Pré-requisitos:** Docker Desktop instalado.

```bash
# 1. Clone o repo
git clone https://github.com/Rafarinh0/marinho-discos.git
cd marinho-discos

# 2. (Opcional) Crie um .env a partir do template
cp .env.example .env

# 3. Suba tudo
docker compose up --build
```

Quando subir:

| Serviço   | URL                                 |
|-----------|-------------------------------------|
| Frontend  | http://localhost:5173               |
| API       | http://localhost:8080               |
| Swagger   | http://localhost:8080/swagger       |
| Health    | http://localhost:8080/health        |
| Postgres  | `localhost:5432` (user `marinho`)   |

As migrations rodam automaticamente no startup da API.

---

## 💻 Como rodar localmente (sem Docker)

### Backend

```bash
# 1. Suba apenas o Postgres
docker compose up db -d
```

**2. Crie `backend/MarinhoDiscos.API/appsettings.Development.json`** com a connection string apontando pro seu Postgres local. Esse arquivo é **gitignored** — é onde você pode (e deve) colocar credenciais locais sem medo.

```json
{
  "ConnectionStrings": {
    "Default": "Host=localhost;Port=5432;Database=marinho_discos;Username=<seu_user>;Password=<sua_senha>"
  }
}
```

> 💡 Se você subiu o Postgres via `docker compose up db -d` **sem** criar um `.env`, os defaults do compose são `marinho` / `marinhodiscos` / `marinho_discos`. Se você criou um `.env`, use os valores que colocou lá.

```bash
# 3. Rode a API
cd backend
dotnet run --project MarinhoDiscos.API
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite já tem proxy `/api` → `http://localhost:8080` configurado em [vite.config.ts](frontend/vite.config.ts).

---

## 📁 Estrutura do projeto

```
.
├── backend/
│   ├── MarinhoDiscos.API/             # Controllers, middlewares, Program.cs
│   ├── MarinhoDiscos.Application/     # CQRS handlers, validators, DTOs
│   ├── MarinhoDiscos.Domain/          # Entities, Value Objects, regras
│   ├── MarinhoDiscos.Infrastructure/  # EF Core, repositórios, MusicBrainz
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── api/         # HTTP client + endpoints
│   │   ├── components/  # UI components
│   │   ├── pages/       # Search, Library, Album, Artist
│   │   ├── theme/       # Paleta dinâmica
│   │   └── i18n/        # PT-BR / EN
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
└── .env.example
```

---

## 📡 API — principais endpoints

| Método | Rota                                          | Descrição                          |
|--------|-----------------------------------------------|------------------------------------|
| GET    | `/api/albums`                                 | Lista paginada de álbuns           |
| GET    | `/api/albums/{id}`                            | Detalhe completo do álbum          |
| GET    | `/api/albums/{id}/reviews`                    | Reviews do álbum                   |
| POST   | `/api/albums/{id}/reviews`                    | Cria review                        |
| PUT    | `/api/reviews/{id}`                           | Atualiza review                    |
| DELETE | `/api/reviews/{id}`                           | Remove review                      |
| GET    | `/api/artists`                                | Lista artistas                     |
| GET    | `/api/artists/{id}`                           | Detalhe do artista                 |
| GET    | `/api/artists/{id}/stats`                     | Estatísticas do artista            |
| GET    | `/api/genres`                                 | Lista de gêneros                   |
| GET    | `/api/library/stats`                          | Estatísticas globais da biblioteca |
| GET    | `/api/external-catalog/albums?q=...`          | Busca álbuns no MusicBrainz        |
| POST   | `/api/external-catalog/albums/{id}/import`    | Importa álbum pra biblioteca       |
| POST   | `/api/external-catalog/albums/{id}/reviews`   | Cria review importando se preciso  |

Documentação interativa completa em `/swagger` quando rodando em Development.

---

## 🧪 Padrões aplicados

- **Clean Architecture** — dependências apontam pra dentro
- **CQRS** — Commands e Queries separados via MediatR
- **Repository Pattern** + **Unit of Work**
- **Rich Domain Model** — regras nas entidades, não em services anêmicos
- **Pipeline Behavior** — validação automática nos handlers via FluentValidation
- **Global Exception Handling** — middleware único traduzindo exceções de domínio em HTTP
- **DTOs separados** por use case (leitura ≠ escrita)

---
---

# URL Shortener Backend

[![CI](https://img.shields.io/github/actions/workflow/status/ZiadAlnajjar/url-shortener-be/.github/workflows/release.yml?branch=main&style=flat-square)](https://github.com/ZiadAlnajjar/url-shortener-be/actions)
[![License: MIT](https://img.shields.io/github/license/ZiadAlnajjar/url-shortener-be?style=flat-square)](./LICENSE)
[![Made with Nx](https://img.shields.io/badge/Made%20with-Nx-5FA6D6?style=flat-square&logo=nrwl&logoColor=white)](https://nx.dev)
[![Dockerized](https://img.shields.io/badge/docker-ready-blue?style=flat-square&logo=docker)](https://www.docker.com/)

A scalable, microservices-based backend for a URL shortening application, built with Nestjs, Prisma, and Docker. It includes modular services for link management and analytics, inter-service messaging via RabbitMQ, and support for multiple databases.

---

## 🚀 Quick Start

### 🔧 Local Setup

> ℹ️ Some commands use `make` internally, so ensure `make` is installed.

1. **Configure Environment Files**

Create `.env` files in the following directories:

```
apps/link-service/.env
apps/stats-service/.env
libs/shared/.env
```

2. **Copy Shared Environment Variables**

```bash
nx run shared:cpSharedEnv
```

3. **Start Dependencies**

Make sure RabbitMQ and database instances (PostgreSQL or MySQL) are running.

4. **Run Database Migrations**

```bash
nx run-many --target=migrate --configuration=deploy --all
```

5. **Generate Prisma Clients**

```bash
nx run-many --target=generate-prisma-client --all
```

6. **Build and Start All Services**

```bash
nx run-many --target=build --all
```

---

### 🐳 Docker-Based Setup

To spin up services along with RabbitMQ and databases via Docker:

```bash
nx run-many --target=docker-build --all
```

---

## 🔄 Changing the Database Provider

You can switch between PostgreSQL and MySQL for a given service.

### Steps:

1. In the service directory (e.g., `apps/link-service`), update the `.env` file:

- Set `DB_PROVIDER` to either `postgresql` or `mysql`
- Update other DB-related environment variables accordingly

2. Generate the updated Prisma client (also updates the schema provider):

```bash
nx run <service_name>:generate-prisma-client
```

3. If using Docker:

- Update the `.tools` file to reflect the correct DB image
- Then rebuild:

```bash
nx run <service_name>:docker-build
```

---

## 🏗 Architecture

This monorepo uses [Nx](https://nx.dev) to manage multiple services and libraries.

### Services:

- **API Gateway (`apps/api-gateway`)**
  Exposes endpoints for public access and routes requests to backend services.

- **Link Service (`apps/link-service`)**
  Handles URL shortening, redirection.

- **Stats Service (`apps/stats-service`)**
  Tracks analytics like click counts.

### Shared Libraries:

- **Shared Config (`libs/shared`)**
  Contains shared types, constants, env config loaders, and utilities.

---

## 🧪 Usage Examples

### 🔗 Shorten a URL

GraphQL endpoint:

```
POST /api/graphql
```

Mutation:

```graphql
mutation {
  createShortLink(newLinkData: { originalUrl: "https://example.com" }) {
    id
    originalUrl
    shortenedUrl
    ...
  }
}
```

---

### 🔁 Redirect to Original URL

```
GET /api/link/:shortCode
```

> **Note:** This endpoint is intended to be proxied via a reverse proxy to strip the `/api/link` prefix for public redirection (e.g., `/abc123` → `/api/link/abc123`).

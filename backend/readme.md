# Top 5 – Backend (Laravel API)

Este repositório contém o **backend** da aplicação *Top 5 Tião Carreiro & Pardinho*, desenvolvido em **Laravel 11**, que expõe uma API REST para ser consumida pelo frontend (React).

---

## 🚀 Tecnologias

- PHP 8.3
- Laravel 11
- Sanctum (autenticação com Bearer Token + Refresh)
- PostgreSQL (produção/dev)
- SQLite (testes)
- Docker + Docker Compose
- Pest (testes automatizados)

---

## ⚙️ Instalação e execução

### 1. Pré-requisitos
- Docker e Docker Compose instalados

### 2. Clonar o repositório
```bash
git clone <repo> techpines-test
cd techpines-test/backend
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
Edite o `.env`:
```env
DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=tiao_db
DB_USERNAME=tiao
DB_PASSWORD=secret

APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:5173
```

### 4. Subir containers
```bash
docker compose up -d --build
```

### 5. Instalar dependências PHP
```bash
docker compose exec app composer install
docker compose exec app php artisan key:generate
```

### 6. Migrar e popular banco
```bash
docker compose exec app php artisan migrate --seed
```

API estará disponível em: [http://localhost:8080/api](http://localhost:8080/api)

---

## 🔑 Autenticação

Fluxo com **Laravel Sanctum**:

- `POST /api/login` → gera `access_token` (15min) + `refresh_token` (30d)
- `POST /api/refresh` → troca refresh por novo access
- `POST /api/logout` → revoga token atual
- `GET /api/me` → retorna usuário logado

Enviar sempre no header:
```
Authorization: Bearer <ACCESS_TOKEN>
```

---

## 🎵 Endpoints principais

### Público
- `GET /api/songs/top5` – retorna Top 5
- `GET /api/songs` – retorna músicas da 6ª em diante (paginado)
- `POST /api/suggestions` – cria sugestão

### Autenticado
- `POST /api/suggestions/{id}/approve` – aprovar sugestão
- `POST /api/suggestions/{id}/reject` – rejeitar sugestão
- `POST /api/songs` – criar música
- `PUT /api/songs/{id}` – atualizar música
- `DELETE /api/songs/{id}` – excluir música

---

## 🧪 Testes

### Rodar todos os testes (Pest)
```bash
docker compose exec app ./vendor/bin/pest
```

### Rodar testes do Laravel
```bash
docker compose exec app php artisan test
```

Banco de testes usa **SQLite em memória**.

---

## 📂 Estrutura

```
backend/
├─ app/
│  ├─ Http/Controllers/ (Auth, Song, Suggestion, User)
│  ├─ Http/Requests/ (validações)
│  ├─ Models/ (Song.php, Suggestion.php, User.php)
│  └─ Rules/ (YoutubeUrl.php)
├─ database/
│  ├─ factories/ (SongFactory.php, SuggestionFactory.php)
│  ├─ migrations/
│  └─ seeders/ (SongSeeder.php, UserSeeder.php)
├─ routes/api.php
├─ docker/Dockerfile
├─ docker/nginx/default.conf
└─ docker-compose.yml
```

---

## 👤 Usuário padrão (seed)

- **Email:** `admin@example.com`
- **Senha:** `secret`


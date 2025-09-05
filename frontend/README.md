# Top 5 Tião Carreiro & Pardinho

SPA completa em React + TypeScript + Vite para gerenciar e visualizar o Top 5 das melhores músicas de Tião Carreiro & Pardinho.

## 🎵 Funcionalidades

### Público (Sem Login)
- **Home page**: Top 5 músicas em destaque com design atraente
- **Lista paginada**: Todas as demais músicas com paginação
- **Sugestões**: Formulário público para sugerir músicas via URL do YouTube
- **Design responsivo**: Tema sertanejo com cores terrosas e animações

### Área Logada (Usuários)
- **Dashboard**: Visão geral da plataforma
- **CRUD de Músicas**: Criar, editar e excluir músicas
- **Busca**: Filtro client-side por título/artista
- **Preview**: Visualização de thumbnails do YouTube

### Área Admin (role: admin)
- **Gerenciar Sugestões**: Aprovar ou rejeitar sugestões dos usuários
- **Teste por ID**: Interface para testar ações quando endpoint de listagem não disponível

## 🚀 Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + shadcn/ui + Lucide Icons
- **Formulários**: React Hook Form + Zod (validação)
- **Estado**: TanStack Query (cache e sincronização)
- **Autenticação**: Laravel Sanctum (cookies HttpOnly)
- **Roteamento**: React Router DOM v6
- **API**: Axios com interceptors

## ⚙️ Configuração

### 1. Instalar Dependências
```bash
npm install
# ou
pnpm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_HAS_ADMIN_LIST=0
```

**Variáveis:**
- `VITE_API_BASE_URL`: URL base da API Laravel (padrão: http://localhost:8080)
- `VITE_HAS_ADMIN_LIST`: Define se endpoint de listagem de sugestões existe (0=não, 1=sim)

### 3. Executar em Desenvolvimento
```bash
npm run dev
# ou
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🔐 Autenticação Sanctum

### Fluxo de Autenticação
1. **CSRF Cookie**: Sempre chama `GET /sanctum/csrf-cookie` antes do login
2. **Login**: `POST /api/login` com credentials
3. **Sessão**: Mantida via cookies HttpOnly automaticamente
4. **Verificação**: `GET /api/me` para dados do usuário logado
5. **Logout**: `POST /api/logout`

### Configuração do Axios
- `withCredentials: true` habilitado globalmente
- Interceptor para redirecionar 401 → /login
- Headers corretos para JSON API

### CORS no Backend Laravel
Certifique-se que o CORS está configurado com:
```php
'supports_credentials' => true,
'allowed_origins' => ['http://localhost:5173'],
```

## 📋 Endpoints da API

### Públicos
```
GET /api/songs/top          # Top 5 músicas
GET /api/songs?page=1       # Lista paginada
POST /api/suggestions       # Criar sugestão
```

### Autenticados
```
GET /sanctum/csrf-cookie    # CSRF token
POST /api/login            # Login
GET /api/me               # Dados do usuário
POST /api/logout          # Logout
GET /api/songs            # CRUD músicas
POST /api/songs
PUT /api/songs/:id
DELETE /api/songs/:id
```

### Admin
```
POST /api/admin/suggestions/:id/approve    # Aprovar sugestão
POST /api/admin/suggestions/:id/reject     # Rejeitar sugestão
```

## 👥 Usuários de Teste

Use estas credenciais no backend seeded:

**Administrador:**
- Email: admin@example.com
- Senha: secret

**Usuário comum:**
- Email: user@example.com  
- Senha: secret

## 🎨 Sistema de Design

### Paleta de Cores (HSL)
- **Primário**: `hsl(25, 65%, 27%)` - Marrom sertanejo
- **Secundário**: `hsl(41, 45%, 82%)` - Bege palha
- **Accent**: `hsl(82, 39%, 30%)` - Verde campo
- **Gradientes**: Efeitos terrosos e quentes

### Componentes Customizados
- Variantes sertanejas para Button e Card
- Tema responsivo com dark mode
- Animações suaves e sombras elegantes
- Ícones contextuais (Lucide React)

## 🧪 Testes

```bash
npm run test
# ou
pnpm test
```

### Cobertura de Testes
- Fluxo de login completo
- Renderização do Top 5 com mocks
- Validação de formulários (URL YouTube)
- CRUD básico de músicas
- Proteção de rotas

## 📦 Build e Deploy

### Build de Produção
```bash
npm run build
# ou
pnpm build
```

### Preview da Build
```bash
npm run preview
# ou
pnpm preview
```

### Docker (Opcional)

**Dockerfile** para desenvolvimento:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
```

**docker-compose.yml**:
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://backend:8080
    volumes:
      - .:/app
      - /app/node_modules
```

## 🗂️ Estrutura do Projeto

```
src/
├── components/
│   ├── layout/           # Header, Footer
│   ├── forms/           # SongForm, SuggestionForm  
│   ├── ui/              # shadcn/ui components
│   ├── SongCard.tsx     # Card de música reutilizável
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx  # Estado de autenticação
├── hooks/
│   ├── use-toast.ts     # Toast notifications
│   └── usePagination.ts # Paginação com URL
├── lib/
│   ├── api.ts           # Instância Axios + CSRF
│   ├── schemas.ts       # Validações Zod
│   └── utils.ts         # Utilitários
├── pages/
│   ├── Home.tsx         # Página inicial pública
│   ├── Login.tsx        # Formulário de login
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── Songs.tsx        # CRUD de músicas
│   └── Admin.tsx        # Painel administrativo
├── services/
│   ├── auth.ts          # Serviços de autenticação
│   ├── songs.ts         # API de músicas
│   └── suggestions.ts   # API de sugestões
└── types/
    └── index.ts         # TypeScript interfaces
```

## 🔧 Personalização

### Mudança de Paleta
Para alterar as cores do tema, edite `src/index.css`:

```css
:root {
  --sertanejo-brown: 25 65% 27%;     # Cor primária
  --sertanejo-green: 82 39% 30%;     # Cor de accent
  --sertanejo-beige: 41 45% 82%;     # Cor secundária
  /* ... */
}
```

### Busca Server-side
Para implementar busca no backend, modifique `src/services/songs.ts`:

```typescript
async getSongs(page = 1, perPage = 10, search?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    ...(search && { search })
  });
  
  const response = await api.get(`/api/songs?${params}`);
  return response.data;
}
```

### PWA (Progressive Web App)
Para converter em PWA, instale o plugin do Vite:

```bash
npm install @vite/plugin-pwa --save-dev
```

E configure em `vite.config.ts`.

## 🐛 Solução de Problemas

### CORS Errors
- Verifique se `withCredentials: true` no frontend
- Configure CORS no Laravel para aceitar credentials
- Certifique-se da URL correta em `VITE_API_BASE_URL`

### 401 Unauthorized
- CSRF cookie pode ter expirado
- Logout e login novamente
- Verifique se o backend está rodando

### Thumbnails não carregam
- YouTube pode bloquear hotlinking
- Placeholder será usado automaticamente
- Considere proxy para imagens se necessário

## 📚 Links Úteis

- [Laravel Sanctum Docs](https://laravel.com/docs/sanctum)
- [TanStack Query](https://tanstack.com/query)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)

---

**Desenvolvido com ❤️ para preservar a música sertaneja de raiz**
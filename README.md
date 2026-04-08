# 🚀 Fluxa — Escola de Idiomas com Método APA

> Aplicação full-stack moderna. React + TypeScript + Styled-Components · Node.js + Express + JWT

---

## 🎯 O que é a Fluxa

Fluxa é uma plataforma completa de ensino de idiomas baseada no **Ciclo APA** (Adquirir, Praticar, Ajustar) — a metodologia que respeita como o cérebro humano realmente adquire linguagem.

Não é mais um site de escola. É um produto funcional com:
- Motor de exercícios APA com correção em tempo real
- JWT completo com refresh token automático
- Mascote humano "Kai" animado em SVG puro
- Navbar com detecção inteligente de luminosidade
- Design system cobalto + verde elétrico (paleta 2026)
- i18n PT/EN com troca em tempo real

---

## 🏃 Como rodar em 3 passos

```bash
# Terminal 1 — Backend
cd fluxa/backend
cp .env.example .env
npm install
npm run dev          # http://localhost:3001

# Terminal 2 — Frontend
cd fluxa/frontend
npm install
npm run dev          # http://localhost:5173
```

### Credenciais demo
| Papel | E-mail | Senha |
|---|---|---|
| Admin | admin@fluxa.com.br | Admin@123 |
| Aluno | demo@fluxa.com.br  | Student@123 |

> **FIX**: Login funcionava em versão anterior com hashes inválidos. Agora os hashes bcrypt são gerados pelo `src/config/seed.js` no startup — garantindo funcionamento real.

---

## 🏗️ Estrutura

```
fluxa/
├── backend/src/
│   ├── config/seed.js          ← Gera hashes bcrypt reais no startup
│   ├── data/database.js        ← DB in-memory com conteúdo APA real
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── course.controller.js
│   │   ├── learn.controller.js  ← Motor de exercícios APA
│   │   ├── contact.controller.js
│   │   └── user.controller.js
│   ├── middleware/              ← JWT, errorHandler, notFound
│   └── routes/                 ← auth, course, learn, contact, user
│
└── frontend/src/
    ├── styles/theme.ts          ← Design system: cobalto #0066FF + verde #00E5A0
    ├── components/
    │   ├── mascot/Mascot.tsx    ← Kai: personagem humano SVG animado, 7 moods
    │   ├── layout/
    │   │   ├── Navbar.tsx       ← Detecção de luminosidade inteligente
    │   │   ├── Footer.tsx
    │   │   └── PageLoader.tsx   ← Loader branded Fluxa
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   └── CoursePlaceholder.tsx  ← SVG generativo por idioma
    │   └── exercises/
    │       └── ExerciseEngine.tsx     ← Motor APA: múltipla escolha, fill-blank,
    │                                    reorder, translation + feedback
    └── pages/
        ├── Home.tsx            ← Landing redesenhada
        ├── Courses.tsx
        ├── CourseDetail.tsx    ← Com accordion de módulos + sidebar sticky
        ├── LearnPage.tsx       ← Sessão de exercícios APA completa
        ├── About.tsx
        ├── Contact.tsx
        ├── Login.tsx / Register.tsx
        ├── Dashboard.tsx       ← Com cursos matriculados + link para praticar
        └── NotFound.tsx
```
## 🔐 Segurança

- JWT access (7d) + refresh token (30d) com renovação automática
- Bcrypt salt 10 gerado em runtime (não hardcoded)
- Helmet, CORS, Rate limiting (10 req/15min no login)
- Validação com express-validator
- Rotas protegidas com middleware de role

---

## 🚀 Deploy

### Render (gratuito)

**Backend:**
1. New → Web Service → conectar GitHub
2. Root: `backend` · Build: `npm install` · Start: `node src/server.js`
3. Variáveis: `JWT_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `NODE_ENV=production`

**Frontend:**
1. New → Static Site → mesmo repositório
2. Root: `frontend` · Build: `npm install && npm run build` · Publish: `dist`
3. `VITE_API_URL=https://sua-api.onrender.com`

### VPS com PM2
```bash
npm install -g pm2
cd backend && pm2 start src/server.js --name fluxa-api
pm2 save && pm2 startup
```

---

*Desenvolvido por **Lucas Fernandes** — Fernandes Web Studio*

# STEP_1_BUILD_INSTRUCTIONS.md
# Task: Initialize UrbanEstate Project - Phase 1.1 Scaffolding

---

## CONTEXT

Build UrbanEstate real estate platform for Kenya. Serverless stack: Supabase + Netlify + Next.js + Cloudinary + Cloudflare. Phase 1: Foundation only. NO traditional backend server.

---

## CREATE ROOT STRUCTURE

```
urbanestate/
├── frontend/
├── supabase/
├── netlify/
├── docs/
├── netlify.toml
├── .gitignore
└── README.md
```

---

## FRONTEND PACKAGE.JSON

File: `frontend/package.json`

```json
{
  "name": "urbanestate-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.8.7",
    "lucide-react": "^0.263.1",
    "zod": "^3.22.4",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.48",
    "@types/react-dom": "^18.2.18",
    "typescript": "^5.3.3",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.33",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.1.0"
  }
}
```

---

## TYPESCRIPT CONFIG

File: `frontend/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## TAILWIND CONFIG

File: `frontend/tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'civic-blue': '#0B1F33',
        'verification-green': '#1E7F4B',
        'authority-amber': '#C28F2C',
        'institutional-white': '#F8F9FA',
        'deep-charcoal': '#1A1A1A',
        'subtle-border': '#E3E6E8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## POSTCSS CONFIG

File: `frontend/postcss.config.js`

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

---

## NEXT.JS CONFIG

File: `frontend/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
```

---

## ENVIRONMENT TEMPLATE

File: `frontend/.env.example`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=urbanestate_properties

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# SMS (Phase 2)
AFRICASTALKING_USERNAME=
AFRICASTALKING_API_KEY=
AFRICASTALKING_SENDER_ID=URBANESTATE
```

---

## NETLIFY CONFIG

File: `netlify.toml` (root directory)

```toml
[build]
  command = "cd frontend && npm run build"
  publish = "frontend/.next"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## GIT IGNORE

File: `.gitignore` (root directory)

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.production
.env*.local

# Build
.next/
out/
.netlify/
.supabase/
dist/
build/

# Logs
logs/
*.log

# Testing
coverage/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
```

---

## ROOT README

File: `README.md` (root directory)

```markdown
# UrbanEstate

Verified real estate platform for Kenya.

## Stack
- Frontend: Next.js 14 + TypeScript + Tailwind
- Database: Supabase (PostgreSQL + Auth)
- API: Netlify Functions (Serverless)
- Images: Cloudinary
- CDN: Cloudflare
- Hosting: Netlify

## Local Development

\`\`\`bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with credentials
npm run dev
\`\`\`

## Documentation
See `/docs` for architecture and guidelines.

## License
Proprietary - UrbanEstate
```

---

## CREATE DIRECTORY STRUCTURE

### Frontend Directories

Create these folders with .gitkeep files:

```
frontend/
├── app/
│   └── .gitkeep
├── components/
│   ├── ui/
│   │   └── .gitkeep
│   ├── property/
│   │   └── .gitkeep
│   ├── layout/
│   │   └── .gitkeep
│   ├── auth/
│   │   └── .gitkeep
│   ├── admin/
│   │   └── .gitkeep
│   └── common/
│       └── .gitkeep
├── lib/
│   ├── supabase/
│   │   └── .gitkeep
│   ├── cloudinary/
│   │   └── .gitkeep
│   ├── api/
│   │   └── .gitkeep
│   ├── utils/
│   │   └── .gitkeep
│   └── types/
│       └── .gitkeep
├── hooks/
│   └── .gitkeep
├── styles/
│   └── .gitkeep
└── public/
    ├── logo/
    │   └── README.md
    └── icons/
        └── .gitkeep
```

---

## LOGO DIRECTORY README

File: `frontend/public/logo/README.md`

```markdown
# Logo Assets

Place logo files here:
- app-icon.png (1024x1024)
- logo-horizontal.png

These will be added manually after scaffolding.
```

---

## SUPABASE SETUP

File: `supabase/config.toml`

```toml
[project]
name = "urbanestate"

[api]
enabled = true
port = 54321
schemas = ["public", "storage"]

[db]
port = 54322

[studio]
enabled = true
port = 54323
```

File: `supabase/README.md`

```markdown
# Supabase Setup

## Local Development
\`\`\`bash
supabase start
supabase migration up
\`\`\`

## Migrations
SQL files in migrations/ folder applied in order.
```

Create: `supabase/migrations/.gitkeep`

---

## NETLIFY SETUP

File: `netlify/functions/README.md`

```markdown
# Netlify Functions

Serverless API endpoints. Each file exports a handler function.

Example:
\`\`\`typescript
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello' }),
  };
};
\`\`\`
```

Create: `netlify/functions/.gitkeep`

---

## VERIFICATION CHECKLIST

After completion confirm:
- [ ] All folders created
- [ ] package.json has Supabase dependencies
- [ ] TypeScript strict mode enabled
- [ ] Tailwind brand colors configured
- [ ] netlify.toml present
- [ ] No backend/ folder (serverless architecture)
- [ ] .env.example exists
- [ ] .gitignore includes all sensitive files

---

## DO NOT CREATE YET

- No Next.js pages or components
- No Supabase migrations
- No Netlify functions code
- No actual implementations
- Just scaffolding structure only

---

## CRITICAL NOTE

This is SERVERLESS architecture. No Express.js backend. No traditional server. Everything runs on Supabase + Netlify + Next.js.
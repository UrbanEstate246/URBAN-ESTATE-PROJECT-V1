# PROJECT_STRUCTURE.md
# UrbanEstate - Complete Project Structure

**Version:** 2.0 - Serverless Stack  
**Stack:** Supabase + Netlify + Next.js + Cloudinary + Cloudflare

---

## ROOT STRUCTURE

```
urbanestate/
├── frontend/                 # Next.js application
├── supabase/                 # Database migrations
├── netlify/                  # Serverless functions
├── docs/                     # Documentation
├── netlify.toml              # Netlify configuration
├── .gitignore
└── README.md
```

---

## FRONTEND STRUCTURE

```
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── how-it-works/
│   │   │   └── page.tsx
│   │   └── contact/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── edit/
│   │   │           └── page.tsx
│   │   ├── messages/
│   │   │   └── page.tsx
│   │   ├── saved/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── properties/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── verification/
│   │   │   └── page.tsx
│   │   ├── logs/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/
│   │   └── webhook/
│   │       └── route.ts
│   │
│   ├── layout.tsx
│   ├── globals.css
│   ├── error.tsx
│   ├── loading.tsx
│   └── not-found.tsx
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Dialog.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Spinner.tsx
│   │   └── Skeleton.tsx
│   │
│   ├── property/
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyGrid.tsx
│   │   ├── PropertyFilters.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── PropertyForm.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ImageGallery.tsx
│   │   └── VerificationBadge.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNav.tsx
│   │   └── Container.tsx
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── OTPInput.tsx
│   │   └── GoogleSignIn.tsx
│   │
│   ├── admin/
│   │   ├── AdminSidebar.tsx
│   │   ├── PropertyReviewCard.tsx
│   │   ├── UserTable.tsx
│   │   ├── AuditLogTable.tsx
│   │   └── FeatureToggle.tsx
│   │
│   └── common/
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── SearchBar.tsx
│       └── Pagination.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   ├── middleware.ts
│   │   └── types.ts
│   │
│   ├── cloudinary/
│   │   ├── upload.ts
│   │   ├── transform.ts
│   │   └── config.ts
│   │
│   ├── api/
│   │   ├── client.ts
│   │   └── endpoints.ts
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   └── types/
│       ├── property.ts
│       ├── user.ts
│       ├── api.ts
│       └── database.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── useProperties.ts
│   ├── useUser.ts
│   ├── useSupabase.ts
│   └── useDebounce.ts
│
├── styles/
│   └── globals.css
│
├── public/
│   ├── logo/
│   │   ├── app-icon.png
│   │   ├── logo-horizontal.png
│   │   └── README.md
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   ├── images/
│   │   └── placeholder.jpg
│   ├── favicon.ico
│   ├── robots.txt
│   └── manifest.json
│
├── .env.local
├── .env.example
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## SUPABASE STRUCTURE

```
supabase/
├── migrations/
│   ├── 20250101000001_create_users_table.sql
│   ├── 20250101000002_create_properties_table.sql
│   ├── 20250101000003_create_property_images_table.sql
│   ├── 20250101000004_create_units_table.sql
│   ├── 20250101000005_create_land_verification_table.sql
│   ├── 20250101000006_create_audit_logs_table.sql
│   └── 20250101000007_enable_rls_policies.sql
│
├── functions/
│   └── _shared/
│       └── supabase.ts
│
├── seed.sql
├── config.toml
└── README.md
```

---

## NETLIFY STRUCTURE

```
netlify/
├── functions/
│   ├── send-sms.ts
│   ├── upload-image.ts
│   ├── verify-property.ts
│   ├── webhook-handler.ts
│   └── _shared/
│       ├── supabase.ts
│       ├── types.ts
│       └── utils.ts
│
└── edge-functions/
    └── rate-limiter.ts
```

---

## FILE NAMING CONVENTIONS

**Components:** PascalCase.tsx (PropertyCard.tsx, UserProfile.tsx)

**Utilities:** camelCase.ts (formatPrice.ts, validatePhone.ts)

**Database Migrations:** YYYYMMDDHHMMSS_description.sql

**Netlify Functions:** kebab-case.ts (send-sms.ts, verify-property.ts)

---

## CRITICAL RULES

**NO traditional backend folder. This is serverless architecture.**

**All business logic in frontend/lib/ or netlify/functions/**

**Database security via Supabase Row-Level Security (RLS)**

**Images stored in Cloudinary, not Supabase Storage**

**TypeScript strict mode always enabled**

**No Express.js server. No REST API in backend folder.**
# ARCHITECTURE.md
# UrbanEstate - System Architecture

**Version:** 1.0  
**Phase:** Foundation (No Users Yet)

---

## TECHNOLOGY STACK

**Frontend:** Next.js 14 + TypeScript + Tailwind CSS

**Database:** Supabase (PostgreSQL + Authentication)

**API Layer:** Netlify Functions (Serverless)

**Image Storage:** Cloudinary

**CDN:** Cloudflare

**Hosting:** Netlify

---

## SYSTEM ARCHITECTURE

```
Internet
    ↓
[Cloudflare] - DNS + CDN + WAF
    ↓
[Netlify] - Frontend + Serverless Functions
    ↓
    ├─→ [Next.js Frontend] - Public pages + Dashboards
    │
    ├─→ [Netlify Functions] - SMS, Webhooks, Server operations
    │
    └─→ [Supabase]
            ├─→ PostgreSQL (Database)
            └─→ Auth (OTP + Google OAuth)

[Cloudinary] - Image optimization + CDN
```

---

## DATABASE SCHEMA

### USERS TABLE
```sql
id                UUID PRIMARY KEY
phone             VARCHAR(15) UNIQUE
email             VARCHAR(255)
google_id         VARCHAR(255)
role              ENUM('tenant', 'landlord', 'agent', 'admin')
verification_level INT DEFAULT 0
trust_score       INT DEFAULT 0
status            ENUM('active', 'suspended') DEFAULT 'active'
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### PROPERTIES TABLE
```sql
id                    UUID PRIMARY KEY
owner_id              UUID REFERENCES users(id)
category              ENUM('rent', 'sale', 'land')
type                  VARCHAR(50)
status                ENUM('active', 'pending', 'hidden', 'suspended')
verification_status   ENUM('unverified', 'pending', 'verified')
sponsored             BOOLEAN DEFAULT false
title                 VARCHAR(200)
description           TEXT
price                 DECIMAL(12,2)
county                VARCHAR(100)
area                  VARCHAR(100)
ward                  VARCHAR(100)
gps_lat               DECIMAL(10,8)
gps_lng               DECIMAL(11,8)
bedrooms              INT
bathrooms             INT
amenities             JSONB
views                 INT DEFAULT 0
inquiries             INT DEFAULT 0
created_at            TIMESTAMP
updated_at            TIMESTAMP
```

### PROPERTY_IMAGES TABLE
```sql
id                    UUID PRIMARY KEY
property_id           UUID REFERENCES properties(id)
cloudinary_public_id  VARCHAR(255)
cloudinary_url        TEXT
thumbnail_url         TEXT
display_order         INT
uploaded_at           TIMESTAMP
```

### UNITS TABLE
```sql
id                UUID PRIMARY KEY
property_id       UUID REFERENCES properties(id)
unit_number       VARCHAR(50)
rent              DECIMAL(10,2)
status            ENUM('vacant', 'occupied', 'maintenance')
tenant_id         UUID REFERENCES users(id)
```

### LAND_VERIFICATION TABLE
```sql
id                    UUID PRIMARY KEY
property_id           UUID REFERENCES properties(id)
parcel_number         VARCHAR(100)
verification_source   ENUM('manual', 'third_party', 'gok')
verification_status   ENUM('pending', 'verified', 'failed')
verified_at           TIMESTAMP
verified_by           UUID REFERENCES users(id)
```

### AUDIT_LOGS TABLE
```sql
id                UUID PRIMARY KEY
user_id           UUID REFERENCES users(id)
action            VARCHAR(100)
entity_type       VARCHAR(50)
entity_id         UUID
before_state      JSONB
after_state       JSONB
ip_address        VARCHAR(45)
user_agent        TEXT
created_at        TIMESTAMP
```

---

## AUTHENTICATION FLOW

```
1. User enters phone number
2. Generate OTP → Store in Supabase Auth
3. Send SMS via Netlify Function
4. User enters OTP
5. Verify OTP via Supabase
6. Generate JWT session
7. Store session in HTTP-only cookie
```

---

## PROPERTY LISTING FLOW

```
1. Landlord creates property → Status: pending
2. Upload images to Cloudinary
3. Store Cloudinary URLs in database
4. Admin reviews → Status: active or rejected
5. Active properties appear in search
```

---

## API ENDPOINTS STRUCTURE

**Supabase handles:**
- User authentication
- Database queries (via PostgREST)
- Real-time subscriptions

**Netlify Functions handle:**
- SMS sending (Africa's Talking)
- Cloudinary uploads (server-side)
- Webhook processing
- Admin actions requiring service role

---

## SECURITY MODEL

**Row-Level Security (RLS) in Supabase:**
- Users can only view/edit their own data
- Public can view active properties only
- Admin access via service role key

**Authentication:**
- JWT tokens in HTTP-only cookies
- Phone OTP (primary)
- Google OAuth (secondary)
- Session expiry: 7 days

**Rate Limiting:**
- Cloudflare: DDoS protection
- Netlify: Function invocation limits
- Supabase: Connection pooling

---

## IMAGE HANDLING

```
1. User selects image in browser
2. Direct upload to Cloudinary (unsigned preset)
3. Cloudinary returns public_id and URL
4. Store in database (property_images table)
5. Display via Cloudinary CDN with transformations
```

**Transformations:**
- Thumbnail: w_400,h_300,c_fill,q_auto,f_auto
- Medium: w_800,h_600,c_fill,q_auto,f_auto
- Large: w_1200,h_900,c_fill,q_auto,f_auto

---

## PERFORMANCE TARGETS

**Speed (Mobile 3G):**
- First Contentful Paint (FCP): < 1.0s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.0s
- Cumulative Layout Shift (CLS): < 0.1

**API Response Times:**
- Property search: < 200ms
- Single property: < 100ms
- Authentication: < 150ms

---

## CACHING STRATEGY

**Cloudflare:**
- Static assets: 1 year cache
- Property images: 7 days cache
- API responses: No cache

**Next.js:**
- Static pages: ISR (Incremental Static Regeneration)
- Dynamic pages: Server-side rendering
- Client-side: SWR for data fetching

---

## DEPLOYMENT FLOW

```
1. Push to GitHub
2. Netlify detects changes
3. Build Next.js application
4. Deploy to Netlify CDN
5. Cloudflare proxies requests
6. Zero downtime deployment
```

---

## PHASE 1 SCOPE

**Build:**
- User registration (phone/Google)
- Role system (tenant, landlord, admin)
- Property CRUD (unverified)
- Admin panel shell
- Public property pages
- Basic search

**Do NOT Build:**
- Payments
- AI features
- Rent tracking
- Verification automation
- Sponsored listings
- Messaging system

---

## SCALABILITY STRATEGY

**Phase 1 (0-10k users):**
- Single Supabase instance
- Netlify free tier
- Cloudflare free tier

**Phase 2 (10k-100k users):**
- Supabase Pro plan
- Netlify Pro plan
- Cloudinary Pro plan

**Phase 3 (100k+ users):**
- Supabase Enterprise
- Edge functions optimization
- Multi-region considerations

---

## CRITICAL PRINCIPLES

**One Source of Truth:** Single database, no duplication

**Everything Toggleable:** All features controllable via admin

**Progressive Trust:** No forced KYC, trust builds naturally

**Mobile-First:** Design for 375px screens first

**Silent Security:** Protection without friction
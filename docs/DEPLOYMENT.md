# UrbanEstate Deployment Guide

This guide details the steps to deploy **UrbanEstate Kenya** to production on **Netlify** and **Supabase**.

---

## 1. Prerequisites

- **GitHub Repository**: `UrbanEstate246/URBAN-ESTATE-PROJECT-V1`
- **Netlify Account**: Connected to the GitHub repository.
- **Supabase Project**: With PostgreSQL 15+ and Auth enabled.
- **Cloudinary Account**: For optimized property image delivery.
- **Africa's Talking Account** (Optional for Phase 2): For Kenyan SMS OTP dispatch.

---

## 2. Supabase Database Setup

1. Open your project on [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. Apply migrations in order from `supabase/migrations/`:
   - `20250101000001_create_users_table.sql`
   - `20250101000002_create_properties_table.sql`
   - `20250101000003_create_property_images_table.sql`
   - `20250101000004_create_units_table.sql`
   - `20250101000005_create_land_verification_table.sql`
   - `20250101000006_create_audit_logs_table.sql`
   - `20250101000007_enable_rls_policies.sql` (Creates `system_admins` and RLS security)
   - `20250101000008_create_property_reports_table.sql` (Creates `property_reports` & 3-flag quarantine trigger)
4. Load sample data by executing `supabase/seed.sql`.
5. Insert your administrator user ID into `system_admins`:
   ```sql
   INSERT INTO public.system_admins (user_id, role)
   VALUES ('<YOUR_SUPABASE_AUTH_USER_UUID>', 'SUPER_ADMIN');
   ```

---

## 3. Netlify Environment Variables

In **Netlify Site Settings > Build & deploy > Environment variables**, configure:

| Variable Name | Description | Example / Note |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key | `eyJhbGci...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | Required for serverless functions |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name | `urbanestate` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Upload Preset | `urbanestate_properties` (Unsigned or signed) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | Required for signed upload function |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | Required for signed upload function |
| `NEXT_PUBLIC_APP_URL` | Live Production URL | `https://urbanestate.co.ke` |
| `ADMIN_HOST` | Admin Subdomain Gate | `tech.urbanestate.co.ke` |

---

## 4. Git Push & Automatic Deployment

Push all committed changes to GitHub:

```bash
git remote set-url origin https://<YOUR_GITHUB_TOKEN>@github.com/UrbanEstate246/URBAN-ESTATE-PROJECT-V1.git
git push origin main
```

Netlify will automatically:
1. Build Next.js (`npm run build`).
2. Package serverless functions in `netlify/functions/`.
3. Deploy edge functions in `netlify/edge-functions/`.
4. Publish the verified site to `https://urbanestate.co.ke`.

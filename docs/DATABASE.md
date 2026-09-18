# UrbanEstate Database Schema & Security Specification

UrbanEstate operates on **Supabase (PostgreSQL 15+)** with mandatory **Row-Level Security (RLS)** on all tables.

---

## 1. Table Dictionary

### `public.users`
Stores user profile information, roles, and trust tiers.
- `id` (UUID, PK): Matches Supabase Auth `auth.users.id`.
- `phone` (VARCHAR(15), UNIQUE): Kenyan format (`+254...`).
- `role` (VARCHAR(20)): `'tenant' | 'landlord' | 'agent' | 'admin' | 'developer' | 'property_manager'`.
- `verification_level` (INT): Default 1.
- `trust_score` (INT): Invisible score (0-100).
- `status` (VARCHAR(20)): `'active' | 'suspended' | 'deleted'`.

### `public.properties`
The core listings catalog.
- `id` (UUID, PK): Auto-generated.
- `owner_id` (UUID, FK -> users): The landlord/agent who listed the property.
- `category` (VARCHAR(20)): `'rent' | 'sale' | 'land'`.
- `type` (VARCHAR(50)): e.g., `'Apartment'`, `'Townhouse'`, `'Plot'`.
- `status` (VARCHAR(20)): `'active' | 'pending' | 'hidden' | 'suspended' | 'deleted'`.
- `verification_status` (VARCHAR(20)): `'unverified' | 'pending' | 'verified' | 'rejected'`.
- `price` (DECIMAL(12,2)): In Kenyan Shillings (KES).
- `county`, `area`, `ward`: Kenyan geographic taxonomy.
- `amenities` (JSONB): Array of amenities tags.
- `views`, `inquiries` (INT): Engagement counters.

### `public.property_images`
Image assets stored on Cloudinary.
- `id` (UUID, PK).
- `property_id` (UUID, FK -> properties).
- `cloudinary_public_id` (VARCHAR(255)).
- `cloudinary_url` (TEXT): Full CDN URL.
- `thumbnail_url` (TEXT): Optimized thumbnail CDN URL.
- `display_order` (INT): Sorting order in carousel/gallery.

### `public.units`
Individual apartment building units (e.g. Unit 4B, Penthouse).
- `id` (UUID, PK).
- `property_id` (UUID, FK -> properties).
- `unit_number` (VARCHAR(50)).
- `rent` (DECIMAL(10,2)).
- `status` (VARCHAR(20)): `'vacant' | 'occupied' | 'maintenance'`.

### `public.land_verification`
Official title deed and parcel verification records.
- `id` (UUID, PK).
- `property_id` (UUID, FK -> properties).
- `parcel_number` (VARCHAR(100)): County land registry number.
- `verification_source` (VARCHAR(50)): `'manual' | 'third_party' | 'gok'`.
- `verification_status` (VARCHAR(20)): `'pending' | 'verified' | 'failed'`.

### `public.audit_logs`
Immutable security and administrative audit trail.
- `id` (UUID, PK).
- `user_id` (UUID, FK -> users).
- `action` (VARCHAR(100)): e.g. `'verify_property'`, `'auto_hide_reported_property'`.
- `resource_type`, `resource_id`: Subject entity.
- `metadata` (JSONB): Structured context diffs.

### `public.system_admins`
Privileged administrative roles gating access to administrative consoles.
- `user_id` (UUID, PK, FK -> users).
- `role` (VARCHAR(50)): `'SUPER_ADMIN' | 'OPS_ADMIN' | 'VERIFIER'`.

### `public.property_reports`
Community flag and fraud prevention submissions.
- `id` (UUID, PK).
- `property_id` (UUID, FK -> properties).
- `reporter_id` (UUID, FK -> users).
- `reason` (VARCHAR(50)): Categorized fraud/violation reason.
- `status` (VARCHAR(20)): `'pending' | 'reviewed' | 'dismissed' | 'actioned'`.

---

## 2. Automated Triggers

1. **`update_updated_at_column()`**:
   - Automatically maintains `updated_at = NOW()` on all records whenever modified.
2. **`handle_property_report_threshold()`**:
   - Fires upon every new community report.
   - If a listing reaches **3 or more pending reports**, it automatically sets `properties.status = 'hidden'` and creates an audit entry in `audit_logs` for immediate admin investigation.

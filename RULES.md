# DEVELOPMENT_RULES.md
# UrbanEstate - Non-Negotiable Development Rules

---

## GOLDEN RULES (NEVER VIOLATE)

### 1. ONE SOURCE OF TRUTH
Single database (Supabase). Single API layer (Netlify Functions). Single admin panel. No duplicate user tables. No parallel auth systems.

### 2. EVERYTHING MUST BE TOGGLEABLE
Feature flags in admin panel. Graceful degradation when disabled. No hardcoded business logic. Admin controls all features.

### 3. NEVER BLOCK USERS WITHOUT REASON
Explain why action failed. Provide alternative path. Allow skip where safe. No silent failures. No forced verification for browsing.

### 4. SECURITY IS SILENT, NOT SCARY
Protection runs invisibly. Only alert on actual threats. Progressive trust model. No "VERIFY NOW" popups. No KYC walls for basic features.

### 5. TRUST > SHORT-TERM CASH
Free browsing forever. Optional paid features only. Clear value exchange. No paywalls for contact info. No hiding verification status.

---

## TYPESCRIPT RULES

**Strict Mode Always:**
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

**Never use `any` type**

**Never use `@ts-ignore` without explanation**

**Always define interfaces for data structures**

---

## NAMING CONVENTIONS

**Components:** PascalCase (PropertyCard.tsx, UserDashboard.tsx)

**Utilities:** camelCase (formatPrice.ts, validatePhone.ts)

**Database Migrations:** YYYYMMDDHHMMSS_description.sql

**Netlify Functions:** kebab-case (send-sms.ts, verify-property.ts)

**Variables:** Meaningful names (verifiedProperties, userTrustScore)

**Never use:** x, temp, data, result

---

## SUPABASE RULES

**Always use Row-Level Security (RLS)**

**Always use parameterized queries**

**Create indexes on frequently queried fields**

**Use transactions for related writes**

**Never hard delete - always soft delete**

```sql
-- Soft delete
UPDATE properties 
SET status = 'deleted', deleted_at = NOW() 
WHERE id = $1;

-- Never hard delete
DELETE FROM properties WHERE id = $1;
```

---

## COMPONENT RULES

**Single Responsibility:** Each component does one thing well

**No God Components:** Components should be < 200 lines

**Props Validation:** Use TypeScript interfaces for all props

**No Inline Styles:** Use Tailwind utility classes only

**Mobile-First:** Design for 375px first, scale up

---

## API RULES

**Always use try-catch blocks**

**Always return consistent response format:**
```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: {
    code: "ERROR_CODE",
    message: "User-friendly message"
  }
}
```

**Always validate inputs with Zod**

**Always sanitize user input**

**Never expose internal errors to users**

---

## SECURITY RULES

**Authentication:**
- JWT in HTTP-only cookies
- Never store tokens in localStorage
- Always verify tokens on protected routes

**Rate Limiting:**
- OTP: 3 per hour per phone
- API: 100 per minute per IP
- Admin: 5 login attempts per 15 minutes

**Input Validation:**
- Validate all inputs server-side
- Sanitize HTML content
- Use Zod schemas

**SQL Injection Prevention:**
- Always use parameterized queries
- Never concatenate SQL strings

**XSS Prevention:**
- React automatically escapes
- Set Content Security Policy headers
- Never use dangerouslySetInnerHTML

---

## IMAGE HANDLING RULES

**Always use Cloudinary:**
- Never store images in Supabase Storage
- Direct browser uploads (unsigned preset)
- Apply transformations at delivery time

**Optimization:**
- Max upload: 5MB
- Generate thumbnails: 400x300
- Format: Auto (WebP/AVIF)
- Quality: Auto

**Next.js Image Component:**
```typescript
<Image
  src={cloudinaryUrl}
  alt="Property"
  width={800}
  height={600}
  loading="lazy"
/>
```

---

## ERROR HANDLING RULES

**User-Friendly Messages:**
```typescript
// Good
throw new Error("Property not found or has been removed");

// Bad
throw new Error("Database query failed on line 42");
```

**Always Log Errors:**
```typescript
try {
  await operation();
} catch (error) {
  console.error('Operation failed:', error);
  // Show user-friendly message
}
```

**Graceful Degradation:**
Non-critical failures should not crash entire page

---

## PERFORMANCE RULES

**Database Queries:**
- Always use indexes
- Limit results (max 100 per query)
- Select only needed fields
- Avoid N+1 queries

**Images:**
- Lazy load below fold
- Use appropriate sizes
- WebP/AVIF formats
- CDN delivery

**Code Splitting:**
- Dynamic imports for large components
- Route-based code splitting
- Lazy load admin panel

---

## ADMIN PANEL RULES

**Every Action Must Be Logged:**
```typescript
await logAdminAction({
  adminId: user.id,
  action: 'VERIFY_PROPERTY',
  entityType: 'property',
  entityId: propertyId,
  beforeState: oldData,
  afterState: newData
});
```

**Permission Checks:**
Verify admin role on every admin action

**Audit Trail:**
Never delete audit logs

**No Shared Admin Accounts:**
Each admin must have unique login

---

## CLOUDINARY RULES

**Upload Preset:** urbanestate_properties

**Folder Structure:** urbanestate/properties/{propertyId}/

**Transformations:**
Apply at URL level, not during upload

**Delete Policy:**
Never delete images immediately - mark for cleanup

---

## NETLIFY FUNCTIONS RULES

**Stateless:**
No session state between invocations

**Environment Variables:**
Always use process.env for secrets

**Timeout:**
Keep functions < 10 seconds execution

**Error Handling:**
Always return proper HTTP status codes

---

## SUPABASE AUTH RULES

**Phone Authentication:**
- Use Supabase Auth built-in OTP
- 6-digit codes
- 5-minute expiry
- 3 attempts per hour

**Google OAuth:**
- Use Supabase Auth Google provider
- Automatic user creation
- Profile sync

**Session Management:**
- 7-day expiry
- Automatic refresh
- Secure cookies only

---

## TAILWIND RULES

**Use Brand Colors:**
- civic-blue
- verification-green
- authority-amber
- institutional-white
- deep-charcoal
- subtle-border

**No Inline Styles:**
```typescript
// Good
<div className="bg-civic-blue text-white p-4">

// Bad
<div style={{ backgroundColor: '#0B1F33' }}>
```

**Responsive Design:**
```typescript
// Mobile first
<div className="p-4 md:p-6 lg:p-8">
```

---

## WHAT NEVER TO DO

**Never:**
- Use any type
- Store passwords in plain text
- Hardcode secrets in code
- Create God components
- Skip input validation
- Delete audit logs
- Share admin credentials
- Use localStorage for tokens
- Expose internal errors
- Skip error handling

---

## PHASE 1 RESTRICTIONS

**Do NOT Build:**
- Payment integration
- AI features
- Complex analytics
- Real-time chat
- Advanced verification
- Email system (beyond basic)
- Push notifications

**Keep It Simple:**
Foundation must be solid before adding complexity
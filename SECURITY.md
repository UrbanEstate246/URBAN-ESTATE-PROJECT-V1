# SECURITY.md
# UrbanEstate - Security Guidelines

---

## CORE SECURITY PRINCIPLES

**1. Silent Security:** Protection without friction

**2. Progressive Trust:** Trust increases with behavior, not paperwork

**3. Containment First:** Assume breaches, limit blast radius

**4. Audit Everything:** Visibility > Prevention alone

**5. Human Override Always:** Admins can intervene instantly

---

## AUTHENTICATION

### Phone OTP (Primary)

**Generation:**
```typescript
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}
```

**Storage:**
- Store in Supabase Auth (built-in)
- 5-minute expiry
- Delete after verification

**Rate Limiting:**
- 3 OTP requests per phone per hour
- 10 verification attempts per hour

**Never:**
- Store OTP in database
- Send OTP in API response
- Reuse OTP codes

### Google OAuth (Secondary)

**Use Supabase Auth Google provider**

**Configuration:**
- Automatic user creation
- Email verification required
- Profile sync enabled

### JWT Tokens

**Configuration:**
```typescript
{
  secret: process.env.JWT_SECRET,
  expiresIn: '7d',
  algorithm: 'HS256'
}
```

**Storage:**
- HTTP-only cookies ONLY
- Secure flag in production
- SameSite: Strict

**Never:**
- Store in localStorage
- Store in sessionStorage
- Send in URL parameters

---

## TRUST SCORE SYSTEM (INVISIBLE)

**Trust Score: 0-100 (never shown to users)**

**Factors:**
```typescript
phoneVerified: +10
googleLinked: +5
idVerified: +15
propertyVerified: +10 per property
accountAge: +5 per year
successfulTransactions: +3 each
flags: -20 each
confirmedReports: -30 each
```

**Usage:**
- Listing visibility ranking
- Verification queue priority
- Feature access control

**Never:**
- Show score to users
- Block based on score alone
- Use as sole decision factor

---

## FRAUD PREVENTION

### Layer 1: Content Intelligence

**Check for:**
- Duplicate images (reverse search)
- Price anomalies (too cheap)
- Scam language patterns
- Phone number reuse
- Location mismatches

**Action:**
If any check fails → Manual review queue

### Layer 2: Geo-Verification

**Requirements:**
- Property pinned on map
- Nearest landmark confirmed
- County/ward validated

**Checks:**
- Area exists in database
- Pin not reused on multiple listings
- GPS coordinates reasonable

### Layer 3: Community Signals

**Flag Thresholds:**
- 3 flags → Auto-hide listing
- 5 flags → Urgent admin review
- 10+ flags → Consider ban

**Anti-Spam:**
- Users can't flag same property twice
- Flag reasons required
- Anonymous flagging not allowed

---

## ROW-LEVEL SECURITY (RLS)

**Critical: Always enabled on all tables**

**Users Table:**
```sql
-- Users can view own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

**Properties Table:**
```sql
-- Public can view active properties
CREATE POLICY "Public can view active" ON properties
  FOR SELECT USING (status = 'active');

-- Owners can view own properties
CREATE POLICY "Owners can view own" ON properties
  FOR SELECT USING (auth.uid() = owner_id);

-- Authenticated users can create
CREATE POLICY "Auth users can create" ON properties
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Owners can update own properties
CREATE POLICY "Owners can update own" ON properties
  FOR UPDATE USING (auth.uid() = owner_id);
```

**Audit Logs:**
```sql
-- Only service role can access
CREATE POLICY "Service role only" ON audit_logs
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');
```

---

## ADMIN SECURITY

### Role-Based Access Control

**Roles:**
- SUPER_ADMIN: Full access
- OPS_ADMIN: Properties + users
- VERIFIER: Verification queue only
- SUPPORT: Tickets only
- ANALYST: Read-only

**Permission Checks:**
```typescript
function requirePermission(resource: string, action: string) {
  const userPermissions = ROLE_PERMISSIONS[user.role];
  const hasPermission = userPermissions.some(p => 
    (p.resource === resource || p.resource === '*') &&
    p.actions.includes(action)
  );
  
  if (!hasPermission) {
    throw new Error('Insufficient permissions');
  }
}
```

### Audit Trail

**Log Every Admin Action:**
```typescript
await logAdminAction({
  adminId: admin.id,
  action: 'VERIFY_PROPERTY',
  entityType: 'property',
  entityId: propertyId,
  beforeState: JSON.stringify(oldData),
  afterState: JSON.stringify(newData),
  ipAddress: req.ip,
  userAgent: req.headers['user-agent']
});
```

**Rules:**
- Never delete audit logs
- Logs are append-only
- Include before/after state
- Track IP and user agent

### Admin Session Security

**Settings:**
- Max age: 4 hours (not 7 days)
- IP binding enabled
- Device tracking enabled
- 2FA optional (Phase 2)

**Monitoring:**
```typescript
// Alert on suspicious activity
- New device login
- Login at unusual time
- Rapid actions (>10 per minute)
- Multiple failed attempts
```

---

## API SECURITY

### Rate Limiting

**Endpoints:**
```typescript
const RATE_LIMITS = {
  sendOTP: { window: '1h', max: 3 },
  verifyOTP: { window: '1h', max: 10 },
  createProperty: { window: '1h', max: 10 },
  searchProperties: { window: '1m', max: 100 },
  adminLogin: { window: '15m', max: 5 }
};
```

**Implementation:**
- Cloudflare: DDoS protection
- Netlify: Function limits
- Custom: Redis-based counters

### Input Validation

**Always use Zod schemas:**
```typescript
const propertySchema = z.object({
  title: z.string().min(10).max(200),
  price: z.number().positive().max(1000000000),
  county: z.enum(['Nairobi', 'Kiambu', ...]),
  description: z.string().max(5000)
});
```

**Sanitize HTML:**
```typescript
import DOMPurify from 'isomorphic-dompurify';
const cleanDescription = DOMPurify.sanitize(description, {
  ALLOWED_TAGS: [],
  ALLOWED_ATTR: []
});
```

### SQL Injection Prevention

**Always use parameterized queries:**
```typescript
// Good
const property = await supabase
  .from('properties')
  .select()
  .eq('id', propertyId)
  .single();

// Never
const query = `SELECT * FROM properties WHERE id = '${propertyId}'`;
```

### XSS Prevention

**React automatically escapes:**
```typescript
// Safe
<h2>{title}</h2>

// Never use
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

**Set security headers:**
```typescript
{
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'"
}
```

---

## CLOUDINARY SECURITY

**Upload Preset:**
- Unsigned uploads enabled
- Folder: urbanestate/properties/
- Max file size: 5MB
- Allowed formats: jpg, png, webp

**Never:**
- Store API secret in frontend
- Allow arbitrary file uploads
- Skip file type validation

---

## NETLIFY FUNCTIONS SECURITY

**Environment Variables:**
```typescript
// Always use
const apiKey = process.env.API_KEY;

// Never hardcode
const apiKey = 'sk_live_abc123';
```

**Verify Request Origin:**
```typescript
const allowedOrigins = [
  'https://urbanestate.co.ke',
  'https://www.urbanestate.co.ke'
];

if (!allowedOrigins.includes(origin)) {
  return { statusCode: 403 };
}
```

**Use Service Role Key:**
```typescript
// In functions only, never frontend
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
```

---

## DATABASE SECURITY

**Backup Strategy:**
- Supabase: Daily automatic backups
- Retention: 7 days (free), 30 days (pro)
- Point-in-time recovery: 7 days (pro)

**Connection Security:**
- SSL/TLS enforced
- Connection pooling enabled
- No direct database access from frontend

**Secrets Management:**
- Environment variables only
- Rotate keys quarterly
- Never commit to git

---

## INCIDENT RESPONSE

**If Security Incident Detected:**

1. Freeze affected feature
2. Alert admins (SMS + Email)
3. Log everything
4. Show calm message to users
5. Investigate via audit logs
6. Apply fix
7. Restore service
8. Create post-mortem

**Never:**
- Panic or show internal details
- Blame users publicly
- Delete evidence

---

## SECURITY CHECKLIST

Before deploying:
- [ ] Supabase RLS enabled on all tables
- [ ] Environment variables secured
- [ ] Rate limiting configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS prevention headers set
- [ ] Admin actions logged
- [ ] Secrets not in code
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Error messages don't expose internals
- [ ] Audit logs immutable

---

## WHAT NEVER TO DO

**Never:**
- Disable RLS
- Store passwords in plain text
- Log sensitive data
- Share admin credentials
- Skip input validation
- Trust user input
- Delete audit logs
- Use production keys in development
- Expose internal errors
- Allow SQL injection vectors
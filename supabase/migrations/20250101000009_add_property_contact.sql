-- Let each listing carry the phone number buyers should call directly
-- (the owner/agent), instead of routing everyone through UrbanEstate support.
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_name VARCHAR(100);

-- Backfill older listings from the owner's profile phone so they show a direct number too.
UPDATE public.properties p
SET contact_phone = u.phone
FROM public.users u
WHERE p.owner_id = u.id AND p.contact_phone IS NULL AND u.phone IS NOT NULL;

-- Make PostgREST pick up the new columns immediately.
NOTIFY pgrst, 'reload schema';

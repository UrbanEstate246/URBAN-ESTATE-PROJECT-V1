import { z } from 'zod' 
import { KENYAN_COUNTIES } from './constants' 

// Phone number validation (Kenyan format) 
export const phoneSchema = z.string().regex( 
  /^\\+254[17]\\d{8}$/, 
  'Phone number must be in format +254712345678' 
) 

// Property validation schema 
export const propertySchema = z.object({ 
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title too long'), 
  description: z.string().max(5000, 'Description too long').optional(), 
  category: z.enum(['rent', 'sale', 'land']), 
  type: z.string().min(1, 'Property type is required'), 
  price: z.number().positive('Price must be positive').max(1000000000, 'Price too high'), 
  county: z.enum(KENYAN_COUNTIES as any), 
  area: z.string().min(1, 'Area is required'), 
  ward: z.string().optional(), 
  gps_lat: z.number().min(-90).max(90).optional(), 
  gps_lng: z.number().min(-180).max(180).optional(), 
  bedrooms: z.number().int().min(0).max(20).optional(), 
  bathrooms: z.number().int().min(0).max(20).optional(), 
  amenities: z.array(z.string()).default([]), 
}) 

// User profile validation 
export const userProfileSchema = z.object({ 
  phone: phoneSchema.optional(), 
  role: z.enum(['tenant', 'landlord', 'agent', 'admin', 'developer', 'property_manager']).optional(), 
}) 

// OTP validation 
export const otpSchema = z.string().length(6, 'OTP must be 6 digits').regex(/^\\d+$/, 'OTP must be numeric') 


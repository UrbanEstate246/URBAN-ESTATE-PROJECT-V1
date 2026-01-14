// Format price in Kenyan Shillings 
export function formatPrice(price: number): string { 
  return new Intl.NumberFormat('en-KE', { 
    style: 'currency', 
    currency: 'KES', 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0, 
  }).format(price) 
} 

// Format date 
export function formatDate(date: string | Date): string { 
  return new Intl.DateTimeFormat('en-KE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
  }).format(new Date(date)) 
} 

// Format relative time (e.g., "2 days ago") 
export function formatRelativeTime(date: string | Date): string { 
  const now = new Date() 
  const past = new Date(date) 
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000) 

  if (diffInSeconds < 60) return 'just now' 
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago` 
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago` 
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago` 
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago` 
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago` 
  return `${Math.floor(diffInSeconds / 31536000)} years ago` 
} 

// Format phone number 
export function formatPhoneNumber(phone: string): string { 
  // Convert +254712345678 to 0712 345 678 
  if (phone.startsWith('+254')) { 
    const number = '0' + phone.substring(4) 
    return number.replace(/(\\d{4})(\\d{3})(\\d{3})/, '$1 $2 $3') 
  } 
  return phone 
} 


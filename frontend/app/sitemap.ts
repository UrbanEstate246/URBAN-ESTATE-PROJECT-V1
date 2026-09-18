import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://urbanestate.co.ke'
  const currentDate = new Date().toISOString()

  const staticRoutes = [
    '',
    '/properties',
    '/about',
    '/how-it-works',
    '/contact',
    '/list-property',
    '/login',
    '/register',
  ]

  return staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' || route === '/properties' ? 'daily' : 'monthly',
    priority: route === '' ? 1.0 : route === '/properties' ? 0.9 : 0.7,
  }))
}

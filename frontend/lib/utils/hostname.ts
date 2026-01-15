export function getHostname(): string {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.location.hostname
}

export function isAdminDomain(): boolean {
  const hostname = getHostname()
  return hostname === 'tech.urbanestate.co.ke'
}

/** Navigation only, not discovery or a network proxy. Require the exact kind
 * of origin the standalone host prints. URL() alone canonicalizes short/hex
 * IPs, dot segments and credentials, making misleading input look harmless;
 * validate the literal spelling first. Never forward room codes or seat keys
 * in a URL. This helper is website-only and must not enter the SDK bundle. */
export function privateHostDestination(input: string): string {
  const value=input.trim()
  const match=/^http:\/\/(localhost|(?:\d{1,3}\.){3}\d{1,3})(?::([1-9]\d{0,4}))?\/?$/.exec(value)
  const invalid=()=>new Error('Paste the host’s printed http:// private IPv4 address and port, without a path, code or password.')
  if(!match)throw invalid()
  const [,hostname,port]=match
  if(port && Number(port)>65535)throw invalid()
  if(hostname!=='localhost') {
    const parts=hostname.split('.')
    if(parts.some(p=>String(Number(p))!==p || Number(p)>255))throw invalid()
    const [a,b]=parts.map(Number)
    if(!(a===127 || a===10 || a===192 && b===168 || a===172 && b>=16 && b<=31))throw invalid()
  }
  return new URL(value).origin+'/'
}

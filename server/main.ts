import { startLanHost } from './http'

const args = process.argv.slice(2)
if (args.some(a => a !== '--lan')) throw new Error('Usage: npm run lan -- [--lan]')
const host = await startLanHost({ lan: args.includes('--lan') })
console.log('Poker LAN 3D candidate — memory-only practice session; browser acceptance and durable hosting still pending.')
console.log('HTTP is unencrypted. Use trusted local networks only; never port-forward this host.')
console.log(host.addresses.join('\n'))
const shutdown = () => { void host.close().then(() => process.exit(0)) }
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown)

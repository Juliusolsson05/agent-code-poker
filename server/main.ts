import { startLanHost } from './http'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
if (args.some(a => a !== '--lan' && a !== '--memory-only')) throw new Error('Usage: npm run lan -- [--lan] [--memory-only]')
const memoryOnly = args.includes('--memory-only')
// The path is repository-local, private and ignored, independent of the shell
// cwd. No extension/solo save migration. Memory-only remains an explicit mode
// for disposable demos; it must not silently overwrite a saved host session.
const directory = fileURLToPath(new URL('../.poker-lan/', import.meta.url))
const host = await startLanHost({ lan: args.includes('--lan'), ...(memoryOnly ? {} : { checkpointDirectory: directory }) })
console.log('Poker LAN 3D candidate — practice chips; real multiplayer browser/LAN acceptance is still pending.')
console.log(memoryOnly ? 'Disposable memory-only session: stopping this host ends it.' : 'Private checkpoint: .poker-lan/ (local disk only). Restart preserves the table; resume explicitly. Never share this directory.')
console.log('HTTP is unencrypted. Use trusted local networks only; never port-forward this host.')
console.log(host.addresses.join('\n'))
const shutdown = () => { void host.close().then(() => process.exit(0)) }
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown)

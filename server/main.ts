import { startLanHost } from './http'
import { fileURLToPath } from 'node:url'

const args = process.argv.slice(2)
// --port=N exists so acceptance runs and a second developer host can pick a
// free port without editing code (5191/5192 are the usual preview/host ports).
const portArg = args.find(a => /^--port=\d{1,5}$/.test(a))
if (args.some(a => a !== '--lan' && a !== '--memory-only' && a !== portArg)) throw new Error('Usage: npm run lan -- [--lan] [--memory-only] [--port=5192]')
const port = portArg ? Number(portArg.slice('--port='.length)) : undefined
if (port !== undefined && (port < 1024 || port > 65535)) throw new Error('--port must be 1024-65535.')
const memoryOnly = args.includes('--memory-only')
// The path is repository-local, private and ignored, independent of the shell
// cwd. No extension/solo save migration. Memory-only remains an explicit mode
// for disposable demos; it must not silently overwrite a saved host session.
const directory = fileURLToPath(new URL('../.poker-lan/', import.meta.url))
const host = await startLanHost({ port, lan: args.includes('--lan'), ...(memoryOnly ? {} : { checkpointDirectory: directory }) })
console.log('Poker LAN 3D candidate — practice chips; real multiplayer browser/LAN acceptance is still pending.')
console.log(memoryOnly ? 'Disposable memory-only session: stopping this host ends it.' : 'Private checkpoint: .poker-lan/ (local disk only). Restart preserves the table; resume explicitly. Never share this directory.')
console.log('HTTP is unencrypted. Use trusted local networks only; never port-forward this host.')
console.log(host.addresses.join('\n'))
const shutdown = () => { void host.close().then(() => process.exit(0)) }
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown)

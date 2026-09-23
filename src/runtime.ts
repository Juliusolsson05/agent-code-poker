import { defineRuntime } from 'agent-code-extension-api'

// A table belongs to its visible document. No opponent should spend chips while
// the room is closed. The view persists decisions and restores a paused table.
//
// Deliberately empty. Until v0.3.0 this runtime registered a
// `agent-code-poker.host-lan` palette command that started the LAN service
// headlessly and published a heartbeat for the LAN view to adopt. It duplicated
// the LAN view's Host button and, run from the palette, showed no window at
// all, so users read it as broken. Hosting now lives only in the LAN view
// (src/lanView.tsx). The empty runtime is kept rather than dropping `entry`
// so the manifest keeps the same shape every shipped release has had.
export default defineRuntime({ activate() {} })

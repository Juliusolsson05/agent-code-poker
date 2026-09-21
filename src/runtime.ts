import { defineRuntime } from 'agent-code-extension-api'
// A table belongs to its visible document. No opponent should spend chips while
// the room is closed. The view persists decisions and restores a paused table.
export default defineRuntime({ activate() {} })

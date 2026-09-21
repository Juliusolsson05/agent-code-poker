import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { extensionViteConfig } from 'agent-code-extension-api'

// The complete preset includes the production JSX transform. Selecting only its
// build/define keys revives the dev-transform/production-React mismatch in a host
// frame, where no downstream bundler exists to repair the emitted module.
export default defineConfig({
  ...extensionViteConfig({ entries: { runtime: 'src/runtime.ts', view: 'src/view.tsx', lanView: 'src/lanView.tsx' } }) as UserConfig,
  plugins: [react()],
})

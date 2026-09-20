import { createRoot } from 'react-dom/client'
import { defineView } from 'agent-code-extension-api'
import { App } from './App'
import styles from './styles.css?inline'

export default defineView({
  mount(element, context) {
    const style = document.createElement('style'); style.textContent = styles; document.head.append(style)
    const root = createRoot(element)
    root.render(<App api={context.api} />)
    return () => { root.unmount(); style.remove() }
  },
})

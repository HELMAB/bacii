import { createApp } from 'vue'

// Runs a composable inside a mounted component so its lifecycle hooks fire.
export function withSetup(composable) {
  let result
  const app = createApp({
    setup() {
      result = composable()
      return () => null
    }
  })
  app.mount(document.createElement('div'))
  return { result, unmount: () => app.unmount() }
}

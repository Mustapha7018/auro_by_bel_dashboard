/**
 * Pinia plugin: hydrate each store from localStorage on load and persist on
 * every change. Swap this for API calls when the backend lands — the stores'
 * shapes stay the same.
 */
// Bump this when a store's shape changes to invalidate stale local data.
const VERSION = 'v2'

export function persistPlugin({ store }) {
  const key = `aura-dash.${VERSION}.${store.$id}`
  try {
    const saved = localStorage.getItem(key)
    if (saved) store.$patch(JSON.parse(saved))
  } catch {
    /* ignore corrupt state */
  }
  store.$subscribe((_, state) => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  })
}

const nf = new Intl.NumberFormat('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const money = (v) => `₵${nf.format(v || 0)}`

export const shortDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

export const dayMonth = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })

export const uid = (prefix = 'id') => `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/**
 * Read an uploaded image, downscale it to `max` px on the long edge, and
 * return a compressed JPEG data URL. Keeps localStorage small now; swap for a
 * real upload (returning a URL) once the backend exists.
 */
function drawResized(file, max, quality, output) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Not an image'))
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        output(canvas, resolve, reject)
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function fileToDataUrl(file, max = 700, quality = 0.82) {
  return drawResized(file, max, quality, (canvas, resolve) =>
    resolve(canvas.toDataURL('image/jpeg', quality)),
  )
}

/** Resize an uploaded image to a JPEG Blob (for object-storage upload). */
export function fileToBlob(file, max = 900, quality = 0.85) {
  return drawResized(file, max, quality, (canvas, resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not process image'))),
      'image/jpeg',
      quality,
    ),
  )
}

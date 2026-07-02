<script setup>
import { ref, onMounted } from 'vue'
import { useGalleryStore } from '@/store/gallery'
import { useConfirmStore } from '@/store/confirm'
import { fileToBlob } from '@/utils'

const gallery = useGalleryStore()
const confirm = useConfirmStore()

const fileInput = ref(null)
const uploading = ref(0)
const dragging = ref(false)

onMounted(() => gallery.load())

const pick = () => fileInput.value?.click()

// Shrink large photos to a sensible showcase size before upload; videos are
// sent as-is (browsers can't re-encode them without heavy tooling).
const prepare = async (file) => {
  if (!file.type.startsWith('image/')) return file
  const blob = await fileToBlob(file, 1600, 0.85)
  const name = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], name, { type: 'image/jpeg' })
}

const upload = async (files) => {
  const list = Array.from(files || []).filter(
    (f) => f.type.startsWith('image/') || f.type.startsWith('video/'),
  )
  for (const file of list) {
    uploading.value += 1
    try {
      await gallery.add(await prepare(file))
    } catch {
      /* toast already shown by the store */
    } finally {
      uploading.value -= 1
    }
  }
}

const onInput = async (e) => {
  await upload(e.target.files)
  e.target.value = ''
}

const onDrop = async (e) => {
  dragging.value = false
  await upload(e.dataTransfer.files)
}

const remove = async (item) => {
  const ok = await confirm.ask({
    title: 'Remove from gallery',
    message: 'Remove this from your creations? This can’t be undone.',
    confirmLabel: 'Remove',
    danger: true,
  })
  if (ok) {
    try {
      await gallery.remove(item.id)
    } catch {
      /* toast already shown */
    }
  }
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1>Gallery</h1>
        <p>Your creations — the photos and clips clients see on the site. No titles, just the work.</p>
      </div>
      <button class="btn btn--primary" :disabled="uploading > 0" @click="pick">
        {{ uploading > 0 ? `Uploading ${uploading}…` : '+ Add media' }}
      </button>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*,video/*"
      multiple
      hidden
      @change="onInput"
    />

    <div
      class="drop"
      :class="{ 'is-drag': dragging }"
      @click="pick"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <p class="drop__title">Drop photos or videos here</p>
      <p class="drop__hint">or click to choose · JPG, PNG, WEBP, MP4, MOV — up to 60&nbsp;MB each</p>
    </div>

    <div v-if="gallery.items.length" class="gal">
      <figure v-for="item in gallery.items" :key="item.id" class="gal__item">
        <video v-if="item.kind === 'video'" :src="item.url" muted loop playsinline preload="metadata" />
        <img v-else :src="item.url" alt="" loading="lazy" />
        <span v-if="item.kind === 'video'" class="gal__tag">Video</span>
        <button class="gal__del" title="Remove" aria-label="Remove" @click="remove(item)">✕</button>
      </figure>
    </div>

    <p v-else-if="gallery.loaded && !uploading" class="empty" style="margin-top: 1.5rem">
      Nothing here yet. Add your first creation above.
    </p>
  </div>
</template>

<style scoped>
.drop {
  margin: 1.1rem 0 1.4rem;
  border: 1.5px dashed var(--line);
  border-radius: var(--radius);
  padding: 1.8rem 1rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s var(--ease), background 0.15s var(--ease);
}
.drop:hover,
.drop.is-drag {
  border-color: var(--accent);
  background: var(--paper-warm);
}
.drop__title {
  font-weight: 600;
  font-size: 0.92rem;
}
.drop__hint {
  font-size: 0.76rem;
  color: var(--ink-faint);
  margin-top: 0.25rem;
}

.gal {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.6rem;
}
.gal__item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--paper-warm);
}
.gal__item img,
.gal__item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.gal__tag {
  position: absolute;
  left: 0.5rem;
  bottom: 0.5rem;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 0.2rem 0.45rem;
  border-radius: 999px;
}
.gal__del {
  position: absolute;
  top: 0.45rem;
  right: 0.45rem;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 0.8rem;
  display: grid;
  place-items: center;
  opacity: 0;
  transition: opacity 0.15s var(--ease), background 0.15s var(--ease);
}
.gal__item:hover .gal__del {
  opacity: 1;
}
.gal__del:hover {
  background: var(--red);
}
</style>

<script setup>
import { LETTER_PATH, TITLE_PATH, TITLE_VIEW_BOX } from '../constants/logo'

const BEAD_COUNT = 32

const beads = Array.from({ length: BEAD_COUNT }, (_, index) => {
  const angle = (index / BEAD_COUNT) * Math.PI * 2
  return {
    x: (50 + 41 * Math.cos(angle)).toFixed(2),
    y: (50 + 41 * Math.sin(angle)).toFixed(2)
  }
})
</script>

<template>
  <!-- Rendered by the server so it paints before any JavaScript runs -->
  <div class="app-splash" aria-hidden="true">
    <div class="app-splash__frame">
      <div class="app-splash__panel">
        <svg class="app-splash__record" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="#14110d" />
          <circle cx="50" cy="50" r="44.6" fill="none" stroke="#3a342b" stroke-width="0.5" />
          <g class="app-splash__beads">
            <circle
              v-for="(bead, index) in beads"
              :key="index"
              :cx="bead.x"
              :cy="bead.y"
              r="1.3"
              fill="#e8c34a"
            />
          </g>
          <circle cx="50" cy="50" r="37" fill="#c7231f" />
          <path :d="LETTER_PATH" fill="#14110d" transform="translate(27.8 27.8) scale(0.48)" />
          <path :d="LETTER_PATH" fill="#ffffff" transform="translate(26 26) scale(0.48)" />
        </svg>

        <svg class="app-splash__title" :viewBox="TITLE_VIEW_BOX">
          <path
            :d="TITLE_PATH"
            transform="translate(2.4 2.4)"
            fill="#14110d"
            stroke="#14110d"
            stroke-width="2.4"
            stroke-linejoin="round"
          />
          <path
            :d="TITLE_PATH"
            fill="#ffffff"
            stroke="#ffffff"
            stroke-width="4.4"
            stroke-linejoin="round"
          />
          <path :d="TITLE_PATH" fill="#c7231f" />
        </svg>

        <p class="app-splash__tagline">ឯកសារប្រឡងឥតគិតថ្លៃ</p>
      </div>
    </div>
  </div>
</template>

<style>
.app-splash {
  --splash-paper: #e8c34a;
  --splash-ornament: #c7231f;
  --splash-frame: #0f7a66;
  --splash-panel: #1f76bd;
  --splash-dots: #0f4f8c;

  position: fixed;
  inset: 0;
  z-index: 60;
  padding: 26px;
  background-color: var(--splash-paper);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='44'%3E%3Cg fill='none' stroke='%23c7231f' stroke-width='5.2' stroke-linecap='round'%3E%3Cpath d='M2 34C4 14 20 6 30 12c9 6 4 19-5 17-7-2-5-11 2-10M30 12c8-8 18-6 24 0M30 12c4 8 12 18 24 22M2 34c6 6 14 6 20 3M54 12c-4 6-4 12 0 16'/%3E%3C/g%3E%3Ccircle cx='8' cy='10' r='4.4' fill='%23c7231f'/%3E%3Ccircle cx='44' cy='34' r='3.2' fill='%23c7231f'/%3E%3C/svg%3E");
  /* If JavaScript never runs, the splash still gets out of the way. */
  animation: app-splash-failsafe 0.3s ease-in 5s forwards;
}

.dark .app-splash {
  --splash-frame: #123c37;
  --splash-panel: #121833;
  --splash-dots: #1d2c6b;

  background-color: #2b2410;
}

/* Set before first paint by the inline script in nuxt.config.ts. */
.splash-seen .app-splash {
  display: none;
}

.app-splash__frame {
  height: 100%;
  padding: 12px;
  background: var(--splash-frame);
  outline: 3px solid var(--splash-ornament);
}

.app-splash__panel {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 3.5vmin, 32px);
  overflow: hidden;
  background-color: var(--splash-panel);
  background-image: radial-gradient(var(--splash-dots) 32%, transparent 34%);
  background-size: 7px 7px;
}

.app-splash__record {
  width: min(62vw, 46vh, 340px);
  filter: drop-shadow(6px 6px 0 rgb(0 0 0 / 0.45));
}

.app-splash__beads {
  transform-origin: 50px 50px;
  animation: app-splash-spin 1.8s linear infinite;
}

.app-splash__title {
  width: min(72vw, 62vh, 460px);
}

.app-splash__tagline {
  margin: 0;
  color: #fff4cf;
  font-size: clamp(16px, 3.4vmin, 24px);
  font-weight: 700;
}

.app-splash-leave-active {
  pointer-events: none;
  transition: opacity 0.25s ease-out;
}

.app-splash-leave-to {
  opacity: 0;
}

@keyframes app-splash-spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes app-splash-failsafe {
  to {
    visibility: hidden;
    opacity: 0;
  }
}

@media (orientation: landscape) and (max-height: 500px) {
  .app-splash__panel {
    flex-direction: row;
    flex-wrap: wrap;
    align-content: center;
  }

  .app-splash__record {
    width: 44vh;
  }

  .app-splash__title {
    width: 44vw;
  }

  .app-splash__tagline {
    flex-basis: 100%;
    text-align: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-splash__beads {
    animation: none;
  }

  .app-splash-leave-active {
    transition: none;
  }
}
</style>

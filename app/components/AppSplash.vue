<script setup>
import { LETTER_PATH, TITLE_PATH, TITLE_VIEW_BOX } from '../constants/logo'
</script>

<template>
  <!-- Rendered by the server so it paints before any JavaScript runs -->
  <div class="app-splash" aria-hidden="true">
    <div class="app-splash__panel">
      <svg class="app-splash__stamp" viewBox="-14 -14 128 128">
        <circle cx="50" cy="50" r="60" fill="#9e2f18" stroke="#2a1d14" stroke-width="3" />
        <circle
          class="app-splash__ring"
          cx="50"
          cy="50"
          r="54"
          fill="none"
          stroke-width="2"
          stroke-dasharray="4 4"
        />
        <path :d="LETTER_PATH" fill="#2a1d14" transform="translate(20.4 20.4) scale(.64)" />
        <path :d="LETTER_PATH" fill="#f1e4c6" transform="translate(18 18) scale(.64)" />
      </svg>

      <svg class="app-splash__title" :viewBox="TITLE_VIEW_BOX">
        <path
          class="app-splash__title-offset"
          :d="TITLE_PATH"
          transform="translate(2.4 2.4)"
          stroke-width="2.4"
          stroke-linejoin="round"
        />
        <path class="app-splash__title-ink" :d="TITLE_PATH" />
      </svg>

      <p class="app-splash__ribbon">ឯកសារប្រឡងឥតគិតថ្លៃ</p>

      <div class="app-splash__progress">
        <div class="app-splash__progress-fill"></div>
      </div>
    </div>

    <div class="app-splash__footer">DOBPI.NETLIFY.APP</div>
  </div>
</template>

<style>
.app-splash {
  --splash-ink: #2a1d14;
  --splash-paper: #f1e4c6;
  --splash-ray-a: #e0a526;
  --splash-ray-b: #e9b94a;
  --splash-title: #2a1d14;
  --splash-title-offset: #f1e4c6;
  --splash-ring: #f1e4c6;

  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  background: repeating-conic-gradient(
    from 0deg at 50% 42%,
    var(--splash-ray-a) 0 9deg,
    var(--splash-ray-b) 9deg 18deg
  );
  /* If JavaScript never runs, the splash still gets out of the way. */
  animation: app-splash-failsafe 0.3s ease-in 5s forwards;
}

.dark .app-splash {
  --splash-ray-a: #3a2a12;
  --splash-ray-b: #2e2110;
  --splash-title: #f1e4c6;
  --splash-title-offset: #000;
  --splash-ring: #2a1d14;
}

/* Set before first paint by the inline script in nuxt.config.ts. */
.splash-seen .app-splash {
  display: none;
}

.app-splash__panel {
  display: flex;
  flex: 1;
  min-height: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(12px, 3.2vmin, 28px);
  padding: 16px;
  overflow: hidden;
}

.app-splash__stamp {
  width: min(42vw, 30vh, 200px);
  filter: drop-shadow(6px 6px 0 rgb(42 29 20 / 0.9));
}

.app-splash__ring {
  stroke: var(--splash-ring);
}

.app-splash__title {
  width: min(70vw, 52vh, 400px);
}

.app-splash__title-offset {
  fill: var(--splash-title-offset);
  stroke: var(--splash-title-offset);
}

.app-splash__title-ink {
  fill: var(--splash-title);
}

.app-splash__ribbon {
  margin: 0;
  padding: 4px 18px;
  background: var(--splash-ink);
  color: var(--splash-paper);
  font-family: 'Google Sans', system-ui, sans-serif;
  font-weight: 700;
  font-size: clamp(16px, 3vmin, 22px);
  line-height: 1.7;
  transform: rotate(-2deg);
  box-shadow: 3px 3px 0 #9e2f18;
}

.app-splash__progress {
  position: relative;
  width: min(60vw, 240px);
  height: 14px;
  margin-top: 4px;
  overflow: hidden;
  border: 2px solid var(--splash-ink);
  background: var(--splash-paper);
}

.app-splash__progress-fill {
  position: absolute;
  inset: 0 auto 0 0;
  width: 40%;
  background: repeating-linear-gradient(
    -45deg,
    var(--splash-ink) 0 6px,
    rgb(42 29 20 / 0.75) 6px 12px
  );
  animation: app-splash-progress 1.4s ease-in-out infinite;
}

.app-splash__footer {
  flex-shrink: 0;
  padding: 10px 16px;
  border-top: 2px solid var(--splash-ink);
  background: var(--splash-paper);
  color: var(--splash-ink);
  font-family: 'Google Sans', system-ui, sans-serif;
  font-size: 13px;
  letter-spacing: 3px;
  text-align: center;
}

.app-splash-leave-active {
  pointer-events: none;
  transition: opacity 0.25s ease-out;
}

.app-splash-leave-to {
  opacity: 0;
}

@keyframes app-splash-progress {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(250%);
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

  .app-splash__stamp {
    width: 34vh;
  }

  .app-splash__title {
    width: 40vw;
  }

  .app-splash__ribbon,
  .app-splash__progress {
    flex-basis: auto;
  }

  .app-splash__footer {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .app-splash__progress-fill {
    width: 100%;
    animation: none;
  }

  .app-splash-leave-active {
    transition: none;
  }
}
</style>

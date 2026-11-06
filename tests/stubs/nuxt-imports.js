import { vi } from 'vitest'

// Stands in for Nuxt's `#imports`. Tests read what composables passed to these mocks.
export const useHead = vi.fn()
export const useSeoMeta = vi.fn()
export const setResponseStatus = vi.fn()
export const useRequestEvent = vi.fn(() => ({}))
export const useRequestURL = vi.fn(() => new URL(window.location.href))

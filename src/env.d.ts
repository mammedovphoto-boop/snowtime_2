/// <reference types="astro/client" />
interface Window { track: (event: string, params?: Record<string, unknown>) => void; dataLayer: unknown[]; }

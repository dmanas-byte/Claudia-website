/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORM_ENDPOINT?: string
  readonly VITE_SHOW_TESTIMONIALS?: string
}

declare module '*.glsl' {
  const src: string
  export default src
}
declare module '*.vert' {
  const src: string
  export default src
}
declare module '*.frag' {
  const src: string
  export default src
}

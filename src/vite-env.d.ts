/// <reference types="vite-plus/client" />

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: `mdui-${string}`]: Record<string, unknown>;
  }
}

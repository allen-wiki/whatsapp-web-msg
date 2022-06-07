/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.json' {
	const value: any;
	export default value;
  }

declare var Store:any;
declare var WAPI:any;
declare var webpackJsonp:any;
declare var webpackChunkwhatsapp_web_client:any;


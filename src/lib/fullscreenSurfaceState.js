export const FULLSCREEN_SURFACE_ROOT_CLASS = 'fixed inset-0 z-[1200] flex flex-col bg-slate-950 text-white';

export const resolveFullscreenEscapeAction = ({ hasNativeFullscreen = false } = {}) =>
  hasNativeFullscreen ? 'exit-native' : 'deactivate';

export const shouldExitNativeFullscreenOnDeactivate = ({ active, nativeFullscreenElement, rootElement }) =>
  !active && Boolean(nativeFullscreenElement) && nativeFullscreenElement === rootElement;

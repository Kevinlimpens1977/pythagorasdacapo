import { useMemo, useRef } from 'react';
import { getBoardScale } from '../../lib/presenterGeometry';
import PresenterBackground from './PresenterBackground';

const DEFAULT_VIEWPORT_WIDTH = 1920;
const DEFAULT_PAGE_WIDTH = 1920;
const DEFAULT_PAGE_HEIGHT = 1400;

export default function PresenterBoard({ page, viewportWidth = DEFAULT_VIEWPORT_WIDTH }) {
  const boardRef = useRef(null);

  const board = useMemo(() => {
    const width = Number.isFinite(page?.width) && page.width > 0 ? page.width : DEFAULT_PAGE_WIDTH;
    const height = Number.isFinite(page?.height) && page.height > 0 ? page.height : DEFAULT_PAGE_HEIGHT;
    const scale = getBoardScale({ viewportWidth, boardWidth: width });

    return {
      width,
      height,
      scale,
      scaledWidth: Math.round(width * scale),
      scaledHeight: Math.round(height * scale)
    };
  }, [page?.height, page?.width, viewportWidth]);

  return (
    <div className="flex min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-slate-200 px-4 py-5" style={{ touchAction: 'pan-y' }}>
      <div
        ref={boardRef}
        className="relative mx-auto shrink-0 overflow-hidden bg-slate-50 shadow-sm ring-1 ring-slate-300"
        style={{
          width: `${board.scaledWidth}px`,
          height: `${board.scaledHeight}px`
        }}
      >
        <PresenterBackground background={page?.background} scale={board.scale} />
        <div className="pointer-events-none absolute left-4 top-4 rounded bg-slate-900/75 px-2.5 py-1 text-xs font-semibold text-slate-50">
          {page?.title || 'Pagina'}
        </div>
      </div>
    </div>
  );
}

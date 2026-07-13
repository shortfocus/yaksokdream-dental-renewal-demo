import { useEffect, useState } from 'react';
import { AlertTriangle, ExternalLink, Sparkles, X, ZoomIn } from 'lucide-react';
import { PROPOSAL_ITEMS } from '../data';
import { ProposalKey } from '../types';

interface AsIsWireframeProps {
  liveSiteUrl: string;
  onFocusItem: (id: ProposalKey) => void;
  onGoToBe: () => void;
}

const ASIS_SCREENSHOT = '/asis/current-site.jpg';

export default function AsIsWireframe({
  liveSiteUrl,
  onFocusItem,
  onGoToBe,
}: AsIsWireframeProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    if (!isLightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#e8e6e1] overflow-hidden">
      <div className="shrink-0 px-3 sm:px-4 py-2.5 sm:py-3 bg-[#d4d1ca] border-b border-[#bdb8ae] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-slate-700 min-w-0">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="truncate">As-Is · 기존 사이트 화면 (문제점 요약)</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={liveSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-white/80 text-slate-700 border border-slate-300 hover:bg-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            실제 사이트
          </a>
          <button
            type="button"
            onClick={onGoToBe}
            className="inline-flex flex-1 sm:flex-none items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold bg-[#007680] text-white hover:bg-[#006069] transition-colors shadow-sm animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            To-Be 보기
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-3 sm:p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(280px,0.95fr)] gap-4 sm:gap-5 items-start">
          {/* Existing site screenshot — 전체 길이 표시, 클릭 시 상세 */}
          <div className="rounded-sm border border-slate-300 bg-white shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="group relative block w-full text-left cursor-zoom-in bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#007680] focus-visible:ring-inset"
              aria-label="기존 사이트 화면 크게 보기"
            >
              <img
                src={ASIS_SCREENSHOT}
                alt="약속드림치과 기존 사이트 전체 화면"
                className="block w-full h-auto select-none"
                draggable={false}
              />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 py-2.5 bg-slate-950/55 text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-3.5 h-3.5" />
                클릭하면 전체 화면으로 자세히 봅니다
              </span>
            </button>
            <p className="px-3 py-2 text-[10px] text-slate-500 bg-[#f4f3ef] border-t border-dashed border-slate-300">
              기존 사이트 전체 캡처 · 이미지를 클릭하면 스크롤하며 상세 확인할 수 있습니다.
            </p>
          </div>

          {/* Problem list */}
          <div className="space-y-3 lg:sticky lg:top-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Current Issues
              </p>
              <h3 className="text-base font-bold text-slate-800 leading-snug">
                기존 사이트에서 바로잡는 지점
              </h3>
              <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                긴 페이지 구조는 그대로 두고, 보안·가독성·전환에 영향을 주는 문제만 요약했습니다.
              </p>
            </div>

            <ol className="space-y-2">
              {PROPOSAL_ITEMS.map((item, index) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onFocusItem(item.id)}
                    className="w-full text-left rounded-lg border border-slate-300/80 bg-white/70 hover:bg-white hover:border-red-300 px-3 py-2.5 transition-colors cursor-pointer"
                  >
                    <div className="flex gap-2.5">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {index + 1}
                      </span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-snug">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-600 leading-relaxed">
                          {item.asIs}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={onGoToBe}
              className="w-full mt-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold bg-[#007680] text-white hover:bg-[#006069] transition-colors shadow"
            >
              <Sparkles className="w-4 h-4" />
              To-Be로 개선 화면 확인하기
            </button>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-slate-950/85 backdrop-blur-sm flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="기존 사이트 화면 상세 보기"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
            <p className="text-sm font-semibold text-white">
              기존 사이트 전체 화면
              <span className="ml-2 text-[11px] font-normal text-slate-400">
                Esc 또는 바깥 클릭으로 닫기
              </span>
            </p>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={ASIS_SCREENSHOT}
              alt="약속드림치과 기존 사이트 전체 화면 상세"
              className="block w-full max-w-4xl mx-auto h-auto rounded-sm shadow-2xl bg-white"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}

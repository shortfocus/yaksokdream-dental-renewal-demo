import { AlertTriangle, ExternalLink, Sparkles } from 'lucide-react';
import { PROPOSAL_ITEMS } from '../data';
import { ProposalKey } from '../types';

interface AsIsWireframeProps {
  liveSiteUrl: string;
  onFocusItem: (id: ProposalKey) => void;
  onGoToBe: () => void;
}

/** 스케치 위 번호 핀 위치 */
const PIN_POS: Record<ProposalKey, string> = {
  security: 'top-[11%] right-[18%]',
  banner: 'top-[36%] left-[22%]',
  floating: 'top-[32%] right-[7%]',
  hours: 'top-[68%] left-[28%]',
  form: 'bottom-[9%] right-[22%]',
};

export default function AsIsWireframe({
  liveSiteUrl,
  onFocusItem,
  onGoToBe,
}: AsIsWireframeProps) {
  return (
    <div className="flex-1 min-h-0 flex flex-col bg-[#e8e6e1] overflow-hidden">
      <div className="shrink-0 px-4 py-3 bg-[#d4d1ca] border-b border-[#bdb8ae] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>As-Is 와이어프레임 · 기존 문제점만 요약</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={liveSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-semibold bg-white/80 text-slate-700 border border-slate-300 hover:bg-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            실제 사이트 새 탭
          </a>
          <button
            type="button"
            onClick={onGoToBe}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold bg-[#007680] text-white hover:bg-[#006069] transition-colors shadow-sm animate-pulse"
          >
            <Sparkles className="w-3.5 h-3.5" />
            To-Be 개선안 보기
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-6 grid lg:grid-cols-[1.15fr_0.85fr] gap-5 items-start">
          {/* Rough page sketch */}
          <div className="relative rounded-sm border-2 border-dashed border-slate-400 bg-[#f4f3ef] shadow-inner overflow-hidden min-h-[420px]">
            <div className="h-7 border-b border-dashed border-slate-300 flex items-center gap-1.5 px-3 bg-slate-200/70">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <div className="ml-2 flex-1 h-3 rounded-sm bg-slate-300/90 border border-dashed border-slate-400" />
            </div>

            <div className="h-11 border-b border-dashed border-slate-300 px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-dashed border-slate-400 bg-slate-200" />
                <div className="space-y-1">
                  <div className="h-2 w-20 bg-slate-300 rounded-sm" />
                  <div className="h-1.5 w-12 bg-slate-200 rounded-sm" />
                </div>
              </div>
              <div className="h-4 w-24 border border-dashed border-red-400 bg-red-50 rounded-sm" />
            </div>

            <div className="relative h-36 md:h-44 border-b border-dashed border-slate-300 bg-slate-200/40 px-5 py-6">
              <div className="space-y-2 w-[50%]">
                <div className="h-2.5 w-full bg-slate-400/60 rounded-sm" />
                <div className="h-2 w-4/5 bg-slate-300 rounded-sm" />
                <div className="h-2 w-3/5 bg-slate-300/80 rounded-sm" />
              </div>
              <div className="absolute top-3 right-3 w-14 h-32 border-2 border-dashed border-amber-500 bg-amber-100/80 rounded-sm" />
            </div>

            <div className="p-4 space-y-3 border-b border-dashed border-slate-300">
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 border border-dashed border-slate-300 bg-slate-100 rounded-sm" />
                ))}
              </div>
              <div className="space-y-1.5">
                <div className="h-1.5 w-full bg-slate-300 rounded-sm" />
                <div className="h-1.5 w-[90%] bg-slate-300/80 rounded-sm" />
                <div className="h-1.5 w-[78%] bg-slate-300/60 rounded-sm" />
              </div>
            </div>

            <div className="p-3 bg-slate-300/35">
              <div className="flex gap-2">
                <div className="h-6 flex-1 border border-dashed border-slate-400 bg-white/60 rounded-sm" />
                <div className="h-6 flex-1 border border-dashed border-slate-400 bg-white/60 rounded-sm" />
                <div className="h-6 w-20 border-2 border-dashed border-red-500 bg-red-100 rounded-sm" />
              </div>
            </div>

            {PROPOSAL_ITEMS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onFocusItem(item.id)}
                className={`absolute z-10 w-6 h-6 rounded-full bg-red-600 text-white text-[11px] font-bold shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer ${PIN_POS[item.id]}`}
                title={item.title}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Problem list */}
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Current Issues
              </p>
              <h3 className="text-base font-bold text-slate-800 leading-snug">
                기존 사이트에서 바로잡는 지점
              </h3>
              <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                실제 페이지를 그대로 옮기지 않고, 전환·신뢰에 영향을 주는 문제만 와이어로 표시했습니다.
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
    </div>
  );
}

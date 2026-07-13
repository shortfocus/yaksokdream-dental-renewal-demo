import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles, 
  Tv, 
  Layers, 
  Grid, 
  FileText, 
  ArrowRight, 
  Compass, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  CheckCircle,
  Eye,
  Info
} from 'lucide-react';
import { ProposalItem, ProposalKey } from '../types';
import { PROPOSAL_ITEMS } from '../data';

interface ProposalPanelProps {
  asIsStates: Record<ProposalKey, boolean>;
  toggleItemState: (id: ProposalKey) => void;
  onFocusItem: (id: ProposalKey) => void;
  activeItem: ProposalKey | null;
  setAllToMode: (isAsIs: boolean) => void;
  showLiveAsIs?: boolean;
}

export default function ProposalPanel({
  asIsStates,
  toggleItemState,
  onFocusItem,
  activeItem,
  setAllToMode,
  showLiveAsIs = false,
}: ProposalPanelProps) {
  
  // Choose icon based on proposal ID
  const getProposalIcon = (id: ProposalKey, isAsIs: boolean) => {
    switch (id) {
      case 'security':
        return isAsIs ? 
          <ShieldAlert className="w-5 h-5 text-red-500" /> : 
          <ShieldCheck className="w-5 h-5 text-teal-600" />;
      case 'banner':
        return <Tv className={`w-5 h-5 ${isAsIs ? 'text-gray-400' : 'text-teal-600'}`} />;
      case 'floating':
        return <Layers className={`w-5 h-5 ${isAsIs ? 'text-amber-500' : 'text-teal-600'}`} />;
      case 'hours':
        return <Grid className={`w-5 h-5 ${isAsIs ? 'text-gray-400' : 'text-teal-600'}`} />;
      case 'form':
        return <FileText className={`w-5 h-5 ${isAsIs ? 'text-gray-400' : 'text-teal-600'}`} />;
    }
  };

  const isAllToBe = Object.values(asIsStates).every(v => v === false);

  return (
    <div id="proposal-panel" className="bg-slate-900 text-slate-100 flex flex-col h-full border-r border-slate-800">
      {/* Header Info */}
      <div className="p-6 border-b border-slate-800 bg-slate-950">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 text-xs font-semibold bg-teal-500/10 text-teal-400 rounded-full border border-teal-500/20">
            PROPOSAL COMPANION
          </span>
          <span className="text-xs text-slate-400">Ver 1.0</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          약속드림치과 리뉴얼 제안서
        </h2>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          제안서 내용을 기반으로 제작된 인터랙티브 데모입니다. 각 요소의 개별 및 일괄 리뉴얼 성과를 직접 확인해 보세요.
        </p>

        {/* Global Action Toggles */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => setAllToMode(true)}
            className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 border cursor-pointer ${
              showLiveAsIs
                ? 'bg-red-500/20 text-red-400 border-red-500/30 shadow-inner'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750 hover:text-slate-300'
            }`}
          >
            ❌ 일괄 As-Is (기존)
          </button>
          <button
            onClick={() => setAllToMode(false)}
            className={`relative py-2 px-3 text-xs font-semibold rounded-lg transition-all duration-200 border cursor-pointer ${
              isAllToBe && !showLiveAsIs
                ? 'bg-teal-500/20 text-teal-400 border-teal-500/30 shadow-inner'
                : showLiveAsIs
                  ? 'bg-teal-500/25 text-teal-300 border-teal-400/60 shadow-[0_0_0_2px_rgba(45,212,191,0.35)] ring-2 ring-teal-400/50 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750 hover:text-slate-300'
            }`}
          >
            ✨ 일괄 To-Be (개선)
            {showLiveAsIs && (
              <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-teal-400 text-slate-950 text-[9px] font-bold leading-none shadow">
                클릭
              </span>
            )}
          </button>
        </div>
        {showLiveAsIs && (
          <p className="mt-2 text-[10px] text-red-400/90 leading-relaxed">
            미리보기에 기존 문제점 와이어프레임이 표시됩니다. 실제 사이트는 새 탭으로 확인할 수 있습니다.{' '}
            <span className="text-teal-400 font-semibold">To-Be를 눌러 개선안을 확인해 보세요.</span>
          </p>
        )}
      </div>

      {/* Interactive Item List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 px-2 pb-1">
          <Info className="w-3.5 h-3.5 text-teal-500" />
          <span>각 항목을 클릭해 해당 영역으로 이동 및 상태 전환</span>
        </div>

        {PROPOSAL_ITEMS.map((item) => {
          const isAsIs = asIsStates[item.id];
          const isCurrentlyFocused = activeItem === item.id;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border transition-all duration-300 relative cursor-pointer ${
                isCurrentlyFocused
                  ? 'bg-slate-800 border-teal-500 shadow-md ring-1 ring-teal-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
              onClick={() => onFocusItem(item.id)}
            >
              {/* Category & Status Indicator */}
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-800/80 px-2 py-0.5 rounded">
                  {item.category}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItemState(item.id);
                  }}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isAsIs
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                      : 'bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20'
                  }`}
                  title="해당 요소만 개별 상태 토글"
                >
                  {isAsIs ? '🚨 As-Is 적용' : '❇️ To-Be 적용'}
                </button>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="mt-0.5 shrink-0">
                  {getProposalIcon(item.id, isAsIs)}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">
                  {item.title}
                </h3>
              </div>

              {/* Collapsible Details */}
              <div className="space-y-2 mt-2.5 text-xs">
                {/* Content block based on active state */}
                <div className={`p-2.5 rounded-lg border ${
                  isAsIs 
                    ? 'bg-red-500/5 border-red-500/10 text-red-200/90' 
                    : 'bg-teal-500/5 border-teal-500/10 text-teal-200/90'
                }`}>
                  <p className="font-semibold text-[11px] mb-1">
                    {isAsIs ? '⚠️ 기존 문제점 (As-Is)' : '✅ 개선사항 (To-Be)'}
                  </p>
                  <p className="leading-relaxed text-[11px]">
                    {isAsIs ? item.asIs : item.toBe}
                  </p>
                </div>

                {/* Expected Effect */}
                {!isAsIs && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-200/90">
                    <p className="font-semibold text-[11px] mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-yellow-400" />
                      기대 효과 (Expected Benefit)
                    </p>
                    <p className="leading-relaxed text-[11px]">
                      {item.effect}
                    </p>
                  </div>
                )}
              </div>

              {/* Focus trigger helper */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex justify-between items-center text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <Eye className="w-3.5 h-3.5" />
                  클릭시 이 위치로 이동
                </span>
                <span className="font-medium text-teal-400 flex items-center gap-0.5 hover:underline">
                  자세히 보기 <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Proposer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-[10px]">
            SW
          </div>
          <div>
            <p className="font-semibold text-slate-200">채희승 (솔리드웹)</p>
            <p className="text-[10px] text-slate-500">Premium Web Studio</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px] text-slate-500">
          <div className="flex items-center gap-1">
            <Phone className="w-3 h-3" /> 010-7179-4413
          </div>
          <a
            href="mailto:contact@solidweb.kr"
            className="flex items-center gap-1 hover:text-teal-400 transition-colors"
          >
            <Mail className="w-3 h-3 shrink-0" /> contact@solidweb.kr
          </a>
          <a
            href="https://www.solidweb.kr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-teal-400 transition-colors"
          >
            <Globe className="w-3 h-3 shrink-0" /> https://www.solidweb.kr
          </a>
          <a
            href="/proposal-original.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-teal-400 transition-colors"
          >
            <FileText className="w-3 h-3 shrink-0" /> 제안서 원본 HTML
          </a>
        </div>
      </div>
    </div>
  );
}

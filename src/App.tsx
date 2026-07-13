import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Unlock, 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Car, 
  AlertTriangle, 
  Send, 
  RefreshCw, 
  Smile, 
  Award, 
  Activity, 
  X,
  Plus,
  Bus,
  Train,
  CheckCircle2,
  CalendarCheck,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  ExternalLink,
  MessageSquare,
  Gift,
  Percent,
  Moon,
  Megaphone,
  Headset,
  Menu,
  Info
} from 'lucide-react';

import ProposalPanel from './components/ProposalPanel';
import AsIsWireframe from './components/AsIsWireframe';
import { ProposalKey, Consultation, Doctor } from './types';
import {
  CLINIC_REVIEWS,
  CLINIC_DOCTORS,
  HERO_SLIDES,
  TREATMENT_OPTIONS,
  CONSULT_TIME_OPTIONS,
} from './data';

const INITIAL_FORM = {
  name: '',
  phone: '',
  treatment: '임플란트',
  preferredTime: '10시 ~ 11시',
  message: '',
  agreePrivacy: false,
};
export default function App() {
  // Global states for each proposal item's As-Is state (true = As-Is, false = To-Be)
  // 첫 진입: 일괄 As-Is(기존 사이트)로 시작해 To-Be 전환을 유도
  const [asIsStates, setAsIsStates] = useState<Record<ProposalKey, boolean>>({
    security: true,
    banner: true,
    floating: true,
    hours: true,
    form: true,
  });

  const [activeProposalItem, setActiveProposalItem] = useState<ProposalKey | null>(null);
  const [highlightItem, setHighlightItem] = useState<ProposalKey | null>(null);
  const [showDemoNotice, setShowDemoNotice] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // Form states (To-Be / As-Is both write to here)
  const [formData, setFormData] = useState({ ...INITIAL_FORM });

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showNaverModal, setShowNaverModal] = useState(false);
  const [isParkingExpanded, setIsParkingExpanded] = useState(false);
  const [activeDoctorId, setActiveDoctorId] = useState('doc1');
  const [selfLigationStep, setSelfLigationStep] = useState<'closed' | 'open' | 'reclosed'>('closed');
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroHeight, setHeroHeight] = useState(0);
  const [floatBarHeight, setFloatBarHeight] = useState(112);
  const scrollRef = useRef<HTMLDivElement>(null);
  const floatBarRef = useRef<HTMLDivElement>(null);

  // Address bar URL state
  const [isAddressBarLoading, setIsAddressBarLoading] = useState(false);

  // 일괄 As-Is: 기존 사이트 캡처 + 문제점 요약 (HTTPS iframe 불가 → 와이어프레임으로 통일)
  const [showLiveAsIs, setShowLiveAsIs] = useState(true);
  const LIVE_ASIS_URL = 'http://www.xn--vb0b92m88dwvj85ez2p.com/';
  // 로컬/배포 모두 동일한 As-Is 와이어프레임을 보여 대비를 맞춤
  const showLiveIframe = false;

  // Refs for scroll target linking
  const sectionRefs = {
    security: useRef<HTMLDivElement>(null),
    banner: useRef<HTMLDivElement>(null),
    floating: useRef<HTMLDivElement>(null),
    hours: useRef<HTMLDivElement>(null),
    form: useRef<HTMLDivElement>(null),
  };

  // Load submissions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('promise_dream_consultations');
    if (saved) {
      try {
        setConsultations(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // To-Be 히어로: 기존 메인 배너 자동 슬라이드
  useEffect(() => {
    if (asIsStates.banner || showLiveIframe) return;
    setHeroSlideIndex((prev) => prev % HERO_SLIDES.length);
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [asIsStates.banner, showLiveIframe]);

  // 스크롤 영역 높이 − 하단 플로팅 바 높이 = 히어로 높이
  useEffect(() => {
    if (showLiveIframe || asIsStates.banner) {
      setHeroHeight(0);
      return;
    }

    const update = () => {
      const scrollEl = scrollRef.current;
      if (!scrollEl) return;
      const barH = floatBarRef.current?.offsetHeight || 112;
      setFloatBarHeight(barH);
      setHeroHeight(Math.max(Math.floor(scrollEl.clientHeight - barH), 280));
    };

    const ro = new ResizeObserver(update);
    if (scrollRef.current) ro.observe(scrollRef.current);
    if (floatBarRef.current) ro.observe(floatBarRef.current);

    const t0 = window.setTimeout(update, 0);
    const t1 = window.setTimeout(update, 80);
    window.addEventListener('resize', update);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [showLiveIframe, asIsStates.banner, asIsStates.form]);

  const goHeroSlide = (direction: -1 | 1) => {
    setHeroSlideIndex((prev) => (prev + direction + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Sync state helpers
  const toggleItemState = (id: ProposalKey) => {
    setShowLiveAsIs(false);
    setAsIsStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const setAllToMode = (isAsIs: boolean) => {
    setIsAddressBarLoading(true);
    setTimeout(() => {
      setAsIsStates({
        security: isAsIs,
        banner: isAsIs,
        floating: isAsIs,
        hours: isAsIs,
        form: isAsIs,
      });
      setShowLiveAsIs(isAsIs);
      setShowDemoNotice(!isAsIs);
      setIsAddressBarLoading(false);
    }, 400);
  };

  // Focus and scroll to a specific section on the page
  const handleFocusItem = (id: ProposalKey) => {
    // 실제 As-Is 사이트 보기 중이면 데모 시뮬레이션으로 복귀
    setShowLiveAsIs(false);
    setActiveProposalItem(id);
    setHighlightItem(id);

    // Scroll to the ref target (iframe 해제 후 DOM이 생기므로 약간 지연)
    requestAnimationFrame(() => {
      const targetRef = sectionRefs[id];
      if (targetRef && targetRef.current) {
        targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    // Clear highlight after 2.5 seconds
    setTimeout(() => {
      setHighlightItem(null);
    }, 2500);
  };

  // Handle consultation form submission
  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault();

    // Check validation based on mode
    if (!formData.name.trim()) return alert('성함을 입력해 주세요.');
    if (!formData.phone.trim()) return alert('연락처를 입력해 주세요.');
    
    // In As-Is, there's no privacy validation enforcement or it's unguided
    if (!asIsStates.form && !formData.agreePrivacy) {
      return alert('개인정보 수집 및 이용 동의가 필요합니다.');
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newConsult: Consultation = {
        id: 'c_' + Date.now(),
        name: formData.name,
        phone: formData.phone,
        preferredTime: `${formData.treatment} / ${formData.preferredTime}`,
        message: formData.message,
        submittedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        isSecure: !asIsStates.security
      };

      const updated = [newConsult, ...consultations];
      setConsultations(updated);
      localStorage.setItem('promise_dream_consultations', JSON.stringify(updated));

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Clear form
      setFormData({ ...INITIAL_FORM });
    }, 1200);
  };

  return (
    <div className="flex h-[100dvh] bg-slate-950 font-sans overflow-hidden">
      
      {/* 1. Left Companion Panel: Interactive Proposal Guide (desktop) */}
      <div className="w-96 shrink-0 h-full hidden lg:block">
        <ProposalPanel 
          asIsStates={asIsStates}
          toggleItemState={toggleItemState}
          onFocusItem={handleFocusItem}
          activeItem={activeProposalItem}
          setAllToMode={setAllToMode}
          showLiveAsIs={showLiveAsIs}
        />
      </div>

      {/* Mobile proposal drawer */}
      {mobilePanelOpen && (
        <div className="lg:hidden fixed inset-0 z-[80] flex">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 cursor-pointer border-0"
            aria-label="제안서 패널 닫기"
            onClick={() => setMobilePanelOpen(false)}
          />
          <div className="relative z-10 w-[min(100%,22rem)] h-full shadow-2xl animate-slide-up">
            <ProposalPanel 
              asIsStates={asIsStates}
              toggleItemState={(id) => {
                toggleItemState(id);
              }}
              onFocusItem={(id) => {
                handleFocusItem(id);
                setMobilePanelOpen(false);
              }}
              activeItem={activeProposalItem}
              setAllToMode={(isAsIs) => {
                setAllToMode(isAsIs);
                setMobilePanelOpen(false);
              }}
              showLiveAsIs={showLiveAsIs}
            />
            <button
              type="button"
              onClick={() => setMobilePanelOpen(false)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center border border-slate-700 cursor-pointer"
              aria-label="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Center/Right Content Area: Interactive Browser Simulation */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-900">
        
        {/* Mobile/Tablet Header */}
        <div className="lg:hidden p-2.5 sm:p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setMobilePanelOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-[11px] font-bold border border-slate-700 cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5" />
            제안서
          </button>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shrink-0" />
            <span className="text-[11px] text-white font-bold truncate">약속드림치과 데모</span>
          </div>
          <div className="flex gap-1 shrink-0">
            <button 
              onClick={() => setAllToMode(true)}
              className={`px-2 py-1 text-[10px] font-bold rounded border cursor-pointer ${
                showLiveAsIs
                  ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              As-Is
            </button>
            <button 
              onClick={() => setAllToMode(false)}
              className={`px-2 py-1 text-[10px] font-bold rounded border cursor-pointer ${
                Object.values(asIsStates).every(v => v === false) && !showLiveAsIs
                  ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' 
                  : showLiveAsIs
                    ? 'bg-teal-500/25 text-teal-300 border-teal-400/50 animate-pulse'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              To-Be
            </button>
          </div>
        </div>

        {/* To-Be demo notice */}
        {showDemoNotice && !showLiveAsIs && (
          <div className="shrink-0 z-50 px-3 py-2.5 bg-teal-950 border-b border-teal-500/30 flex items-start sm:items-center gap-2.5">
            <Info className="w-4 h-4 text-teal-300 shrink-0 mt-0.5 sm:mt-0" />
            <p className="flex-1 text-[11px] sm:text-xs text-teal-100 leading-relaxed font-medium">
              현재는 데모 페이지이며 디자인 및 내용 수정은 더 자세하게 작업합니다.
            </p>
            <button
              type="button"
              onClick={() => setShowDemoNotice(false)}
              className="shrink-0 text-teal-300/80 hover:text-white cursor-pointer bg-transparent border-0 p-0.5"
              aria-label="안내 닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Browser Chrome Wrapper */}
        <div className="flex-1 flex flex-col m-1.5 sm:m-3 md:m-4 rounded-lg sm:rounded-xl overflow-hidden border border-slate-800 bg-white shadow-2xl relative min-h-0">
          
          {/* Simulated Browser Bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-2 sm:px-4 py-2 sm:py-3 shrink-0 flex items-center gap-2 sm:gap-3">
            {/* Mac style red, yellow, green controls */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 flex items-center gap-2 max-w-2xl mx-auto min-w-0">
              <div className={`w-full min-w-0 flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-mono border transition-all duration-300 ${
                asIsStates.security 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              }`}>
                {/* Security Badge in Address Bar */}
                {isAddressBarLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400 animate-spin shrink-0" />
                ) : asIsStates.security ? (
                  <div className="flex items-center gap-1 font-bold shrink-0 text-red-600 animate-pulse">
                    <Unlock className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline sm:inline">주의 요함 |</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-bold shrink-0 text-emerald-600">
                    <Lock className="w-3.5 h-3.5" />
                    <span>안전함 |</span>
                  </div>
                )}

                {/* URL */}
                <div className="flex-1 truncate">
                  <span className={asIsStates.security ? 'text-red-500 font-semibold' : 'text-emerald-700'}>
                    {asIsStates.security ? 'http' : 'https'}://www.xn--vb0b92m88dwvj85ez2p.com/
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated SSL Status Quick Toggle Button */}
            <div className="shrink-0 flex items-center gap-1">
              {showLiveAsIs ? (
                <a
                  href={LIVE_ASIS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold cursor-pointer border transition-all duration-200 bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                  title="새 탭에서 기존 사이트 열기"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">새 탭으로 열기</span>
                </a>
              ) : (
                <button
                  onClick={() => toggleItemState('security')}
                  className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold cursor-pointer border transition-all duration-200 ${
                    asIsStates.security 
                      ? 'bg-red-500 text-white border-red-600 hover:bg-red-600' 
                      : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                  }`}
                  title="클릭하여 SSL 보안 상태를 즉시 토글합니다."
                >
                  {asIsStates.security ? (
                    <>
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">SSL 미적용</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">SSL 보안 가동</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Web Viewport Screen */}
          {showLiveIframe ? (
            <div className="flex-1 relative flex flex-col bg-white overflow-hidden">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600/95 text-white text-[11px] font-bold shadow-lg border border-red-400/40">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  실제 운영 중인 기존 사이트 (As-Is)
                </span>
              </div>
              <iframe
                src={LIVE_ASIS_URL}
                title="약속드림치과 기존 사이트 (As-Is)"
                className="w-full flex-1 border-0 bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : showLiveAsIs ? (
            <AsIsWireframe
              liveSiteUrl={LIVE_ASIS_URL}
              onFocusItem={(id) => setActiveProposalItem(id)}
              onGoToBe={() => setAllToMode(false)}
            />
          ) : (
          <div className="flex-1 min-h-0 flex flex-col relative bg-slate-50 overflow-hidden">
            {/* Visual warning banner if in As-Is security mode */}
            {asIsStates.security && (
              <div className="bg-red-500 text-white px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 shrink-0 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-white" />
                <span>이 웹사이트는 보안 연결(SSL)이 구성되지 않아 환자분의 소중한 개인정보(이름, 연락처 등)가 암호화되지 않고 노출될 위험이 있습니다.</span>
              </div>
            )}

            {/* Site header — outside scroll so hero can fill remaining viewport */}
            <header className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center shrink-0 z-40 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#007680] flex items-center justify-center text-white font-bold">
                  약
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800 leading-tight tracking-tight">
                    약속드림치과
                  </h1>
                  <span className="text-[9px] text-slate-500 font-semibold block -mt-0.5 tracking-widest uppercase">
                    PROMISE DREAM DENTAL
                  </span>
                </div>
              </div>

              <div ref={sectionRefs.security} className={`transition-all duration-300 p-1.5 rounded-lg ${
                highlightItem === 'security' ? 'ring-4 ring-yellow-400 bg-yellow-100/50' : ''
              }`}>
                {asIsStates.security ? (
                  <div className="flex items-center gap-1.5 text-xs text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-full border border-red-200">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    <span>보안 비인증 (HTTP)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 animate-pulse-slow" />
                    <span>보안 암호화 전송 (HTTPS 적용 완료)</span>
                  </div>
                )}
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto relative"
            >
            {/* 2. Main Hero Visual Section */}
            <section 
              ref={sectionRefs.banner}
              className={`relative w-full transition-all duration-300 ${
                highlightItem === 'banner' ? 'ring-4 ring-yellow-400 bg-yellow-100/20 z-10' : ''
              }`}
              style={
                !asIsStates.banner && heroHeight > 0
                  ? { height: heroHeight }
                  : asIsStates.banner
                    ? undefined
                    : { minHeight: '100%' }
              }
            >
              {asIsStates.banner ? (
                /* AS-IS: Dull, boring text copy with outdated statistics, squished. */
                <div className="bg-slate-300 text-slate-800 p-8 md:p-14 text-center border-b border-slate-400 relative overflow-hidden min-h-[300px] flex flex-col justify-center items-center">
                  <div className="max-w-xl mx-auto space-y-3 relative z-10">
                    <div className="inline-block bg-slate-500 text-white text-xs px-2.5 py-1 rounded font-bold">
                      치과 임상 통계 데이터 (2024년 기준)
                    </div>
                    <h2 className="text-2xl font-bold font-mono tracking-tight text-slate-900 leading-tight">
                      임플란트 수술 35,000건 달성!
                    </h2>
                    <p className="text-sm text-slate-700 leading-relaxed font-sans">
                      약속드림치과는 풍부한 노하우를 바탕으로 임플란트를 시술하고 있습니다.
                      빠르고 안전하게 환자분의 미소를 찾아드립니다.
                    </p>
                  </div>
                  <div className="absolute top-2 left-2 text-[10px] text-slate-500 font-mono">
                    [기존 배너: 2024년에 멈춘 지표 및 기본 고딕체]
                  </div>

                  {asIsStates.floating && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#2DB400] text-white p-4 rounded-lg shadow-xl w-48 text-center border-2 border-white z-20 animate-pulse">
                      <p className="text-xs font-bold">[!] 네이버 문의/예약</p>
                      <p className="text-[10px] my-1">메인 카피 영역을 침범하여 본문 텍스트를 가리는 버그 발생</p>
                      <button className="bg-white text-[#2DB400] text-[10px] font-bold px-2 py-1 rounded mt-1 w-full">
                        예약 페이지 이동
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* TO-BE: 기존 메인 배너를 풀블리드 슬라이드로 재구성 + 2026 카피 */
                <div className="absolute inset-0 w-full h-full bg-brand-dark overflow-hidden group/hero">
                  {/* Full-bleed image slider */}
                  <div className="absolute inset-0 z-0 w-full h-full">
                    <AnimatePresence mode="sync" initial={false}>
                      <motion.img
                        key={HERO_SLIDES[heroSlideIndex].id}
                        src={HERO_SLIDES[heroSlideIndex].src}
                        alt={HERO_SLIDES[heroSlideIndex].alt}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.55, ease: 'easeInOut' }}
                        className="absolute inset-0 block w-full h-full min-w-full min-h-full object-cover object-center scale-105 blur-[2px] brightness-95"
                        draggable={false}
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-white/35 pointer-events-none" />
                  </div>

                  {/* Prev / Next */}
                  <button
                    type="button"
                    onClick={() => goHeroSlide(-1)}
                    className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity cursor-pointer shadow-sm"
                    aria-label="이전 배너"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => goHeroSlide(1)}
                    className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200/80 flex items-center justify-center opacity-0 group-hover/hero:opacity-100 transition-opacity cursor-pointer shadow-sm"
                    aria-label="다음 배너"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* To-Be copy — 좌/우 가로 배치 */}
                  <div className="absolute inset-0 z-10 flex items-center px-6 md:px-12 lg:px-16">
                    <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                      {/* Left */}
                      <div className="space-y-5 text-left">
                        <div className="inline-flex items-center gap-1.5 bg-[#007680]/10 text-[#007680] text-xs md:text-sm px-3 py-1.5 rounded-full border border-[#007680]/20 font-semibold">
                          <Sparkles className="w-4 h-4 text-[#007680] animate-bounce-subtle" />
                          <span>기존 메인 비주얼 슬라이드 · 2026 지표 반영</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-sans font-bold leading-snug tracking-tight text-slate-900">
                          약속드림의 <span className="text-[#007680]">확실한 실력</span>,
                          <br />
                          환자분의 평생을 향한 약속
                        </h2>
                        <p className="text-sm md:text-base text-slate-700 leading-relaxed font-normal max-w-lg">
                          기존 사이트 메인 배너를 슬라이드로 재구성하고, 누적 임플란트 35,000건 돌파 지표를 최신으로 강조합니다.
                        </p>
                      </div>

                      {/* Right */}
                      <div className="flex md:justify-end">
                        <div className="bg-slate-900/10 border border-slate-900/10 rounded-xl px-7 py-6 text-slate-900 text-left w-full max-w-xs backdrop-blur-[2px]">
                          <p className="text-xs text-[#007680] font-semibold tracking-wider uppercase">Clinical</p>
                          <p className="text-4xl md:text-5xl font-sans font-extrabold tracking-tight mt-1 text-slate-900">
                            35,000<span className="text-lg font-sans font-medium text-slate-500">건+</span>
                          </p>
                          <p className="text-sm text-slate-600 mt-1.5">누적 임플란트 식립</p>
                        </div>
                      </div>
                    </div>

                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5" role="tablist" aria-label="히어로 슬라이드">
                      {HERO_SLIDES.map((slide, idx) => (
                        <button
                          key={slide.id}
                          type="button"
                          role="tab"
                          aria-selected={idx === heroSlideIndex}
                          aria-label={`${idx + 1}번째 배너`}
                          onClick={() => setHeroSlideIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === heroSlideIndex
                              ? 'w-6 bg-[#007680]'
                              : 'w-1.5 bg-slate-400/50 hover:bg-slate-500/70'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* 3. Floating Naver Button (EMULATING BUG OR COMPONENT FIX) */}
            <div 
              ref={sectionRefs.floating}
              className={`transition-all duration-300 ${
                highlightItem === 'floating' ? 'ring-4 ring-yellow-400 bg-yellow-100/20' : ''
              }`}
            >
              {asIsStates.floating && !asIsStates.banner && (
                /* AS-IS Overlap State: Show the overlapped box only if not already rendered inside Hero above */
                <div className="absolute right-4 top-40 bg-[#2DB400] text-white p-4 rounded-lg shadow-xl w-48 text-center border-2 border-white z-20 animate-pulse">
                  <p className="text-xs font-bold">[!] 네이버 문의/예약</p>
                  <p className="text-[10px] my-1">본문 텍스트를 침범해 가독성을 크게 저해하는 기존 레이아웃</p>
                  <button className="bg-white text-[#2DB400] text-[10px] font-bold px-2 py-1 rounded mt-1 w-full">
                    네이버 예약 가기
                  </button>
                </div>
              )}
            </div>

            {/* 4. Core Dental Clinic Strengths / Trust indicators */}
            <section className="py-14 px-6 md:px-12 bg-white shrink-0">
              <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <span className="text-[#007680] text-xs font-bold tracking-widest block uppercase">
                    PROMISE & TRUST
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-800">
                    많은 분들이 약속드림치과를 고집하는 이유
                  </h3>
                  <div className="w-12 h-1 bg-[#007680] mx-auto rounded mt-3" />
                </div>

                {/* 3 Columns details */}
                <div className="grid md:grid-cols-3 gap-6">
                  
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#007680]" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      보건복지부 인증 전문의 책임 집도
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      중간에 집도의가 변경되는 섀도우 닥터 리스크 없이, 대표원장이 직접 끝까지 책임 진료를 성실하게 수수합니다.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-[#007680]" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      최첨단 3D 디지털 장비 진단
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      구강 내 입체 환경을 한차원 높여 측정하는 3D CT 및 스캐너 장비를 활용해 신경 손상 리스크 없이 정확하게 식립합니다.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3 hover:shadow-md transition-all">
                    <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
                      <Smile className="w-5 h-5 text-[#007680]" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      체계적인 사후 보증 제도
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      치료가 완료된 후에도 약속한 정기 정밀 검진 프로그램과 보증서를 제공하여 임플란트를 오래오래 튼튼하게 쓰도록 돕습니다.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* [NEW] Clinic Special Promotion Section */}
            <section className="py-14 px-6 md:px-12 bg-slate-50 border-t border-slate-100 shrink-0">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <span className="text-[#007680] text-xs font-bold tracking-widest block uppercase">
                    SPECIAL BENEFIT
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-800">
                    약속드림치과 특별 프로모션
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    과잉 진료 없이 합리적인 가격 정책으로 환자분들의 미소와 건강을 소중히 드립니다.
                  </p>
                  <div className="w-12 h-1 bg-[#007680] mx-auto rounded mt-3" />
                </div>

                {/* Promotion Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Card 1: 소비쿠폰 */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-teal-50 rounded-xl text-[#007680]">
                          <Gift className="w-5 h-5" />
                        </div>
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded border border-emerald-100">
                          사용 가맹점
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-slate-800 text-sm">민생회복 소비쿠폰 가맹점</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-light">
                          안양 약속드림치과는 국가/지자체 민생회복 소비쿠폰(지역사랑상품권 및 온누리상품권) 사용 공식 가맹처입니다.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 text-[11px] text-[#007680] font-semibold flex items-center gap-1">
                      <span>• 원내 전액 결제 등록 지원</span>
                    </div>
                  </div>

                  {/* Card 2: 치아교정 이벤트 */}
                  <div className="bg-white p-6 rounded-2xl border-2 border-[#007680] shadow-sm flex flex-col justify-between relative hover:shadow-md transition-all">
                    <div className="absolute -top-3 right-4 bg-[#007680] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full shadow">
                      추천 혜택
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-teal-50 rounded-xl text-[#007680]">
                          <Percent className="w-5 h-5" />
                        </div>
                        <span className="bg-teal-50 text-[#007680] text-[9px] font-bold px-2 py-0.5 rounded border border-teal-100">
                          스페셜 기획전
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="font-bold text-slate-800 text-sm">치아교정 스페셜 한정 이벤트</h4>
                        <div className="space-y-2 pt-1">
                          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                            <span className="text-slate-600 font-medium">메탈교정</span>
                            <div className="text-right">
                              <span className="text-slate-400 line-through text-[10px] block">300만원</span>
                              <span className="text-[#007680] font-bold">250만원</span>
                            </div>
                          </div>
                          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-xs">
                            <span className="text-slate-600 font-medium">세라믹교정</span>
                            <div className="text-right">
                              <span className="text-slate-400 line-through text-[10px] block">400만원</span>
                              <span className="text-[#007680] font-bold">290만원</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 pt-1 leading-normal font-light">
                          * 정밀 진단비, 월 치료비, 정품 장치 및 유지장치 비용 전격 포함!
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 text-[11px] text-[#007680] font-semibold flex items-center justify-between">
                      <span>• 선착순 분할 납부 지원</span>
                      <button 
                        type="button"
                        onClick={() => handleFocusItem('form')}
                        className="text-[10px] text-teal-600 hover:underline font-bold flex items-center cursor-pointer"
                      >
                        상담하기 &gt;
                      </button>
                    </div>
                  </div>

                  {/* Card 3: 임플란트 이벤트 (종료) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative overflow-hidden">
                    {/* Event Ended Dimmed Overlay */}
                    <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[0.5px] pointer-events-none z-10" />
                    
                    <div className="space-y-4 relative z-0">
                      <div className="flex justify-between items-start">
                        <div className="p-2 bg-slate-100 rounded-xl text-slate-400">
                          <Megaphone className="w-5 h-5" />
                        </div>
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded border border-slate-200">
                          종료 마감
                        </span>
                      </div>
                      <div className="space-y-1.5 opacity-60">
                        <h4 className="font-bold text-slate-800 text-sm">임플란트 신년 감사 프로모션</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-light">
                          보증기간 확대 및 정품 오스템 정밀 패키지 특별 한정 혜택을 제공하였던 감사제입니다.
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-semibold flex items-center justify-between relative z-0 opacity-60">
                      <span>성원에 힘입어 조기 마감</span>
                      <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold">마감 완료</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* [NEW] Dental Implant Center: Sleep Implant & 1:1 Custom Implant */}
            <section className="py-16 px-6 md:px-12 bg-white border-t border-slate-100 shrink-0">
              <div className="max-w-4xl mx-auto space-y-14">
                
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <span className="text-[#007680] text-xs font-bold tracking-widest block uppercase">
                    IMPLANT SPECIALTY
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-800">
                    약속드림 치과만의 명품 안심 임플란트
                  </h3>
                  <div className="w-12 h-1 bg-[#007680] mx-auto rounded mt-3" />
                </div>

                {/* 1. Sleep Implant Container */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-10 shadow-xl overflow-hidden relative grid md:grid-cols-5 gap-8 items-center">
                  <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-[#007680]/15 filter blur-3xl pointer-events-none" />
                  
                  <div className="md:col-span-3 space-y-5">
                    <div className="inline-flex items-center gap-1 bg-teal-500/10 text-teal-300 text-xs px-3 py-1 rounded-full border border-teal-500/20 font-bold">
                      <Moon className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                      <span>의식하진정법 (가수면 마취 치과치료)</span>
                    </div>
                    
                    <h4 className="text-xl md:text-2xl font-serif font-bold text-white leading-snug">
                      자고 일어난 듯 <span className="text-brand-secondary">편안한 수면임플란트</span>
                    </h4>
                    
                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-light">
                      치과 치료 시 발생하는 극심한 공포증, 구역 반사, 마취 주사 통증으로 망설이셨나요? <br />
                      의식하진정법은 전신마취와 달리 <strong>스스로 자발적 호흡을 정상 유지하는 안전한 가수면 상태</strong>에서 치료를 진행하므로, 통증 기억 없이 편안하게 누워 자고 일어난 듯 완성도 높은 수술을 받으실 수 있습니다.
                    </p>

                    <div className="flex flex-wrap gap-2 text-[10px] text-teal-200">
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">⚡ 고령자 및 당뇨 환자 시술 가능</span>
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">🦷 다수 치아 동시 식립 최적화</span>
                      <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">🛡️ 마취 회복 모니터링 모니터 보유</span>
                    </div>
                  </div>

                  {/* Sleep Steps list */}
                  <div className="md:col-span-2 space-y-3.5 bg-white/5 p-5 rounded-2xl border border-white/10">
                    <p className="text-[10px] font-bold tracking-wider text-brand-secondary uppercase">SLEEP PROCEDURE STEPS</p>
                    
                    <div className="space-y-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-brand-secondary/30">01</span>
                        <div>
                          <strong className="text-white block font-semibold text-xs">정밀 입체 검사</strong>
                          <span className="text-[10px] text-slate-400">3D-CT 입체 촬영으로 골조직, 각도, 신경 위치 완벽 분석</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-brand-secondary/30">02</span>
                        <div>
                          <strong className="text-white block font-semibold text-xs">안전한 가수면 유도</strong>
                          <span className="text-[10px] text-slate-400">정품 수면 진정 유도 약물 정밀 투여로 깊은 수면 유도</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-brand-secondary/30">03</span>
                        <div>
                          <strong className="text-white block font-semibold text-xs">안심 임플란트 시술</strong>
                          <span className="text-[10px] text-slate-400">실시간 혈압, 맥박, 산소 상태를 모니터링하며 섬세히 식립</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border border-brand-secondary/30">04</span>
                        <div>
                          <strong className="text-white block font-semibold text-xs">회복 후 안전 귀가</strong>
                          <span className="text-[10px] text-slate-400">전용 안심 회복실에서 온전히 각성을 되찾은 뒤 가볍게 귀가</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 1:1 Custom Implant Explanation */}
                <div className="grid md:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-4">
                    <span className="text-[#007680] text-xs font-bold uppercase tracking-wider block">CUSTOMIZED PROSTHODONTICS</span>
                    <h4 className="text-xl font-bold text-slate-800">
                      당일식립 & 1:1 맞춤형 지대주 임플란트
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light">
                      <strong>당일식립 임플란트</strong>는 풍부한 노하우를 갖춘 전문 의료진만이 시술할 수 있는 고난도 영역입니다. 치조골을 보존하여 잇몸이 꺼지는 현상을 완벽히 차단하고, 치료 기간을 절반 가까이 극적으로 줄여줍니다.
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed font-light">
                      또한, 기성품 지대주 대신 환자 잇몸의 고유한 형태와 두께에 맞춰 설계한 <strong>1:1 전용 맞춤 지대주 (Custom Abutment)</strong>를 사용하여 보철물 틈새로 침입하는 세균 번식을 줄이고 저작 충격 하중을 균등하게 분산시켜 씹는 힘을 높이고 깨짐 현상을 원천 방지합니다.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex gap-3">
                      <div className="p-1.5 bg-teal-50 text-[#007680] rounded-lg shrink-0 h-fit">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-800">1:1 맞춤형 지대주의 특장점</h5>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                          씹는 힘 균등 분산으로 보철 파절 완전 예방 | 잇몸 틈새 밀착으로 임플란트 주위염 방지 | 자연스러운 잇몸 라인 형성으로 심미성 우수
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Custom Graphic Representing Abutment Comparison */}
                  <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-inner">
                    <div className="text-center">
                      <span className="text-[10px] font-bold text-slate-400 block tracking-widest uppercase">ABUTMENT COMPARISON DESIGN</span>
                      <h5 className="text-xs font-bold text-slate-700 mt-1">기성 지대주 vs 약속드림 1:1 개인 맞춤 지대주</h5>
                    </div>

                    <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                      {/* Standard General Abutment */}
                      <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center space-y-2">
                        <span className="bg-slate-100 text-slate-500 text-[9px] font-bold px-2 py-0.5 rounded border">기성 기공 지대주</span>
                        
                        {/* Simple CSS Graphic for Standard */}
                        <div className="w-full h-24 bg-slate-50 rounded-lg flex flex-col justify-end items-center py-2 border border-dashed border-slate-200 relative overflow-hidden">
                          <div className="w-6 h-12 bg-slate-300 rounded-md mb-1 relative">
                            {/* Gap error lines */}
                            <div className="absolute -left-1.5 top-2 w-3 h-0.5 bg-red-500" />
                            <div className="absolute -right-1.5 top-2 w-3 h-0.5 bg-red-500" />
                          </div>
                          <div className="w-4 h-6 bg-slate-400 rounded-b-md" />
                          <span className="absolute top-1 text-[8px] font-bold text-red-500 animate-pulse">⚠️ 보철 틈새 헐거움</span>
                        </div>
                        
                        <ul className="text-[9px] text-slate-500 text-left list-disc pl-3 space-y-0.5 leading-relaxed">
                          <li>원형 일률 형태 (틈새 유격)</li>
                          <li>씹는 힘 한곳 집중 (쉽게 파손)</li>
                          <li>세균 침입 및 잇몸 염증 리스크</li>
                        </ul>
                      </div>

                      {/* Premium Custom Abutment */}
                      <div className="bg-white p-3.5 rounded-xl border-2 border-teal-500/30 text-center space-y-2 relative">
                        <span className="bg-teal-50 text-[#007680] text-[9px] font-bold px-2 py-0.5 rounded border border-teal-100">1:1 맞춤 지대주</span>
                        
                        {/* Simple CSS Graphic for Custom */}
                        <div className="w-full h-24 bg-teal-50/20 rounded-lg flex flex-col justify-end items-center py-2 border border-teal-100 relative overflow-hidden">
                          <div className="w-10 h-12 bg-[#007680] rounded-t-xl mb-1 relative">
                            {/* Smooth fit line */}
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-[#005a62]" />
                          </div>
                          <div className="w-4 h-6 bg-slate-500 rounded-b-md" />
                          <span className="absolute top-1 text-[8px] font-bold text-[#007680]">✓ 완벽한 잇몸 조화</span>
                        </div>

                        <ul className="text-[9px] text-slate-600 font-medium text-left list-disc pl-3 space-y-0.5 leading-relaxed">
                          <li className="text-[#007680]">환자 고유의 잇몸곡선 맞춤</li>
                          <li className="text-[#007680]">저작 압력 분산 (강한 지지력)</li>
                          <li className="text-[#007680]">유격 완벽 차단 (염증 제로)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Implant Procedure schematic workflow diagram */}
                <div className="pt-6 border-t border-slate-100">
                  <div className="text-center mb-8">
                    <span className="text-[#007680] text-xs font-bold uppercase tracking-wider block">CLINICAL WORKFLOW</span>
                    <h4 className="text-lg font-bold text-slate-800">5단계 원칙적 임플란트 시술 과정</h4>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {/* Step 1 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 hover:bg-slate-100/50 transition-colors text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">STEP</span>
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">01</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs">구강진단 & 계획</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                        X-RAY 및 3D CT 정밀스캔으로 환자의 뼈 상태와 최적의 식립 경로를 빈틈없이 분석 수립합니다.
                      </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 hover:bg-slate-100/50 transition-colors text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">STEP</span>
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">02</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs">1차 픽스처 식립</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                        치조골 내에 고순도 티타늄 기둥(인공치근)을 수립된 계획 수치에 따라 무차별 정밀 이식합니다.
                      </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 hover:bg-slate-100/50 transition-colors text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">STEP</span>
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">03</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs">2차 기둥 노출</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                        잇몸뼈와 기둥이 단단하게 융합된 것을 계측기로 확인한 뒤 상부 구조와 연결할 지대주를 결합시킵니다.
                      </p>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 space-y-2 hover:bg-slate-100/50 transition-colors text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-400">STEP</span>
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">04</span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-xs">맞춤 보철 장착</h5>
                      <p className="text-[10px] text-slate-500 leading-relaxed font-light">
                        원내 정밀 기공 과정을 통해 맞춤 제작된 최종 인공 치아 보철물을 견고하게 장착하여 완료합니다.
                      </p>
                    </div>

                    {/* Step 5 */}
                    <div className="bg-[#007680]/5 p-4 rounded-xl border border-[#007680]/20 space-y-2 hover:bg-[#007680]/10 transition-colors col-span-2 md:col-span-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-[#007680]">STEP</span>
                        <span className="w-6 h-6 rounded-full bg-[#007680] text-white flex items-center justify-center font-bold text-xs">05</span>
                      </div>
                      <h5 className="font-bold text-[#007680] text-xs">평생 사후 관리</h5>
                      <p className="text-[10px] text-slate-600 leading-relaxed font-light">
                        수술 완료가 끝이 아닌, 꼼꼼한 정기 구강 검진 및 스케일링 관리를 통한 평생 보증 수칙을 운영합니다.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* [NEW] Dental Orthodontics: Clippy-C & Self-Ligating System */}
            <section className="py-16 px-6 md:px-12 bg-slate-50 border-t border-slate-100 shrink-0">
              <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <span className="text-[#007680] text-xs font-bold tracking-widest block uppercase">
                    ORTHODONTICS CLINIC
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-800">
                    덧니·돌출입 치아교정? 약속드림!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-lg mx-auto">
                    개개인의 고유한 이목구비 비율과 치아 증상에 따라 차별화된 맞춤 치료계획으로 자신감 넘치는 활짝 웃는 미소를 찾아드립니다.
                  </p>
                  <div className="w-12 h-1 bg-[#007680] mx-auto rounded mt-3" />
                </div>

                {/* Main Content Layout Grid */}
                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                  
                  {/* Card 1: Clippy-C detail */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 text-left">
                    <div className="space-y-4">
                      <span className="bg-teal-50 text-[#007680] text-[10px] font-bold px-2.5 py-1 rounded-full border border-teal-100">
                        클리피씨(Clippy-C) 자가결찰 교정
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 leading-tight">
                        심미성과 속도, 통증 감소 모두를 만족하는 최고의 선택
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        클리피씨 교정은 교정장치와 철사 사이의 불필요한 마찰력을 혁신적으로 최소화하여 치아의 이동을 원활하게 촉진하고 전체 치료 기간을 최대 6개월 가까이 획기적으로 줄여주는 현대식 자가결찰 브라켓입니다.
                      </p>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        개별 결찰용 미세 철사나 보조 고무줄이 일절 들어가지 않아 칫솔질 등 위생 관리에 절대적으로 유리하며 구강 내 찔림이나 상처로 인한 통증 불편함이 극도로 억제됩니다. 자연스러운 치아 색상을 띄는 세라믹 브라켓으로 가공되어 교정 중에도 탁월한 심미성을 자랑합니다.
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div>
                        <span className="font-bold text-[#007680] block text-xs">⏱️ 기간 단축</span>
                        <span className="text-slate-500 text-[9px]">전체 교정 3~6개월 절약</span>
                      </div>
                      <div className="border-x border-slate-200">
                        <span className="font-bold text-[#007680] block text-xs">🛡️ 통증 최소화</span>
                        <span className="text-slate-500 text-[9px]">마찰력 획기적 저감</span>
                      </div>
                      <div>
                        <span className="font-bold text-[#007680] block text-xs">✨ 뛰어난 심미성</span>
                        <span className="text-slate-500 text-[9px]">치아색 반투명 세라믹</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Interactive Self-Ligation Simulator */}
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 text-left">
                    <div className="space-y-3">
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-slate-200">
                        자가결찰 시스템 (Self-Ligation) 원리
                      </span>
                      <h4 className="text-lg font-bold text-slate-800 leading-tight">
                        철사를 묶지 않고 뚜껑을 여닫는 혁신 메커니즘
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-light">
                        치아교정 장치에 와이어를 장착할 때 브라켓에 별도의 실철사를 감지 않고, <strong>브라켓 자체에 슬라이딩 형태의 클립식 뚜껑을 적용하여 철사를 고정하는 지능형 시스템</strong>입니다.
                      </p>
                    </div>

                    {/* Interactive Widget Box */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
                      {/* Interactive Selection Tab Buttons */}
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelfLigationStep('open')}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                            selfLigationStep === 'open'
                              ? 'bg-red-500 text-white border-red-500 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          1. 열린 덮개
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelfLigationStep('closed')}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                            selfLigationStep === 'closed'
                              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          2. 닫혀진 덮개
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelfLigationStep('reclosed')}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                            selfLigationStep === 'reclosed'
                              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          3. 초저마찰 작동
                        </button>
                      </div>

                      {/* Interactive Live Schematic Diagram Canvas */}
                      <div className="h-28 bg-white border border-slate-200 rounded-lg relative flex items-center justify-center overflow-hidden">
                        
                        {/* 1. Wire (runs horizontally) */}
                        <motion.div 
                          animate={{
                            y: selfLigationStep === 'reclosed' ? [0, -1, 1, 0] : 0
                          }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="h-1.5 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 w-full absolute z-10 shadow-sm"
                        />

                        {/* 2. Bracket Slot (the background grey box) */}
                        <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-lg flex flex-col items-center justify-between p-1 z-0">
                          <span className="text-[7px] text-slate-400 font-bold uppercase">BRACKET</span>
                          
                          {/* Slot gap */}
                          <div className="w-full h-4 bg-slate-200 border-y border-slate-300/80" />
                          
                          <div className="w-full h-1" />
                        </div>

                        {/* 3. Sliding Cap/Lid Cover */}
                        <motion.div 
                          initial={false}
                          animate={{
                            y: selfLigationStep === 'open' ? -22 : 0,
                            backgroundColor: selfLigationStep === 'open' ? '#f87171' : selfLigationStep === 'closed' ? '#fbbf24' : '#0d9488',
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          className="w-12 h-6 rounded-md border border-white/20 absolute z-20 shadow-md flex items-center justify-center text-[8px] font-extrabold text-white uppercase tracking-wider"
                        >
                          {selfLigationStep === 'open' ? 'OPENED' : selfLigationStep === 'closed' ? 'CLOSED' : 'LOCKED'}
                        </motion.div>

                        {/* Small decorative label for archwire */}
                        <span className="absolute bottom-1 right-2 text-[8px] text-slate-400 font-mono">Orthodontic Wire</span>
                      </div>

                      {/* Live Caption Text based on Interactive state */}
                      <div className="bg-slate-100 p-2.5 rounded-lg text-[10px] text-slate-600 leading-normal min-h-[48px]">
                        {selfLigationStep === 'open' && (
                          <p>
                            🔴 <strong>열린 슬라이딩 덮개:</strong> 실철사를 감을 필요 없이 덮개를 간편하게 슬라이딩하여 열고 와이어를 쉽게 안착시키는 개방 상태입니다. 통증이 일절 유발되지 않는 초기 와이어 교체 단계입니다.
                          </p>
                        )}
                        {selfLigationStep === 'closed' && (
                          <p>
                            🟡 <strong>닫혀진 고정 덮개:</strong> 브라켓 자체 클립을 닫아 철사를 구강 안쪽에서 부드럽게 감싼 상태입니다. 교정 장치 철사에 찔리거나 긁혀 생기는 잇몸 상처 및 입병 걱정이 완벽히 해소됩니다.
                          </p>
                        )}
                        {selfLigationStep === 'reclosed' && (
                          <p>
                            🟢 <strong>초저마찰 자가결찰 상태:</strong> 결찰 압력이 브라켓 자체 덮개 내부에서 분산되어, 철사와 브라켓 사이의 마찰력이 극도로 감소합니다. 치아가 불필요한 저항 없이 약한 힘으로도 최고 70% 덜 아프고 35% 이상 한층 빠르게 움직입니다.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* [NEW] Professional Medical Staff Introduction Section */}
            <section className="py-14 px-6 md:px-12 bg-white border-t border-slate-100 shrink-0">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Section Header */}
                <div className="text-center space-y-2">
                  <span className="text-[#007680] text-xs font-bold tracking-widest block uppercase">
                    CLINICAL EXPERTISE
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-slate-800">
                    신뢰를 드리는 전문 의료진 소개
                  </h3>
                  <div className="w-12 h-1 bg-[#007680] mx-auto rounded mt-3" />
                </div>

                {asIsStates.banner ? (
                  /* AS-IS: Missing/Dull text listing */
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 text-xs font-mono text-slate-500 leading-relaxed space-y-3">
                    <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-100 font-sans font-semibold">
                      ⚠️ 기존 홈페이지 의료진 소개 부재 리스크:
                    </div>
                    <p className="pl-1">
                      실제 약속드림치과에는 장영은, 송준화, 박정은, 김경주 4인의 각 분과별 숙련된 원장단이 상주하고 있으나, 기존 사이트에서는 의료진 소개 페이지 자체가 아예 없거나 핵심 약력, 면허 정보가 완전히 누락되어 있었습니다. 이로 인해 처음 방문한 환자들이 의료진을 신뢰하고 임플란트 등의 정밀 수술을 안심하고 결정하기 매우 어려웠습니다.
                    </p>
                    <p className="pl-1 border-t border-slate-100 pt-2 font-bold text-slate-700">
                      [기존 표기 사항]: 의료진 소개 부재로 인한 내원 전 신뢰 검증 불가 리스크 존재.
                    </p>
                  </div>
                ) : (
                  /* TO-BE: Stunning high-end Profile Design */
                  <div className="space-y-6">
                    {/* Doctor Selection Tabs */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {CLINIC_DOCTORS.map((doc) => {
                        const isActive = doc.id === activeDoctorId;
                        return (
                          <button
                            key={doc.id}
                            onClick={() => setActiveDoctorId(doc.id)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                              isActive
                                ? 'bg-teal-50/60 border-[#007680] shadow-sm'
                                : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shrink-0 ${
                              isActive 
                                ? 'border-[#007680] bg-teal-100 text-[#007680] scale-105 shadow-sm' 
                                : 'border-slate-200 bg-slate-100 text-slate-400'
                            }`}>
                              <User className="w-5 h-5 stroke-[2]" />
                            </div>
                            <div className="truncate">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-slate-800">{doc.name}</span>
                                <span className="text-[10px] text-slate-500">{doc.title}</span>
                              </div>
                              <span className="text-[9px] text-slate-400 block truncate font-medium">
                                {doc.badges[0]}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Active Doctor Showcase Card */}
                    {(() => {
                      const activeDoctor = CLINIC_DOCTORS.find(d => d.id === activeDoctorId) || CLINIC_DOCTORS[0];
                      return (
                        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden grid md:grid-cols-12 gap-0">
                          {/* Doctor Image Column - Now with a clean placeholder icon */}
                          <div className="md:col-span-5 relative min-h-[260px] md:min-h-full bg-gradient-to-b from-slate-50 to-slate-100/50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100">
                            <div className="w-20 h-20 rounded-full bg-teal-50/80 border-2 border-teal-100 flex items-center justify-center shadow-inner text-[#007680] mb-3">
                              <User className="w-10 h-10 stroke-[1.5]" />
                            </div>
                            <h5 className="text-base font-bold text-slate-800">{activeDoctor.name} {activeDoctor.title}</h5>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{activeDoctor.badges[0]}</p>
                            
                            {/* Subtle graphic accent */}
                            <div className="absolute top-3 left-3 flex gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500/40"></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-teal-500/20"></span>
                            </div>
                          </div>

                          {/* Doctor Details Column */}
                          <div className="md:col-span-7 p-6 md:p-8 space-y-5 flex flex-col justify-between bg-white">
                            <div className="space-y-4">
                              <div className="hidden md:block space-y-1.5">
                                <span className="bg-teal-50 text-[#007680] text-[10px] font-bold px-3 py-1 rounded-full border border-teal-100/60">
                                  {activeDoctor.subtitle}
                                </span>
                                <h4 className="text-2xl font-serif font-bold text-slate-800 pt-1">
                                  {activeDoctor.name} <span className="text-sm font-sans font-normal text-slate-500">{activeDoctor.title}</span>
                                </h4>
                              </div>

                              {/* Signature Quote */}
                              <div className="border-l-4 border-[#007680] pl-4 py-1.5 italic bg-slate-50/50 pr-2 rounded-r-xl">
                                <p className="text-xs md:text-sm text-slate-700 font-serif leading-relaxed font-medium">
                                  "{activeDoctor.quote}"
                                </p>
                              </div>

                              {/* Credentials List */}
                              <div className="space-y-2 pt-1">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">주요 약력 및 학회 활동</span>
                                <div className="grid grid-cols-1 gap-y-1.5 text-xs text-slate-600">
                                  {activeDoctor.credentials.map((cred, idx) => (
                                    <div key={idx} className="flex items-start gap-1.5">
                                      <span className="text-[#007680] mt-0.5 font-bold">✓</span>
                                      <span className="leading-normal">{cred}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Verification / Quality Badges */}
                            <div className="border-t border-slate-100 pt-4 flex flex-wrap gap-1.5 items-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">전문 자격:</span>
                              {activeDoctor.badges.map((badge, idx) => (
                                <span key={idx} className="bg-slate-50 text-slate-600 text-[10px] px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </section>

            {/* 5. Information Section: Hours and Location */}
            <section 
              ref={sectionRefs.hours}
              className={`py-12 px-6 md:px-12 bg-slate-50 border-t border-slate-100 transition-all duration-300 shrink-0 ${
                highlightItem === 'hours' ? 'ring-4 ring-yellow-400 bg-yellow-100/20' : ''
              }`}
            >
              <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <span className="text-[#007680] text-xs font-bold uppercase tracking-wider">VISITING GUIDE</span>
                    <h3 className="text-2xl font-serif font-bold text-slate-800">진료 안내 및 찾아오시는 길</h3>
                  </div>
                  {asIsStates.hours && (
                    <span className="text-[10px] text-red-500 font-mono bg-red-50 px-2 py-1 rounded border border-red-200">
                      [As-Is: 해독이 불가능한 텍스트 나열 형태]
                    </span>
                  )}
                </div>

                {asIsStates.hours ? (
                  /* AS-IS: Cramped, hard-to-read monotonic plain text listings */
                  <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 leading-loose space-y-4">
                    <div className="p-3 bg-slate-100 rounded text-[11px] border border-slate-200">
                      <strong>⚠️ 기존 사이트 진료 정보 표시 상황:</strong> 줄바꿈이 거의 없고, 시각적 계층이 없어 필요한 정보를 찾아 읽기 극히 난해함.
                    </div>
                    <p>
                      [진료시간] 월요일과 수요일은 밤 8시 30분까지 야간진료를 시행하고 있으며, 화요일, 목요일, 금요일은 오전 9시 30분부터 오후 6시 30분까지 정상 진료합니다. 토요일은 점심시간 없이 오전 9시 30분부터 오후 1시 30분까지 오시면 진료받으실 수 있습니다. 공휴일과 일요일은 쉬며, 평일 점심시간은 오후 12시 30분부터 2시까지이니 착오 없으시길 바랍니다. [오시는길 및 주차] 14001 경기도 안양시 만안구 안양로 293 (안양동) 2층 안양중앙시장 1번입구 바로 옆에 자리 잡고 있습니다. 전철로 오실 때는 안양역 1호선 1번 출구를 이용하시면 편리합니다. 주차는 안양중앙시장 공영 주차장(만안구 냉천로 203번길 15) 또는 삼덕공원 지하 공영 주차장(삼덕로 106)을 이용하시면 병원에서 무료 주차 등록 및 지원을 해 드립니다.
                    </p>
                  </div>
                ) : (
                  /* TO-BE: High-contrast organized visual Grid layout with infographics and expandable elements */
                  <div className="grid md:grid-cols-2 gap-6">
                    
                    {/* Grid Card 1: Clinic Hours Table */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                        <div className="p-1.5 bg-teal-50 rounded-lg text-[#007680]">
                          <Clock className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">진료시간 안내</h4>
                          <p className="text-[10px] text-slate-400">월요일 · 수요일 야간 진료 시행</p>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {/* Weekly Table */}
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">평일 (화·목·금)</span>
                          <span className="font-semibold text-slate-800">09:30 ~ 18:30</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 px-2 bg-teal-50 rounded-lg border border-teal-100/50">
                          <span className="text-[#007680] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                            월요일 · 수요일 (야간진료)
                          </span>
                          <span className="font-bold text-[#007680]">09:30 ~ 20:30</span>
                        </div>
                        <div className="flex justify-between items-center py-1">
                          <span className="text-slate-500">토요일 (점심시간 없음)</span>
                          <span className="font-semibold text-slate-800">09:30 ~ 13:30</span>
                        </div>
                        <div className="flex justify-between items-center py-1 text-slate-400">
                          <span>평일 점심 시간</span>
                          <span>12:30 ~ 14:00</span>
                        </div>
                        <div className="flex justify-between items-center py-1.5 border-t border-slate-100 text-xs">
                          <span className="text-red-500 font-medium">일요일 · 공휴일</span>
                          <span className="text-red-500 font-bold">휴진</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 leading-relaxed flex gap-2">
                        <span className="text-teal-600 shrink-0">💡</span>
                        <span>바쁘신 직장인분들도 안심하고 방문하실 수 있도록 <strong>매주 월요일과 수요일은 밤 8시 30분까지</strong> 야간 진료를 운영하고 있습니다.</span>
                      </div>
                    </div>

                    {/* Grid Card 2: Transport & Parking Cards */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                          <div className="p-1.5 bg-teal-50 rounded-lg text-[#007680]">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">오시는 길</h4>
                            <p className="text-[10px] text-slate-400">안양중앙시장 1번 입구 바로 옆 2층</p>
                          </div>
                        </div>

                        {/* Location Details */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <span className="text-[10px] text-slate-400 block">도로명 주소</span>
                            <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                              14001 경기도 안양시 만안구 안양로 293 (안양동) 2층
                            </p>
                          </div>

                          {/* Transit Cards */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                              <span className="font-bold text-slate-800 flex items-center gap-1">
                                <Train className="w-3.5 h-3.5 text-blue-600" />
                                지하철 이용시
                              </span>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                <strong>1호선 안양역</strong> 1번 출구 도보 약 10분 (중앙시장 방면 직진, 1번 입구 옆 2층)
                              </p>
                            </div>

                            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                              <span className="font-bold text-slate-800 flex items-center gap-1">
                                <Bus className="w-3.5 h-3.5 text-green-600" />
                                버스 이용시
                              </span>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                <strong>안양중앙시장.안양일번가</strong> 정류장 하차 후 도보 2분<br />
                                일반 버스: 1, 2, 3, 5, 6, 8, 9, 88번 등 다수 노선
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expandable Parking Widget (Marketing Detail) */}
                      <div className="border border-slate-100 rounded-xl overflow-hidden mt-2">
                        <button
                          onClick={() => setIsParkingExpanded(!isParkingExpanded)}
                          className="w-full flex justify-between items-center p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Car className="w-4 h-4 text-teal-600" />
                            자가용 및 무료 공영 주차장 안내
                          </span>
                          {isParkingExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        <AnimatePresence>
                          {isParkingExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="bg-white px-3.5 py-3 border-t border-slate-100 text-[11px] text-slate-600 space-y-2 leading-relaxed"
                            >
                              <p>🅿️ <strong>중앙시장 공영 주차장:</strong> <br />경기도 안양시 만안구 냉천로 203번길 15</p>
                              <p>🅿️ <strong>삼덕공원 공영 주차장:</strong> <br />경기도 안양시 만안구 삼덕로 106 <span className="text-red-500 font-semibold">(★지하 주차장만 등록 및 무료 지원 가능)</span></p>
                              <p className="pt-1.5 border-t border-dashed border-slate-100">📋 <strong>주차 시간 지원:</strong> 내원 진료 시간만큼 100% 무료 주차 정리를 지원합니다. 수납 시 원내 인포데스크에 차량번호를 반드시 말씀해 주세요.</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>

                  </div>
                )}
              </div>
            </section>

            {/* 6. Live Submissions Tracker (to show interactive mechanics are working) */}
            <section className="py-8 px-6 md:px-12 bg-slate-100 border-t border-b border-slate-200 shrink-0">
              <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    실시간 빠른 상담 등록 현황
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    신청된 상담 내역은 보안 상태(HTTPS 등) 및 개인정보 처리 기준에 따라 안전하게 접수 기록에 저장됩니다.
                  </p>
                </div>

                <div className="flex gap-2">
                  <div className="bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-200 shadow-sm text-center">
                    <span className="text-slate-400 text-[10px] block font-medium">누적 상담 신청</span>
                    <span className="font-bold text-[#007680]">{consultations.length + 124}건</span>
                  </div>
                  <div className="bg-white px-3 py-1.5 rounded-lg text-xs border border-slate-200 shadow-sm text-center">
                    <span className="text-slate-400 text-[10px] block font-medium">보안 전송 처리</span>
                    <span className="font-bold text-emerald-600">
                      {consultations.filter(c => c.isSecure).length + 124}건
                    </span>
                  </div>
                </div>
              </div>

              {/* Collapsed Submission logs table */}
              {consultations.length > 0 && (
                <div className="max-w-4xl mx-auto mt-4 bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                  <div className="p-3 bg-slate-50 font-bold text-slate-700 border-b border-slate-200 flex justify-between items-center">
                    <span>최근 등록된 상담 리스트 (데모 저장됨)</span>
                    <button 
                      onClick={() => {
                        localStorage.removeItem('promise_dream_consultations');
                        setConsultations([]);
                      }}
                      className="text-[10px] text-red-500 font-semibold hover:underline"
                    >
                      목록 비우기
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {consultations.slice(0, 3).map((c) => (
                      <div key={c.id} className="p-3 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800">{c.name.charAt(0)}*송</span>
                          <span className="text-slate-400 mx-2">|</span>
                          <span className="text-slate-600">{c.phone.slice(0, 9)}****</span>
                          <span className="text-slate-400 mx-2">|</span>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{c.preferredTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{c.submittedAt}</span>
                          {c.isSecure ? (
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">🔒 HTTPS 보안</span>
                          ) : (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded">⚠️ HTTP 노출</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 7. Patient reviews to improve trust */}
            <section className="py-12 px-6 md:px-12 bg-white border-t border-slate-100 shrink-0">
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-1">
                  <span className="text-[#007680] text-xs font-bold uppercase tracking-wider block">REAL REVIEWS</span>
                  <h3 className="text-xl font-serif font-bold text-slate-800">환자분들이 자필로 작성해주신 솔직 후기</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {CLINIC_REVIEWS.map((review) => (
                    <div key={review.id} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-bold text-[#007680] bg-teal-50 px-2 py-0.5 rounded">
                          {review.treatment}
                        </span>
                        <div className="flex text-yellow-400 text-xs">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-light italic">
                        "{review.content}"
                      </p>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                        <span className="font-semibold text-slate-600">{review.author}</span>
                        <span>{review.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* B. Dental Footer */}
            <footer className="bg-slate-950 text-slate-500 py-10 px-6 md:px-12 text-xs border-t border-slate-900 shrink-0">
              <div className="max-w-4xl mx-auto space-y-6">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-400">약속드림치과의원</p>
                    <p className="text-[11px]">대표원장: (보건복지부 인증 구강악안면외과 전문의) | 사업자번호: 120-11-23456</p>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="hover:text-slate-300 font-semibold cursor-pointer"
                    >
                      개인정보처리방침
                    </button>
                    <span className="text-slate-800">|</span>
                    <span className="text-slate-600">의료법 준수 사항 고지</span>
                  </div>
                </div>

                <div className="h-px bg-slate-900" />

                <div className="text-[10px] space-y-1 leading-relaxed">
                  <p>의료광고 고지: 본 웹사이트의 모든 시술 데이터(누적 35,000건 등)는 2026년 7월 자사 내부 임상 전산 기록 통계를 바탕으로 하며, 환자의 상태에 따라 임플란트 치료 기간 및 뼈이식 결과는 달라질 수 있으며 감염, 신경 손상 등의 부작용이 발생할 수 있으므로 반드시 의료진과 상세 상담을 받으셔야 합니다.</p>
                  <p className="text-slate-600">© 2026 Promise Dream Dental. All Rights Reserved. Coordinated by SolidWeb.</p>
                </div>

              </div>
            </footer>

            {/* 플로팅 바 높이만큼 어두운 여백 — 스크롤 끝 흰 갭 제거 */}
            <div
              className="bg-slate-950 shrink-0 w-full"
              style={{ height: floatBarHeight }}
              aria-hidden
            />

            </div>{/* end scrollRef */}
          </div>
          )}

          {/* TO-BE: Dual Naver Floating Action Buttons (Inquiry & Reservation) */}
          {!showLiveAsIs && !asIsStates.floating && (
            <div className="absolute right-3 sm:right-6 bottom-[7.5rem] sm:bottom-28 md:bottom-24 z-45 flex flex-col gap-2.5 sm:gap-3 items-end pointer-events-auto">
              {/* Naver Inquiry Button */}
              <div className="group flex items-center gap-2">
                <span className="hidden sm:inline bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold py-1 px-2.5 rounded-lg border border-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-1 whitespace-nowrap">
                  네이버 1:1 상담/문의
                </span>
                <button
                  onClick={() => alert('네이버 톡톡 1:1 문의 연동이 호출되었습니다! (실제 운영시 네이버 톡톡 주소로 리다이렉트 처리됩니다.)')}
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/20 hover:bg-emerald-500 cursor-pointer"
                  title="네이버 톡톡 문의"
                >
                  <MessageSquare className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Naver Reservation Button */}
              <div className="group flex items-center gap-2">
                <span className="hidden sm:inline bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold py-1 px-2.5 rounded-lg border border-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform translate-x-1 whitespace-nowrap">
                  네이버 간편 실시간 예약
                </span>
                <button
                  onClick={() => setShowNaverModal(true)}
                  className="w-11 h-11 sm:w-12 sm:h-12 bg-[#2DB400] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/20 hover:bg-[#259b00] glow-teal cursor-pointer"
                  title="네이버 실시간 예약"
                >
                  <CalendarCheck className="w-5 h-5 text-white animate-bounce-subtle" />
                </button>
              </div>
            </div>
          )}

          {/* Persistent Bottom Floating Reservation Bar — To-Be 전용 */}
          {!showLiveAsIs && (
          <div
            ref={(el) => {
              floatBarRef.current = el;
              (sectionRefs.form as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            className={`absolute bottom-0 left-0 right-0 z-40 px-2.5 sm:px-4 md:px-6 py-3 sm:py-5 shadow-2xl animate-slide-up transition-all duration-300 flex items-center justify-center ${
              asIsStates.form
                ? 'bg-[#1a2332] border-t border-slate-700'
                : 'bg-slate-950/95 backdrop-blur-md border-t border-teal-500/20'
            } ${highlightItem === 'form' ? 'ring-4 ring-yellow-400 ring-inset' : ''}`}
          >
              {submitSuccess ? (
                <div className="flex items-center justify-center w-full max-w-4xl gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-xs md:text-sm font-bold text-emerald-400">
                      실시간 상담 예약이 접수되었습니다! 전용 상담실장이 곧 기재해주신 연락처로 연락드립니다.
                    </p>
                  </div>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs text-slate-400 hover:text-white font-semibold cursor-pointer underline bg-transparent border-0 shrink-0"
                  >
                    다시 신청하기
                  </button>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-center gap-3 sm:gap-5 lg:gap-8 xl:gap-10 w-full max-w-6xl mx-auto">
                  {/* Left: 퀵 상담 카피 + 전화번호 */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 ${
                      asIsStates.form ? 'bg-sky-500/20 text-sky-300' : 'bg-[#007680]/20 text-teal-400 border border-teal-500/20'
                    }`}>
                      <Headset className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="text-left space-y-0.5 min-w-0">
                      <h4 className="text-[11px] sm:text-xs md:text-sm font-bold text-white flex items-center gap-1.5">
                        실시간 1초 퀵 상담 예약 신청
                        {!asIsStates.form && (
                          <span className="hidden md:inline-flex bg-emerald-500/10 text-emerald-400 text-[9px] px-2 py-0.5 rounded border border-emerald-500/20">🔒 보안인증</span>
                        )}
                      </h4>
                      <p className="hidden sm:block text-[10px] text-slate-400">성함과 번호만 남기시면 전담실장이 직접 연락드립니다.</p>
                      <a
                        href="tel:031-360-2879"
                        className="inline-block text-base sm:text-lg md:text-xl font-bold text-white tracking-tight hover:text-teal-300 transition-colors"
                      >
                        031-360-2879
                      </a>
                    </div>
                  </div>

                  {/* Right: consultation form */}
                  <form
                    onSubmit={asIsStates.form
                      ? (e) => {
                          e.preventDefault();
                          alert('As-Is 문제: 기존 사이트의 빠른상담 신청하기 버튼이 동작하지 않아 접수가 완료되지 않습니다.');
                        }
                      : handleSubmitConsultation
                    }
                    className="w-full lg:w-auto shrink-0 flex flex-col items-stretch sm:items-center gap-2"
                  >
                    {asIsStates.form && (
                      <p className="text-[10px] text-red-300 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        기존 사이트 신청 버튼 미동작 — 눌러도 접수가 되지 않습니다
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-start sm:justify-center gap-1.5 md:gap-2">
                      <input
                        type="text"
                        placeholder="성함"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className={`w-[calc(50%-0.25rem)] sm:w-[88px] md:w-28 px-2.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none ${
                          asIsStates.form
                            ? 'bg-transparent border border-white/40'
                            : 'bg-slate-900 border border-slate-700 rounded-lg focus:border-[#007680]'
                        }`}
                      />
                      <input
                        type="tel"
                        placeholder="010-1234-5678"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className={`w-[calc(50%-0.25rem)] sm:w-[140px] md:w-40 px-2.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none ${
                          asIsStates.form
                            ? 'bg-transparent border border-white/40'
                            : 'bg-slate-900 border border-slate-700 rounded-lg focus:border-[#007680]'
                        }`}
                      />
                      <select
                        value={formData.treatment}
                        onChange={(e) => setFormData(prev => ({ ...prev, treatment: e.target.value }))}
                        className={`w-[calc(50%-0.25rem)] sm:min-w-[96px] sm:w-28 px-2 py-2 text-xs text-white focus:outline-none ${
                          asIsStates.form
                            ? 'bg-transparent border border-white/40'
                            : 'bg-slate-900 border border-slate-700 rounded-lg focus:border-[#007680]'
                        }`}
                      >
                        {TREATMENT_OPTIONS.map((t) => (
                          <option key={t} value={t} className="text-slate-900">{t}</option>
                        ))}
                      </select>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                        className={`w-[calc(50%-0.25rem)] sm:min-w-[120px] sm:w-36 px-2 py-2 text-xs text-white focus:outline-none ${
                          asIsStates.form
                            ? 'bg-transparent border border-white/40'
                            : 'bg-slate-900 border border-slate-700 rounded-lg focus:border-[#007680]'
                        }`}
                      >
                        {CONSULT_TIME_OPTIONS.map((t) => (
                          <option key={t} value={t} className="text-slate-900">{t}</option>
                        ))}
                      </select>

                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-white/90 select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={formData.agreePrivacy}
                          onChange={(e) => setFormData(prev => ({ ...prev, agreePrivacy: e.target.checked }))}
                          className={`cursor-pointer rounded ${asIsStates.form ? 'accent-sky-400' : 'accent-[#007680]'}`}
                        />
                        <span>개인정보활용 동의</span>
                        {!asIsStates.form && (
                          <button
                            type="button"
                            onClick={() => setShowPrivacyModal(true)}
                            className="text-teal-400 underline text-[10px] font-semibold cursor-pointer bg-transparent border-0 p-0"
                          >
                            약관
                          </button>
                        )}
                      </label>

                      <button
                        type="submit"
                        disabled={!asIsStates.form && isSubmitting}
                        className={`w-full sm:w-auto shrink-0 px-4 py-2.5 sm:py-2 text-xs font-bold transition-all relative whitespace-nowrap ${
                          asIsStates.form
                            ? 'bg-[#7CFC00] text-black cursor-not-allowed opacity-90'
                            : 'bg-[#007680] hover:bg-[#0098a6] text-white rounded-lg cursor-pointer shadow-md shadow-[#007680]/20 disabled:bg-slate-800'
                        }`}
                        title={asIsStates.form ? '기존 사이트에서는 신청 버튼이 동작하지 않습니다' : undefined}
                      >
                        {asIsStates.form ? (
                          <>
                            빠른상담 신청하기
                            <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">미동작</span>
                          </>
                        ) : isSubmitting ? (
                          <span className="inline-flex items-center gap-1.5 justify-center">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            접수중...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 justify-center">
                            <Send className="w-3.5 h-3.5" />
                            빠른상담 신청하기
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
          </div>
          )}

        </div>
      </div>

      {/* --- C. MODALS AND POPUPS --- */}

      {/* 1. Compliant Legal Privacy Policy Modal (To-Be compliance) */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrivacyModal(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg bg-white text-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[80vh] flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#007680]" />
                  개인정보 처리 및 수집 방침 (법적 의무 사항)
                </h4>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Legal Text body */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3.5 text-[11px] text-slate-600 leading-relaxed font-sans">
                <p>약속드림치과의원(이하 '병원')은 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.</p>
                
                <div>
                  <h5 className="font-bold text-slate-800 mb-1">1. 수집하는 개인정보 항목</h5>
                  <p>병원은 홈페이지 빠른 상담 신청 및 예약 서비스 제공을 위해 아래와 같은 최소한의 개인정보를 수집하고 있습니다.</p>
                  <ul className="list-disc pl-4 mt-1 space-y-1">
                    <li>필수 항목: 환자 성함, 연락처(휴대전화번호), 연락 희망 시간대</li>
                    <li>선택 항목: 증상 내용 및 문의사항</li>
                  </ul>
                </div>

                <div>
                  <h5 className="font-bold text-slate-800 mb-1">2. 개인정보의 수집 및 이용 목적</h5>
                  <p>수집된 개인정보는 임플란트 치료 상담 진행, 전화 예약 일정 확정 및 병원의 각종 진료 안내 등 업무에만 활용됩니다.</p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-800 mb-1">3. 개인정보의 보유 및 이용 기간</h5>
                  <p className="font-bold text-slate-800">병원은 상담 목적이 달성된 시점(상담 통화 완료 후 일정 등록 완료시) 또는 정보 주체의 파기 요구 시 수집된 정보를 지체 없이 복구 불가능한 방법으로 완전 파기합니다.</p>
                  <p className="mt-1 text-slate-500">최대 보존 기간: 상담 완료 후 1년 이내 (의료 관계 법령 등에 따른 별도 보존 기간 제외)</p>
                </div>

                <div>
                  <h5 className="font-bold text-slate-800 mb-1">4. 동의 거부 권리 및 불이익</h5>
                  <p>귀하는 개인정보 수집에 동의하지 않을 권리가 있으나, 거부 시 빠른 상담 신청 접수가 제한될 수 있습니다.</p>
                </div>
              </div>

              {/* Close Button */}
              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, agreePrivacy: true }));
                    setShowPrivacyModal(false);
                  }}
                  className="px-4 py-2 bg-[#007680] hover:bg-[#005a62] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  내용 확인 및 동의 완료
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Naver Appointment Scheduling Popover Mock (To-Be FAB integration) */}
      <AnimatePresence>
        {showNaverModal && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNaverModal(false)}
              className="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Naver Brand Header */}
              <div className="bg-[#2DB400] text-white px-5 py-4 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif font-extrabold text-lg">N</span>
                  <div className="h-4 w-px bg-white/30 mx-1" />
                  <span className="text-xs font-bold">약속드림치과 네이버 예약</span>
                </div>
                <button
                  onClick={() => setShowNaverModal(false)}
                  className="text-white hover:text-slate-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Booking Screen Body */}
              <div className="p-5 space-y-4">
                <div className="text-center py-2">
                  <p className="text-xs text-slate-400">NAVER GREEN SYSTEM</p>
                  <h4 className="text-sm font-bold text-slate-800">네이버 회원 1초 간편 예약 연동</h4>
                  <p className="text-[11px] text-slate-500 mt-1">별도의 회원가입 없이 네이버 아이디로 진료 예약을 신청합니다.</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>원장:</span>
                    <strong className="text-slate-800">대표원장 직접 진료 (임플란트)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>연동 상태:</span>
                    <strong className="text-emerald-600">정상 연동 활성화 (Ready)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>예약 가능일:</span>
                    <strong className="text-slate-800">오늘 이후 즉시 접수 가능</strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert('네이버 간편예약 모듈이 호출되었습니다! (실제 운영시 네이버 예약 계정으로 리다이렉트 처리됩니다.)');
                    setShowNaverModal(false);
                  }}
                  className="w-full py-3 bg-[#2DB400] hover:bg-[#259b00] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-[#2DB400]/15"
                >
                  <CalendarCheck className="w-4 h-4" />
                  네이버 아이디로 빠른 예약 신청하기
                </button>
              </div>

              <div className="bg-slate-50 p-3.5 border-t border-slate-100 text-center">
                <button
                  onClick={() => setShowNaverModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-[11px] font-semibold cursor-pointer"
                >
                  돌아가기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

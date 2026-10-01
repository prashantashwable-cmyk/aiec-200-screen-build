import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { applyLanguage } from '@/i18n';
import { useData } from '@/data/DataProvider';
import type { RecruitmentInterestResult, RecruitmentLandingView } from '@/data/repository';
import { ONBOARDING_PATH, seedOnboardingDraft } from '@/features/onboarding/handoff';
import { GUIDE, guideComplete, interestProblem, isMobile, normalisePhone, parseSource, suggestRole } from '@/features/recruitment/interest';
import type { GuideAnswers, InterestRole, RecruitRole, RecruitSource } from '@/features/recruitment/interest';
import { DRAFT_KEY, SOURCE_KEY } from './recruitment.types';
import type { LandingStatus } from './recruitment.types';

export interface Draft {
  name: string;
  phone: string;
  roles: InterestRole[];
  consent: boolean;
}
const EMPTY: Draft = { name: '', phone: '', roles: [], consent: false };

function readDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Draft>) } : null;
  } catch {
    return null;
  }
}

/** The link the person arrived by is read once and remembered for the visit, so moving around the page never loses where they came from. */
function readSource(search: string): RecruitSource {
  const fresh = parseSource(search);
  try {
    if (/[?&](src|c|ref)=/.test(search)) {
      sessionStorage.setItem(SOURCE_KEY, JSON.stringify(fresh));
      return fresh;
    }
    const kept = sessionStorage.getItem(SOURCE_KEY);
    return kept ? (JSON.parse(kept) as RecruitSource) : fresh;
  } catch {
    return fresh;
  }
}

export type RecruitmentState = ReturnType<typeof useRecruitment>;

/**
 * Screen 141. The public front door: a first step of name, phone and the role(s) the person is curious about, then the onboarding wizard for
 * that role (the wizards stay the one place partner data is collected). Where the person came from is captured with the interest.
 */
export function useRecruitment() {
  const repository = useData();
  const navigate = useNavigate();
  const [view, setView] = useState<RecruitmentLandingView | null>(null);
  const [status, setStatus] = useState<LandingStatus>('loading');
  const source = useMemo(() => readSource(window.location.search), []);
  const [draft, setDraftState] = useState<Draft>(() => readDraft() ?? EMPTY);
  const [restored] = useState<boolean>(() => !!readDraft());
  const [answers, setAnswers] = useState<GuideAnswers>({});
  const [result, setResult] = useState<RecruitmentInterestResult | null>(null);
  const [who, setWho] = useState<{ name: string; phone: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setView(await repository.getRecruitmentLanding());
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [repository]);
  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    try {
      if (JSON.stringify(draft) === JSON.stringify(EMPTY)) localStorage.removeItem(DRAFT_KEY);
      else localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {
      // Not kept.
    }
  }, [draft]);

  const phoneOk = isMobile(draft.phone);
  const valid = interestProblem(draft) === null;
  const suggestion: RecruitRole | null = guideComplete(answers) ? suggestRole(answers) : null;

  return {
    status,
    view,
    reload: () => void load(),
    source,
    draft,
    restored,
    setDraft: (patch: Partial<Draft>) => setDraftState((d) => ({ ...d, ...patch })),
    toggleRole: (role: InterestRole) =>
      setDraftState((d) => {
        // "Not sure yet" stands alone: it is a way of not choosing, never mixed with a choice.
        if (role === 'undecided') return { ...d, roles: d.roles.includes('undecided') ? [] : ['undecided'] };
        const rest = d.roles.filter((r) => r !== 'undecided');
        return { ...d, roles: rest.includes(role) ? rest.filter((r) => r !== role) : [...rest, role] };
      }),
    phoneOk,
    valid,
    answers,
    answer: (id: (typeof GUIDE)[number]['id'], option: string) => setAnswers((a) => ({ ...a, [id]: option })),
    resetGuide: () => setAnswers({}),
    suggestion,
    result,
    who,
    busy,
    problem,
    setLanguage: applyLanguage,
    submit: async () => {
      if (!navigator.onLine) return setProblem('offline');
      setBusy(true);
      setProblem(null);
      try {
        const guided = draft.roles.includes('undecided') || guideComplete(answers) ? { answers, suggested: suggestRole(answers) } : undefined;
        const lang = (document.documentElement.getAttribute('lang') as 'en' | 'hi' | 'mr') || 'en';
        setResult(await repository.submitRecruitmentInterest({ name: draft.name, phone: normalisePhone(draft.phone), roles: draft.roles, source, language: lang, consent: draft.consent, ...(guided ? { guided } : {}) }));
        setWho({ name: draft.name.trim(), phone: normalisePhone(draft.phone) });
        setDraftState(EMPTY);
      } catch (e) {
        setProblem(e instanceof Error ? e.message : 'generic');
      } finally {
        setBusy(false);
      }
    },
    /** Into the role's own onboarding wizard, with the name and phone already in it. */
    continueWith: async (role: RecruitRole, interestId: string, who: { name: string; phone: string }) => {
      seedOnboardingDraft(role, who);
      try {
        await repository.markRecruitmentStarted(interestId, who.phone);
      } catch {
        // The wizard still opens: starting is only a note for the recruiter.
      }
      navigate(ONBOARDING_PATH[role]);
    },
    another: () => {
      setResult(null);
      setWho(null);
    },
  };
}

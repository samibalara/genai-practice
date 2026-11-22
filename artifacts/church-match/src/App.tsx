import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, Router as WouterRouter, useLocation, useParams } from 'wouter';
import {
  ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, Church as ChurchIcon, CircleHelp, ExternalLink,
  Filter, HeartHandshake, Info, MapPin, Menu, Search, SlidersHorizontal, Sparkles,
  Users, X, CalendarDays, GitCompareArrows, Trash2,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  blankPreferences, beliefOptions, churches, communityOptions, denominationOptions,
  getChurchMatchState, hasMatchingAnswers, missionOptions, noMustHaveMatchesMessage, practicalOptions, scoreChurch,
  type Church, type Importance,
  type Preferences, type ProfileType, worshipOptions,
} from './data';
import newLifePhoto from '@assets/generated_images/church-new-life.jpg';
import gatheringPhoto from '@assets/generated_images/church-gathering.jpg';
import cityPhoto from '@assets/generated_images/church-city.jpg';
import vineyardPhoto from '@assets/generated_images/church-vineyard.jpg';
import gracePhoto from '@assets/generated_images/church-grace.jpg';
import cornerstonePhoto from '@assets/generated_images/church-cornerstone.jpg';
import stAndrewsPhoto from '@assets/generated_images/church-st-andrews.jpg';
import hopePhoto from '@assets/generated_images/church-hope.jpg';
import redeemerPhoto from '@assets/generated_images/church-redeemer.jpg';
import './index.css';

const queryClient = new QueryClient();
const churchPhotos: Record<string, string> = {
  'new-life': newLifePhoto,
  'the-gathering': gatheringPhoto,
  'city-church': cityPhoto,
  'vineyard-indy': vineyardPhoto,
  'grace-fellowship': gracePhoto,
  cornerstone: cornerstonePhoto,
  'st-andrews': stAndrewsPhoto,
  'hope-church': hopePhoto,
  redeemer: redeemerPhoto,
};
const homeExamples = [
  { churchId: 'new-life', score: 92, distance: '12 min away' },
  { churchId: 'the-gathering', score: 88, distance: '15 min away' },
  { churchId: 'city-church', score: 84, distance: '18 min away' },
];

function ChurchImage({ church, alt, className, loading = 'lazy' }: { church: Church; alt: string; className: string; loading?: 'eager' | 'lazy' }) {
  const [failed, setFailed] = useState(false);
  const src = churchPhotos[church.id];
  if (failed || !src) {
    return <div className={`church-image-fallback ${className}`} role="img" aria-label={`${church.name} photo unavailable`}>
      <ChurchIcon size={22} aria-hidden="true" />
      <span>{church.name}</span>
    </div>;
  }
  return <img className={className} src={src} alt={alt} loading={loading} onError={() => setFailed(true)} />;
}

function useStored<T>(key: string, initial: T): [T, (value: T | ((current: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) as T : initial;
    } catch { return initial; }
  });
  const update = (next: T | ((current: T) => T)) => {
    setValue((current) => {
      const resolved = typeof next === 'function' ? (next as (current: T) => T)(current) : next;
      localStorage.setItem(key, JSON.stringify(resolved));
      return resolved;
    });
  };
  return [value, update];
}

function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const links = [
    ['/explore', 'Explore'], ['/saved', 'Saved'], ['/how-it-works', 'How It Works'], ['/profile', 'My Profile'],
  ];
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="nav-inner">
          <Link href="/" className="brand" data-testid="link-brand" onClick={() => setOpen(false)}>
            <span className="brand-mark">g</span><span>gatherwell</span>
          </Link>
          <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Primary navigation">
            <Link href="/onboarding" className={`nav-link ${location === '/onboarding' ? 'active' : ''}`} data-testid="link-find-church" onClick={() => setOpen(false)}>Find a Church</Link>
            {links.map(([href, label]) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setOpen(false)}>{label}</Link>)}
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <Link href="/onboarding" className="nav-cta" data-testid="button-nav-find">Find My Church</Link>
            <button className="mobile-menu" onClick={() => setOpen((value) => !value)} aria-label="Open navigation" data-testid="button-mobile-menu">
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
      <main className="main-wrap">{children}</main>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return <div className="modal-backdrop" role="presentation" onClick={onClose}>
    <div className="modal fade-in" role="dialog" aria-modal="true" aria-labelledby="dialog-title" onClick={(event) => event.stopPropagation()}>
      <div className="modal-head"><h2 id="dialog-title" style={{ fontSize: '1.8rem', marginBottom: '.7rem' }}>{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Close dialog" data-testid="button-close-dialog"><X size={16} /></button></div>
      {children}
    </div>
  </div>;
}

function VerifyLink() {
  const [show, setShow] = useState(false);
  return <>
    <button className="mini-btn" onClick={() => setShow(true)} data-testid="button-how-verify"><CircleHelp size={14} /> How we verify information</button>
    {show && <Modal title="How we verify information" onClose={() => setShow(false)}>
      <p>Gatherwell is a discovery prototype, not a source of truth. Church-provided details come from a church’s own submitted profile. Platform verified means our team checked the detail against a public church source at the time of review. User reported details come from community submissions and may be out of date.</p>
      <p>Source labels show where a detail came from; they do not mean every detail has been verified. We encourage you to confirm beliefs, schedules, accessibility, and childcare with the church before visiting.</p>
      <button className="btn btn-primary" onClick={() => setShow(false)} data-testid="button-close-verify">Got it</button>
    </Modal>}
  </>;
}

function Landing() {
  return <div className="fade-in">
    <section className="hero">
      <div>
        <h1>Find a church that fits your life.</h1>
        <p className="hero-copy">Tell us what you're looking for. We'll help you discover churches that match your beliefs, community, and lifestyle.</p>
        <div className="hero-actions">
          <Link href="/onboarding" className="btn btn-primary" data-testid="button-find-my-church">Find My Church <ArrowRight size={16} /></Link>
          <Link href="/explore" className="btn btn-secondary" data-testid="button-explore-churches">Explore Churches</Link>
        </div>
        <p style={{ marginTop: '1.4rem', fontSize: '.76rem', color: 'hsl(var(--muted-foreground))' }}>Fictional Indianapolis-area demo data · no account required</p>
      </div>
      <div className="hero-art">
        <section className="surface match-preview" aria-label="Example church match cards" data-testid="preview-church-matches">
          <div className="match-preview-head"><div><span className="eyebrow">A sample of what you’ll see</span><h2>Church matches</h2></div><span className="match-preview-note">3 examples</span></div>
          <div className="hero-match-list">{homeExamples.map((example) => {
            const church = churches.find((item) => item.id === example.churchId)!;
            return <Link key={church.id} href={`/church/${church.id}`} className="hero-match-card" data-testid={`link-home-match-${church.id}`}>
              <ChurchImage key={church.id} church={church} className="hero-match-photo" alt={`Fictional example photo of ${church.name}`} loading="eager" />
              <span className="hero-match-copy"><strong>{church.name}</strong><small>{church.denomination} · {example.distance}</small></span>
              <span className="hero-match-score">{example.score}%<small>match</small></span>
            </Link>;
          })}</div>
          <p className="match-preview-footer">Example profiles · Your results reflect your preferences</p>
        </section>
      </div>
    </section>
    <section className="section" style={{ borderTop: '1px solid hsl(var(--border))' }}>
      <div className="section-head"><div><span className="eyebrow">More than a directory</span><h2>Finding a place to belong takes more than a map pin.</h2></div><p>We make the invisible parts of church life easier to compare: the Sunday rhythm, the people you might meet, and the ways a church shows up beyond its walls.</p></div>
      <div className="value-grid">
        <div className="value-card"><span className="value-number">01</span><h3>Start with what matters</h3><p>Share your preferences at your own pace. “I’m still figuring it out” is always a valid answer.</p></div>
        <div className="value-card"><span className="value-number">02</span><h3>See the full picture</h3><p>Matches include reasons and potential differences, so you can make an informed, human decision.</p></div>
        <div className="value-card featured"><span className="value-number">03</span><h3>Take the next small step</h3><p>Save a church, compare a few, or plan a visit. Gatherwell never chooses for you.</p><Link href="/how-it-works" className="mini-btn" data-testid="link-learn-method">Learn how it works <ArrowRight size={14} /></Link></div>
      </div>
    </section>
    <section className="section">
      <div className="section-head"><div><span className="eyebrow">A simple beginning</span><h2>Three steps, no pressure.</h2></div></div>
      <div className="steps">
        <div className="step"><span className="step-number">01 / TELL US</span><h3>Share your starting point</h3><p>Individual or couple, your city, your travel comfort, and the questions you’re carrying.</p></div>
        <div className="step"><span className="step-number">02 / NOTICE</span><h3>Explore your matches</h3><p>Read the “why” behind each score, plus potential differences that deserve a closer look.</p></div>
        <div className="step"><span className="step-number">03 / VISIT</span><h3>Choose your next step</h3><p>Save a few possibilities, compare them side by side, or plan a low-pressure first visit.</p></div>
      </div>
    </section>
    <section className="bottom-note"><div><span className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>Your pace, your call</span><h2 style={{ margin: '.5rem 0 0', color: 'hsl(var(--primary-foreground))' }}>A better beginning can be one honest question.</h2><p>There is no “right” church on paper. Get the information you need, then decide at your own pace.</p></div><Link href="/onboarding" className="btn btn-soft" data-testid="button-start-exploring">Start exploring <ArrowRight size={16} /></Link></section>
  </div>;
}

type StepProps = { prefs: Preferences; update: (patch: Partial<Preferences>) => void };
function ImportancePicker({ value, onChange }: { value: Importance; onChange: (value: Importance) => void }) {
  return <div className="choice-grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
    {[['must', 'Must have'], ['prefer', 'Prefer'], ['matter', 'Doesn’t matter'], ['figuring', 'Still figuring it out']].map(([key, label]) => <button key={key} className={`choice ${value === key ? 'selected' : ''}`} onClick={() => onChange(key as Importance)} data-testid={`button-importance-${key}`}><strong>{label}</strong></button>)}
  </div>;
}
function MultiChoice({ items, selected, onToggle }: { items: string[]; selected: string[]; onToggle: (item: string) => void }) {
  return <div className="choice-grid">{items.map((item) => <button key={item} className={`choice ${selected.includes(item) ? 'selected' : ''}`} onClick={() => onToggle(item)} data-testid={`button-option-${item.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}><span className="check-row"><span style={{ width: '1.1rem', height: '1.1rem', border: '1px solid currentColor', borderRadius: '.3rem', display: 'grid', placeItems: 'center', flex: '0 0 auto' }}>{selected.includes(item) && <Check size={13} />}</span><strong>{item}</strong></span></button>)}</div>;
}
function ImportanceList({ items, values, onChange }: { items: string[]; values: Record<string, Importance>; onChange: (key: string, value: Importance) => void }) {
  return <div style={{ display: 'grid', gap: '.65rem', margin: '1.6rem 0' }}>{items.map((item) => <div key={item} className="surface" style={{ padding: '.85rem 1rem', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center', gap: '.5rem' }}><strong style={{ fontSize: '.84rem' }}>{item}</strong><select className="select" style={{ width: 'auto', minWidth: '145px', padding: '.55rem .65rem' }} value={values[item] || 'matter'} onChange={(event) => onChange(item, event.target.value as Importance)} data-testid={`select-importance-${item.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}><option value="must">Must have</option><option value="prefer">Prefer</option><option value="matter">Doesn’t matter</option><option value="figuring">Still figuring it out</option></select></div>)}</div>;
}

function Onboarding() {
  const [, setLocation] = useLocation();
  const [savedPrefs, setSavedPrefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const [prefs, setPrefs] = useState<Preferences>(() => ({ ...blankPreferences, ...savedPrefs, beliefs: { ...blankPreferences.beliefs, ...savedPrefs.beliefs }, community: { ...blankPreferences.community, ...savedPrefs.community }, mission: { ...blankPreferences.mission, ...savedPrefs.mission }, practical: { ...blankPreferences.practical, ...savedPrefs.practical } }));
  const [showMore, setShowMore] = useState(false);
  const update = (patch: Partial<Preferences>) => setPrefs((current) => ({ ...current, ...patch }));
  const finish = () => { setSavedPrefs(prefs); setLocation('/results'); };
  return <div className="onboarding-shell fade-in">
    <section className="surface question-card">
      <span className="eyebrow">A few honest answers</span><h1>What matters most?</h1><p>Start with five quick preferences. You can add more detail if you want.</p>
      <div className="quick-preferences">
        <label className="quick-question">Denomination
          <select className="select" value={prefs.denomination} onChange={(event) => update({ denomination: event.target.value, denominationImportance: event.target.value ? 'prefer' : 'matter' })} data-testid="select-denomination"><option value="">I’m open to exploring</option>{denominationOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select>
          {prefs.denomination && <select className="select quick-importance" aria-label="Denomination importance" value={prefs.denominationImportance} onChange={(event) => update({ denominationImportance: event.target.value as Importance })} data-testid="select-denomination-importance"><option value="must">Must have</option><option value="prefer">Nice to have</option><option value="matter">Doesn’t matter</option></select>}
        </label>
        <label className="quick-question">Worship style
          <select className="select" value={prefs.worship[0] === 'Doesn’t matter' ? '' : prefs.worship[0] || ''} onChange={(event) => update({ worship: event.target.value ? [event.target.value] : ['Doesn’t matter'], worshipImportance: event.target.value ? 'prefer' : 'matter' })} data-testid="select-worship"><option value="">I’m open to any style</option>{worshipOptions.filter((item) => item !== 'Doesn’t matter').map((item) => <option key={item}>{item}</option>)}</select>
          {prefs.worship[0] !== 'Doesn’t matter' && <select className="select quick-importance" aria-label="Worship style importance" value={prefs.worshipImportance} onChange={(event) => update({ worshipImportance: event.target.value as Importance })} data-testid="select-worship-importance"><option value="must">Must have</option><option value="prefer">Nice to have</option><option value="matter">Doesn’t matter</option></select>}
        </label>
        <label className="quick-question">Distance
          <select className="select" value={prefs.travel} onChange={(event) => update({ travel: event.target.value })} data-testid="select-travel"><option value="5">Within 5 miles</option><option value="10">Within 10 miles</option><option value="15">Within 15 miles</option><option value="20">Within 20 miles</option><option value="30">30+ miles is okay</option></select>
        </label>
          <label className="quick-question">Language
          <select className="select" value={prefs.language} onChange={(event) => update({ language: event.target.value })} data-testid="select-language"><option value="">Any language</option><option value="English">English</option><option value="Spanish">Spanish</option></select>
          {prefs.language && <select className="select quick-importance" aria-label="Language importance" value={prefs.languageImportance} onChange={(event) => update({ languageImportance: event.target.value as Importance })} data-testid="select-language-importance"><option value="must">Must have</option><option value="prefer">Nice to have</option><option value="matter">Doesn’t matter</option></select>}
        </label>
        <label className="quick-question">Service time
          <select className="select" value={prefs.serviceTime} onChange={(event) => update({ serviceTime: event.target.value })} data-testid="select-service-time"><option value="">Any time</option><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Evening">Evening</option></select>
        </label>
      </div>
      <button className="mini-btn more-questions-toggle" aria-expanded={showMore} onClick={() => setShowMore((value) => !value)} data-testid="button-more-questions">{showMore ? 'Show fewer questions' : 'Answer more questions to refine my matches'} <ChevronDown size={15} /></button>
      {showMore && <div className="more-questions" data-testid="more-questions">
        <h2>More ways to refine your matches</h2>
        <div className="advanced-question"><strong>Your profile</strong><p>Choose who you’re exploring for and where you’re settling in.</p><div className="choice-grid"><button className={`choice ${prefs.profileType === 'individual' ? 'selected' : ''}`} onClick={() => update({ profileType: 'individual' })} data-testid="button-profile-individual"><strong>Just me</strong><small>I’m exploring for myself.</small></button><button className={`choice ${prefs.profileType === 'couple' ? 'selected' : ''}`} onClick={() => update({ profileType: 'couple' })} data-testid="button-profile-couple"><strong>Me and my spouse</strong><small>A shared profile for our household.</small></button></div><div className="quick-preferences"><label className="quick-question">City or neighborhood<input className="input" value={prefs.city} onChange={(event) => update({ city: event.target.value })} placeholder="Indianapolis" data-testid="input-city" /></label><label className="quick-question">ZIP (optional)<input className="input" value={prefs.zip} onChange={(event) => update({ zip: event.target.value })} placeholder="46202" data-testid="input-zip" /></label></div></div>
        <div className="advanced-question"><strong>Worship details</strong><p>Select more than one style if you’re open to different settings.</p><MultiChoice items={worshipOptions} selected={prefs.worship} onToggle={(item) => update({ worship: item === 'Doesn’t matter' ? ['Doesn’t matter'] : prefs.worship.includes(item) ? prefs.worship.filter((entry) => entry !== item) : [...prefs.worship.filter((entry) => entry !== 'Doesn’t matter'), item] })} /><div style={{ marginTop: '1rem' }}><ImportancePicker value={prefs.worshipImportance} onChange={(value) => update({ worshipImportance: value })} /></div></div>
        <div className="advanced-question"><strong>Additional denomination must-haves</strong><p>Every denomination selected here is required. Selecting two different denominations will produce no matches.</p><MultiChoice items={denominationOptions} selected={prefs.denominationMustHaves} onToggle={(item) => update({ denominationMustHaves: prefs.denominationMustHaves.includes(item) ? prefs.denominationMustHaves.filter((entry) => entry !== item) : [...prefs.denominationMustHaves, item] })} /></div>
        <div className="advanced-question"><strong>Beliefs and topics</strong><ImportanceList items={beliefOptions} values={prefs.beliefs} onChange={(key, value) => update({ beliefs: { ...prefs.beliefs, [key]: value } })} /></div>
        <div className="advanced-question"><strong>Community</strong><ImportanceList items={communityOptions} values={prefs.community} onChange={(key, value) => update({ community: { ...prefs.community, [key]: value } })} /></div>
        <div className="advanced-question"><strong>Mission and service</strong><ImportanceList items={missionOptions} values={prefs.mission} onChange={(key, value) => update({ mission: { ...prefs.mission, [key]: value } })} /></div>
        <div className="advanced-question"><strong>Church size and practical details</strong><label className="quick-question">Church size<select className="select" value={prefs.size} onChange={(event) => update({ size: event.target.value })} data-testid="select-size"><option>No preference</option><option>Small</option><option>Medium</option><option>Large</option><option>Megachurch</option></select></label><ImportanceList items={practicalOptions} values={prefs.practical} onChange={(key, value) => update({ practical: { ...prefs.practical, [key]: value } })} /></div>
        <div className="advanced-question"><strong>Anything else?</strong><p className="onboard-note">Optional context to help you read your matches.</p><textarea className="textarea" rows={4} value={prefs.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Anything else you’d like us to know?" data-testid="input-open-response" /></div>
      </div>}
      <div className="question-footer"><Link href="/" className="btn btn-secondary" data-testid="button-back"><ArrowLeft size={15} /> Back</Link><span className="onboard-note">You can change these anytime in My Profile.</span><button className="btn btn-primary" onClick={finish} data-testid="button-see-matches">See my matches <Sparkles size={15} /></button></div>
    </section>
  </div>;
}

function getPreferenceFit(church: Church, prefs: Preferences) {
  const details: { label: string; matched: boolean; priority: number }[] = [];
  const add = (label: string, matched: boolean, importance: Importance) => {
    if (importance === 'must' || importance === 'prefer') {
      details.push({ label, matched, priority: importance === 'must' ? 0 : 1 });
    }
  };
  if (prefs.denomination) add(prefs.denomination, church.denomination === prefs.denomination, prefs.denominationImportance);
  (prefs.denominationMustHaves ?? []).forEach((item) => add(`${item} denomination`, church.denomination === item, 'must'));
  if (prefs.language) add(`${prefs.language}-language service`, church.languages.includes(prefs.language), prefs.languageImportance);
  if (prefs.serviceTime) {
    const hasTime = church.serviceTimes.some((time) => {
      const match = time.match(/(\d{1,2})(?::\d{2})?\s*(AM|PM)/i);
      if (!match) return false;
      const hour = Number(match[1]);
      const hour24 = match[2].toUpperCase() === 'PM' && hour !== 12 ? hour + 12 : match[2].toUpperCase() === 'AM' && hour === 12 ? 0 : hour;
      return prefs.serviceTime === 'Morning' ? hour24 >= 5 && hour24 < 12
        : prefs.serviceTime === 'Afternoon' ? hour24 >= 12 && hour24 < 17
          : hour24 >= 17 && hour24 < 24;
    });
    details.push({ label: `${prefs.serviceTime} service`, matched: hasTime, priority: 2 });
  }
  Object.entries(prefs.beliefs).forEach(([item, importance]) => add(item, church.beliefs.includes(item), importance));
  prefs.worship.filter((item) => item !== 'Doesn’t matter').forEach((item) => {
    add(`${item} worship`, church.worship.includes(item), prefs.worshipImportance);
  });
  Object.entries(prefs.community).forEach(([item, importance]) => {
    add(item, [...church.community, ...church.youngAdults, ...church.youngMarried].includes(item), importance);
  });
  Object.entries(prefs.mission).forEach(([item, importance]) => add(`${item} mission`, church.mission.includes(item), importance));
  Object.entries(prefs.practical).forEach(([item, importance]) => add(item, church.practical.includes(item), importance));
  if (prefs.size && prefs.size !== 'No preference') {
    details.push({ label: `Size: ${prefs.size}`, matched: church.size === prefs.size, priority: 2 });
  }
  if (Number(prefs.travel)) {
    details.push({ label: `Within ${prefs.travel} miles`, matched: church.distance <= Number(prefs.travel), priority: 2 });
  }
  return details.sort((a, b) => a.priority - b.priority);
}

function ChurchCard({ church, prefs, saved, onSave, onDismiss, compare, onCompare }: { church: Church; prefs: Preferences; saved: boolean; onSave: () => void; onDismiss: () => void; compare: boolean; onCompare: () => void }) {
  const result = scoreChurch(church, prefs);
  const showScore = hasMatchingAnswers(prefs);
  const preferenceFit = getPreferenceFit(church, prefs);
  const visiblePreferenceFit = preferenceFit.slice(0, 5);
  return <article className="surface church-card fade-in" data-testid={`card-church-${church.id}`}>
    <Link href={`/church/${church.id}`} className="church-card-photo" data-testid={`link-church-photo-${church.id}`} aria-label={`View ${church.name} profile`}>
      <ChurchImage key={church.id} church={church} className="church-card-image" alt={`Fictional demo photo representing ${church.name}`} loading="eager" />
      <span className="photo-badge">Demo photo</span>
    </Link>
    <div className="church-top"><div><div className="church-name">{church.name}</div><div className="church-meta"><span>{church.denomination || 'Not listed'}</span><span><MapPin size={12} style={{ verticalAlign: '-2px' }} /> {church.distance} miles</span><span>{church.size || 'Not listed'}</span></div></div>{showScore && <div><span className="score" data-testid={`score-church-${church.id}`}>{result.score}%</span><span className="score-label">match</span></div>}</div>
    <div className="card-section"><span className="source-pill">{church.source}</span><p className="difference" data-testid={`church-details-${church.id}`}>Languages: {church.languages.length ? church.languages.join(', ') : 'Not listed'} · Worship: {church.worship.length ? church.worship.join(', ') : 'Not listed'}</p><h3 style={{ margin: '.8rem 0 .2rem', fontSize: '.86rem' }}>Why this matches</h3><div className="reason-list">{result.matched.length ? result.matched.map((item) => <span key={item} className="reason"><Check size={12} />{item}</span>) : <span className="difference">Your answers are still open here — worth a closer look.</span>}</div>{preferenceFit.length > 0 && <p className="difference" data-testid={`preference-fit-${church.id}`} aria-label={`Why this matched: ${preferenceFit.map((item) => `${item.label} ${item.matched ? 'matched' : 'not matched'}`).join(', ')}`}><strong>Why this matched:</strong>{' '}{visiblePreferenceFit.map((item, index) => <span key={`${item.label}-${index}`}>{item.label} {item.matched ? '✓' : '✗'}{index < visiblePreferenceFit.length - 1 ? ' · ' : ''}</span>)}{preferenceFit.length > visiblePreferenceFit.length && ` · +${preferenceFit.length - visiblePreferenceFit.length} more`}</p>}{result.differences.length > 0 && <><h3 style={{ margin: '1rem 0 .2rem', fontSize: '.86rem' }}>Potential differences</h3><p className="difference">{result.differences.join(' · ')}</p></>}<p className="difference" data-testid={`confirm-before-visiting-${church.id}`}>Confirm details with the church before visiting.</p></div>
    <div className="card-actions"><Link href={`/church/${church.id}`} className="mini-btn primary" data-testid={`link-view-church-${church.id}`}>View profile <ArrowRight size={13} /></Link><button className="mini-btn" onClick={onSave} data-testid={`button-save-church-${church.id}`}><Bookmark size={14} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}</button><button className={`mini-btn ${compare ? 'primary' : ''}`} onClick={onCompare} data-testid={`button-compare-church-${church.id}`}><GitCompareArrows size={14} /> {compare ? 'Comparing' : 'Compare'}</button><button className="mini-btn" onClick={onDismiss} data-testid={`button-dismiss-church-${church.id}`}>Not for me</button></div>
  </article>;
}

function Results() {
  const [prefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const [saved, setSaved] = useStored<string[]>('gatherwell-saved', []);
  const [dismissed, setDismissed] = useStored<string[]>('gatherwell-dismissed', []);
  const [compare, setCompare] = useStored<string[]>('gatherwell-compare', []);
  const [toast, setToast] = useState('');
  const matchState = useMemo(() => getChurchMatchState(churches, prefs, dismissed), [dismissed, prefs]);
  const { eligibleChurches, matches } = matchState;
  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2400); };
  return <>
    <div className="page-header">
      <span className="eyebrow">Your Church Matches</span> <span className="source-pill" data-testid="badge-sample-data">Sample data</span>
      <h1>A few places to begin.</h1>
      <p>Based on what you shared, these churches may be worth exploring in {prefs.city || 'your area'}. A match is a conversation starter — not a recommendation or decision.</p>
      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginTop: '1.2rem' }}>
        <Link href="/profile" className="mini-btn" data-testid="link-edit-preferences"><SlidersHorizontal size={14} /> Adjust preferences</Link>
        <VerifyLink />
      </div>
    </div>
    {compare.length > 1 && <div className="surface" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
      <span style={{ fontSize: '.84rem' }}>{compare.length} churches ready to compare.</span>
      <Link className="btn btn-primary" href="/compare" data-testid="link-open-compare">Open comparison <GitCompareArrows size={15} /></Link>
    </div>}
    {!hasMatchingAnswers(prefs)
      ? <div className="surface empty" data-testid="empty-no-preferences">
        <Sparkles size={28} />
        <h2>Answer the 5 core questions first.</h2>
        <p>Choose a denomination, worship style, distance, language, or service time to see meaningful matches. We won’t show match scores until you share a preference.</p>
        <Link href="/onboarding" className="btn btn-primary" data-testid="link-answer-core-questions">Answer core questions</Link>
      </div>
      : !eligibleChurches.length
      ? <div className="surface empty" data-testid="empty-must-have-matches">
        <Sparkles size={28} />
        <h2>{matchState.emptyMessage || noMustHaveMatchesMessage}</h2>
        <Link href="/profile" className="btn btn-primary" data-testid="link-relax-must-haves">Adjust preferences</Link>
      </div>
      : matches.length
        ? <div className="card-grid">{matches.map((church) => <ChurchCard
          key={church.id}
          church={church}
          prefs={prefs}
          saved={saved.includes(church.id)}
          onSave={() => {
            setSaved((current) => current.includes(church.id) ? current.filter((id) => id !== church.id) : [...current, church.id]);
            flash(saved.includes(church.id) ? 'Removed from saved churches' : 'Saved for later');
          }}
          onDismiss={() => {
            setDismissed((current) => [...current, church.id]);
            flash('We’ll keep this church out of your matches');
          }}
          compare={compare.includes(church.id)}
          onCompare={() => setCompare((current) => current.includes(church.id) ? current.filter((id) => id !== church.id) : current.length < 4 ? [...current, church.id] : current)}
        />)}</div>
        : <div className="surface empty">
          <Sparkles size={28} />
          <h2>Nothing hidden is gone forever.</h2>
          <p>You’ve dismissed every current match. Explore the directory or reset your not-for-me list to take another look.</p>
          <button className="btn btn-primary" onClick={() => setDismissed([])} data-testid="button-reset-dismissed">Show dismissed churches</button>
        </div>}
    {toast && <div className="toast" role="status" data-testid="status-toast">{toast}</div>}
  </>;
}

function Explore() {
  const [prefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const [saved, setSaved] = useStored<string[]>('gatherwell-saved', []);
  const [dismissed, setDismissed] = useStored<string[]>('gatherwell-dismissed', []);
  const [compare, setCompare] = useStored<string[]>('gatherwell-compare', []);
  const [query, setQuery] = useState('');
  const [denom, setDenom] = useState('');
  const [worship, setWorship] = useState('');
  const [community, setCommunity] = useState('');
  const [browseTab, setBrowseTab] = useState<'all' | 'non-denominational' | 'denominational'>('all');
  const filtered = churches.filter((church) =>
    (browseTab === 'all' || !dismissed.includes(church.id)) &&
    (browseTab !== 'non-denominational' || church.denomination === 'Non-denominational') &&
    (browseTab !== 'denominational' || church.denomination !== 'Non-denominational') &&
    `${church.name} ${church.location} ${church.denomination}`.toLowerCase().includes(query.toLowerCase()) &&
    (!denom || church.denomination === denom) &&
    (!worship || church.worship.includes(worship)) &&
    (!community || church.community.includes(community) || church.youngAdults.includes(community) || church.youngMarried.includes(community))
  );
  const setBrowseCategory = (category: 'all' | 'non-denominational' | 'denominational') => {
    setBrowseTab(category);
    setQuery('');
    setDenom('');
    setWorship('');
    setCommunity('');
  };
  const nonDenominationalCount = churches.filter((church) => church.denomination === 'Non-denominational' && !dismissed.includes(church.id)).length;
  const denominationalCount = churches.filter((church) => church.denomination !== 'Non-denominational' && !dismissed.includes(church.id)).length;
  return <><div className="page-header"><span className="eyebrow">Indianapolis area / fictional demo</span><h1>Explore churches on your own terms.</h1><p>Browse the details that help a new place feel legible. Every profile is fictional seed data for this prototype.</p></div><div className="browse-tabs" role="tablist" aria-label="Church categories"><button className={`browse-tab ${browseTab === 'all' ? 'active' : ''}`} role="tab" aria-selected={browseTab === 'all'} onClick={() => setBrowseCategory('all')} data-testid="tab-all-churches">All churches <span>{churches.length}</span></button><button className={`browse-tab ${browseTab === 'non-denominational' ? 'active' : ''}`} role="tab" aria-selected={browseTab === 'non-denominational'} onClick={() => setBrowseCategory('non-denominational')} data-testid="tab-nondenominational-churches">Non-denominational <span>{nonDenominationalCount}</span></button><button className={`browse-tab ${browseTab === 'denominational' ? 'active' : ''}`} role="tab" aria-selected={browseTab === 'denominational'} onClick={() => setBrowseCategory('denominational')} data-testid="tab-other-traditions">Other traditions <span>{denominationalCount}</span></button></div><div className="surface toolbar"><div className="search-wrap"><Search size={16} /><input className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by church, neighborhood, or tradition" aria-label="Search churches" data-testid="input-search-churches" /></div><select className="select filter-select" value={denom} onChange={(event) => setDenom(event.target.value)} aria-label="Filter by denomination" data-testid="select-filter-denomination"><option value="">All traditions</option>{denominationOptions.map((item) => <option key={item}>{item}</option>)}</select><select className="select filter-select" value={worship} onChange={(event) => setWorship(event.target.value)} aria-label="Filter by worship" data-testid="select-filter-worship"><option value="">Any worship style</option>{worshipOptions.filter((item) => item !== 'Doesn’t matter').map((item) => <option key={item}>{item}</option>)}</select><select className="select filter-select" value={community} onChange={(event) => setCommunity(event.target.value)} aria-label="Filter by community" data-testid="select-filter-community"><option value="">Any community</option>{communityOptions.map((item) => <option key={item}>{item}</option>)}</select></div><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.5rem 0 .8rem' }}><span style={{ fontSize: '.8rem', color: 'hsl(var(--muted-foreground))' }}>{filtered.length} fictional profiles</span><span style={{ fontSize: '.75rem', color: 'hsl(var(--muted-foreground))' }}><Filter size={13} style={{ verticalAlign: '-2px' }} /> Filters update instantly</span></div>{filtered.length ? <div className="card-grid">{filtered.map((church) => <ChurchCard key={church.id} church={church} prefs={prefs} saved={saved.includes(church.id)} onSave={() => setSaved((current) => current.includes(church.id) ? current.filter((id) => id !== church.id) : [...current, church.id])} onDismiss={() => setDismissed((current) => [...current, church.id])} compare={compare.includes(church.id)} onCompare={() => setCompare((current) => current.includes(church.id) ? current.filter((id) => id !== church.id) : current.length < 4 ? [...current, church.id] : current)} />)}</div> : <div className="surface empty"><Search size={28} /><h2>No profiles match that search.</h2><p>Try a neighborhood, a broader tradition, or clear one of the filters.</p><button className="btn btn-secondary" onClick={() => { setQuery(''); setDenom(''); setWorship(''); setCommunity(''); setDismissed([]); setBrowseTab('all'); }} data-testid="button-clear-filters">Clear filters</button></div>}</>;
}

function Detail({ id }: { id: string }) {
  const church = churches.find((item) => item.id === id);
  const [prefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const [saved, setSaved] = useStored<string[]>('gatherwell-saved', []);
  const [dismissed, setDismissed] = useStored<string[]>('gatherwell-dismissed', []);
  const [visit, setVisit] = useState(false);
  const [toast, setToast] = useState('');
  if (!church) return <div className="surface empty"><Info size={28} /><h2>We couldn’t find that profile.</h2><Link href="/explore" className="btn btn-primary" data-testid="link-back-explore">Back to Explore</Link></div>;
  const result = scoreChurch(church, prefs);
  const showScore = hasMatchingAnswers(prefs);
  const toggleSave = () => { setSaved((current) => current.includes(church.id) ? current.filter((item) => item !== church.id) : [...current, church.id]); setToast(saved.includes(church.id) ? 'Removed from saved churches' : 'Saved for later'); window.setTimeout(() => setToast(''), 2200); };
  return <><div className="detail-hero"><div><Link href="/results" className="mini-btn" data-testid="link-back-results"><ArrowLeft size={14} /> Back to matches</Link><div style={{ marginTop: '1.4rem' }}><span className="eyebrow">Fictional demo profile</span><h1>{church.name}</h1><div className="church-meta"><span>{church.denomination || 'Not listed'}</span><span><MapPin size={12} style={{ verticalAlign: '-2px' }} /> {church.location || 'Not listed'} · {church.distance} miles</span><span>{church.size || 'Not listed'}</span></div><p>{church.description || 'Not listed'}</p></div></div><div className="detail-score">{showScore ? <><span className="score" data-testid={`detail-score-${church.id}`}>{result.score}%</span><span className="score-label" style={{ textAlign: 'left' }}>match for your current preferences</span></> : <p data-testid="detail-score-unavailable">Answer the 5 core questions to see a match score.</p>}<div className="reason-list" style={{ marginTop: '1rem' }}>{result.matched.slice(0, 2).map((item) => <span className="reason" key={item}>{item}</span>)}</div></div></div><div className="detail-body"><div><section className="surface content-section"><h2>Beliefs & belonging</h2><div className="tag-list">{church.beliefs.length ? church.beliefs.map((item) => <span className="tag" key={item}>{item}</span>) : 'Not listed'}</div></section><section className="surface content-section"><h2>Worship & gathering</h2><p style={{ color: 'hsl(var(--muted-foreground))', fontSize: '.88rem', lineHeight: 1.6 }}>This community describes its worship as:</p><div className="tag-list">{church.worship.length ? church.worship.map((item) => <span className="tag" key={item}>{item}</span>) : 'Not listed'}</div><h3 style={{ marginTop: '1.5rem' }}>Service times</h3><div className="tag-list">{church.serviceTimes.length ? church.serviceTimes.map((item) => <span className="tag" key={item}><CalendarDays size={13} style={{ verticalAlign: '-2px', marginRight: '.3rem' }} />{item}</span>) : 'Not listed'}</div><p className="difference">Confirm details with the church before visiting.</p></section><section className="surface content-section"><h2>Community & young adults</h2><h3>Community rhythms</h3><div className="tag-list">{church.community.length ? church.community.map((item) => <span className="tag" key={item}>{item}</span>) : 'Not listed'}</div><h3 style={{ marginTop: '1.4rem' }}>Young adults</h3><p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6, fontSize: '.88rem' }}>{church.youngAdults.length ? church.youngAdults.join(' · ') : 'Not listed'}.</p><h3>Young married couples</h3><p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6, fontSize: '.88rem' }}>{church.youngMarried.length ? church.youngMarried.join(' · ') : 'Not listed'}.</p></section><section className="surface content-section"><h2>Mission & service</h2><div className="tag-list">{church.mission.length ? church.mission.map((item) => <span className="tag" key={item}>{item}</span>) : 'Not listed'}</div></section></div><aside className="side-sticky"><section className="surface content-section"><div style={{ display: 'grid', gap: '.55rem' }}><button className="btn btn-primary" onClick={toggleSave} data-testid="button-detail-save"><Bookmark size={16} fill={saved.includes(church.id) ? 'currentColor' : 'none'} /> {saved.includes(church.id) ? 'Saved Church' : 'Save Church'}</button><button className="btn btn-secondary" onClick={() => setVisit(true)} data-testid="button-plan-visit"><CalendarDays size={16} /> Plan a Visit</button><a className="btn btn-secondary" href={church.website} target="_blank" rel="noreferrer" data-testid="link-view-website">View Website <ExternalLink size={14} /></a><button className="btn btn-danger" onClick={() => { setDismissed((current) => [...current, church.id]); setToast('We’ll keep this church out of your matches'); }} data-testid="button-detail-dismiss">Not for Me</button></div></section><section className="surface content-section"><h2 style={{ fontSize: '1.35rem' }}>Practical info</h2><div className="info-list"><div className="info-row"><span>Parking</span><strong>{church.parking || 'Not listed'}</strong></div><div className="info-row"><span>Childcare</span><strong>{church.childcare || 'Not listed'}</strong></div><div className="info-row"><span>Accessibility</span><strong>{church.accessibility || 'Not listed'}</strong></div><div className="info-row"><span>Online services</span><strong>{church.online || 'Not listed'}</strong></div></div></section><div className="source-note"><span className="source-pill">{church.source}</span><p style={{ margin: '.6rem 0 0' }}>Profile details are fictional demo content. Confirm current details before visiting.</p><VerifyLink /></div></aside></div>{visit && <Modal title={`Plan a visit to ${church.name}`} onClose={() => setVisit(false)}><p>Choose a low-pressure next step. This prototype won’t contact the church or make a booking.</p><label style={{ display: 'block', marginBottom: '1rem' }}>I’m considering<select className="select" defaultValue="Sunday morning" data-testid="select-visit-time"><option>Sunday morning</option><option>Saturday evening</option><option>A weekday group</option><option>Just browsing for now</option></select></label><label className="check-row" style={{ marginBottom: '1rem' }}><input type="checkbox" defaultChecked /> Save this plan as a reminder</label><button className="btn btn-primary" onClick={() => { setVisit(false); setToast('Visit plan noted on this device'); window.setTimeout(() => setToast(''), 2200); }} data-testid="button-confirm-visit">Save visit plan <Check size={15} /></button></Modal>}{toast && <div className="toast" role="status" data-testid="status-detail-toast">{toast}</div>}</>;
}

function Saved() {
  const [prefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const [saved, setSaved] = useStored<string[]>('gatherwell-saved', []);
  const [compare, setCompare] = useStored<string[]>('gatherwell-compare', []);
  const savedChurches = churches.filter((church) => saved.includes(church.id));
  return <><div className="page-header"><span className="eyebrow">Your shortlist</span><h1>Saved for later.</h1><p>Keep the churches you want to revisit. Save does not signal a decision — it simply gives curiosity somewhere to live.</p></div>{savedChurches.length ? <><div className="surface" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}><span style={{ fontSize: '.84rem' }}>{savedChurches.length} saved {savedChurches.length === 1 ? 'church' : 'churches'}</span><Link className="btn btn-primary" href={compare.length > 1 ? '/compare' : '/explore'} data-testid="link-saved-compare">{compare.length > 1 ? 'Compare selected' : 'Select churches to compare'} <GitCompareArrows size={15} /></Link></div><div className="card-grid">{savedChurches.map((church) => <ChurchCard key={church.id} church={church} prefs={prefs} saved onSave={() => setSaved((current) => current.filter((id) => id !== church.id))} onDismiss={() => setSaved((current) => current.filter((id) => id !== church.id))} compare={compare.includes(church.id)} onCompare={() => setCompare((current) => current.includes(church.id) ? current.filter((id) => id !== church.id) : current.length < 4 ? [...current, church.id] : current)} />)}</div></> : <div className="surface empty"><Bookmark size={28} /><h2>Your shortlist is ready when you are.</h2><p>Save a profile from Explore or your matches. You can compare two to four churches once you have a few possibilities.</p><Link className="btn btn-primary" href="/explore" data-testid="link-empty-saved-explore">Explore churches</Link></div>}</>;
}

function Compare() {
  const [compare, setCompare] = useStored<string[]>('gatherwell-compare', []);
  const items = churches.filter((church) => compare.includes(church.id));
  const [prefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const rows: [string, (church: Church) => string][] = [
    ['Match %', (church) => hasMatchingAnswers(prefs) ? `${scoreChurch(church, prefs).score}%` : 'Answer questions first'], ['Denomination', (church) => church.denomination || 'Not listed'], ['Distance', (church) => `${church.distance} miles`], ['Size', (church) => church.size || 'Not listed'], ['Worship', (church) => church.worship.join(', ') || 'Not listed'], ['Young adult groups', (church) => church.youngAdults.join(', ') || 'Not listed'], ['Young married groups', (church) => church.youngMarried.join(', ') || 'Not listed'], ['Small groups', (church) => church.community.includes('Small groups') ? 'Listed' : 'Not listed'], ['Children’s ministry', (church) => church.practical.includes('Children’s ministry') ? 'Listed' : 'Not listed'], ['Community service', (church) => church.mission.includes('Local community service') ? 'Listed' : 'Not listed'], ['Missions', (church) => church.mission.includes('Missions') ? 'Listed' : 'Not listed'], ['Service times', (church) => church.serviceTimes.join(' · ') || 'Not listed'],
  ];
  return <><div className="page-header"><span className="eyebrow">Side by side</span><h1>Compare what matters.</h1><p>An Airtable-inspired view for the details that are hard to hold in your head at once. This is a tool for noticing, not a ranking.</p></div>{items.length > 1 ? <div className="surface compare-wrap"><table className="compare-table"><thead><tr><th>Details</th>{items.map((church) => <th key={church.id}><span style={{ display: 'block' }}>{church.name}</span><button className="mini-btn" style={{ marginTop: '.55rem' }} onClick={() => setCompare((current) => current.filter((id) => id !== church.id))} data-testid={`button-remove-compare-${church.id}`}><X size={12} /> Remove</button></th>)}</tr></thead><tbody>{rows.map(([label, get]) => <tr key={label}><td>{label}</td>{items.map((church) => <td key={church.id} data-testid={`compare-${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}-${church.id}`}>{label === 'Match %' ? <strong style={{ color: 'hsl(var(--primary))', fontSize: '1.3rem' }}>{get(church)}</strong> : get(church)}</td>)}</tr>)}</tbody></table></div> : <div className="surface empty"><GitCompareArrows size={28} /><h2>Choose at least two churches.</h2><p>Use the Compare button on a match or saved card. You can keep up to four profiles here.</p><Link className="btn btn-primary" href="/explore" data-testid="link-compare-explore">Find churches to compare</Link></div>}</>;
}

function Profile() {
  const [prefs, setPrefs] = useStored<Preferences>('gatherwell-preferences', blankPreferences);
  const [tab, setTab] = useState('profile');
  const updateValue = (patch: Partial<Preferences>) => setPrefs((current) => ({ ...current, ...patch }));
  return <><div className="page-header"><span className="eyebrow">A profile that stays yours</span><h1>My profile.</h1><p>Preferences are saved on this device. Edit them whenever your life, questions, or priorities change.</p></div><div className="profile-nav">{[['profile', 'My Profile'], ['preferences', 'My Preferences'], ['saved', 'My Saved Churches'], ['matches', 'My Matches']].map(([key, label]) => <button key={key} className={`profile-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)} data-testid={`button-profile-tab-${key}`}>{label}</button>)}</div>{tab === 'profile' && <div className="settings-grid"><section className="surface setting-block"><span className="source-pill">Local only</span><h3>Your starting point</h3><p>Gatherwell has no account or integrations in this prototype. Your answers live in this browser’s local storage.</p><label style={{ display: 'block', marginTop: '1rem' }}>Profile type<select className="select" value={prefs.profileType} onChange={(event) => updateValue({ profileType: event.target.value as ProfileType })} data-testid="select-profile-type"><option value="individual">Just me</option><option value="couple">Me and my spouse</option></select></label></section><section className="surface setting-block"><h3>Discovery area</h3><p>Update the city and distance used in match reasoning.</p><label style={{ display: 'block', marginTop: '1rem' }}>City<input className="input" value={prefs.city} onChange={(event) => updateValue({ city: event.target.value })} data-testid="input-profile-city" /></label><label style={{ display: 'block', marginTop: '1rem' }}>Maximum distance<select className="select" value={prefs.travel} onChange={(event) => updateValue({ travel: event.target.value })} data-testid="select-profile-travel"><option value="5">5 miles</option><option value="10">10 miles</option><option value="15">15 miles</option><option value="20">20 miles</option><option value="30">30+ miles</option></select></label></section></div>}{tab === 'preferences' && <div className="surface setting-block"><h3>Fast preference edits</h3><p>For the full conversational questionnaire, start Find a Church again. Changes here update match percentages immediately.</p><label style={{ display: 'block', marginTop: '1rem' }}>Denomination<select className="select" value={prefs.denomination} onChange={(event) => updateValue({ denomination: event.target.value })} data-testid="select-profile-denomination"><option value="">I’m open to exploring</option>{denominationOptions.map((item) => <option key={item}>{item}</option>)}</select></label><label style={{ display: 'block', marginTop: '1rem' }}>Church size<select className="select" value={prefs.size} onChange={(event) => updateValue({ size: event.target.value })} data-testid="select-profile-size"><option>No preference</option><option>Small</option><option>Medium</option><option>Large</option><option>Megachurch</option></select></label><Link href="/onboarding" className="btn btn-primary" style={{ marginTop: '1.3rem' }} data-testid="link-full-questionnaire">Open full questionnaire <ArrowRight size={15} /></Link></div>}{tab === 'saved' && <div className="surface empty"><Bookmark size={28} /><h2>Your saved churches live here.</h2><p>Open the Saved page to revisit profiles and build a comparison.</p><Link href="/saved" className="btn btn-primary" data-testid="link-profile-saved">View saved churches</Link></div>}{tab === 'matches' && <div className="surface empty"><Sparkles size={28} /><h2>Your matches respond to your preferences.</h2><p>See your current score, reasons, and potential differences in the matches view.</p><Link href="/results" className="btn btn-primary" data-testid="link-profile-matches">View my matches</Link></div>}</>;
}

function HowItWorks() {
  return <><div className="page-header"><span className="eyebrow">A transparent starting point</span><h1>How Gatherwell works.</h1><p>Moving to a new city can make belonging feel like another research project. Gatherwell keeps the first step useful, human, and yours.</p></div><div className="value-grid"><div className="value-card featured"><span className="value-number">01</span><h3>Tell us what fits your life</h3><p>Location, worship, community, beliefs, mission, size, and practical details all have a place. There’s no theology quiz score and no pressure to know everything yet.</p></div><div className="value-card"><span className="value-number">02</span><h3>We calculate locally</h3><p>Your answers are scored in this browser against fictional seed profiles. Match percentages change when your preferences change.</p></div><div className="value-card"><span className="value-number">03</span><h3>You decide what to do next</h3><p>Read profiles, compare options, save a few, or plan a visit. A match is not a church chosen for you.</p></div></div><section className="section"><div className="section-head"><div><span className="eyebrow">What to look for</span><h2>Every profile makes room for nuance.</h2></div><p>We show both the pull and the pause. Reasons explain where your answers overlap; potential differences are invitations to ask a better question.</p></div><div className="steps"><div className="step"><Users size={18} color="hsl(var(--accent))" /><h3>People and rhythms</h3><p>Young adults, young married couples, small groups, service, and the ordinary ways people build relationships.</p></div><div className="step"><HeartHandshake size={18} color="hsl(var(--accent))" /><h3>Beliefs and practice</h3><p>Belief topics and worship language are shown plainly, without pretending a label captures an entire community.</p></div><div className="step"><MapPin size={18} color="hsl(var(--accent))" /><h3>Real-life logistics</h3><p>Travel, services, parking, childcare, accessibility, and online options all matter when building a new routine.</p></div></div></section><section className="surface content-section"><h2>Information sources</h2><p style={{ color: 'hsl(var(--muted-foreground))', lineHeight: 1.6 }}>Every fictional profile carries a source label so you can see how Gatherwell would distinguish context:</p><div className="tag-list"><span className="tag">Church-provided</span><span className="tag">Platform verified</span><span className="tag">User reported</span></div><div style={{ marginTop: '1.2rem' }}><VerifyLink /></div></section></>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch><Route path="/" component={Landing} /><Route path="/onboarding" component={Onboarding} /><Route path="/results" component={Results} /><Route path="/explore" component={Explore} /><Route path="/saved" component={Saved} /><Route path="/compare" component={Compare} /><Route path="/profile" component={Profile} /><Route path="/how-it-works" component={HowItWorks} /><Route path="/church/:id"><ChurchRoute /></Route><Route component={NotFound} /></Switch></ErrorBoundary>;
}
function ChurchRoute() {
  const params = useParams<{ id: string }>();
  const id = params.id ?? '';
  const church = churches.find((item) => item.id === id);
  if (!church) return <Detail id={id} />;
  return <><div className="detail-cover" data-testid={`image-church-profile-${church.id}`}><ChurchImage key={church.id} church={church} className="detail-cover-image" alt={`Fictional demo photo representing ${church.name}`} loading="eager" /><span className="photo-badge">Fictional demo image</span></div><Detail id={id} /></>;
}
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppShell><Router /></AppShell></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Languages, Share2, TrendingUp, Wifi } from 'lucide-react'
import { Brand, Button, Card, TabBar } from './components'
import { Home, Nearby, Session } from './ConnectScreens'
import { Consent, Host, Profile, WalletScreen } from './HostScreens'
import { initialHost } from './mock'
import { translate } from './translations'

const routes = ['home', 'nearby', 'session', 'host', 'consent', 'earn', 'profile', 'onboarding']
const tabRoutes = { session: 'home', host: 'profile', consent: 'profile' }
const guideSteps = [
  { Icon: Share2, title: 'shareStep', body: 'shareStepBody' },
  { Icon: Wifi, title: 'connectStep', body: 'connectStepBody' },
  { Icon: TrendingUp, title: 'earnStep', body: 'earnStepBody' },
]

function readRoute() {
  const hash = window.location.hash.slice(1)
  return routes.includes(hash) ? hash : 'home'
}

function goTo(route) {
  window.location.hash = route
}

function Walkthrough({ t, number }) {
  const [step, setStep] = useState(-1)
  const heading = useRef(null)
  const active = guideSteps[step]

  function showStep(next) {
    setStep(next)
    requestAnimationFrame(() => heading.current?.focus())
  }

  return (
    <Card as="section" className="walkthrough">
      <div className="walkthrough-art">
        {active ? <span className="onboarding-icon"><active.Icon aria-hidden="true" /></span> : <Brand t={t} large />}
      </div>
      <div className="walkthrough-body">
        {active && <p className="step-label">{t('stepOf', { step: number(step + 1), total: number(guideSteps.length) })}</p>}
        <h1 ref={heading} tabIndex={-1}>{t(active ? active.title : 'tagline')}</h1>
        {active && <p>{t(active.body)}</p>}
        {active ? <div className="walkthrough-actions">
          <Button variant="ghost" onClick={() => showStep(step - 1)}>{t('back')}</Button>
          {step < guideSteps.length - 1
            ? <Button onClick={() => showStep(step + 1)}>{t('next')}<ArrowRight size={18} aria-hidden="true" /></Button>
            : <Button href="#home">{t('finish')}<ArrowRight size={18} aria-hidden="true" /></Button>}
        </div> : <Button onClick={() => showStep(0)}>{t('getStarted')}<ArrowRight size={18} aria-hidden="true" /></Button>}
        <a className="text-link walkthrough-skip" href="#home">{t('skip')}</a>
      </div>
    </Card>
  )
}

export default function App() {
  const [locale, setLocale] = useState('en')
  const [route, setRoute] = useState(readRoute)
  const [session, setSession] = useState(null)
  const [host, setHost] = useState(initialHost)
  const [notice, setNotice] = useState(null)
  const content = useRef(null)
  const page = route === 'session' && !session ? 'home' : route
  const t = (key, values) => translate(locale, key, values)
  const number = (value, digits = 1) => new Intl.NumberFormat(locale, { minimumIntegerDigits: digits, useGrouping: false }).format(value)

  useEffect(() => {
    function onHashChange() {
      const next = readRoute()
      setRoute(next)
      window.scrollTo(0, 0)
      content.current?.focus({ preventScroll: true })
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => { document.documentElement.lang = locale }, [locale])

  function connect(hotspot) {
    setNotice(null)
    setSession(previous => previous ?? { hotspot, startedAt: Date.now() })
    goTo('session')
  }

  function disconnect() {
    setSession(null)
    setNotice({ page: 'home', key: 'disconnected' })
    goTo('home')
  }

  function agreeToShare() {
    setHost(previous => ({ ...previous, consent: true }))
    setNotice({ page: 'host', key: 'consentSaved' })
    goTo('host')
  }

  const shared = { t, number, session, onConnect: connect }
  const screens = {
    home: <Home {...shared} host={host} />,
    nearby: <Nearby {...shared} />,
    session: session && <Session t={t} locale={locale} session={session} onDisconnect={disconnect} />,
    host: <Host t={t} host={host} setHost={setHost} number={number} />,
    consent: <Consent t={t} onConsent={agreeToShare} />,
    earn: <WalletScreen t={t} />,
    profile: <Profile t={t} />,
    onboarding: <Walkthrough t={t} number={number} />,
  }

  return (
    <>
      <a href="#main" className="skip-link" onClick={event => {
        event.preventDefault()
        content.current?.focus()
      }}>{t('skipToContent')}</a>
      <header className="topbar">
        <div className="topbar-inner">
          <a href="#home" className="brand-link"><Brand t={t} /></a>
          <div className="topbar-actions">
            <span className="header-tagline">{t('tagline')}</span>
            <div className="language-toggle" role="group" aria-label={t('language')}>
              <Languages size={17} aria-hidden="true" />
              <button type="button" lang="en" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>{t('english')}</button>
              <button type="button" lang="bn" aria-pressed={locale === 'bn'} onClick={() => setLocale('bn')}>{t('bangla')}</button>
            </div>
          </div>
        </div>
      </header>
      <main id="main" className={page === 'onboarding' ? 'shell onboarding-shell' : 'shell'} tabIndex={-1} ref={content}>
        <div className="notice" role="status">{notice?.page === page && t(notice.key)}</div>
        {screens[page]}
      </main>
      {page !== 'onboarding' && <TabBar active={tabRoutes[page] ?? page} t={t} />}
    </>
  )
}

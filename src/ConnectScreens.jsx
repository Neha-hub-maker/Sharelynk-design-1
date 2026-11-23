import { useEffect, useState } from 'react'
import { ArrowRight, Clock3, Database, List, LocateFixed, Map, MapPin, Radio, TrendingUp, Wallet, Wifi } from 'lucide-react'
import { Button, Card, HotspotRow, StatTile, TextLink } from './components'
import { hotspots } from './mock'

export function ScreenHeading({ title, intro, children }) {
  return (
    <div className="screen-heading">
      <div><h1>{title}</h1><p>{intro}</p></div>
      {children}
    </div>
  )
}

function SignalArtwork() {
  return (
    <div className="signal-art" aria-hidden="true">
      <div className="orbit orbit-outer" />
      <div className="orbit orbit-middle" />
      <div className="orbit orbit-inner" />
      <span className="orbit-dot dot-top" />
      <span className="orbit-dot dot-bottom" />
      <div className="art-chip art-chip-pin"><MapPin /></div>
      <div className="art-chip art-chip-radio"><Radio /></div>
      <div className="art-chip art-chip-main"><Wifi /></div>
    </div>
  )
}

export function Home({ t, number, session, onConnect, host }) {
  const best = hotspots[0]
  return (
    <>
      <ScreenHeading title={t('homeTitle')} intro={t('homeIntro')}>
        <span className="campus-badge"><MapPin size={16} aria-hidden="true" />{t('campus')}</span>
      </ScreenHeading>
      <section className="hero" aria-labelledby="hero-title">
        <SignalArtwork />
        <div className="hero-content">
          <span className="hero-label"><span />{t('heroLabel')}</span>
          <h2 id="hero-title">{t('heroTitle')}</h2>
          <p>{t('heroBody')}</p>
          <Button className="hero-button" onClick={() => onConnect(best)}>
            <Wifi size={19} aria-hidden="true" />{t(session ? 'returnToSession' : 'connectNow')}<ArrowRight size={17} aria-hidden="true" />
          </Button>
        </div>
      </section>
      <div className="home-grid">
        <section aria-labelledby="best-nearby">
          <div className="section-heading">
            <div><h2 id="best-nearby">{t('bestNearby')}</h2><span className="sample-label">{t('sampleHotspot')}</span></div>
            <TextLink href="#nearby">{t('viewAll')}</TextLink>
          </div>
          <ul className="hotspot-list">
            <HotspotRow hotspot={best} t={t} number={number} onConnect={onConnect} session={session} />
          </ul>
        </section>
        <Card as="section" className="host-teaser" aria-labelledby="share-title">
          <span className="icon-tile"><TrendingUp aria-hidden="true" /></span>
          <div>
            <h2 id="share-title">{t('shareWifi')}</h2>
            <p>{t('hostTeaser')}</p>
            <TextLink href={host.consent ? '#host' : '#consent'}>{t(host.consent ? 'openDashboard' : 'startSharing')}</TextLink>
          </div>
        </Card>
      </div>
    </>
  )
}

export function Nearby({ t, number, onConnect, session }) {
  const [mode, setMode] = useState('list')
  return (
    <>
      <ScreenHeading title={t('nearbyTitle')} intro={t('nearbyIntro')} />
      <div className="view-switch" role="group" aria-label={t('viewMode')}>
        {[['list', List], ['map', Map]].map(([id, Icon]) => (
          <button key={id} type="button" aria-pressed={mode === id} onClick={() => setMode(id)}>
            <Icon size={17} aria-hidden="true" />{t(id)}
          </button>
        ))}
      </div>
      {mode === 'list'
        ? <ul className="hotspot-list nearby-list">{hotspots.map(hotspot => (
          <HotspotRow key={hotspot.id} hotspot={hotspot} t={t} number={number} onConnect={onConnect} session={session} />
        ))}</ul>
        : <Card className="map-placeholder">
          <span className="icon-tile"><LocateFixed aria-hidden="true" /></span>
          <h2>{t('mapPlaceholder')}</h2>
          <p>{t('mapBody')}</p>
        </Card>}
    </>
  )
}

export function Session({ t, locale, session, onDisconnect }) {
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])
  const seconds = Math.max(0, Math.floor((now - session.startedAt) / 1000))
  const format = new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false })
  const elapsed = [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60]
    .map(value => format.format(value)).join(':')

  return (
    <>
      <ScreenHeading title={t('sessionTitle')} intro={t('sessionIntro')} />
      <Card as="section" className="detail-panel">
        <div className="detail-header">
          <span className="icon-tile"><Wifi aria-hidden="true" /></span>
          <div><h2>{t(session.hotspot.name)}</h2><p>{t('sessionDemo')}</p></div>
          <span className="status-pill status-success"><i />{t('connected')}</span>
        </div>
        <dl className="stat-grid">
          <StatTile icon={Clock3} label={t('duration')} value={<time dateTime={`PT${seconds}S`}>{elapsed}</time>} />
          <StatTile icon={Database} label={t('dataUsed')} value={t('dataPlaceholder')} />
          <StatTile icon={Wallet} label={t('cost')} value={t('costPlaceholder')} />
        </dl>
        <Button variant="danger" onClick={onDisconnect}>{t('disconnect')}</Button>
      </Card>
    </>
  )
}

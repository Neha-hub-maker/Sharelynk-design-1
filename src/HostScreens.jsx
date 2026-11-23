import { useRef, useState } from 'react'
import { ArrowRight, CalendarClock, CircleHelp, GraduationCap, LockKeyhole, Radio, TrendingUp, UserRound, Wallet, Wifi, X } from 'lucide-react'
import { Button, Card, TextLink } from './components'
import { ScreenHeading } from './ConnectScreens'
import { paymentOptions, sampleGuests, sampleWeek } from './mock'

export function Consent({ t, onConsent }) {
  const [agreed, setAgreed] = useState(false)
  const disclosures = [
    [Wifi, 'whatIsShared', 'shareDetail'],
    [LockKeyhole, 'passwordTitle', 'passwordDetail'],
    [GraduationCap, 'approvalTitle', 'approvalDetail'],
  ]
  return (
    <>
      <ScreenHeading title={t('consentTitle')} intro={t('consentIntro')} />
      <Card as="form" className="detail-panel" onSubmit={event => {
        event.preventDefault()
        if (agreed) onConsent()
      }}>
        <ul className="disclosure-list">
          {disclosures.map(([Icon, label, body]) => (
            <li key={label}><span className="icon-tile"><Icon aria-hidden="true" /></span>
              <div><h2>{t(label)}</h2><p>{t(body)}</p></div>
            </li>
          ))}
        </ul>
        <label className="checkbox-row">
          <input type="checkbox" required checked={agreed} onChange={event => setAgreed(event.target.checked)} />
          <span>{t('agree')}</span>
        </label>
        <Button type="submit" disabled={!agreed}>{t('consentAction')}<ArrowRight size={17} aria-hidden="true" /></Button>
      </Card>
    </>
  )
}

function EarningsChart({ t }) {
  const weekdays = t('weekdays')
  return (
    <figure className="earnings-chart">
      <div className="chart-bars" aria-hidden="true">
        {sampleWeek.map((height, index) => (
          <div className="chart-column" key={index}>
            <div className="chart-track"><i style={{ '--bar-height': `${height}%` }} /></div>
            <span>{weekdays[index]}</span>
          </div>
        ))}
      </div>
      <figcaption>{t('sampleChart')} · {t('mondayToSunday')}</figcaption>
    </figure>
  )
}

function HostControls({ t, host, setHost }) {
  const [error, setError] = useState(false)
  const [saved, setSaved] = useState(false)
  const sharing = host.consent && !host.paused

  function saveControls(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const cap = fields.get('cap')
    const start = fields.get('start')
    const end = fields.get('end')
    if (Boolean(start) !== Boolean(end) || (start && start === end)) {
      setError(true)
      setSaved(false)
      return
    }
    setHost(previous => ({ ...previous, cap, start, end }))
    setError(false)
    setSaved(true)
  }

  return (
    <Card as="section" className="detail-panel" aria-labelledby="controls-title">
      <h2 id="controls-title">{t('sharingControls')}</h2>
      <label className="switch-row">
        <span><strong>{t('pauseSharing')}</strong><small>{t('pauseHint')}</small></span>
        <input type="checkbox" role="switch" aria-label={t('pauseSharing')} className="switch" checked={!sharing} disabled={!host.consent}
          onChange={event => {
            const paused = event.target.checked
            setHost(previous => ({ ...previous, paused }))
          }} />
      </label>
      {!host.consent && <div className="control-gate"><p>{t('controlGate')}</p><TextLink href="#consent">{t('startSharing')}</TextLink></div>}
      <form className="controls-form" onSubmit={saveControls} onChange={() => { setSaved(false); setError(false) }}>
        <label className="field">
          <span>{t('bandwidthCap')}</span>
          <input type="number" name="cap" min="1" step="1" inputMode="numeric" placeholder={t('capPlaceholder')} defaultValue={host.cap} />
        </label>
        <fieldset className="schedule-fields">
          <legend><CalendarClock size={17} aria-hidden="true" />{t('schedule')}</legend>
          <p id="schedule-hint">{t('scheduleHint')}</p>
          <div className="time-grid">
            <label className="field"><span>{t('scheduleStart')}</span><input type="time" name="start" defaultValue={host.start} aria-describedby="schedule-hint" aria-invalid={error} /></label>
            <label className="field"><span>{t('scheduleEnd')}</span><input type="time" name="end" defaultValue={host.end} aria-describedby="schedule-hint" aria-invalid={error} /></label>
          </div>
        </fieldset>
        {error && <p className="form-error" role="alert">{t('scheduleError')}</p>}
        <div className="form-actions">
          <Button type="submit" variant="secondary">{t('saveSettings')}</Button>
          <span role="status">{saved && t('settingsSaved')}</span>
        </div>
      </form>
    </Card>
  )
}

export function Host({ t, host, setHost, number }) {
  const sharing = host.consent && !host.paused
  const status = !host.consent ? 'setupNeeded' : sharing ? 'sharing' : 'paused'
  return (
    <>
      <ScreenHeading title={t('hostTitle')} intro={t('hostIntro')}>
        <span className={sharing ? 'status-pill status-success' : 'status-pill status-warning'}><i />{t(status)}</span>
      </ScreenHeading>
      <div className="host-grid">
        <div className="stack">
          <Card as="section" className="detail-panel">
            <div className="detail-header">
              <span className="icon-tile icon-success"><TrendingUp aria-hidden="true" /></span>
              <div><h2>{t('weeklyEarnings')}</h2><p className="money">{t('earningsPlaceholder')}</p></div>
            </div>
            <EarningsChart t={t} />
            <TextLink href="#earn">{t('wallet')}</TextLink>
          </Card>
          <Card as="section" className="detail-panel">
            <h2>{t('connectedUsers')}</h2>
            {sharing ? <ul className="guest-list">{sampleGuests.map(id => (
              <li key={id}><UserRound aria-hidden="true" size={18} />{t('userLabel', { id: number(Number(id), 2) })}</li>
            ))}</ul> : <p>{t('noUsers')}</p>}
          </Card>
        </div>
        <HostControls t={t} host={host} setHost={setHost} />
      </div>
    </>
  )
}

export function WalletScreen({ t }) {
  const dialog = useRef(null)
  const [selected, setSelected] = useState(null)
  return (
    <>
      <ScreenHeading title={t('wallet')} intro={t('walletIntro')} />
      <div className="stack wallet-stack">
        <Card as="section" className="detail-panel balance-card">
          <div className="detail-header">
            <span className="icon-tile icon-success"><Wallet aria-hidden="true" /></span>
            <div><h2>{t('balance')}</h2><p className="money">{t('balancePlaceholder')}</p></div>
          </div>
          <Button onClick={() => dialog.current.showModal()}>{t('withdraw')}<ArrowRight size={17} aria-hidden="true" /></Button>
        </Card>
        <Card as="section" className="detail-panel">
          <h2>{t('earningsHistory')}</h2><p>{t('noHistory')}</p>
        </Card>
      </div>
      <dialog ref={dialog} className="withdraw-dialog" aria-labelledby="withdraw-title" onClose={() => setSelected(null)}>
        <div className="detail-header">
          <h2 id="withdraw-title">{t('withdrawalOptions')}</h2>
          <Button className="dialog-close" variant="ghost" aria-label={t('close')} onClick={() => dialog.current.close()}>
            <X aria-hidden="true" size={20} />
          </Button>
        </div>
        <span className="status-pill status-warning">{t('paymentDemo')}</span>
        <p>{t('paymentHint')}</p>
        <div className="payment-options">
          {paymentOptions.map(option => (
            <Button key={option} variant="secondary" onClick={() => setSelected(option)}>{t(option)}</Button>
          ))}
        </div>
        <div role="status">{selected && t('paymentSelected', { provider: t(selected) })}</div>
      </dialog>
    </>
  )
}

export function Profile({ t }) {
  return (
    <>
      <ScreenHeading title={t('profile')} intro={t('tagline')} />
      <div className="profile-grid">
        <Card as="section" className="detail-panel">
          <span className="icon-tile"><Radio aria-hidden="true" /></span>
          <div><h2>{t('hostAccess')}</h2><p>{t('hostAccessBody')}</p></div>
          <TextLink href="#host">{t('openDashboard')}</TextLink>
          <TextLink href="#consent">{t('reviewConsent')}</TextLink>
        </Card>
        <Card as="section" className="detail-panel">
          <span className="icon-tile"><CircleHelp aria-hidden="true" /></span>
          <div><h2>{t('howItWorks')}</h2><p>{t('guideBody')}</p></div>
          <TextLink href="#onboarding">{t('openGuide')}</TextLink>
        </Card>
      </div>
    </>
  )
}

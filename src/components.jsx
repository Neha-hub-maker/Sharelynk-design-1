import { ArrowRight, House, Link2, MapPin, UserRound, Wallet, Wifi } from 'lucide-react'

export function Brand({ t, large = false }) {
  return (
    <span className={large ? 'brand brand-large' : 'brand'}>
      <span className="brand-mark" aria-hidden="true">
        <Link2 />
      </span>
      <span>{t('brand')}</span>
    </span>
  )
}

export function Button({ children, variant = 'primary', className = '', href, ...props }) {
  const classes = `button button-${variant} ${className}`
  return href
    ? <a className={classes} href={href} {...props}>{children}</a>
    : <button className={classes} type="button" {...props}>{children}</button>
}

export function Card({ children, className = '', as: Element = 'div', ...props }) {
  return <Element className={`panel ${className}`} {...props}>{children}</Element>
}

export function StatTile({ icon: Icon, label, value }) {
  return (
    <div className="stat-tile">
      <dt><Icon aria-hidden="true" size={18} />{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

export function Signal({ bars }) {
  return (
    <span className="signal" aria-hidden="true">
      {[1, 2, 3, 4].map(level => <i key={level} className={level <= bars ? 'on' : ''} />)}
    </span>
  )
}

export function HotspotRow({ hotspot, t, number, onConnect, session }) {
  const name = t(hotspot.name)
  const connected = session?.hotspot.id === hotspot.id
  const action = connected ? 'connected' : session ? 'viewSession' : 'connect'
  return (
    <Card as="li" className="hotspot">
      <div className="hotspot-info">
        <span className="icon-tile hotspot-icon"><Wifi aria-hidden="true" /></span>
        <div className="min-w-0">
          <h3>{name}</h3>
          <div className="hotspot-meta">
            <span><Signal bars={hotspot.bars} />{t('signal', { strength: t(hotspot.strength) })}</span>
            <span><MapPin size={13} aria-hidden="true" />{t('hotspotDistance', { distance: number(hotspot.distance) })}</span>
          </div>
        </div>
      </div>
      <div className="hotspot-action">
        <span className="rate">{t('rate')}</span>
        <Button variant="secondary" onClick={() => onConnect(hotspot)} aria-label={`${t(action)}: ${name}`}>
          {t(action)}
        </Button>
      </div>
    </Card>
  )
}

const tabs = [
  { id: 'home', Icon: House },
  { id: 'nearby', Icon: MapPin },
  { id: 'earn', Icon: Wallet },
  { id: 'profile', Icon: UserRound },
]

export function TabBar({ active, t }) {
  return (
    <nav className="tabbar" aria-label={t('navigation')}>
      <div className="tabbar-inner">
        {tabs.map(({ id, Icon }) => (
          <a key={id} href={`#${id}`} className="tab" aria-current={active === id ? 'page' : undefined}>
            <span className="tab-icon"><Icon size={21} aria-hidden="true" /></span>
            {t(id)}
          </a>
        ))}
      </div>
    </nav>
  )
}

export function TextLink({ href, children }) {
  return <a className="text-link" href={href}>{children}<ArrowRight size={16} aria-hidden="true" /></a>
}

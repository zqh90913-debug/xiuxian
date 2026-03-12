/**
 * 兵演单卡：道心争锋用牌（品级 + 三才）
 */
import { BINGYAN_FACTIONS, getEffectText } from '../data/bingyan'
import './BingyanCard.css'

export default function BingyanCard({ card, onClick, compact, className, disabled }) {
  if (!card) return null
  const faction = BINGYAN_FACTIONS.find((f) => f.id === card.factionId)
  const color = faction?.color ?? '#888'
  const dark = faction?.dark ?? '#333'
  const effectText = getEffectText(card)

  return (
    <div
      className={`bingyan-card ${compact ? 'compact' : ''} ${disabled ? 'disabled' : ''} ${className ?? ''}`.trim()}
      style={{ '--faction-color': color, '--faction-dark': dark }}
      onClick={disabled ? undefined : onClick}
      role={onClick && !disabled ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={(e) => onClick && !disabled && e.key === 'Enter' && onClick()}
    >
      <div className="bingyan-card-art" aria-hidden>
        <svg viewBox="0 0 64 64" className="bingyan-card-symbol">
          {card.factionId === 'huangchao' && <path fill="currentColor" opacity="0.4" d="M32 8 L56 32 L32 56 L8 32 Z" />}
          {card.factionId === 'mozong' && <ellipse cx="32" cy="32" rx="20" ry="12" fill="currentColor" opacity="0.4" />}
          {card.factionId === 'fomen' && <circle cx="32" cy="32" r="18" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.5" />}
        </svg>
      </div>
      <div className="bingyan-card-body">
        <span className="bingyan-card-grade">品级 {card.grade}</span>
        <span className="bingyan-card-name" title={card.name}>{card.name}</span>
        {effectText && <span className="bingyan-card-effect">{effectText}</span>}
      </div>
    </div>
  )
}

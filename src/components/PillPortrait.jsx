/**
 * 丹药立绘 - 每种丹药对应的小图
 */
import { getPillGradeColor, getItemById } from '../data/items'
import './PillPortrait.css'

export default function PillPortrait({ itemId, grade, className = '' }) {
  const color = grade != null ? getPillGradeColor(grade) : (getItemById(itemId) && getPillGradeColor(getItemById(itemId).grade))
  const c = color || '#9e9e9e'

  return (
    <div className={`pill-portrait ${className}`} style={{ '--pill-color': c }}>
      <svg viewBox="0 0 64 64" className="pill-svg">
        <defs>
          <linearGradient id="pillShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={c} stopOpacity="1" />
            <stop offset="100%" stopColor={c} stopOpacity="0.5" />
          </linearGradient>
          <filter id="pillGlow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="32" cy="36" rx="14" ry="18" fill="url(#pillShine)" stroke={c} strokeWidth="2" filter="url(#pillGlow)" />
        <ellipse cx="32" cy="32" rx="8" ry="6" fill="rgba(255,255,255,0.3)" />
      </svg>
    </div>
  )
}

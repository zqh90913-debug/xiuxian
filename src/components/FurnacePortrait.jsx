/**
 * 丹炉立绘：按品级 1-9 显示不同颜色
 */
import { getItemById, getPillGradeColor } from '../data/items'
import './FurnacePortrait.css'

export default function FurnacePortrait({ itemId, className = '' }) {
  const item = getItemById(itemId)
  if (!item || item.type !== 'furnace') return null
  const color = getPillGradeColor(item.grade)

  return (
    <div className={`furnace-portrait ${className}`} style={{ '--furnace-color': color }}>
      <svg viewBox="0 0 64 64" className="furnace-svg">
        <defs>
          <linearGradient id={`furGrad-${itemId}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <path d="M20 20h24v28c0 4-4 8-12 8s-12-4-12-8V20z" fill={`url(#furGrad-${itemId})`} stroke={color} strokeWidth="2" />
        <ellipse cx="32" cy="20" rx="12" ry="4" fill="rgba(255,255,255,0.2)" />
        <rect x="28" y="8" width="8" height="6" rx="2" fill={color} opacity="0.8" />
      </svg>
    </div>
  )
}

/**
 * 装备立绘（法器/防具）：根据 itemId 生成差异化 SVG 小图标
 */
import { getItemById, getPillGradeColor, ITEM_TYPES } from '../data/items'
import './EquipmentPortrait.css'

function hashCode(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

function WeaponSvg({ color, variant }) {
  // 3 种法器图标：剑/杖/刃
  if (variant === 0) {
    return (
      <svg viewBox="0 0 64 64" className="equip-svg">
        <path d="M42 10l12 12-6 6-6-6-18 18 6 6-6 6-12-12 6-6 6 6 18-18-6-6z" fill={color} opacity="0.9" />
        <path d="M10 54l10-10 10 10-10 4z" fill="rgba(255,255,255,0.25)" />
      </svg>
    )
  }
  if (variant === 1) {
    return (
      <svg viewBox="0 0 64 64" className="equip-svg">
        <rect x="28" y="8" width="8" height="34" rx="3" fill={color} opacity="0.9" />
        <rect x="22" y="38" width="20" height="6" rx="3" fill="rgba(255,255,255,0.25)" />
        <path d="M32 44c-6 0-10 4-10 9 0 2 1 3 3 3h14c2 0 3-1 3-3 0-5-4-9-10-9z" fill={color} opacity="0.65" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 64" className="equip-svg">
      <path d="M14 20h36l-6 8H20z" fill={color} opacity="0.85" />
      <path d="M22 28h20l-10 22z" fill={color} opacity="0.65" />
      <path d="M18 18h28l-2 2H20z" fill="rgba(255,255,255,0.25)" />
    </svg>
  )
}

function ArmorSvg({ color, variant }) {
  // 3 种防具图标：甲胄/盾/护心镜
  if (variant === 0) {
    return (
      <svg viewBox="0 0 64 64" className="equip-svg">
        <path d="M32 10c10 0 18 6 18 16v10c0 10-8 18-18 18S14 46 14 36V26c0-10 8-16 18-16z" fill={color} opacity="0.75" />
        <path d="M22 22h20v10H22z" fill="rgba(255,255,255,0.25)" />
        <path d="M20 34h24v14H20z" fill={color} opacity="0.55" />
      </svg>
    )
  }
  if (variant === 1) {
    return (
      <svg viewBox="0 0 64 64" className="equip-svg">
        <path d="M32 10l18 6v16c0 12-8 20-18 22C22 52 14 44 14 32V16z" fill={color} opacity="0.78" />
        <path d="M32 16v34" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <path d="M22 26h20" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 64 64" className="equip-svg">
      <circle cx="32" cy="30" r="16" fill={color} opacity="0.7" />
      <circle cx="32" cy="30" r="8" fill="rgba(255,255,255,0.25)" />
      <path d="M18 44h28l-14 10z" fill={color} opacity="0.55" />
    </svg>
  )
}

export default function EquipmentPortrait({ itemId, className = '' }) {
  const item = getItemById(itemId)
  if (!item) return null

  const color = getPillGradeColor(item.grade)
  const v = hashCode(itemId) % 3

  return (
    <div className={`equip-portrait ${className}`} style={{ '--equip-color': color }}>
      {item.type === ITEM_TYPES.ARMOR ? (
        <ArmorSvg color={color} variant={v} />
      ) : (
        <WeaponSvg color={color} variant={v} />
      )}
    </div>
  )
}


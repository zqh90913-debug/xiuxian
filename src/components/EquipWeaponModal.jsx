/**
 * 装备确认弹窗：法器显示攻击加成，防具显示血量加成
 * 使用 Portal 挂到 body，避免被侧栏/父级 transform、overflow 裁剪或挡住点击
 */
import { createPortal } from 'react-dom'
import { getItemAccentColor, ITEM_TYPES } from '../data/items'
import EquipmentPortrait from './EquipmentPortrait'
import './EquipWeaponModal.css'

export default function EquipWeaponModal({ show, item, onClose, onConfirm }) {
  if (!show || !item) return null

  const isArmor = item.type === ITEM_TYPES.ARMOR
  const title = isArmor ? '装备防具' : '装备法器'
  const effectText = isArmor
    ? `血量 +${item.hpBonus ?? 0}`
    : `攻击 +${item.attackBonus ?? 0}`

  const node = (
    <div className="equip-weapon-overlay" role="presentation" onClick={onClose}>
      <div className="equip-weapon-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <div className="equip-modal-portrait">
          {item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR ? (
            <EquipmentPortrait itemId={item.id} />
          ) : null}
        </div>
        <p
          className="weapon-name"
          style={{ color: getItemAccentColor(item) }}
        >
          {item.name}
        </p>
        <p className="weapon-effect">{effectText}</p>
        {item.desc && <p className="weapon-desc">{item.desc}</p>}
        <div className="modal-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
          <button type="button" className="btn-confirm" onClick={() => onConfirm?.()}>确定装备</button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined' ? createPortal(node, document.body) : node
}

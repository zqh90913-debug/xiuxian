/**
 * 装备栏 - 5个法器位 + 5个防具位
 */
import { getItemById } from '../data/items'
import EquipmentPortrait from './EquipmentPortrait'
import './EquipmentPanel.css'

const SLOT_LABELS = {
  weapon: ['法器一', '法器二', '法器三', '法器四', '法器五'],
  armor: ['防具一', '防具二', '防具三', '防具四', '防具五'],
}

export default function EquipmentPanel({ equipment = {}, onUnequipWeapon, onUnequipArmor }) {
  const weapons = equipment.weapons ?? Array(5).fill(null)
  const armors = equipment.armors ?? Array(5).fill(null)

  return (
    <div className="equipment-panel gu-panel">
      <h3 className="panel-title">装备</h3>
      <div className="equipment-section">
        <span className="section-label">法器</span>
        <div className="slot-row">
          {weapons.map((slot, i) => {
            const item = slot?.itemId ? getItemById(slot.itemId) : null
            return (
              <div
                key={`w-${i}`}
                className="equip-slot"
                data-type="weapon"
                title={item ? `${item.name} (攻击+${item.attackBonus}) 点击卸下` : SLOT_LABELS.weapon[i]}
                onClick={() => item && onUnequipWeapon?.(i)}
              >
                {item ? (
                  <>
                    <EquipmentPortrait itemId={slot.itemId} />
                    <span className="item-preview">{item.name}</span>
                  </>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
      <div className="equipment-section">
        <span className="section-label">防具</span>
        <div className="slot-row">
          {armors.map((slot, i) => {
            const item = slot?.itemId ? getItemById(slot.itemId) : null
            return (
              <div
                key={`a-${i}`}
                className="equip-slot"
                data-type="armor"
                title={item ? `${item.name} (血量+${item.hpBonus}) 点击卸下` : SLOT_LABELS.armor[i]}
                onClick={() => item && onUnequipArmor?.(i)}
              >
                {item ? (
                  <>
                    <EquipmentPortrait itemId={slot.itemId} />
                    <span className="item-preview">{item.name}</span>
                  </>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

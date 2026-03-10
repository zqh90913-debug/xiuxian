/**
 * 背包 - 每页 5×6 格子，共 20 页
 * 每种道具一格，相同道具堆叠显示数量
 * 突破丹在突破界面使用，直接使用丹（如凝气丹）点击使用，法宝点击可装备
 */
import { useState } from 'react'
import { inventoryToStacks, getItemById, getPillGradeColor, ITEM_TYPES } from '../data/items'
import PillPortrait from './PillPortrait'
import EquipmentPortrait from './EquipmentPortrait'
import EquipWeaponModal from './EquipWeaponModal'
import UsePillModal from './UsePillModal'
import './InventoryPanel.css'

const COLS = 5
const ROWS = 6
const PAGES = 20
const SLOTS_PER_PAGE = COLS * ROWS

export default function InventoryPanel({ inventory = {}, equipment, onEquipWeapon, onUnequipWeapon, onEquipArmor, onUseDirectPill }) {
  const [page, setPage] = useState(0)
  const [equipWeaponStack, setEquipWeaponStack] = useState(null)
  const [usePillStack, setUsePillStack] = useState(null)
  const [equipArmorStack, setEquipArmorStack] = useState(null)

  const stacks = inventoryToStacks(inventory)
  const startIdx = page * SLOTS_PER_PAGE
  const pageStacks = stacks.slice(startIdx, startIdx + SLOTS_PER_PAGE)

  return (
    <div className="inventory-panel gu-panel">
      <div className="inventory-header">
        <h3 className="panel-title">背包</h3>
        <span className="page-info">
          {page + 1} / {PAGES}
        </span>
      </div>
      <div
        className="inventory-grid"
        style={{ '--cols': COLS, '--rows': ROWS }}
      >
        {Array.from({ length: SLOTS_PER_PAGE }, (_, i) => {
          const stack = pageStacks[i]
          if (!stack) {
            return <div key={i} className="inv-slot" />
          }
          const item = getItemById(stack.itemId)
          const isPill = item?.type === ITEM_TYPES.PILL
          const isDirectUsePill = isPill && item?.cultivationGain != null && item.cultivationGain > 0
          const isWeapon = item?.type === ITEM_TYPES.WEAPON
          const isArmor = item?.type === ITEM_TYPES.ARMOR
          const isMaterial = item?.type === ITEM_TYPES.MATERIAL
          const color = (isPill || isWeapon || isArmor) ? getPillGradeColor(item.grade) : (isMaterial && item.tier ? getPillGradeColor(item.tier) : undefined)
          const pillTitle = isDirectUsePill ? '点击使用' : '突破时在突破界面使用'
          return (
            <div
              key={`${stack.itemId}-${i}`}
              className={`inv-slot has-item ${isPill ? 'pill' : ''} ${isWeapon ? 'weapon' : ''} ${isArmor ? 'armor' : ''} ${isMaterial ? 'material' : ''}`}
              style={color ? { borderColor: color } : undefined}
              title={isPill ? pillTitle : isWeapon ? '点击装备法宝' : isArmor ? '点击装备防具' : isMaterial ? '炼丹材料' : undefined}
              onClick={() => {
                if (isWeapon && onEquipWeapon) setEquipWeaponStack(stack)
                else if (isArmor && onEquipArmor) setEquipArmorStack(stack)
                else if (isDirectUsePill && onUseDirectPill) setUsePillStack(stack)
              }}
            >
              {isPill && <PillPortrait itemId={stack.itemId} grade={item.grade} />}
              {(isWeapon || isArmor) && <EquipmentPortrait itemId={stack.itemId} />}
              <span className="item-preview" title={item?.name ?? stack.itemId}>
                {item?.name ?? stack.itemId}
              </span>
              {stack.count > 1 && (
                <span className="item-count">{stack.count}</span>
              )}
            </div>
          )
        })}
      </div>
      <EquipWeaponModal
        show={!!equipWeaponStack}
        item={equipWeaponStack ? getItemById(equipWeaponStack.itemId) : null}
        onClose={() => setEquipWeaponStack(null)}
        onConfirm={() => {
          if (equipWeaponStack && onEquipWeapon) {
            onEquipWeapon(equipWeaponStack.itemId)
            setEquipWeaponStack(null)
          }
        }}
      />
      <EquipWeaponModal
        show={!!equipArmorStack}
        item={equipArmorStack ? getItemById(equipArmorStack.itemId) : null}
        onClose={() => setEquipArmorStack(null)}
        onConfirm={() => {
          if (equipArmorStack && onEquipArmor) {
            onEquipArmor(equipArmorStack.itemId)
            setEquipArmorStack(null)
          }
        }}
      />
      <UsePillModal
        show={!!usePillStack}
        item={usePillStack ? getItemById(usePillStack.itemId) : null}
        onClose={() => setUsePillStack(null)}
        onConfirm={() => {
          if (usePillStack && onUseDirectPill) {
            onUseDirectPill(usePillStack.itemId)
            setUsePillStack(null)
          }
        }}
      />
      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          上一页
        </button>
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.min(PAGES - 1, p + 1))}
          disabled={page === PAGES - 1}
        >
          下一页
        </button>
      </div>

    </div>
  )
}

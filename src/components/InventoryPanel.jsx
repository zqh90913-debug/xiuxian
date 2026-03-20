/**
 * 背包 - 每页 5×6 格子，共 20 页
 * 每种道具一格，相同道具堆叠显示数量
 * 破境丹在突破界面使用，直接使用丹（如养魂丹）点击使用，法宝点击可装备
 */
import { useEffect, useState } from 'react'
import { inventoryToStacks, getItemById, getItemAccentColor, ITEM_TYPES, getItemDisplayGradeLabel } from '../data/items'
import PillPortrait from './PillPortrait'
import EquipmentPortrait from './EquipmentPortrait'
import EquipWeaponModal from './EquipWeaponModal'
import UsePillModal from './UsePillModal'
import './InventoryPanel.css'

const COLS = 5
const ROWS = 6
const SLOTS_PER_PAGE = COLS * ROWS
const FILTER_OPTIONS = [
  { id: 'all', label: '全部物品' },
  { id: ITEM_TYPES.WEAPON, label: '法器' },
  { id: ITEM_TYPES.ARMOR, label: '防具' },
  { id: ITEM_TYPES.PILL, label: '丹药' },
  { id: ITEM_TYPES.MATERIAL, label: '材料' },
]

export default function InventoryPanel({
  inventory = {},
  equipment,
  onEquipWeapon,
  onUnequipWeapon,
  onEquipArmor,
  onUseDirectPill,
  cuitiUsedCount = 0,
  xueUsedCount = 0,
  shenxingUsedCount = 0,
}) {
  const [page, setPage] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const [equipWeaponStack, setEquipWeaponStack] = useState(null)
  const [usePillStack, setUsePillStack] = useState(null)
  const [equipArmorStack, setEquipArmorStack] = useState(null)

  const stacks = inventoryToStacks(inventory)
  const filteredStacks = stacks.filter((stack) => {
    if (activeFilter === 'all') return true
    const item = getItemById(stack.itemId)
    return item?.type === activeFilter
  })
  const totalPages = Math.max(1, Math.ceil(filteredStacks.length / SLOTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages - 1)
  const startIdx = currentPage * SLOTS_PER_PAGE
  const pageStacks = filteredStacks.slice(startIdx, startIdx + SLOTS_PER_PAGE)

  useEffect(() => {
    setPage(0)
  }, [activeFilter])

  useEffect(() => {
    if (page > totalPages - 1) {
      setPage(Math.max(0, totalPages - 1))
    }
  }, [page, totalPages])

  return (
    <div className="inventory-panel gu-panel">
      <div className="inventory-header">
        <h3 className="panel-title">背包</h3>
        <div className="inventory-header-right">
          <span className="page-info">
            {currentPage + 1} / {totalPages}
          </span>
        </div>
      </div>
      <div className="inventory-filters">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`inventory-filter-btn ${activeFilter === option.id ? 'active' : ''}`}
            onClick={() => setActiveFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
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
          const isDirectUsePill = isPill && (item?.cultivationGain != null || item?.directUse)
          const isWeapon = item?.type === ITEM_TYPES.WEAPON
          const isArmor = item?.type === ITEM_TYPES.ARMOR
          const isMaterial = item?.type === ITEM_TYPES.MATERIAL
          const color = (isPill || isWeapon || isArmor || isMaterial) ? getItemAccentColor(item) : undefined
          let pillTitle = isDirectUsePill ? '点击使用' : '突破时在突破界面使用'
          if (isPill && item?.id === 'cuiti_dan') pillTitle = `点击使用（已用 ${cuitiUsedCount}/50）`
          if (isPill && item?.id === 'longli_dan') pillTitle = `点击使用（已用 ${xueUsedCount}/50）`
          if (isPill && item?.id === 'shenxing_dan') pillTitle = `点击使用（已用 ${shenxingUsedCount}/10）`
          const gradeLabel = getItemDisplayGradeLabel(item)
          const baseTitle = item?.name ?? stack.itemId
          const fullTitle = gradeLabel && (isPill || isWeapon || isArmor)
            ? `${baseTitle}（${gradeLabel}）`
            : baseTitle
          return (
            <div
              key={`${stack.itemId}-${i}`}
              className={`inv-slot has-item ${isPill ? 'pill' : ''} ${isWeapon ? 'weapon' : ''} ${isArmor ? 'armor' : ''} ${isMaterial ? 'material' : ''}`}
              style={color ? { borderColor: color } : undefined}
              title={
                isPill
                  ? `${fullTitle}｜${pillTitle}`
                  : isWeapon
                    ? `${fullTitle}｜点击装备法宝`
                    : isArmor
                      ? `${fullTitle}｜点击装备防具`
                      : isMaterial
                        ? `${fullTitle}｜炼丹材料`
                        : fullTitle
              }
              onClick={() => {
                if (isWeapon && onEquipWeapon) setEquipWeaponStack(stack)
                else if (isArmor && onEquipArmor) setEquipArmorStack(stack)
                else if (isDirectUsePill && onUseDirectPill) setUsePillStack(stack)
              }}
            >
              {isPill && <PillPortrait itemId={stack.itemId} grade={item.grade} />}
              {(isWeapon || isArmor) && <EquipmentPortrait itemId={stack.itemId} />}
              <span className="item-preview" title={fullTitle}>
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
          disabled={currentPage === 0}
        >
          上一页
        </button>
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          下一页
        </button>
      </div>

    </div>
  )
}

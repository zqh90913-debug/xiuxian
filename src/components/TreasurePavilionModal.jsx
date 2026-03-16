/**
 * 藏宝阁 - 商店每24h刷新，买光为空，20灵石一键刷新；丹药带立绘
 */
import { useState } from 'react'
import {
  inventoryToStacks,
  getItemById,
  getItemSellPrice,
  getItemBuyPrice,
  getPillGradeColor,
  ITEM_TYPES,
  getGradeLabel,
} from '../data/items'
import PillPortrait from './PillPortrait'
import EquipmentPortrait from './EquipmentPortrait'
import FurnacePortrait from './FurnacePortrait'
import { MATERIAL_SHOP_COUNT } from '../data/items'
import './TreasurePavilionModal.css'

const COLS = 5
const ROWS = 6
const PAGES = 20
const SLOTS_PER_PAGE = COLS * ROWS
const SHOP_SLOTS = 6

export default function TreasurePavilionModal({
  show,
  onClose,
  inventory,
  spiritStones,
  shopItems = [],
  ownedRecipes = [],
  learnedRecipes = [],
  onSell,
  onBuy,
  onForceRefresh,
  refreshCost = 20,
}) {
  const [page, setPage] = useState(0)
  const [itemToSell, setItemToSell] = useState(null)
  const [itemToBuy, setItemToBuy] = useState(null)
  const [sellCount, setSellCount] = useState(1)

  if (!show) return null

  const stacks = inventoryToStacks(inventory ?? {})
  const startIdx = page * SLOTS_PER_PAGE
  const pageStacks = stacks.slice(startIdx, startIdx + SLOTS_PER_PAGE)
  const canRefresh = (spiritStones ?? 0) >= refreshCost

  // 先按类型分组再串起来，保证同类物品连在一起，然后顺序填满 12 个格子
  const validShopItems = (shopItems ?? [])
    .map((id) => ({ id, item: getItemById(id) }))
    .filter(({ item }) => !!item)

  const equips = validShopItems.filter(({ item }) => item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR)
  const furnacesAndRecipes = validShopItems.filter(({ item }) => item.type === ITEM_TYPES.FURNACE || item.type === ITEM_TYPES.RECIPE)
  const others = validShopItems.filter(({ item }) =>
    item.type !== ITEM_TYPES.WEAPON
    && item.type !== ITEM_TYPES.ARMOR
    && item.type !== ITEM_TYPES.FURNACE
    && item.type !== ITEM_TYPES.RECIPE,
  )

  const sortedShopIds = [...equips, ...furnacesAndRecipes, ...others].map(({ id }) => id)

  const handleDragStart = (e, stack) => {
    if (!stack) return
    e.dataTransfer.setData('application/json', JSON.stringify(stack))
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDrop = (e) => {
    e.preventDefault()
    try {
      const stack = JSON.parse(e.dataTransfer.getData('application/json'))
      setItemToSell(stack)
      setSellCount(1)
    } catch (_) {}
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleConfirmSell = () => {
    if (!itemToSell || sellCount < 1) return
    const count = Math.min(sellCount, itemToSell.count)
    onSell(itemToSell.itemId, count)
    setItemToSell(null)
  }

  const handleSelectBuy = (itemId) => {
    const price = getItemBuyPrice(itemId)
    if ((spiritStones ?? 0) >= price) setItemToBuy({ itemId, price })
  }

  const handleConfirmBuy = () => {
    if (!itemToBuy || !onBuy) return
    onBuy(itemToBuy.itemId, itemToBuy.price)
    setItemToBuy(null)
  }

  const sellPrice = itemToSell ? getItemSellPrice(itemToSell.itemId) * (sellCount || 1) : 0

  return (
    <div className="treasure-modal-overlay" onClick={onClose}>
      <div className="treasure-modal-full" onClick={(e) => e.stopPropagation()}>
        <div className="treasure-modal-header">
          <button className="btn-close" onClick={onClose}>返回</button>
          <h3>藏宝阁</h3>
          <span className="spirit-stones">灵石：{(spiritStones ?? 0).toLocaleString()}</span>
        </div>

        <div className="treasure-main">
          <div className="treasure-left">
            <div className="treasure-shop-section gu-panel">
              {/* 商店格子：视觉上三行连在一起，但内部顺序仍按类型分组 */}
              {(() => {
                const slots = sortedShopIds.slice(0, 12)

                return (
                  <div
                    className="shop-grid inventory-grid"
                    style={{ '--cols': 4, '--rows': 3 }}
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const itemId = slots[i]
                      if (!itemId) {
                        return <div key={`shop-empty-${i}`} className="inv-slot shop-slot empty" />
                      }
                      const item = getItemById(itemId)
                      if (!item) return <div key={itemId} className="inv-slot shop-slot empty" />

                      const price = getItemBuyPrice(itemId)
                      const canBuy = (spiritStones ?? 0) >= price
                      const selected = itemToBuy?.itemId === itemId
                      const isPill = item.type === ITEM_TYPES.PILL
                      const isMaterial = item.type === ITEM_TYPES.MATERIAL
                      const isFurnace = item.type === ITEM_TYPES.FURNACE
                      const isRecipe = item.type === ITEM_TYPES.RECIPE
                      const isEquip = item.type === ITEM_TYPES.WEAPON || item.type === ITEM_TYPES.ARMOR

                      const borderColor =
                        item.grade != null
                          ? getPillGradeColor(item.grade)
                          : item.tier != null
                            ? getPillGradeColor(item.tier)
                            : item.pillId
                              ? getPillGradeColor(getItemById(item.pillId)?.grade)
                              : undefined

                      const gradeLabel =
                        item.grade != null
                          ? getGradeLabel(item.grade)
                          : item.pillId && getItemById(item.pillId)?.grade != null
                            ? getGradeLabel(getItemById(item.pillId).grade)
                            : undefined

                      const fullName = gradeLabel ? `${item.name}（${gradeLabel}）` : item.name
                      const recipeOwnedOrLearned =
                        isRecipe
                        && (ownedRecipes.includes(item.id)
                          || learnedRecipes.includes(item.pillId))

                      return (
                        <div
                          key={itemId}
                          className={`inv-slot shop-slot has-item ${canBuy ? 'can-buy' : ''} ${selected ? 'selected' : ''}`}
                          style={{ borderColor: borderColor || 'var(--slot-border)' }}
                          onClick={() => canBuy && handleSelectBuy(itemId)}
                        >
                          {isPill && (
                            <PillPortrait itemId={itemId} grade={item.grade} className="shop-pill-portrait" />
                          )}
                          {isEquip && (
                            <EquipmentPortrait itemId={itemId} className="shop-equip-portrait" />
                          )}
                          {isFurnace && (
                            <FurnacePortrait itemId={itemId} className="shop-equip-portrait" />
                          )}
                          {!isPill && !isFurnace && !isEquip && (
                            <span className="shop-item-type-tag">
                              {isMaterial ? `材料×${MATERIAL_SHOP_COUNT}` : '其他'}
                            </span>
                          )}
                          <span className="item-preview shop-item-name" title={fullName}>
                            {item.name}
                          </span>
                          {recipeOwnedOrLearned && (
                            <span className="shop-item-owned-tag">已获得</span>
                          )}
                          <span className="shop-item-price">{price.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}

              {/* 购买确认、刷新与贩卖逻辑保持不变 */}
              {itemToBuy && (
                <div className="buy-confirm-row">
                  <span className="buy-preview">
                    {getItemById(itemToBuy.itemId)?.name} · {itemToBuy.price.toLocaleString()} 灵石
                  </span>
                  <button type="button" className="btn-confirm-buy" onClick={handleConfirmBuy}>
                    确认购买
                  </button>
                </div>
              )}
              <div className="shop-refresh-row">
                <button
                  type="button"
                  className="btn-refresh-shop"
                  disabled={!canRefresh}
                  onClick={onForceRefresh}
                >
                  一键刷新（{refreshCost} 灵石）
                </button>
              </div>
              <div
                className="sell-zone"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {itemToSell ? (
                  <div className="sell-preview">
                    {(() => {
                      const it = getItemById(itemToSell.itemId)
                      if (it?.type === ITEM_TYPES.PILL) return <PillPortrait itemId={itemToSell.itemId} className="sell-pill-portrait" />
                      if (it?.type === ITEM_TYPES.WEAPON || it?.type === ITEM_TYPES.ARMOR) return <EquipmentPortrait itemId={itemToSell.itemId} className="sell-equip-portrait" />
                      return null
                    })()}
                    <span className="sell-item-name">
                      {(() => {
                        const it = getItemById(itemToSell.itemId)
                        if (!it) return itemToSell.itemId
                        const baseName = it.name ?? itemToSell.itemId
                        const showGrade = (it.type === ITEM_TYPES.PILL || it.type === ITEM_TYPES.WEAPON || it.type === ITEM_TYPES.ARMOR) && it.grade != null
                        return showGrade ? `${baseName}（${getGradeLabel(it.grade)}）` : baseName
                      })()}
                    </span>
                    <div className="sell-count-row">
                      <input
                        type="number"
                        min={1}
                        max={itemToSell.count}
                        value={sellCount}
                        onChange={(e) => setSellCount(Math.max(1, Math.min(itemToSell.count, +e.target.value || 1)))}
                      />
                      <span>/ {itemToSell.count}</span>
                    </div>
                    <span className="sell-price">售价：{sellPrice.toLocaleString()} 灵石</span>
                  </div>
                ) : (
                  <span className="sell-placeholder">拖入道具出售</span>
                )}
              </div>
              {itemToSell && (
                <button className="btn-confirm-sell" onClick={handleConfirmSell}>
                  确定贩卖
                </button>
              )}
            </div>
          </div>

          <div className="treasure-inventory-section gu-panel">
            <h4>背包</h4>
            <div
              className="treasure-inv-grid inventory-grid"
              style={{ '--cols': 5, '--rows': 6 }}
            >
            {Array.from({ length: SLOTS_PER_PAGE }, (_, i) => {
              const stack = pageStacks[i]
              if (!stack) {
                return <div key={i} className="inv-slot treasure-inv-slot" />
              }
              const item = getItemById(stack.itemId)
              const isPill = item?.type === ITEM_TYPES.PILL
              return (
                <div
                  key={`${stack.itemId}-${i}`}
                  className={`inv-slot treasure-inv-slot has-item ${isPill ? 'pill' : ''}`}
                  style={isPill ? { borderColor: getPillGradeColor(item.grade) } : undefined}
                  draggable
                  onDragStart={(e) => handleDragStart(e, stack)}
                >
                  {isPill ? (
                    <PillPortrait itemId={stack.itemId} grade={item.grade} />
                  ) : null}
                  <span className="item-preview" title={item?.name}>
                    {item?.name ?? stack.itemId}
                  </span>
                  {stack.count > 1 && <span className="item-count">{stack.count}</span>}
                </div>
              )
            })}
          </div>
          <div className="treasure-pagination">
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              上一页
            </button>
            <span>{page + 1} / {PAGES}</span>
            <button
              className="page-btn"
              onClick={() => setPage((p) => Math.min(PAGES - 1, p + 1))}
              disabled={page === PAGES - 1}
            >
              下一页
            </button>
          </div>
        </div>

      </div>
    </div>
    </div>
  )
}

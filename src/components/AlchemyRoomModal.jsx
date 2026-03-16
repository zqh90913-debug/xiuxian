/**
 * 炼丹房：上半炼制区（已学丹方对应丹药 + 丹炉槽），下半丹方区（使用丹方解锁炼制）
 */
import { useState, useEffect } from 'react'
import { getItemById, getPillGradeColor, getGradeLabel } from '../data/items'
import {
  getRecipe,
  getFurnace,
  getCraftSuccessRate,
  getCraftRecipeMaterials,
  canCraftWithInventory,
  CRAFT_DURATION_MS,
} from '../data/alchemy'
import PillPortrait from './PillPortrait'
import FurnacePortrait from './FurnacePortrait'
import './AlchemyRoomModal.css'

export default function AlchemyRoomModal({
  show,
  onClose,
  learnedRecipes = [],
  ownedRecipes = [],
  ownedFurnaces = [],
  equippedFurnaceId = null,
  inventory = {},
  lastCraftResult = null,
  onClearCraftResult,
  onUseRecipe,
  onEquipFurnace,
  onCraft,
}) {
  const [recipeToUse, setRecipeToUse] = useState(null)
  const [pillToCraft, setPillToCraft] = useState(null)
  const [craftProgress, setCraftProgress] = useState(0)
  const [craftingPillId, setCraftingPillId] = useState(null)
  const [showFurnacePicker, setShowFurnacePicker] = useState(false)

  useEffect(() => {
    if (!lastCraftResult || !onClearCraftResult) return
    const t = setTimeout(() => onClearCraftResult(), 3000)
    return () => clearTimeout(t)
  }, [lastCraftResult, onClearCraftResult])

  if (!show) return null

  const learnedPillIds = [...new Set(learnedRecipes)]
    .map((id) => getItemById(id)?.type === 'pill' ? id : null)
    .filter(Boolean)
    .sort((a, b) => (getItemById(b)?.grade ?? 0) - (getItemById(a)?.grade ?? 0))
  const canCraft = (pillId) => canCraftWithInventory(pillId, inventory)
  const isCrafting = craftingPillId != null && craftProgress < 1

  const handleStartCraft = (pillId) => {
    if (!canCraft(pillId) || isCrafting || !onCraft) return
    setPillToCraft(pillId)
  }

  const handleConfirmCraft = () => {
    if (!pillToCraft || !onCraft) return
    const pillId = pillToCraft
    setCraftingPillId(pillId)
    setPillToCraft(null)
    setCraftProgress(0)
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / CRAFT_DURATION_MS)
      setCraftProgress(p)
      if (p >= 1) {
        onCraft(pillId)
        setCraftingPillId(null)
        setCraftProgress(0)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const recipeCards = ownedRecipes.map((rid) => getRecipe(rid)).filter(Boolean)
  const furnace = equippedFurnaceId ? getFurnace(equippedFurnaceId) : null

  return (
    <div className="alchemy-room-overlay">
      <div className="alchemy-room-modal">
        <div className="alchemy-room-header">
          <button type="button" className="btn-back" onClick={onClose}>返回</button>
          <h3>炼丹房</h3>
        </div>

        <div className="alchemy-room-upper gu-panel">
          <h4>炼制</h4>
          {lastCraftResult && (
            <div className={`alchemy-craft-result ${lastCraftResult.success ? 'success' : 'fail'}`}>
              {lastCraftResult.success
                ? `炼制成功，获得 ${lastCraftResult.count} 颗${getItemById(lastCraftResult.pillId)?.name ?? lastCraftResult.pillId}`
                : '炼制失败'}
            </div>
          )}
          <div className="alchemy-craft-row">
            <div className="alchemy-craft-list">
              {learnedPillIds.length === 0 ? (
                <div className="alchemy-empty">请先在下方使用丹方解锁可炼制丹药。</div>
              ) : (
                learnedPillIds.map((pillId) => {
                  const pill = getItemById(pillId)
                  if (!pill || pill.type !== 'pill') return null
                  const successRate = getCraftSuccessRate(pillId, equippedFurnaceId)
                  const canStart = canCraft(pillId) && !isCrafting
                  const materials = getCraftRecipeMaterials(pillId)
                  const materialText = Object.entries(materials).length === 0
                    ? '无'
                    : Object.entries(materials).map(([mid, n]) => `${getItemById(mid)?.name ?? mid}×${n}`).join('、')
                  const gradeLabel = pill.grade != null ? getGradeLabel(pill.grade) : ''
                  return (
                    <div key={pillId} className="alchemy-craft-card">
                      <PillPortrait
                        itemId={pillId}
                        grade={pill.grade}
                        className="alchemy-pill-portrait"
                      />
                      <div className="alchemy-craft-info">
                        <span className="alchemy-pill-name" style={{ color: getPillGradeColor(pill.grade) }}>
                          {pill.name}
                          {gradeLabel && `（${gradeLabel}）`}
                        </span>
                        <span className="alchemy-craft-meta">所需材料：{materialText}</span>
                        <span className="alchemy-craft-meta">成功率：{successRate}%</span>
                        <button
                          type="button"
                          className="btn-craft"
                          disabled={!canStart}
                          onClick={() => handleStartCraft(pillId)}
                        >
                          炼制
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="alchemy-furnace-slot gu-panel">
              <span className="furnace-slot-label">丹炉</span>
              <div
                className="furnace-slot-inner"
                onClick={() => setShowFurnacePicker(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowFurnacePicker(true)}
              >
                {furnace ? (
                  <>
                    <FurnacePortrait itemId={equippedFurnaceId} className="furnace-slot-portrait" />
                    <span className="furnace-name">{furnace.name}</span>
                  </>
                ) : (
                  <span className="furnace-empty">点击选择</span>
                )}
              </div>
            </div>
          </div>
          {isCrafting && (
            <div className="alchemy-progress-wrap">
              <div className="alchemy-progress-bar" style={{ width: `${craftProgress * 100}%` }} />
              <span className="alchemy-progress-text">炼制中… {Math.round(craftProgress * 100)}%</span>
            </div>
          )}
          {pillToCraft && !isCrafting && (
            <div className="alchemy-confirm-craft gu-panel">
              <p>确定炼制《{getItemById(pillToCraft)?.name}》？</p>
              <div className="alchemy-confirm-actions">
                <button type="button" onClick={() => setPillToCraft(null)}>取消</button>
                <button type="button" className="btn-confirm" onClick={handleConfirmCraft}>确定</button>
              </div>
            </div>
          )}
        </div>

        {showFurnacePicker && (
          <div className="alchemy-furnace-picker gu-panel">
            <h4>选择丹炉</h4>
            <div className="furnace-picker-list">
              {ownedFurnaces.map((fid) => {
                const f = getFurnace(fid)
                if (!f) return null
                const isEquipped = equippedFurnaceId === fid
                return (
                  <button
                    key={fid}
                    type="button"
                    className={`furnace-picker-item ${isEquipped ? 'equipped' : ''}`}
                    onClick={() => {
                      onEquipFurnace?.(fid)
                      setShowFurnacePicker(false)
                    }}
                  >
                    <FurnacePortrait itemId={fid} className="furnace-picker-portrait" />
                    {f.name}（+{f.successBonus}%）
                  </button>
                )
              })}
            </div>
            <button type="button" className="btn-close-picker" onClick={() => setShowFurnacePicker(false)}>
              关闭
            </button>
          </div>
        )}

        <div className="alchemy-room-lower gu-panel">
          <h4>丹方</h4>
          {recipeCards.length === 0 ? (
            <div className="alchemy-empty">暂无丹方。</div>
          ) : (
            <div className="alchemy-recipe-list">
              {recipeCards.map((rec) => (
                <div key={rec.id} className="alchemy-recipe-card">
                  <span className="recipe-name">{rec.name}</span>
                  <span className="recipe-pill">→ {getItemById(rec.pillId)?.name}</span>
                  <button type="button" className="btn-use-recipe" onClick={() => setRecipeToUse(rec)}>
                    使用
                  </button>
                </div>
              ))}
            </div>
          )}
          {recipeToUse && (
            <div className="alchemy-confirm-use gu-panel">
              <p>确定使用《{recipeToUse.name}》？使用后可炼制{getItemById(recipeToUse.pillId)?.name}。</p>
              <div className="alchemy-confirm-actions">
                <button type="button" onClick={() => setRecipeToUse(null)}>取消</button>
                <button
                  type="button"
                  className="btn-confirm"
                  onClick={() => {
                    onUseRecipe?.(recipeToUse.id)
                    setRecipeToUse(null)
                  }}
                >
                  确定
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

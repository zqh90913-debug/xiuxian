/**
 * 突破境界确认弹窗
 * 小境界直接突破；大境界显示成功率，左下方使用对应丹药，右下方确认突破
 */
import { getPillIdForRealm, getItemById } from '../data/items'
import './BreakthroughModal.css'

export default function BreakthroughModal({
  show,
  onClose,
  onConfirm,
  onUsePillInBreakthrough,
  currentRealm,
  nextRealm,
  nextRealmIndex,
  required,
  isBigRealmBreak,
  successRate,
  pillBonus = 0,
  failed,
  inventory = {},
  aidOptions = [],
  aidUsedItemId = null,
  requiresWudaoTeaToBreak = false,
  isAscensionBreak = false,
  canConfirm = true,
}) {
  if (!show) return null

  const pillId = isBigRealmBreak && nextRealmIndex != null ? getPillIdForRealm(nextRealmIndex) : null
  const pill = pillId ? getItemById(pillId) : null
  const hasPill = pillId && (inventory[pillId] ?? 0) > 0
  const breakthroughAidItems = aidOptions.map((id) => getItemById(id)).filter(Boolean)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>突破境界</h3>
        <p className="realm-flow">
          <span className="from">{currentRealm}</span>
          <span className="arrow">→</span>
          <span className="to">{nextRealm}</span>
        </p>
        <p className="cost">消耗 {required.toLocaleString()} 修为</p>
        {isBigRealmBreak && (
          <p className="success-rate">成功率 {successRate}%{pillBonus > 0 ? `（含丹药+${pillBonus}%）` : ''}</p>
        )}
        {requiresWudaoTeaToBreak && (
          <p className="tip">
            {aidUsedItemId === 'wudao_tea'
              ? '悟道茶已备妥，可借此契机冲击闻道期。'
              : '从问鼎期圆满突破闻道期需要先使用悟道茶；若无悟道茶，则当前无法突破。'}
          </p>
        )}
        {isAscensionBreak && (
          <p className="tip">飞升只有 50% 成功率，且有 5% 概率跌落回元婴期，任何丹药与天材地宝都无法提高成功率。</p>
        )}
        {failed ? (
          <p className="breakthrough-failed">突破失败！修为尽散，请继续修炼后再次尝试。</p>
        ) : (
          <p className="tip">突破后修炼效率提升，但下次突破所需修为将大幅增加</p>
        )}
        <div className="breakthrough-actions">
          {isBigRealmBreak && !isAscensionBreak && pill && (
            <div className="breakthrough-left">
              <button
                type="button"
                className="btn-use-pill"
                disabled={!hasPill}
                onClick={() => hasPill && onUsePillInBreakthrough?.(pillId)}
              >
                使用{pill.name}
              </button>
              {!hasPill && <span className="pill-hint">背包中暂无</span>}
            </div>
          )}
          {isBigRealmBreak && breakthroughAidItems.length > 0 && (
            <div className="breakthrough-left">
              {breakthroughAidItems.map((item) => {
                const hasItem = (inventory[item.id] ?? 0) > 0
                const used = aidUsedItemId === item.id
                const disabled = !hasItem || Boolean(aidUsedItemId)
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="btn-use-pill"
                    disabled={disabled}
                    onClick={() => !disabled && onUsePillInBreakthrough?.(item.id)}
                  >
                    {used ? `已用${item.name}` : `使用${item.name}`}
                  </button>
                )
              })}
            </div>
          )}
          <div className="breakthrough-right">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="button" className="btn-confirm" disabled={!canConfirm} onClick={onConfirm}>确认突破</button>
          </div>
        </div>
      </div>
    </div>
  )
}

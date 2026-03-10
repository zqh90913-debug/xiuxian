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
}) {
  if (!show) return null

  const pillId = isBigRealmBreak && nextRealmIndex != null ? getPillIdForRealm(nextRealmIndex) : null
  const pill = pillId ? getItemById(pillId) : null
  const hasPill = pillId && (inventory[pillId] ?? 0) > 0

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
        {failed ? (
          <p className="breakthrough-failed">突破失败！修为尽散，请继续修炼后再次尝试。</p>
        ) : (
          <p className="tip">突破后修炼效率提升，但下次突破所需修为将大幅增加</p>
        )}
        <div className="breakthrough-actions">
          {isBigRealmBreak && pill && (
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
          <div className="breakthrough-right">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="button" className="btn-confirm" onClick={onConfirm}>确认突破</button>
          </div>
        </div>
      </div>
    </div>
  )
}

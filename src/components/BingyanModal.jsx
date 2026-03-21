/**
 * 兵演：嵌入演武页（图鉴 + 战斗，见 public/bingyan-sim）
 */
import './BingyanModal.css'

const IFRAME_SRC = `${import.meta.env.BASE_URL}bingyan-sim/bingyan.html`

export default function BingyanModal({ show, onClose }) {
  if (!show) return null

  return (
    <div className="bingyan-overlay bingyan-gacha-root" role="dialog" aria-modal="true" aria-label="兵演">
      <div className="bingyan-gacha-bar gu-panel">
        <button type="button" className="btn-bingyan-gacha-back" onClick={onClose}>
          返回论道阁
        </button>
        <h3 className="bingyan-gacha-title">兵演 · 演武</h3>
        <span className="bingyan-gacha-hint">左下角打开「图鉴」或「战斗」</span>
      </div>
      <iframe title="兵演演武" className="bingyan-gacha-iframe" src={IFRAME_SRC} />
    </div>
  )
}

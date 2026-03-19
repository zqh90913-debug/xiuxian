/**
 * 主角立绘：当前保留空白占位，后续可继续接入正式立绘
 */
import './CharacterPortrait.css'

export default function CharacterPortrait({ isCultivating, onToggleStats, src = null }) {
  return (
    <div
      className={`character-portrait ${isCultivating ? 'cultivating' : ''}`}
      onClick={onToggleStats}
    >
      <div className="portrait-glow" />
      {isCultivating && (
        <>
          <div className="portrait-aura" />
          <div className="portrait-particle portrait-particle-1" />
          <div className="portrait-particle portrait-particle-2" />
          <div className="portrait-particle portrait-particle-3" />
          <div className="portrait-particle portrait-particle-4" />
          <div className="portrait-particle portrait-particle-5" />
        </>
      )}
      {src ? (
        <img
          className="portrait-image"
          src={src}
          alt="主角立绘"
        />
      ) : (
        <div className="portrait-placeholder">立绘待添加</div>
      )}
    </div>
  )
}

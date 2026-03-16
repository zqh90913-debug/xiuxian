/**
 * 主角立绘：使用外部插画作为主界面角色，修炼时有灵气特效
 */
import './CharacterPortrait.css'

export default function CharacterPortrait({ isCultivating, onToggleStats }) {
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
      <img
        className="portrait-image"
        src="/main-character.png"
        alt="主角立绘"
      />
    </div>
  )
}

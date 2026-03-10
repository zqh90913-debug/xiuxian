/**
 * 主角立绘 - 修行中的修士
 * 使用 SVG 绘制古典修仙风格角色
 */
import './CharacterPortrait.css'

export default function CharacterPortrait({ isCultivating }) {
  return (
    <div className={`character-portrait ${isCultivating ? 'cultivating' : ''}`}>
      <div className="portrait-glow" />
      <svg
        className="portrait-svg"
        viewBox="0 0 200 320"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 背景光晕 */}
        <defs>
          <linearGradient id="robeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d2d1e" />
            <stop offset="100%" stopColor="#1f1510" />
          </linearGradient>
          <linearGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#c9a227" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#9a7b1a" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 腿部/打坐姿态 */}
        <ellipse cx="100" cy="280" rx="55" ry="12" fill="#1f1510" />
        <path
          d="M 55 180 L 55 280 Q 100 260 145 280 L 145 180 Z"
          fill="url(#robeGrad)"
          stroke="#5c4a35"
          strokeWidth="1"
        />

        {/* 道袍身体 */}
        <path
          d="M 70 100 L 70 180 L 130 180 L 130 100 Q 100 90 70 100 Z"
          fill="url(#robeGrad)"
          stroke="#5c4a35"
          strokeWidth="1"
        />

        {/* 衣领 */}
        <path d="M 85 100 L 100 115 L 115 100" fill="none" stroke="#7d6b5a" strokeWidth="2" />

        {/* 头部 */}
        <ellipse cx="100" cy="75" rx="28" ry="32" fill="#e8dcc8" stroke="#c9a227" strokeWidth="1" />

        {/* 发髻 */}
        <path
          d="M 72 55 Q 100 35 128 55 Q 125 75 100 85 Q 75 75 72 55 Z"
          fill="#2d1f1f"
        />

        {/* 眉心/修行光点 */}
        <circle
          cx="100"
          cy="70"
          r={isCultivating ? 4 : 2}
          fill="#c9a227"
          filter="url(#glow)"
          className="third-eye"
        />

        {/* 双手结印 */}
        <g transform="translate(100, 130)">
          <ellipse cx="-20" cy="0" rx="12" ry="18" fill="#e8d5b7" />
          <ellipse cx="20" cy="0" rx="12" ry="18" fill="#e8d5b7" />
          <path
            d="M -15 -5 Q 0 5 15 -5"
            fill="none"
            stroke="#8b7355"
            strokeWidth="1.5"
          />
        </g>

        {/* 灵气粒子 - 修行时显示 */}
        {isCultivating && (
          <>
            <circle cx="60" cy="120" r="2" fill="#c9a227" opacity="0.8" className="particle">
              <animate attributeName="cy" values="120;80;120" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="120" r="2" fill="#c9a227" opacity="0.8" className="particle">
              <animate attributeName="cy" values="120;80;120" dur="2.2s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="50" r="1.5" fill="#d4af37" opacity="0.6" className="particle">
              <animate attributeName="opacity" values="0.3;0.9;0.3" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
      </svg>
    </div>
  )
}

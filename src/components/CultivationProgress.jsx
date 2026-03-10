/**
 * 修行进度条 - 10秒读条，完成后增加修为
 */
import './CultivationProgress.css'

export default function CultivationProgress({
  progress,
  isCultivating,
  onStart,
  duration,
}) {
  const remaining = isCultivating
    ? Math.ceil((1 - progress) * duration)
    : duration

  return (
    <div className="cultivation-progress-wrap">
      <div className="progress-label">
        {isCultivating ? (
          <span>修行中... {remaining}秒</span>
        ) : (
          <span>点击开始修行</span>
        )}
      </div>
      <div
        className="progress-track"
        onClick={!isCultivating ? onStart : undefined}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (!isCultivating && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onStart()
          }
        }}
        aria-label={isCultivating ? '修行进行中' : '点击开始修行'}
      >
        <div
          className="progress-fill"
          style={{ width: `${progress * 100}%` }}
        />
        <div className="progress-glow" style={{ width: `${progress * 100}%` }} />
      </div>
      <p className="progress-hint">每次修行需 {duration} 秒，完成后获得修为</p>
    </div>
  )
}

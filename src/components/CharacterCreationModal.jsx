import { useEffect, useMemo, useState } from 'react'
import {
  ELEMENT_OPTIONS,
  ENRICHED_BACKGROUND_OPTIONS,
  ENRICHED_DESTINY_OPTIONS,
  GENDER_OPTIONS,
  getCharacterSelection,
  getSpiritRootOptionByElements,
} from '../data/characterCreation'
import './CharacterCreationModal.css'

const CREATION_STEPS = [
  { id: 'name', title: '定姓名', subtitle: '先为这一世的修行者留下名号。' },
  { id: 'gender', title: '定性别', subtitle: '人物设定独立成页，后续可单独挂立绘。' },
  { id: 'spiritRoot', title: '定灵根', subtitle: '灵根组合决定你的修炼效率、战斗倾向与灵材消耗。' },
  { id: 'background', title: '定家境', subtitle: '从帝王将相到乞儿寒户，不同出身带来不同起点。' },
  { id: 'destiny', title: '定机遇', subtitle: '这一世能走多远，往往从一场偶遇开始。' },
]

function OptionCard({ option, active, onSelect }) {
  return (
    <button
      type="button"
      className={`creation-option gu-panel ${active ? 'creation-option-active' : ''}`}
      onClick={onSelect}
    >
      <span className="creation-option-label">{option.label}</span>
      <span className="creation-option-title">{option.title}</span>
      <span className="creation-option-desc">{option.description}</span>
      {option.type && <span className="creation-option-tag">{option.type}</span>}
      <span className="creation-option-effect">{option.effectSummary}</span>
    </button>
  )
}

export default function CharacterCreationModal({ show, draft, onChange, onConfirm, onOpenLoad, onStartNew }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [screen, setScreen] = useState('entry')

  useEffect(() => {
    if (show) {
      setStepIndex(0)
      setScreen('entry')
    }
  }, [show])

  const currentStep = CREATION_STEPS[stepIndex]
  const selected = useMemo(() => getCharacterSelection(draft), [draft])
  const selectedSpiritRoot = useMemo(() => getSpiritRootOptionByElements(draft.spiritRoot), [draft.spiritRoot])

  if (!show) return null

  const canGoNext = () => {
    if (currentStep.id === 'name') return String(draft.name ?? '').trim().length > 0
    if (currentStep.id === 'spiritRoot') return Array.isArray(draft.spiritRoot) && draft.spiritRoot.length > 0
    return Boolean(draft[currentStep.id])
  }

  const toggleSpiritElement = (elementId) => {
    const current = Array.isArray(draft.spiritRoot) ? draft.spiritRoot : []
    if (current.includes(elementId)) {
      onChange({ spiritRoot: current.filter((id) => id !== elementId) })
      return
    }
    if (current.length >= 5) return
    onChange({ spiritRoot: [...current, elementId] })
  }

  const handleNext = () => {
    if (!canGoNext()) return
    if (stepIndex === CREATION_STEPS.length - 1) {
      onConfirm()
      return
    }
    setStepIndex((value) => value + 1)
  }

  const renderStepBody = () => {
    if (currentStep.id === 'name') {
      return (
        <div className="creation-single-pane gu-panel">
          <div className="creation-step-copy">
            <p className="creation-step-heading">姓名</p>
            <p className="creation-step-text">这个名字会出现在主界面标题、人物面板和存档栏位里。</p>
          </div>
          <input
            className="creation-name-input creation-name-input-large"
            value={draft.name}
            maxLength={12}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="请输入姓名"
          />
        </div>
      )
    }

    if (currentStep.id === 'gender') {
      return (
        <div className="creation-gender-layout">
          <div className="creation-gender-portrait gu-panel">
            <div className="creation-gender-image creation-portrait-placeholder">立绘待添加</div>
            <div className="creation-gender-caption">
              <span>{selected.gender.label}</span>
              <span>当前仅保留立绘位置，后续可直接替换成正式形象。</span>
            </div>
          </div>
          <div className="creation-option-grid creation-option-grid-narrow">
            {GENDER_OPTIONS.map((option) => (
              <OptionCard
                key={option.id}
                option={{ ...option, effectSummary: '当前会切换初始立绘，后续也可继续细分专属形象。' }}
                active={draft.gender === option.id}
                onSelect={() => onChange({ gender: option.id })}
              />
            ))}
          </div>
        </div>
      )
    }

    if (currentStep.id === 'spiritRoot') {
      return (
        <div className="creation-root-builder">
          <div className="creation-element-grid">
            {ELEMENT_OPTIONS.map((option) => {
              const active = Array.isArray(draft.spiritRoot) && draft.spiritRoot.includes(option.id)
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`creation-element-chip ${active ? 'creation-element-chip-active' : ''}`}
                  onClick={() => toggleSpiritElement(option.id)}
                >
                  <span className="creation-element-label">{option.label}</span>
                  <span className="creation-element-type">{option.type}</span>
                </button>
              )
            })}
          </div>
          <div className="creation-root-hint">最多可选五种灵气。再次点击可取消，组合结果会在下方实时显示。</div>
          <div className="creation-root-result gu-panel">
            <div className="creation-root-result-header">
              <span className="creation-root-result-name">{selectedSpiritRoot.label || '未定灵根'}</span>
              <span className="creation-root-result-type">{selectedSpiritRoot.title}</span>
            </div>
            <div className="creation-root-result-elements">
              {(selectedSpiritRoot.elements ?? []).map((element) => (
                <span key={element} className="creation-root-result-pill">{element}</span>
              ))}
            </div>
            <p className="creation-root-result-desc">{selectedSpiritRoot.description}</p>
            <p className="creation-root-result-effect">{selectedSpiritRoot.effectSummary || '请选择至少一种灵气。'}</p>
          </div>
        </div>
      )
    }

    if (currentStep.id === 'background') {
      return (
        <div className="creation-option-grid">
          {ENRICHED_BACKGROUND_OPTIONS.map((option) => (
            <OptionCard
              key={option.id}
              option={option}
              active={draft.background === option.id}
              onSelect={() => onChange({ background: option.id })}
            />
          ))}
        </div>
      )
    }

    return (
      <div className="creation-option-grid">
        {ENRICHED_DESTINY_OPTIONS.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            active={draft.destiny === option.id}
            onSelect={() => onChange({ destiny: option.id })}
          />
        ))}
      </div>
    )
  }

  if (screen === 'entry') {
    return (
      <div className="creation-overlay">
        <div className="creation-backdrop" />
        <div className="creation-entry-modal gu-panel">
          <h2 className="creation-title">修仙传</h2>
          <p className="creation-subtitle">进入山门之前，先决定是接续旧路，还是重开此生。</p>
          <div className="creation-entry-actions">
            <button type="button" className="creation-entry-btn creation-entry-btn-primary" onClick={onOpenLoad}>
              读取存档
            </button>
            <button
              type="button"
              className="creation-entry-btn"
              onClick={() => {
                onStartNew?.()
                setScreen('creation')
              }}
            >
              重新创建角色
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="creation-overlay">
      <div className="creation-backdrop" />
      <div className="creation-modal gu-panel">
        <div className="creation-header">
          <div>
            <h2 className="creation-title">{currentStep.title}</h2>
            <p className="creation-subtitle">{currentStep.subtitle}</p>
          </div>
          <button type="button" className="creation-load-btn" onClick={onOpenLoad}>
            读取旧档
          </button>
        </div>

        <div className="creation-progress">
          {CREATION_STEPS.map((step, index) => (
            <div
              key={step.id}
              className={`creation-progress-item ${index === stepIndex ? 'active' : ''} ${index < stepIndex ? 'done' : ''}`}
            >
              <span className="creation-progress-index">{index + 1}</span>
              <span className="creation-progress-label">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="creation-body">
          <section className="creation-stage">
            {renderStepBody()}
          </section>

          <aside className="creation-preview gu-panel">
            <div className="creation-preview-portrait-wrap">
              <div className="creation-preview-portrait creation-portrait-placeholder">立绘待添加</div>
            </div>
            <h3 className="creation-preview-title">当前命格</h3>
            <div className="creation-preview-row">
              <span>姓名</span>
              <span>{draft.name || '未定'}</span>
            </div>
            <div className="creation-preview-row">
              <span>性别</span>
              <span>{selected.gender.label}</span>
            </div>
            <div className="creation-preview-row">
              <span>灵根</span>
              <span>{selected.spiritRoot.label}</span>
            </div>
            <div className="creation-preview-row">
              <span>家境</span>
              <span>{selected.background.label}</span>
            </div>
            <div className="creation-preview-row">
              <span>机遇</span>
              <span>{selected.destiny.label}</span>
            </div>
            <p className="creation-preview-summary">
              {draft.name || '无名散修'}今生具备{selected.spiritRoot.label}，生于{selected.background.label}，又因{selected.destiny.label}踏入仙途。
            </p>
          </aside>
        </div>

        <div className="creation-footer">
          <button
            type="button"
            className="creation-secondary-btn"
            disabled={stepIndex === 0}
            onClick={() => setStepIndex((value) => Math.max(0, value - 1))}
          >
            上一步
          </button>
          <button
            type="button"
            className="creation-confirm-btn"
            disabled={!canGoNext()}
            onClick={handleNext}
          >
            {stepIndex === CREATION_STEPS.length - 1 ? '开始修仙' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * 道合归一：2048 小游戏，上下左右移动合并，无法移动时结算得分
 */
import { useState, useEffect, useCallback } from 'react'
import './Game2048.css'

const SIZE = 4
const HIGH_SCORE_KEY = 'game2048_high_score'

function getStoredHighScore() {
  try {
    const n = parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10)
    return Number.isFinite(n) ? n : 0
  } catch (_) {
    return 0
  }
}

function setStoredHighScore(value) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(value))
  } catch (_) {}
}

function createEmptyGrid() {
  return Array(SIZE * SIZE).fill(0)
}

function getEmptyIndices(grid) {
  return grid.map((v, i) => (v === 0 ? i : -1)).filter((i) => i >= 0)
}

function spawnTile(grid) {
  const empty = getEmptyIndices(grid)
  if (empty.length === 0) return grid
  const next = [...grid]
  const idx = empty[Math.floor(Math.random() * empty.length)]
  next[idx] = Math.random() < 0.9 ? 2 : 4
  return next
}

function slideAndMerge(line) {
  const filtered = line.filter((v) => v !== 0)
  const merged = []
  const mergedPositions = [] // 合并后值所在的行内位置（0~3）
  let addScore = 0
  let i = 0
  let outIdx = 0
  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const v = filtered[i] * 2
      merged.push(v)
      mergedPositions.push(outIdx)
      addScore += v
      outIdx++
      i += 2
    } else {
      merged.push(filtered[i])
      outIdx++
      i += 1
    }
  }
  while (merged.length < SIZE) merged.push(0)
  return { row: merged.slice(0, SIZE), addScore, mergedPositions }
}

function moveLeft(grid) {
  let addScore = 0
  const mergedIndices = []
  const next = [...grid]
  for (let i = 0; i < SIZE; i++) {
    const row = [next[i * 4], next[i * 4 + 1], next[i * 4 + 2], next[i * 4 + 3]]
    const { row: newRow, addScore: s, mergedPositions } = slideAndMerge(row)
    addScore += s
    for (let j = 0; j < SIZE; j++) next[i * 4 + j] = newRow[j]
    mergedPositions.forEach((j) => mergedIndices.push(i * 4 + j))
  }
  return { grid: next, addScore, mergedIndices }
}

function moveRight(grid) {
  let addScore = 0
  const mergedIndices = []
  const next = [...grid]
  for (let i = 0; i < SIZE; i++) {
    const row = [next[i * 4 + 3], next[i * 4 + 2], next[i * 4 + 1], next[i * 4]]
    const { row: newRow, addScore: s, mergedPositions } = slideAndMerge(row)
    addScore += s
    for (let j = 0; j < SIZE; j++) next[i * 4 + (3 - j)] = newRow[j]
    mergedPositions.forEach((j) => mergedIndices.push(i * 4 + (3 - j)))
  }
  return { grid: next, addScore, mergedIndices }
}

function moveUp(grid) {
  let addScore = 0
  const mergedIndices = []
  const next = [...grid]
  for (let j = 0; j < SIZE; j++) {
    const col = [next[j], next[4 + j], next[8 + j], next[12 + j]]
    const { row: newCol, addScore: s, mergedPositions } = slideAndMerge(col)
    addScore += s
    for (let i = 0; i < SIZE; i++) next[i * 4 + j] = newCol[i]
    mergedPositions.forEach((i) => mergedIndices.push(i * 4 + j))
  }
  return { grid: next, addScore, mergedIndices }
}

function moveDown(grid) {
  let addScore = 0
  const mergedIndices = []
  const next = [...grid]
  for (let j = 0; j < SIZE; j++) {
    const col = [next[12 + j], next[8 + j], next[4 + j], next[j]]
    const { row: newCol, addScore: s, mergedPositions } = slideAndMerge(col)
    addScore += s
    for (let i = 0; i < SIZE; i++) next[(3 - i) * 4 + j] = newCol[i]
    mergedPositions.forEach((i) => mergedIndices.push((3 - i) * 4 + j))
  }
  return { grid: next, addScore, mergedIndices }
}

function gridEqual(a, b) {
  return a.length === b.length && a.every((v, i) => v === b[i])
}

function canMove(grid) {
  if (getEmptyIndices(grid).length > 0) return true
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      const v = grid[i * 4 + j]
      if (j + 1 < SIZE && grid[i * 4 + j + 1] === v) return true
      if (i + 1 < SIZE && grid[(i + 1) * 4 + j] === v) return true
    }
  }
  return false
}

export default function Game2048({ onBack }) {
  const [grid, setGrid] = useState(() => {
    let g = spawnTile(spawnTile(createEmptyGrid()))
    return g
  })
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(getStoredHighScore)
  const [gameOver, setGameOver] = useState(false)
  const [spawnIndex, setSpawnIndex] = useState(null)
  const [mergeIndices, setMergeIndices] = useState([])

  const handleMove = useCallback(
    (dir) => {
      if (gameOver) return
      let result
      if (dir === 'left') result = moveLeft(grid)
      else if (dir === 'right') result = moveRight(grid)
      else if (dir === 'up') result = moveUp(grid)
      else result = moveDown(grid)
      if (!gridEqual(grid, result.grid)) {
        const newGrid = spawnTile(result.grid)
        const spawnIdx = newGrid.findIndex((v, i) => result.grid[i] !== v)
        const newScore = score + result.addScore
        setGrid(newGrid)
        setScore(newScore)
        setSpawnIndex(spawnIdx >= 0 ? spawnIdx : null)
        setMergeIndices(result.mergedIndices || [])
        if (newScore > highScore) {
          setHighScore(newScore)
          setStoredHighScore(newScore)
        }
      }
    },
    [grid, gameOver, score, highScore]
  )

  useEffect(() => {
    if (spawnIndex == null && mergeIndices.length === 0) return
    const t = setTimeout(() => {
      setSpawnIndex(null)
      setMergeIndices([])
    }, 280)
    return () => clearTimeout(t)
  }, [spawnIndex, mergeIndices])

  useEffect(() => {
    if (!canMove(grid)) {
      setGameOver(true)
      if (score > highScore) {
        setHighScore(score)
        setStoredHighScore(score)
      }
    }
  }, [grid, score, highScore])

  useEffect(() => {
    const onKeyDown = (e) => {
      if (gameOver) return
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          handleMove('left')
          break
        case 'ArrowRight':
          e.preventDefault()
          handleMove('right')
          break
        case 'ArrowUp':
          e.preventDefault()
          handleMove('up')
          break
        case 'ArrowDown':
          e.preventDefault()
          handleMove('down')
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleMove, gameOver])

  const handleRestart = () => {
    setGrid(spawnTile(spawnTile(createEmptyGrid())))
    setScore(0)
    setGameOver(false)
    setSpawnIndex(null)
    setMergeIndices([])
  }

  return (
    <div className="game2048">
      <div className="game2048-header">
        <button type="button" className="btn-2048-back" onClick={onBack}>
          返回论道阁
        </button>
        <h4 className="game2048-title">道合归一</h4>
        <span className="game2048-score">得分：{score}</span>
        <span className="game2048-high">最高：{highScore}</span>
      </div>
      <p className="game2048-tip">使用方向键 ↑↓←→ 移动方块，相同数字相遇则合并。</p>
      <div className="game2048-board">
        {grid.map((value, i) => (
          <div
            key={i}
            className={`game2048-cell ${value ? (value <= 2048 ? `game2048-cell-${value}` : 'game2048-cell-2048') : 'game2048-cell-empty'} ${spawnIndex === i ? 'game2048-cell-spawn' : ''} ${mergeIndices.includes(i) ? 'game2048-cell-merge' : ''}`}
          >
            {value > 0 ? value : ''}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="game2048-overlay">
          <div className="game2048-overlay-inner">
            <p className="game2048-overlay-title">无法继续移动</p>
            <p className="game2048-overlay-score">最终得分：{score}</p>
            {score >= highScore && score > 0 && (
              <p className="game2048-overlay-high">新纪录！</p>
            )}
            <div className="game2048-overlay-actions">
              <button type="button" className="btn-2048-again" onClick={handleRestart}>
                再试一次
              </button>
              <button type="button" className="btn-2048-back" onClick={onBack}>
                返回论道阁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

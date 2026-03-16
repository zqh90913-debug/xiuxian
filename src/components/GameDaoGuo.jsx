/**
 * 道果相合：合成大西瓜玩法，修仙主题。相同灵物相触则合一，堆过警戒线即结束。
 */
import { useState, useEffect, useRef, useCallback } from 'react'
import Matter from 'matter-js'
import './GameDaoGuo.css'

const GAME_WIDTH = 380
const GAME_HEIGHT = 560
const GROUND_Y = GAME_HEIGHT - 20
const DANGER_LINE_Y = 140
const HIGH_SCORE_KEY = 'game_daoguo_high_score'

const DAO_FRUIT_TIERS = [
  { name: '灵籽', radius: 14, color: '#8B7355' },
  { name: '灵芽', radius: 18, color: '#6B8E23' },
  { name: '灵叶', radius: 22, color: '#228B22' },
  { name: '灵枝', radius: 26, color: '#556B2F' },
  { name: '灵花', radius: 30, color: '#FF69B4' },
  { name: '灵果', radius: 34, color: '#FF6347' },
  { name: '半道果', radius: 38, color: '#C9A227' },
  { name: '道果', radius: 44, color: '#8B4513' },
]

function getStoredHighScore() {
  try {
    const n = parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10)
    return Number.isFinite(n) ? n : 0
  } catch (_) {
    return 0
  }
}

function setStoredHighScore(v) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(v))
  } catch (_) {}
}

export default function GameDaoGuo({ onBack }) {
  const containerRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const currentBodyRef = useRef(null)
  const mouseXRef = useRef(GAME_WIDTH / 2)
  const mergedThisFrameRef = useRef(new Set())
  const scoreRef = useRef(0)

  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(getStoredHighScore)
  const [gameOver, setGameOver] = useState(false)
  const [nextType, setNextType] = useState(0)
  const [currentType, setCurrentType] = useState(0)

  const gameOverRef = useRef(false)

  const addScore = useCallback((points) => {
    scoreRef.current += points
    setScore(scoreRef.current)
    if (scoreRef.current > getStoredHighScore()) {
      setStoredHighScore(scoreRef.current)
      setHighScore(scoreRef.current)
    }
  }, [])

  useEffect(() => {
    gameOverRef.current = gameOver
  }, [gameOver])

  useEffect(() => {
    if (!containerRef.current) return
    const MatterEngine = Matter.Engine
    const MatterRender = Matter.Render
    const MatterWorld = Matter.World
    const MatterBodies = Matter.Bodies
    const MatterBody = Matter.Body
    const MatterEvents = Matter.Events
    const MatterComposite = Matter.Composite
    const MatterRunner = Matter.Runner

    const engine = MatterEngine.create({
      gravity: { x: 0, y: 2.2 },
      enableSleeping: false,
    })
    engineRef.current = engine
    const world = engine.world

    const render = MatterRender.create({
      element: containerRef.current,
      engine,
      options: {
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        wireframes: false,
        background: 'transparent',
      },
    })
    renderRef.current = render

    const ground = MatterBodies.rectangle(GAME_WIDTH / 2, GROUND_Y + 10, GAME_WIDTH + 20, 30, {
      isStatic: true,
      render: { fillStyle: 'rgba(0,0,0,0.3)' },
    })
    const wallL = MatterBodies.rectangle(-5, GAME_HEIGHT / 2, 10, GAME_HEIGHT + 20, { isStatic: true, render: { visible: false } })
    const wallR = MatterBodies.rectangle(GAME_WIDTH + 5, GAME_HEIGHT / 2, 10, GAME_HEIGHT + 20, { isStatic: true, render: { visible: false } })
    MatterWorld.add(world, [ground, wallL, wallR])

    function createFruit(typeIndex, x, y, isStatic = false) {
      const tier = DAO_FRUIT_TIERS[typeIndex]
      const body = MatterBodies.circle(x, y, tier.radius, {
        restitution: 0.35,
        friction: 0.3,
        density: 0.002,
        isStatic,
        render: { fillStyle: tier.color },
      })
      body.itemType = typeIndex
      body.isFruit = true
      return body
    }

    function spawnCurrent() {
      const t = Math.floor(Math.random() * 4)
      setCurrentType(t)
      setNextType(Math.floor(Math.random() * 4))
      const body = createFruit(t, mouseXRef.current, 70, true)
      currentBodyRef.current = body
      MatterWorld.add(world, body)
    }

    function releaseCurrent() {
      const cur = currentBodyRef.current
      if (!cur) return
      const typeIndex = cur.itemType
      const x = cur.position.x
      const y = cur.position.y
      // 直接移除静态体，在原位新建动态体，避免 static→dynamic 时 mass/inertia 异常
      MatterComposite.remove(world, cur)
      currentBodyRef.current = null
      const falling = createFruit(typeIndex, x, y, false)
      falling.spawnTimestamp = engine.timing.timestamp
      MatterWorld.add(world, falling)
      spawnCurrent()
    }

    MatterEvents.on(engine, 'afterUpdate', () => {
      if (gameOverRef.current) return
      const cur = currentBodyRef.current
      if (cur) {
        const r = DAO_FRUIT_TIERS[cur.itemType].radius
        const x = Math.max(r, Math.min(GAME_WIDTH - r, mouseXRef.current))
        MatterBody.setPosition(cur, { x, y: 70 })
      }
      const bodies = Matter.Composite.allBodies(world)
      mergedThisFrameRef.current.clear()
      const toMerge = []
      const mergedIds = new Set()
      for (let i = 0; i < bodies.length; i++) {
        const a = bodies[i]
        if (!a.isFruit || mergedIds.has(a.id)) continue
        for (let j = i + 1; j < bodies.length; j++) {
          const b = bodies[j]
          if (!b.isFruit || mergedIds.has(b.id)) continue
          if (a.itemType !== b.itemType || a.itemType >= DAO_FRUIT_TIERS.length - 1) continue
          const dist = Math.hypot(a.position.x - b.position.x, a.position.y - b.position.y)
          const minDist = DAO_FRUIT_TIERS[a.itemType].radius + DAO_FRUIT_TIERS[b.itemType].radius
          if (dist < minDist * 1.02) {
            toMerge.push([a, b])
            mergedIds.add(a.id)
            mergedIds.add(b.id)
            break
          }
        }
      }
      for (const [bodyA, bodyB] of toMerge) {
        const ta = bodyA.itemType
        const x = (bodyA.position.x + bodyB.position.x) / 2
        const y = (bodyA.position.y + bodyB.position.y) / 2
        MatterComposite.remove(world, [bodyA, bodyB])
        const newBody = createFruit(ta + 1, x, y, false)
        newBody.spawnTimestamp = engine.timing.timestamp
        MatterWorld.add(world, newBody)
        addScore(1 << (ta + 1))
      }
      const allBodies = Matter.Composite.allBodies(world)
      const now = engine.timing.timestamp
      const SPAWN_GRACE_MS = 400
      for (const body of allBodies) {
        if (!body.isFruit || body === cur) continue
        if (body.position.y >= DANGER_LINE_Y) continue
        if (typeof body.spawnTimestamp === 'number' && now - body.spawnTimestamp < SPAWN_GRACE_MS) continue
        render.canvas.style.display = 'none'
        gameOverRef.current = true
        setGameOver(true)
        if (scoreRef.current > getStoredHighScore()) setStoredHighScore(scoreRef.current)
        return
      }
    })

    const handlePointer = (e) => {
      if (gameOverRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      mouseXRef.current = ((clientX - rect.left) / rect.width) * GAME_WIDTH
    }
    const handleRelease = () => {
      if (currentBodyRef.current && !gameOverRef.current) releaseCurrent()
    }

    const touchMoveHandler = (e) => { e.preventDefault(); handlePointer(e) }
    const touchEndHandler = (e) => { e.preventDefault(); handleRelease() }

    containerRef.current.addEventListener('mousemove', handlePointer)
    containerRef.current.addEventListener('touchmove', touchMoveHandler, { passive: false })

    function drawVolumeHighlight() {
      const c = render.context
      const bodies = MatterComposite.allBodies(world)
      for (const body of bodies) {
        if (!body.isFruit) continue
        const part = body.parts[0] || body
        const r = part.circleRadius
        if (!r) continue
        const x = part.position.x
        const y = part.position.y
        const g = c.createRadialGradient(
          x - r * 0.35, y - r * 0.35, 0,
          x, y, r
        )
        g.addColorStop(0, 'rgba(255,255,255,0.45)')
        g.addColorStop(0.5, 'rgba(255,255,255,0.08)')
        g.addColorStop(1, 'rgba(0,0,0,0)')
        c.beginPath()
        c.arc(x, y, r, 0, 2 * Math.PI)
        c.fillStyle = g
        c.fill()
      }
    }
    MatterEvents.on(render, 'afterRender', drawVolumeHighlight)

    spawnCurrent()
    const runner = MatterRunner.create()
    MatterRunner.run(runner, engine)
    MatterRender.run(render)

    const canvasEl = render.canvas
    if (canvasEl) {
      canvasEl.style.touchAction = 'none'
      canvasEl.addEventListener('mousedown', handleRelease)
      canvasEl.addEventListener('touchend', touchEndHandler, { passive: false })
    }

    return () => {
      MatterEvents.off(render, 'afterRender', drawVolumeHighlight)
      containerRef.current?.removeEventListener('mousemove', handlePointer)
      containerRef.current?.removeEventListener('touchmove', touchMoveHandler)
      if (canvasEl) {
        canvasEl.removeEventListener('mousedown', handleRelease)
        canvasEl.removeEventListener('touchend', touchEndHandler)
      }
      MatterRunner.stop(runner)
      MatterRender.stop(render)
      MatterWorld.clear(world, false)
      MatterEngine.clear(engine)
      if (render.canvas && render.canvas.parentNode) render.canvas.parentNode.removeChild(render.canvas)
    }
  }, [addScore])

  const handleRestart = () => {
    gameOverRef.current = false
    setGameOver(false)
    setScore(0)
    scoreRef.current = 0
    setHighScore(getStoredHighScore())
    if (engineRef.current) {
      const world = engineRef.current.world
      const toRemove = Matter.Composite.allBodies(world).filter((b) => b.isFruit)
      Matter.Composite.remove(world, toRemove)
    }
    if (currentBodyRef.current && engineRef.current) {
      Matter.Composite.remove(engineRef.current.world, currentBodyRef.current)
      currentBodyRef.current = null
    }
    if (containerRef.current && renderRef.current) {
      renderRef.current.canvas.style.display = ''
      const t = Math.floor(Math.random() * 4)
      setCurrentType(t)
      setNextType(Math.floor(Math.random() * 4))
      const body = Matter.Bodies.circle(mouseXRef.current, 70, DAO_FRUIT_TIERS[t].radius, {
        restitution: 0.3,
        friction: 0.4,
        density: 0.001,
        isStatic: true,
        render: { fillStyle: DAO_FRUIT_TIERS[t].color },
      })
      body.itemType = t
      body.isFruit = true
      currentBodyRef.current = body
      Matter.World.add(engineRef.current.world, body)
    }
  }

  return (
    <div className="game-daoguo">
      <div className="game-daoguo-header">
        <button type="button" className="btn-daoguo-back" onClick={onBack}>
          返回论道阁
        </button>
        <h4 className="game-daoguo-title">道果相合</h4>
        <span className="game-daoguo-score">得分：{score}</span>
        <span className="game-daoguo-high">最高：{highScore}</span>
      </div>
      <p className="game-daoguo-tip">
        移动指针控制落点，点击/触摸放下。相同灵物相触即合一，合成道果得分更高。勿使堆过红线！
      </p>
      <div className="game-daoguo-next">
        下一个：<span className="game-daoguo-next-name" style={{ color: DAO_FRUIT_TIERS[nextType].color }}>{DAO_FRUIT_TIERS[nextType].name}</span>
      </div>
      <div className="game-daoguo-canvas-wrap">
        <div className="game-daoguo-danger" />
        <div ref={containerRef} className="game-daoguo-canvas-inner" />
      </div>
      {gameOver && (
        <div className="game-daoguo-overlay">
          <div className="game-daoguo-overlay-inner">
            <p className="game-daoguo-overlay-title">堆过警戒线</p>
            <p className="game-daoguo-overlay-score">得分：{score}</p>
            {score >= highScore && score > 0 && <p className="game-daoguo-overlay-high">新纪录！</p>}
            <div className="game-daoguo-overlay-actions">
              <button type="button" className="btn-daoguo-again" onClick={handleRestart}>
                再试一次
              </button>
              <button type="button" className="btn-daoguo-back" onClick={onBack}>
                返回论道阁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

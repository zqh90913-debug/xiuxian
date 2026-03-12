/**
 * 兵演 · 道心争锋：原创卡牌。每回合双方各出一张牌，按品级与三才克制结算道心伤害。
 */
import { useState, useEffect } from 'react'
import {
  BINGYAN_FACTIONS,
  buildDeck,
  resolveRound,
} from '../data/bingyan'
import BingyanCard from './BingyanCard'
import './BingyanModal.css'

const DAOXIN_MAX = 20
const INITIAL_HAND = 5

export default function BingyanModal({ show, onClose }) {
  const [factionId, setFactionId] = useState(null)
  const [phase, setPhase] = useState('faction')
  const [playerDaoxin, setPlayerDaoxin] = useState(DAOXIN_MAX)
  const [opponentDaoxin, setOpponentDaoxin] = useState(DAOXIN_MAX)
  const [playerHand, setPlayerHand] = useState([])
  const [opponentHand, setOpponentHand] = useState([])
  const [playerDeck, setPlayerDeck] = useState([])
  const [opponentDeck, setOpponentDeck] = useState([])
  const [selectedHandIdx, setSelectedHandIdx] = useState(null)
  const [roundPhase, setRoundPhase] = useState('choose')
  const [playerPlayed, setPlayerPlayed] = useState(null)
  const [opponentPlayed, setOpponentPlayed] = useState(null)
  const [roundResult, setRoundResult] = useState(null)
  const [gameWinner, setGameWinner] = useState(null)

  const draw = (who, n = 1) => {
    const setDeck = who === 'player' ? setPlayerDeck : setOpponentDeck
    const setHand = who === 'player' ? setPlayerHand : setOpponentHand
    for (let i = 0; i < n; i++) {
      setDeck((d) => {
        if (d.length === 0) return d
        const next = [...d]
        const card = next.shift()
        setHand((h) => [...h, card])
        return next
      })
    }
  }

  const startGame = () => {
    if (!factionId) return
    const pDeck = buildDeck(factionId)
    const oDeck = buildDeck(factionId)
    const pHand = pDeck.splice(0, INITIAL_HAND)
    const oHand = oDeck.splice(0, INITIAL_HAND)
    setPlayerDeck(pDeck)
    setOpponentDeck(oDeck)
    setPlayerHand(pHand)
    setOpponentHand(oHand)
    setPlayerDaoxin(DAOXIN_MAX)
    setOpponentDaoxin(DAOXIN_MAX)
    setSelectedHandIdx(null)
    setRoundPhase('choose')
    setPlayerPlayed(null)
    setOpponentPlayed(null)
    setRoundResult(null)
    setGameWinner(null)
    setPhase('playing')
  }

  const confirmPlay = () => {
    const card = selectedHandIdx != null ? playerHand[selectedHandIdx] : null
    setPlayerPlayed(card)
    const oHand = opponentHand
    const aiCard = oHand.length > 0 && Math.random() < 0.85
      ? oHand[Math.floor(Math.random() * oHand.length)]
      : null
    setOpponentPlayed(aiCard)
    setRoundPhase('reveal')
  }

  useEffect(() => {
    if (phase !== 'playing' || roundPhase !== 'reveal') return
    const result = resolveRound(playerPlayed, opponentPlayed)
    setRoundResult(result)
    setPlayerDaoxin((d) => Math.max(0, d - result.playerDamage))
    setOpponentDaoxin((d) => Math.max(0, d - result.opponentDamage))
    setRoundPhase('result')
  }, [phase, roundPhase, playerPlayed, opponentPlayed])

  const nextRound = () => {
    const pCard = playerPlayed
    const oCard = opponentPlayed
    setPlayerHand((h) => (pCard ? h.filter((c) => c !== pCard) : h))
    setOpponentHand((h) => (oCard ? h.filter((c) => c !== oCard) : h))
    setSelectedHandIdx(null)
    setPlayerPlayed(null)
    setOpponentPlayed(null)
    setRoundResult(null)
    setRoundPhase('choose')
    setTimeout(() => {
      draw('player', 1)
      draw('opponent', 1)
    }, 0)
  }

  useEffect(() => {
    if (phase !== 'playing') return
    if (playerDaoxin <= 0) setGameWinner('opponent')
    if (opponentDaoxin <= 0) setGameWinner('player')
  }, [phase, playerDaoxin, opponentDaoxin])

  useEffect(() => {
    if (gameWinner) setPhase('gameOver')
  }, [gameWinner])

  useEffect(() => {
    if (!show) return
    setPhase('faction')
    setFactionId(null)
  }, [show])

  if (!show) return null

  const faction = BINGYAN_FACTIONS.find((f) => f.id === factionId)
  const canConfirm = roundPhase === 'choose'
  const selectedCard = selectedHandIdx != null ? playerHand[selectedHandIdx] : null

  return (
    <div className="bingyan-overlay">
      <div className="bingyan-modal">
        <div className="bingyan-header">
          <button type="button" className="btn-bingyan-back" onClick={onClose}>
            返回论道阁
          </button>
          <h3>兵演 · 道心争锋</h3>
          {phase === 'playing' && (
            <span className="bingyan-turn-info">
              道心 你 {playerDaoxin} : {opponentDaoxin} 对方
            </span>
          )}
        </div>

        <div className="bingyan-content">
          {phase === 'faction' && (
            <div className="bingyan-faction-select gu-panel">
              <h4 className="bingyan-section-title">选择阵营</h4>
              <p className="bingyan-rule-hint">
                每回合双方各出一张牌（或不出）。天克地、地克人、人克天；被克者受对方品级点道心伤害；同才则品级高者造成差值伤害。道心归零即败。
              </p>
              <div className="bingyan-faction-list">
                {BINGYAN_FACTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className="bingyan-faction-btn"
                    style={{ '--faction-color': f.color, '--faction-dark': f.dark }}
                    onClick={() => setFactionId(f.id)}
                  >
                    <span className="bingyan-faction-name">{f.name}</span>
                  </button>
                ))}
              </div>
              {factionId && (
                <button type="button" className="bingyan-start-btn" onClick={startGame}>
                  开始对局
                </button>
              )}
            </div>
          )}

          {(phase === 'playing' || phase === 'gameOver') && factionId && (
            <>
              <div className="bingyan-daoxin-board gu-panel">
                <div className="bingyan-daoxin-row">
                  <span className="bingyan-daoxin-label">对方道心</span>
                  <span className="bingyan-daoxin-value">{opponentDaoxin}</span>
                </div>
                {(roundPhase === 'reveal' || roundPhase === 'result') && (
                  <div className="bingyan-reveal-row">
                    <div className="bingyan-reveal-card">
                      {opponentPlayed ? <BingyanCard card={opponentPlayed} compact /> : <span className="bingyan-no-play">未出牌</span>}
                    </div>
                    <span className="bingyan-vs">对</span>
                    <div className="bingyan-reveal-card">
                      {playerPlayed ? <BingyanCard card={playerPlayed} compact /> : <span className="bingyan-no-play">未出牌</span>}
                    </div>
                  </div>
                )}
                {roundResult && (
                  <p className="bingyan-round-result-text">
                    对方受到 {roundResult.opponentDamage} 点道心伤害，你受到 {roundResult.playerDamage} 点道心伤害。
                  </p>
                )}
                <div className="bingyan-daoxin-row">
                  <span className="bingyan-daoxin-label">你的道心</span>
                  <span className="bingyan-daoxin-value">{playerDaoxin}</span>
                </div>
              </div>

              <div className="bingyan-hand gu-panel">
                <h4 className="bingyan-section-title">手牌 · 本回合选一张出牌（或不选则视为不出）</h4>
                {roundPhase === 'choose' && (
                  <div className="bingyan-choose-actions">
                    <button
                      type="button"
                      className={`bingyan-skip-btn ${selectedHandIdx === null ? 'selected' : ''}`}
                      onClick={() => setSelectedHandIdx(null)}
                    >
                      本回合不出
                    </button>
                    <button
                      type="button"
                      className="bingyan-confirm-play"
                      onClick={confirmPlay}
                    >
                      确认出牌
                    </button>
                  </div>
                )}
                {roundPhase === 'result' && (
                  <button type="button" className="bingyan-next-round-btn" onClick={nextRound}>
                    下一回合
                  </button>
                )}
                <div className="bingyan-hand-cards">
                  {playerHand.map((c, i) => (
                    <BingyanCard
                      key={`${c.id}-${i}`}
                      card={c}
                      compact
                      onClick={roundPhase === 'choose' ? () => setSelectedHandIdx(selectedHandIdx === i ? null : i) : undefined}
                      className={selectedHandIdx === i ? 'selected' : ''}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {phase === 'gameOver' && (
            <div className="bingyan-game-over gu-panel">
              <p className="bingyan-game-result">
                {gameWinner === 'player' ? '你道心犹存，兵演得胜！' : '对方道心已夺，你惜败一局。'}
              </p>
              <div className="bingyan-game-over-actions">
                <button
                  type="button"
                  className="bingyan-again-btn"
                  onClick={() => { setPhase('faction'); setFactionId(null) }}
                >
                  再战一局
                </button>
                <button type="button" className="btn-bingyan-back" onClick={onClose}>
                  返回论道阁
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

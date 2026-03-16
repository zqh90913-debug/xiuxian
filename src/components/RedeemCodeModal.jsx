/**
 * 兑换码弹窗
 */
import { useState } from 'react'
import './RedeemCodeModal.css'

const REDEEM_CODES = {
  '1': 10000000000,
}

const REDEEM_WEAPONS = {}

/** 兑换码 3：宗门贡献点 1000 万 */
const REDEEM_CONTRIBUTION = {
  '3': 10000000,
}

/** 兑换码 2：凝气丹 20 个，各突破丹各 10 个 */
const REDEEM_PILLS = {
  '2': {
    ningqi_dan: 20,
    zhuji_dan: 10,
    yuanshen_dan: 10,
    yuanying_dan: 10,
    huashen_dan: 10,
    heti_dan: 10,
    dujie_dan: 10,
    dacheng_dan: 10,
  },
}

export default function RedeemCodeModal({ show, onClose, onRedeem, onRedeemWeapons, onRedeemPills, onRedeemContribution }) {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimCode = code.trim()
    const reward = REDEEM_CODES[trimCode]
    const weaponCount = REDEEM_WEAPONS[trimCode]
    const pillReward = REDEEM_PILLS[trimCode]
    const contributionReward = REDEEM_CONTRIBUTION[trimCode]
    if (reward != null) {
      onRedeem(reward)
      setMessage('兑换成功！')
      setCode('')
      setTimeout(() => {
        setMessage('')
        onClose()
      }, 800)
    } else if (contributionReward != null && onRedeemContribution) {
      onRedeemContribution(contributionReward)
      setMessage('获得贡献点！')
      setCode('')
      setTimeout(() => {
        setMessage('')
        onClose()
      }, 800)
    } else if (pillReward != null && onRedeemPills) {
      onRedeemPills(pillReward)
      setMessage('获得丹药！')
      setCode('')
      setTimeout(() => {
        setMessage('')
        onClose()
      }, 800)
    } else if (weaponCount != null && onRedeemWeapons) {
      onRedeemWeapons(weaponCount)
      setMessage('获得法宝！')
      setCode('')
      setTimeout(() => {
        setMessage('')
        onClose()
      }, 800)
    } else {
      setMessage('无效的兑换码')
    }
  }

  if (!show) return null

  return (
    <div className="redeem-modal-overlay" onClick={onClose}>
      <div className="redeem-modal" onClick={(e) => e.stopPropagation()}>
        <h3>兑换码</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入兑换码"
            autoFocus
          />
          {message && <p className="redeem-message">{message}</p>}
          <div className="redeem-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>取消</button>
            <button type="submit" className="btn-confirm">兑换</button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  REALMS,
  LAYERS_PER_REALM,
  getCultivationGain,
  getBreakthroughRequired,
  getRealmDisplayName,
  getAttack,
  getHp,
} from './data/cultivation'
import CharacterPortrait from './components/CharacterPortrait'
import CultivationProgress from './components/CultivationProgress'
import StatusPanel from './components/StatusPanel'
import BreakthroughModal from './components/BreakthroughModal'
import EquipmentPanel from './components/EquipmentPanel'
import InventoryPanel from './components/InventoryPanel'
import TreasurePavilionModal from './components/TreasurePavilionModal'
import RedeemCodeModal from './components/RedeemCodeModal'
import { getItemSellPrice, addToInventory, getItemById, normalizeInventory, SHOP_ITEM_IDS, WEAPON_IDS, getWeaponAttackBonus } from './data/items'
import './App.css'

const CULTIVATION_DURATION_MS = 10000
const STORAGE_KEY = 'xiuxian_save'
const AUTO_CULTIVATE_KEY = 'xiuxian_auto_cultivate'
const SHOP_REFRESH_MS = 24 * 60 * 60 * 1000
const SHOP_SLOTS = 6
const SHOP_REFRESH_COST = 20

function pickRandomShopItems(count) {
  const shuffled = [...SHOP_ITEM_IDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, SHOP_ITEM_IDS.length))
}

function pickRandomWeapons(count) {
  const shuffled = [...WEAPON_IDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, WEAPON_IDS.length))
}

function normalizeEquipmentWeapons(w) {
  const arr = [...(w ?? []), ...Array(5).fill(null)].slice(0, 5)
  return arr.map((slot) => {
    if (!slot) return null
    if (slot?.itemId) return { itemId: slot.itemId }
    return null
  })
}

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (data.realmIndex != null && data.layer != null && data.cultivation != null) {
        return {
          realmIndex: data.realmIndex,
          layer: data.layer,
          cultivation: data.cultivation,
          equipment: {
            weapons: normalizeEquipmentWeapons(data.equipment?.weapons),
            armors: [...(data.equipment?.armors ?? []), ...Array(5).fill(null)].slice(0, 5),
          },
          inventory: normalizeInventory(data.inventory ?? {}),
          bigRealmBreakCount: data.bigRealmBreakCount ?? 0,
          spiritStones: data.spiritStones ?? 0,
          pillSuccessBonus: data.pillSuccessBonus ?? {},
          shopLastRefreshTime: data.shopLastRefreshTime ?? 0,
          shopItems: Array.isArray(data.shopItems) ? data.shopItems : pickRandomShopItems(SHOP_SLOTS),
        }
      }
    }
  } catch (_) {}
  return {
    realmIndex: 0,
    layer: 1,
    cultivation: 0,
    equipment: { weapons: normalizeEquipmentWeapons([]), armors: Array(5).fill(null) },
    inventory: {},
    bigRealmBreakCount: 0,
    spiritStones: 0,
    pillSuccessBonus: {},
    shopLastRefreshTime: Date.now(),
    shopItems: pickRandomShopItems(SHOP_SLOTS),
  }
}

function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      realmIndex: state.realmIndex,
      layer: state.layer,
      cultivation: state.cultivation,
      equipment: state.equipment ?? { weapons: Array(5).fill(null), armors: Array(5).fill(null) },
      inventory: state.inventory ?? {},
      bigRealmBreakCount: state.bigRealmBreakCount ?? 0,
      spiritStones: state.spiritStones ?? 0,
      pillSuccessBonus: state.pillSuccessBonus ?? {},
      shopLastRefreshTime: state.shopLastRefreshTime ?? 0,
      shopItems: state.shopItems ?? [],
    }))
  } catch (_) {}
}

function App() {
  const [state, setState] = useState(loadSave)
  const [progress, setProgress] = useState(0)
  const [isCultivating, setIsCultivating] = useState(false)
  const [showBreakthrough, setShowBreakthrough] = useState(false)
  const [showTreasurePavilion, setShowTreasurePavilion] = useState(false)
  const [showRedeemCode, setShowRedeemCode] = useState(false)
  const [breakthroughFailed, setBreakthroughFailed] = useState(false)
  const [lastGain, setLastGain] = useState(0)
  const [autoCultivate, setAutoCultivate] = useState(() => {
    try {
      return localStorage.getItem(AUTO_CULTIVATE_KEY) === '1'
    } catch (_) {
      return false
    }
  })

  useEffect(() => {
    if (lastGain > 0) {
      const t = setTimeout(() => setLastGain(0), 1500)
      return () => clearTimeout(t)
    }
  }, [lastGain])

  useEffect(() => {
    try {
      localStorage.setItem(AUTO_CULTIVATE_KEY, autoCultivate ? '1' : '0')
    } catch (_) {}
  }, [autoCultivate])

  const { realmIndex, layer, cultivation, equipment, inventory, bigRealmBreakCount, spiritStones, pillSuccessBonus, shopLastRefreshTime, shopItems } = state
  const isMaxRealm = realmIndex === REALMS.length - 1 && layer === LAYERS_PER_REALM

  const required = isMaxRealm
    ? Infinity
    : layer === LAYERS_PER_REALM
      ? getBreakthroughRequired(realmIndex + 1, 1)
      : getBreakthroughRequired(realmIndex, layer + 1)
  const canBreakthrough = cultivation >= required && !isMaxRealm

  const gainPerCycle = getCultivationGain(realmIndex, layer)
  const equipmentAttackBonus = (equipment?.weapons ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + getWeaponAttackBonus(s.itemId), 0)
  const attack = getAttack(realmIndex, layer, equipmentAttackBonus)
  const hp = getHp(realmIndex, layer)

  useEffect(() => {
    saveGame(state)
  }, [state])

  useEffect(() => {
    if (!showTreasurePavilion) return
    const now = Date.now()
    if (now - (shopLastRefreshTime ?? 0) >= SHOP_REFRESH_MS) {
      setState((s) => ({
        ...s,
        shopLastRefreshTime: now,
        shopItems: pickRandomShopItems(SHOP_SLOTS),
      }))
    }
  }, [showTreasurePavilion])

  useEffect(() => {
    if (!isCultivating) return
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / CULTIVATION_DURATION_MS)
      setProgress(p)
      if (p >= 1) {
        setIsCultivating(false)
        setProgress(0)
        setLastGain(gainPerCycle)
        setState((s) => ({ ...s, cultivation: s.cultivation + gainPerCycle }))
      }
    }
    const id = setInterval(tick, 50)
    return () => clearInterval(id)
  }, [isCultivating, gainPerCycle])

  const startCultivation = useCallback(() => {
    if (!isCultivating) setIsCultivating(true)
  }, [isCultivating])

  // 自动修炼：读条结束后立即开始下一次
  const prevCultivatingRef = useRef(false)
  useEffect(() => {
    if (prevCultivatingRef.current && !isCultivating && autoCultivate) {
      const t = setTimeout(() => setIsCultivating(true), 100)
      return () => clearTimeout(t)
    }
    prevCultivatingRef.current = isCultivating
  }, [isCultivating, autoCultivate])

  const isBigRealmBreak = layer === LAYERS_PER_REALM
  const nextRealmIndex = isBigRealmBreak ? realmIndex + 1 : realmIndex
  const pillBonus = pillSuccessBonus?.[nextRealmIndex] ?? 0
  const bigRealmSuccessRate = Math.min(100, Math.max(10, 90 - (bigRealmBreakCount ?? 0) * 10) + pillBonus)

  const doBreakthrough = useCallback(() => {
    if (!canBreakthrough) return
    if (isBigRealmBreak) {
      const roll = Math.random() * 100
      if (roll >= bigRealmSuccessRate) {
        setState((s) => ({ ...s, cultivation: 0 }))
        setBreakthroughFailed(true)
        return
      }
    }
    setBreakthroughFailed(false)
    let nextRealm = realmIndex
    let nextLayer = layer + 1
    if (nextLayer > LAYERS_PER_REALM) {
      nextLayer = 1
      nextRealm = realmIndex + 1
    }
    setState((s) => ({
      ...s,
      realmIndex: nextRealm,
      layer: nextLayer,
      cultivation: s.cultivation - required,
      bigRealmBreakCount: isBigRealmBreak ? (s.bigRealmBreakCount ?? 0) + 1 : s.bigRealmBreakCount,
    }))
    setShowBreakthrough(false)
  }, [canBreakthrough, realmIndex, layer, required, isBigRealmBreak, bigRealmSuccessRate])

  const handleSellItem = useCallback((itemId, count = 1) => {
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = inv[itemId] ?? 0
      if (cur < count) return s
      const price = getItemSellPrice(itemId) * count
      const newInv = { ...inv }
      if (cur <= count) delete newInv[itemId]
      else newInv[itemId] = cur - count
      return {
        ...s,
        inventory: newInv,
        spiritStones: (s.spiritStones ?? 0) + price,
      }
    })
  }, [])

  const handleEquipWeapon = useCallback((itemId, slotIndex) => {
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = inv[itemId] ?? 0
      if (cur < 1) return s
      const weapons = [...(s.equipment?.weapons ?? Array(5).fill(null))]
      if (slotIndex >= 0 && slotIndex < 5) {
        const old = weapons[slotIndex]?.itemId
        const newInv = { ...inv }
        if (old) newInv[old] = (newInv[old] ?? 0) + 1
        newInv[itemId] = (newInv[itemId] ?? 0) - 1
        if (newInv[itemId] <= 0) delete newInv[itemId]
        weapons[slotIndex] = { itemId }
        return {
          ...s,
          inventory: newInv,
          equipment: { ...s.equipment, weapons },
        }
      }
      const idx = weapons.findIndex((x) => !x)
      if (idx < 0) return s
      const newInv = { ...inv }
      newInv[itemId] = (newInv[itemId] ?? 0) - 1
      if (newInv[itemId] <= 0) delete newInv[itemId]
      weapons[idx] = { itemId }
      return {
        ...s,
        inventory: newInv,
        equipment: { ...s.equipment, weapons },
      }
    })
  }, [])

  const handleUnequipWeapon = useCallback((slotIndex) => {
    setState((s) => {
      const weapons = [...(s.equipment?.weapons ?? [])]
      const slot = weapons[slotIndex]
      if (!slot?.itemId) return s
      const itemId = slot.itemId
      weapons[slotIndex] = null
      return {
        ...s,
        equipment: { ...s.equipment, weapons },
        inventory: addToInventory(s.inventory ?? {}, itemId, 1),
      }
    })
  }, [])

  const handleUsePill = useCallback((itemId) => {
    const pill = getItemById(itemId)
    if (!pill || pill.type !== 'pill') return
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = inv[itemId] ?? 0
      if (cur < 1) return s
      const bonus = s.pillSuccessBonus ?? {}
      const newBonus = { ...bonus, [pill.realmIndex]: (bonus[pill.realmIndex] ?? 0) + 5 }
      const newInv = { ...inv }
      if (cur <= 1) delete newInv[itemId]
      else newInv[itemId] = cur - 1
      return { ...s, inventory: newInv, pillSuccessBonus: newBonus }
    })
  }, [])

  const handleRedeem = useCallback((amount) => {
    setState((s) => ({
      ...s,
      spiritStones: (s.spiritStones ?? 0) + amount,
    }))
  }, [])

  const handleRedeemWeapons = useCallback((count) => {
    const ids = pickRandomWeapons(count)
    setState((s) => {
      let inv = s.inventory ?? {}
      for (const id of ids) {
        inv = addToInventory(inv, id, 1)
      }
      return { ...s, inventory: inv }
    })
  }, [])

  const handleBuyItem = useCallback((itemId, price) => {
    setState((s) => {
      const stones = s.spiritStones ?? 0
      if (stones < price) return s
      const nextShop = (s.shopItems ?? []).filter((id) => id !== itemId)
      return {
        ...s,
        spiritStones: stones - price,
        inventory: addToInventory(s.inventory ?? {}, itemId, 1),
        shopItems: nextShop,
      }
    })
  }, [])

  const handleShopForceRefresh = useCallback(() => {
    setState((s) => {
      const stones = s.spiritStones ?? 0
      if (stones < SHOP_REFRESH_COST) return s
      return {
        ...s,
        spiritStones: stones - SHOP_REFRESH_COST,
        shopLastRefreshTime: Date.now(),
        shopItems: pickRandomShopItems(SHOP_SLOTS),
      }
    })
  }, [])

  return (
    <div className="app">
      <header className="header">
        <h1>修仙传</h1>
        <p className="subtitle">问道长生</p>
      </header>

      <main className="main">
        <aside className="left-sidebar">
          <button
            className="btn-treasure-pavilion"
            onClick={() => setShowTreasurePavilion(true)}
          >
            藏宝阁
          </button>
        </aside>
        <div className="cultivation-column">
          <StatusPanel
            realm={getRealmDisplayName(realmIndex, layer)}
            cultivation={cultivation}
            required={isMaxRealm ? null : required}
          />

          <section className={`cultivation-area gu-panel`}>
            <div className="cultivation-panel-header">
              <div className="cultivation-attributes">
                <span>攻击 {attack}</span>
                <span>血量 {hp}</span>
              </div>
              <label className="auto-cultivate-toggle">
                <input
                  type="checkbox"
                  checked={autoCultivate}
                  onChange={(e) => setAutoCultivate(e.target.checked)}
                />
                <span>自动修炼</span>
              </label>
            </div>
            {lastGain > 0 && (
              <div className="gain-float">+{lastGain} 修为</div>
            )}
            <CharacterPortrait isCultivating={isCultivating} />
            <CultivationProgress
              progress={progress}
              isCultivating={isCultivating}
              onStart={startCultivation}
              duration={CULTIVATION_DURATION_MS / 1000}
            />

            {canBreakthrough && (
              <button
                className="btn-breakthrough"
                onClick={() => setShowBreakthrough(true)}
              >
                突破境界
              </button>
            )}
          </section>
        </div>

        <aside className="side-column">
          <div className="spirit-stones-row">
            <span className="spirit-stones-display">灵石：{(spiritStones ?? 0).toLocaleString()}</span>
            <button className="btn-redeem" onClick={() => setShowRedeemCode(true)}>兑换码</button>
          </div>
          <EquipmentPanel
            equipment={equipment}
            onUnequipWeapon={handleUnequipWeapon}
          />
          <InventoryPanel
            inventory={inventory}
            equipment={equipment}
            onEquipWeapon={handleEquipWeapon}
            onUnequipWeapon={handleUnequipWeapon}
          />
        </aside>
      </main>

      <BreakthroughModal
        show={showBreakthrough}
        onClose={() => { setShowBreakthrough(false); setBreakthroughFailed(false) }}
        onConfirm={doBreakthrough}
        onUsePillInBreakthrough={handleUsePill}
        currentRealm={getRealmDisplayName(realmIndex, layer)}
        nextRealm={
          layer === LAYERS_PER_REALM
            ? `${REALMS[realmIndex + 1]} 第1层`
            : `${REALMS[realmIndex]} 第${layer + 1}层`
        }
        nextRealmIndex={isBigRealmBreak ? realmIndex + 1 : null}
        required={required}
        isBigRealmBreak={isBigRealmBreak}
        successRate={bigRealmSuccessRate}
        pillBonus={pillBonus}
        failed={breakthroughFailed}
        inventory={inventory}
      />

      <RedeemCodeModal
        show={showRedeemCode}
        onClose={() => setShowRedeemCode(false)}
        onRedeem={handleRedeem}
        onRedeemWeapons={handleRedeemWeapons}
      />

      <TreasurePavilionModal
        show={showTreasurePavilion}
        onClose={() => setShowTreasurePavilion(false)}
        inventory={inventory}
        spiritStones={spiritStones ?? 0}
        shopItems={shopItems ?? []}
        onSell={handleSellItem}
        onBuy={handleBuyItem}
        onForceRefresh={handleShopForceRefresh}
        refreshCost={SHOP_REFRESH_COST}
      />
    </div>
  )
}

export default App

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
import TechniquePavilionModal from './components/TechniquePavilionModal'
import AlchemyRoomModal from './components/AlchemyRoomModal'
import WorldMapModal from './components/WorldMapModal'
import RegionSceneModal from './components/RegionSceneModal'
import SectModal from './components/SectModal'
import { REGIONS, REGION_NAME_MAP, getRandomSectForRegion } from './data/sects'
import { INITIAL_AVAILABLE_TECHNIQUES, getTechniqueById } from './data/techniques'
import {
  INITIAL_OWNED_RECIPES,
  INITIAL_OWNED_FURNACES,
  getRecipe,
  getCraftSuccessRate,
  getCraftResultCount,
  canCraftWithInventory,
  deductCraftMaterials,
} from './data/alchemy'
import RedeemCodeModal from './components/RedeemCodeModal'
import { getItemSellPrice, addToInventory, getItemById, normalizeInventory, removeFromInventory, SHOP_ITEM_IDS, WEAPON_IDS, getWeaponAttackBonus, getPillCultivationGain, getArmorHpBonus, ITEM_TYPES, MATERIAL_SHOP_COUNT, MATERIAL_IDS } from './data/items'
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
  const arr = [...(w ?? []), ...Array(4).fill(null)].slice(0, 4)
  return arr.map((slot) => {
    if (!slot) return null
    if (slot?.itemId) return { itemId: slot.itemId }
    return null
  })
}

function normalizeEquipmentArmors(a) {
  const arr = [...(a ?? []), ...Array(4).fill(null)].slice(0, 4)
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
            armors: normalizeEquipmentArmors(data.equipment?.armors),
          },
          inventory: normalizeInventory(data.inventory ?? {}),
          bigRealmBreakCount: data.bigRealmBreakCount ?? 0,
          spiritStones: data.spiritStones ?? 0,
          pillSuccessBonus: data.pillSuccessBonus ?? {},
          shopLastRefreshTime: data.shopLastRefreshTime ?? 0,
          shopItems: Array.isArray(data.shopItems) ? data.shopItems : pickRandomShopItems(SHOP_SLOTS),
          learnedTechs: Array.isArray(data.learnedTechs) ? data.learnedTechs : [],
          availableTechs: Array.isArray(data.availableTechs) ? data.availableTechs : INITIAL_AVAILABLE_TECHNIQUES,
          ownedRecipes: Array.isArray(data.ownedRecipes) ? data.ownedRecipes : INITIAL_OWNED_RECIPES,
          // 丹方使用后永久生效，已学会的炼丹配方会随存档一同保留
          learnedRecipes: Array.isArray(data.learnedRecipes) ? data.learnedRecipes : [],
          ownedFurnaces: Array.isArray(data.ownedFurnaces) ? data.ownedFurnaces : INITIAL_OWNED_FURNACES,
          equippedFurnaceId: data.equippedFurnaceId ?? null,
          joinedSect: data.joinedSect ?? null,
        }
      }
    }
  } catch (_) {}
  return {
    realmIndex: 0,
    layer: 1,
    cultivation: 0,
    equipment: { weapons: normalizeEquipmentWeapons([]), armors: normalizeEquipmentArmors([]) },
    inventory: {},
    bigRealmBreakCount: 0,
    spiritStones: 0,
    pillSuccessBonus: {},
    shopLastRefreshTime: Date.now(),
    shopItems: pickRandomShopItems(SHOP_SLOTS),
    learnedTechs: [],
    availableTechs: INITIAL_AVAILABLE_TECHNIQUES,
    ownedRecipes: INITIAL_OWNED_RECIPES,
    learnedRecipes: [],
    ownedFurnaces: INITIAL_OWNED_FURNACES,
    equippedFurnaceId: null,
    joinedSect: null,
  }
}

function saveGame(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      realmIndex: state.realmIndex,
      layer: state.layer,
      cultivation: state.cultivation,
      equipment: state.equipment ?? { weapons: normalizeEquipmentWeapons([]), armors: normalizeEquipmentArmors([]) },
      inventory: state.inventory ?? {},
      bigRealmBreakCount: state.bigRealmBreakCount ?? 0,
      spiritStones: state.spiritStones ?? 0,
      pillSuccessBonus: state.pillSuccessBonus ?? {},
      shopLastRefreshTime: state.shopLastRefreshTime ?? 0,
      shopItems: state.shopItems ?? [],
      learnedTechs: state.learnedTechs ?? [],
      availableTechs: state.availableTechs ?? INITIAL_AVAILABLE_TECHNIQUES,
      ownedRecipes: state.ownedRecipes ?? INITIAL_OWNED_RECIPES,
      learnedRecipes: state.learnedRecipes ?? [],
      ownedFurnaces: state.ownedFurnaces ?? INITIAL_OWNED_FURNACES,
      equippedFurnaceId: state.equippedFurnaceId ?? null,
      joinedSect: state.joinedSect ?? null,
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
  const [showTechniquePavilion, setShowTechniquePavilion] = useState(false)
  const [showAlchemyRoom, setShowAlchemyRoom] = useState(false)
  const [showWorldMap, setShowWorldMap] = useState(false)
  const [showRegionScene, setShowRegionScene] = useState(false)
  const [showSectModal, setShowSectModal] = useState(false)
  const [currentRegionId, setCurrentRegionId] = useState(null)
  const [regionLogs, setRegionLogs] = useState({})
  const [pendingSect, setPendingSect] = useState(null)
  const [pendingBandit, setPendingBandit] = useState(null)
  const [breakthroughFailed, setBreakthroughFailed] = useState(false)
  const [lastGain, setLastGain] = useState(0)
  const [autoCultivate, setAutoCultivate] = useState(() => {
    try {
      return localStorage.getItem(AUTO_CULTIVATE_KEY) === '1'
    } catch (_) {
      return false
    }
  })

  const [exploreWindowStart, setExploreWindowStart] = useState(() => Date.now())
  const [exploreUsed, setExploreUsed] = useState(0)
  const [exploreExtra, setExploreExtra] = useState(0)

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

  const {
    realmIndex,
    layer,
    cultivation,
    equipment,
    inventory,
    bigRealmBreakCount,
    spiritStones,
    pillSuccessBonus,
    shopLastRefreshTime,
    shopItems,
    learnedTechs = [],
    availableTechs = INITIAL_AVAILABLE_TECHNIQUES,
    ownedRecipes = INITIAL_OWNED_RECIPES,
    learnedRecipes = [],
    ownedFurnaces = INITIAL_OWNED_FURNACES,
    equippedFurnaceId = null,
    lastCraftResult = null,
    joinedSect = null,
  } = state
  const isMaxRealm = realmIndex === REALMS.length - 1 && layer === LAYERS_PER_REALM

  const required = isMaxRealm
    ? Infinity
    : layer === LAYERS_PER_REALM
      ? getBreakthroughRequired(realmIndex + 1, 1)
      : getBreakthroughRequired(realmIndex, layer + 1)
  const canBreakthrough = cultivation >= required && !isMaxRealm

  const techniqueBonus = (learnedTechs ?? [])
    .map((id) => getTechniqueById(id))
    .filter(Boolean)
    .reduce((sum, t) => sum + (t.cultivationBonus ?? 0), 0)

  const gainPerCycle = getCultivationGain(realmIndex, layer) + techniqueBonus
  const equipmentAttackBonus = (equipment?.weapons ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + getWeaponAttackBonus(s.itemId), 0)
  const attack = getAttack(realmIndex, layer, equipmentAttackBonus)
  const armorHpBonus = (equipment?.armors ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + (getArmorHpBonus ? getArmorHpBonus(s.itemId) : 0), 0)
  const hp = getHp(realmIndex, layer) + armorHpBonus

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
        setState((s) => {
          const req = s.layer === LAYERS_PER_REALM ? getBreakthroughRequired(s.realmIndex + 1, 1) : getBreakthroughRequired(s.realmIndex, s.layer + 1)
          const newCultivation = Math.min(s.cultivation + gainPerCycle, req)
          return { ...s, cultivation: newCultivation }
        })
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

  const appendRegionLog = useCallback((regionId, line) => {
    setRegionLogs((prev) => {
      const list = prev[regionId] ?? []
      return { ...prev, [regionId]: [...list, line] }
    })
  }, [])

  const isBigRealmBreak = layer === LAYERS_PER_REALM
  const nextRealmIndex = isBigRealmBreak ? realmIndex + 1 : realmIndex
  const pillBonus = pillSuccessBonus?.[nextRealmIndex] ?? 0
  // 大境界突破基础成功率：初始约 60%，多次失败后逐步降低到 10%
  const baseBigRealmRate = Math.max(10, 60 - (bigRealmBreakCount ?? 0) * 10)
  const bigRealmSuccessRate = Math.min(95, baseBigRealmRate + pillBonus)

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
      const weapons = [...(s.equipment?.weapons ?? Array(4).fill(null))]
      if (slotIndex >= 0 && slotIndex < 4) {
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

  const handleEquipArmor = useCallback((itemId, slotIndex) => {
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = inv[itemId] ?? 0
      if (cur < 1) return s
      const armors = [...(s.equipment?.armors ?? Array(4).fill(null))]
      if (slotIndex >= 0 && slotIndex < 4) {
        const old = armors[slotIndex]?.itemId
        const newInv = { ...inv }
        if (old) newInv[old] = (newInv[old] ?? 0) + 1
        newInv[itemId] = (newInv[itemId] ?? 0) - 1
        if (newInv[itemId] <= 0) delete newInv[itemId]
        armors[slotIndex] = { itemId }
        return {
          ...s,
          inventory: newInv,
          equipment: { ...s.equipment, armors },
        }
      }
      const idx = armors.findIndex((x) => !x)
      if (idx < 0) return s
      const newInv = { ...inv }
      newInv[itemId] = (newInv[itemId] ?? 0) - 1
      if (newInv[itemId] <= 0) delete newInv[itemId]
      armors[idx] = { itemId }
      return {
        ...s,
        inventory: newInv,
        equipment: { ...s.equipment, armors },
      }
    })
  }, [])

  const handleUnequipArmor = useCallback((slotIndex) => {
    setState((s) => {
      const armors = [...(s.equipment?.armors ?? [])]
      const slot = armors[slotIndex]
      if (!slot?.itemId) return s
      const itemId = slot.itemId
      armors[slotIndex] = null
      return {
        ...s,
        equipment: { ...s.equipment, armors },
        inventory: addToInventory(s.inventory ?? {}, itemId, 1),
      }
    })
  }, [])

  /** 使用直接增加修为的丹药（如凝气丹），修为不超过当前突破所需 */
  const handleUseDirectPill = useCallback((itemId) => {
    const gain = getPillCultivationGain(itemId)
    if (gain <= 0) return
    setState((s) => {
      const inv = s.inventory ?? {}
      if ((inv[itemId] ?? 0) < 1) return s
      const req = s.layer === LAYERS_PER_REALM ? getBreakthroughRequired(s.realmIndex + 1, 1) : getBreakthroughRequired(s.realmIndex, s.layer + 1)
      const newCultivation = Math.min(s.cultivation + gain, req)
      return {
        ...s,
        cultivation: newCultivation,
        inventory: removeFromInventory(inv, itemId, 1),
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

  const handleEnterRegion = useCallback((regionId) => {
    if (!regionId) return
    setCurrentRegionId(regionId)
    setShowWorldMap(false)
    setShowRegionScene(true)
    setPendingSect(null)
    setPendingBandit(null)
  }, [])

  const handleExploreRegion = useCallback((regionId) => {
    // 每小时基础 10 次探索，可额外购买次数
    const now = Date.now()
    if (now - exploreWindowStart >= 60 * 60 * 1000) {
      setExploreWindowStart(now)
      setExploreUsed(0)
      setExploreExtra(0)
    }
    const maxCount = 10 + exploreExtra
    if (exploreUsed >= maxCount) {
      const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
      appendRegionLog(regionId, `你在${regionName}四处搜寻，却感到精力不济，本小时的探索次数似乎已经耗尽。`)
      return
    }
    setExploreUsed((v) => v + 1)
    const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
    const roll = Math.random()
    if (roll < 0.35) {
      // 灵石收获
      const delta = 1 + Math.floor(Math.random() * 100)
      setState((s) => ({
        ...s,
        spiritStones: (s.spiritStones ?? 0) + delta,
      }))
      appendRegionLog(regionId, `在${regionName}探索时，你意外拾取了 ${delta} 枚灵石。`)
      return
    }
    if (roll < 0.7 && MATERIAL_IDS.length > 0) {
      // 炼丹材料收获
      const mid = MATERIAL_IDS[Math.floor(Math.random() * MATERIAL_IDS.length)]
      const count = 1 + Math.floor(Math.random() * 10)
      const item = getItemById(mid)
      const name = item?.name ?? mid
      setState((s) => ({
        ...s,
        inventory: addToInventory(s.inventory ?? {}, mid, count),
      }))
      appendRegionLog(regionId, `在${regionName}密林中，你找到 ${name} ×${count}。`)
      return
    }
    // 打劫事件
    if (roll < 0.88) {
      const enemyRealmIndex = Math.floor(Math.random() * REALMS.length)
      const enemyRealmName = REALMS[enemyRealmIndex]
      setPendingBandit({ regionId, enemyRealmIndex, enemyRealmName })
      appendRegionLog(
        regionId,
        `你在${regionName}山道间行走时，被一名「${enemyRealmName}」修士拦住去路，冷声索要灵石。`,
      )
      return
    }
    // 宗门奇遇
    const sect = getRandomSectForRegion(regionId)
    if (!sect) {
      appendRegionLog(regionId, `你在${regionName}四处游历，却一无所获。`)
      return
    }
    if (joinedSect) {
      appendRegionLog(
        regionId,
        `你路过「${sect.name}」，对方察觉你已身在他门，只是客气寒暄几句，婉拒你进一步拜访。`,
      )
      return
    }
    setPendingSect(sect)
    const needRealmName = REALMS[sect.minRealmIndex] ?? '更高境界'
    appendRegionLog(
      regionId,
      `你远远望见一座宗门——「${sect.name}」（${sect.levelLabel}，需至少修至「${needRealmName}」），似乎可以前往拜访。`,
    )
  }, [appendRegionLog, exploreWindowStart, exploreUsed, exploreExtra, joinedSect])

  const handleDismissSect = useCallback(() => {
    setPendingSect(null)
  }, [])

  const resolveBanditFight = useCallback((winFromEscape = false) => {
    if (!pendingBandit) return
    const { enemyRealmIndex, enemyRealmName } = pendingBandit
    const playerRealm = realmIndex
    let successChance = 0.5 + 0.1 * (playerRealm - enemyRealmIndex)
    successChance = Math.max(0.2, Math.min(0.8, successChance))
    const win = Math.random() < successChance
    if (win) {
      const gain = 100 + Math.floor(Math.random() * 2901)
      setState((s) => ({
        ...s,
        spiritStones: (s.spiritStones ?? 0) + gain,
      }))
      appendRegionLog(
        currentRegionId,
        winFromEscape
          ? `你没能成功逃离，与这名「${enemyRealmName}」修士短暂交手后占得上风，从其身上搜出 ${gain} 枚灵石。`
          : `你与这名「${enemyRealmName}」修士激战一番，最终获胜，并从其身上夺得 ${gain} 枚灵石。`,
      )
    } else {
      setState((s) => {
        const cur = s.spiritStones ?? 0
        const loss = Math.floor(cur / 2)
        return {
          ...s,
          spiritStones: cur - loss,
        }
      })
      appendRegionLog(
        currentRegionId,
        `你不敌这名「${enemyRealmName}」修士，被迫交出一半随身灵石后才得以脱身。`,
      )
    }
    setPendingBandit(null)
  }, [appendRegionLog, currentRegionId, pendingBandit, realmIndex])

  const handleBanditFight = useCallback(() => {
    resolveBanditFight(false)
  }, [resolveBanditFight])

  const handleBanditPay = useCallback(() => {
    if (!pendingBandit) return
    const { enemyRealmName } = pendingBandit
    setState((s) => {
      const cur = s.spiritStones ?? 0
      if (cur < 1000) {
        appendRegionLog(
          currentRegionId,
          `你想以破财消灾，却发现灵石不足，对方冷笑不语，似乎并不打算就此罢手。`,
        )
        return s
      }
      appendRegionLog(
        currentRegionId,
        `你咬牙交出一袋 1000 枚灵石，这名「${enemyRealmName}」修士满意离去。`,
      )
      return {
        ...s,
        spiritStones: cur - 1000,
      }
    })
    setPendingBandit(null)
  }, [appendRegionLog, currentRegionId, pendingBandit])

  const handleBanditEscape = useCallback(() => {
    if (!pendingBandit) return
    const { enemyRealmIndex, enemyRealmName } = pendingBandit
    let escapeChance = 0.8 - 0.07 * enemyRealmIndex
    escapeChance = Math.max(0.25, Math.min(0.9, escapeChance))
    const success = Math.random() < escapeChance
    if (success) {
      appendRegionLog(
        currentRegionId,
        `你施展身法，勉强甩开了这名「${enemyRealmName}」修士的追击，安全脱离险境。`,
      )
      setPendingBandit(null)
      return
    }
    appendRegionLog(
      currentRegionId,
      `你试图逃离，却被这名「${enemyRealmName}」修士死死缠住，被迫迎战！`,
    )
    resolveBanditFight(true)
  }, [appendRegionLog, currentRegionId, pendingBandit, resolveBanditFight])

  const handleJoinSect = useCallback(() => {
    if (!pendingSect) return
    const { minRealmIndex } = pendingSect
    if (realmIndex < minRealmIndex) {
      appendRegionLog(currentRegionId, `你尝试加入「${pendingSect.name}」，但境界不足，被守门弟子婉拒。`)
      setPendingSect(null)
      return
    }
    setState((s) => ({
      ...s,
      joinedSect: pendingSect,
    }))
    appendRegionLog(currentRegionId, `你正式拜入「${pendingSect.name}」，成为其门下弟子。`)
    setPendingSect(null)
  }, [pendingSect, realmIndex, currentRegionId, appendRegionLog])

  const handleBuyExploreChance = useCallback((regionId) => {
    setState((s) => {
      const stones = s.spiritStones ?? 0
      if (stones < 20) {
        const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
        appendRegionLog(regionId, `你想要继续在${regionName}探索，却发现灵石不足以换取新的机会。`)
        return s
      }
      return {
        ...s,
        spiritStones: stones - 20,
      }
    })
    setExploreExtra((v) => v + 1)
  }, [appendRegionLog])

  const handleLearnTechnique = useCallback((techId) => {
    setState((s) => {
      const learned = s.learnedTechs ?? []
      if (learned.includes(techId)) return s
      const available = s.availableTechs ?? INITIAL_AVAILABLE_TECHNIQUES
      if (!available.includes(techId)) return s
      return {
        ...s,
        learnedTechs: [...learned, techId],
      }
    })
  }, [])

  const handleUseRecipe = useCallback((recipeId) => {
    setState((s) => {
      const owned = s.ownedRecipes ?? []
      if (!owned.includes(recipeId)) return s
      const rec = getRecipe(recipeId)
      if (!rec) return s
      const learned = s.learnedRecipes ?? []
      const alreadyLearned = learned.includes(rec.pillId)
      return {
        ...s,
        ownedRecipes: owned.filter((id) => id !== recipeId),
        learnedRecipes: alreadyLearned ? learned : [...learned, rec.pillId],
      }
    })
  }, [])

  const handleEquipFurnace = useCallback((furnaceId) => {
    setState((s) => ({
      ...s,
      equippedFurnaceId: furnaceId,
    }))
  }, [])

  const handleCraft = useCallback((pillId) => {
    setState((s) => {
      const learned = s.learnedRecipes ?? []
      if (!learned.includes(pillId)) return s
      if (!canCraftWithInventory(pillId, s.inventory)) return s
      const rate = getCraftSuccessRate(pillId, s.equippedFurnaceId ?? null)
      const success = Math.random() * 100 < rate
      const inv = deductCraftMaterials(s.inventory, pillId)
      const count = success ? getCraftResultCount() : 0
      return {
        ...s,
        inventory: success ? addToInventory(inv, pillId, count) : inv,
        lastCraftResult: { success, pillId, count },
      }
    })
  }, [])

  const handleBuyItem = useCallback((itemId, price) => {
    setState((s) => {
      const stones = s.spiritStones ?? 0
      if (stones < price) return s
      const item = getItemById(itemId)
      const nextShop = (s.shopItems ?? []).filter((id) => id !== itemId)
      if (item?.type === ITEM_TYPES.MATERIAL) {
        return {
          ...s,
          spiritStones: stones - price,
          inventory: addToInventory(s.inventory ?? {}, itemId, MATERIAL_SHOP_COUNT),
          shopItems: nextShop,
        }
      }
      if (item?.type === ITEM_TYPES.FURNACE) {
        return {
          ...s,
          spiritStones: stones - price,
          ownedFurnaces: [...(s.ownedFurnaces ?? []), itemId],
          shopItems: nextShop,
        }
      }
      if (item?.type === ITEM_TYPES.RECIPE) {
        return {
          ...s,
          spiritStones: stones - price,
          ownedRecipes: [...(s.ownedRecipes ?? []), itemId],
          shopItems: nextShop,
        }
      }
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
          <button
            className="btn-treasure-pavilion"
            style={{ marginTop: '0.5rem' }}
            onClick={() => setShowTechniquePavilion(true)}
          >
            功法阁
          </button>
          <button
            className="btn-treasure-pavilion"
            style={{ marginTop: '0.5rem' }}
            onClick={() => setShowAlchemyRoom(true)}
          >
            炼丹房
          </button>
          <button
            className="btn-treasure-pavilion"
            style={{ marginTop: '0.5rem' }}
            onClick={() => setShowWorldMap(true)}
          >
            大世界
          </button>
          <button
            className="btn-treasure-pavilion"
            style={{ marginTop: '0.5rem' }}
            disabled={!joinedSect}
            onClick={() => joinedSect && setShowSectModal(true)}
          >
            宗门
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
            onUnequipArmor={handleUnequipArmor}
          />
          <InventoryPanel
            inventory={inventory}
            equipment={equipment}
            onEquipWeapon={handleEquipWeapon}
            onUnequipWeapon={handleUnequipWeapon}
            onEquipArmor={handleEquipArmor}
            onUseDirectPill={handleUseDirectPill}
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

      <TechniquePavilionModal
        show={showTechniquePavilion}
        onClose={() => setShowTechniquePavilion(false)}
        learned={learnedTechs}
        available={availableTechs}
        onLearn={handleLearnTechnique}
      />

      <AlchemyRoomModal
        show={showAlchemyRoom}
        onClose={() => {
          setShowAlchemyRoom(false)
          setState((s) => ({ ...s, lastCraftResult: null }))
        }}
        learnedRecipes={learnedRecipes}
        ownedRecipes={ownedRecipes}
        ownedFurnaces={ownedFurnaces}
        equippedFurnaceId={equippedFurnaceId}
        inventory={inventory}
        lastCraftResult={lastCraftResult}
        onClearCraftResult={() => setState((s) => ({ ...s, lastCraftResult: null }))}
        onUseRecipe={handleUseRecipe}
        onEquipFurnace={handleEquipFurnace}
        onCraft={handleCraft}
      />

      <WorldMapModal
        show={showWorldMap}
        onClose={() => setShowWorldMap(false)}
        onEnterRegion={handleEnterRegion}
      />

      <RegionSceneModal
        show={showRegionScene}
        regionId={currentRegionId}
        onClose={() => {
          setShowRegionScene(false)
          // 退出当前地域时刷新记录与事件
          if (currentRegionId) {
            setRegionLogs((prev) => {
              const next = { ...prev }
              delete next[currentRegionId]
              return next
            })
          }
          setPendingSect(null)
          setPendingBandit(null)
          setShowWorldMap(true)
        }}
        logs={regionLogs[currentRegionId] ?? []}
        exploreRemaining={Math.max(0, 10 + exploreExtra - exploreUsed)}
        pendingSect={pendingSect}
        pendingBandit={pendingBandit}
        onExplore={handleExploreRegion}
        onJoinSect={handleJoinSect}
        onDismissSect={handleDismissSect}
        onBuyExploreChance={handleBuyExploreChance}
        onBanditFight={handleBanditFight}
        onBanditPay={handleBanditPay}
        onBanditEscape={handleBanditEscape}
      />

      <SectModal
        show={showSectModal}
        onClose={() => setShowSectModal(false)}
        sect={joinedSect}
        onLeaveSect={() => setState((s) => ({ ...s, joinedSect: null }))}
      />
    </div>
  )
}

export default App

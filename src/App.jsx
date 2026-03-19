import { useState, useEffect, useCallback, useRef } from 'react'
import {
  REALMS,
  getCultivationGain,
  getBreakthroughRequired,
  getRealmDisplayName,
  getAttack,
  getHp,
  getSpeed,
  getNextRealmLayer,
  getRealmLayerCount,
  isMajorRealmBreak,
  isFeishengStage,
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
import DebatePavilionModal from './components/DebatePavilionModal'
import BingyanModal from './components/BingyanModal'
import RegionSceneModal from './components/RegionSceneModal'
import SectModal from './components/SectModal'
import { REGIONS, REGION_NAME_MAP, getRandomSectForRegion, SECT_RANKS } from './data/sects'
import { INITIAL_AVAILABLE_TECHNIQUES, getTechniqueById, getTechniqueEffectiveBonuses, getTechniqueMasteryExp } from './data/techniques'
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
import SaveSlotModal from './SaveSlotModal'
import LoadSlotModal from './LoadSlotModal'
import { getItemSellPrice, addToInventory, getItemById, normalizeInventory, removeFromInventory, SHOP_ITEM_IDS, WEAPON_IDS, ARMOR_IDS, getWeaponAttackBonus, getPillCultivationGain, getArmorHpBonus, ITEM_TYPES, MATERIAL_SHOP_COUNT, MATERIAL_IDS } from './data/items'
import CharacterCreationModal from './components/CharacterCreationModal'
import { getCharacterBonuses, getCharacterSelection, getDefaultCharacterProfile, normalizeCharacterProfile } from './data/characterCreation'
import './App.css'

const CULTIVATION_DURATION_MS = 10000
const STORAGE_KEY = 'xiuxian_save'
const AUTO_CULTIVATE_KEY = 'xiuxian_auto_cultivate'
const SAVE_SLOTS_COUNT = 8

function getSaveSlotKey(index) {
  return `xiuxian_slot_${index}`
}
const SHOP_REFRESH_MS = 12 * 60 * 60 * 1000
const SHOP_SLOTS = 12
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

function normalizeSaveData(data) {
  if (!data || data.realmIndex == null || data.layer == null || data.cultivation == null) return null
  const safeLayer = Math.max(1, Math.min(data.layer, getRealmLayerCount(data.realmIndex)))
  return {
    realmIndex: data.realmIndex,
    layer: safeLayer,
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
    techniqueMastery: data.techniqueMastery ?? {},
    ownedRecipes: Array.isArray(data.ownedRecipes) ? data.ownedRecipes : INITIAL_OWNED_RECIPES,
    learnedRecipes: Array.isArray(data.learnedRecipes) ? data.learnedRecipes : [],
    ownedFurnaces: Array.isArray(data.ownedFurnaces) ? data.ownedFurnaces : INITIAL_OWNED_FURNACES,
    equippedFurnaceId: data.equippedFurnaceId ?? null,
    joinedSect: data.joinedSect ?? null,
    sectContribution: data.sectContribution ?? 0,
    sectRankIndex: data.sectRankIndex ?? 0,
    cuitiUsedCount: data.cuitiUsedCount ?? 0,
    xueUsedCount: data.xueUsedCount ?? 0,
    shenxingUsedCount: data.shenxingUsedCount ?? 0,
    feishengUnlocked: data.feishengUnlocked ?? false,
    characterProfile: normalizeCharacterProfile(data.characterProfile),
  }
}

function getDefaultState(characterProfile = null) {
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
    techniqueMastery: {},
    ownedRecipes: INITIAL_OWNED_RECIPES,
    learnedRecipes: [],
    ownedFurnaces: INITIAL_OWNED_FURNACES,
    equippedFurnaceId: null,
    joinedSect: null,
    sectContribution: 0,
    sectRankIndex: 0,
    cuitiUsedCount: 0,
    xueUsedCount: 0,
    shenxingUsedCount: 0,
    feishengUnlocked: false,
    characterProfile: normalizeCharacterProfile(characterProfile),
  }
}

function loadSave() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      return normalizeSaveData(data) ?? getDefaultState()
    }
  } catch (_) {}
  return getDefaultState()
}

function saveToSlot(state, index) {
  try {
    const payload = {
      savedAt: Date.now(),
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
      techniqueMastery: state.techniqueMastery ?? {},
      ownedRecipes: state.ownedRecipes ?? INITIAL_OWNED_RECIPES,
      learnedRecipes: state.learnedRecipes ?? [],
      ownedFurnaces: state.ownedFurnaces ?? INITIAL_OWNED_FURNACES,
      equippedFurnaceId: state.equippedFurnaceId ?? null,
      joinedSect: state.joinedSect ?? null,
      sectContribution: state.sectContribution ?? 0,
      sectRankIndex: state.sectRankIndex ?? 0,
      cuitiUsedCount: state.cuitiUsedCount ?? 0,
      xueUsedCount: state.xueUsedCount ?? 0,
      shenxingUsedCount: state.shenxingUsedCount ?? 0,
      feishengUnlocked: state.feishengUnlocked ?? false,
      characterProfile: normalizeCharacterProfile(state.characterProfile),
    }
    localStorage.setItem(getSaveSlotKey(index), JSON.stringify(payload))
    return true
  } catch (_) {
    return false
  }
}

function loadFromSlot(index) {
  try {
    const raw = localStorage.getItem(getSaveSlotKey(index))
    if (!raw) return null
    const data = JSON.parse(raw)
    return normalizeSaveData(data)
  } catch (_) {
    return null
  }
}

function getSlotInfo(index) {
  try {
    const raw = localStorage.getItem(getSaveSlotKey(index))
    if (!raw) return null
    const data = JSON.parse(raw)
    return {
      savedAt: data.savedAt,
      name: data.characterProfile?.name ?? null,
      realmIndex: data.realmIndex ?? null,
      layer: data.layer ?? null,
    }
  } catch (_) {
    return null
  }
}

function mergeUnique(base = [], extra = []) {
  return [...new Set([...(base ?? []), ...(extra ?? [])])]
}

function buildCharacterState(profile) {
  const normalized = normalizeCharacterProfile(profile) ?? getDefaultCharacterProfile()
  const { spiritRoot, background, destiny } = getCharacterSelection(normalized)
  const baseState = getDefaultState(normalized)
  const startingNodes = [background.starting, destiny.starting]

  let nextState = { ...baseState }
  for (const node of startingNodes) {
    if (!node) continue
    nextState.spiritStones += node.spiritStones ?? 0
    nextState.cultivation += node.cultivation ?? 0
    nextState.learnedTechs = mergeUnique(nextState.learnedTechs, node.learnedTechs)
    nextState.availableTechs = mergeUnique(nextState.availableTechs, node.availableTechs)
    nextState.ownedRecipes = mergeUnique(nextState.ownedRecipes, node.ownedRecipes)
    nextState.ownedFurnaces = mergeUnique(nextState.ownedFurnaces, node.ownedFurnaces)

    for (const [itemId, count] of Object.entries(node.inventory ?? {})) {
      nextState.inventory = addToInventory(nextState.inventory, itemId, count)
    }
  }

  return {
    ...nextState,
    characterProfile: normalized,
    cultivation: nextState.cultivation + (spiritRoot.bonuses?.startingCultivation ?? 0),
  }
}

function isFreshRunState(state) {
  if (!state) return true
  return (
    state.realmIndex === 0 &&
    state.layer === 1 &&
    (state.cultivation ?? 0) === 0 &&
    (state.spiritStones ?? 0) === 0 &&
    Object.keys(state.inventory ?? {}).length === 0 &&
    (state.learnedTechs ?? []).length === 0 &&
    !state.joinedSect
  )
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
  const [showDebatePavilion, setShowDebatePavilion] = useState(false)
  const [showBingyan, setShowBingyan] = useState(false)
  const [showRegionScene, setShowRegionScene] = useState(false)
  const [showSectModal, setShowSectModal] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [currentRegionId, setCurrentRegionId] = useState(null)
  const [regionLogs, setRegionLogs] = useState({})
  const [pendingSects, setPendingSects] = useState([])
  const [pendingBandit, setPendingBandit] = useState(null)
  const banditPayGuardRef = useRef(false)
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
  const [showCharacterStats, setShowCharacterStats] = useState(false)
  const [battleState, setBattleState] = useState(null)
  const [battleReward, setBattleReward] = useState(null)
  const [showCharacterCreation, setShowCharacterCreation] = useState(true)
  const [creationDraft, setCreationDraft] = useState(() => loadSave()?.characterProfile ?? getDefaultCharacterProfile())

  useEffect(() => {
    if (lastGain > 0) {
      const t = setTimeout(() => setLastGain(0), 1500)
      return () => clearTimeout(t)
    }
  }, [lastGain])

  useEffect(() => {
    if (!battleReward) return
    const t = setTimeout(() => setBattleReward(null), 3000)
    return () => clearTimeout(t)
  }, [battleReward])

  useEffect(() => {
    try {
      localStorage.setItem(AUTO_CULTIVATE_KEY, autoCultivate ? '1' : '0')
    } catch (_) {}
  }, [autoCultivate])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...state,
        characterProfile: normalizeCharacterProfile(state.characterProfile),
      }))
    } catch (_) {}
  }, [state])

  useEffect(() => {
    if (!state.characterProfile) {
      setCreationDraft(getDefaultCharacterProfile())
      return
    }
    setCreationDraft(state.characterProfile)
  }, [state.characterProfile])

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
    techniqueMastery = {},
    ownedRecipes = INITIAL_OWNED_RECIPES,
    learnedRecipes = [],
    ownedFurnaces = INITIAL_OWNED_FURNACES,
    equippedFurnaceId = null,
    lastCraftResult = null,
    joinedSect = null,
    sectContribution = 0,
    sectRankIndex = 0,
    cuitiUsedCount = 0,
    xueUsedCount = 0,
    shenxingUsedCount = 0,
    feishengUnlocked = false,
    characterProfile = null,
  } = state
  const creationBonuses = characterProfile
    ? getCharacterBonuses(characterProfile)
    : {
        attackBonus: 0,
        hpBonus: 0,
        speedBonus: 0,
        cultivationFlatBonus: 0,
        cultivationRateMultiplier: 1,
        treasureCostMultiplier: 1,
      }
  const selection = getCharacterSelection(characterProfile ?? getDefaultCharacterProfile())
  const nextStage = getNextRealmLayer(realmIndex, layer, { feishengUnlocked })
  const breakthroughLockedByOpportunity = !nextStage && isFeishengStage(realmIndex + 1) && !feishengUnlocked
  const isMaxRealm = !nextStage

  const required = isMaxRealm
    ? Infinity
    : getBreakthroughRequired(nextStage.realmIndex, nextStage.layer)
  const canBreakthrough = cultivation >= required && !isMaxRealm

  const learnedTechniqueBonuses = (learnedTechs ?? [])
    .map((id) => {
      const tech = getTechniqueById(id)
      const exp = getTechniqueMasteryExp(techniqueMastery, id)
      return getTechniqueEffectiveBonuses(tech, exp)
    })
    .reduce((sum, bonus) => ({
      cultivationBonus: sum.cultivationBonus + (bonus.cultivationBonus ?? 0),
      attackBonus: sum.attackBonus + (bonus.attackBonus ?? 0),
      hpBonus: sum.hpBonus + (bonus.hpBonus ?? 0),
      speedBonus: sum.speedBonus + (bonus.speedBonus ?? 0),
    }), { cultivationBonus: 0, attackBonus: 0, hpBonus: 0, speedBonus: 0 })

  const baseCycleGain = getCultivationGain(realmIndex, layer) + learnedTechniqueBonuses.cultivationBonus + creationBonuses.cultivationFlatBonus
  const gainPerCycle = Math.max(1, Math.round(baseCycleGain * creationBonuses.cultivationRateMultiplier))
  const equipmentAttackBonus = (equipment?.weapons ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + getWeaponAttackBonus(s.itemId), 0)
  const attack = getAttack(realmIndex, layer, equipmentAttackBonus + xueUsedCount * 5 + creationBonuses.attackBonus + learnedTechniqueBonuses.attackBonus)
  const armorHpBonus = (equipment?.armors ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + (getArmorHpBonus ? getArmorHpBonus(s.itemId) : 0), 0)
  const hp = getHp(realmIndex, layer) + armorHpBonus + cuitiUsedCount * 10 + creationBonuses.hpBonus + learnedTechniqueBonuses.hpBonus
  const speed = getSpeed(realmIndex, layer) + shenxingUsedCount * 1 + creationBonuses.speedBonus + learnedTechniqueBonuses.speedBonus

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
          const target = getNextRealmLayer(s.realmIndex, s.layer, { feishengUnlocked: s.feishengUnlocked ?? false })
          const req = target ? getBreakthroughRequired(target.realmIndex, target.layer) : s.cultivation + gainPerCycle
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

  const isBigRealmBreak = isMajorRealmBreak(realmIndex, layer, { feishengUnlocked })
  const nextRealmIndex = nextStage?.realmIndex ?? realmIndex
  const pillBonus = pillSuccessBonus?.[nextRealmIndex] ?? 0
  // 大境界突破基础成功率：初始约 60%，多次失败后逐步降低到 10%
  const baseBigRealmRate = Math.max(10, 60 - (bigRealmBreakCount ?? 0) * 10)
  const bigRealmSuccessRate = Math.min(95, baseBigRealmRate + pillBonus)

  const doBreakthrough = useCallback(() => {
    if (!canBreakthrough) return
    if (isBigRealmBreak) {
      const roll = Math.random() * 100
      if (roll >= bigRealmSuccessRate) {
        setState((s) => ({ ...s, cultivation: 0, bigRealmBreakCount: (s.bigRealmBreakCount ?? 0) + 1 }))
        setBreakthroughFailed(true)
        return
      }
    }
    setBreakthroughFailed(false)
    const target = getNextRealmLayer(realmIndex, layer, { feishengUnlocked })
    if (!target) return
    setState((s) => ({
      ...s,
      realmIndex: target.realmIndex,
      layer: target.layer,
      cultivation: s.cultivation - required,
      bigRealmBreakCount: isBigRealmBreak ? 0 : s.bigRealmBreakCount,
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

  /** 使用直接类丹药：
   * - 养魂丹 / 养魂精丹：直接增加修为（不超过当前突破所需）
   * - 淬体丹 / 龙力丹 / 神行丹：增加血量 / 攻击 / 速度，使用次数有限
   */
  const handleUseDirectPill = useCallback((itemId) => {
    setState((s) => {
      const inv = s.inventory ?? {}
      if ((inv[itemId] ?? 0) < 1) return s
      const item = getItemById(itemId)
      if (item?.fillCurrentRealm) {
        const target = getNextRealmLayer(s.realmIndex, s.layer, { feishengUnlocked: s.feishengUnlocked ?? false })
        const req = target
          ? getBreakthroughRequired(target.realmIndex, target.layer)
          : s.cultivation
        return {
          ...s,
          cultivation: req,
          inventory: removeFromInventory(inv, itemId, 1),
        }
      }
      const gain = getPillCultivationGain(itemId)
      // 养魂类丹药：增加修为
      if (gain > 0) {
        const target = getNextRealmLayer(s.realmIndex, s.layer, { feishengUnlocked: s.feishengUnlocked ?? false })
        const req = target
          ? getBreakthroughRequired(target.realmIndex, target.layer)
          : s.cultivation + gain
        const newCultivation = Math.min(s.cultivation + gain, req)
        return {
          ...s,
          cultivation: newCultivation,
          inventory: removeFromInventory(inv, itemId, 1),
        }
      }
      // 淬体丹 / 龙力丹 / 神行丹：有限次数加成
      if (itemId === 'cuiti_dan') {
        const used = s.cuitiUsedCount ?? 0
        if (used >= 50) return s
        return {
          ...s,
          cuitiUsedCount: used + 1,
          inventory: removeFromInventory(inv, itemId, 1),
        }
      }
      if (itemId === 'longli_dan') {
        const used = s.xueUsedCount ?? 0
        if (used >= 50) return s
        return {
          ...s,
          xueUsedCount: used + 1,
          inventory: removeFromInventory(inv, itemId, 1),
        }
      }
      if (itemId === 'shenxing_dan') {
        const used = s.shenxingUsedCount ?? 0
        if (used >= 10) return s
        return {
          ...s,
          shenxingUsedCount: used + 1,
          inventory: removeFromInventory(inv, itemId, 1),
        }
      }
      return s
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
      const newBonus = { ...bonus, [pill.realmIndex]: Math.min(35, (bonus[pill.realmIndex] ?? 0) + 5) }
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

  const handleRedeemPills = useCallback((pillCounts) => {
    setState((s) => {
      let inv = s.inventory ?? {}
      for (const [pillId, count] of Object.entries(pillCounts)) {
        if (count > 0) inv = addToInventory(inv, pillId, count)
      }
      return { ...s, inventory: inv }
    })
  }, [])

  const handleRedeemContribution = useCallback((amount) => {
    setState((s) => ({
      ...s,
      sectContribution: (s.sectContribution ?? 0) + amount,
    }))
  }, [])

  const handleEnterRegion = useCallback((regionId) => {
    if (!regionId) return
    setCurrentRegionId(regionId)
    setShowWorldMap(false)
    setShowRegionScene(true)
    setPendingBandit(null)
  }, [])

  const pushDiscoveredSect = useCallback((sect, regionId, mode = 'interactive') => {
    const discoveredSect = { ...sect, discoveredRegionId: regionId }
    let added = false
    setPendingSects((prev) => {
      if (prev.some((item) => item.id === sect.id)) return prev
      added = true
      return [...prev, discoveredSect]
    })
    if (!added) {
      appendRegionLog(regionId, `你再次路过「${sect.name}」，山门依旧巍峨，只是这次未见更多异状。`)
      return
    }
    if (mode === 'batch') {
      appendRegionLog(regionId, `你在连续探索中记下了「${sect.name}」的山门位置，已列入可拜访宗门。`)
      return
    }
    const requirementText = sect.requiresTrial
      ? '需通过圣地考核'
      : sect.level <= 3
        ? '暂无门槛'
        : `需至少修至「${REALMS[sect.minRealmIndex] ?? '更高境界'}」`
    appendRegionLog(
      regionId,
      joinedSect
        ? `你远远望见一座宗门——「${sect.name}」（${sect.levelLabel}，${requirementText}）。你虽已另有师承，仍先将其记入可接触宗门列表。`
        : `你远远望见一座宗门——「${sect.name}」（${sect.levelLabel}，${requirementText}），已记入可接触宗门列表。`,
    )
  }, [appendRegionLog, joinedSect])

  const processExploreEvent = useCallback((regionId, { interactive = true } = {}) => {
    const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
    const roll = Math.random()
    if (roll < 0.35) {
      const delta = 1 + Math.floor(Math.random() * 100)
      setState((s) => ({
        ...s,
        spiritStones: (s.spiritStones ?? 0) + delta,
      }))
      appendRegionLog(regionId, `在${regionName}探索时，你意外拾取了 ${delta} 枚灵石。`)
      return
    }
    if (roll < 0.7 && MATERIAL_IDS.length > 0) {
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
    if (roll < 0.88) {
      const offsets = [0, -1, 1, -2, 2, -3, 3]
      const weights = [0.4, 0.2, 0.2, 0.08, 0.08, 0.02, 0.02]
      const r = Math.random()
      let acc = 0
      let pickedOffset = 0
      for (let i = 0; i < offsets.length; i += 1) {
        acc += weights[i]
        if (r <= acc) {
          pickedOffset = offsets[i]
          break
        }
      }
      const candidate = realmIndex + pickedOffset
      const enemyRealmIndex = Math.min(REALMS.length - 1, Math.max(0, candidate))
      const enemyRealmName = REALMS[enemyRealmIndex]
      if (!interactive) {
        let successChance = 0.5 + 0.1 * (realmIndex - enemyRealmIndex)
        successChance = Math.max(0.2, Math.min(0.8, successChance))
        const win = Math.random() < successChance
        if (win) {
          const gain = 100 + Math.floor(Math.random() * 2901)
          setState((s) => ({
            ...s,
            spiritStones: (s.spiritStones ?? 0) + gain,
          }))
          appendRegionLog(regionId, `你在连续探索中与一名「${enemyRealmName}」修士交手，胜出后夺得 ${gain} 枚灵石。`)
        } else {
          setState((s) => {
            const cur = s.spiritStones ?? 0
            const loss = Math.floor(cur / 2)
            return {
              ...s,
              spiritStones: cur - loss,
            }
          })
          appendRegionLog(regionId, `你在连续探索中遭遇一名「${enemyRealmName}」修士，不敌之下被夺去一半灵石。`)
        }
        return
      }
      setPendingBandit({ regionId, enemyRealmIndex, enemyRealmName })
      appendRegionLog(
        regionId,
        `你在${regionName}山道间行走时，被一名「${enemyRealmName}」修士拦住去路，冷声索要灵石。`,
      )
      return
    }
    const sect = getRandomSectForRegion(regionId)
    if (!sect) {
      appendRegionLog(regionId, `你在${regionName}四处游历，却一无所获。`)
      return
    }
    pushDiscoveredSect(sect, regionId, interactive ? 'interactive' : 'batch')
  }, [appendRegionLog, joinedSect, realmIndex, pushDiscoveredSect])

  const handleExploreRegion = useCallback((regionId) => {
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
    processExploreEvent(regionId, { interactive: true })
  }, [appendRegionLog, exploreWindowStart, exploreUsed, exploreExtra, processExploreEvent])

  const handleExploreRegionTen = useCallback((regionId) => {
    const now = Date.now()
    const expired = now - exploreWindowStart >= 60 * 60 * 1000
    const baseUsed = expired ? 0 : exploreUsed
    const baseExtra = expired ? 0 : exploreExtra
    if (expired) {
      setExploreWindowStart(now)
      setExploreExtra(0)
    }
    const maxCount = 10 + baseExtra
    const available = Math.max(0, maxCount - baseUsed)
    if (available <= 0) {
      const regionName = REGION_NAME_MAP[regionId] ?? '未知地域'
      appendRegionLog(regionId, `你想在${regionName}连续探索十次，却发现本小时的探索次数已经耗尽。`)
      return
    }
    const actualRuns = Math.min(10, available)
    setExploreUsed(baseUsed + actualRuns)
    appendRegionLog(regionId, `你在${REGION_NAME_MAP[regionId] ?? '此地'}凝神搜山，连续探索了 ${actualRuns} 次。`)
    for (let i = 0; i < actualRuns; i += 1) {
      processExploreEvent(regionId, { interactive: false })
    }
  }, [appendRegionLog, exploreWindowStart, exploreUsed, exploreExtra, processExploreEvent])

  const handleDismissSect = useCallback((sectId) => {
    if (!sectId) return
    setPendingSects((prev) => prev.filter((sect) => sect.id !== sectId))
    if (currentRegionId) {
      appendRegionLog(currentRegionId, '你将这处宗门记号暂且划去，打算日后再议。')
    }
  }, [appendRegionLog, currentRegionId])

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
    if (!pendingBandit || !currentRegionId) return
    const { enemyRealmIndex, enemyRealmName } = pendingBandit
    // 敌方基础属性按其境界计算，再加少量随机浮动
    const enemyLayer = Math.min(getRealmLayerCount(enemyRealmIndex), layer + 1)
    const enemyBaseAttack = getAttack(enemyRealmIndex, enemyLayer, 0)
    const enemyBaseHp = getHp(enemyRealmIndex, enemyLayer)
    const enemyBaseSpeed = getSpeed(enemyRealmIndex, enemyLayer)

    // 随机 4 件法器和 4 件防具加成
    const shuffledWeapons = [...WEAPON_IDS].sort(() => Math.random() - 0.5)
    const shuffledArmors = [...ARMOR_IDS].sort(() => Math.random() - 0.5)
    const weaponBonus = shuffledWeapons.slice(0, 4).reduce((sum, id) => sum + getWeaponAttackBonus(id), 0)
    const armorBonus = shuffledArmors.slice(0, 4).reduce((sum, id) => sum + getArmorHpBonus(id), 0)

    const enemyAttack = Math.floor(enemyBaseAttack * (0.9 + Math.random() * 0.4)) + weaponBonus
    const enemyHpMax = Math.floor(enemyBaseHp * (0.9 + Math.random() * 0.4)) + armorBonus
    const enemySpeed = Math.max(5, Math.floor(enemyBaseSpeed * (0.9 + Math.random() * 0.4)))

    const playerHpMax = hp
    const playerSpeed = speed

    const firstTurn = playerSpeed >= enemySpeed ? 'player' : 'enemy'

    setBattleState({
      source: 'bandit',
      enemyName: `拦路修士（${enemyRealmName}）`,
      enemyAttack,
      enemyHpMax,
      enemyHp: enemyHpMax,
      enemySpeed,
      playerAttack: attack,
      playerHpMax,
      playerHp: playerHpMax,
      playerSpeed,
      turn: firstTurn,
      finished: false,
      winner: null,
      log: [`你与一名「${enemyRealmName}」修士交战，战斗开始！`],
    })
  }, [pendingBandit, currentRegionId, attack, hp, speed, layer])

  useEffect(() => {
    if (!pendingBandit) banditPayGuardRef.current = false
  }, [pendingBandit])

  const handleBanditPay = useCallback(() => {
    if (!pendingBandit) return
    if (banditPayGuardRef.current) return // 防止重复触发，只执行一次
    const cur = spiritStones ?? 0
    if (cur < 1000) {
      appendRegionLog(
        currentRegionId,
        `你想以破财消灾，却发现灵石不足，对方冷笑不语，似乎并不打算就此罢手。`,
      )
      return
    }
    banditPayGuardRef.current = true
    const { enemyRealmName } = pendingBandit
    setPendingBandit(null)
    appendRegionLog(
      currentRegionId,
      `你咬牙交出一袋 1000 枚灵石，这名「${enemyRealmName}」修士满意离去。`,
    )
    setState((s) => ({
      ...s,
      spiritStones: (s.spiritStones ?? 0) - 1000,
    }))
  }, [appendRegionLog, currentRegionId, pendingBandit, spiritStones])

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
    handleBanditFight()
  }, [appendRegionLog, currentRegionId, pendingBandit, handleBanditFight])

  const handleChallengeSect = useCallback((sect) => {
    if (!sect || !currentRegionId) return
    const baseRealmByLevel = {
      1: 10,
      2: 15,
      3: 18,
      4: 29,
      5: 34,
      6: 38,
    }
    const enemyRealmIndex = sect.minRealmIndex ?? baseRealmByLevel[sect.level] ?? realmIndex
    const enemyLayer = Math.min(getRealmLayerCount(enemyRealmIndex), Math.max(1, layer))
    const enemyBaseAttack = getAttack(enemyRealmIndex, enemyLayer, 0)
    const enemyBaseHp = getHp(enemyRealmIndex, enemyLayer)
    const enemyBaseSpeed = getSpeed(enemyRealmIndex, enemyLayer)
    const enemyAttack = Math.floor(enemyBaseAttack * (1 + sect.level * 0.04))
    const enemyHpMax = Math.floor(enemyBaseHp * (1 + sect.level * 0.06))
    const enemySpeed = Math.max(5, Math.floor(enemyBaseSpeed * (1 + sect.level * 0.03)))
    const playerHpMax = hp
    const playerSpeed = speed
    const firstTurn = playerSpeed >= enemySpeed ? 'player' : 'enemy'

    appendRegionLog(currentRegionId, `你向「${sect.name}」山门递上战帖，请求与门下修士切磋一场。`)
    setBattleState({
      source: 'sect',
      sectId: sect.id,
      sectName: sect.name,
      enemyName: `${sect.name}守山弟子`,
      enemyAttack,
      enemyHpMax,
      enemyHp: enemyHpMax,
      enemySpeed,
      playerAttack: attack,
      playerHpMax,
      playerHp: playerHpMax,
      playerSpeed,
      turn: firstTurn,
      finished: false,
      winner: null,
      log: [`你与「${sect.name}」门下修士当场切磋，四周观战者渐渐聚拢。`],
    })
  }, [appendRegionLog, attack, currentRegionId, hp, layer, realmIndex, speed])

  const handleBattleNextTurn = useCallback(() => {
    setBattleState((state) => {
      if (!state || state.finished) return state
      const log = [...(state.log ?? [])]
      let { playerHp, enemyHp, turn } = state

      if (turn === 'player') {
        enemyHp = Math.max(0, enemyHp - state.playerAttack)
        log.push(`你出手攻击，造成 ${state.playerAttack} 伤害。`)
        turn = 'enemy'
      } else {
        playerHp = Math.max(0, playerHp - state.enemyAttack)
        log.push(`对方出手攻击，造成 ${state.enemyAttack} 伤害。`)
        turn = 'player'
      }

      let finished = false
      let winner = null
      if (enemyHp <= 0 || playerHp <= 0) {
        finished = true
        if (enemyHp <= 0 && playerHp > 0) {
          winner = 'player'
          log.push('你击败了对手。')
        } else if (playerHp <= 0 && enemyHp > 0) {
          winner = 'enemy'
          log.push('你不敌对手，被击倒在地。')
        } else {
          winner = 'draw'
          log.push('双方几乎同时倒下，勉强算作平手。')
        }
      }

      return {
        ...state,
        playerHp,
        enemyHp,
        turn,
        finished,
        winner,
        log,
      }
    })
  }, [])

  useEffect(() => {
    if (!battleState || !battleState.finished || battleState.source !== 'bandit' || !pendingBandit || !currentRegionId) return

    const { enemyRealmName, enemyRealmIndex } = pendingBandit
    if (battleState.winner === 'player' || battleState.winner === 'draw') {
      const rewardStones = 200 * (enemyRealmIndex + 1)
      setState((s) => ({
        ...s,
        spiritStones: (s.spiritStones ?? 0) + rewardStones,
      }))
      setBattleReward({ type: 'win', stones: rewardStones })
      appendRegionLog(
        currentRegionId,
        `你与这名「${enemyRealmName}」修士大战数招，最终将其击退，对方狼狈遁走，缴获 ${rewardStones} 枚灵石。`,
      )
    } else if (battleState.winner === 'enemy') {
      setState((s) => {
        const cur = s.spiritStones ?? 0
        const loss = Math.floor(cur / 2)
        return {
          ...s,
          spiritStones: cur - loss,
        }
      })
      const curStones = spiritStones ?? 0
      const lossNow = Math.floor(curStones / 2)
      if (lossNow > 0) {
        setBattleReward({ type: 'lose', loss: lossNow })
      }
      appendRegionLog(
        currentRegionId,
        `你不敌这名「${enemyRealmName}」修士，被迫交出一半随身灵石后才得以脱身。`,
      )
    }
    setBattleState(null)
    setPendingBandit(null)
  }, [battleState, pendingBandit, currentRegionId, appendRegionLog])

  useEffect(() => {
    if (!battleState || !battleState.finished || battleState.source !== 'sect' || !currentRegionId) return
    const sect = pendingSects.find((item) => item.id === battleState.sectId)
    const sectName = sect?.name ?? battleState.sectName ?? '该宗门'
    if (battleState.winner === 'player') {
      const rewardStones = 120 * ((sect?.level ?? 1) + 1)
      setState((s) => ({
        ...s,
        spiritStones: (s.spiritStones ?? 0) + rewardStones,
      }))
      appendRegionLog(currentRegionId, `你在「${sectName}」山门前切磋得胜，赢得围观弟子侧目，并获赠 ${rewardStones} 枚灵石作为彩头。`)
    } else if (battleState.winner === 'draw') {
      appendRegionLog(currentRegionId, `你与「${sectName}」门下修士打成平手，对方对你多了几分正视。`)
    } else if (battleState.winner === 'enemy') {
      appendRegionLog(currentRegionId, `你在「${sectName}」前切磋失利，只得拱手退下，暂且记住这一战。`)
    }
    setBattleState(null)
  }, [battleState, currentRegionId, pendingSects, appendRegionLog])

  const handleJoinSect = useCallback((sect) => {
    if (!sect) return
    if (joinedSect?.id === sect.id) {
      appendRegionLog(currentRegionId, `你本就是「${sect.name}」门下弟子，无需再次拜入。`)
      return
    }
    if (joinedSect) {
      appendRegionLog(currentRegionId, `你已拜入「${joinedSect.name}」，若想转投「${sect.name}」，需先回原宗退出宗门。`)
      return
    }
    const { minRealmIndex, requiresTrial } = sect
    if (requiresTrial) {
      appendRegionLog(currentRegionId, `你尝试拜入「${sect.name}」，却被告知圣地需先通过专门考核，具体内容尚未开放。`)
      return
    }
    if (minRealmIndex != null && realmIndex < minRealmIndex) {
      appendRegionLog(currentRegionId, `你尝试加入「${sect.name}」，但境界不足，被守门弟子婉拒。`)
      return
    }
    setState((s) => ({
      ...s,
      joinedSect: sect,
      sectContribution: 0,
      sectRankIndex: 0,
    }))
    appendRegionLog(currentRegionId, `你正式拜入「${sect.name}」，成为其门下弟子。`)
    setPendingSects((prev) => prev.filter((item) => item.id !== sect.id))
  }, [realmIndex, currentRegionId, appendRegionLog, joinedSect])

  const handleAddContribution = useCallback((amount) => {
    setState((s) => ({
      ...s,
      sectContribution: (s.sectContribution ?? 0) + amount,
    }))
  }, [])

  const handleUpgradeRank = useCallback(() => {
    setState((s) => {
      const cur = s.sectRankIndex ?? 0
      const next = SECT_RANKS[cur + 1]
      if (!next) return s
      const contrib = s.sectContribution ?? 0
      if (contrib < next.upgradeCost) return s
      return {
        ...s,
        sectContribution: contrib - next.upgradeCost,
        sectRankIndex: cur + 1,
      }
    })
  }, [])

  const handleBuyTreasuryItem = useCallback((type, id, cost) => {
    setState((s) => {
      const contrib = s.sectContribution ?? 0
      if (contrib < cost) return s
      if (type === 'technique') {
        const learned = s.learnedTechs ?? []
        if (learned.includes(id)) return s
        return {
          ...s,
          sectContribution: contrib - cost,
          learnedTechs: [...learned, id],
        }
      }
      if (type === 'weapon' || type === 'armor') {
        return {
          ...s,
          sectContribution: contrib - cost,
          inventory: addToInventory(s.inventory ?? {}, id, 1),
        }
      }
      return s
    })
  }, [])

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
        techniqueMastery: { ...(s.techniqueMastery ?? {}), [techId]: s.techniqueMastery?.[techId] ?? 0 },
      }
    })
  }, [])

  const handlePracticeTechnique = useCallback((techId) => {
    setState((s) => {
      const learned = s.learnedTechs ?? []
      if (!learned.includes(techId)) return s
      return {
        ...s,
        techniqueMastery: {
          ...(s.techniqueMastery ?? {}),
          [techId]: (s.techniqueMastery?.[techId] ?? 0) + 1,
        },
      }
    })
  }, [])

  const handleInsightTechnique = useCallback((techId) => {
    setState((s) => {
      const learned = s.learnedTechs ?? []
      if (!learned.includes(techId)) return s
      return {
        ...s,
        techniqueMastery: {
          ...(s.techniqueMastery ?? {}),
          [techId]: (s.techniqueMastery?.[techId] ?? 0) + 3,
        },
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
      if (!canCraftWithInventory(pillId, s.inventory, creationBonuses.treasureCostMultiplier)) return s
      const rate = getCraftSuccessRate(pillId, s.equippedFurnaceId ?? null)
      const success = Math.random() * 100 < rate
      const inv = deductCraftMaterials(s.inventory, pillId, creationBonuses.treasureCostMultiplier)
      const count = success ? getCraftResultCount(pillId) : 0
      return {
        ...s,
        inventory: success ? addToInventory(inv, pillId, count) : inv,
        lastCraftResult: { success, pillId, count },
      }
    })
  }, [creationBonuses.treasureCostMultiplier])

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

  const handleCharacterDraftChange = useCallback((patch) => {
    setCreationDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const handleCreateCharacter = useCallback(() => {
    const normalizedProfile = normalizeCharacterProfile(creationDraft)
    setState((prev) => {
      if (!isFreshRunState(prev)) {
        return { ...prev, characterProfile: normalizedProfile }
      }
      return buildCharacterState(normalizedProfile)
    })
    setShowCharacterCreation(false)
    setShowCharacterStats(false)
    setShowLoadModal(false)
    setShowSaveModal(false)
  }, [creationDraft])

  const handleStartNewCharacter = useCallback(() => {
    setCreationDraft(getDefaultCharacterProfile())
  }, [])

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <button type="button" className="btn-save-load" onClick={() => setShowSaveModal(true)}>存档</button>
          <button type="button" className="btn-save-load" onClick={() => setShowLoadModal(true)}>读档</button>
        </div>
        <div className="header-center">
          <h1>修仙传</h1>
          <p className="subtitle">
            {characterProfile
              ? `${characterProfile.name} · ${selection.gender.label} · ${selection.spiritRoot.label}`
              : '问道长生'}
          </p>
        </div>
      </header>
      <SaveSlotModal
        show={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        slotCount={SAVE_SLOTS_COUNT}
        getSlotInfo={getSlotInfo}
        onSaveToSlot={(index) => saveToSlot(state, index)}
        onDeleteSlot={(index) => localStorage.removeItem(getSaveSlotKey(index))}
      />
      <LoadSlotModal
        show={showLoadModal}
        onClose={() => setShowLoadModal(false)}
        slotCount={SAVE_SLOTS_COUNT}
        getSlotInfo={getSlotInfo}
        onLoad={(index) => {
          const loaded = loadFromSlot(index)
          if (loaded) {
            setState(loaded)
            setShowCharacterCreation(!loaded.characterProfile)
          }
        }}
      />
      <CharacterCreationModal
        show={showCharacterCreation}
        draft={creationDraft}
        onChange={handleCharacterDraftChange}
        onConfirm={handleCreateCharacter}
        onOpenLoad={() => setShowLoadModal(true)}
        onStartNew={handleStartNewCharacter}
      />

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
            onClick={() => setShowDebatePavilion(true)}
          >
            论道阁
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
              <button
                type="button"
                className="btn-character-panel"
                onClick={() => setShowCharacterStats((v) => !v)}
              >
                人物
              </button>
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
            <CharacterPortrait
              isCultivating={isCultivating}
              onToggleStats={() => setShowCharacterStats((v) => !v)}
            />
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
            onSortInventory={() => {
              setState((prev) => ({
                ...prev,
                inventory: { ...normalizeInventory(prev.inventory) },
              }))
            }}
            cuitiUsedCount={cuitiUsedCount}
            xueUsedCount={xueUsedCount}
            shenxingUsedCount={shenxingUsedCount}
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
          nextStage
            ? getRealmDisplayName(nextStage.realmIndex, nextStage.layer)
            : breakthroughLockedByOpportunity
              ? '需机缘或传承开启'
              : '已至尽头'
        }
        nextRealmIndex={isBigRealmBreak && nextStage ? nextStage.realmIndex : null}
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
        onRedeemPills={handleRedeemPills}
        onRedeemContribution={handleRedeemContribution}
      />

      <TreasurePavilionModal
        show={showTreasurePavilion}
        onClose={() => setShowTreasurePavilion(false)}
        inventory={inventory}
        spiritStones={spiritStones ?? 0}
        shopItems={shopItems ?? []}
        ownedRecipes={ownedRecipes}
        learnedRecipes={learnedRecipes}
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
        mastery={techniqueMastery}
        onLearn={handleLearnTechnique}
        onPractice={handlePracticeTechnique}
        onInsight={handleInsightTechnique}
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
        materialCostMultiplier={creationBonuses.treasureCostMultiplier}
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

      <DebatePavilionModal
        show={showDebatePavilion}
        onClose={() => setShowDebatePavilion(false)}
        onEnterBingyan={() => {
          setShowDebatePavilion(false)
          setShowBingyan(true)
        }}
      />

      <BingyanModal
        show={showBingyan}
        onClose={() => {
          setShowBingyan(false)
          setShowDebatePavilion(true)
        }}
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
          setPendingBandit(null)
          setShowWorldMap(true)
        }}
        logs={regionLogs[currentRegionId] ?? []}
        exploreRemaining={Math.max(0, 10 + exploreExtra - exploreUsed)}
        pendingSects={pendingSects.filter((sect) => sect.discoveredRegionId === currentRegionId)}
        pendingBandit={pendingBandit}
        onExplore={handleExploreRegion}
        onExploreTen={handleExploreRegionTen}
        onJoinSect={handleJoinSect}
        onDismissSect={handleDismissSect}
        onChallengeSect={handleChallengeSect}
        onBuyExploreChance={handleBuyExploreChance}
        onBanditFight={handleBanditFight}
        onBanditPay={handleBanditPay}
        onBanditEscape={handleBanditEscape}
        battleState={battleState}
        onBattleNextTurn={handleBattleNextTurn}
      />

      {showCharacterStats && (
        <div
          className="character-stats-overlay"
          onClick={() => setShowCharacterStats(false)}
        >
          <div
            className="character-stats-modal gu-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="btn-char-back"
              onClick={() => setShowCharacterStats(false)}
            >
              返回
            </button>
            <h3 className="character-stats-modal-title">人物属性</h3>
            <div className="character-stats-row">
              <span className="label">姓名</span>
              <span className="value">{characterProfile?.name ?? '未入道'}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">性别</span>
              <span className="value">{selection.gender.label}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">灵根</span>
              <span className="value">{selection.spiritRoot.label}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">家境</span>
              <span className="value">{selection.background.label}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">机遇</span>
              <span className="value">{selection.destiny.label}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">攻击</span>
              <span className="value">{attack}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">血量</span>
              <span className="value">{hp}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">速度</span>
              <span className="value">{speed}</span>
            </div>
            <div className="character-stats-row">
              <span className="label">修炼效率</span>
              <span className="value">{Math.round(creationBonuses.cultivationRateMultiplier * 100)}%</span>
            </div>
            <div className="character-stats-row">
              <span className="label">修炼加成</span>
              <span className="value">{creationBonuses.cultivationFlatBonus >= 0 ? '+' : ''}{creationBonuses.cultivationFlatBonus}/轮</span>
            </div>
            <div className="character-stats-row">
              <span className="label">灵材消耗</span>
              <span className="value">{Math.round(creationBonuses.treasureCostMultiplier * 100)}%</span>
            </div>
          </div>
        </div>
      )}

      <SectModal
        show={showSectModal}
        onClose={() => setShowSectModal(false)}
        sect={joinedSect}
        onLeaveSect={() => setState((s) => ({ ...s, joinedSect: null, sectContribution: 0, sectRankIndex: 0 }))}
        sectContribution={sectContribution}
        sectRankIndex={sectRankIndex}
        learnedTechs={learnedTechs}
        inventory={inventory}
        onAddContribution={handleAddContribution}
        onUpgradeRank={handleUpgradeRank}
        onBuyTreasuryItem={handleBuyTreasuryItem}
      />

      {battleReward && (
        <div className="battle-reward-toast">
          {battleReward.type === 'win' && <>战斗胜利，获得 {battleReward.stones} 灵石</>}
          {battleReward.type === 'lose' && <>战斗失败，损失 {battleReward.loss} 灵石</>}
        </div>
      )}
    </div>
  )
}

export default App

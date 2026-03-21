import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  REALMS,
  getCultivationGain,
  getBreakthroughRequired,
  getRealmDisplayName,
  getRealmStageName,
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
import BeastGardenModal from './components/BeastGardenModal'
import WorldMapModal from './components/WorldMapModal'
import DebatePavilionModal from './components/DebatePavilionModal'
import BingyanModal from './components/BingyanModal'
import RegionSceneModal from './components/RegionSceneModal'
import SectModal from './components/SectModal'
import { REGIONS, REGION_NAME_MAP, getRandomSectForRegion, SECT_RANKS } from './data/sects'
import {
  INITIAL_AVAILABLE_TECHNIQUES,
  SHOP_TECHNIQUE_IDS,
  TECHNIQUE_CONTEMPLATE_DURATION_MS,
  TECHNIQUE_MAX_MASTERY_EXP,
  getTechniqueById,
  getTechniqueEffectiveBonuses,
  getTechniqueMasteryExp,
  getTechniqueBuyPrice,
} from './data/techniques'
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
import { getItemSellPrice, addToInventory, getItemById, normalizeInventory, removeFromInventory, SHOP_ITEM_IDS, WEAPON_IDS, ARMOR_IDS, getWeaponAttackBonus, getPillCultivationGain, getArmorHpBonus, ITEM_TYPES, MATERIAL_SHOP_COUNT, MATERIAL_IDS, SPECIAL_BREAKTHROUGH_MATERIAL_IDS } from './data/items'
import CharacterCreationModal from './components/CharacterCreationModal'
import { getCharacterBonuses, getCharacterSelection, getDefaultCharacterProfile, normalizeCharacterProfile } from './data/characterCreation'
import { createEncounterBeast, getBeastBattleBonuses, tameBeast } from './data/beasts'
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
const SPECIAL_EXPLORE_FIND_CHANCE = 1 / 500
const WENDAO_REQUIRED_ITEM_ID = 'wudao_tea'
const FLYING_ASCENSION_DROP_REALM = { realmIndex: 32, layer: 1 }
const MAX_BEAST_STORAGE = 24

function pickRandomShopItems(count) {
  const pool = [...SHOP_ITEM_IDS, ...SHOP_TECHNIQUE_IDS]
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, pool.length))
}

function pickRandomWeapons(count) {
  const shuffled = [...WEAPON_IDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, Math.min(count, WEAPON_IDS.length))
}

/** 法器槽：无效 id、非「法器」类型一律视为空槽（避免存档里占位导致界面像空槽却装不上） */
function normalizeEquipmentWeapons(w) {
  const base = Array.isArray(w) ? w : []
  const arr = [...base, ...Array(4).fill(null)].slice(0, 4)
  return arr.map((slot) => {
    if (slot == null) return null
    const id = slot.itemId ?? slot.id
    if (!id) return null
    const it = getItemById(id)
    if (it?.type === ITEM_TYPES.WEAPON) return { itemId: id }
    return null
  })
}

/** 防具槽：同上，只保留合法防具 */
function normalizeEquipmentArmors(a) {
  const base = Array.isArray(a) ? a : []
  const arr = [...base, ...Array(4).fill(null)].slice(0, 4)
  return arr.map((slot) => {
    if (slot == null) return null
    const id = slot.itemId ?? slot.id
    if (!id) return null
    const it = getItemById(id)
    if (it?.type === ITEM_TYPES.ARMOR) return { itemId: id }
    return null
  })
}

function normalizeBeastArray(list, limit = MAX_BEAST_STORAGE) {
  if (!Array.isArray(list)) return []
  return list.filter((item) => item && typeof item === 'object' && item.id).slice(0, limit)
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
    specialBreakthroughBonus: data.specialBreakthroughBonus ?? {},
    shopLastRefreshTime: data.shopLastRefreshTime ?? 0,
    shopItems: Array.isArray(data.shopItems) ? data.shopItems : pickRandomShopItems(SHOP_SLOTS),
    learnedTechs: Array.isArray(data.learnedTechs) ? data.learnedTechs : [],
    availableTechs: Array.isArray(data.availableTechs) ? data.availableTechs : INITIAL_AVAILABLE_TECHNIQUES,
    techniqueMastery: data.techniqueMastery ?? {},
    ownedRecipes: Array.isArray(data.ownedRecipes) ? data.ownedRecipes : INITIAL_OWNED_RECIPES,
    learnedRecipes: Array.isArray(data.learnedRecipes) ? data.learnedRecipes : [],
    ownedFurnaces: Array.isArray(data.ownedFurnaces) ? data.ownedFurnaces : INITIAL_OWNED_FURNACES,
    equippedFurnaceId: data.equippedFurnaceId ?? null,
    activeBeasts: normalizeBeastArray(data.activeBeasts, 1),
    beastInventory: normalizeBeastArray(data.beastInventory, MAX_BEAST_STORAGE),
    joinedSect: data.joinedSect ?? null,
    sectContribution: data.sectContribution ?? 0,
    debatePoints: data.debatePoints ?? 0,
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
    specialBreakthroughBonus: {},
    shopLastRefreshTime: Date.now(),
    shopItems: pickRandomShopItems(SHOP_SLOTS),
    learnedTechs: [],
    availableTechs: INITIAL_AVAILABLE_TECHNIQUES,
    techniqueMastery: {},
    ownedRecipes: INITIAL_OWNED_RECIPES,
    learnedRecipes: [],
    ownedFurnaces: INITIAL_OWNED_FURNACES,
    equippedFurnaceId: null,
    activeBeasts: [],
    beastInventory: [],
    joinedSect: null,
    sectContribution: 0,
    debatePoints: 0,
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
      specialBreakthroughBonus: state.specialBreakthroughBonus ?? {},
      shopLastRefreshTime: state.shopLastRefreshTime ?? 0,
      shopItems: state.shopItems ?? [],
      learnedTechs: state.learnedTechs ?? [],
      availableTechs: state.availableTechs ?? INITIAL_AVAILABLE_TECHNIQUES,
      techniqueMastery: state.techniqueMastery ?? {},
      ownedRecipes: state.ownedRecipes ?? INITIAL_OWNED_RECIPES,
      learnedRecipes: state.learnedRecipes ?? [],
      ownedFurnaces: state.ownedFurnaces ?? INITIAL_OWNED_FURNACES,
      equippedFurnaceId: state.equippedFurnaceId ?? null,
      activeBeasts: normalizeBeastArray(state.activeBeasts, 1),
      beastInventory: normalizeBeastArray(state.beastInventory, MAX_BEAST_STORAGE),
      joinedSect: state.joinedSect ?? null,
      sectContribution: state.sectContribution ?? 0,
      debatePoints: state.debatePoints ?? 0,
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
  /** 功法感悟读条在 App 层运行，关闭功法阁界面后仍继续 */
  const [techniqueContemplation, setTechniqueContemplation] = useState(null)
  const [contemplationTick, setContemplationTick] = useState(0)
  const [showAlchemyRoom, setShowAlchemyRoom] = useState(false)
  const [showBeastGarden, setShowBeastGarden] = useState(false)
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
  const [pendingBandits, setPendingBandits] = useState([])
  const [pendingBeasts, setPendingBeasts] = useState([])
  const banditPayGuardRef = useRef(false)
  /** 用户在开屏点了「重新创建角色」后，确认建角应整档重置，不能只改人物档案 */
  const pendingNewGameAfterCreationRef = useRef(false)
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
    if (!battleReward) return undefined
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
    specialBreakthroughBonus,
    shopLastRefreshTime,
    shopItems,
    learnedTechs = [],
    availableTechs = INITIAL_AVAILABLE_TECHNIQUES,
    techniqueMastery = {},
    ownedRecipes = INITIAL_OWNED_RECIPES,
    learnedRecipes = [],
    ownedFurnaces = INITIAL_OWNED_FURNACES,
    equippedFurnaceId = null,
    activeBeasts = [],
    beastInventory = [],
    lastCraftResult = null,
    joinedSect = null,
    sectContribution = 0,
    debatePoints = 0,
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
  const isMaxRealm = !nextStage
  const nextRealmStageName = nextStage ? getRealmStageName(nextStage.realmIndex) : null
  const isUpperRealmBreak = Boolean(nextRealmStageName && ['闻道', '大乘', '渡劫', '化羽', '飞升'].includes(nextRealmStageName))
  const isAscensionBreak = nextRealmStageName === '飞升'
  const currentSpecialBreakBonus = nextStage && specialBreakthroughBonus?.[nextStage.realmIndex]
    ? specialBreakthroughBonus[nextStage.realmIndex]
    : null
  const specialAidBonus = currentSpecialBreakBonus?.bonus ?? 0
  const requiresWudaoTeaToBreak = realmIndex === 47 && layer === 4 && nextRealmStageName === '闻道'
  const hasWudaoTeaRequirementMet = !requiresWudaoTeaToBreak || Boolean(currentSpecialBreakBonus?.itemId === WENDAO_REQUIRED_ITEM_ID)

  const required = isMaxRealm
    ? Infinity
    : getBreakthroughRequired(nextStage.realmIndex, nextStage.layer)
  const isBigRealmBreak = isMajorRealmBreak(realmIndex, layer, { feishengUnlocked })
  const nextRealmIndex = nextStage?.realmIndex ?? realmIndex
  const pillBonus = pillSuccessBonus?.[nextRealmIndex] ?? 0
  const canOpenBreakthrough = cultivation >= required && !isMaxRealm
  const canBreakthrough = canOpenBreakthrough && hasWudaoTeaRequirementMet
  const breakthroughAidOptions = isBigRealmBreak
    ? isAscensionBreak
      ? []
      : nextRealmStageName === '闻道'
        ? [WENDAO_REQUIRED_ITEM_ID]
        : isUpperRealmBreak
          ? SPECIAL_BREAKTHROUGH_MATERIAL_IDS
          : []
    : []

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

  const activeBeast = activeBeasts[0] ?? null
  const activeBeastBonuses = getBeastBattleBonuses(activeBeast)

  const baseCycleGain = getCultivationGain(realmIndex, layer) + learnedTechniqueBonuses.cultivationBonus + creationBonuses.cultivationFlatBonus
  const gainPerCycle = Math.max(1, Math.round(baseCycleGain * creationBonuses.cultivationRateMultiplier))
  const equipmentAttackBonus = (equipment?.weapons ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + getWeaponAttackBonus(s.itemId), 0)
  const playerSpecialKillChance = (equipment?.weapons ?? [])
    .filter(Boolean)
    .reduce((maxChance, slot) => {
      const weapon = getItemById(slot.itemId)
      return Math.max(maxChance, weapon?.specialKillChance ?? 0)
    }, 0)
  const attack = getAttack(realmIndex, layer, equipmentAttackBonus + xueUsedCount * 5 + creationBonuses.attackBonus + learnedTechniqueBonuses.attackBonus + activeBeastBonuses.attackBonus)
  const armorHpBonus = (equipment?.armors ?? [])
    .filter(Boolean)
    .reduce((sum, s) => sum + (getArmorHpBonus ? getArmorHpBonus(s.itemId) : 0), 0)
  const hp = getHp(realmIndex, layer) + armorHpBonus + cuitiUsedCount * 10 + creationBonuses.hpBonus + learnedTechniqueBonuses.hpBonus + activeBeastBonuses.hpBonus
  const speed = getSpeed(realmIndex, layer) + shenxingUsedCount * 1 + creationBonuses.speedBonus + learnedTechniqueBonuses.speedBonus + activeBeastBonuses.speedBonus

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

  const pushPendingBandit = useCallback((bandit) => {
    if (!bandit?.id) return
    setPendingBandits((prev) => {
      if (prev.some((item) => item.id === bandit.id)) return prev
      return [...prev, bandit]
    })
  }, [])

  const pushPendingBeast = useCallback((entry) => {
    if (!entry?.id) return
    setPendingBeasts((prev) => {
      if (prev.some((item) => item.id === entry.id)) return prev
      return [...prev, entry]
    })
  }, [])
  // 大境界突破基础成功率：初始约 60%，多次失败后逐步降低到 10%。
  // 化羽圆满冲击飞升固定 50%，且不可由任何丹药或机缘物提升。
  const baseBigRealmRate = isAscensionBreak
    ? 50
    : Math.max(10, 60 - (bigRealmBreakCount ?? 0) * 10)
  const bigRealmSuccessRate = isAscensionBreak
    ? 50
    : Math.min(95, baseBigRealmRate + pillBonus + specialAidBonus)

  const doBreakthrough = useCallback(() => {
    if (!canBreakthrough) return
    const clearAttemptBonuses = (s) => {
      const nextPillBonus = { ...(s.pillSuccessBonus ?? {}) }
      const nextSpecialBonus = { ...(s.specialBreakthroughBonus ?? {}) }
      if (nextRealmIndex != null) {
        delete nextPillBonus[nextRealmIndex]
        delete nextSpecialBonus[nextRealmIndex]
      }
      return {
        pillSuccessBonus: nextPillBonus,
        specialBreakthroughBonus: nextSpecialBonus,
      }
    }

    if (isBigRealmBreak) {
      const roll = Math.random() * 100
      if (roll >= bigRealmSuccessRate) {
        setState((s) => {
          const cleared = clearAttemptBonuses(s)
          if (isAscensionBreak && roll >= 95) {
            return {
              ...s,
              ...cleared,
              realmIndex: FLYING_ASCENSION_DROP_REALM.realmIndex,
              layer: FLYING_ASCENSION_DROP_REALM.layer,
              cultivation: 0,
              bigRealmBreakCount: (s.bigRealmBreakCount ?? 0) + 1,
            }
          }
          return {
            ...s,
            ...cleared,
            cultivation: 0,
            bigRealmBreakCount: (s.bigRealmBreakCount ?? 0) + 1,
          }
        })
        setBreakthroughFailed(true)
        return
      }
    }
    setBreakthroughFailed(false)
    const target = getNextRealmLayer(realmIndex, layer, { feishengUnlocked })
    if (!target) return
    setState((s) => ({
      ...s,
      ...clearAttemptBonuses(s),
      realmIndex: target.realmIndex,
      layer: target.layer,
      cultivation: s.cultivation - required,
      bigRealmBreakCount: isBigRealmBreak ? 0 : s.bigRealmBreakCount,
    }))
    setShowBreakthrough(false)
  }, [canBreakthrough, realmIndex, layer, required, isBigRealmBreak, bigRealmSuccessRate, isAscensionBreak, nextRealmIndex])

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
    const itemMeta = getItemById(itemId)
    if (!itemMeta || itemMeta.type !== ITEM_TYPES.WEAPON) return
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = Math.max(0, Math.floor(Number(inv[itemId] ?? 0)))
      if (cur < 1) return s
      const weapons = [...normalizeEquipmentWeapons(s.equipment?.weapons)]
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
      const idx = weapons.findIndex((x) => x == null || !x?.itemId)
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
      const weapons = [...normalizeEquipmentWeapons(s.equipment?.weapons)]
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
    const itemMeta = getItemById(itemId)
    if (!itemMeta || itemMeta.type !== ITEM_TYPES.ARMOR) return
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = Math.max(0, Math.floor(Number(inv[itemId] ?? 0)))
      if (cur < 1) return s
      const armors = [...normalizeEquipmentArmors(s.equipment?.armors)]
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
      const idx = armors.findIndex((x) => x == null || !x?.itemId)
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
      const armors = [...normalizeEquipmentArmors(s.equipment?.armors)]
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
    const item = getItemById(itemId)
    if (!item || nextRealmIndex == null) return
    setState((s) => {
      const inv = s.inventory ?? {}
      const cur = inv[itemId] ?? 0
      if (cur < 1) return s

      if (item.type === 'pill') {
        const bonus = s.pillSuccessBonus ?? {}
        const newBonus = { ...bonus, [item.realmIndex]: Math.min(35, (bonus[item.realmIndex] ?? 0) + 5) }
        const newInv = removeFromInventory(inv, itemId, 1)
        return { ...s, inventory: newInv, pillSuccessBonus: newBonus }
      }

      if (SPECIAL_BREAKTHROUGH_MATERIAL_IDS.includes(itemId)) {
        if (isAscensionBreak) return s
        if (nextRealmStageName === '闻道' && itemId !== WENDAO_REQUIRED_ITEM_ID) return s
        const used = s.specialBreakthroughBonus ?? {}
        if (used[nextRealmIndex]) return s
        return {
          ...s,
          inventory: removeFromInventory(inv, itemId, 1),
          specialBreakthroughBonus: {
            ...used,
            [nextRealmIndex]: {
              itemId,
              bonus: 5,
            },
          },
        }
      }

      return s
    })
  }, [isAscensionBreak, nextRealmIndex, nextRealmStageName])

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

  const handleRedeemItems = useCallback((itemCounts) => {
    setState((s) => {
      let inv = s.inventory ?? {}
      for (const [itemId, count] of Object.entries(itemCounts)) {
        if (count > 0) inv = addToInventory(inv, itemId, count)
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

  const handleGainDebatePoints = useCallback((amount) => {
    if (!amount || amount <= 0) return
    setState((s) => ({
      ...s,
      debatePoints: (s.debatePoints ?? 0) + amount,
    }))
  }, [])

  const handleRedeemDebateShop = useCallback((itemId, cost, count) => {
    setState((s) => {
      const currentPoints = s.debatePoints ?? 0
      if (currentPoints < cost || count <= 0) return s
      return {
        ...s,
        debatePoints: currentPoints - cost,
        inventory: addToInventory(s.inventory ?? {}, itemId, count),
      }
    })
  }, [])

  const handleEnterRegion = useCallback((regionId) => {
    if (!regionId) return
    setCurrentRegionId(regionId)
    setShowWorldMap(false)
    setShowRegionScene(true)
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
    for (const specialId of SPECIAL_BREAKTHROUGH_MATERIAL_IDS) {
      if (Math.random() < SPECIAL_EXPLORE_FIND_CHANCE) {
        const item = getItemById(specialId)
        const name = item?.name ?? specialId
        setState((s) => ({
          ...s,
          inventory: addToInventory(s.inventory ?? {}, specialId, 1),
        }))
        appendRegionLog(regionId, `你在${regionName}深处撞见一缕天地奇机，最终得到 ${name} ×1，并将其收入背包。`)
        return { stopBatch: false }
      }
    }
    const roll = Math.random()
    if (roll < 0.35) {
      const delta = 1 + Math.floor(Math.random() * 100)
      setState((s) => ({
        ...s,
        spiritStones: (s.spiritStones ?? 0) + delta,
      }))
      appendRegionLog(regionId, `在${regionName}探索时，你意外拾取了 ${delta} 枚灵石。`)
      return { stopBatch: false }
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
      return { stopBatch: false }
    }
    if (roll < 0.8) {
      const beast = createEncounterBeast(realmIndex, layer)
      const encounter = {
        id: `encounter_beast_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        regionId,
        beast,
      }
      pushPendingBeast(encounter)
      appendRegionLog(
        regionId,
        interactive
          ? `你在${regionName}深处撞见一头「${beast.realmName}」的${beast.name}，对方凶性未散，显然免不了一战。`
          : `你在连续探索中发现一头「${beast.realmName}」的${beast.name}，已将其记入下方待处理事件。`,
      )
      return { stopBatch: !interactive }
    }
    if (roll < 0.9) {
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
      pushPendingBandit({
        id: `encounter_bandit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        regionId,
        enemyRealmIndex,
        enemyRealmName,
      })
      appendRegionLog(
        regionId,
        interactive
          ? `你在${regionName}山道间行走时，被一名「${enemyRealmName}」修士拦住去路，冷声索要灵石。`
          : `你在连续探索中撞见一名「${enemyRealmName}」修士拦路，已将其记入下方待处理事件。`,
      )
      return { stopBatch: !interactive }
    }
    const sect = getRandomSectForRegion(regionId)
    if (!sect) {
      appendRegionLog(regionId, `你在${regionName}四处游历，却一无所获。`)
      return { stopBatch: false }
    }
    pushDiscoveredSect(sect, regionId, interactive ? 'interactive' : 'batch')
    return { stopBatch: !interactive }
  }, [appendRegionLog, realmIndex, layer, pushDiscoveredSect, pushPendingBeast, pushPendingBandit])

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
    const maxRuns = Math.min(10, available)
    let actualRuns = 0
    let interrupted = false
    for (let i = 0; i < maxRuns; i += 1) {
      actualRuns += 1
      const result = processExploreEvent(regionId, { interactive: false })
      if (result?.stopBatch) {
        interrupted = true
        break
      }
    }
    setExploreUsed(baseUsed + actualRuns)
    appendRegionLog(
      regionId,
      interrupted
        ? `你在${REGION_NAME_MAP[regionId] ?? '此地'}凝神搜山，连续探索了 ${actualRuns} 次后，因撞见需要亲自抉择的事件而停下脚步。`
        : `你在${REGION_NAME_MAP[regionId] ?? '此地'}凝神搜山，连续探索了 ${actualRuns} 次。`,
    )
  }, [appendRegionLog, exploreWindowStart, exploreUsed, exploreExtra, processExploreEvent])

  const handleDismissSect = useCallback((sectId) => {
    if (!sectId) return
    setPendingSects((prev) => prev.filter((sect) => sect.id !== sectId))
    if (currentRegionId) {
      appendRegionLog(currentRegionId, '你将这处宗门记号暂且划去，打算日后再议。')
    }
  }, [appendRegionLog, currentRegionId])

  const resolveBanditFight = useCallback((bandit, winFromEscape = false) => {
    if (!bandit) return
    const { enemyRealmIndex, enemyRealmName, id: banditId } = bandit
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
    setPendingBandits((prev) => prev.filter((item) => item.id !== banditId))
  }, [appendRegionLog, currentRegionId, realmIndex])

  const handleBanditFight = useCallback((bandit) => {
    if (!bandit || !currentRegionId) return
    const { enemyRealmIndex, enemyRealmName, id: banditId } = bandit
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
      banditId,
      enemyName: `拦路修士（${enemyRealmName}）`,
      enemyAttack,
      enemyHpMax,
      enemyHp: enemyHpMax,
      enemySpeed,
      playerAttack: attack,
      playerSpecialKillChance,
      playerHpMax,
      playerHp: playerHpMax,
      playerSpeed,
      playerBeast: activeBeast,
      playerBeastAttack: activeBeast?.attack ?? 0,
      beastSkillUsed: false,
      enemyStunned: false,
      enemyConfused: false,
      reviveUsed: false,
      shieldAvailable: activeBeast?.passiveSkill?.type === 'shieldOnce',
      turn: firstTurn,
      finished: false,
      winner: null,
      log: activeBeast?.passiveSkill?.effect
        ? [`你与一名「${enemyRealmName}」修士交战，战斗开始！`, `上阵异兽「${activeBeast.name}」的被动技能发动：${activeBeast.passiveSkill.effect}`]
        : [`你与一名「${enemyRealmName}」修士交战，战斗开始！`],
    })
  }, [currentRegionId, attack, hp, speed, layer, playerSpecialKillChance, activeBeast])

  const handleBeastFight = useCallback((beastEntry) => {
    if (!beastEntry || !currentRegionId) return
    const beast = beastEntry.beast
    if (!beast) return
    const enemyAttack = Math.max(10, Math.floor(beast.attack * 0.92))
    const enemyHpMax = Math.max(80, Math.floor(getHp(beast.realmIndex, beast.layer) * (0.78 + Math.random() * 0.26)))
    const enemySpeed = Math.max(5, Math.floor(getSpeed(beast.realmIndex, beast.layer) * (0.85 + Math.random() * 0.2)))
    const playerHpMax = hp
    const playerSpeed = speed
    const firstTurn = playerSpeed >= enemySpeed ? 'player' : 'enemy'
    const battleLog = [`你与「${beast.realmName}」的${beast.name}正面交锋，兽吼震林。`]
    if (activeBeast?.passiveSkill?.effect) {
      battleLog.push(`上阵异兽「${activeBeast.name}」的被动技能发动：${activeBeast.passiveSkill.effect}`)
    }

    setBattleState({
      source: 'beast',
      beastEncounterId: beastEntry.id,
      beastId: beast.id,
      beastData: beast,
      enemyName: `${beast.name}（${beast.realmName}）`,
      enemyAttack,
      enemyHpMax,
      enemyHp: enemyHpMax,
      enemySpeed,
      playerAttack: attack,
      playerSpecialKillChance,
      playerHpMax,
      playerHp: playerHpMax,
      playerSpeed,
      playerBeast: activeBeast,
      playerBeastAttack: activeBeast?.attack ?? 0,
      beastSkillUsed: false,
      enemyStunned: false,
      enemyConfused: false,
      reviveUsed: false,
      shieldAvailable: activeBeast?.passiveSkill?.type === 'shieldOnce',
      turn: firstTurn,
      finished: false,
      winner: null,
      log: battleLog,
    })
  }, [currentRegionId, hp, speed, attack, playerSpecialKillChance, activeBeast])

  const handleBeastEscape = useCallback((beastEntry) => {
    if (!beastEntry || !currentRegionId) return
    const beast = beastEntry.beast
    appendRegionLog(currentRegionId, `你权衡之后没有贸然动手，转身避开了这头${beast?.name ?? '异兽'}。`)
    setBattleReward({ type: 'beast_escape', beastName: beast?.name ?? '异兽' })
    setPendingBeasts((prev) => prev.filter((item) => item.id !== beastEntry.id))
  }, [currentRegionId, appendRegionLog])

  useEffect(() => {
    if (pendingBandits.length === 0) banditPayGuardRef.current = false
  }, [pendingBandits])

  const handleBanditPay = useCallback((bandit) => {
    if (!bandit) return
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
    const { enemyRealmName, id: banditId } = bandit
    setPendingBandits((prev) => prev.filter((item) => item.id !== banditId))
    appendRegionLog(
      currentRegionId,
      `你咬牙交出一袋 1000 枚灵石，这名「${enemyRealmName}」修士满意离去。`,
    )
    setState((s) => ({
      ...s,
      spiritStones: (s.spiritStones ?? 0) - 1000,
    }))
  }, [appendRegionLog, currentRegionId, spiritStones])

  const handleBanditEscape = useCallback((bandit) => {
    if (!bandit) return
    const { enemyRealmIndex, enemyRealmName } = bandit
    let escapeChance = 0.8 - 0.07 * enemyRealmIndex
    escapeChance = Math.max(0.25, Math.min(0.9, escapeChance))
    const success = Math.random() < escapeChance
    if (success) {
      appendRegionLog(
        currentRegionId,
        `你施展身法，勉强甩开了这名「${enemyRealmName}」修士的追击，安全脱离险境。`,
      )
      setPendingBandits((prev) => prev.filter((item) => item.id !== bandit.id))
      return
    }
    appendRegionLog(
      currentRegionId,
      `你试图逃离，却被这名「${enemyRealmName}」修士死死缠住，被迫迎战！`,
    )
    handleBanditFight(bandit)
  }, [appendRegionLog, currentRegionId, handleBanditFight])

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
      playerSpecialKillChance,
      playerHpMax,
      playerHp: playerHpMax,
      playerSpeed,
      playerBeast: activeBeast,
      playerBeastAttack: activeBeast?.attack ?? 0,
      beastSkillUsed: false,
      enemyStunned: false,
      enemyConfused: false,
      reviveUsed: false,
      shieldAvailable: activeBeast?.passiveSkill?.type === 'shieldOnce',
      turn: firstTurn,
      finished: false,
      winner: null,
      log: activeBeast?.passiveSkill?.effect
        ? [`你与「${sect.name}」门下修士当场切磋，四周观战者渐渐聚拢。`, `上阵异兽「${activeBeast.name}」的被动技能发动：${activeBeast.passiveSkill.effect}`]
        : [`你与「${sect.name}」门下修士当场切磋，四周观战者渐渐聚拢。`],
    })
  }, [appendRegionLog, attack, currentRegionId, hp, layer, realmIndex, speed, playerSpecialKillChance, activeBeast])

  const handleBattleNextTurn = useCallback(() => {
    setBattleState((state) => {
      if (!state || state.finished) return state
      const log = [...(state.log ?? [])]
      let { playerHp, enemyHp, turn, enemyAttack } = state
      let beastSkillUsed = state.beastSkillUsed ?? false
      let playerBeastAttack = state.playerBeastAttack ?? (state.playerBeast?.attack ?? 0)
      let enemyStunned = state.enemyStunned ?? false
      let enemyConfused = state.enemyConfused ?? false
      let reviveUsed = state.reviveUsed ?? false
      let shieldAvailable = state.shieldAvailable ?? false
      const enemyHalfHpThreshold = state.enemyHpMax * 0.5
      const executeBoostActive = state.playerBeast?.passiveSkill?.type === 'executeBoost' && enemyHp <= enemyHalfHpThreshold
      const playerLowHpBoostActive = state.playerBeast?.passiveSkill?.type === 'lastStand' && playerHp <= state.playerHpMax * 0.3
      const playerAttackValue = Math.floor(state.playerAttack * (playerLowHpBoostActive ? 1.4 : 1) * (executeBoostActive ? 1.3 : 1))

      if (turn === 'player' && state.playerBeast?.passiveSkill?.type === 'regen') {
        const healValue = Math.max(1, Math.floor(state.playerHpMax * 0.1))
        const healedHp = Math.min(state.playerHpMax, playerHp + healValue)
        const actualHeal = healedHp - playerHp
        if (actualHeal > 0) {
          playerHp = healedHp
          log.push(`上阵异兽「${state.playerBeast.name}」的被动技能「生生不息」发动，你恢复了 ${actualHeal} 点血量。`)
        }
      }

      if (turn === 'player') {
        const specialKillChance = state.playerSpecialKillChance ?? 0
        const triggerSpecialKill = specialKillChance > 0 && Math.random() < specialKillChance
        if (triggerSpecialKill) {
          enemyHp = 0
          log.push('极道帝兵震鸣，帝威倾覆而下，你一击将对手当场镇杀。')
          turn = 'enemy'
        } else {
          enemyHp = Math.max(0, enemyHp - playerAttackValue)
          log.push(`你出手攻击，造成 ${playerAttackValue} 伤害。`)
          turn = playerBeastAttack > 0 && enemyHp > 0 ? 'beast' : 'enemy'
        }
      } else if (turn === 'beast') {
        if (playerBeastAttack > 0) {
          const executeBoostForBeast = state.playerBeast?.passiveSkill?.type === 'executeBoost' && enemyHp <= enemyHalfHpThreshold
          const beastDamage = Math.floor(playerBeastAttack * (executeBoostForBeast ? 1.3 : 1))
          const actualDamage = Math.min(enemyHp, beastDamage)
          enemyHp = Math.max(0, enemyHp - beastDamage)
          log.push(`上阵异兽「${state.playerBeast.name}」紧随其后发起追击，造成 ${beastDamage} 伤害。`)
          turn = 'enemy'

          switch (state.playerBeast?.activeSkill?.type) {
            case 'devour': {
              const heal = Math.max(1, Math.floor(actualDamage * 0.5))
              playerHp = Math.min(state.playerHpMax, playerHp + heal)
              log.push(`主动技能「${state.playerBeast.activeSkill.name}」发动，你恢复了 ${heal} 点血量。`)
              break
            }
            case 'stun':
              if (Math.random() < 0.3) {
                enemyStunned = true
                log.push(`主动技能「${state.playerBeast.activeSkill.name}」发动，对方被眩晕一回合。`)
              }
              break
            case 'rampage':
              playerBeastAttack = Math.max(1, Math.floor(playerBeastAttack * 1.2))
              log.push(`主动技能「${state.playerBeast.activeSkill.name}」发动，异兽攻击提升至 ${playerBeastAttack}。`)
              break
            case 'confuse':
              if (Math.random() < 0.1) {
                enemyConfused = true
                log.push(`主动技能「${state.playerBeast.activeSkill.name}」发动，对方下次出手将反噬自身。`)
              }
              break
            case 'chain':
              if (enemyHp > 0 && Math.random() < 0.4) {
                log.push(`主动技能「${state.playerBeast.activeSkill.name}」发动，异兽再次行动。`)
                turn = 'beast'
                break
              }
              break
            default:
              break
          }
        }
      } else {
        if (enemyStunned) {
          enemyStunned = false
          log.push('对方被眩晕压制，这一回合无法行动。')
          turn = 'player'
        } else if (enemyConfused) {
          enemyConfused = false
          enemyHp = Math.max(0, enemyHp - state.enemyAttack)
          log.push(`对方神魂错乱，一击反噬自身，造成 ${state.enemyAttack} 伤害。`)
          turn = 'player'
        } else if (shieldAvailable) {
          shieldAvailable = false
          log.push(`上阵异兽「${state.playerBeast?.name ?? '异兽'}」的被动技能「无敌金身」发动，本次伤害被完全化解。`)
          turn = 'player'
        } else {
          playerHp = Math.max(0, playerHp - state.enemyAttack)
          log.push(`对方出手攻击，造成 ${state.enemyAttack} 伤害。`)
          if (playerHp <= 0 && state.playerBeast?.passiveSkill?.type === 'reviveOnce' && !reviveUsed) {
            reviveUsed = true
            playerHp = Math.max(1, Math.floor(state.playerHpMax * 0.1))
            log.push(`上阵异兽「${state.playerBeast.name}」的被动技能「枯树逢春」发动，你自死境中复苏，恢复了 ${playerHp} 点血量。`)
          }
          turn = 'player'
        }
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
        enemyAttack,
        beastSkillUsed,
        playerBeastAttack,
        enemyStunned,
        enemyConfused,
        reviveUsed,
        shieldAvailable,
        turn,
        finished,
        winner,
        log,
      }
    })
  }, [])

  useEffect(() => {
    if (!battleState || !battleState.finished || battleState.source !== 'bandit' || !currentRegionId) return
    const pendingBandit = pendingBandits.find((item) => item.id === battleState.banditId)
    if (!pendingBandit) {
      setBattleState(null)
      return
    }
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
    setPendingBandits((prev) => prev.filter((item) => item.id !== pendingBandit.id))
  }, [battleState, pendingBandits, currentRegionId, appendRegionLog, spiritStones])

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

  useEffect(() => {
    if (!battleState || !battleState.finished || battleState.source !== 'beast' || !currentRegionId) return
    const pendingBeast = pendingBeasts.find((item) => item.id === battleState.beastEncounterId)
    const beast = pendingBeast?.beast ?? battleState.beastData
    if (!beast) return
    const currentOwnedBeasts = normalizeBeastArray(beastInventory, MAX_BEAST_STORAGE).length + normalizeBeastArray(activeBeasts, 1).length

    if (battleState.winner === 'player' || battleState.winner === 'draw') {
      appendRegionLog(currentRegionId, `你击败了「${beast.realmName}」的${beast.name}。`)
      if (Math.random() < 0.5) {
        if (currentOwnedBeasts < MAX_BEAST_STORAGE) {
          const capturedBeast = tameBeast(beast)
          setState((s) => ({
            ...s,
            beastInventory: [...normalizeBeastArray(s.beastInventory, MAX_BEAST_STORAGE), capturedBeast].slice(0, MAX_BEAST_STORAGE),
          }))
          setBattleReward({ type: 'capture', beastName: beast.name })
          appendRegionLog(currentRegionId, `捕获成功，这头${beast.name}在重创后终于低头，已送入异兽园。`)
        } else {
          setBattleReward({ type: 'beast_bag_full', beastName: beast.name })
          appendRegionLog(currentRegionId, `你本已压制住${beast.name}，可异兽园已满，最终无法继续收容。`)
        }
      } else {
        setBattleReward({ type: 'beast_fled_after_win', beastName: beast.name })
        appendRegionLog(currentRegionId, `你本想趁势收服${beast.name}，却还是让它挣脱遁走。`)
      }
    } else if (battleState.winner === 'enemy') {
      appendRegionLog(currentRegionId, `你不敌这头${beast.name}，只得带伤退走，眼看它重新没入荒野。`)
      setBattleReward({ type: 'beast_lose', beastName: beast.name })
    }
    setBattleState(null)
    if (pendingBeast) {
      setPendingBeasts((prev) => prev.filter((item) => item.id !== pendingBeast.id))
    }
  }, [battleState, currentRegionId, pendingBeasts, appendRegionLog, beastInventory, activeBeasts])

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
        const available = s.availableTechs ?? INITIAL_AVAILABLE_TECHNIQUES
        if (learned.includes(id) || available.includes(id)) return s
        return {
          ...s,
          sectContribution: contrib - cost,
          availableTechs: [...available, id],
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

  const handleContemplateTechnique = useCallback((techId) => {
    setState((s) => {
      const available = s.availableTechs ?? INITIAL_AVAILABLE_TECHNIQUES
      if (!available.includes(techId)) return s
      const learned = s.learnedTechs ?? []
      const learnedSet = new Set(learned)
      const currentExp = s.techniqueMastery?.[techId] ?? 0
      if (currentExp >= TECHNIQUE_MAX_MASTERY_EXP) return s
      return {
        ...s,
        learnedTechs: learnedSet.has(techId) ? learned : [...learned, techId],
        techniqueMastery: {
          ...(s.techniqueMastery ?? {}),
          [techId]: Math.min(TECHNIQUE_MAX_MASTERY_EXP, currentExp + 1),
        },
      }
    })
  }, [])

  const handleBeginTechniqueContemplation = useCallback((tech) => {
    if (!tech?.id) return
    setTechniqueContemplation((cur) => {
      if (cur) return cur
      const durationMs = TECHNIQUE_CONTEMPLATE_DURATION_MS[tech.tier] ?? 30_000
      return { techId: tech.id, startedAt: Date.now(), durationMs }
    })
  }, [])

  useEffect(() => {
    if (!techniqueContemplation) return undefined
    const { techId, startedAt, durationMs } = techniqueContemplation
    const id = window.setInterval(() => {
      const elapsed = Date.now() - startedAt
      if (elapsed >= durationMs) {
        window.clearInterval(id)
        handleContemplateTechnique(techId)
        setTechniqueContemplation(null)
      } else {
        setContemplationTick((n) => n + 1)
      }
    }, 100)
    return () => window.clearInterval(id)
  }, [techniqueContemplation, handleContemplateTechnique])

  const techniqueContemplatingTechId = techniqueContemplation?.techId ?? null
  const techniqueContemplateProgress = useMemo(() => {
    if (!techniqueContemplation) return 0
    return Math.min(1, (Date.now() - techniqueContemplation.startedAt) / techniqueContemplation.durationMs)
  }, [techniqueContemplation, contemplationTick])

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
      const tech = getTechniqueById(itemId)
      const nextShop = (s.shopItems ?? []).filter((id) => id !== itemId)
      if (tech) {
        const available = s.availableTechs ?? INITIAL_AVAILABLE_TECHNIQUES
        if (available.includes(itemId)) {
          return { ...s, shopItems: nextShop }
        }
        return {
          ...s,
          spiritStones: stones - (price || getTechniqueBuyPrice(itemId)),
          availableTechs: [...available, itemId],
          shopItems: nextShop,
        }
      }
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
    const forceNewGame = pendingNewGameAfterCreationRef.current
    if (forceNewGame) pendingNewGameAfterCreationRef.current = false
    let didFullReset = false
    setState((prev) => {
      if (forceNewGame || isFreshRunState(prev)) {
        didFullReset = true
        return buildCharacterState(normalizedProfile)
      }
      return { ...prev, characterProfile: normalizedProfile }
    })
    if (didFullReset) setTechniqueContemplation(null)
    setShowCharacterCreation(false)
    setShowCharacterStats(false)
    setShowLoadModal(false)
    setShowSaveModal(false)
  }, [creationDraft])

  const handleStartNewCharacter = useCallback(() => {
    pendingNewGameAfterCreationRef.current = true
    setCreationDraft(getDefaultCharacterProfile())
  }, [])

  const handleDeployBeast = useCallback((beast) => {
    if (!beast) return
    setState((s) => ({
      ...s,
      activeBeasts: [beast],
      beastInventory: normalizeBeastArray(s.beastInventory, MAX_BEAST_STORAGE)
        .filter((item) => item?.id !== beast.id)
        .concat((normalizeBeastArray(s.activeBeasts, 1)[0] ? [normalizeBeastArray(s.activeBeasts, 1)[0]] : []))
        .slice(0, MAX_BEAST_STORAGE),
    }))
  }, [])

  const handleUndeployBeast = useCallback(() => {
    setState((s) => {
      const activeBeast = normalizeBeastArray(s.activeBeasts, 1)[0]
      if (!activeBeast) return s
      const currentBag = normalizeBeastArray(s.beastInventory, MAX_BEAST_STORAGE)
      if (currentBag.length >= MAX_BEAST_STORAGE) {
        return s
      }
      return {
        ...s,
        activeBeasts: [],
        beastInventory: [...currentBag, activeBeast].slice(0, MAX_BEAST_STORAGE),
      }
    })
  }, [])

  const handleReleaseBeast = useCallback((beast) => {
    if (!beast?.id) return
    setState((s) => ({
      ...s,
      beastInventory: normalizeBeastArray(s.beastInventory, MAX_BEAST_STORAGE).filter((item) => item.id !== beast.id),
    }))
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
          {characterProfile ? (
            <div className="header-character-identity" role="text">
              <span className="header-char-pill">{characterProfile.name}</span>
              <span className="header-char-dot">·</span>
              <span className="header-char-plain">{selection.gender.label}</span>
              <span className="header-char-dot">·</span>
              <span className="header-char-pill">{selection.spiritRoot.label}</span>
            </div>
          ) : (
            <p className="subtitle">问道长生</p>
          )}
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
            pendingNewGameAfterCreationRef.current = false
            setTechniqueContemplation(null)
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
            onClick={() => setShowBeastGarden(true)}
          >
            异兽园
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

            {canOpenBreakthrough && (
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
            : '已至尽头'
        }
        nextRealmIndex={isBigRealmBreak && nextStage ? nextStage.realmIndex : null}
        required={required}
        isBigRealmBreak={isBigRealmBreak}
        successRate={bigRealmSuccessRate}
        pillBonus={isAscensionBreak ? 0 : (pillBonus + specialAidBonus)}
        failed={breakthroughFailed}
        inventory={inventory}
        aidOptions={breakthroughAidOptions}
        aidUsedItemId={currentSpecialBreakBonus?.itemId ?? null}
        requiresWudaoTeaToBreak={requiresWudaoTeaToBreak}
        isAscensionBreak={isAscensionBreak}
        canConfirm={canBreakthrough}
      />

      <RedeemCodeModal
        show={showRedeemCode}
        onClose={() => setShowRedeemCode(false)}
        onRedeem={handleRedeem}
        onRedeemWeapons={handleRedeemWeapons}
        onRedeemPills={handleRedeemPills}
        onRedeemItems={handleRedeemItems}
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
        availableTechs={availableTechs}
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
        contemplatingTechId={techniqueContemplatingTechId}
        contemplateProgress={techniqueContemplateProgress}
        onBeginContemplation={handleBeginTechniqueContemplation}
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

      <BeastGardenModal
        show={showBeastGarden}
        onClose={() => setShowBeastGarden(false)}
        activeBeasts={activeBeasts}
        beastInventory={beastInventory}
        onDeployBeast={handleDeployBeast}
        onUndeployBeast={handleUndeployBeast}
        onReleaseBeast={handleReleaseBeast}
      />

      <WorldMapModal
        show={showWorldMap}
        onClose={() => setShowWorldMap(false)}
        onEnterRegion={handleEnterRegion}
      />

      <DebatePavilionModal
        show={showDebatePavilion}
        onClose={() => setShowDebatePavilion(false)}
        debatePoints={debatePoints}
        onGainDebatePoints={handleGainDebatePoints}
        onRedeemShopItem={handleRedeemDebateShop}
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
          setShowWorldMap(true)
        }}
        logs={regionLogs[currentRegionId] ?? []}
        exploreRemaining={Math.max(0, 10 + exploreExtra - exploreUsed)}
        pendingSects={pendingSects.filter((sect) => sect.discoveredRegionId === currentRegionId)}
        pendingBeasts={pendingBeasts.filter((item) => item.regionId === currentRegionId)}
        pendingBandits={pendingBandits.filter((item) => item.regionId === currentRegionId)}
        onExplore={handleExploreRegion}
        onExploreTen={handleExploreRegionTen}
        onJoinSect={handleJoinSect}
        onDismissSect={handleDismissSect}
        onChallengeSect={handleChallengeSect}
        onBuyExploreChance={handleBuyExploreChance}
        onBanditFight={handleBanditFight}
        onBanditPay={handleBanditPay}
        onBanditEscape={handleBanditEscape}
        onBeastFight={handleBeastFight}
        onDismissBeast={handleBeastEscape}
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
        <div className="region-confirm-overlay" onClick={() => setBattleReward(null)}>
          <div className="region-confirm-modal gu-panel" onClick={(e) => e.stopPropagation()}>
            <h4 className="region-confirm-title">
              {battleReward.type === 'capture'
                ? '抓获成功'
                : battleReward.type === 'win'
                  ? '战斗胜利'
                  : battleReward.type === 'beast_escape'
                    ? '避开异兽'
                    : battleReward.type === 'beast_fled_after_win'
                      ? '异兽逃脱'
                      : battleReward.type === 'beast_bag_full'
                        ? '异兽园已满'
                        : battleReward.type === 'beast_lose'
                          ? '不敌异兽'
                          : '战斗失败'}
            </h4>
            <p className="region-confirm-text">
              {battleReward.type === 'win' && `你赢下了这一战，获得 ${battleReward.stones} 枚灵石。`}
              {battleReward.type === 'lose' && `你输掉了这一战，损失 ${battleReward.loss} 枚灵石。`}
              {battleReward.type === 'capture' && `成功抓获异兽：${battleReward.beastName}`}
              {battleReward.type === 'beast_escape' && `你未与${battleReward.beastName}交手便抽身离去，对方很快隐没于荒野之中。`}
              {battleReward.type === 'beast_fled_after_win' && `你已击败${battleReward.beastName}，但收服未果，它带伤挣脱后遁入山林。`}
              {battleReward.type === 'beast_bag_full' && `你已击败${battleReward.beastName}，但异兽园位置已满，无法收容，只得任其离去。`}
              {battleReward.type === 'beast_lose' && `你不敌${battleReward.beastName}，只能暂避锋芒，眼看它重新遁入山野。`}
            </p>
            <div className="region-confirm-actions">
              <button type="button" className="btn-region primary" onClick={() => setBattleReward(null)}>
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

/*
#=============================================================================
# LeTBS: Tiles, Marks and Aura effects
# LeTBS_TilesMarksAuraEffects.js
# By Lecode
# Version 1.5
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : Fixed a bug where triggering a tile effect or a mark causes an error
# - 1.2 : Fixed a bug where marks and tile effects don't stop battlers movement
#       : When an ally dead, tied marks are removed
#       : Added a tag for battlers to be immune to tile, mark and aura effects
# - 1.3 : Supports the summoning system
#       : Fixed a bug where triggering tiles and mark effects change the next
#         action damage
# - 1.4 : Added a tile effect to escape battles
# - 1.5 : Marks and auras can now trigger sequences
#         Added some tags to set built-in marks and auras
#=============================================================================
*/
var Imported = Imported || {};
Imported["LeTBS_TilesMarksAuraEffects"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS.TilesMarksAura = {};
/*:
 * @plugindesc Adds tiles, marks and aura effects to the core system
 * @author Lecode
 * @version 1.5
 *
 * @param Tile Effect Launcher
 * @desc ID of the enemy who launch terrain effects.
 * @default 10
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
  * This add-on is too intricate to be described here. Please refer to the online
 * documentation.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently. A few features are missing.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_TilesMarksAuraEffects');

Lecode.S_TBS.TilesMarksAura.tileEffectLauncher = Number(parameters["Tile Effect Launcher"] || 10); //	(): ID of the enemy who launch terrain effects.




/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.TilesMarksAura.oldBMTBS_createTBSObjects = BattleManagerTBS.createTBSObjects;
BattleManagerTBS.createTBSObjects = function () {
    Lecode.S_TBS.TilesMarksAura.oldBMTBS_createTBSObjects.apply(this, arguments);
    this.createMarksManager();
    this.createAurasManager();
};

BattleManagerTBS.createMarksManager = function () {
    var layer = this.getLayer("groundEntities");
    this._marksManager = new TBSMarksManager(layer);
};

BattleManagerTBS.createAurasManager = function () {
    this._aurasManager = new TBSAurasManager();
};

Lecode.S_TBS.TilesMarksAura.oldBMTBS_updateTBSObjects = BattleManagerTBS.updateTBSObjects;
BattleManagerTBS.updateTBSObjects = function () {
    Lecode.S_TBS.TilesMarksAura.oldBMTBS_updateTBSObjects.apply(this, arguments);
    this._marksManager.update();
};

BattleManagerTBS.processTileEffectsWhenMovement = function (entity) {
    var effects = Lecode.S_TBS.Config.Tile_Effects;
    var cell = entity.getCell();
    var effect;
    var stopMovement = 0;
    effect = effects[entity._lastTileEffect];
    stopMovement += this.executeTileEffects(entity, effect, "leaving", entity._lastTileEffect);
    effect = effects[cell.regionId()];
    stopMovement += this.executeTileEffects(entity, effect, "entering", entity._lastTileEffect);
    entity._lastTileEffect = cell.regionId();
    return stopMovement >= 1;
};

BattleManagerTBS.processTileEffectsWhenTurn = function (entity, occasion) {
    var effects = Lecode.S_TBS.Config.Tile_Effects;
    var cell = entity.getCell();
    var effect;
    effect = effects[cell.regionId()];
    this.executeTileEffects(entity, effect, "turn_" + occasion, cell.regionId());
    entity._lastTileEffect = cell.regionId();
};

BattleManagerTBS.executeTileEffects = function (entity, effect, occasion, code) {
    if (entity.isImmuneToTileEffect(String(code))) return 0;
    if (effect) {
        var occasionFound = false;
        for (var property in effect) {
            if (effect.hasOwnProperty(property)) {
                if (String(property).includes(occasion)) {
                    effect = effect[property];
                    occasionFound = true;
                    break;
                }
            }
        }
        if (!occasionFound) return 0;
        if (effect.escape) {
            if (entity.battler().isActor()) {
                BattleManager._escaped = true;
                SoundManager.playEscape();
                this.prepareAbort();
            }
            return 1;
        }
        var battlerId = Lecode.S_TBS.TilesMarksAura.tileEffectLauncher;
        var center = entity.getCell().toCoords();
        var scope = this.getScopeFromData(effect.aoe, center, {});
        var targets = this.getEntitiesInScope(scope);
        var stopMovement = effect.stop_movement || false;
        var wait = effect.wait || 0;
        if (effect.skill_effects) {
            var id = effect.skill_effects;
            var battler = new Game_Enemy(battlerId, 0, 0);
            var obj = $dataSkills[id];
            var anim = effect.play_anim ? obj.animationId : null;
            var oldActiveAction = this._activeAction;
            this.newAction(battler, true);
            this.invokeObjEffects(entity, obj, targets, anim, 0);
            this._activeAction = oldActiveAction;
        }
        this.wait(wait);
        return stopMovement ? 1 : 0;
    }
    return 0;
};

BattleManagerTBS.processMarkEffectsWhenPlaced = function (mark) {
    var aoe = mark.getSizeArea();
    var entities = this.getEntitiesInScope(aoe);
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity._lastMarks.push(mark);
        this.executeMarkEffects(mark, entity, "laid");
    }
};

BattleManagerTBS.processMarkEffectsWhenMovement = function (entity) {
    var stopMovement = 0;
    var marksUnderEntity = [];
    for (var i = 0; i < this._marksManager._marks.length; i++) {
        var mark = this._marksManager._marks[i];
        var aoe = mark.getSizeArea();
        if (this.isCellInScope(entity.getCell(), aoe)) {
            marksUnderEntity.push(mark);
        }
    }

    for (var i = 0; i < entity._lastMarks.length; i++) {
        var mark = entity._lastMarks[i];
        if (!marksUnderEntity.contains(mark))
            stopMovement += this.executeMarkEffects(mark, entity, "leaving");
    }

    for (var i = 0; i < marksUnderEntity.length; i++) {
        var mark = marksUnderEntity[i];
        stopMovement += this.executeMarkEffects(mark, entity, "stepping");
        if (!entity._lastMarks.contains(mark))
            stopMovement += this.executeMarkEffects(mark, entity, "entering");
    }
    entity._lastMarks = marksUnderEntity;
    return stopMovement >= 1;
};

BattleManagerTBS.processMarkEffectsWhenTurn = function (entity, occasion) {
    var marksUnderEntity = [];
    var marks = this._marksManager._marks;
    for (var i = 0; i < marks.length; i++) {
        var mark = marks[i];
        var aoe = mark.getSizeArea();
        if (this.isCellInScope(entity.getCell(), aoe)) {
            marksUnderEntity.push(mark);
            this.executeMarkEffects(mark, entity, "turn_" + occasion);
        }
    }
    entity._lastMarks = marksUnderEntity;
};

BattleManagerTBS.processMarkEffectsWhenCasterTurn = function (entity, occasion) {
    var marks = this._marksManager._marks;
    for (var i = 0; i < marks.length; i++) {
        var mark = marks[i];
        if (mark._user === entity) {
            var aoe = mark.getSizeArea();
            var entities = this.getEntitiesInScope(aoe);
            for (var j = 0; j < entities.length; j++) {
                var entity = entities[j];
                this.executeMarkEffects(mark, entity, "caster_turn_" + occasion);
            }

        }
    }
};

BattleManagerTBS.executeMarkEffects = function (mark, entity, occasion) {
    if (entity.isImmuneToMark(mark._id)) return 0;
    var data;
    var occasionFound = false;

    for (var property in mark._data.triggers) {
        if (mark._data.triggers.hasOwnProperty(property)) {
            if (String(property).includes(occasion)) {
                data = mark._data.triggers[property];
                occasionFound = true;
                break;
            }
        }
    }
    if (!occasionFound) return 0;
    var center = entity.getCell().toCoords();
    var stopMovement = data.stop_movement || false;
    var wait = mark._data.wait || 0;
    if (data.skill_effects) {
        var scope = this.getScopeFromData(data.effects_aoe, center, {});
        var targets = this.getEntitiesInScope(scope);
        var id = data.skill_effects;
        var battler = mark._user._battler;
        var obj = $dataSkills[id];
        var anim = obj.animationId;
        var oldActiveAction = this._activeAction;
        this.newAction(mark._user.battler(), true);
        this.invokeObjEffects(mark._user, obj, targets, anim, 0);
        this._marksManager.onMarkTriggered(mark);
        this._activeAction = oldActiveAction;
    } else if (data.action) {
        var skill = $dataSkills[data.action.skill];
        entity.getCell().select();
        BattleManagerTBS.forceAction(skill, mark._user);
    }
    this.wait(wait);
    return stopMovement ? 1 : 0;
};

BattleManagerTBS.updateMarksDuration = function (entity, occasion) {
    this._marksManager.updateDuration(entity, occasion);
};

BattleManagerTBS.removeMarksByDeath = function (entity) {
    this._marksManager.removeMarksOfEntity(entity);
};

BattleManagerTBS.processAurasEffectsWhenApplied = function () {
    var entities = this.allEntities();
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        this.processAurasEffects(entity);
    }
};

BattleManagerTBS.processAurasEffectsWhenRemoved = function () {
    BattleManagerTBS.processAurasEffectsWhenApplied();
};

BattleManagerTBS.processAurasEffectsWhenMovement = function (entity) {
    BattleManagerTBS.processAurasEffectsWhenApplied();
};

BattleManagerTBS.processAurasEffects = function (entity) {
    var currentAuras = [];
    var auras = this._aurasManager._auras;
    for (var i = 0; i < auras.length; i++) {
        var aura = auras[i];
        var aoe = aura.getSizeArea();
        if (this.isCellInScope(entity.getCell(), aoe)) {
            currentAuras.push(aura);
        }
    }

    for (var i = 0; i < entity._lastAuras.length; i++) {
        var aura = entity._lastAuras[i];
        if (currentAuras.indexOf(aura) === -1) {
            BattleManagerTBS.executeAurasEffects(aura, entity, "leaving");
        }
    }

    for (var i = 0; i < currentAuras.length; i++) {
        var aura = currentAuras[i];
        if (entity._lastAuras.indexOf(aura) === -1) {
            BattleManagerTBS.executeAurasEffects(aura, entity, "entering");
            var anim = aura._data.trigger_anim;
            var cell = aura._caster.getCell();
            if (anim)
                BattleManagerTBS.getLayer("animations").newAnimation(anim, false, 0, cell);
        }
    }

    entity._lastAuras = currentAuras;
};

BattleManagerTBS.executeAurasEffects = function (aura, entity, occasion) {
    if (entity.isImmuneToAura(aura._id)) return;
    var states = aura._data.states;
    if (!aura._data.affect_caster && aura._caster === entity)
        return;
    if (aura._caster.battler().isActor()) {
        if (aura._data.target_type === "enemy" && entity.battler().isActor())
            return;
        if (aura._data.target_type === "ally" && !entity.battler().isActor())
            return;
    } else {
        if (aura._data.target_type === "enemy" && !entity.battler().isActor())
            return;
        if (aura._data.target_type === "ally" && entity.battler().isActor())
            return;
    }
    for (var i = 0; i < states.length; i++) {
        entity.battler().result().clear();
        if (occasion === "entering") {
            entity.battler().addState(states[i]);
        } else if (occasion === "leaving") {
            entity.battler().removeState(states[i]);
        }
    }
    if (occasion === "entering") {
        if (aura._data.action) {
            var skill = $dataSkills[aura._data.action.skill];
            entity.getCell().select();
            BattleManagerTBS.forceAction(skill, aura._caster);
        }
    }
    entity.addPopup();
};


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.TilesMarksAura.oldTBSEntity_initialize = TBSEntity.prototype.initialize;
TBSEntity.prototype.initialize = function () {
    this._lastTileEffect = -1;
    this._lastMarks = [];
    this._lastAuras = [];
    this._castingAuras = [];
    this._castedMarks = this._castedAuras = false;
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_initialize.apply(this, arguments);
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_setCell = TBSEntity.prototype.setCell;
TBSEntity.prototype.setCell = function (cell) {
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_setCell.call(this, cell);
    if (!this._castedAuras)
        this.castAuras();
    if (!this._castedMarks)
        this.castMarks();
};

TBSEntity.prototype.castAuras = function () {
    this._castedAuras = true;
    var auras = this.battler().collectLeTBSTags("auras");
    for (var i = 0; i < auras.length; i++) {
        var auraId = auras[i];
        BattleManagerTBS._aurasManager.newAura(auraId, this);
    }
    if (auras.length > 0)
        BattleManagerTBS.processAurasEffectsWhenApplied();
};

TBSEntity.prototype.castMarks = function () {
    this._castedMarks = true;
    var marks = this.battler().collectLeTBSTags("marks");
    for (var i = 0; i < marks.length; i++) {
        var id = marks[i];
        BattleManagerTBS._marksManager.newMark(id, this, this.getCell());
    }
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onTurnStart = TBSEntity.prototype.onTurnStart;
TBSEntity.prototype.onTurnStart = function () {
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onTurnStart.apply(this, arguments);
    BattleManagerTBS.processTileEffectsWhenTurn(this, "start");
    BattleManagerTBS.processMarkEffectsWhenTurn(this, "start");
    BattleManagerTBS.processMarkEffectsWhenCasterTurn(this, "start");
    BattleManagerTBS.updateMarksDuration(this, "start");
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onTurnEnd = TBSEntity.prototype.onTurnEnd;
TBSEntity.prototype.onTurnEnd = function () {
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onTurnEnd.apply(this, arguments);
    BattleManagerTBS.processTileEffectsWhenTurn(this, "end");
    BattleManagerTBS.processMarkEffectsWhenTurn(this, "end");
    BattleManagerTBS.processMarkEffectsWhenCasterTurn(this, "end");
    BattleManagerTBS.updateMarksDuration(this, "end");
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_teleport = TBSEntity.prototype.teleport;
TBSEntity.prototype.teleport = function (cell) {
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_teleport.apply(this, arguments);
    BattleManagerTBS.processTileEffectsWhenMovement(this);
    BattleManagerTBS.processMarkEffectsWhenMovement(this);
    BattleManagerTBS.processAurasEffectsWhenMovement(this);
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onSummoned = TBSEntity.prototype.onSummoned;
TBSEntity.prototype.onSummoned = function (caster, stats) {
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onSummoned.call(this, caster, stats);
    BattleManagerTBS.processTileEffectsWhenMovement(this);
    BattleManagerTBS.processMarkEffectsWhenMovement(this);
    BattleManagerTBS.processAurasEffectsWhenMovement(this);
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onCellCovered = TBSEntity.prototype.onCellCovered;
TBSEntity.prototype.onCellCovered = function () {
    var stop1 = BattleManagerTBS.processTileEffectsWhenMovement(this);
    var stop2 = BattleManagerTBS.processMarkEffectsWhenMovement(this);
    var stop3 = BattleManagerTBS.processAurasEffectsWhenMovement(this);
    var result = Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onCellCovered.apply(this, arguments);
    return result || stop1 || stop2 || stop3;
};

Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onDeath = TBSEntity.prototype.onDeath;
TBSEntity.prototype.onDeath = function () {
    Lecode.S_TBS.TilesMarksAura.oldTBSEntity_onDeath.call(this);
    BattleManagerTBS.removeMarksByDeath(this);
};

TBSEntity.prototype.isImmuneToMark = function (markId) {
    var str = this.battler().getLeTBSTagStringValue("immuneToMarks");
    return str.includes(markId);
};

TBSEntity.prototype.isImmuneToAura = function (AuraId) {
    var str = this.battler().getLeTBSTagStringValue("immuneToAuras");
    return str.includes(AuraId);
};

TBSEntity.prototype.isImmuneToTileEffect = function (TileEffectId) {
    var str = this.battler().getLeTBSTagStringValue("immuneToTileEffects");
    return str.includes(TileEffectId);
};


/*-------------------------------------------------------------------------
* TBSSequenceManager
-------------------------------------------------------------------------*/
TBSSequenceManager.prototype.commandMark = function (param) {
    var id = param[0];
    var cellTargets = this.readCellTargets(param[1]);

    for (var i = 0; i < cellTargets.length; i++) {
        var cell = cellTargets[i];
        BattleManagerTBS._marksManager.newMark(id, this.getUser(), cell);
    }

    return {};
};


/*-------------------------------------------------------------------------
* TBSMarksManager
-------------------------------------------------------------------------*/
function TBSMarksManager() {
    this.initialize.apply(this, arguments);
}

TBSMarksManager.prototype.initialize = function (layer) {
    this._layer = layer;
    this._marks = [];
};

TBSMarksManager.prototype.update = function () {
    for (var i = 0; i < this._marks.length; i++) {
        this._marks[i].update();
    }
};

TBSMarksManager.prototype.updateDuration = function (entity, occasion) {
    var marksToRemove = [];
    for (var i = 0; i < this._marks.length; i++) {
        var mark = this._marks[i];
        if (mark._user === entity && mark.durationOccasion() === "turn_" + occasion) {
            if ((++mark._turn) >= mark.maxTurns())
                marksToRemove.push(mark);
        }
    }
    marksToRemove.forEach(function (mark) {
        this.removeMark(mark._id);
    }.bind(this));
};

TBSMarksManager.prototype.removeMarksOfEntity = function (entity) {
    var marksToRemove = [];
    for (var i = 0; i < this._marks.length; i++) {
        var mark = this._marks[i];
        if (mark._user === entity) {
            marksToRemove.push(mark);
        }
    }
    marksToRemove.forEach(function (mark) {
        this.removeMark(mark._id);
    }.bind(this));
};

TBSMarksManager.prototype.onMarkTriggered = function (mark) {
    mark._triggered += 1;
    var maxTriggers = mark._data.max_triggers;
    if (maxTriggers && mark._triggered >= maxTriggers) {
        this.removeMark(mark._id);
    }
};

TBSMarksManager.prototype.newMark = function (id, user, cell) {
    var data = Lecode.S_TBS.Config.Marks[id];
    if (data) {
        if (!this.canAddMark(id, data)) {
            this.removeMark(id);
        }
        var mark = new TBSMark(id, data, user, cell);
        this._layer.addChild(mark);
        this._marks.push(mark);
        mark.startAnimation(this._layer);
        BattleManagerTBS.processMarkEffectsWhenPlaced(mark);
    }
};

TBSMarksManager.prototype.canAddMark = function (id, data) {
    var max = data.max;
    if (max) {
        var count = 0;
        for (var i = 0; i < this._marks.length; i++) {
            if (this._marks[i]._id == id)
                count++;
            if (count >= max)
                return false;
        }
    }
    return true;
};

TBSMarksManager.prototype.removeMark = function (id) {
    this._marks = this._marks.filter(function (mark) {
        if (mark._id === id) {
            mark.stopAnimation(this._layer);
            var anim = mark._data.disappearing_anim;
            var cell = mark._cell;
            BattleManagerTBS.getLayer("animations").newAnimation(anim, false, 0, cell);
            return false;
        }
        return true;
    }.bind(this));
};


/*-------------------------------------------------------------------------
* TBSMark
-------------------------------------------------------------------------*/
function TBSMark() {
    this.initialize.apply(this, arguments);
}
TBSMark.prototype = Object.create(Sprite_Base.prototype);
TBSMark.prototype.constructor = TBSMark;

TBSMark.prototype.initialize = function (id, data, user, cell) {
    Sprite_Base.prototype.initialize.call(this);
    this._id = id;
    this._data = data;
    this._user = user;
    this._cell = cell;
    this._turn = 0;
    this._triggered = 0;
};

TBSMark.prototype.maxTurns = function () {
    return this._data.duration[0];
};

TBSMark.prototype.durationOccasion = function () {
    return this._data.duration[1];
};

TBSMark.prototype.startAnimation = function (layer) {
    var animation = $dataAnimations[this._data.body_anim];
    var sprite = new TBSMark_Animation();
    sprite.setup(this, animation, false, 0, this._cell);
    layer.addChild(sprite);
    this._animationSprites.push(sprite);
};

TBSMark.prototype.stopAnimation = function () {
    this._animationSprites[0]._loop = false;
    this._animationSprites[0]._duration = 0;
};

TBSMark.prototype.getSizeArea = function () {
    var center = this._cell.toCoords();
    return BattleManagerTBS.getScopeFromData(this._data.size, center, {});
};

/*-------------------------------------------------------------------------
* TBSMark_Animation
-------------------------------------------------------------------------*/
function TBSMark_Animation() {
    this.initialize.apply(this, arguments);
}
TBSMark_Animation.prototype = Object.create(Sprite_TBSAnimation.prototype);
TBSMark_Animation.prototype.constructor = TBSMark_Animation;

TBSMark_Animation.prototype.initialize = function () {
    Sprite_TBSAnimation.prototype.initialize.call(this, arguments);
    this._loop = true;
};

TBSMark_Animation.prototype.update = function () {
    Sprite_TBSAnimation.prototype.update.call(this);
    if (!this.isPlaying() && this._animation && this._loop) {
        this.setupDuration();
    }
};


/*-------------------------------------------------------------------------
* TBSAurasManager
-------------------------------------------------------------------------*/
function TBSAurasManager() {
    this.initialize.apply(this, arguments);
}

TBSAurasManager.prototype.initialize = function () {
    this._auras = [];
};

TBSAurasManager.prototype.newAura = function (id, caster) {
    var data = Lecode.S_TBS.Config.Aura[id];
    if (data)
        this._auras.push(new TBSAura(id, caster, data));
};

TBSAurasManager.prototype.removeAura = function (id) {
    this._auras = this._auras.filter(function (aura) {
        if (aura._id === id) {
            return false;
        }
        return true;
    }.bind(this));
};


/*-------------------------------------------------------------------------
* TBSAura
-------------------------------------------------------------------------*/
function TBSAura() {
    this.initialize.apply(this, arguments);
}

TBSAura.prototype.initialize = function (id, caster, data) {
    this._id = id;
    this._caster = caster;
    this._data = data;
};

TBSAura.prototype.getSizeArea = function () {
    var center = this._caster.getCell().toCoords();
    return BattleManagerTBS.getScopeFromData(this._data.size, center, {});
};


/*-------------------------------------------------------------------------
* Game_Battler
-------------------------------------------------------------------------*/
Lecode.S_TBS.TilesMarksAura.oldGameBattler_addNewState = Game_Battler.prototype.addNewState;
Game_Battler.prototype.addNewState = function (stateId) {
    if (LeUtilities.isScene("Scene_Battle") && Lecode.S_TBS.commandOn) {
        var state = $dataStates[stateId];
        var entity = BattleManagerTBS.getEntityByBattler(this);
        var auras = LeUtilities.stringToArray(state.TagsLetbs.auras);
        for (var i = 0; i < auras.length; i++) {
            var auraId = auras[i];
            BattleManagerTBS._aurasManager.newAura(auraId, entity);
        }
        if (auras.length > 0)
            BattleManagerTBS.processAurasEffectsWhenApplied();
    }
    Lecode.S_TBS.TilesMarksAura.oldGameBattler_addNewState.call(this, stateId);
};

Lecode.S_TBS.TilesMarksAura.oldGameBattler_removeState = Game_Battler.prototype.removeState;
Game_Battler.prototype.removeState = function (stateId) {
    if (LeUtilities.isScene("Scene_Battle") && Lecode.S_TBS.commandOn) {
        var state = $dataStates[stateId];
        var auras = LeUtilities.stringToArray(state.TagsLetbs.auras);
        for (var i = 0; i < auras.length; i++) {
            var auraId = auras[i];
            BattleManagerTBS._aurasManager.removeAura(auraId);
        }
        if (auras.length > 0)
            BattleManagerTBS.processAurasEffectsWhenRemoved();
    }
    Lecode.S_TBS.TilesMarksAura.oldGameBattler_removeState.call(this, stateId);
};
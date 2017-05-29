/*
#=============================================================================
# LeTBS: Summoning
# LeTBS_Summoning.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeTBS_Summoning = true;

var Lecode = Lecode || {};
Lecode.S_TBS.Summoning = {};
/*:
 * @plugindesc Adds a summoning system
 * @author Lecode
 * @version 1.0
 *
 * @help
 * See the documentation
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_Summoning');




/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.Summoning.oldBattleManagerTBS_initMembers = BattleManagerTBS.initMembers;
BattleManagerTBS.initMembers = function () {
    this._nonActiveSummons = [];
    this._activeSummons = [];
    Lecode.S_TBS.Summoning.oldBattleManagerTBS_initMembers.call(this);
};

BattleManagerTBS.summonEntities = function () {
    return this._nonActiveSummons.concat(this._activeSummons);
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_allEntities = BattleManagerTBS.allEntities;
BattleManagerTBS.allEntities = function () {
    return Lecode.S_TBS.Summoning.oldBattleManagerTBS_allEntities.call(this)
        .concat(this.summonEntities());
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_allPlayableEntities = BattleManagerTBS.allPlayableEntities;
BattleManagerTBS.allPlayableEntities = function () {
    return Lecode.S_TBS.Summoning.oldBattleManagerTBS_allPlayableEntities.call(this)
        .concat(this._activeSummons);
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_destroyEntity = BattleManagerTBS.destroyEntity;
BattleManagerTBS.destroyEntity = function (entity) {
    Lecode.S_TBS.Summoning.oldBattleManagerTBS_destroyEntity.call(this, entity);
    LeUtilities.removeInArray(this._nonActiveSummons, entity);
    LeUtilities.removeInArray(this._activeSummons, entity);
};

BattleManagerTBS.newSummon = function (caster, summonId, cell) {
    var summonData = Lecode.S_TBS.Config.Summons[summonId];
    summonData.caster = caster;
    var layer = this.getLayer("battlers");
    var id = summonData.id;
    var battler = summonData.kind === "actor" ? new Game_Actor(id) : new Game_Enemy(id, 0, 0);
    var summon;
    if (summonData.active) {
        summon = new TBSActiveSummon(battler, layer, cell, summonData);
        this._activeSummons.push(summon);
        this.updateTurnOrderForSummon(caster, summon, summonData.turn_order);
    } else {
        summon = new TBSNonActiveSummon(battler, layer, cell, summonData);
        this._nonActiveSummons.push(summon);
    }
    summon.onSummoned(caster, summonData.stats);
};

BattleManagerTBS.updateTurnOrderForSummon = function (caster, summon, type) {
    if (type === "remake") {
        var activeEntity = this.activeEntity();
        this.determineTurnOrder();
        for (var i = 0; i < this._turnOrder.length; i++) {
            var entity = this._turnOrder[i];
            if (entity === caster)
                this._activeIndex = i;
        }
    } else if (type === "after_caster") {
        var indexToInsert = null;
        for (var i = 0; i < this._turnOrder.length; i++) {
            var entity = this._turnOrder[i];
            if (entity === caster)
                indexToInsert = i;
        }
        if (indexToInsert >= 0) {
            this._turnOrder.splice(indexToInsert + 1, 0, summon);
        }
    }
    setTimeout(this._turnOrderVisual.updateOnSummon.bind(this._turnOrderVisual,
        this._turnOrder, this._activeIndex), 300);
};

BattleManagerTBS.onActiveSummonDeath = function (entity) {
    var summonData = entity._summonData;
    var summonIndex;
    for (var i = 0; i < this._turnOrder.length; i++) {
        var e = this._turnOrder[i];
        if (entity === e)
            summonIndex = i;
    }
    if (summonData.turn_order === "remake")
        this.determineTurnOrder();
    else
        LeUtilities.removeInArray(this._turnOrder, entity);
    if (this._activeIndex >= summonIndex)
        this._activeIndex--;
    this._turnOrderVisual.updateOnSummon(this._turnOrder, this._activeIndex);
    LeUtilities.removeInArray(this._activeSummons, entity);
};

BattleManagerTBS.checkTiedSummonsonDeath = function (entity) {
    this.summonEntities().forEach(function (summon) {
        if (summon._summonData.caster === entity) {
            summon.battler().addState(1);
            summon.checkDeath();
        }
    })
};


/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
TBSTurnOrderVisual.prototype.updateOnSummon = function (newOrder, oldIndex) {
    this.set(newOrder);
    this._activeIndex = oldIndex;
    this.setPositions();
    this.updateOrderState();
};


/*-------------------------------------------------------------------------
* TBSSequenceManager
-------------------------------------------------------------------------*/
TBSSequenceManager.prototype.commandSummon = function (param) {
    var id = param[0];
    var cellTargets = param[1];
    var cells = this.readCellTargets(cellTargets);

    cells.forEach(function (cell) {
        BattleManagerTBS.newSummon(this.getUser(), id, cell);
    }.bind(this));
};


/*-------------------------------------------------------------------------
* TBSNonActiveSummon
-------------------------------------------------------------------------*/
function TBSNonActiveSummon() {
    this.initialize.apply(this, arguments);
}
TBSNonActiveSummon.prototype = Object.create(TBSEntity.prototype);
TBSNonActiveSummon.prototype.constructor = TBSNonActiveSummon;

TBSNonActiveSummon.prototype.initialize = function (battler, layer, cell, summonData) {
    TBSEntity.prototype.initialize.call(this, battler, layer);
    this.setCell(cell);
    this._summonData = summonData;
    this.startAnimation();
};

TBSNonActiveSummon.prototype.createSprite = function (battler, layer) {
    this._sprite = new TBSNonActiveSummon_Sprite(battler, this);
    this._layer = layer;
    layer.addChild(this._sprite);
};

TBSNonActiveSummon.prototype.startAnimation = function () {
    var animId;
    if (this._summonData.body_anim instanceof Array)
        animId = LeUtilities.getRandomValueInArray(this._summonData.body_anim);
    else
        animId = this._summonData.body_anim;
    var animation = $dataAnimations[animId];
    var sprite = new TBSNonActiveSummon_Animation();
    sprite.setup(this, animation, false, 0, this.getCell());
    this._layer.addChild(sprite);
    this._animationSprite = sprite;
};

TBSNonActiveSummon.prototype.stopAnimation = function () {
    this._animationSprite._loop = false;
    this._animationSprite._duration = 0;
    this._layer.removeChild(this._animationSprite);
};

TBSNonActiveSummon.prototype.onDeath = function () {
    TBSEntity.prototype.onDeath.call(this);
    this.stopAnimation();
    BattleManagerTBS.getLayer("animations").newAnimation(this.getCollapseAnimation(), false, 0, this.getCell());
    BattleManagerTBS.destroyEntity(this);
};

TBSNonActiveSummon.prototype.startSequence = function (id, action) {
};


/*-------------------------------------------------------------------------
* TBSNonActiveSummon_Animation
-------------------------------------------------------------------------*/
function TBSNonActiveSummon_Sprite() {
    this.initialize.apply(this, arguments);
}

TBSNonActiveSummon_Sprite.prototype = Object.create(TBSEntity_Sprite.prototype);
TBSNonActiveSummon_Sprite.prototype.constructor = TBSNonActiveSummon_Sprite;

TBSNonActiveSummon_Sprite.prototype.createBitmaps = function () {
    var config = this.getConfig();
    config.forEach(function (info) {
        var pose = info[0];
        this._maxFrame[pose] = 0;
        this._bitmaps[pose] = new Bitmap(48, 48);
    }.bind(this));
    if (!this.isValidPose("dead")) {
        this._maxFrame["dead"] = 0;
        this._bitmaps["dead"] = new Bitmap(48, 48);
    }
};

TBSNonActiveSummon_Sprite.prototype.isReady = function () {
    return true;
};


/*-------------------------------------------------------------------------
* TBSNonActiveSummon_Animation
-------------------------------------------------------------------------*/
function TBSNonActiveSummon_Animation() {
    this.initialize.apply(this, arguments);
}
TBSNonActiveSummon_Animation.prototype = Object.create(Sprite_TBSAnimation.prototype);
TBSNonActiveSummon_Animation.prototype.constructor = TBSNonActiveSummon_Animation;

TBSNonActiveSummon_Animation.prototype.initialize = function () {
    Sprite_TBSAnimation.prototype.initialize.call(this, arguments);
    this._loop = true;
};

TBSNonActiveSummon_Animation.prototype.update = function () {
    Sprite_TBSAnimation.prototype.update.call(this);
    if (!this.isPlaying() && this._animation && this._loop) {
        this.setupDuration();
    }
};


/*-------------------------------------------------------------------------
* TBSActiveSummon
-------------------------------------------------------------------------*/
function TBSActiveSummon() {
    this.initialize.apply(this, arguments);
}
TBSActiveSummon.prototype = Object.create(TBSEntity.prototype);
TBSActiveSummon.prototype.constructor = TBSActiveSummon;

TBSActiveSummon.prototype.initialize = function (battler, layer, cell, summonData) {
    TBSEntity.prototype.initialize.call(this, battler, layer);
    this.setCell(cell);
    this._summonData = summonData;
};

TBSActiveSummon.prototype.playableByAI = function () {
    return TBSEntity.prototype.playableByAI.call(this) || this._summonData.type === "ai_playable";
};

TBSActiveSummon.prototype.onDeath = function () {
    TBSEntity.prototype.onDeath.call(this);
    this.destroy();
    BattleManagerTBS.onActiveSummonDeath(this);
};


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
TBSEntity.prototype.onSummoned = function (caster, statesData) {
    this.getCasterStats(caster, statesData);
};

TBSEntity.prototype.getCasterStats = function (caster, statesData) {
    var base = {};
    var plus = {};
    if (statesData.default) {
        var value = statesData.default.replace("%", "");
        for (var i = 0; i <= 7; i++) {
            if (value.match(/\+/i)) {
                plus[i] = caster.battler().param(i) * value * 0.01;
                base[i] = null;
            } else
                base[i] = caster.battler().param(i) * value * 0.01;
        }
    }
    var tags = ["mhp", "mmp", "atk", "def", "mat", "mdf", "agi", "luk"];
    for (var i = 0; i <= 7; i++) {
        var value = statesData[tags[i]];
        if (value) {
            value = value.replace("%", "");
            if (value.match(/\+/i)) {
                plus[i] = caster.battler().param(i) * value * 0.01;
                base[i] = null;
            } else
                base[i] = caster.battler().param(i) * value * 0.01;
        }
    }
    this.battler().setSummonParamBase(base);
    this.battler().setSummonParamPlus(plus);
    this.battler().refresh();
    this.battler().recoverAll();
};

Lecode.S_TBS.Summoning.oldTBSEntity_onDeath = TBSEntity.prototype.onDeath;
TBSEntity.prototype.onDeath = function () {
    Lecode.S_TBS.Summoning.oldTBSEntity_onDeath.call(this);
    BattleManagerTBS.checkTiedSummonsonDeath(this);
};


/*-------------------------------------------------------------------------
* Game_Battler
-------------------------------------------------------------------------*/
Lecode.S_TBS.Summoning.oldGameActor_paramBase = Game_Actor.prototype.paramBase;
Game_Actor.prototype.paramBase = function (paramId) {
    var value = Lecode.S_TBS.Summoning.oldGameActor_paramBase.call(this, paramId);
    return this.summonParamBase(paramId) ? this.summonParamBase(paramId) : value;
};

Lecode.S_TBS.Summoning.oldGameActor_paramPlus = Game_Actor.prototype.paramPlus;
Game_Actor.prototype.paramPlus = function (paramId) {
    return Lecode.S_TBS.Summoning.oldGameActor_paramPlus.call(this, paramId) + this.summonParamPlus(paramId);
};

Lecode.S_TBS.Summoning.oldGameEnemy_paramBase = Game_Enemy.prototype.paramBase;
Game_Enemy.prototype.paramBase = function (paramId) {
    var value = Lecode.S_TBS.Summoning.oldGameEnemy_paramBase.call(this, paramId);
    return this.summonParamBase(paramId) ? this.summonParamBase(paramId) : value;
};

Lecode.S_TBS.Summoning.oldGameEnemy_paramPlus = Game_Enemy.prototype.paramPlus;
Game_Enemy.prototype.paramPlus = function (paramId) {
    return Lecode.S_TBS.Summoning.oldGameEnemy_paramPlus.call(this, paramId) + this.summonParamPlus(paramId);
};

Game_Battler.prototype.summonParamBase = function (paramId) {
    if (this._summonParamBase)
        return Math.floor(this._summonParamBase[paramId]) || 0;
    return 0;
};

Game_Battler.prototype.setSummonParamBase = function (paramBase) {
    this._summonParamBase = paramBase;
};

Game_Battler.prototype.summonParamPlus = function (paramId) {
    if (this._summonParamPlus)
        return Math.floor(this._summonParamPlus[paramId]) || 0;
    return 0;
};

Game_Battler.prototype.setSummonParamPlus = function (paramPlus) {
    this._summonParamPlus = paramPlus;
};
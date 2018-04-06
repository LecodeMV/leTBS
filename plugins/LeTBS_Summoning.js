/*
#=============================================================================
# LeTBS: Summoning
# LeTBS_Summoning.js
# By Lecode
# Version 1.3
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : Support the "scope_select" tag
# - 1.2 : Makes the AI attack non active entities
# - 1.3 : Merged the active and non-active summon classes
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeTBS_Summoning = true;

var Lecode = Lecode || {};
Lecode.S_TBS.Summoning = {};
/*:
 * @plugindesc Adds a summoning system
 * @author Lecode
 * @version 1.3
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds various features to summon and control entities in battle.
 * Summons are defined inside the configuration file and called using
 * sequence commands.
 * 
 * ============================================================================
 * Setting up Summons
 * ============================================================================
 * 
 * To add a new summon, find the 'Lecode.S_TBS.Config.Summons' module
 * in the configuration file then add the following data:
 * 
 * "ID": {
 *      turn_order: "after_caster" or "remake",
 *      visible_in_timeline: true or false,
 *      kind: "actor" or "enemy",
 *      id: BATTLER_ID,
 *      tied_to_caster: true or false,
 *      stats: {
 *          default: VALUE,
 *          mhp: VALUE,
 *          mmp: VALUE,
 *          ...
 *      }
 *  }
 * 
 * If 'turn_order' is "remake", the turn order will be calculated once again, 
 * to take into account the summoned entity's agility. Otherwise, the entity will be 
 * summoned in the timeline just after the caster's turn.
 * If the summoned entity is tied to the caster, he'll die whenever the caster dies.
 * 
 * The summoned entity stats can be based on the caster's. Inside the stats option, 
 * you can setup which stat is based on the caster's same stat. The 'default' option 
 * is used for all non-specified stats.
 * For instance:
 * stats: {
 *      default: "80%",
 *      mhp: "200%",
 *      mat: "+20%"
 * }
 * Means that all stats except MHP and MAT will be equal to 80% of the caster same stats. 
 * The MHP however will be equal to 200% of the caster's MHP. The + sign in the last line 
 * specifies that the caster will keep his base stat, but will get an extra value from the 
 * caster. Here, 20% of the caster's MAT is added to the summoned entity's base MAT.
 * 
 * ============================================================================
 * Call A Summon
 * ============================================================================
 * 
 * To call a summon, use the sequence command 'summon: ID, cells'
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
    this._summons = [];
    Lecode.S_TBS.Summoning.oldBattleManagerTBS_initMembers.call(this);
};

BattleManagerTBS.summonEntities = function () {
    return this._summons;
};

BattleManagerTBS.allySummons = function (battler) {
    return this.summonEntities().filter(function (summon) {
        return summon._summonData.caster.battler().isActor() === battler.isActor();
    });
};

BattleManagerTBS.enemySummons = function (battler) {
    return this.summonEntities().filter(function (summon) {
        return summon._summonData.caster.battler().isActor() !== battler.isActor();
    });
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_allEntities = BattleManagerTBS.allEntities;
BattleManagerTBS.allEntities = function () {
    return Lecode.S_TBS.Summoning.oldBattleManagerTBS_allEntities.call(this)
        .concat(this.summonEntities());
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_allPlayableEntities = BattleManagerTBS.allPlayableEntities;
BattleManagerTBS.allPlayableEntities = function () {
    return Lecode.S_TBS.Summoning.oldBattleManagerTBS_allPlayableEntities.call(this)
        .concat(this.summonEntities().filter(function(e){
            return !e.isNonActiveSummon();
        }));
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_destroyEntity = BattleManagerTBS.destroyEntity;
BattleManagerTBS.destroyEntity = function (entity, removeTurn) {
    Lecode.S_TBS.Summoning.oldBattleManagerTBS_destroyEntity.call(this, entity, removeTurn);
    LeUtilities.removeInArray(this._summons, entity);
};

BattleManagerTBS.newSummon = function (caster, summonId, cell) {
    var summonData = Lecode.S_TBS.Config.Summons[summonId];
    summonData.caster = caster;
    var layer = this.getLayer("battlers");
    var id = summonData.id;
    var battler = summonData.kind === "actor" ? new Game_Actor(id) : new Game_Enemy(id, 0, 0);
    var summon;
    summon = new TBSSummonEntity(battler, layer, cell, summonData);
     this._summons.push(summon);
     if (summonData.turn_order !== "none")
        this.updateTurnOrderForSummon(caster, summon, summonData.turn_order);
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

BattleManagerTBS.onSummonDeath = function (entity) {
    var summonData = entity._summonData;
    this.destroyEntity(entity);
    if (summonData.turn_order === "remake")
        this.determineTurnOrder();
};

BattleManagerTBS.checkTiedSummonsonDeath = function (entity) {
    this.summonEntities().forEach(function (summon) {
        if (summon._summonData.caster === entity) {
            summon.battler().addState(1);
            summon.checkDeath();
        }
    });
};

Lecode.S_TBS.Summoning.oldBattleManagerTBS_selectScopeTargets = BattleManagerTBS.selectScopeTargets;
BattleManagerTBS.selectScopeTargets = function (cells, type, user) {
    var condition;
    if (type === "summons") {
        condition = function (e) {
            return e && e.isSummon();
        };
    } else if (type === "own_summons") {
        condition = function (e) {
            return e && e.isSummon() && e._summonData.caster === user;
        };
    } else if (type === "enemy_summons") {
        condition = function (e) {
            return e && e.isSummon() && e._summonData.caster !== user;
        };
    } else {
        return Lecode.S_TBS.Summoning.oldBattleManagerTBS_selectScopeTargets.call(this, cells, type, user);
    }
    cells.forEach(function (cell) {
        var e = cell.getEntity();
        cell._selectable = (cell._selectable && condition(e));
    }, this);
    return cells;
};


/*-------------------------------------------------------------------------
* TBSAiManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.Summoning.oldTBSAiManager_process = TBSAiManager.prototype.process;
TBSAiManager.prototype.process = function () {
    Lecode.S_TBS.Summoning.oldTBSAiManager_process.apply(this, arguments);
    this._offenseOnSummonsDone = false;
};

Lecode.S_TBS.Summoning.oldTBSAiManager_onActionBuildingEnd = TBSAiManager.prototype.onActionBuildingEnd;
TBSAiManager.prototype.onActionBuildingEnd = function (type) {
    Lecode.S_TBS.Summoning.oldTBSAiManager_onActionBuildingEnd.call(this, type);
    if (this._builtData[type].length === 0) {
        if (type === "offense" && !this._offenseOnSummonsDone)
            this.makeOffenseOnSummonsData();
    }
};

//- Target non active summons as well
TBSAiManager.prototype.makeOffenseOnSummonsData = function () {
    var party = this.BM().enemySummons(this._battler).filter(function (e) {
        return !e.battler().isDead();
    });
    var skills = this.getUsableSkills(this._battler);
    var objects = [];
    for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        if (!this._entity.rpgObject().TagsLetbs.aiNoAttack && skill.id === this._battler.attackSkillId() || skill.TagsLetbsAi.type.match("offense")) {
            objects.push(skill);
        }
    }
    this._offenseOnSummonsDone = true;
    this.makeActionData("offense", party, objects);
};


/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
TBSTurnOrderVisual.prototype.updateOnSummon = function (newOrder, oldIndex) {
    this.set(newOrder);
    this._activeIndex = oldIndex;
    this.setPositions();
    this.updateOrderState();
	this.updateTurnNumbers();
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

    return {};
};


/*-------------------------------------------------------------------------
* TBSSummonEntity
-------------------------------------------------------------------------*/
function TBSSummonEntity() {
    this.initialize.apply(this, arguments);
}
TBSSummonEntity.prototype = Object.create(TBSEntity.prototype);
TBSSummonEntity.prototype.constructor = TBSSummonEntity;

TBSSummonEntity.prototype.initialize = function (battler, layer, cell, summonData) {
    TBSEntity.prototype.initialize.call(this, battler, layer);
    this.setCell(cell);
    this._summonData = summonData;
};

TBSSummonEntity.prototype.onDeath = function () {
    TBSEntity.prototype.onDeath.call(this);
    BattleManagerTBS.onSummonDeath(this);
    BattleManagerTBS.destroyEntity(this);
};


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
TBSEntity.prototype.isSummon = function () {
    return !!this._summonData;
};
TBSEntity.prototype.isNonActiveSummon = function () {
    return this.isSummon() && this._summonData.turn_order === "none";
};

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
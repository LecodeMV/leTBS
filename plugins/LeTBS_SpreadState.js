/*
#=============================================================================
# LeTBS: Spread State
# LeTBS_SpreadState.js
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
Imported.LeTBS_SpreadState = true;

var Lecode = Lecode || {};
Lecode.S_TBS.SpreadState = {};
/*:
 * @plugindesc Spread states in a given area
 * @author Lecode
 * @version 1.0
 *
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows states to spread to nearby battlers when they are in a
 * given area.
 * This is different from auras since the propagated state isn't removed once
 * the battler is out of the area of effect.
 * 
 * ============================================================================
 * Set Up A State That Spreads
 * ============================================================================
 *
 * There are two ways to do so. The first one is to tag a state with this
 * instruction:
 * spread: [Odd]% [Scope] [Target Type]
 * [Target Type] can be 'all', 'allies' or 'enemies'
 * The state will spread to all targeted battler in the given scope.
 * Example: spread: 80% circle(2) all
 * 
 * The remaining way is to tag a battler to let him spread a state.
 * spread([State ID]): [Odd]% [Scope] [Target Type]
 * The tag can be used multiple time for the same battler, but with different
 * states.
 * Example:
 * spread(4): 100% circle(1) 'allies'
 * spread(5): 10% circle(3) 'all'
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_SpreadState');


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.SpreadState.oldTBSEntity_setCell = TBSEntity.prototype.setCell;
TBSEntity.prototype.setCell = function (cell) {
    Lecode.S_TBS.SpreadState.oldTBSEntity_setCell.call(this,cell);
    this.checkSpreadableStates();
};

TBSEntity.prototype.checkSpreadableStates = function () {
    if (this.battler().isAlive()) {
        this.spreadStates();
        this.obtainSpreadableStates();
    }
};

TBSEntity.prototype.spreadStates = function () {
    var battler = this.battler();
    battler.states().forEach(function (state) {
        var data = state.TagsLetbs.spread;
        if (data && data.match(/(\d+)\s(.+)\s(.+)/i)) {
            var odd = parseInt(RegExp.$1);
            var scopeData = RegExp.$2;
            var targetType = RegExp.$3;

            var center = this.getCell().toCoords();
            var scope = BattleManagerTBS.getScopeFromData(scopeData, center, {});
            var entities = BattleManagerTBS.getEntitiesInScope(scope);
            entities.forEach(function (e) {
                if (e !== this && e.battler().isAlive()) {
                    if (targetType === "all"
                        || targetType === "allies" && LeUtilities.isAlly(battler, e.battler())
                        || targetType === "enemies" && !LeUtilities.isAlly(battler, e.battler())) {
                        if (!e.battler().isStateAffected(state.id))
                            e.sprite().addExtraPopup("addedState", [state]);
                        e.battler().addState(state.id);
                    }
                }
            }, this);
        }
    }, this);
};

TBSEntity.prototype.obtainSpreadableStates = function () {
    BattleManagerTBS.allEntities().forEach(function (e) {
        if (e !== this && e.battler().isAlive()) {
            this.getSpreadStateFromEntity(e);
            this.getSpreadStateFromStates(e);
        }
    }, this);
};

TBSEntity.prototype.getSpreadStateFromEntity = function (e) {
    var battler = this.battler();
    var obj = e.battler().getLeTBSTagObjectValue("spread");
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var data = obj[key];
            if (data && data.match(/(\d+)\%\s(.+)\s(.+)/i)) {
                var odd = parseInt(RegExp.$1) * 0.01;
                var scopeData = RegExp.$2;
                var targetType = RegExp.$3;

                var center = this.getCell().toCoords();
                var scope = BattleManagerTBS.getScopeFromData(scopeData, center, {});
                if (BattleManagerTBS.isCellInScope(this.getCell(), scope)) {
                    if (targetType === "all"
                        || targetType === "allies" && LeUtilities.isAlly(battler, e.battler())
                        || targetType === "enemies" && !LeUtilities.isAlly(battler, e.battler())) {
                        var state = $dataStates[key];
                        if (!battler.isStateAffected(state.id))
                            this.sprite().addExtraPopup("addedState", [state]);
                        battler.addState(state.id);
                    }
                }
            }
        }
    }
};

TBSEntity.prototype.getSpreadStateFromStates = function (e) {
    var battler = this.battler();
    e.battler().states().forEach(function (state) {
        var data = state.TagsLetbs.spread;
        if (data && data.match(/(\d+)\s(.+)\s(.+)/i)) {
            var odd = parseInt(RegExp.$1);
            var scopeData = RegExp.$2;
            var targetType = RegExp.$3;

            var center = e.getCell().toCoords();
            var scope = BattleManagerTBS.getScopeFromData(scopeData, center, {});
            if (BattleManagerTBS.isCellInScope(this.getCell(), scope)) {
                if (targetType === "all"
                    || targetType === "allies" && LeUtilities.isAlly(battler, e.battler())
                    || targetType === "enemies" && !LeUtilities.isAlly(battler, e.battler())) {
                    if (!battler.isStateAffected(state.id))
                        this.sprite().addExtraPopup("addedState", [state]);
                    battler.addState(state.id);
                }
            }
        }
    }, this);
};
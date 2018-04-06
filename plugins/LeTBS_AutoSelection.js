/*
#=============================================================================
# LeTBS: Auto Selection
# LeTBS_AutoSelection.js
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
var Lecode = Lecode || {};
Lecode.S_TBS.AutoSelection = {};
/*:
 * @plugindesc Automatically selects a target when an action is being used
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin automatically selects a target when a skill or an item is
 * prepared to be used. This occurs when the action's scope is drawn.
 * 
 * The plugin selects the enemy in range with the lowest HP.
 * In case of a friendly skill, an ally is targeted. Here again, with the lowest HP.
 * 
 * ============================================================================
 * Disable For Some Entities
 * ============================================================================
 * 
 * Some entities however, shouldn't be selected automatically by this plugin.
 * Neutral entities like chest for example. Those entities should have 
 * the instruction "skip_auto_selection" inside the letbs tag.
 */
//#=============================================================================

/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_AutoSelection');



/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.AutoSelection.oldBattleManagerTBS_onSkillSelected = BattleManagerTBS.onSkillSelected;
BattleManagerTBS.onSkillSelected = function () {
    Lecode.S_TBS.AutoSelection.oldBattleManagerTBS_onSkillSelected.call(this);
    var skill = LeUtilities.getScene()._windowSkill.item();
    this.processAutoSelection(skill, this._actionScope.cells);
};

Lecode.S_TBS.AutoSelection.oldBattleManagerTBS_processCommandCallSkill = BattleManagerTBS.processCommandCallSkill;
BattleManagerTBS.processCommandCallSkill = function (id) {
    Lecode.S_TBS.AutoSelection.oldBattleManagerTBS_processCommandCallSkill.call(this, id);
    var skill = $dataSkills[id];
    this.processAutoSelection(skill, this._actionScope.cells);
};

Lecode.S_TBS.AutoSelection.oldBattleManagerTBS_processCommandAttack = BattleManagerTBS.processCommandAttack;
BattleManagerTBS.processCommandAttack = function () {
    Lecode.S_TBS.AutoSelection.oldBattleManagerTBS_processCommandAttack.call(this);
    var scope = this._actionScope.cells.filter(function (cell) {
        return cell._selectable;
    });
    var entities = this.getEntitiesInScope(scope);
    entities = entities.filter(function(e){
        return !e.battler().hasLeTBSTag("skipAutoSelection");
    });
    var enemies = entities.filter(function (entity) {
        return entity.battler().isEnemy() && !entity.battler().isDead();
    });
    var target;
    if (enemies.length > 0) {
        target = enemies.sort(function (a, b) {
            return a.battler().hpRate() - b.battler().hpRate();
        })[0];
    }

    if (target) {
        this.setCursorCell(target.getCell());
    }
};

BattleManagerTBS.processAutoSelection = function (item, scope) {
    scope = scope.filter(function (cell) {
        return cell._selectable;
    });
    var entities = this.getEntitiesInScope(scope);
    entities = entities.filter(function(e){
        return !e.battler().hasLeTBSTag("skipAutoSelection");
    });
    var actors = entities.filter(function (entity) {
        return entity.battler().isActor() && !entity.battler().isDead();
    });
    var enemies = entities.filter(function (entity) {
        return entity.battler().isEnemy() && !entity.battler().isDead();
    });
    var target;
    if ([1, 2, 3, 4, 5, 6].indexOf(item.scope) >= 0 && enemies.length > 0) {
        target = enemies.sort(function (a, b) {
            return a.battler().hpRate() - b.battler().hpRate();
        })[0];
    } else if ([7, 8, 9, 10, 11].indexOf(item.scope) >= 0 && actors.length > 0) {
        target = actors.sort(function (a, b) {
            return a.battler().hpRate() - b.battler().hpRate();
        })[0];
    }

    if (target) {
        this.setCursorCell(target.getCell());
    }
};
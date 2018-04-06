/*
#=============================================================================
# BattleLog Support for LeTBS
# LeTBS_BattleLog.js
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
Lecode.S_TBS.LogWin = {};
/*:
 * @plugindesc BattleLog support for LeTBS
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allows LeTBS to support the battle log.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS');

Lecode.S_TBS.LogWin.useEXVersion = false;


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.LogWin.oldBattleManagerTBS_onNewTurnOrder = BattleManagerTBS.onNewTurnOrder;
BattleManagerTBS.onNewTurnOrder = function () {
    Lecode.S_TBS.LogWin.oldBattleManagerTBS_onNewTurnOrder.call(this);
    this._logWindow.startTurn();
};

Lecode.S_TBS.LogWin.oldBattleManagerTBS_processAction = BattleManagerTBS.processAction;
BattleManagerTBS.processAction = function () {
    this._logWindow.push('pushBaseLine');
    Lecode.S_TBS.LogWin.oldBattleManagerTBS_processAction.call(this);
    var subject = this.activeEntity().battler();
    this._logWindow.displayAction(subject, this.activeAction().item());
    this._logWindow.push('popBaseLine');
};

Lecode.S_TBS.LogWin.oldBattleManagerTBS_invokeObjEffects = BattleManagerTBS.invokeObjEffects;
BattleManagerTBS.invokeObjEffects = function (user, item, targets, hitAnim, animDelay) {
    Lecode.S_TBS.LogWin.oldBattleManagerTBS_invokeObjEffects.call(this, user, item, targets, hitAnim, animDelay);
    targets.forEach(function (target) {
        this._logWindow.displayActionResults(user.battler(),target.battler());
    }.bind(this));
};

Lecode.S_TBS.LogWin.oldBattleManagerTBS_invokeObjEffectsOnMap = BattleManagerTBS.invokeObjEffectsOnMap;
BattleManagerTBS.invokeObjEffectsOnMap = function (user, item, cellTargets, hitAnim, animDelay) {
    Lecode.S_TBS.LogWin.oldBattleManagerTBS_invokeObjEffectsOnMap.call(this, user, item, cellTargets, hitAnim, animDelay);
    cellTargets.forEach(function (cell) {
        var target = cell.getEntity();
        if (target)
            this._logWindow.displayActionResults(user.battler(),target.battler());
    }.bind(this));
};

Lecode.S_TBS.LogWin.oldBattleManagerTBS_onActionEnd = BattleManagerTBS.onActionEnd;
BattleManagerTBS.onActionEnd = function() {
    Lecode.S_TBS.LogWin.oldBattleManagerTBS_onActionEnd.call(this);
    this._logWindow.clear();
};


/*-------------------------------------------------------------------------
* Window_BattleLog
-------------------------------------------------------------------------*/
Window_BattleLog.prototype.updateWaitMode = function() {
    var waiting = false;
    /*switch (this._waitMode) {
    case 'effect':
        waiting = this._spriteset.isEffecting();
        break;
    case 'movement':
        waiting = this._spriteset.isAnyoneMoving();
        break;
    case 'animation':
        waiting = this._spriteset.isAnimationPlaying();
        break;
    case 'popups':
        waiting = this._spriteset.isPopupPlaying();
        break;
    }*/
    if (!waiting) {
        this._waitMode = '';
    }
    return waiting;
};
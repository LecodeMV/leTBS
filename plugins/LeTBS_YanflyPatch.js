/*
#=============================================================================
# LeTBS: Patch for Yanfly's plugins
# LeTBS_YanflyPatch.js
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
# - 1.1 : Make LeTBS support common events in battle
#=============================================================================
*/
var Imported = Imported || {};
Imported["LeTBS_YanflyPatch"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS.YanflyPatch = {};
/*:
 * @plugindesc Fixes compatibility issues with Yanfly's plugins
 * @author Lecode
 * @version 1.1
 *

 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin fixes some compatibility issues with Yanfly's plugins.
 */
//#=============================================================================

if (Imported.YEP_BattleEngineCore) {

    Lecode.S_TBS.YanflyPatch.oldGameBattler_startDamagePopup = Game_Battler.prototype.startDamagePopup;
    Game_Battler.prototype.startDamagePopup = function () {
        if (!Lecode.S_TBS.commandOn) {
            Lecode.S_TBS.YanflyPatch.oldGameBattler_startDamagePopup.call(this);
        }
    };

    Sprite_Damage.prototype.setup = function (target) {
        this._result = Lecode.S_TBS.commandOn ? target.result() : target.shiftDamagePopup();
        var result = this._result;
        if (result.missed || result.evaded) {
            this.createMiss();
        } else if (result.hpAffected) {
            this.createDigits(0, result.hpDamage);
        } else if (target.isAlive() && result.mpDamage !== 0) {
            this.createDigits(2, result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    };

    BattleManager.processVictory = function () {
        this._victoryPhase = true;
        if (this._windowLayer) this._windowLayer.x = 0;
        Yanfly.BEC.BattleManager_processVictory.call(this);
    };

    Game_Action.prototype.applyGlobal = function () {
        if (!Lecode.S_TBS.commandOn && $gameParty.inBattle()) return;
        Yanfly.BEC.Game_Action_applyGlobal.call(this);
    };

} //- YEP_BattleEngineCore

if (Imported.YEP_X_SkillCooldowns) {
    Lecode.S_TBS.YanflyPatch.oldBattleManagerTBS_stopBattle = BattleManagerTBS.stopBattle;
    BattleManagerTBS.stopBattle = function () {
        Lecode.S_TBS.YanflyPatch.oldBattleManagerTBS_stopBattle.call(this);
        $gameParty.endBattleCooldowns();
    };

    if (Imported.LeTBS_Summoning) {
        Lecode.S_TBS.YanflyPatch.oldGameTroop_increaseTurn = Game_Troop.prototype.increaseTurn;
        Game_Troop.prototype.increaseTurn = function () {
            Lecode.S_TBS.YanflyPatch.oldGameTroop_increaseTurn.call(this);
            BattleManagerTBS._summons.forEach(function (entity) {
                entity.battler().updateCooldowns();
                entity.battler().updateWarmups();
            });
        };
    }
}

Lecode.S_TBS.YanflyPatch.oldTBSEntity_onTurnStart = TBSEntity.prototype.onTurnStart;
TBSEntity.prototype.onTurnStart = function () {
    if (this._battler.onTurnStart)
        this._battler.onTurnStart();
    Lecode.S_TBS.YanflyPatch.oldTBSEntity_onTurnStart.call(this);
};
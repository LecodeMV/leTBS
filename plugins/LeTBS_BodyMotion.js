/*
#=============================================================================
# LeTBS: Body Motion
# LeTBS_BodyMotion.js
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
Imported["LeTBS_BodyMotion"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS.BodyMotion = {};
/*:
 * @plugindesc Animate LeTBS entities
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin add some extra features to the popup display for LeTBS.
 * The popup system is also modified to display the damage in chain.
 * 
 * ============================================================================
 * Force Popup
 * ============================================================================
 *
 * You can force a popup on an entity using a plugin command
 * LeTBS ShowPopup [Entity] Text(...) FontSize(...) Color(...) IconL(...) IconR(...)
 * 
 * The parameters after Text are optional. Replace the dots with wanted values.
 * For more details, see the documentation page about plugin commands.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently. Most of the features are unexploited.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
Lecode.S_TBS.BodyMotion.breathingScale = [0.8, 1.2];



/*-------------------------------------------------------------------------
* TBSEntity_Sprite
-------------------------------------------------------------------------*/
Lecode.S_TBS.BodyMotion.oldTBSEntitySprite_initialize = TBSEntity_Sprite.prototype.initialize;
TBSEntity_Sprite.prototype.initialize = function (battler, entity) {
    Lecode.S_TBS.BodyMotion.oldTBSEntitySprite_initialize.call(this, battler, entity);
    this._bodyMotion = {};
    this.startBreathingBodyMotion();
};

TBSEntity_Sprite.prototype.startBreathingBodyMotion = function () {
    var time = 2000;
    var tween = new TWEEN.Tween(this.scale)
        .to({ x: 1, y: 1.05 }, time)
        .repeat(Infinity)
        .yoyo(true)
        .delay(Math.random() * 500)
        .start();
    this._bodyMotion.breathing = tween;
};

TBSEntity_Sprite.prototype.startWalkingBodyMotion = function (dir) {
    var time = 200;
    var skewX, skewY;
    switch (dir) {
        case 6:
            skewX = -20; skewY = 0; break;
        default:
            break;
    }
    var tweenB = new TWEEN.Tween(this.skew)
        .to({ x: skewX * PIXI.DEG_TO_RAD, y: skewY * PIXI.DEG_TO_RAD }, time)
        .easing(TWEEN.Easing.Cubic.Out)
        .repeat(Infinity)
        .yoyo(true);
    var tweenA = new TWEEN.Tween(this.skew)
        .to({ x: -(skewX/2) * PIXI.DEG_TO_RAD, y: -(skewY/2) * PIXI.DEG_TO_RAD }, time/2)
        .easing(TWEEN.Easing.Cubic.Out)
        .chain(tweenB)
        .start();
    this._bodyMotion.walking = tweenB;
};

TBSEntity_Sprite.prototype.stopBodyMotion = function (motion) {
    var tween = this._bodyMotion[motion];
    if (tween) {
        this._bodyMotion[motion].stop();
        this.scale.set(1.0, 1.0);
        this._bodyMotion[motion] = null;
    }
};


/*-------------------------------------------------------------------------
* TBSEntity_Sprite
-------------------------------------------------------------------------*/
Lecode.S_TBS.BodyMotion.oldTBSEntity_processMovement = TBSEntity.prototype.processMovement;
TBSEntity.prototype.processMovement = function (path, freeMove) {
    Lecode.S_TBS.BodyMotion.oldTBSEntity_processMovement.call(this, path, freeMove);
    if (!path || path.length === 0) return;
    var nextCell = this._movePath.leU_last();
    var dir = this.getDirectionTo(nextCell);
    this._sprite.stopBodyMotion("breathing");
    this._sprite.startWalkingBodyMotion(dir);
};
/*
Lecode.S_TBS.BodyMotion.oldTBSEntity_onCellCovered = TBSEntity.prototype.onCellCovered;
TBSEntity.prototype.onCellCovered = function () {
    var nextCell = this._movePath.leU_last();
    if (nextCell) {
        var dir = this.getDirectionTo(nextCell);
        this._sprite.startWalkingBodyMotion(dir);
    }
    return Lecode.S_TBS.BodyMotion.oldTBSEntity_onCellCovered.call(this);
};*/

Lecode.S_TBS.BodyMotion.oldTBSEntity_onMoveEnd = TBSEntity.prototype.onMoveEnd;
TBSEntity.prototype.onMoveEnd = function () {
    Lecode.S_TBS.BodyMotion.oldTBSEntity_onMoveEnd.call(this);
    this._sprite.stopBodyMotion("walking");
    this._sprite.startBreathingBodyMotion();
};
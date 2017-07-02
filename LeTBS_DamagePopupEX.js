/*
#=============================================================================
# LeTBS: Damage Popup EX
# LeTBS_DamagePopupEX.js
# By Lecode
# Version 1.2
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : Support move points popup
# - 1.2 : Added text popup
#=============================================================================
*/
var Imported = Imported || {};
Imported["LeTBS_DamagePopupEX"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS.DamagePopupEX = {};
/*:
 * @plugindesc Improve popups and show states alterations
 * @author Lecode
 * @version 1.2
 *
 * @help
 * ...
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
Lecode.S_TBS.DamagePopupEX.shiftY = 34;



/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
TBSEntity.prototype.prepareExtraPopups = function () {
    var sprite = this._sprite;
    sprite._popupsInfo.movePoints = this.getMovePoints();
};

Lecode.S_TBS.DamagePopupEX.oldTBSEntity_onTurnEnd = TBSEntity.prototype.onTurnEnd;
TBSEntity.prototype.onTurnEnd = function () {
    this.prepareExtraPopups();
    Lecode.S_TBS.DamagePopupEX.oldTBSEntity_onTurnEnd.call(this);
};

TBSEntity.prototype.addTextPopup = function (text) {
    this._sprite.addTextPopup(arguments);
};

TBSEntity.prototype.addTextIconPopup = function (text, icL, icR, fontSize) {
    this._sprite.addTextIconPopup(arguments);
};

/*-------------------------------------------------------------------------
* TBSEntity_Sprite
-------------------------------------------------------------------------*/
Lecode.S_TBS.DamagePopupEX.oldTBSEntitySprite_initialize = TBSEntity_Sprite.prototype.initialize;
TBSEntity_Sprite.prototype.initialize = function (battler, entity) {
    Lecode.S_TBS.DamagePopupEX.oldTBSEntitySprite_initialize.call(this, battler, entity);
    this._popupsInfo = {};
};

Lecode.S_TBS.DamagePopupEX.oldTBSEntitySprite_addPopup = TBSEntity_Sprite.prototype.addPopup;
TBSEntity_Sprite.prototype.addPopup = function () {
    var result = this._battler.result();
    this.shiftPreviousPopups();
    Lecode.S_TBS.DamagePopupEX.oldTBSEntitySprite_addPopup.call(this);
    var addedStates = result.addedStateObjects();
    var removedStates = result.removedStateObjects();
    var diffMovePts = this._popupsInfo.movePoints ? this._entity.getMovePoints() - this._popupsInfo.movePoints : 0;
    if (diffMovePts !== 0)
        this.addExtraPopup("movePoints", [diffMovePts]);
    while (addedStates.length > 0) {
        this.addExtraPopup("addedState", [addedStates.shift()]);
    }
    while (removedStates.length > 0) {
        this.addExtraPopup("removedState", [removedStates.shift()]);
    }
    this._popupsInfo.movePoints = this._entity.getMovePoints();
};

TBSEntity_Sprite.prototype.addExtraPopup = function (type, args) {
    this.shiftPreviousPopups();
    var sprite = new Sprite_Damage();
    sprite.x = this.x + this.width / 2;
    sprite.y = this.y;
    sprite.extraSetup(type, args);
    this._popups.push(sprite);
    BattleManagerTBS.getLayer("movableInfo").addChild(sprite);
};

TBSEntity_Sprite.prototype.shiftPreviousPopups = function (sign) {
    sign = 1 || sign;
    if (this._popups.length === 0) return;
    var delta = Math.abs(this._popups[0].y - this.y);
    var shift = delta > Lecode.S_TBS.DamagePopupEX.shiftY ? 0 : Lecode.S_TBS.DamagePopupEX.shiftY;
    for (var i = 0; i < this._popups.length; i++) {
        var popup = this._popups[i];
        popup.y -= shift * sign;
    }
};

TBSEntity_Sprite.prototype.addTextPopup = function () {
    this.addExtraPopup("text", arguments[0]);
};

TBSEntity_Sprite.prototype.addTextIconPopup = function () {
    this.addExtraPopup("textIcon", arguments[0]);
};


/*-------------------------------------------------------------------------
* Sprite_Damage
-------------------------------------------------------------------------*/
Lecode.S_TBS.DamagePopupEX.oldSpriteDamage_setup = Sprite_Damage.prototype.setup;
Sprite_Damage.prototype.setup = function (target) {
    Lecode.S_TBS.DamagePopupEX.oldSpriteDamage_setup.call(this, target);
    if (this.children.length === 0)
        this._duration = 0;
};

Sprite_Damage.prototype.extraSetup = function (type, args) {
    if (type === "addedState")
        this.createAddedStates(args[0]);
    else if (type === "removedState")
        this.createRemovedStates(args[0]);
    else if (type === "movePoints")
        this.createMovePoints(args[0]);
    else if (type === "text")
        this.createText(args[0],args[1],args[2]);
    else if (type === "textIcon")
        this.createTextIcon(args[0],args[1],args[2],args[3],args[4]);
};

Sprite_Damage.prototype.createAddedStates = function (state) {
    var text = "+";
    var textW = this._damageBitmap.measureTextWidth(text);
    var w = Window_Base._iconWidth + 2 + textW;
    var h = Window_Base._iconHeight;
    var sprite = this.createExtraChildSprite(w, h);
    this.drawIcon(sprite, state.iconIndex, 0, 0);
    var y = h / 2 - sprite.bitmap.fontSize / 2;
    this.drawText(sprite, text, Window_Base._iconWidth + 2, y, w);
};

Sprite_Damage.prototype.createRemovedStates = function (state) {
    var text = "-";
    var textW = this._damageBitmap.measureTextWidth(text);
    var w = Window_Base._iconWidth + 2 + textW;
    var h = Window_Base._iconHeight;
    var sprite = this.createExtraChildSprite(w, h);
    this.drawIcon(sprite, state.iconIndex, 0, 0);
    var y = h / 2 - sprite.bitmap.fontSize / 2;
    this.drawText(sprite, text, Window_Base._iconWidth + 2, y, w);
};

Sprite_Damage.prototype.createMovePoints = function (value) {
    var text = value < 0 ? "-" : "+";
    var textW = this._damageBitmap.measureTextWidth(text);
    this.createDigits(0, value);
    var digits = this.children[this.children.length - 1];
    var w = textW + digits.width + 2;
    var h = digits.height;
    var sprite = this.createExtraChildSprite(w, h);
    sprite.dy = 1;
    sprite.x = - this.digitWidth() * 0.8;
    var y = h / 2 - sprite.bitmap.fontSize / 2;
    var x = textW;
    this.drawText(sprite, text, 12, y, w);
    this._flashColor = [175, 175, 0, 160];
    this._flashDuration = 90;
};

Sprite_Damage.prototype.createText = function (text, fontSize, color) {
    fontSize = fontSize || 28;
    var textW = this._damageBitmap.measureTextWidth(text);
    var w = 2 + textW;
    var h = fontSize + 2;
    var sprite = this.createExtraChildSprite(w, h);
    this.drawText(sprite, text, 1, 0, w, null, color);
};

Sprite_Damage.prototype.createTextIcon = function (text, icL, icR, fontSize, color) {
    fontSize = fontSize || 28;
    var textW = this._damageBitmap.measureTextWidth(text);
    var w = 2 + textW + Window_Base._iconWidth +
        (icL ? Window_Base._iconWidth : 0) +
        (icR ? Window_Base._iconWidth : 0);
    var h = Math.max(Window_Base._iconHeight,fontSize) + 2;
    var sprite = this.createExtraChildSprite(w, h);
    if (icL)
        this.drawIcon(sprite, icL, 0, 0);
    this.drawText(sprite, text, Window_Base._iconWidth, 0, w, null, color);
    if (icR)
        this.drawIcon(sprite, icR, textW + Window_Base._iconWidth, 0);
};

Sprite_Damage.prototype.createExtraChildSprite = function (w, h) {
    var sprite = new Sprite();
    sprite.bitmap = new Bitmap(w, h);
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 1;
    sprite.y = -40;
    sprite.ry = sprite.y;
    sprite.dy = 0;
    this.addChild(sprite);
    return sprite;
};

Sprite_Damage.prototype.drawText = function (sprite, text, x, y, maxWidth, align, color) {
    if (color)
        sprite.bitmap.textColor = color;
    sprite.bitmap.drawText(text, x, y, maxWidth, 28, align);
};

Sprite_Damage.prototype.drawIcon = function (sprite, iconIndex, x, y) {
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    sprite.bitmap.blt(bitmap, sx, sy, pw, ph, x, y);
};
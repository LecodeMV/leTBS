/*
#=============================================================================
# LeTBS: Entity Hud
# LeTBS_EntityHud.js
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
Lecode.S_TBS.EntityHud = {};
/*:
 * @plugindesc Displays a mini hud for your entities
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin displays a tiny hud over the entities. The hud is only shown
 * when the cursor is on an entity.
 * The hud display the entity's name as well as an HP bar.
 */
//#=============================================================================

/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_EntityHud');


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.EntityHud.oldTBSEntity_createComponents = TBSEntity.prototype.createComponents;
TBSEntity.prototype.createComponents = function () {
    Lecode.S_TBS.EntityHud.oldTBSEntity_createComponents.call(this);
    this._miniHud = new Window_TBSEntityHud(this);
    BattleManagerTBS.getLayer("movableInfo").addChild(this._miniHud);
};

Lecode.S_TBS.EntityHud.oldTBSEntity_update = TBSEntity.prototype.update;
TBSEntity.prototype.update = function () {
    Lecode.S_TBS.EntityHud.oldTBSEntity_update.call(this);
    this._miniHud.updatePosition();
};

Lecode.S_TBS.EntityHud.oldTBSEntity_onMouseOver = TBSEntity.prototype.onMouseOver;
TBSEntity.prototype.onMouseOver = function () {
    Lecode.S_TBS.EntityHud.oldTBSEntity_onMouseOver.call(this);
    this.showMiniHud();
};

Lecode.S_TBS.EntityHud.oldTBSEntity_onMouseOut = TBSEntity.prototype.onMouseOut;
TBSEntity.prototype.onMouseOut = function () {
    Lecode.S_TBS.EntityHud.oldTBSEntity_onMouseOut.call(this);
    this.hideMiniHud();
};

Lecode.S_TBS.EntityHud.oldTBSEntity_onTurnEnd = TBSEntity.prototype.onTurnEnd;
TBSEntity.prototype.onTurnEnd = function () {
    Lecode.S_TBS.EntityHud.oldTBSEntity_onTurnEnd.call(this);
    this._miniHud.refresh();
};

Lecode.S_TBS.EntityHud.oldTBSEntity_onDamage = TBSEvent.prototype.onDamage;
TBSEvent.prototype.onDamage = function (user) {
    Lecode.S_TBS.EntityHud.oldTBSEntity_onDamage.call(this, user);
    this._miniHud.refresh();
};

TBSEntity.prototype.showMiniHud = function () {
    this._miniHud.contentsOpacity = 255;
    this._miniHud.refresh();
};

TBSEntity.prototype.hideMiniHud = function () {
    this._miniHud.contentsOpacity = 0;
};


/*-------------------------------------------------------------------------
* Window_TBSEntityHud
-------------------------------------------------------------------------*/
function Window_TBSEntityHud() {
    this.initialize.apply(this, arguments);
}
Window_TBSEntityHud.prototype = Object.create(Window_Base.prototype);
Window_TBSEntityHud.prototype.constructor = Window_TBSEntityHud;

Window_TBSEntityHud.prototype.initialize = function (entity) {
    this._entity = entity;
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this.contentsOpacity = 0;
    this.refresh();
    this.updatePosition();
};

Window_TBSEntityHud.prototype.minWindowWidth = function () {
    return 300;
};

Window_TBSEntityHud.prototype.minWindowHeight = function () {
    return 200;
};

Window_TBSEntityHud.prototype.windowWidth = function () {
    return 300;
};

Window_TBSEntityHud.prototype.windowHeight = function () {
    return 200;
};

Window_TBSEntityHud.prototype.updatePosition = function () {
    var x = this._entity._posX - this.windowWidth() / 2;
    var y = this._entity._posY;
    this.x = x + this._entity.width() / 2;
    this.y = y;
};

Window_TBSEntityHud.prototype.refresh = function () {
    this.contents.clear();
    this.resetFontSettings();
    var battler = this._entity.battler();
    //- Name
    var x = 0;
    var y = 0;
    var w = 46;
    this.contents.fontSize -= 4;
    this.changeTextColor(this.systemColor());
    this.leU_drawText(battler.name(), "center", y);
    //y += this.contents.fontSize;
    x = this.contentsWidth() / 2 - w / 2;
    var color1 = this.hpGaugeColor1();
    var color2 = this.hpGaugeColor2();
    this.drawGauge(x, y, w, battler.hpRate(), color1, color2);
};

Window_TBSEntityHud.prototype.gaugeHeight = function () {
    return 5;
};
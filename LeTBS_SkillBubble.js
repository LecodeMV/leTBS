/*
#=============================================================================
# LeTBS: Skill Bubbles
# LeTBS_SkillBubble.js
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
Imported.LeTBS_SkillBubble = true;

var Lecode = Lecode || {};
Lecode.S_TBS.SkillBubble = {};
/*:
 * @plugindesc Draw a window when a skill is used
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
var parameters = PluginManager.parameters('LeTBS_SkillBubble');
Lecode.S_TBS.SkillBubble.showAttack = false;


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.SkillBubble.oldTBSEntity_createComponents = TBSEntity.prototype.createComponents;
TBSEntity.prototype.createComponents = function () {
    Lecode.S_TBS.SkillBubble.oldTBSEntity_createComponents.call(this);
    this._skillBubble = new Window_TBSSkillBubble(this);
    BattleManagerTBS.getLayer("movableInfo").addChild(this._skillBubble);
};

Lecode.S_TBS.SkillBubble.oldTBSEntity_update = TBSEntity.prototype.update;
TBSEntity.prototype.update = function() {
    Lecode.S_TBS.SkillBubble.oldTBSEntity_update.call(this);
    this._skillBubble.updateProcess();
};

Lecode.S_TBS.SkillBubble.oldTBSEntity_onActionStart = TBSEntity.prototype.onActionStart;
TBSEntity.prototype.onActionStart = function (id, fastSequence, action) {
    Lecode.S_TBS.SkillBubble.oldTBSEntity_onActionStart.call(this, id, fastSequence, action);
    this._skillBubble.set(action.item());
};

Lecode.S_TBS.SkillBubble.oldTBSEntity_destroy = TBSEntity.prototype.destroy;
TBSEntity.prototype.destroy = function () {
    Lecode.S_TBS.SkillBubble.oldTBSEntity_destroy.call(this);
    this._skillBubble.hide();
};


/*-------------------------------------------------------------------------
* Window_TBSSkillBubble
-------------------------------------------------------------------------*/
function Window_TBSSkillBubble() {
    this.initialize.apply(this, arguments);
}
Window_TBSSkillBubble.prototype = Object.create(Window_Base.prototype);
Window_TBSSkillBubble.prototype.constructor = Window_TBSSkillBubble;

Window_TBSSkillBubble.prototype.initialize = function (entity) {
    this._entity = entity;
    this._item = null;
    Window_Base.prototype.initialize.call(this, 0, 0, 20, 20);
    this.close();
};

Window_TBSSkillBubble.prototype.loadWindowskin = function() {
    this.windowskin = ImageManager.loadSystem('Window2');
};

Window_TBSSkillBubble.prototype.standardBackOpacity = function() {
    return 255;
};

Window_TBSSkillBubble.prototype.standardPadding = function() {
    return 8;
};

Window_TBSSkillBubble.prototype.textPadding = function() {
    return 6;
};

Window_TBSSkillBubble.prototype.windowWidth = function () {
    return this._item ? this.textWidth(this._item.name) + this.standardPadding() * 2 + 38 : 20;
};

Window_TBSSkillBubble.prototype.windowHeight = function () {
    return this.fittingHeight(1);
};

Window_TBSSkillBubble.prototype.updateProcess = function () {
    this.updatePosition();
    if (this._set) {
        this.updateShake();
        //this.updateFade();
        this.updateIntroY();
    }
};

Window_TBSSkillBubble.prototype.updatePosition = function () {
    var entity = this._entity;
    var sprite = entity._sprite;
    var bounds = sprite.getBounds();
    var x = entity._posX - this.windowWidth() / 2;
    var y = entity._posY - this.windowHeight();
    this.x = x + bounds.width / 2;
    this.y = y + (entity.getDir() === 2 ? bounds.height + this.windowHeight() / 2 : 0);
    this.y += this._introY;
};

Window_TBSSkillBubble.prototype.updateShake = function () {
    return;
    var min = this._shakeEffect.power * 0.6;
    var max = this._shakeEffect.power * 1.6;
    var d = this._shakeEffect.duration--;
    if (d > 0) {
        this.x += LeUtilities.randValueBetween(min, max) * LeUtilities.randValueBetween(-1, 1);
        this.y += LeUtilities.randValueBetween(min, max) * LeUtilities.randValueBetween(-1, 1);
    }
};

Window_TBSSkillBubble.prototype.updateFade = function () {
    this.opacity -= 3;
    if (this.opacity <= 0) {
        this.opacity = 0;
        this.hide();
    }
    this.contentsOpacity = this.backOpacity = this.opacity;
};

Window_TBSSkillBubble.prototype.updateIntroY = function () {
    this._introY -= 8;
    if (this._introY <= 0) {
        this._introY = 0;
    }
};

Window_TBSSkillBubble.prototype.refresh = function () {
    this.contents.clear();
    this.resetFontSettings();
    this.contents._drawTextOutline = function() {};
    if(!this._item) return;
    var name = this._item.name;
    this.contents.fontSize -= 4;
    this.leU_drawText(name, "center", 0);
};

Window_TBSSkillBubble.prototype.set = function (item) {
    if (item.id === this._entity.battler().attackSkillId() && !Lecode.S_TBS.SkillBubble.showAttack) return;
    this._item = item;
    var width = this.windowWidth();
    var height = this.windowHeight();
    this.move(0,0,width,height);
    this.createContents();
    this.refresh();
    this.open();
    this._introY = 40;
    this._shakeEffect = {
        power: 2,
        duration: 60
    };
    this._set = true;
    setTimeout(this.close.bind(this), 1000);
};
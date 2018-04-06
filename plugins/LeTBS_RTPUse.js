/*
#=============================================================================
# LeTBS: RTP Use
# LeTBS_RTPUse.js
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
# - 1.1 : Status sprites are now correctly setup
# - 1.2 : Supports sprite's name and character name changes
# - 1.3 : Supports the new sprite configuration module
#=============================================================================
*/
var Lecode = Lecode || {};
Lecode.S_TBS.RTPUse = {};
/*:
 * @plugindesc Automatically uses RPT ressources for LeTBS
 * @author Lecode
 * @version 1.3
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds various tags to use RTP graphics automatically for entities
 * and some displays.
 * 
 * ============================================================================
 * Use Characters For Entities
 * ============================================================================
 *
 * In order for your actors or enemies to use a character as a graphic, use the
 * following instructions inside LeTBS_Sprite tag:
 * 
 * <letbs_sprite>
 * pose([Pose Name]): use_chara, [Filename], [Index], [LineIndex], [FrameIndex]
 * </letbs_sprite>
 * 
 * For an actor, the parameters are optional. In such case, the actor's own
 * character will be used.
 * 
 * ============================================================================
 * Auto Graphic Use
 * ============================================================================
 *
 * Some tags allow to automatically use an entity's graphic on the huds:
 * 
 * <letbs_sprite>
 * turn_order: auto          Uses the 'idle' graphic on the turn order hud
 * status_sprite: auto       Uses the 'idle' graphic in the status window
 * </letbs_sprite>
 * 
 */
//#=============================================================================

/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_RTPUse');


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
TBSEntity.prototype.getCharacterName = function () {
    if (!this.battler().hasLeTBSTag("useCharacter")) return null;
    if (this.hasBlankSprite()) return null;
    if (this.battler().isActor())
        return this.battler().getLeTBSTagStringValue("characterName", this.battler().characterName());
    return this.battler().getLeTBSTagStringValue("characterName");
};

TBSEntity.prototype.getCharacterIndex = function () {
    if (!this.battler().hasLeTBSTag("useCharacter")) return null;
    if (this.hasBlankSprite()) return null;
    if (this.battler().isActor())
        return this.battler().getLeTBSTagStringValue("characterIndex", this.battler().characterIndex());
    return this.battler().getLeTBSTagStringValue("characterIndex");
};

Lecode.S_TBS.RTPUse.oldTBSEntity_checkFilenameChange = TBSEntity.prototype.checkFilenameChange;
TBSEntity.prototype.checkFilenameChange = function (state) {
    var needChange = !!state.TagsLetbs.characterName || !!state.TagsLetbs.characterIndex;
    if (needChange) {
        this.applyFilenameChange();
        return;
    }
    Lecode.S_TBS.RTPUse.oldTBSEntity_checkFilenameChange.call(this, state);
};


/*-------------------------------------------------------------------------
* TBSEntity_Sprite
-------------------------------------------------------------------------*/
Lecode.S_TBS.RTPUse.oldTBSEntitySprite_initialize = TBSEntity_Sprite.prototype.initialize;
TBSEntity_Sprite.prototype.initialize = function (battler, entity) {
    this._useFrameOrder = {};
    Lecode.S_TBS.RTPUse.oldTBSEntitySprite_initialize.call(this, battler, entity);
    this._characterName = null;
    this._charaIndex = null;
    this._frameOrder = [0, 1, 2, 1];
    this._frameOrderIndex = 0;
};

Lecode.S_TBS.RTPUse.oldTBSEntitySprite_updateFrameCount = TBSEntity_Sprite.prototype.updateFrameCount;
TBSEntity_Sprite.prototype.updateFrameCount = function () {
    var pose = this._pose;
    if (this._useFrameOrder[pose]) {
        this._frameOrderIndex++;
        if (this._frameOrderIndex > this._frameOrder.length) {
            this._frameOrderIndex = 0;
            this.onPosePlayed();
        }
        this._frameCount = this._frameOrder[this._frameOrderIndex];
        return;
    }
    Lecode.S_TBS.RTPUse.oldTBSEntitySprite_updateFrameCount.call(this);
};

Lecode.S_TBS.RTPUse.oldTBSEntitySprite_processBitmapsConfig = TBSEntity_Sprite.prototype.processBitmapsConfig;
TBSEntity_Sprite.prototype.processBitmapsConfig = function (poseConfig, hue) {
    var pose = poseConfig.pose;
    var data = poseConfig.data;
    var battler = this._entity.battler();
    if (data.match(/use_chara/)) {
        this._useFrameOrder[pose] = true;
        this._poses.push(pose);
        var array = data.split(",");
        var charaName = battler.isActor() ? battler.characterName() : array[1].trim();
        var fullBitmap = ImageManager.loadCharacter(charaName, hue);
        fullBitmap.addLoadListener(this.createCharaBitmap.bind(this, fullBitmap, array, pose));
        return;
    }
    Lecode.S_TBS.RTPUse.oldTBSEntitySprite_processBitmapsConfig.call(this, poseConfig, hue);
};

TBSEntity_Sprite.prototype.createCharaBitmap = function (fbitmap, array, pose) {
    var battler = this._entity.battler();
    var charaIndex = battler.isActor() ? battler.characterIndex() : Number(array[2].trim());
    var lineIndex = array[3] ? Number(array[3].trim()) : undefined;
    var frameIndex = array[4] ? Number(array[4].trim()) : undefined;
    var bitmap = new Bitmap(48 * 3, 48 * 4);
    var pw = fbitmap.width / 4;
    var ph = fbitmap.height / 2;
    var n = charaIndex;
    var sx = (n % 4) * pw;
    var sy = Math.floor(n / 4) * ph;
    bitmap.blt(fbitmap, sx, sy, pw, ph, 0, 0);
    if (lineIndex >= 0) {
        ph /= 4;
        sy = lineIndex * ph;
        if (frameIndex >= 0) {
            pw /= 3;
            sx = frameIndex * pw;
            var newBmp = new Bitmap(48, 48);
            newBmp.blt(bitmap, sx, sy, pw, ph, 0, 0);
            this._bitmaps[pose] = newBmp;
            this._maxFrame[pose] = 0;
            this._nbrLines[pose] = 1;
        } else {
            var newBmp = new Bitmap(48 * 3, 48);
            newBmp.blt(bitmap, 0, sy, pw, ph, 0, 0);
            this._bitmaps[pose] = newBmp;
            this._maxFrame[pose] = 2;
            this._nbrLines[pose] = 1;
        }
    } else {
        this._maxFrame[pose] = 2;
        this._nbrLines[pose] = 4;
        this._bitmaps[pose] = bitmap;
    }
    this._frameLoaded++;
};


/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
Lecode.S_TBS.RTPUse.oldTBSTurnOrderVisual_getSpriteBitmap = TBSTurnOrderVisual.prototype.getSpriteBitmap;
TBSTurnOrderVisual.prototype.getSpriteBitmap = function (entity) {
    var battler = entity._battler;
    var object = battler.rpgObject().TagsLetbsSprite.turnOrder;
    if (object && object.match(/auto/i)) {
        var sprite = entity._sprite;
        var fbitmap = sprite._bitmaps["idle"];
        var bitmap = new Bitmap(40, 40);
        var pw = fbitmap.width / (sprite._maxFrame["idle"] + 1);
        var ph = fbitmap.height / 4;
        var y = ph <= 40 ? 0 : 6;
        bitmap.blt(fbitmap, pw / 2 - 20, y, 40, 40, 0, 0);
        return bitmap;
    }
    return Lecode.S_TBS.RTPUse.oldTBSTurnOrderVisual_getSpriteBitmap.call(this, entity);
};


/*-------------------------------------------------------------------------
* Window_TBSStatus
-------------------------------------------------------------------------*/
Lecode.S_TBS.RTPUse.oldWindowTBSStatus_drawSprite = Window_TBSStatus.prototype.drawSprite;
Window_TBSStatus.prototype.drawSprite = function (x, y) {
    var battler = this._entity._battler;
    var object = battler.rpgObject().TagsLetbsSprite.turnOrder;
    if (object && object.match(/auto/i)) {
        var sprite = this._entity._sprite;
        var fbitmap = sprite._bitmaps["idle"];
        var pw = fbitmap.width / (sprite._maxFrame["idle"] + 1);
        var ph = fbitmap.height / 4;
        var window = this;
        var dx = eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxW) / 2 - pw / 2;
        var dy = 20 + eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxH) / 2 - ph / 2;
        this.contents.blt(fbitmap, 0, 0, pw, ph, dx, dy);
        return;
    }
    Lecode.S_TBS.RTPUse.oldWindowTBSStatus_drawSprite.call(this, x, y);
};
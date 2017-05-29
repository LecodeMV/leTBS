/*
#=============================================================================
# LeTBS: RTP Use
# LeTBS_RTPUse.js
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
Lecode.S_TBS.RTPUse = {};
/*:
 * @plugindesc Automatically use RPT ressources for LeTBS
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ...
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
    return this.battler().isActor() && this.rpgObject().leTbs_useCharacter ? this.battler().characterName()
        : this.rpgObject().leTbs_characterName;
};

TBSEntity.prototype.getCharacterIndex = function () {
    return this.battler().isActor() && this.rpgObject().leTbs_useCharacter ? this.battler().characterIndex()
        : this.rpgObject().leTbs_characterIndex;
};


/*-------------------------------------------------------------------------
* TBSEntity_Sprite
-------------------------------------------------------------------------*/
Lecode.S_TBS.RTPUse.oldTBSEntitySprite_initialize = TBSEntity_Sprite.prototype.initialize;
TBSEntity_Sprite.prototype.initialize = function (battler, entity) {
    Lecode.S_TBS.RTPUse.oldTBSEntitySprite_initialize.call(this, battler, entity);
    this._frameOrder = [0, 1, 2, 1];
    this._frameOrderIndex = 0;
};

Lecode.S_TBS.RTPUse.oldTBSEntitySprite_updateFrameCount = TBSEntity_Sprite.prototype.updateFrameCount;
TBSEntity_Sprite.prototype.updateFrameCount = function () {
    var charaName = this._entity.getCharacterName();
    if (charaName && this._pose === "idle") {
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
TBSEntity_Sprite.prototype.processBitmapsConfig = function (info, hue) {
    var charaName = this._entity.getCharacterName();
    var pose = info[0];
    if (charaName && pose === "idle") {
        this._poses.push(pose);
        var fullBitmap = ImageManager.loadCharacter(charaName, hue);
        fullBitmap.addLoadListener(this.createCharaBitmap.bind(this, fullBitmap));
        return;
    }
    Lecode.S_TBS.RTPUse.oldTBSEntitySprite_processBitmapsConfig.call(this, info, hue);
};

TBSEntity_Sprite.prototype.createCharaBitmap = function (fbitmap) {
    var charaName = this._entity.getCharacterName();
    var charaIndex = this._entity.getCharacterIndex();
    var big = ImageManager.isBigCharacter(charaName);
    if (big) {
        throw new Error("LeTBS_RTPUse: Doesn't handle big characters for now");
    }
    var bitmap = new Bitmap(48 * 3, 48 * 4);
    var pw = fbitmap.width / 4;
    var ph = fbitmap.height / 2;
    var n = charaIndex;
    var sx = (n % 4) * pw;
    var sy = Math.floor(n / 4) * ph;
    bitmap.blt(fbitmap, sx, sy, pw, ph, 0, 0);
    this._maxFrame["idle"] = 2;
    this._bitmaps["idle"] = bitmap;
    this._frameLoaded++;
};


/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
Lecode.S_TBS.RTPUse.oldTBSTurnOrderVisual_getSpriteBitmap = TBSTurnOrderVisual.prototype.getSpriteBitmap;
TBSTurnOrderVisual.prototype.getSpriteBitmap = function (entity) {
    var auto = entity.rpgObject().leTbs_autoTurnOrderFace;
    if (auto) {
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
    var auto = this._entity.rpgObject().leTbs_autoTurnOrderFace;
    if (auto) {
        var sprite = this._entity._sprite;
        var fbitmap = sprite._bitmaps["idle"];
        var pw = fbitmap.width / (sprite._maxFrame["idle"] + 1);
        var ph = fbitmap.height / 4;
        var window = this;
        var dx = eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxW) / 2 - pw / 2;
        var dy = 20 + eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxH) / 2 - ph / 2;
        this.contents.blt(fbitmap, 0, 0, pw, ph, dx, dy);
        /*var pw = fbitmap.width / (sprite._maxFrame["idle"] + 1);
        var ph = fbitmap.height / 4;
        var bitmap = new Bitmap(pw, ph);
        bitmap.blt(fbitmap, pw / 2 - 20, 0, pw, ph);
        var window = this;
        var dx = eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxW) / 2 - bitmap.width / 2;
        var dy = 20 + eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxH) / 2 - bitmap.height / 2;
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy);*/
        return;
    }
    Lecode.S_TBS.RTPUse.oldWindowTBSStatus_drawSprite.call(this, x, y);
};


/*-------------------------------------------------------------------------
* DataManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.RTPUse.oldDataManager_processLeTBSTags = DataManager.processLeTBSTags;
DataManager.processLeTBSTags = function () {
    Lecode.S_TBS.RTPUse.oldDataManager_processLeTBSTags.call(this);
    this.processLeTBS_RTPUseTagsForBattlers();
};

DataManager.processLeTBS_RTPUseTagsForBattlers = function () {
    var groups = [$dataActors, $dataEnemies, $dataClasses];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_characterName = null;
            obj.leTbs_characterIndex = null;
            obj.leTbs_useCharacter = false;
            obj.leTbs_autoTurnOrderFace = false;
            obj.leTbs_autoStatusSprite = false;

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/character_name\s?:\s?(.+)/i))
                        obj.leTbs_characterName = String(RegExp.$1);
                    else if (line.match(/character_index\s?:\s?(.+)/i))
                        obj.leTbs_characterIndex = Number(RegExp.$1);
                    else if (line.match(/use_character/i))
                        obj.leTbs_useCharacter = true;
                    else if (line.match(/auto_turn_order_face/i))
                        obj.leTbs_autoTurnOrderFace = true;
                    else if (line.match(/auto_status_sprite/i))
                        obj.leTbs_autoStatusSprite = true;
                }
            }
        }
    }
};

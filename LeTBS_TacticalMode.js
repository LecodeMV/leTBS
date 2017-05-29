/*
#=============================================================================
# LeTBS: Tactical Mode
# LeTBS_TacticalMode.js
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
Lecode.S_TBS.TacticalMode = {};
/*:
 * @plugindesc Render the map following the "tactical mode" of Dofus
 * @author Lecode
 * @version 1.0
 *
* @param Hard Obstacle Color
* @desc Color for obstacles that blocks the LOS
* @default #2E2E2E
*
* @param Light Obstacle Color
* @desc Color for obstacles that doesn't block the LOS
* @default #0
*
* @param Free Cell Color
* @desc Color for free cells
* @default #898989
*
* @param Opacity
* @desc Drawing Opacity
* @default 175
*
* @param Command Text
* @desc Command Text
* @default Tactical Mode
*
 *
 * @help
 * ...
 */
//#=============================================================================

/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_TacticalMode');
Lecode.S_TBS.TacticalMode.hardObstacleColor = String(parameters["Hard Obstacle Color"] || "#2E2E2E");	//	(): Color for obstacles that blocks the LOS
Lecode.S_TBS.TacticalMode.lightObstacleColor = String(parameters["Light Obstacle Color"] || "#0");	//	(): Color for obstacles that doesn't block the LOS
Lecode.S_TBS.TacticalMode.freeCellColor = String(parameters["Free Cell Color"] || "#898989");	//	(): Color for free cells
Lecode.S_TBS.TacticalMode.opacity = Number(parameters["Opacity"] || 175);	//	(): Drawing Opacity
Lecode.S_TBS.TacticalMode.commandText = String(parameters["Command Text"] || "Tactical Mode");	//	(): Command Text


/*-------------------------------------------------------------------------
* Scene_Battle
-------------------------------------------------------------------------*/
Lecode.S_TBS.TacticalMode.oldSB_createEndCommandWindow = Scene_Battle.prototype.createEndCommandWindow;
Scene_Battle.prototype.createEndCommandWindow = function () {
    Lecode.S_TBS.TacticalMode.oldSB_createEndCommandWindow.call(this);
    this._windowEndCommand.setHandler('tactical_mode', this.setTacticalMode.bind(this));
};

Lecode.S_TBS.TacticalMode.oldSB_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function () {
    Lecode.S_TBS.TacticalMode.oldSB_start.call(this);
    if (Lecode.S_TBS.commandOn) {
        if (BattleManagerTBS._tacticalMode) {
            BattleManagerTBS._tacticalMode = false;
            this.setTacticalMode();
        }
    }
};

Scene_Base.prototype.setTacticalMode = function () {
    BattleManagerTBS._tacticalMode = !BattleManagerTBS._tacticalMode;
    var spriteset = this._spriteset;
    if (BattleManagerTBS._tacticalMode) {
        if (Graphics.isWebGL()) {
            spriteset._tilemap.lowerZLayer.renderable = false;
            spriteset._tilemap.upperZLayer.renderable = false;
            spriteset._parallax.renderable = false;
        }
        spriteset._TacticalLayer.show();
    } else {
        if (Graphics.isWebGL()) {
            spriteset._tilemap.lowerZLayer.renderable = true;
            spriteset._tilemap.upperZLayer.renderable = true;
            spriteset._parallax.renderable = true;
        }
        spriteset._TacticalLayer.clear();
    }
    this._windowEndCommand.activate();
};


/*-------------------------------------------------------------------------
* Spriteset_BattleTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.TacticalMode.oldSpritesetBattle_createBattleLayers = Spriteset_BattleTBS.prototype.createBattleLayers;
Spriteset_BattleTBS.prototype.createBattleLayers = function () {
    this._TacticalLayer = new TBSTacticalLayer();
    this._TacticalLayer.z = 1;
    this._tbsLayer.addChild(this._TacticalLayer);
    Lecode.S_TBS.TacticalMode.oldSpritesetBattle_createBattleLayers.call(this);
};


/*-------------------------------------------------------------------------
* TBSTacticalLayer
-------------------------------------------------------------------------*/
function TBSTacticalLayer() {
    this.initialize.apply(this, arguments);
}
TBSTacticalLayer.prototype = Object.create(Sprite.prototype);
TBSTacticalLayer.prototype.constructor = TBSTacticalLayer;

TBSTacticalLayer.prototype.initialize = function () {
    var w = $gameMap.width() * $gameMap.tileWidth();
    var h = $gameMap.height() * $gameMap.tileHeight();
    var bitmap = new Bitmap(w, h);
    Sprite.prototype.initialize.call(this, bitmap);
};

TBSTacticalLayer.prototype.show = function () {
    for (var y = 0; y < $gameMap.height(); y++) {
        for (var x = 0; x < $gameMap.width(); x++) {
            var cell = BattleManagerTBS.getCellAt(x, y);
            if (!cell || cell.regionId() === Lecode.S_TBS.obstacleRegionId)
                this.drawCell(x, y, "bold");
            else if (cell.regionId() === Lecode.S_TBS.freeObstacleRegionId)
                this.drawCell(x, y, "light");
            else
                this.drawCell(x, y, "free");
        }
    }
};

TBSTacticalLayer.prototype.clear = function () {
    this.bitmap.clear();
};

TBSTacticalLayer.prototype.drawCell = function (x, y, type) {
    var w = Lecode.S_TBS.scopeCellWidth;
    var h = Lecode.S_TBS.scopeCellHeight;
    var sx = $gameMap.tileWidth() - w;
    var sy = $gameMap.tileHeight() - h;
    w -= sx;
    h -= sy;
    sx += x * $gameMap.tileWidth();
    sy += y * $gameMap.tileHeight();
    var color = type === "bold" ? Lecode.S_TBS.TacticalMode.hardObstacleColor
        : (type === "light" ? Lecode.S_TBS.TacticalMode.lightObstacleColor : Lecode.S_TBS.TacticalMode.freeCellColor);
    this.bitmap.paintOpacity = Lecode.S_TBS.TacticalMode.opacity;
    this.bitmap.fillRect(sx, sy, w, h, color);
};


/*-------------------------------------------------------------------------
* TBSTacticalLayer
-------------------------------------------------------------------------*/
Lecode.S_TBS.TacticalMode.oldWindowTBSEndCommand_makeCommandList = Window_TBSEndCommand.prototype.makeCommandList;
Window_TBSEndCommand.prototype.makeCommandList = function () {
    Lecode.S_TBS.TacticalMode.oldWindowTBSEndCommand_makeCommandList.call(this);
    this.addCommand(Lecode.S_TBS.TacticalMode.commandText, "tactical_mode", true);
};
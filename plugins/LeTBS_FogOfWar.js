
/*
#=============================================================================
# LeTBS: BattleFlow
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
Imported.LeTBS_FogOfWar = true;

var Lecode = Lecode || {};
Lecode.S_TBS.FogOfWar = {};
/*:
 * @plugindesc Improve popups and show states alterations
 * @author Lecode
 * @version 1.5
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
var parameters = PluginManager.parameters('LeTBS_FogOfWar');

Lecode.S_TBS.FogOfWar.ScopeColor = String(parameters["Scope Color"] || "#E4A110");


Lecode.S_TBS.FogOfWar.oldSpritesetBattleTBS_createBattleLayers = Spriteset_BattleTBS.prototype.createBattleLayers;
Spriteset_BattleTBS.prototype.createBattleLayers = function () {
    Lecode.S_TBS.FogOfWar.oldSpritesetBattleTBS_createBattleLayers.call(this);
    this._fogLayer = new TBSFogLayer();
    this._fogLayer.z = 5;
    this.addChild(this._fogLayer);
};

Lecode.S_TBS.FogOfWar.oldSpritesetBattleTBS_updateTilemap = Spriteset_BattleTBS.prototype.updateTilemap;
Spriteset_BattleTBS.prototype.updateTilemap = function () {
    Lecode.S_TBS.FogOfWar.oldSpritesetBattleTBS_updateTilemap.call(this);
    [this._fogLayer].forEach(function (layer) {
        if (layer) {
            layer.x = -$gameMap.displayX() * $gameMap.tileWidth();
            layer.y = -$gameMap.displayY() * $gameMap.tileHeight();
        }
    });
};




/*-------------------------------------------------------------------------
* TBSFogLayer
-------------------------------------------------------------------------*/
function TBSFogLayer() {
    this.initialize.apply(this, arguments);
}
TBSFogLayer.prototype = Object.create(TBSScopeLayer.prototype);
TBSFogLayer.prototype.constructor = TBSFogLayer;

TBSFogLayer.prototype.initialize = function () {
    TBSScopeLayer.prototype.initialize.call(this);
};

TBSFogLayer.prototype.drawLineOfSight = function (entity) {
    let range = 8;
    var param = {
        user: entity,
        dir: entity.getDir(),
        need_check_los: true,
        exclude_center: true,
        line_of_sight: true
    };
    let scope = BattleManagerTBS.getScopeFromData("circle(8)", entity.getCell().toCoords(), param);

    let w = this.bitmap.width;
    let h = this.bitmap.height;
    this.bitmap.fillRect(0, 0, w, h, "#000000");

    scope = scope.filter(cell => !!cell._selectable);
    scope.forEach(cell => {
        let dist = LeUtilities.distanceBetweenCells(entity.getCell(), cell);
        let opacity = (dist >= 6) ? 175 + (32 * (dist - 6 + 1)) : 0;
        this.eraseCell(cell.x, cell.y);
        this.drawCell(cell.x, cell.y, opacity, "#000000");
    });
};

TBSFogLayer.prototype.drawCell = function (x, y, opacity, color) {
    var w = $gameMap.tileWidth();
    var h = $gameMap.tileHeight();
    x = x * $gameMap.tileWidth();
    y = y * $gameMap.tileHeight();
    this.bitmap.paintOpacity = opacity;
    this.bitmap.fillRect(x, y, w, h, color);
};

TBSFogLayer.prototype.eraseCell = function (x, y) {
    var w = $gameMap.tileWidth();
    var h = $gameMap.tileHeight();
    x = x * $gameMap.tileWidth();
    y = y * $gameMap.tileHeight();
    this.bitmap.clearRect(x, y, w, h);
};
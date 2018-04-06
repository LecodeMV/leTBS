/*
#=============================================================================
# LeTBS: Rhyme Smooth Map Scrolling Support
# LeTBS_RhymeSmoothMapScrolling.js
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
Imported["LeTBS_RhymeSmoothMapScrolling"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS.RhymeSmoothMapScrolling = {};
/*:
 * @plugindesc Compatibility patch for Rhyme's plugin
 * @author Lecode
 * @version 1.0
 *
* @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin is just a compatibility patch for Rhyme's smooth map scrolling.
 * This add-on should be above
 */
//#=============================================================================

BattleManagerTBS.centerCell = function (cell) {
    $gameMap.scrollTowardsPos(cell.x, cell.y, 4, 90);
};

Game_Map.prototype.scrollTowardsPos = function(x, y, speed, frames) {
  var centerX = this._tDisplayX + this.screenTileX() / 2;
  var centerY = this._tDisplayY + this.screenTileY() / 2;
  if (!this.isLoopHorizontal()) {
    if (centerX < this.screenTileX() / 2) {
      centerX = this.screenTileX() / 2;
    }
    if (centerX > this.width() - this.screenTileX() / 2) {
      centerX = this.width() - this.screenTileX() / 2;
    }
  }
  if (!this.isLoopVertical()) {
    if (centerY < this.screenTileY() / 2) {
      centerY = this.screenTileY() / 2;
    }
    if (centerY > this.height() - this.screenTileY() / 2) {
      centerY = this.height() - this.screenTileY() / 2;
    }
  }
  var distanceX = (x + 0.5) - centerX;
  var distanceY = (y + 0.5) - centerY;
  this.startQuasiScroll(distanceX, distanceY, speed || 4, frames);
};
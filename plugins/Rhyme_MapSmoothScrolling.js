/*:
* @plugindesc this plugin permit to smooth scroll in map
* @author rhyme (converted by Nio kasgami and Quasi)
* @param SpeedDivider
* @desc Will setup how much the map smooth when scrolling more it's high more it's smooth
* @default 8
* @help
* ==============================================================================
*  * for divider
* ------------------------------------------------------------------------------
* $gameMap.setDivider(number); // will set the divider speed in game
* $gameMap.resetDivider(); // will reset the divider to his default value (8)
* ==============================================================================
*
* =============================================================================
* ** How to use Quasi Scroll
* =============================================================================
* Quasi scrolling will let the screen scroll at any angle and can do the
* math for you can find the scroll distance to a certain event or player.
*
*   Diagonal Scrolls <Script Call>
*       $gameMap.startQuasiScroll(distanceX, distanceY, speed);
*     Set distanceX and distanceY to the value you want to scroll.
*      - This values are in grid terms.
*     Set speed to the scrolling speed.
*      - 1 - 6 same as from the Scroll Map Event command.
*
*   Scroll Towards Characters <Script Call>
*       $gameMap.scrollTowards(ID, speed);
*     Set ID to the ID of the event you want to scroll towards.
*      - If ID is set to 0, then it will scroll to the player.
*     Set speed to the scroll speed.
* =============================================================================
* ** How to use Quasi Scroll with frames instead of default speed settings
* =============================================================================
* Using the scroll with a frame duration instead of speed can be helpful with
* timing / making cutscenes since the screen can scroll at any speed you want
* it.
*
*   Diagonal Scrolls <Script Call>
*       $gameMap.startQuasiScroll(distanceX, distanceY, duration, true);
*     Set distanceX and distanceY to the value you want to scroll.
*      - This values are in grid terms.
*     Set duration to the amount of frames this scroll will take
*     !IMPORTANT! Leave the last value as true! This sets it appart from
*     the other .startQuasiScroll()!
*
*   Scroll Towards Characters <Script Call>
*       $gameMap.scrollTowards(ID, duration, true);
*     Set ID to the ID of the event you want to scroll towards.
*      - If ID is set to 0, then it will scroll to the player.
*     Set duration to the amount of frames this scroll will take
*     !IMPORTANT! Leave the last value as true! This sets it appart from
*     the other .scrollTowards()!
* =============================================================================
*
*/

var Alone = Alone || {};
Alone.Alias = Alone.Alias || {};

Alone.Parameters = PluginManager.parameters('Rhyme_MapSmoothScrolling');
Alone.Param = Alone.Param || {};

Alone.Param.Divider = Number(Alone.Parameters['SpeedDivider']);

//==============================================================================
// ■ Game_Map
//------------------------------------------------------------------------------
// The game object class for a map. It contains scrolling and passage
// determination functions.
//==============================================================================

Game_Map.prototype._Divider = Alone.Param.Divider;

Alone.Alias.A01 = Game_Map.prototype.initialize;
Game_Map.prototype.initialize = function(){
  Alone.Alias.A01.call(this);
  this._tDisplayX = this._displayX;
  this._tDisplayY = this._displayY;
};

Game_Map.prototype.setDivider = function(speed){
  this._Divider = speed;
};

Game_Map.prototype.resetDivider = function(){
  this._Divider = Alone.Param.Divider;
};

Game_Map.prototype.setDisplayPos = function(x, y) {
  if (this.isLoopHorizontal()) {
    this._displayX = this._tDisplayX = x.mod(this.width());
    this._parallaxX = x;
  } else {
    var endX = this.width() - this.screenTileX();
    this._displayX = this._tDisplayX = endX < 0 ? endX / 2 : x.clamp(0, endX);
    this._parallaxX = this._displayX;
  }
  if (this.isLoopVertical()) {
    this._displayY = this._tDisplayY = y.mod(this.height());
    this._parallaxY = y;
  } else {
    var endY = this.height() - this.screenTileY();
    this._displayY = this._tDisplayY = endY < 0 ? endY / 2 : y.clamp(0, endY);
    this._parallaxY = this._displayY;
  }
};

Game_Map.prototype.scrollDown = function(distance){
  if(this.isLoopVertical()){
    this._tDisplayY += distance;
    this._tDisplayY %= $dataMap.height;
    if (this._parallaxLoopY){
      this._parallaxY += distance;
    }
  } else if (this.height() >= this.screenTileY()) {
    var lastY = this._tDisplayY;
    this._tDisplayY = Math.min(this._tDisplayY + distance, this.height() - this.screenTileY());
    this._parallaxY = this._displayY;
  }
};

Game_Map.prototype.scrollLeft = function(distance){
  if(this.isLoopHorizontal()){
    this._tDisplayX += $dataMap.width - distance;
    this._tDisplayX %= $dataMap.width;
    if(this._parallaxLoopX){
      this._parallaxX -= distance;
    }
  } else if (this.width() >= this.screenTileX()) {
    var lastX = this._tDisplayX;
    this._tDisplayX = Math.max(this._tDisplayX - distance,  0);
    this._parallaxX = this._displayX;
  }
};

Game_Map.prototype.scrollRight = function(distance){
  if(this.isLoopHorizontal()){
    this._tDisplayX += distance;
    this._tDisplayX %= $dataMap.width;
    if(this._parallaxLoopX){
      this._parallaxX += distance;
    }
  } else if (this.width() >= this.screenTileX()) {
    var lastX = this._tDisplayX;
    this._tDisplayX = Math.min(this._tDisplayX + distance, (this.width() - this.screenTileX()));
    this._parallaxX = this._displayX;
  }
};

Game_Map.prototype.scrollUp = function(distance){
  if(this.isLoopVertical()){
    this._tDisplayY += $dataMap.height - distance;
    this._tDisplayY %= $dataMap.height;
    if(this._parallaxLoopY){
      this._parallaxY  -= distance;
    }
  } else if (this.height() >= this.screenTileY()) {
    var lastY = this._tDisplayY;
    this._tDisplayY = Math.max(this._tDisplayY - distance, 0);
    this._parallaxY = this._displayY;
  }
};

Game_Map.prototype.updateScroll = function(){
  if(this._displayX != this._tDisplayX) {
    var xSpeed = Math.abs(this._displayX - this._tDisplayX) / this._Divider;
    if(this._displayX > this._tDisplayX) {
      this._displayX = Math.max(this._displayX - xSpeed, this._tDisplayX);
    } else if (this._displayX < this._tDisplayX) {
      this._displayX = Math.min(this._displayX + xSpeed, this._tDisplayX);
    }
    this._parallaxX = this._displayX;
  }
  if(this._displayY != this._tDisplayY){
    var ySpeed = Math.abs(this._displayY - this._tDisplayY) / this._Divider;
    if(this._displayY > this._tDisplayY) {
      this._displayY = Math.max(this._displayY - ySpeed, this._tDisplayY);
    } else if (this._displayY < this._tDisplayY) {
      this._displayY = Math.min(this._displayY + ySpeed, this._tDisplayY);
    }
    this._parallaxY = this._displayY;
  }
  if(this.isScrolling()) {
    var lastX = this._tDisplayX;
    var lastY = this._tDisplayY;
    // code from Quasi coding
    if (this._scrollDirection.constructor === Array) {
      this.doQuasiScroll(this._scrollDirection[0], this._scrollDirection[1], this.scrollDistanceX(), this.scrollDistanceY());
    } else {
      this.doScroll(this._scrollDirection, this.scrollDistance());
    }

    if(this._tDisplayX === lastX && this._tDisplayY === lastY) {
      this._scrollRest = 0;
    } else {
      this._scrollRest -= this.scrollDistance();
    }
  }
};

Alone.Alias.A02 = Game_Map.prototype.scrollDistance;
Game_Map.prototype.scrollDistance = function() {
  if (this._scrollFrames) {
    return Math.abs(this._scrollDistance / this._scrollSpeed);
  }
  return Alone.Alias.A02.call(this);
}

Game_Map.prototype.scrollDistanceX = function() {
  if (this._scrollFrames) {
    return Math.abs((this._scrollDistance * Math.cos(this._scrollRad)) / this._scrollSpeed);
  }
  return Math.abs(this.scrollDistance() * Math.cos(this._scrollRad));
};

Game_Map.prototype.scrollDistanceY = function() {
  if (this._scrollFrames) {
    return Math.abs((this._scrollDistance * Math.sin(this._scrollRad)) / this._scrollSpeed);
  }
  return Math.abs(this.scrollDistance() * Math.sin(this._scrollRad));
};

Game_Map.prototype.doQuasiScroll = function(directionX, directionY, distanceX, distanceY) {
  if (directionX === 4) {
    this.scrollLeft(distanceX);
  } else if (directionX === 6) {
    this.scrollRight(distanceX);
  }
  if (directionY === 2) {
    this.scrollDown(distanceY);
  } else if (directionY === 8) {
    this.scrollUp(distanceY);
  }
};

Game_Map.prototype.startQuasiScroll = function(distanceX, distanceY, speed, frames) {
  if (!this.isLoopHorizontal()) {
    if (this._tDisplayX + distanceX < 0) {
      distanceX = -this._tDisplayX;
    }
    if (this._tDisplayX + distanceX > this.width() - this.screenTileX()) {
      distanceX = this.width() - this.screenTileX() - this._tDisplayX;
    }
  }
  if (!this.isLoopVertical()) {
    if (this._tDisplayY + distanceY < 0) {
      distanceY = -this._tDisplayY;
    }
    if (this._tDisplayY + distanceY > this.height() - this.screenTileY()) {
      distanceY = this.height() - this.screenTileY() - this._tDisplayY;
    }
  }
  var directionX = distanceX > 0 ? 6 : distanceX < 0 ? 4 : 0;
  var directionY = distanceY > 0 ? 2 : distanceY < 0 ? 8 : 0;
  this._scrollDirection = [directionX, directionY];
  this._scrollRest      = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
  this._scrollDistance  = this._scrollRest;
  this._scrollSpeed     = speed;
  this._scrollFrames    = frames;
  this._scrollRad       = Math.atan2(-distanceY, distanceX);
};

Game_Map.prototype.scrollTowards = function(chara, speed, frames) {
  var chara = chara === 0 ? $gamePlayer : $gameMap.event(chara);
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
  var distanceX = (chara.x + 0.5) - centerX;
  var distanceY = (chara.y + 0.5) - centerY;
  this.startQuasiScroll(distanceX, distanceY, speed || 4, frames);
};

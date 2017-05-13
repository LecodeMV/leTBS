/*
#=============================================================================
# Turn Order Visual for Lecode's TBS
# LeTBSTurnOrderA.js
# By Lecode
# Version A - 1.3
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.2 : The visual is correctly updated when en entity is revived
# - 1.3 : The tag sprite_name is correctly taken into account
#=============================================================================
*/
var Lecode = Lecode || {};
if (!Lecode.S_TBS)
	throw new Error("LeTBSTurnOrder must be below LeTBS");
/*:
 * @plugindesc Version A Turn Order for LeTBS
 * @author Lecode
 * @version 1.3
 *
 * @help
 * ...
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS');

Lecode.S_TBS.turnOrderPos = "right";
Lecode.S_TBS.turnOrderRightMargin = 20;
Lecode.S_TBS.turnOrderLeftMargin = 20;
Lecode.S_TBS.turnOrderTopMargin = 10;
Lecode.S_TBS.turnOrderBottomMargin = 20;
Lecode.S_TBS.turnOrderSize = 40;
Lecode.S_TBS.turnOrderSpace = 6;
Lecode.S_TBS.turnOrderSpeed = 12;

/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
TBSTurnOrderVisual.prototype.initialize = function (layer) {
	this._mainLayer = layer;
	this._order = [];
	this._turnOrder = [];
	this._activeIndex = 0;
	this.createVisualLayer();
	this.loadBorderBitmaps();
};

TBSTurnOrderVisual.prototype.Turn = function (entity) {
	this.entity = entity;
	this.mainSprite = null;
	this.borderSprite = null;
	this.miniatureSprite = null;
};

TBSTurnOrderVisual.prototype.createVisualLayer = function () {
	this._layer = new Sprite();
	this._mainLayer.addChild(this._layer);
};

TBSTurnOrderVisual.prototype.loadBorderBitmaps = function () {
	this._borderOn = ImageManager.loadLeTBSTurnOrder("TurnOrder__On");
	this._borderAlly = ImageManager.loadLeTBSTurnOrder("TurnOrder__Actor");
	this._borderEnemy = ImageManager.loadLeTBSTurnOrder("TurnOrder__Enemy");
};

TBSTurnOrderVisual.prototype.set = function (order) {
	this._turnOrder = [];
	for (var i = 0; i < order.length; i++) {
		var entity = order[i];
		this._turnOrder.push(new this.Turn(entity));
	}
	this._order = order;
	this._activeIndex = 0;
	this.makeSprites();
	this.setPositions();
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.update = function () {

};

TBSTurnOrderVisual.prototype.updateOnNextTurn = function (newOrder, index) {
	if (this._order !== newOrder)
		this.set(newOrder);
	this._activeIndex = index;
	this.setPositions();
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.updateOnEntityDeath = function (newOrder, index) {
	/*this.set(newOrder);
	this._activeIndex = index;
	this.setPositions();*/
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.updateOnEntityRevive = function (newOrder, index) {
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.makeSprites = function () {
	var size = Lecode.S_TBS.turnOrderSize;
	while (this._layer.children.length > 0)
		this._layer.removeChildAt(0);
	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		if (turn.mainSprite) {
			while (turn.mainSprite.children.length > 0)
				turn.mainSprite.removeChildAt(0);
			turn.mainSprite = null;
		}

		var entity = turn.entity;
		var main = new Sprite(new Bitmap(size, size));
		var border = new Sprite();
		var bitmap = this.getSpriteBitmap(entity);
		var miniature = new Sprite(bitmap);
		main.addChild(miniature);
		main.addChild(border);
		turn.mainSprite = main;
		turn.borderSprite = border;
		turn.miniatureSprite = miniature;
		this._layer.addChild(turn.mainSprite);
	}
};

TBSTurnOrderVisual.prototype.getSpriteBitmap = function (entity) {
	return ImageManager.loadLeTBSTurnOrder(entity.filenameID());
};

TBSTurnOrderVisual.prototype.setPositions = function () {
	var pos = Lecode.S_TBS.turnOrderPos;
	var rightMargin = Lecode.S_TBS.turnOrderRightMargin;
	var leftMargin = Lecode.S_TBS.turnOrderLeftMargin;
	var topMargin = Lecode.S_TBS.turnOrderTopMargin;
	var bottomMargin = Lecode.S_TBS.turnOrderBottomMargin;
	var size = Lecode.S_TBS.turnOrderSize;
	var space = Lecode.S_TBS.turnOrderSpace;
	var sx, sy, dx, dy, shiftX, shiftY;
	switch (pos) {
		case "right":
			sx = Graphics.width - rightMargin - size;
			sy = topMargin;
			shiftX = 0;
			shiftY = size + space;
	}

	for (var i = 0; i < this._turnOrder.length; i++) {
		var sprite = this._turnOrder[i].mainSprite;
		sprite.x = sx + shiftX * i;
		sprite.y = sy + shiftY * i;
	}
};

TBSTurnOrderVisual.prototype.updateOrderState = function () {
	if (this._turnOrder.length === 0) return;
	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		turn.borderSprite._leU_loopFlash = false;
		turn.borderSprite.leU_clearFlash();
		if (turn.entity._battler.isActor())
			turn.borderSprite.bitmap = this._borderAlly;
		else
			turn.borderSprite.bitmap = this._borderEnemy;
		if (turn.entity._dead) {
			turn.miniatureSprite.setBlendColor([0, 0, 0, 255]);
			turn.borderSprite.setBlendColor([0, 0, 0, 255]);
			turn.mainSprite.setBlendColor([0, 0, 0, 255]);
			turn.mainSprite.opacity = 100;
		} else {
			turn.miniatureSprite.setBlendColor([255, 255, 255, 255]);
			turn.borderSprite.setBlendColor([255, 255, 255, 255]);
			turn.mainSprite.setBlendColor([255, 255, 255, 255]);
			turn.mainSprite.opacity = 255;
		}
	}

	var index = this._activeIndex;
	var sprite = this._turnOrder[index].mainSprite;
	var border = this._turnOrder[index].borderSprite;
	var size = Lecode.S_TBS.turnOrderSize;
	border.bitmap = this._borderOn;
	sprite.x -= size / 2;
	border._leU_loopFlash = true;
	border._leU_loopFlashData = {
		color: [255, 255, 255, 255],
		duration: 20
	};
};


/*-------------------------------------------------------------------------
* ImageManager
-------------------------------------------------------------------------*/
ImageManager.loadLeTBSTurnOrder = function (filename, hue) {
    return this.loadBitmap('img/leTBS/TurnOrder/', filename, hue, true);
};
/*
#=============================================================================
# Turn Order Visual for Lecode's TBS
# LeTBSTurnOrderA.js
# By Lecode
# Version A - 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# Same terms as the main plugin
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Lecode = Lecode || {};
if(!Lecode.S_TBS)
	throw new Error("LeTBSTurnOrder must be below LeTBS");
/*:
 * @plugindesc Version A Turn Order for Lecodes'TBS
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
TBSTurnOrderVisual.prototype.initialize = function(layer) {
	this._layer = layer;
	this._order = [];
	this._turnOrder = [];
	this._activeIndex = 0;
	this.loadBorderBitmaps();
};

TBSTurnOrderVisual.prototype.Turn = function(entity) {
	this.entity = entity;
	this.mainSprite = null;
	this.borderSprite = null;
	this.miniatureSprite = null;
};

TBSTurnOrderVisual.prototype.loadBorderBitmaps = function() {
	this._borderOn = ImageManager.loadLeTBSTurnOrder("TurnOrder__On");
	this._borderAlly = ImageManager.loadLeTBSTurnOrder("TurnOrder__Ally");
	this._borderEnemy = ImageManager.loadLeTBSTurnOrder("TurnOrder__Enemy");
};

TBSTurnOrderVisual.prototype.set = function(order) {
	this._turnOrder = [];
	for (var i = 0; i < order.length; i++) {
		var entity = order[i];
		this._turnOrder.push(new this.Turn(entity));
	};
	this._order = order;
	this._activeIndex = 0;
	this.makeSprites();
	this.setPositions();
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.update = function() {
	
};

TBSTurnOrderVisual.prototype.updateOnNextTurn = function(newOrder,index) {
	if(this._order !== newOrder)
		this.set(newOrder);
	this._activeIndex = index;
	this.setPositions();
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.updateOnEntityDeath = function(newOrder,index) {
	/*this.set(newOrder);
	this._activeIndex = index;
	this.setPositions();*/
	this.updateOrderState();
};

TBSTurnOrderVisual.prototype.makeSprites = function() {
	var size = Lecode.S_TBS.turnOrderSize;
	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		if (turn.mainSprite) {
			turn.mainSprite.removeChildAt(0);
			turn.mainSprite.removeChildAt(0);
			this._layer.removeChild(turn.mainSprite);
		}

		var battler = turn.entity._battler;
		var main = new Sprite(new Bitmap(size, size));
		var border = new Sprite();
		var bitmap;
		if(battler.isActor())
			bitmap = ImageManager.loadLeTBSTurnOrder("TurnOrder_" + battler.name());
		else 
			bitmap = ImageManager.loadLeTBSTurnOrder("TurnOrder_" + battler.originalName());
		var miniature = new Sprite(bitmap);
		main.addChild(miniature);
		main.addChild(border);
		turn.mainSprite = main;
		turn.borderSprite = border;
		turn.miniatureSprite = miniature;
		this._layer.addChild(turn.mainSprite);
	}
};

TBSTurnOrderVisual.prototype.setPositions = function() {
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

TBSTurnOrderVisual.prototype.updateOrderState = function() {
	if (this._turnOrder.length === 0) return;
	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		turn.borderSprite._leU_loopFlash = false;
		turn.borderSprite.leU_clearFlash();
		if (turn.entity._battler.isActor())
			turn.borderSprite.bitmap = this._borderAlly;
		else
			turn.borderSprite.bitmap = this._borderEnemy;
		if(turn.entity._dead) {
			turn.miniatureSprite.setBlendColor([0,0,0,255]);
			turn.borderSprite.setBlendColor([0,0,0,255]);
			turn.mainSprite.setBlendColor([0,0,0,255]);
			turn.mainSprite.opacity = 100;
		}
	}

	var index = this._activeIndex;
	var sprite = this._turnOrder[index].mainSprite;
	var border = this._turnOrder[index].borderSprite;
	var size = Lecode.S_TBS.turnOrderSize;
	border.bitmap = this._borderOn;
	sprite.x -= size/2;
	border._leU_loopFlash = true;
	border._leU_loopFlashData = {
		color: [255, 255, 255, 255],
		duration: 20
	};
};



/*
TBSTurnOrderVisual.prototype.initialize = function(layer) {
	this._layer = layer;
	this._turnOrder = [];
	this._sprites = [];
	this._phase = "";
	this.loadBorderBitmaps();
};

TBSTurnOrderVisual.prototype.loadBorderBitmaps = function() {
	this._borderOn = ImageManager.loadLeTBSTurnOrder("TurnOrder__On");
	this._borderAlly = ImageManager.loadLeTBSTurnOrder("TurnOrder__Ally");
	this._borderEnemy = ImageManager.loadLeTBSTurnOrder("TurnOrder__Enemy");
};

TBSTurnOrderVisual.prototype.set = function(order) {
	this._turnOrder = order.filter(function(entity){
		return !entity._dead;
	});
	this._phase = "init";
	this.makeSprites();
};

TBSTurnOrderVisual.prototype.makeSprites = function() {
	var size = Lecode.S_TBS.turnOrderSize;

	this._sprites.forEach(function(sprite) {
		this._layer.removeChild(sprite);
	}.bind(this));
	this._sprites = [];

	this._turnOrder.forEach(function(entity) {
		var battler = entity._battler;
		var main = new Sprite(new Bitmap(size, size));
		var border = new Sprite();
		var bitmap;
		if(battler.isActor())
			bitmap = ImageManager.loadLeTBSTurnOrder("TurnOrder_" + battler.name());
		else 
			bitmap = ImageManager.loadLeTBSTurnOrder("TurnOrder_" + battler.originalName());
		var miniature = new Sprite(bitmap);
		main.addChild(miniature);
		main.addChild(border);
		main._tbsBorder = border;
		main._tbsMiniature = miniature;
		this._sprites.push(main);
		this._layer.addChild(main);
	}.bind(this));
	this.updateOrderState();
	this.setStartAndDestPositions();
};

TBSTurnOrderVisual.prototype.updateOrderState = function() {
	if (this._turnOrder.length == 0) return;
	this._sprites[0]._tbsBorder.bitmap = this._borderOn;
	for (var i = 1; i < this._turnOrder.length; i++) {
		if (this._turnOrder[i]._battler.isActor())
			this._sprites[i]._tbsBorder.bitmap = this._borderAlly;
		else
			this._sprites[i]._tbsBorder.bitmap = this._borderEnemy;
	}
};

TBSTurnOrderVisual.prototype.setStartAndDestPositions = function() {
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
			sy = Graphics.height + size;
			dx = sx;
			dy = topMargin;
			shiftX = 0;
			shiftY = size + space;
	}
	for (var i = 0; i < this._sprites.length; i++) {
		var sprite = this._sprites[i];
		sprite.x = sx + shiftX * i;
		sprite.y = sy + shiftY * i;
		sprite._tbsDestX = dx + shiftX * i;
		sprite._tbsDestY = dy + shiftY * i;
	}
};

TBSTurnOrderVisual.prototype.updatePositions = function() {
	var speed = Lecode.S_TBS.turnOrderSpeed;
	this._sprites.forEach(function(sprite) {
		sprite.leU_move(speed, sprite._tbsDestX, sprite._tbsDestY);
	}.bind(this));
};

TBSTurnOrderVisual.prototype.updatePhase = function() {
	if (this._phase == "init") {
		var sprite = this._sprites[0];
		if (sprite.x == sprite._tbsDestX && sprite.y == sprite._tbsDestY) {
			this.showActiveSprite(sprite);
			this._phase = "idle";
		}
	} else if (this._phase == "new_turn") {
		var sprite = this._sprites.leU_last();
		if (sprite.x == sprite._tbsDestX && sprite.y == sprite._tbsDestY) {
			this.hideOldActiveSprite(sprite);
			this._phase = "init";
		}
	}
};

TBSTurnOrderVisual.prototype.checkDeath = function() {
	return;
	for(var i = 0; i < this._turnOrder.length; i++) {
		var entity = this._turnOrder[i];
		var sprite = this._sprites[i];
		if ( entity._dead ) {
			sprite._tbsMiniature.setBlendColor([255,255,255,0]);
			sprite._tbsBorder.setBlendColor([255,255,255,0]);
		} else {
			sprite._tbsMiniature.setBlendColor([0,0,0,0]);
			sprite._tbsBorder.setBlendColor([0,0,0,0]);
		}
	}
};

TBSTurnOrderVisual.prototype.showActiveSprite = function(sprite) {
	var pos = Lecode.S_TBS.turnOrderPos;
	var size = Lecode.S_TBS.turnOrderSize;
	var x = 0,
		y = 0;
	switch (pos) {
		case "right":
			x = -size / 2;
			break;
	}
	sprite._tbsDestX += x;
	sprite._tbsDestY += y;
	sprite._tbsBorder._leU_loopFlash = true;
	sprite._tbsBorder._leU_loopFlashData = {
		color: [255, 255, 255, 255],
		duration: 20
	};
};

TBSTurnOrderVisual.prototype.updateNextTurn = function() {
	var sprite = this._sprites.shift();
	sprite._tbsBorder._leU_loopFlash = false;
	this._sprites.push(sprite);
	this._turnOrder.push(this._turnOrder.shift());
	this.updateOrderState();
	this._phase = "new_turn";
	this.setPositionsForNewTurn();
};

TBSTurnOrderVisual.prototype.setPositionsForNewTurn = function() {
	var last = this._sprites.leU_last();
	var pos = Lecode.S_TBS.turnOrderPos;
	var size = Lecode.S_TBS.turnOrderSize;
	var space = Lecode.S_TBS.turnOrderSpace;

	switch (pos) {
		case "right":
			last._tbsDestY = this._sprites[this._sprites.length - 2]._tbsDestY;
			break;
	}

	for (var i = 0; i < this._sprites.length - 1; i++) {
		switch (pos) {
			case "right":
				this._sprites[i]._tbsDestY -= (size + space);
				break;
		}
	}
};

TBSTurnOrderVisual.prototype.hideOldActiveSprite = function(sprite) {
	var pos = Lecode.S_TBS.turnOrderPos;
	var size = Lecode.S_TBS.turnOrderSize;
	var x = 0,
		y = 0;
	switch (pos) {
		case "right":
			x = size / 2;
			break;
	}
	sprite._tbsDestX += x;
	sprite._tbsDestY += y;
};

TBSTurnOrderVisual.prototype.update = function() {
	this.checkDeath();
	this.updatePositions();
	this.updatePhase();
};
*/
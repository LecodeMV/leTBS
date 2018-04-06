/*
#=============================================================================
# Turn Order Visual for Lecode's TBS
# LeTBSTurnOrderA.js
# By Lecode
# Version A - 1.5
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
# - 1.4 : Added turn numbers
#		  Improved the hud
#		  Added parameters
# - 1.5 : Support entities filename change
#=============================================================================
*/
var Lecode = Lecode || {};
if (!Lecode.S_TBS)
	throw new Error("LeTBSTurnOrder must be below LeTBS");
Lecode.S_TBS.TurnOrderVisual = {};
/*:
 * @plugindesc Version A Turn Order for LeTBS
 * @author Lecode
 * @version 1.5
 *
 * @param Visible
 * @desc [No description]
 * @default true
 *
 * @param -- HUD --
 * @desc [No description]
 * @default 
 *
 * @param Pos
 * @desc [No description]
 * @default top
 *
 * @param Right Margin
 * @desc [No description]
 * @default 20
 *
 * @param Left Margin
 * @desc [No description]
 * @default 20
 *
 * @param Top Margin
 * @desc [No description]
 * @default 10
 *
 * @param Bottom Margin
 * @desc [No description]
 * @default 20
 *
 * @param Size
 * @desc [No description]
 * @default 40
 *
 * @param Space
 * @desc [No description]
 * @default 6
 *
 * @param -- Numbers --
 * @desc [No description]
 * @default 
 *
 * @param Show Numbers ?
 * @desc [No description]
 * @default true
 *
 * @param Numbers Font Size
 * @desc [No description]
 * @default 18
 *
 * @param Numbers Color
 * @desc [No description]
 * @default #FFFFFF
 *
 * @param Next Turn Color
 * @desc [No description]
 * @default #31B404
 *
 * @param Numbers Flash
 * @desc [red, green, blue, grey]
 * @default [255, 0, 0, 255]
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin displays the battle turn order on the screen.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently. A LOT of features are missing.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBSTurnOrderA');

Lecode.S_TBS.TurnOrderVisual.visible = String(parameters["Visible"] || 'true') === 'true';
// Divider: -- HUD --
Lecode.S_TBS.TurnOrderVisual.pos = String(parameters["Pos"] || "top");
Lecode.S_TBS.TurnOrderVisual.rightMargin = Number(parameters["Right Margin"] || 20);
Lecode.S_TBS.TurnOrderVisual.leftMargin = Number(parameters["Left Margin"] || 20);
Lecode.S_TBS.TurnOrderVisual.topMargin = Number(parameters["Top Margin"] || 10);
Lecode.S_TBS.TurnOrderVisual.bottomMargin = Number(parameters["Bottom Margin"] || 20);
Lecode.S_TBS.TurnOrderVisual.size = Number(parameters["Size"] || 40);
Lecode.S_TBS.TurnOrderVisual.space = Number(parameters["Space"] || 6);
// Divider: -- Numbers --
Lecode.S_TBS.TurnOrderVisual.numbersVisible = String(parameters["Show Numbers ?"] || 'true') === 'true';	//	(Show Numbers ?): 
Lecode.S_TBS.TurnOrderVisual.numbersFontSize = Number(parameters["Numbers Font Size"] || 18);
Lecode.S_TBS.TurnOrderVisual.numbersColor = String(parameters["Numbers Color"] || "#FFFFFF");
Lecode.S_TBS.TurnOrderVisual.nextTurnColor = String(parameters["Next Turn Color"] || "#31B404");
Lecode.S_TBS.TurnOrderVisual.numbersFlash = String(parameters["Numbers Flash"] || "[255, 0, 0, 255]");	//	(): [red, green, blue, grey]


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
	this._layer.visible = Lecode.S_TBS.TurnOrderVisual.visible;
	this._mainLayer.addChild(this._layer);
};

TBSTurnOrderVisual.prototype.loadBorderBitmaps = function () {
	this._borderOn = ImageManager.loadLeTBSTurnOrder("Turn_On");
	this._borderAlly = ImageManager.loadLeTBSTurnOrder("Turn_Actor");
	this._borderEnemy = ImageManager.loadLeTBSTurnOrder("Turn_Enemy");
};

TBSTurnOrderVisual.prototype.set = function (order, index) {
	this._turnOrder = [];
	for (var i = 0; i < order.length; i++) {
		var entity = order[i];
		this._turnOrder.push(new this.Turn(entity));
	}
	this._order = order;
	this._activeIndex = index || 0;
	this.refresh();
};

TBSTurnOrderVisual.prototype.update = function () {

};

TBSTurnOrderVisual.prototype.updateOnNextTurn = function (newOrder, index) {
	if (this._order !== newOrder)
		this.set(newOrder);
	this._activeIndex = index;
	this.setPositions();
	this.updateOrderState();
	this.updateTurnNumbers();
};

TBSTurnOrderVisual.prototype.updateOnEntityDeath = function (newOrder, index) {
	this.updateOrderState();
	this.updateTurnNumbers();
};

TBSTurnOrderVisual.prototype.updateOnEntityRevive = function (newOrder, index) {
	this.updateOrderState();
	this.updateTurnNumbers();
};

TBSTurnOrderVisual.prototype.updateOnEntityHide = function (newOrder, index) {
    this.refresh();
};

TBSTurnOrderVisual.prototype.updateOnEntityShow = function (newOrder, index) {
    this.refresh();
};

TBSTurnOrderVisual.prototype.refresh = function () {
	this.makeSprites();
	this.setPositions();
	this.updateOrderState();
	this.updateTurnNumbers();
};

TBSTurnOrderVisual.prototype.updateTurnNumbers = function () {
	if(!Lecode.S_TBS.TurnOrderVisual.numbersVisible) return;
	for (var i = 0; i < this._order.length; i++) {
		var entity = this._order[i];
		if (entity.battler().isDead() || entity.isTurnHidden()) {
			continue;
		}
		var index = i - this._activeIndex;
		if (index < 0)
			index = this._order.length + index;
		entity._turnIndex.refresh(index);
		entity._turnIndex.show();
	}
};

TBSTurnOrderVisual.prototype.makeSprites = function () {
	var size = Lecode.S_TBS.TurnOrderVisual.size;
	while (this._layer.children.length > 0)
		this._layer.removeChildAt(0);

	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		var entity = turn.entity;
		if (entity.isTurnHidden()) continue;
		if (turn.mainSprite) {
			while (turn.mainSprite.children.length > 0)
				turn.mainSprite.removeChildAt(0);
			turn.mainSprite = null;
		}
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
	var pos = Lecode.S_TBS.TurnOrderVisual.pos;
	var rightMargin = Lecode.S_TBS.TurnOrderVisual.rightMargin;
	var leftMargin = Lecode.S_TBS.TurnOrderVisual.leftMargin;
	var topMargin = Lecode.S_TBS.TurnOrderVisual.topMargin;
	var bottomMargin = Lecode.S_TBS.TurnOrderVisual.bottomMargin;
	var size = Lecode.S_TBS.TurnOrderVisual.size;
	var space = Lecode.S_TBS.TurnOrderVisual.space;
	var sx, sy, dx, dy, shiftX, shiftY;
	switch (pos) {
		case "right":
			sx = Graphics.width - rightMargin - size;
			sy = topMargin;
			shiftX = 0;
			shiftY = size + space;
			break;
		case "left":
			sx = rightMargin;
			sy = topMargin;
			shiftX = 0;
			shiftY = size + space;
			break;
		case "top":
			sx = rightMargin;
			sy = topMargin;
			shiftX = size + space;
			shiftY = 0;
			break;
		case "bottom":
			sx = rightMargin;
			sy = Graphics.height - bottomMargin;
			shiftX = size + space;
			shiftY = 0;
			break;
	}
	var counterI = 0;
	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		var entity = turn.entity;
		if (entity.isTurnHidden()) {
			counterI++;
			continue;
		}
		var sprite = turn.mainSprite;
		sprite.x = sx + shiftX * (i - counterI);
		sprite.y = sy + shiftY * (i - counterI);
	}
};

TBSTurnOrderVisual.prototype.updateActivePosition = function (sprite) {
	var pos = Lecode.S_TBS.TurnOrderVisual.pos;
	var size = Lecode.S_TBS.TurnOrderVisual.size;
	switch(pos) {
		case "right":
			sprite.x -= size / 2;
			break;
		case "left":
			sprite.x += size / 2;
			break;
		case "top":
			sprite.y += size / 2;
			break;
		case "bottom":
			sprite.y -= size / 2;
			break;
	}
};

TBSTurnOrderVisual.prototype.updateOrderState = function () {
	if (this._turnOrder.length === 0) return;
	for (var i = 0; i < this._turnOrder.length; i++) {
		var turn = this._turnOrder[i];
		var entity = turn.entity;
		if (entity.isTurnHidden()) continue;
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
		setTimeout(function (turn) {
			turn.borderSprite.leU_startFlash([255, 255, 255, 255], 20);
		}.bind(this, turn), 150 * i);
	}

	var index = this._activeIndex;
	var sprite = this._turnOrder[index].mainSprite;
	var border = this._turnOrder[index].borderSprite;
	var size = Lecode.S_TBS.TurnOrderVisual.size;
	border.bitmap = this._borderOn;
	this.updateActivePosition(sprite);
	border._leU_loopFlash = true;
	border._leU_loopFlashData = {
		color: [255, 255, 255, 255],
		duration: 20
	};
};

TBSTurnOrderVisual.prototype.getEntityIndex = function (entity) {
	for (var i = 0; i < this._turnOrder.length; i++) {
		var data = this._turnOrder[i];
		if (entity === data.entity)
			return i;
	}
	return -1;
};

TBSTurnOrderVisual.prototype.hide = function () {
	for (var i = 0; i < this._turnOrder.length; i++) {
		this._turnOrder[i].mainSprite.visible = false;
		this._turnOrder[i].borderSprite.visible = false;
		this._turnOrder[i].miniatureSprite.visible = false;
	}
};

TBSTurnOrderVisual.prototype.show = function () {
	for (var i = 0; i < this._turnOrder.length; i++) {
		this._turnOrder[i].mainSprite.visible = true;
		this._turnOrder[i].borderSprite.visible = true;
		this._turnOrder[i].miniatureSprite.visible = true;
	}
};


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_createComponents = TBSEntity.prototype.createComponents;
TBSEntity.prototype.createComponents = function () {
	Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_createComponents.call(this);
	this._turnIndex = new Window_TBSEntityTurn(this);
	BattleManagerTBS.getLayer("movableInfo").addChild(this._turnIndex);
};

Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_update = TBSEntity.prototype.update;
TBSEntity.prototype.update = function () {
	Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_update.call(this);
	this._turnIndex.updatePosition();
};

Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_applyFilenameChange = TBSEntity.prototype.applyFilenameChange;
TBSEntity.prototype.applyFilenameChange = function () {
    Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_applyFilenameChange.call(this);
    BattleManagerTBS._turnOrderVisual.refresh();
};

Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_destroy = TBSEntity.prototype.destroy;
TBSEntity.prototype.destroy = function () {
	Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_destroy.call(this);
	this._turnIndex.hide();
};

Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_onDeath = TBSEntity.prototype.onDeath;
TBSEntity.prototype.onDeath = function () {
	Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_onDeath.call(this);
	this._turnIndex.hide();
};

Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_onRevive = TBSEntity.prototype.onRevive;
TBSEntity.prototype.onRevive = function () {
	Lecode.S_TBS.TurnOrderVisual.oldTBSEntity_onRevive.call(this);
	this._turnIndex.show();
};


/*-------------------------------------------------------------------------
* Window_TBSEntityTurn
-------------------------------------------------------------------------*/
function Window_TBSEntityTurn() {
	this.initialize.apply(this, arguments);
}
Window_TBSEntityTurn.prototype = Object.create(Window_Base.prototype);
Window_TBSEntityTurn.prototype.constructor = Window_TBSEntityTurn;

Window_TBSEntityTurn.prototype.initialize = function (entity) {
	this._entity = entity;
	var width = this.windowWidth();
	var height = this.windowHeight();
	Window_Base.prototype.initialize.call(this, 0, 0, width, height);
	this.opacity = 0;
	this.updatePosition();
};

Window_TBSEntityTurn.prototype.windowWidth = function () {
	return 100;
};

Window_TBSEntityTurn.prototype.windowHeight = function () {
	return 100;
};

Window_TBSEntityTurn.prototype.updatePosition = function () {
	var x = this._entity._posX - this.windowWidth() / 2;
	var y = this._entity._posY;
	this.x = x + this._entity.width() / 2;
	this.y = y;
};

Window_TBSEntityTurn.prototype.refresh = function (index) {
	this.refreshText(index);
	this._windowContentsSprite.leU_startFlash(eval(Lecode.S_TBS.TurnOrderVisual.numbersFlash), 20);
};

Window_TBSEntityTurn.prototype.refreshText = function (index) {
	this.contents.clear();
	this.resetFontSettings();
	this.contents.fontSize = Lecode.S_TBS.TurnOrderVisual.numbersFontSize;
	this.contents.textColor = Lecode.S_TBS.TurnOrderVisual.numbersColor;
	if (index === 1)
		this.contents.textColor = Lecode.S_TBS.TurnOrderVisual.nextTurnColor;
	this.leU_drawText(index + 1, 4, 0);
};


/*-------------------------------------------------------------------------
* ImageManager
-------------------------------------------------------------------------*/
ImageManager.loadLeTBSTurnOrder = function (filename, hue) {
	return this.loadBitmap('img/leTBS/TurnOrder/', filename, hue, true);
};
/*
#=============================================================================
# Lecode's Tactical Battle System
# LeTBS.js
# By Lecode
# Version 0.5
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# This plugin and all its add-ons made by Lecode is under the MIT License.
# (http://choosealicense.com/licenses/mit/)
# In addition, you should keep this header.
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 0.0 : Beta started.
# - 0.1 : Battles start and end correctly.
#		  Troop events are correctly triggered in battle. (mostly)
#		  Added an end window which appears when pressing ESC on the command window.
#		  That window allows you to escape and change options.
#		  Added the tags and parameters for one time move only and one time offense only.
#		  Fixed some errors in the demo.
# - 0.2 : The Item command is functional.
#		  Added custom move scopes and options.
#		  Downgraded the turn order visual for now to fix some bugs.
#		  Added a new option for turn order: "fair repartition".
#		  Status window is updated when a target is selected.
#		  There's now a help window. Status window is shifted if needed.
# - 0.3 : The mouse is supported.
#		  Prototype of the projectiles system.
#		  Prototype of the AI.
#		  Fixed a bug and improved the Turn Order Visual Version A.
#		  85% of the tile effects and marks system.
#		  Fixed a bug with the line of sight.
# - 0.4 : Now there is ony one unique tag.
#		  Support custom sprites. (Yay !)
#		  AI improved.
#		  Added AI patterns. They can be used in AI commands.
#		  Now each entity has his own sequence system. This allows simultaneous sequences.
#		  Added some sequence commands.
#		  Now a sequence is played for the following events:
#		  battle start, turn start, victory, death, damaged, healed, buffed, weakened.
# - 0.5 : Projectile system completed
#         Tile, Mark & Aura effects completed
#         Fixed and added some sequence commands
#         Fixed some bugs
#         Created DamagePopupEX
#=============================================================================
*/
var Imported = Imported || {};
Imported["LeTBS"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS = {};
/*:
 * @plugindesc A tactical battle system with awesome features
 * @author Lecode
 * @version 0.5
 *
* @param Ally Color Cell
* @desc Color of actor cells.
* @default #0FC50B
*
* @param Enemy Color Cell
* @desc Color of enemy cells.
* @default #C50B1B
*
* @param Cell Opacity Color
* @desc Opacity of the placement cells.
* @default 175
*
* @param Placed Animation
* @desc Animation ID when a battler is placed.
* @default 124
*
* @param -- Misc --
* @desc ...
* @default 
*
* @param Exploration Input
* @desc Input to trigger exploration.
* @default shift
*
* @param Opacity Input
* @desc Input to change windows' opacity.
* @default control
*
* @param Min Input Opacity
* @desc Minimum opacity of windows.
* @default 0
*
* @param Opacity Steps
* @desc Value of opacity to reduce when inputed.
* @default 10
*
* @param Battle Start Sprite Delay
* @desc Duration of the battle start sprite.
* @default 50
*
* @param Turn Order Fair Repartition ?
* @desc Allow a fair repartition of the turn order ?
* @default true
*
* @param Destination Duration
* @desc Duration of the destination sprite (when a cell is selected).
* @default 60
*
* @param -- Scopes --
* @desc ...
* @default 
*
* @param Scope Cell Width
* @desc Width of cells.
* @default 46
*
* @param Scope Cell Height
* @desc Height of cells. 
* @default 46
*
* @param Obstacle Region Id
* @desc Region ID for obstacles.
* @default 250
*
* @param -- Move Action --
* @desc ...
* @default 
*
* @param Default Move Scope
* @desc Default move scope data.
* @default circle(_mp_)
*
* @param Default Move Points
* @desc Default amount of move points.
* @default 3
*
* @param Move Scope Color
* @desc Color of the move scope.
* @default #0A5C85
*
* @param Move Scope Opacity
* @desc Opacity of the move scope.
* @default 175
*
* @param Invalid Move Scope Opacity
* @desc Opacity of the move scope when cells are invalid.
* @default 60
*
* @param Selected Move Scope Opacity
* @desc Opacity of the move scope when cells are selected.
* @default 255
*
* @param Enable Directional Facing
* @desc Battlers will be allowed to change their direction.
* @default true
*
* @param -- Attack Action --
* @desc ...
* @default 
*
* @param Default Attack Animation
* @desc Default attack animation.
* @default 1
*
* @param Default Attack Sequence
* @desc Default attack sequence.
* @default atk
*
* @param Default Attack Scope
* @desc Default attack scope data.
* @default circle(1)
*
* @param Default Attack Ao E
* @desc Default attack aoe data.
* @default circle(0)
*
* @param Attack Scope Color
* @desc Color of the attack scope.
* @default #DF3A01
*
* @param Attack Scope Opacity
* @desc Opacity of the attack scope.
* @default 175
*
* @param Invalid Attack Scope Opacity
* @desc Opacity of the attack scope when cells are invalid.
* @default 60
*
* @param Selected Attack Scope Opacity
* @desc Opacity of the attack scope when cells are selected.
* @default 255
*
* @param -- Skill Action --
* @desc ...
* @default 
*
* @param Default Skill Sequence
* @desc Default skill sequence.
* @default skill
*
* @param Default Skill Scope
* @desc Default skill scope data.
* @default circle(3)
*
* @param Default Skill Ao E
* @desc Default skill aoe data.
* @default circle(0)
*
* @param Skill Scope Color
* @desc Color of the skill scope.
* @default #DF3A01
*
* @param Skill Scope Opacity
* @desc Opacity of the skill scope.
* @default 175
*
* @param Invalid Skill Scope Opacity
* @desc Opacity of the skill scope when cells are invalid.
* @default 60
*
* @param Selected Skill Scope Opacity
* @desc Opacity of the skill scope when cells are selected.
* @default 255
*
* @param -- Item Action --
* @desc ...
* @default 
*
* @param Default Item Sequence
* @desc Default item sequence.
* @default item
*
* @param Default Item Scope
* @desc Default item scope data.
* @default circle(3)
*
* @param Default Item Ao E
* @desc Default item aoe data.
* @default circle(0)
*
* @param Item Scope Color
* @desc Color of the item scope.
* @default #DF01D7
*
* @param Item Scope Opacity
* @desc Opacity of the item scope.
* @default 175
*
* @param Invalid Item Scope Opacity
* @desc Opacity of the item scope when cells are invalid.
* @default 60
*
* @param Selected Item Scope Opacity
* @desc Opacity of the item scope when cells are selected.
* @default 255
*
* @param -- Directional Damage --
* @desc ...
* @default 
*
* @param Back Directional Damage Effects
* @desc Damage % when a battler is hit on the back.
* @default 15
*
* @param Side Directional Damage Effects
* @desc Damage % when a battler is hit on the sides.
* @default 0
*
* @param Face Directional Damage Effects
* @desc Damage % when a battler is hit on the face.
* @default -10
*
* @param -- Collision Damage --
* @desc ...
* @default 
*
* @param Default Collision Formula
* @desc Formula to evaluate collision damage.
* @default b.mhp * 0.05 * (distance-covered)
*
* @param Collission Damage Chain Rate
* @desc Collision damage chain rate.
* @default 0.3
*
* @param -- Motions --
* @desc ...
* @default 
*
* @param Battlers Move Speed
* @desc Default move speed.
* @default 4
*
* @param Battlers Frame Delay
* @desc Default delay value between sprites frames.
* @default 10
*
* @param -- AI --
* @desc ...
* @default 
*
* @param Default Ai Pattern
* @desc Default AI pattern.
* @default melee_fighter
*
* @param Ai Wait Time
* @desc AI wait time.
* @default 5
*
* @param -- Actions Restrictions --
* @desc ...
* @default 
*
* @param One Time Move
* @desc Enable the one time move feature. (See doc)
* @default false
*
* @param One Time Offense
* @desc Enable the one time offense feature. (See doc)
* @default true
*
* @param Auto Pass
* @desc Enable the auto pass feature. (See doc)
* @default true
*
* @param -- Battle End --
* @desc ...
* @default 
*
* @param Escape Sound
* @desc Sound when the party try to escape.
* @default Buzzer2
*
* @param End Of Battle Wait
* @desc Wait amount before the end of the battle.
* @default 60
*
* @param Collapse Animation
* @desc Default collapse animation.
* @default 136
*
 * @help
 * See the documentation
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS');

Lecode.S_TBS.allyColorCell = String(parameters["Ally Color Cell"] || "#0FC50B");    //  (): Color of actor cells.
Lecode.S_TBS.enemyColorCell = String(parameters["Enemy Color Cell"] || "#C50B1B");  //  (): Color of enemy cells.
Lecode.S_TBS.placementCellOpacity = Number(parameters["Cell Opacity Color"] || 175);    //  (Cell Opacity Color): Opacity of the placement cells.
Lecode.S_TBS.placedBattlerAnim = Number(parameters["Placed Animation"] || 124); //  (Placed Animation): Animation ID when a battler is placed.
// Divider: -- Misc --
Lecode.S_TBS.explorationInput = String(parameters["Exploration Input"] || "shift"); //  (): Input to trigger exploration.
Lecode.S_TBS.opacityInput = String(parameters["Opacity Input"] || "control");   //  (): Input to change windows' opacity.
Lecode.S_TBS.minInputOpacity = Number(parameters["Min Input Opacity"] || 0);    //  (): Minimum opacity of windows.
Lecode.S_TBS.inputOpacityDecreaseSteps = Number(parameters["Opacity Steps"] || 10); //  (Opacity Steps): Value of opacity to reduce when inputed.
Lecode.S_TBS.battleStartSpriteDelay = Number(parameters["Battle Start Sprite Delay"] || 50);    //  (): Duration of the battle start sprite.
Lecode.S_TBS.turnOrderFairRepartition = String(parameters["Turn Order Fair Repartition ?"] || 'true') === 'true';   //  (Turn Order Fair Repartition ?): Allow a fair repartition of the turn order ?
Lecode.S_TBS.destinationDuration = Number(parameters["Destination Duration"] || 60);    //  (): Duration of the destination sprite (when a cell is selected).
// Divider: -- Scopes --
Lecode.S_TBS.scopeCellWidth = Number(parameters["Scope Cell Width"] || 46); //  (): Width of cells.
Lecode.S_TBS.scopeCellHeight = Number(parameters["Scope Cell Height"] || 46);   //  (): Height of cells. 
Lecode.S_TBS.obstacleRegionId = Number(parameters["Obstacle Region Id"] || 250);    //  (): Region ID for obstacles.
// Divider: -- Move Action --
Lecode.S_TBS.defaultMoveScope = String(parameters["Default Move Scope"] || "circle(_mp_)"); //  (): Default move scope data.
Lecode.S_TBS.defaultMovePoints = Number(parameters["Default Move Points"] || 3);    //  (): Default amount of move points.
Lecode.S_TBS.moveColorCell = String(parameters["Move Scope Color"] || "#0A5C85");   //  (Move Scope Color): Color of the move scope.
Lecode.S_TBS.moveCellOpacity = Number(parameters["Move Scope Opacity"] || 175); //  (Move Scope Opacity): Opacity of the move scope.
Lecode.S_TBS.moveInvalidCellOpacity = Number(parameters["Invalid Move Scope Opacity"] || 60);   //  (Invalid Move Scope Opacity): Opacity of the move scope when cells are invalid.
Lecode.S_TBS.moveSelectedCellOpacity = Number(parameters["Selected Move Scope Opacity"] || 255);    //  (Selected Move Scope Opacity): Opacity of the move scope when cells are selected.
Lecode.S_TBS.enableDirectionalFacing = String(parameters["Enable Directional Facing"] || 'true') === 'true';    //  (): Battlers will be allowed to change their direction.
// Divider: -- Attack Action --
Lecode.S_TBS.defaultAttackAnimation = Number(parameters["Default Attack Animation"] || 1);  //  (): Default attack animation.
Lecode.S_TBS.defaultAttackSequence = String(parameters["Default Attack Sequence"] || "atk");    //  (): Default attack sequence.
Lecode.S_TBS.defaultAttackScope = String(parameters["Default Attack Scope"] || "circle(1)");    //  (): Default attack scope data.
Lecode.S_TBS.defaultAttackAoE = String(parameters["Default Attack Ao E"] || "circle(0)");   //  (): Default attack aoe data.
Lecode.S_TBS.attackColorCell = String(parameters["Attack Scope Color"] || "#DF3A01");   //  (Attack Scope Color): Color of the attack scope.
Lecode.S_TBS.attackCellOpacity = Number(parameters["Attack Scope Opacity"] || 175); //  (Attack Scope Opacity): Opacity of the attack scope.
Lecode.S_TBS.attackInvalidCellOpacity = Number(parameters["Invalid Attack Scope Opacity"] || 60);   //  (Invalid Attack Scope Opacity): Opacity of the attack scope when cells are invalid.
Lecode.S_TBS.attackSelectedCellOpacity = Number(parameters["Selected Attack Scope Opacity"] || 255);    //  (Selected Attack Scope Opacity): Opacity of the attack scope when cells are selected.
// Divider: -- Skill Action --
Lecode.S_TBS.defaultSkillSequence = String(parameters["Default Skill Sequence"] || "skill");    //  (): Default skill sequence.
Lecode.S_TBS.defaultSkillScope = String(parameters["Default Skill Scope"] || "circle(3)");  //  (): Default skill scope data.
Lecode.S_TBS.defaultSkillAoE = String(parameters["Default Skill Ao E"] || "circle(0)"); //  (): Default skill aoe data.
Lecode.S_TBS.skillColorCell = String(parameters["Skill Scope Color"] || "#DF3A01"); //  (Skill Scope Color): Color of the skill scope.
Lecode.S_TBS.skillCellOpacity = Number(parameters["Skill Scope Opacity"] || 175);   //  (Skill Scope Opacity): Opacity of the skill scope.
Lecode.S_TBS.skillInvalidCellOpacity = Number(parameters["Invalid Skill Scope Opacity"] || 60); //  (Invalid Skill Scope Opacity): Opacity of the skill scope when cells are invalid.
Lecode.S_TBS.skillSelectedCellOpacity = Number(parameters["Selected Skill Scope Opacity"] || 255);  //  (Selected Skill Scope Opacity): Opacity of the skill scope when cells are selected.
// Divider: -- Item Action --
Lecode.S_TBS.defaultItemSequence = String(parameters["Default Item Sequence"] || "item");   //  (): Default item sequence.
Lecode.S_TBS.defaultItemScope = String(parameters["Default Item Scope"] || "circle(3)");    //  (): Default item scope data.
Lecode.S_TBS.defaultItemAoE = String(parameters["Default Item Ao E"] || "circle(0)");   //  (): Default item aoe data.
Lecode.S_TBS.ItemColorCell = String(parameters["Item Scope Color"] || "#DF01D7");   //  (Item Scope Color): Color of the item scope.
Lecode.S_TBS.ItemCellOpacity = Number(parameters["Item Scope Opacity"] || 175); //  (Item Scope Opacity): Opacity of the item scope.
Lecode.S_TBS.ItemInvalidCellOpacity = Number(parameters["Invalid Item Scope Opacity"] || 60);   //  (Invalid Item Scope Opacity): Opacity of the item scope when cells are invalid.
Lecode.S_TBS.ItemSelectedCellOpacity = Number(parameters["Selected Item Scope Opacity"] || 255);    //  (Selected Item Scope Opacity): Opacity of the item scope when cells are selected.
// Divider: -- Directional Damage --
Lecode.S_TBS.backDirectionalDamageEffects = Number(parameters["Back Directional Damage Effects"] || 15);    //  (): Damage % when a battler is hit on the back.
Lecode.S_TBS.sideDirectionalDamageEffects = Number(parameters["Side Directional Damage Effects"] || 0); //  (): Damage % when a battler is hit on the sides.
Lecode.S_TBS.faceDirectionalDamageEffects = Number(parameters["Face Directional Damage Effects"] || -10);   //  (): Damage % when a battler is hit on the face.
// Divider: -- Collision Damage --
Lecode.S_TBS.defaultCollisionFormula = String(parameters["Default Collision Formula"] || "b.mhp * 0.05 * (distance-covered)");  //  (): Formula to evaluate collision damage.
Lecode.S_TBS.collissionDamageChainRate = Number(parameters["Collission Damage Chain Rate"] || 0.3); //  (): Collision damage chain rate.
// Divider: -- Motions --
Lecode.S_TBS.battlersMoveSpeed = Number(parameters["Battlers Move Speed"] || 4);    //  (): Default move speed.
Lecode.S_TBS.battlersFrameDelay = Number(parameters["Battlers Frame Delay"] || 10); //  (): Default delay value between sprites frames.
// Divider: -- AI --
Lecode.S_TBS.defaultAiPattern = String(parameters["Default Ai Pattern"] || "melee_fighter");    //  (): Default AI pattern.
Lecode.S_TBS.aiWaitTime = Number(parameters["Ai Wait Time"] || 5);  //  (): AI wait time.
// Divider: -- Actions Restrictions --
Lecode.S_TBS.oneTimeMove = String(parameters["One Time Move"] || 'false') === 'true';   //  (): Enable the one time move feature. (See doc)
Lecode.S_TBS.oneTimeOffense = String(parameters["One Time Offense"] || 'true') === 'true';  //  (): Enable the one time offense feature. (See doc)
Lecode.S_TBS.autoPass = String(parameters["Auto Pass"] || 'true') === 'true';   //  (): Enable the auto pass feature. (See doc)
// Divider: -- Battle End --
Lecode.S_TBS.escapeSound = String(parameters["Escape Sound"] || "Buzzer2"); //  (): Sound when the party try to escape.
Lecode.S_TBS.endOfBattleWait = Number(parameters["End Of Battle Wait"] || 60);  //  (): Wait amount before the end of the battle.
Lecode.S_TBS.collapseAnimation = Number(parameters["Collapse Animation"] || 136);   //  (): Default collapse animation.


Lecode.S_TBS.drawLimits = false;

/*-------------------------------------------------------------------------
* Spriteset_BattleTBS
-------------------------------------------------------------------------*/
function Spriteset_BattleTBS() {
    this.initialize.apply(this, arguments);
}

Spriteset_BattleTBS.prototype = Object.create(Spriteset_Map.prototype);
Spriteset_BattleTBS.prototype.constructor = Spriteset_BattleTBS;

Spriteset_BattleTBS.prototype.initialize = function() {
    Spriteset_Map.prototype.initialize.call(this);
    this.createBattleLayers();
};

Spriteset_BattleTBS.prototype.createCharacters = function() {
    this._characterSprites = [];
    $gameMap.events().forEach(function(event) {
        if (event.event().note.match(/tbs_event/i))
            this._characterSprites.push(new Sprite_Character(event));
    }, this);

    for (var i = 0; i < this._characterSprites.length; i++) {
        this._tilemap.addChild(this._characterSprites[i]);
    }
};

Spriteset_BattleTBS.prototype.createBattleLayers = function() {
    //-Ground entities
    this._groundEntitiesLayer = new Sprite();
    this._groundEntitiesLayer.z = 0;
    this._tilemap.addChild(this._groundEntitiesLayer);
    //-Scopes
    this._scopesLayer = new TBSScopeLayer();
    this._scopesLayer.z = 2;
    this._tilemap.addChild(this._scopesLayer);
    this._scopesLayer.createSelectionLayer();
    //-Ground
    this._groundLayer = new Sprite();
    this._groundLayer.z = 2;
    this._tilemap.addChild(this._groundLayer);
    //-Battlers
    this._battlersLayer = new Sprite();
    this._battlersLayer.z = 2;
    this._tilemap.addChild(this._battlersLayer);
    //-Animations
    this._animationsLayer = new TBSMapAnimation();
    this._animationsLayer.z = 4;
    this._tilemap.addChild(this._animationsLayer);
    //-Movable Infos
    this._movableInfoLayer = new Sprite();
    this._movableInfoLayer.z = 6;
    this._tilemap.addChild(this._movableInfoLayer);
    //-Fixed Infos
    this._fixedInfoLayer = new Sprite();
    this._fixedInfoLayer.z = 6;
    this._tilemap.addChild(this._fixedInfoLayer);
    //-Debug
    var bitmap = new Bitmap(Graphics.width, Graphics.height);
    this._debugLayer = new Sprite(bitmap);
    this._debugLayer.z = 7;
    this._tilemap.addChild(this._debugLayer);
};


/*-------------------------------------------------------------------------
* TBSScopeLayer
-------------------------------------------------------------------------*/
function TBSScopeLayer() {
    this.initialize.apply(this, arguments);
}
TBSScopeLayer.prototype = Object.create(Sprite.prototype);
TBSScopeLayer.prototype.constructor = TBSScopeLayer;

TBSScopeLayer.prototype.initialize = function() {
    var w = $gameMap.width() * $gameMap.tileWidth();
    var h = $gameMap.height() * $gameMap.tileHeight();
    var bitmap = new Bitmap(w, h);
    Sprite.prototype.initialize.call(this, bitmap);
    this._selectionLayer = null;
};

TBSScopeLayer.prototype.createSelectionLayer = function() {
    this._selectionLayer = new TBSScopeLayer();
    this._selectionLayer.z = 2;
    this.parent.addChild(this._selectionLayer);
};

TBSScopeLayer.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._selectionLayer) {
        this._selectionLayer.x = this.x;
        this._selectionLayer.y = this.y;
    }
};

TBSScopeLayer.prototype.clear = function() {
    this.bitmap.clear();
};

TBSScopeLayer.prototype.clearSelection = function() {
    this._selectionLayer.clear();
};

TBSScopeLayer.prototype.drawCell = function(x, y, opacity, color) {
    var w = Lecode.S_TBS.scopeCellWidth;
    var h = Lecode.S_TBS.scopeCellHeight;
    var sx = $gameMap.tileWidth() - w;
    var sy = $gameMap.tileHeight() - h;
    w -= sx;
    h -= sy;
    sx += x * $gameMap.tileWidth();
    sy += y * $gameMap.tileHeight();
    this.bitmap.paintOpacity = opacity;
    this.bitmap.fillRect(sx, sy, w, h, color);
};

TBSScopeLayer.prototype.drawSelectionCell = function(x, y, opacity, color) {
    this._selectionLayer.drawCell(x, y, opacity, color);
};


/*-------------------------------------------------------------------------
* TBSMapAnimation
-------------------------------------------------------------------------*/
function TBSMapAnimation() {
    this.initialize.apply(this, arguments);
}

TBSMapAnimation.prototype = Object.create(Sprite_Base.prototype);
TBSMapAnimation.prototype.constructor = TBSMapAnimation;

TBSMapAnimation.prototype.initialize = function(battler) {
    Sprite_Base.prototype.initialize.call(this);
    this._cell = null;
    this._target = null;
};

TBSMapAnimation.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
};

TBSMapAnimation.prototype.newAnimation = function(id, mirror, delay, cell, target) {
    this._cell = cell;
    this._target = target;
    this.startAnimation($dataAnimations[id], mirror, delay);
};

TBSMapAnimation.prototype.startAnimation = function(animation, mirror, delay) {
    var sprite = new Sprite_TBSAnimation();
    sprite.setup(this._target || this._effectTarget, animation, mirror, delay, this._cell);
    this.addChild(sprite);
    this._animationSprites.push(sprite);
};


/*-------------------------------------------------------------------------
* Sprite_TBSAnimation
-------------------------------------------------------------------------*/
function Sprite_TBSAnimation() {
    this.initialize.apply(this, arguments);
}

Sprite_TBSAnimation.prototype = Object.create(Sprite_Animation.prototype);
Sprite_TBSAnimation.prototype.constructor = Sprite_TBSAnimation;

Sprite_TBSAnimation.prototype.initialize = function(battler) {
    Sprite_Animation.prototype.initialize.call(this);
    this._cell = null;
};

Sprite_TBSAnimation.prototype.update = function() {
    Sprite_Animation.prototype.update.call(this);
};

Sprite_TBSAnimation.prototype.setup = function(target, animation, mirror, delay, cell) {
    this._cell = cell;
    this._target = target;
    this._animation = animation;
    this._mirror = mirror;
    this._delay = delay;
    if (this._animation) {
        this.remove();
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();
    }
};

Sprite_TBSAnimation.prototype.updatePosition = function() {
    if (this._animation.position === 3) {
        this.x = this.parent.width / 2;
        this.y = this.parent.height / 2;
    } else {
        var w = $gameMap.tileWidth();
        var h = $gameMap.tileHeight();
        this.x = this._cell.x * $gameMap.tileWidth() + w / 2;
        this.y = this._cell.y * $gameMap.tileHeight() + h / 2;
        if (this._animation.position === 2)
            this.y += h / 2;
        else if (this._animation.position === 0)
            this.y -= h / 2;

    }
};


/*-------------------------------------------------------------------------
* Scene_Battle
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldSB_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
    if (Lecode.S_TBS.commandOn) {
        Scene_Base.prototype.create.call(this);
        this.createDisplayObjects();
    } else {
        Lecode.S_TBS.oldSB_create.call(this);
    }
};

Lecode.S_TBS.oldSB_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
Scene_Battle.prototype.createDisplayObjects = function() {
    if (Lecode.S_TBS.commandOn) {
        this.createSpriteset();
        this.createWindowLayer();
        this.createAllWindows();
    } else {
        Lecode.S_TBS.oldSB_createDisplayObjects.call(this);
    }
};

Lecode.S_TBS.oldSB_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    if (Lecode.S_TBS.commandOn) {
        Scene_Base.prototype.start.call(this);
        this.startFadeIn(this.fadeSpeed(), false);

        BattleManager.playBattleBgm();
        BattleManagerTBS._spriteset = this._spriteset;
        InputHandlerTBS.setup();

        InputHandlerTBS.addWindowBlockingTouch(this._windowConfirm);
        InputHandlerTBS.addWindowBlockingTouch(this._windowCommand);
        InputHandlerTBS.addWindowBlockingTouch(this._windowSkill);
        InputHandlerTBS.addWindowBlockingTouch(this._windowItem);
        InputHandlerTBS.addWindowBlockingTouch(this._windowStatus);
        InputHandlerTBS.addWindowBlockingTouch(this._helpWindow);

        BattleManagerTBS.startBattle();
    } else {
        Lecode.S_TBS.oldSB_start.call(this);
    }
};

Lecode.S_TBS.oldSB_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    if (Lecode.S_TBS.commandOn) {
        $gameMap.update();
        $gameTimer.update(true);
        $gameScreen.update();
        InputHandlerTBS.update();
        BattleManagerTBS.update();
        Scene_Base.prototype.update.call(this);
    } else {
        Lecode.S_TBS.oldSB_update.call(this);
    }
};

Lecode.S_TBS.oldSB_createSpriteset = Scene_Battle.prototype.createSpriteset;
Scene_Battle.prototype.createSpriteset = function() {
    if (Lecode.S_TBS.commandOn) {
        this._spriteset = new Spriteset_BattleTBS();
        this.addChild(this._spriteset);
    } else {
        Lecode.S_TBS.oldSB_createSpriteset.call(this);
    }
};

Lecode.S_TBS.oldSB_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    if (Lecode.S_TBS.commandOn) {
        //this.createLogWindow();
        this.createPlacementWindow();
        this.createConfirmationWindow();
        this.createStatusWindow();
        this.createCommandWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createEndCommandWindow();
        this.createMessageWindow();
    } else {
        Lecode.S_TBS.oldSB_createAllWindows.call(this);
    }
};

Scene_Battle.prototype.createPlacementWindow = function() {
    this._windowPlacement = new Window_TBSPlacementInfo();
    this._windowPlacement.hide();
    this._windowPlacement.deactivate();
    this.addWindow(this._windowPlacement);
};

Scene_Battle.prototype.createConfirmationWindow = function() {
    this._windowConfirm = new Window_TBSConfirm();
    this._windowConfirm.setHandler('ok', this.onConfirmationOK.bind(this));
    this._windowConfirm.setHandler('cancel', this.onConfirmationCancel.bind(this));
    this._windowConfirm.hide();
    this._windowConfirm.deactivate();
    this.addWindow(this._windowConfirm);
};

Lecode.S_TBS.oldSB_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
Scene_Battle.prototype.createStatusWindow = function() {
    if (Lecode.S_TBS.commandOn) {
        this._windowStatus = new Window_TBSStatus();
        this._windowStatus.hide();
        this.addWindow(this._windowStatus);
    } else {
        Lecode.S_TBS.oldSB_createStatusWindow.call(this);
    }
};

Lecode.S_TBS.oldSB_createCommandWindow = Scene_Battle.prototype.createCommandWindow;
Scene_Battle.prototype.createCommandWindow = function() {
    if (Lecode.S_TBS.commandOn) {
        this._windowCommand = new Window_TBSCommand();
        this._windowCommand.setHandler('move', this.onCommandInput.bind(this, "move"));
        this._windowCommand.setHandler('attack', this.onCommandInput.bind(this, "attack"));
        this._windowCommand.setHandler('skill', this.onCommandInput.bind(this, "skill"));
        this._windowCommand.setHandler('item', this.onCommandInput.bind(this, "item"));
        this._windowCommand.setHandler('pass', this.onCommandInput.bind(this, "pass"));
        this._windowCommand.setHandler('cancel', this.onCommandInput.bind(this, "cancel"));
        this._windowCommand.hide();
        this._windowCommand.deactivate();
        this.addWindow(this._windowCommand);
    } else {
        Lecode.S_TBS.oldSB_createCommandWindow.call(this);
    }
};

Lecode.S_TBS.oldSB_createSkillWindow = Scene_Battle.prototype.createSkillWindow;
Scene_Battle.prototype.createSkillWindow = function() {
    if (Lecode.S_TBS.commandOn) {
        this._windowSkill = new Window_TBSSkillList();
        this._windowSkill.setHandler('ok', this.onSkillInput.bind(this, "ok"));
        this._windowSkill.setHandler('cancel', this.onSkillInput.bind(this, "cancel"));
        this._windowSkill._helpWindow = this._helpWindow;
        this._windowSkill.hide();
        this._windowSkill.deactivate();
        this.addWindow(this._windowSkill);
    } else {
        Lecode.S_TBS.oldSB_createSkillWindow.call(this);
    }
};

Lecode.S_TBS.oldSB_createItemWindow = Scene_Battle.prototype.createItemWindow;
Scene_Battle.prototype.createItemWindow = function() {
    if (Lecode.S_TBS.commandOn) {
        this._windowItem = new Window_TBSItemList();
        this._windowItem.setHandler('ok', this.onItemInput.bind(this, "ok"));
        this._windowItem.setHandler('cancel', this.onItemInput.bind(this, "cancel"));
        this._windowItem._helpWindow = this._helpWindow;
        this._windowItem.hide();
        this._windowItem.deactivate();
        this.addWindow(this._windowItem);
    } else {
        Lecode.S_TBS.oldSB_createItemWindow.call(this);
    }
};

Scene_Battle.prototype.createEndCommandWindow = function() {
    this._windowEndCommand = new Window_TBSEndCommand();
    this._windowEndCommand.setHandler('options', this.onEndCommandInput.bind(this, "options"));
    this._windowEndCommand.setHandler('escape', this.onEndCommandInput.bind(this, "escape"));
    this._windowEndCommand.setHandler('cancel', this.onEndCommandInput.bind(this, "cancel"));
    this._windowEndCommand.hide();
    this._windowEndCommand.deactivate();
    this.addWindow(this._windowEndCommand);
};

Scene_Battle.prototype.showPlacementWindow = function(cell, battler) {
    this.placeWindowOverCell(this._windowPlacement, cell);
    this._windowPlacement.show();
    this._windowPlacement.open();
    this._windowPlacement._battler = battler;
    this._windowPlacement.refresh();
};

Scene_Battle.prototype.showStatusWindow = function(battler) {
    //if (battler === this._windowStatus._battler) return;
    var window = this._windowStatus;
    this._windowStatus._battler = battler;
    this._windowStatus.show();
    this._windowStatus.open();
    this._windowStatus.refresh();
};

Scene_Battle.prototype.showCommandWindow = function() {
    var entity = BattleManagerTBS.activeEntity();
    var cell = entity.getCell();
    var battler = BattleManagerTBS.activeBattler();
    this.placeWindowOverCell(this._windowCommand, cell);
    this._windowCommand.setup(battler, entity);
};

Scene_Battle.prototype.showSkillWindow = function() {
    var entity = BattleManagerTBS.activeEntity();
    var cell = entity.getCell();
    var battler = BattleManagerTBS.activeBattler();
    this.placeWindowOverCell(this._windowSkill, cell);
    this._windowSkill.setActor(battler);
    this._windowSkill.show();
    this._windowSkill.open();
    this._windowSkill.refresh();
    this._windowSkill.activate();
    this.showHelpWindow();
};

Scene_Battle.prototype.showItemWindow = function() {
    var entity = BattleManagerTBS.activeEntity();
    var cell = entity.getCell();
    var battler = BattleManagerTBS.activeBattler();
    this.placeWindowOverCell(this._windowItem, cell);
    this._windowItem.show();
    this._windowItem.open();
    this._windowItem.refresh();
    this._windowItem.activate();
    this.showHelpWindow();
};

Scene_Battle.prototype.showHelpWindow = function() {
    var status = this._windowStatus;
    var help = this._helpWindow;
    help.x = 0;
    help.y = Graphics.height - help.height;
    while ((status.y + status.height) > help.y)
        status.y--;
    status.y++;
    help.visible = true;
};

Scene_Battle.prototype.showEndCommandWindow = function() {
    this._windowEndCommand.show();
    this._windowEndCommand.open();
    this._windowEndCommand.activate();
};

Scene_Battle.prototype.placeWindowOverCell = function(window, cell) {
    var x = $gameMap.adjustX(cell.x) * $gameMap.tileWidth();
    var y = $gameMap.adjustY(cell.y) * $gameMap.tileHeight();
    var w = window.width;
    var h = window.height;

    x += $gameMap.tileWidth() / 2 - w / 2;
    while (x < 0) x++;
    while ((x + w) > Graphics.width) x--;

    if (y <= h)
        y += $gameMap.tileHeight() / 2 + 10;
    else
        y -= h - 10;

    window.move(x, y, w, h);
    window._leU_float = true;
    window._leU_floatData.ini_pos = [x, y];
};

Scene_Battle.prototype.hidePlacementWindow = function(cell, battler) {
    this._windowPlacement.close();
};

Scene_Battle.prototype.hideHelpWindow = function() {
    var status = this._windowStatus;
    var help = this._helpWindow;
    if ((status.y + status.height) == (help.y + 1))
        status.y += help.height;
    help.y += help.height;
    help.visible = false;
};

Scene_Battle.prototype.showConfirmationWindow = function() {
    this._windowConfirm.show();
    this._windowConfirm.open();
    this._windowConfirm.activate();
};

Scene_Battle.prototype.hideConfirmationWindow = function() {
    this._windowConfirm.close();
    this._windowConfirm.deactivate();
};

Scene_Battle.prototype.onConfirmationOK = function() {
    if (this._windowConfirm.openness == 255);
    BattleManagerTBS.onConfirmationWindowOK();
};

Scene_Battle.prototype.onConfirmationCancel = function() {
    if (this._windowConfirm.openness == 255);
    BattleManagerTBS.onConfirmationWindowCancel();
};

Scene_Battle.prototype.onCommandInput = function(command) {
    this._windowCommand.close();
    this._windowCommand.deactivate();
    BattleManagerTBS.onCommandInput(command);
};

Scene_Battle.prototype.onSkillInput = function(command) {
    this._windowSkill.close();
    this._windowSkill.deactivate();
    this.hideHelpWindow();
    BattleManagerTBS.onSkillInput(command);
};

Scene_Battle.prototype.onItemInput = function(command) {
    this._windowItem.close();
    this._windowItem.deactivate();
    this.hideHelpWindow();
    BattleManagerTBS.onItemInput(command);
};

Scene_Battle.prototype.onEndCommandInput = function(command) {
    this._windowEndCommand.close();
    this._windowEndCommand.deactivate();
    BattleManagerTBS.onEndCommandInput(command);
};

Scene_Battle.prototype.getWindowsWChangeableOpa = function() {
    return [this._windowConfirm, this._windowPlacement, this._windowCommand, this._windowStatus,
        this._windowSkill, this._helpWindow
    ];
};

Scene_Battle.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    if (Lecode.S_TBS.commandOn) {
        this.getWindowsWChangeableOpa().forEach(function(window) {
            window.close();
        }.bind(this));
    } else {
        this._statusWindow.close();
        this._partyCommandWindow.close();
        this._actorCommandWindow.close();
    }
};


/*-------------------------------------------------------------------------
* InputHandlerTBS
-------------------------------------------------------------------------*/
function InputHandlerTBS() {
    throw new Error('This is a static class');
}

InputHandlerTBS.setup = function() {
    this._active = true;
    this._lastSelectedCell = null;
    this._windowsBlocking = [];
};

InputHandlerTBS.isActive = function() {
    return this._active;
};

InputHandlerTBS.lastSelectedCell = function() {
    return this._lastSelectedCell;
};

InputHandlerTBS.setActive = function(active) {
    this._active = active;
};

InputHandlerTBS.addWindowBlockingTouch = function(window) {
    this._windowsBlocking.push(window);
};

InputHandlerTBS.setOnTouchCallback = function(callback) {
    this._onTouchCallback = callback;
};

InputHandlerTBS.setOnTouchCancelCallback = function(callback) {
    this._onTouchCancelCallback = callback;
};

InputHandlerTBS.setOnUpCallback = function(callback) {
    this._onUpCallback = callback;
};

InputHandlerTBS.setOnRightCallback = function(callback) {
    this._onRightCallback = callback;
};

InputHandlerTBS.setOnDownCallback = function(callback) {
    this._onDownCallback = callback;
};

InputHandlerTBS.setOnLeftCallback = function(callback) {
    this._onLeftCallback = callback;
};

InputHandlerTBS.setOnOkCallback = function(callback) {
    this._onOkCallback = callback;
};

InputHandlerTBS.setOnCancelCallback = function(callback) {
    this._onCancelCallback = callback;
};

InputHandlerTBS.update = function() {
    if (!this.isActive()) return;
    if (BattleManagerTBS.isWaiting()) return;

    if (Input.isPressed(Lecode.S_TBS.explorationInput) && !BattleManagerTBS.isExploring()) {
        BattleManagerTBS.startMapExploration();
        return;
    }
    if (!Input.isPressed(Lecode.S_TBS.explorationInput) && BattleManagerTBS.isExploring()) {
        BattleManagerTBS.endMapExploration();
        return;
    }
    if (BattleManagerTBS.isExploring()) {
        this.updateExplorationInput();
        return;
    }

    if (Input.isPressed(Lecode.S_TBS.opacityInput))
        BattleManagerTBS.setInputOpacity();
    else
        BattleManagerTBS._opacityInputed = false;

    if (TouchInput.isTriggered()) {
        if (!this.isTouchBlocked()) {
            var cell = this.touchSelectedCell();
            this.processCallback("Touch", cell);
            this._lastSelectedCell = cell;
            var x = $gameMap.canvasToMapX(TouchInput.x);
            var y = $gameMap.canvasToMapY(TouchInput.y);
            $gameTemp.setDestination(x, y);
            BattleManagerTBS.resetDestinationCount();
        }
        return;
    }

    if (TouchInput.isCancelled()) {
        this.processCallback("TouchCancel");
        return;
    }

    if (Input.isTriggered("right"))
        this.processCallback("Right");
    if (Input.isTriggered("down"))
        this.processCallback("Down");
    if (Input.isTriggered("left"))
        this.processCallback("Left");
    if (Input.isTriggered("up"))
        this.processCallback("Up");
    if (Input.isTriggered("ok"))
        this.processCallback("Ok");
    if (Input.isTriggered("cancel"))
        this.processCallback("Cancel");
};

InputHandlerTBS.processCallback = function(key, arg) {
    var func = eval("this._on" + key + "Callback");
    if (func)
        func(arg);
};

InputHandlerTBS.updateExplorationInput = function() {
    if (Input.isPressed("right"))
        BattleManagerTBS.scrollRight(1);
    if (Input.isPressed("down"))
        BattleManagerTBS.scrollDown(1);
    if (Input.isPressed("up"))
        BattleManagerTBS.scrollUp(1);
    if (Input.isPressed("left"))
        BattleManagerTBS.scrollLeft(1);
};

InputHandlerTBS.touchSelectedCell = function() {
    var w = $gameMap.tileWidth();
    var h = $gameMap.tileHeight();
    var x = TouchInput.x;
    var y = TouchInput.y;
    var cells = BattleManagerTBS._groundCells;
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (x >= cell.x * w && x <= (cell.x * w + w)) {
            if (y >= cell.y * h && y <= (cell.y * h + h))
                return cell;
        }
    }
    return null;
};

InputHandlerTBS.isTouchBlocked = function() {
    var x = TouchInput.x;
    var y = TouchInput.y;
    for (var i = 0; i < this._windowsBlocking.length; i++) {
        var w = this._windowsBlocking[i];
        if (!w.visible || w.opacity === 0 || w.openness === 0) continue;
        if (x >= w.x && x <= (w.x + w.width)) {
            if (y >= w.y && y <= (w.y + w.height))
                return true;
        }
    }
    return false;
};


/*-------------------------------------------------------------------------
* BattleManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldBM_setup = BattleManager.setup;
BattleManager.setup = function(troopId, canEscape, canLose) {
    Lecode.S_TBS.oldBM_setup.call(this, troopId, canEscape, canLose);
    BattleManagerTBS.setup();
};

Lecode.S_TBS.oldBM_isTurnEnd = BattleManager.isTurnEnd;
BattleManager.isTurnEnd = function() {
    return Lecode.S_TBS.oldBM_isTurnEnd.call(this) || BattleManagerTBS._subPhase == "turn_end";
};

Lecode.S_TBS.oldBM_canEscape = BattleManager.canEscape;
BattleManager.canEscape = function() {
    var entity = BattleManagerTBS.activeEntity();
    if (entity) {
        var bool = entity._movePerformed || entity._actionPerformed;
        return Lecode.S_TBS.oldBM_canEscape.call(this) && !bool;
    } else {
        return Lecode.S_TBS.oldBM_canEscape.call(this);
    }
};


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
function BattleManagerTBS() {
    throw new Error('This is a static class');
}

BattleManagerTBS.setup = function() {
    this.initMembers();
};

BattleManagerTBS.initMembers = function() {
    this._phase = "init";
    this._subPhase = "";
    this._startCells = [];
    this._groundCells = [];
    this._cursor = null;
    this._activeCell = null;
    this._spriteset = null;
    this._battlerEntities = [];
    this._explorationIniCell = null;
    this._exploring = false;
    this._inputOpacity = 0;
    this._opacityInputed = false;
    this._waitTime = 0;
    this._turnOrder = [];
    this._activeIndex = 0;
    this._activeAction = null;
    this._dummyChara = new Game_Character();
    this._moveScope = null;
    this._movePath = null;
    this._actionScope = null;
    this._destinationCount = 0;
};

BattleManagerTBS.cursor = function() {
    return this._cursor;
};

BattleManagerTBS.allEntities = function() {
    return this._battlerEntities;
};

BattleManagerTBS.dummyCharacter = function() {
    return this._dummyChara;
};

BattleManagerTBS.moveScope = function() {
    return this._moveScope;
};

BattleManagerTBS.movePath = function() {
    return this._movePath;
};

BattleManagerTBS.actionScope = function() {
    return this._actionScope;
};

BattleManagerTBS.lastSelectedCell = function() {
    return this._lastSelectedCell;
};

BattleManagerTBS.isExploring = function() {
    return this._exploring;
};

BattleManagerTBS.activeAction = function() {
    return this._activeAction;
};

BattleManagerTBS.getLayer = function(id) {
    var layer = eval("this._spriteset._" + id + "Layer");
    return layer;
};

BattleManagerTBS.wait = function(time) {
    this._waitTime += time;
};

BattleManagerTBS.isWaiting = function() {
    return this._waitTime > 0;
};

BattleManagerTBS.startBattle = function() {
    this.prepare();
    this.processPlacementPhase();
};

BattleManagerTBS.prepare = function() {
    this.createStartCells();
    this.createGroundCells();
    this.createTBSObjects();
};

BattleManagerTBS.createTBSObjects = function() {
    this.createDirectionSelector();
    this.createCursor();
    this.createBattleStartSprite();
    this.createTurnOrderVisual();
    this.createProjectilesManager();
    this.createAiManager();
    this._easystar = new EasyStar.js();
};

BattleManagerTBS.createDirectionSelector = function() {
    var layer = this.getLayer("movableInfo");
    this._directionSelector = new TBSDirectionSelector(layer);
};

BattleManagerTBS.createCursor = function() {
    var bitmap = ImageManager.loadLeTBS("MapCursor");
    this._cursor = new SpriteCursorTBS(bitmap);
    this.getLayer("ground").addChild(this.cursor());
};

BattleManagerTBS.createBattleStartSprite = function() {
    var bitmap = ImageManager.loadLeTBS("Battle_Start");
    this._startSprite = new Sprite(bitmap);
    this._startSprite.visible = false;
    this.getLayer("fixedInfo").addChild(this._startSprite);
};

BattleManagerTBS.createProjectilesManager = function() {
    var layer = this.getLayer("animations");
    this._projectilesManager = new TBSProjectilesManager(layer);
};

BattleManagerTBS.createAiManager = function() {
    this._aiManager = new TBSAiManager();
};
BattleManagerTBS.createTurnOrderVisual = function() {
    var layer = this.getLayer("fixedInfo");
    this._turnOrderVisual = new TBSTurnOrderVisual(layer);
};

BattleManagerTBS.createStartCells = function() {
    this.getLayer("scopes").clear();
    this._startCells = [];
    $gameMap.events().forEach(function(eventObj) {
        var x = eventObj.event().x;
        var y = eventObj.event().y;
        var name = eventObj.event().name;
        var cell = new TBSCell(x, y);
        cell._event = eventObj.event();
        if (name == "ally" || name == "enemy")
            this.createPlacementCell(name, x, y, cell);
        this._startCells.push(cell);
    }.bind(this));
};

BattleManagerTBS.createGroundCells = function() {
    this._groundCells = [];
    for (var i = 0; i < $gameMap.width(); i++) {
        for (var j = 0; j < $gameMap.height(); j++) {
            var cell = new TBSCell(i, j);
            cell._regionId = $gameMap.regionId(i, j);
            this._groundCells.push(cell);
        }
    }
};

BattleManagerTBS.update = function() {
    this.waitForMessages();
    this.updateWait();
    this.updateWindowsInputOpacity();
    this.updateTBSObjects();
    this.updatePhase();
    this.updateBattlers();
    this.updateDestination();
};

BattleManagerTBS.updateDestination = function() {
    this._destinationCount++;
    if (this._destinationCount >= Lecode.S_TBS.destinationDuration) {
        this._destinationCount = 0;
        $gameTemp.clearDestination();
    }
};

BattleManagerTBS.resetDestinationCount = function() {
    this._destinationCount = 0;
};

BattleManagerTBS.waitForMessages = function() {
    if ($gameMessage.isBusy()) {
        this.wait(1);
        var window = LeUtilities.getScene()._windowCommand;
        if (window.active) {
            //window.close();
            window.deactivate();
            this._windowToResume = window;
        }
    } else {
        if (this._windowToResume) {
            this._windowToResume.open();
            this._windowToResume.activate();
            this._windowToResume = null;
        }
    }
};

BattleManagerTBS.updateWait = function() {
    if (this.isWaiting())
        this._waitTime--;
};

BattleManagerTBS.updateWindowsInputOpacity = function() {
    if (this._inputOpacity === 0)
        return;

    var windows = LeUtilities.getScene().getWindowsWChangeableOpa();
    windows.forEach(function(window) {
        window.opacity = 255 - this._inputOpacity;
        window.backOpacity = 255 - this._inputOpacity;
        window.contentsOpacity = 255 - this._inputOpacity;
    }.bind(this));

    if (!this._opacityInputed) {
        var steps = Lecode.S_TBS.inputOpacityDecreaseSteps;
        var max = 255 - Lecode.S_TBS.minInputOpacity;
        this._inputOpacity -= steps;
        this._inputOpacity = this._inputOpacity.clamp(0, max);
    }
};

BattleManagerTBS.updateTBSObjects = function() {
    this.updateCursor();
    this._turnOrderVisual.update();
    this._projectilesManager.update();
};

BattleManagerTBS.updateCursor = function() {
    if (!this._activeCell || !this.cursor()) return;
    var x = this._activeCell.x;
    var y = this._activeCell.y;
    this.cursor().cellX = x;
    this.cursor().cellY = y;
    x *= $gameMap.tileWidth();
    y *= $gameMap.tileHeight();
    this.cursor().x = x;
    this.cursor().y = y;
    this.cursor().update();
};

BattleManagerTBS.startMapExploration = function() {
    this._exploring = true;
    this._explorationIniCell = this._activeCell;
};

BattleManagerTBS.endMapExploration = function() {
    this._exploring = false;
    this.centerCell(this._explorationIniCell);
};

BattleManagerTBS.setInputOpacity = function() {
    this._opacityInputed = true;
    var steps = Lecode.S_TBS.inputOpacityDecreaseSteps;
    var max = 255 - Lecode.S_TBS.minInputOpacity;
    this._inputOpacity += steps;
    this._inputOpacity = this._inputOpacity.clamp(0, max);
};

BattleManagerTBS.updatePhase = function() {
    if ($gameMessage.isBusy()) return;
    switch (this._phase) {
        case "placement":
            this.updatePlacementPhase();
            break;
        case "battle_beginning":
            this.updateBeginningPhase();
            break;
        case "battle_processing":
            this.updateBattleProcessing();
            break;
        case "battle_stopping":
            this.updateBattleStopping();
            break;
        case "battle_end":
            this.updateBattleEnd();
            break;
    }
};

BattleManagerTBS.updateBattlers = function() {
    this.allEntities().forEach(function(entity) {
        entity.update();
    }.bind(this));
};

BattleManagerTBS.createPlacementCell = function(type, x, y, cell) {
    var opacity = Lecode.S_TBS.placementCellOpacity;
    var color = (type == "ally") ? Lecode.S_TBS.allyColorCell : Lecode.S_TBS.enemyColorCell;
    this.getLayer("scopes").drawCell(x, y, opacity, color);
    cell._type = type;
};

BattleManagerTBS.drawTileLimits = function(cell, x, y) {
    if (!Lecode.S_TBS.drawLimits) return false;
    var lines = 0;
    if ($gameMap.isPassable(x, y, 2)) { //-Down
        cell._bitmap.fillRect(0, 0, $gameMap.tileWidth(), 1, "#FFFFFF");
        lines++;
    }
    if ($gameMap.isPassable(x, y, 4)) { //-Left
        cell._bitmap.fillRect($gameMap.tileWidth() - 1, 0, 1, $gameMap.tileHeight(), "#FFFFFF");
        lines++;
    }
    if ($gameMap.isPassable(x, y, 6)) { //-Right
        cell._bitmap.fillRect(0, 0, 1, $gameMap.tileHeight(), "#FFFFFF");
        lines++;
    }
    if ($gameMap.isPassable(x, y, 8)) { //-Up
        cell._bitmap.fillRect(0, $gameMap.tileHeight() - 1, $gameMap.tileWidth(), 1, "#FFFFFF");
        lines++;
    }
    return lines;
};

BattleManagerTBS.processPlacementPhase = function() {
    this._phase = "placement";
    this._subPhase = "";
    this._placeAllies = [];
    this._placeEnemies = [];
    $gameParty.battleMembers().forEach(function(mem) {
        this._placeAllies.push(mem);
    }.bind(this));
    $gameTroop.members().forEach(function(mem) {
        this._placeEnemies.push(mem);
    }.bind(this));
    this.processEnemyPlacement();

    InputHandlerTBS.setOnTouchCallback(this.placementPhaseOnTouchInput.bind(this));
    InputHandlerTBS.setOnTouchCancelCallback(this.placementPhaseOnInputCancel.bind(this));
    InputHandlerTBS.setOnOkCallback(this.placementPhaseOnInputOk.bind(this));
    InputHandlerTBS.setOnCancelCallback(this.placementPhaseOnInputCancel.bind(this));
    InputHandlerTBS.setOnRightCallback(this.placementPhaseOnInputRight.bind(this));
    InputHandlerTBS.setOnLeftCallback(this.placementPhaseOnInputLeft.bind(this));
    InputHandlerTBS.setOnDownCallback(this.placementPhaseOnInputDown.bind(this));
    InputHandlerTBS.setOnUpCallback(this.placementPhaseOnInputUp.bind(this));
};

BattleManagerTBS.placementPhaseOnTouchInput = function(selectedCell) {
    switch (this._subPhase) {
        case "input":
            this.selectStartCellByTouch(selectedCell);
            break;
        case "directionSelector_input":
            this.setDirectionSelectionDirByTouch(selectedCell);
            break;
    }
};

BattleManagerTBS.placementPhaseOnInputOk = function() {
    switch (this._subPhase) {
        case "input":
            this.placementPhaseOk();
            break;
        case "directionSelector_input":
            this.directionSelectorValidatePlacement();
            break;
    }
};

BattleManagerTBS.placementPhaseOnInputCancel = function() {
    switch (this._subPhase) {
        case "input":
            this.placementPhaseCancel();
            break;
        case "directionSelector_input":
            this.directionSelectorCancelPlacement();
            break;
    }
};

BattleManagerTBS.placementPhaseOnInputLeft = function() {
    switch (this._subPhase) {
        case "input":
            this.selectStartCellByDir("left");
            break;
        case "directionSelector_input":
            this.setDirectionSelectorLeft();
            break;
    }
};

BattleManagerTBS.placementPhaseOnInputRight = function() {
    switch (this._subPhase) {
        case "input":
            this.selectStartCellByDir("right");
            break;
        case "directionSelector_input":
            this.setDirectionSelectorRight();
            break;
    }
};

BattleManagerTBS.placementPhaseOnInputDown = function() {
    switch (this._subPhase) {
        case "input":
            this.selectStartCellByDir("down");
            break;
        case "directionSelector_input":
            this.setDirectionSelectorDown();
            break;
    }
};

BattleManagerTBS.placementPhaseOnInputUp = function() {
    switch (this._subPhase) {
        case "input":
            this.selectStartCellByDir("up");
            break;
        case "directionSelector_input":
            this.setDirectionSelectorUp();
            break;
    }
};

BattleManagerTBS.updatePlacementPhase = function() {
    if (this._subPhase === "troop") {
        if (!this.getLayer("animations").isAnimationPlaying()) {
            if (this._placeEnemies.length === 0)
                this.processAllyPlacement();
            else
                this.placeNextEnemy();
        }
    }
};

BattleManagerTBS.processEnemyPlacement = function() {
    this._subPhase = "troop";
    this.placeNextEnemy();
};

BattleManagerTBS.placeNextEnemy = function() {
    var enemy = this._placeEnemies.shift();
    var cells = this.enemyStartCells().filter(function(c) {
        return Number(c._event.note) === enemy.index() + 1 && this.isCellFree(c);
    }.bind(this));
    var cell = LeUtilities.getRandomValueInArray(cells);
    if (cell) {
        cell.select();
        this.centerActiveCell();
        this.updateCursor();
        var entity = new TBSEntity(enemy, this.getLayer("battlers"));
        this.getLayer("animations").newAnimation(Lecode.S_TBS.placedBattlerAnim, false, 0, cell, entity._sprite);
        entity.setCell(cell);
        this._battlerEntities.push(entity);
    }
};

BattleManagerTBS.processAllyPlacement = function() {
    InputHandlerTBS.setActive(true);
    this._subPhase = "input";
    this.placementSelect(this.allyStartCells()[0]);
};

BattleManagerTBS.placementSelect = function(cell) {
    cell.select();
    this.centerActiveCell();
    this.updateCursor();
    var battler = this._placeAllies[0];
    LeUtilities.getScene().showPlacementWindow(cell, battler);
};

BattleManagerTBS.selectStartCellByDir = function(dir) {
    var cell = this._activeCell;
    var cells = this.allyStartCells().filter(function(c) {
        return c != cell;
    });
    var found = null;
    switch (dir) {
        case "up":
            cells = cells.filter(function(c) {
                return c.y < cell.y;
            });
            found = LeUtilities.closestByDistance(cell, cells);
            break;
        case "down":
            cells = cells.filter(function(c) {
                return c.y > cell.y;
            });
            found = LeUtilities.closestByDistance(cell, cells);
            break;
        case "right":
            cells = cells.filter(function(c) {
                return c.x > cell.x;
            });
            found = LeUtilities.closestByDistance(cell, cells);
            break;
        case "left":
            cells = cells.filter(function(c) {
                return c.x < cell.x;
            });
            found = LeUtilities.closestByDistance(cell, cells);
            break;
    }
    if (found && found != cell) {
        this.placementSelect(found);
        SoundManager.playCursor();
    }
};

BattleManagerTBS.selectStartCellByTouch = function(cell) {
    if (cell) {
        var scope = this.allyStartCells();
        var currentCell = this._activeCell;
        if (this.isCellInScope(cell, scope)) {
            if (currentCell.isSame(cell)) {
                this.placementPhaseOk();
            } else {
                this.placementSelect(cell);
            }
        } else {
            this.placementPhaseOk();
        }
    }
};

BattleManagerTBS.selectNextStartCell = function() {
    var currentIndex = this.allyStartCells().indexOf(this._activeCell);
    var cell = this._activeCell;
    var currentEntity = cell.getEntity();
    var index = currentIndex;
    do {
        if (currentIndex === this.allyStartCells().length - 1)
            index = 0;
        else
            index += 1;
        cell = this.allyStartCells()[index];
        currentEntity = cell.getEntity();
    } while (currentEntity);
    this.placementSelect(cell);
    SoundManager.playCursor();
};

BattleManagerTBS.selectPreviousStartCell = function() {
    var currentIndex = this.allyStartCells().indexOf(this._activeCell);
    var index = currentIndex === 0 ? this.allyStartCells().length - 1 : currentIndex - 1;
    this.placementSelect(this.allyStartCells()[index]);
    SoundManager.playCursor();
};

BattleManagerTBS.placementPhaseOk = function() {
    var cell = this._activeCell;
    var battler = this._placeAllies.shift();
    var currentEntity = cell.getEntity();
    if (currentEntity) {
        this.removeBattlerEntity(currentEntity);
    }
    var entity = this.placeBattler(battler, cell);
    this.callDirectionSelector(entity, cell);
};

BattleManagerTBS.placementPhaseCancel = function() {
    var cell = this._activeCell;
    var currentEntity = cell.getEntity();
    if (currentEntity) {
        this.removeBattlerEntity(currentEntity);
        this.placementSelect(this._activeCell);
        SoundManager.playCancel();
    } else
        SoundManager.playBuzzer();
};

BattleManagerTBS.placeBattler = function(battler, cell) {
    var entity = new TBSEntity(battler, this.getLayer("battlers"));
    this.getLayer("animations").newAnimation(Lecode.S_TBS.placedBattlerAnim, false, 0, cell, entity._sprite);
    entity.setCell(cell);
    this._battlerEntities.push(entity);
    SoundManager.playOk();
    this.updateEnemiesDirectionWhilePlacement();
    return entity;
};

BattleManagerTBS.removeBattlerEntity = function(entity) {
    this._placeAllies.unshift(entity._battler);
    LeUtilities.removeInArray(this.allEntities(), entity);
    this.getLayer("battlers").removeChild(entity._sprite);
};

BattleManagerTBS.updateEnemiesDirectionWhilePlacement = function() {
    this.enemyEntities().forEach(function(ent) {
        ent.lookClosestBattler(this.allyEntities());
    }.bind(this));
};

BattleManagerTBS.callDirectionSelector = function(battler, cell) {
    this._subPhase = "directionSelector_input";
    this._directionSelector.set(cell, battler);
    LeUtilities.getScene().hidePlacementWindow(cell, battler);
};

BattleManagerTBS.setDirectionSelectorUp = function() {
    this._directionSelector.setDir(8);
};

BattleManagerTBS.setDirectionSelectorDown = function() {
    this._directionSelector.setDir(2);
};

BattleManagerTBS.setDirectionSelectorLeft = function() {
    this._directionSelector.setDir(4);
};

BattleManagerTBS.setDirectionSelectorRight = function() {
    this._directionSelector.setDir(6);
};

BattleManagerTBS.directionSelectorValidatePlacement = function() {
    SoundManager.playOk();
    this._directionSelector.hide();
    this._subPhase = "input";
    if (this.canEndPlacementPhase())
        this.placementPhaseEnd();
    else
        this.selectNextStartCell();
};

BattleManagerTBS.setDirectionSelectionDirByTouch = function(selectedCell) {
    var entity = this._directionSelector._battlerEntity;
    entity.lookAt(selectedCell);
    this.directionSelectorValidatePlacement();
};

BattleManagerTBS.directionSelectorCancelPlacement = function() {
    this._directionSelector.hide();
    this._subPhase = "input";
    this.placementPhaseCancel();
};

BattleManagerTBS.placementPhaseEnd = function() {
    this._subPhase = "confirm";
    Input.clear();
    LeUtilities.getScene().showConfirmationWindow();
};

BattleManagerTBS.resumePlacementPhase = function() {
    LeUtilities.getScene().hideConfirmationWindow();
    this.placementPhaseCancel();
    this._subPhase = "input";
};

BattleManagerTBS.onConfirmationWindowOK = function() {
    switch (this._phase) {
        case "placement":
            this.battlebeginning();
            break;
    }
};

BattleManagerTBS.onConfirmationWindowCancel = function() {
    switch (this._phase) {
        case "placement":
            this.resumePlacementPhase();
            break;
    }
};

BattleManagerTBS.battlebeginning = function() {
    this._phase = "battle_beginning";
    LeUtilities.getScene().hideConfirmationWindow();

    this._startSprite.visible = true;
    this._startSprite.x = Graphics.width / 2 - this._startSprite.width / 2;
    this._startSprite.y = Graphics.height / 2 - this._startSprite.height / 2;
    this._startSprite.opacity = 0;
    this._subPhase = "in";
};

BattleManagerTBS.updateBeginningPhase = function() {
    var opa;
    if (this._subPhase == "in") {
        opa = this._startSprite.opacity;
        this._startSprite.opacity = (opa + 6).clamp(0, 255);
        if (this._startSprite.opacity == 255) {
            this._subPhase = "wait";
            this.wait(Lecode.S_TBS.battleStartSpriteDelay);
        }
    } else if (this._subPhase == "wait") {
        if (!this.isWaiting())
            this._subPhase = "out";
    } else if (this._subPhase == "out") {
        opa = this._startSprite.opacity;
        this._startSprite.opacity = (opa - 6).clamp(0, 255);
        if (this._startSprite.opacity === 0) {
            this.beginningPhaseEnd();
        }
    }
};

BattleManagerTBS.beginningPhaseEnd = function() {
    this._startSprite.visible = false;
    this.processBattle();
};

BattleManagerTBS.processBattle = function() {
    this._phase = "battle_processing";
    this._subPhase = "";

    BattleManager.startBattle();
    this.allEntities().forEach(function(entity) {
        entity.onBattleStart();
    }.bind(this));
    this.hidePlacementCells();
    this.determineTurnOrder();
    $gameTroop.increaseTurn();
    this.startTurn();

    InputHandlerTBS.setOnTouchCallback(this.battlePhaseOnTouchInput.bind(this));
    InputHandlerTBS.setOnTouchCancelCallback(this.battlePhaseOnInputCancel.bind(this));
    InputHandlerTBS.setOnOkCallback(this.battlePhaseOnInputOk.bind(this));
    InputHandlerTBS.setOnCancelCallback(this.battlePhaseOnInputCancel.bind(this));
    InputHandlerTBS.setOnUpCallback(this.battlePhaseOnInputUp.bind(this));
    InputHandlerTBS.setOnRightCallback(this.battlePhaseOnInputRight.bind(this));
    InputHandlerTBS.setOnDownCallback(this.battlePhaseOnInputDown.bind(this));
    InputHandlerTBS.setOnLeftCallback(this.battlePhaseOnInputLeft.bind(this));
};

BattleManagerTBS.battlePhaseOnTouchInput = function(selectedCell) {
    switch (this._subPhase) {
        case "move":
            this.touchMoveSelection(selectedCell);
            break;
        case "directionSelector_input":
            this.passByTouch(selectedCell);
            break;
        case "attack":
        case "skill":
        case "item":
            this.touchActionSelection(selectedCell);
            break;
    }
};

BattleManagerTBS.battlePhaseOnInputOk = function() {
    switch (this._subPhase) {
        case "move":
            this.validateMoveSelection();
            break;
        case "directionSelector_input":
            this.validatePass();
            break;
        case "attack":
        case "skill":
        case "item":
            this.validateActionSelection();
            break;
    }
};

BattleManagerTBS.battlePhaseOnInputCancel = function() {
    switch (this._subPhase) {
        case "move":
            this.onMoveCancel();
            break;
        case "directionSelector_input":
            this.cancelPass();
            break;
        case "attack":
        case "skill":
        case "item":
            this.onActionCancel();
            break;
    }
};

BattleManagerTBS.battlePhaseOnInputLeft = function() {
    switch (this._subPhase) {
        case "directionSelector_input":
            this.setDirectionSelectorLeft();
            break;
        case "move":
        case "attack":
        case "skill":
        case "item":
        case "examine":
            this.moveCursor("left");
            break;
    }
};

BattleManagerTBS.battlePhaseOnInputRight = function() {
    switch (this._subPhase) {
        case "directionSelector_input":
            this.setDirectionSelectorRight();
            break;
        case "move":
        case "attack":
        case "skill":
        case "item":
        case "examine":
            this.moveCursor("right");
            break;
    }
};

BattleManagerTBS.battlePhaseOnInputDown = function() {
    switch (this._subPhase) {
        case "directionSelector_input":
            this.setDirectionSelectorDown();
            break;
        case "move":
        case "attack":
        case "skill":
        case "item":
        case "examine":
            this.moveCursor("down");
            break;
    }
};

BattleManagerTBS.battlePhaseOnInputUp = function() {
    switch (this._subPhase) {
        case "directionSelector_input":
            this.setDirectionSelectorUp();
            break;
        case "move":
        case "attack":
        case "skill":
        case "item":
        case "examine":
            this.moveCursor("up");
            break;
    }
};

BattleManagerTBS.updateBattleProcessing = function() {
    this.updateSequences();
    if (this._subPhase == "moving") {
        if (!this.activeEntity().isMoving() && !this.isWaiting())
            this.onActiveEntityMoveEnd();
    } else if (this._subPhase == "obj_invokation") {
        if (!this.anySequenceRunning())
            this.onActionEnd();
    } else if (this._subPhase == "ai") {
        this._aiManager.update();
    } else if (this._subPhase == "turn_end")
        this.updateEndOfTurnEvents();
};

BattleManagerTBS.hidePlacementCells = function() {
    this.getLayer("scopes").clear();
};

BattleManagerTBS.determineTurnOrder = function() {
    if (Lecode.S_TBS.turnOrderFairRepartition)
        this.determineTurnOrderFair();
    else
        this.determineTurnOrderSimple();
};

BattleManagerTBS.determineTurnOrderSimple = function() {
    var array = [];
    this._turnOrder = [];
    this._activeIndex = 0;

    this.allEntities().forEach(function(entity) {
        array.push(entity);
    });
    array = array.sort(function(a, b) {
        return (a._battler.agi > b._battler.agi) ? 1 : ((a._battler.agi < b._battler.agi) ? -1 : 0);
    });
    array.reverse();

    this._turnOrder = array;
    this._turnOrderVisual.set(this._turnOrder);
};

BattleManagerTBS.determineTurnOrderFair = function() {
    var array = [];
    var actors = [];
    var enemies = [];
    this._turnOrder = [];
    this._activeIndex = 0;

    this.allyEntities().forEach(function(entity) {
        actors.push(entity);
    });
    actors = actors.sort(function(a, b) {
        return (a._battler.agi > b._battler.agi) ? 1 : ((a._battler.agi < b._battler.agi) ? -1 : 0);
    });
    actors.reverse();

    this.enemyEntities().forEach(function(entity) {
        enemies.push(entity);
    });
    enemies = enemies.sort(function(a, b) {
        return (a._battler.agi > b._battler.agi) ? 1 : ((a._battler.agi < b._battler.agi) ? -1 : 0);
    });
    enemies.reverse();

    if (actors[0]._battler.agi >= enemies[0]._battler.agi)
        array.push(actors.shift());
    else
        array.push(enemies.shift());
    var max = actors.length + enemies.length;
    for (var i = 1; i <= max; i++) {
        var last = array.leU_last();
        if (last._battler.isActor()) {
            if (enemies.length > 0)
                array.push(enemies.shift());
            else
                array.push(actors.shift());
        } else {
            if (actors.length > 0)
                array.push(actors.shift());
            else
                array.push(enemies.shift());
        }
    }

    this._turnOrder = array;
    this._turnOrderVisual.set(this._turnOrder);
};

BattleManagerTBS.activeEntity = function() {
    return this._turnOrder[this._activeIndex];
};

BattleManagerTBS.activeBattler = function() {
    return this.activeEntity()._battler;
};

BattleManagerTBS.startTurn = function() {
    this._subPhase = "";
    var entity = this.activeEntity();
    entity.onTurnStart();

    var battler = this.activeBattler();
    this.newAction(battler);
    LeUtilities.getScene().showStatusWindow(battler);

    var cell = entity.getCell();
    this.setCursorCell(cell);

    if (battler.isActor()) {
        LeUtilities.getScene().showCommandWindow();
    } else {
        this._subPhase = "ai";
        this._aiManager.process(entity);
    }
};

BattleManagerTBS.updateSequences = function() {
    this.allEntities().forEach(function(entity) {
        entity._sequenceManager.update();
    });
};

BattleManagerTBS.anySequenceRunning = function() {
    return this.allEntities().some(function(entity) {
        return entity._sequenceManager.isRunning();
    });
};

BattleManagerTBS.newAction = function(battler) {
    this._activeAction = new Game_Action(battler, false);
};

BattleManagerTBS.moveCursor = function(dir) {
    var x = this._activeCell.x,
        y = this._activeCell.y;
    switch (dir) {
        case "up":
            y--;
            break;
        case "down":
            y++;
            break;
        case "right":
            x++;
            break;
        case "left":
            x--;
            break;
    }
    var cell = this.getCellAt(x, y);
    this.setCursorCell(cell);
    SoundManager.playCursor();
};

BattleManagerTBS.setCursorCell = function(cell) {
    if (!cell) return;
    cell.select();
    this.centerCell(cell);
    this.updateCursor();
    this.updateScopeSelection();
    this.updateTargetStatus();
};

BattleManagerTBS.updateScopeSelection = function() {
    if (this.cursorOnMoveScope())
        this.updateMoveSelection();
    else if (this.cursorOnActionScope()) {
        this.updateActionSelection();
    } else {
        this.clearActionSelection();
        this.clearMoveSelection();
    }
};

BattleManagerTBS.updateTargetStatus = function() {
    var cell = this._activeCell;
    var entity = cell.getEntity();
    var scene = LeUtilities.getScene();
    if (entity) {
        scene.showStatusWindow(entity._battler);
    } else {
        scene.showStatusWindow(this.activeBattler());
    }
};

BattleManagerTBS.onCommandInput = function(command) {
    switch (command) {
        case "move":
            this.processCommandMove();
            break;
        case "attack":
            this.processCommandAttack();
            break;
        case "skill":
            this.processCommandSkill();
            break;
        case "item":
            this.processCommandItem();
            break;
        case "pass":
            this.processCommandPass();
            break;
        case "cancel":
            this.processCommandCancel();
            break;
    }
};

BattleManagerTBS.processCommandMove = function() {
    this._subPhase = "move";
    var points = this.activeEntity().getMovePoints();
    this.drawMoveScope(this.activeEntity(), points);
};

BattleManagerTBS.drawMoveScope = function(entity, points) {
    var center = [entity._cellX, entity._cellY];
    var param = this.makeMoveScopeParam(entity);
    var data = entity.getMoveScopeData();
    var scope = this.getScopeFromData(data, center, param, points);
    var color = Lecode.S_TBS.moveColorCell;
    var opa = Lecode.S_TBS.moveCellOpacity;
    var invalidOpa = Lecode.S_TBS.moveInvalidCellOpacity;
    var invalidCondition = "!cell._walkable";
    this.getLayer("scopes").clear();
    this.drawScope(scope, color, opa, invalidOpa, invalidCondition);
    this._moveScope = {};
    this._moveScope.cells = scope;
    this._moveScope.center = center;
};

BattleManagerTBS.makeMoveScopeParam = function(entity) {
    var param = {
        exclude_center: true,
        can_select_obstacles: false,
        cells_reachable: true,
    };
    var data = entity.getMoveScopeParamData();
    data = LeUtilities.stringSplit(data, ",");
    data.forEach(function(arg) {
        if (arg.match(/through_obstacles/i))
            param.cells_reachable = false;
    }.bind(this));
    return param;
};

BattleManagerTBS.cursorOnMoveScope = function() {
    if (!this.isMoveScopeAvailable()) return false;
    for (var i = 0; i < this.moveScope().cells.length; i++) {
        var cell = this.moveScope().cells[i];
        if (cell._walkable) // && !cell.isObstacle())
            if (cell.x == this.cursor().cellX && cell.y == this.cursor().cellY)
            return true;
    }
    return false;
};

BattleManagerTBS.updateMoveSelection = function() {
    var sx = this.moveScope().center[0],
        sy = this.moveScope().center[1],
        dx = this.cursor().cellX,
        dy = this.cursor().cellY;
    this._movePath = this.getPathFromAToB(sx, sy, dx, dy, true);
    this.drawMoveSelection();
};

BattleManagerTBS.drawMoveSelection = function() {
    this.clearMoveSelection();
    var color = Lecode.S_TBS.moveColorCell;
    var opacity = Lecode.S_TBS.moveSelectedCellOpacity;
    for (var i = 0; i < this.movePath().length; i++) {
        var cell = this.movePath()[i];
        this.getLayer("scopes").drawSelectionCell(cell.x, cell.y, opacity, color);
    }
};

BattleManagerTBS.clearMoveSelection = function() {
    this.getLayer("scopes").clearSelection();
};

BattleManagerTBS.validateMoveSelection = function() {
    if (!this.cursorOnMoveScope()) {
        SoundManager.playBuzzer();
        return;
    }
    SoundManager.playOk();
    this.activeEntity().processMovement(this.movePath());
    this._subPhase = "moving";
};

BattleManagerTBS.touchMoveSelection = function(selectedCell) {
    var oldActiveCell = this._activeCell;
    this.setCursorCell(selectedCell);
    if (this.cursorOnMoveScope() && InputHandlerTBS.lastSelectedCell().isSame(selectedCell)) {
        this.validateMoveSelection();
    }
};

BattleManagerTBS.onActiveEntityMoveEnd = function() {
    this._subPhase = "";
    this.getLayer("scopes").clear();
    this.clearMoveSelection();
    this._moveScope = {};

    this.activeEntity()._movePerformed = true;
    if (this.activeBattler().isActor()) {
        if (Lecode.S_TBS.autoPass && !this.activeEntity().canMoveCommand() && this.activeEntity()._actionPerformed)
            this.processCommandPass();
        else
            LeUtilities.getScene().showCommandWindow();
    }
    LeUtilities.getScene().showStatusWindow(this.activeBattler());
    var cell = this.activeEntity().getCell();
    this.setCursorCell(cell);

    this.updateEndOfActionEvents();
};

BattleManagerTBS.onMoveCancel = function() {
    this._subPhase = "";
    this.getLayer("scopes").clear();
    this.clearMoveSelection();
    this._moveScope = {};

    LeUtilities.getScene().showCommandWindow();
    var cell = this.activeEntity().getCell();
    this.setCursorCell(cell);
    Input.clear();

    SoundManager.playCancel();
};

BattleManagerTBS.isMoveScopeAvailable = function() {
    return this.moveScope() && this.moveScope().cells && this.moveScope().center;
};

BattleManagerTBS.processCommandAttack = function() {
    this._subPhase = "attack";
    this.activeAction().setAttack();
    this.drawAttackScope(this.activeEntity());
};

BattleManagerTBS.drawAttackScope = function(entity) {
    var data = entity.getAttackScopeData();
    this._actionScopeParam = {
        color: Lecode.S_TBS.attackColorCell,
        opacity: Lecode.S_TBS.attackCellOpacity,
        invalidOpa: Lecode.S_TBS.attackInvalidCellOpacity
    };
    this.drawActionScope(entity, data);
    this.updateScopeSelection();
};

BattleManagerTBS.updateAttackSelection = function() {
    this._actionAoE = this.getAttackAoE();
    this.drawActionSelection();
};

BattleManagerTBS.getAttackAoE = function() {
    var data = this.activeEntity().getAttackAoEData();
    var center = [this.cursor().cellX, this.cursor().cellY];
    return this.getScopeFromData(data, center, {});
};

BattleManagerTBS.processCommandSkill = function() {
    LeUtilities.getScene().showSkillWindow();
};

BattleManagerTBS.onSkillInput = function(command) {
    switch (command) {
        case "ok":
            this.onSkillSelected();
            break;
        case "cancel":
            this.onActionCancel();
            break;
    }
};

BattleManagerTBS.onSkillSelected = function() {
    var skill = LeUtilities.getScene()._windowSkill.item();
    if (skill) {
        this._subPhase = "skill";
        this.activeAction().setItemObject(skill);
        this.drawSkillScope(this.activeEntity());
    }
};

BattleManagerTBS.drawSkillScope = function(entity) {
    var obj = this.activeAction().item();
    var data = entity.getObjectScopeData(obj);
    this._actionScopeParam = {
        color: Lecode.S_TBS.skillColorCell,
        opacity: Lecode.S_TBS.skillCellOpacity,
        invalidOpa: Lecode.S_TBS.skillInvalidCellOpacity,
        selectedOpacity: Lecode.S_TBS.skillSelectedCellOpacity
    };
    this.drawActionScope(entity, data);
    this.updateScopeSelection();
};

BattleManagerTBS.processCommandItem = function() {
    LeUtilities.getScene().showItemWindow();
};

BattleManagerTBS.onItemInput = function(command) {
    switch (command) {
        case "ok":
            this.onItemSelected();
            break;
        case "cancel":
            this.onActionCancel();
            break;
    }
};

BattleManagerTBS.onItemSelected = function() {
    var item = LeUtilities.getScene()._windowItem.item();
    if (item) {
        this._subPhase = "item";
        this.activeAction().setItemObject(item);
        this.drawItemScope(this.activeEntity());
    }
};

BattleManagerTBS.drawItemScope = function(entity) {
    var obj = this.activeAction().item();
    var data = entity.getObjectScopeData(obj);
    this._actionScopeParam = {
        color: Lecode.S_TBS.ItemColorCell,
        opacity: Lecode.S_TBS.ItemCellOpacity,
        invalidOpa: Lecode.S_TBS.ItemInvalidCellOpacity,
        selectedOpacity: Lecode.S_TBS.ItemSelectedCellOpacity
    };
    this.drawActionScope(entity, data);
    this.updateScopeSelection();
};

BattleManagerTBS.updateActionSelection = function() {
    this._actionAoE = this.getActionAoE();
    this.drawActionSelection();
};

BattleManagerTBS.getActionAoE = function() {
    var obj = this.activeAction().item();
    var data = this.activeEntity().getObjectAoEData(obj);
    var center = [this.cursor().cellX, this.cursor().cellY];
    return this.getScopeFromData(data, center, {});
};

BattleManagerTBS.validateActionSelection = function() {
    if (!this.cursorOnActionScope()) {
        SoundManager.playBuzzer();
        return;
    }
    SoundManager.playOk();

    this.getLayer("scopes").clear();
    this.clearActionSelection();

    var cell = this.getCellAt(this.cursor().cellX, this.cursor().cellY);
    this.activeEntity().lookAt(cell);
    this.processAction();
};

BattleManagerTBS.touchActionSelection = function(selectedCell) {
    var oldActiveCell = this._activeCell;
    this.setCursorCell(selectedCell);
    if (this.cursorOnActionScope() && InputHandlerTBS.lastSelectedCell().isSame(selectedCell)) {
        this.validateActionSelection();
    }
};

BattleManagerTBS.onActionCancel = function() {
    this._subPhase = "";
    this.getLayer("scopes").clear();
    this.clearActionSelection();
    this._actionScope = {};

    LeUtilities.getScene().showCommandWindow();
    var cell = this.activeEntity().getCell();
    this.setCursorCell(cell);

    Input.clear();
    SoundManager.playCancel();
};

BattleManagerTBS.isActionScopeAvailable = function() {
    return this.actionScope() && this.actionScope().cells && this.actionScope().center;
};

BattleManagerTBS.processAction = function() {
    this._subPhase = "obj_invokation";
    var action = this.activeAction();
    var item = action.item();
    var entity = this.activeEntity();
    var id = action.isAttack() ? entity.getWeaponSequenceData() : entity.getObjectSequenceData(item);
    this.activeBattler().useItem(item);
    action.applyGlobal();
    entity.startSequence(id, action);
};

BattleManagerTBS.applyObjEffects = function(user, item, targets, hitAnim, animDelay) {
    this.activeAction().setItemObject(item);
    this.prepareDirectionalDamageBonus(user, targets, item);
    targets.forEach(function(target) {
        this.activeAction().apply(target.battler());
        if (target.battler().result().isHit()) {
            if (hitAnim) {
                var cell = target.getCell();
                this.getLayer("animations").newAnimation(hitAnim, false, animDelay, cell, target._sprite);
            }
            if (target.battler().result().hpDamage > 0)
                target.callSequence("damaged");
        } else {
            target.callSequence("evaded");
        }
        target.addPopup();
        target.checkDeath();
    }.bind(this));
    this.resetDirectionalDamageBonus(targets);
    this.refreshBattlersStatus();
};

BattleManagerTBS.applyObjEffectsOnMap = function(user, item, cellTargets, hitAnim, animDelay) {
    this.activeAction().setItemObject(item);
    item = this.activeAction().item();
    cellTargets.forEach(function(cell) {
        var target = cell.getEntity();
        var sprite;
        if (target) {
            this.prepareDirectionalDamageBonus(user, [target], item);
            this.activeAction().apply(target.battler());
            if (target.battler().result().isHit()) {
                sprite = target._sprite;
                if (target.battler().result().hpDamage > 0)
                    target.callSequence("damaged");
            } else {
                target.callSequence("evaded");
            }
            target.addPopup();
            target.checkDeath();
            this.resetDirectionalDamageBonus([target]);
        }
        if (hitAnim)
            this.getLayer("animations").newAnimation(hitAnim, false, animDelay, cell, sprite);
    }.bind(this));
    this.refreshBattlersStatus();
};

BattleManagerTBS.applyFloatingDamage = function(amount, target) {
    target.battler().gainHp(-amount);
    target.addPopup();
    target.callSequence("damaged");
    target.checkDeath();
};

BattleManagerTBS.refreshBattlersStatus = function() {
    LeUtilities.getScene()._windowStatus.refresh();
};

BattleManagerTBS.onActionEnd = function() {
    this._subPhase = "";
    this._actionScope = {};
    var cell = this.activeEntity().getCell();
    this.setCursorCell(cell);
    Input.clear();
    this.activeEntity()._actionPerformed = true;
    LeUtilities.getScene().showStatusWindow(this.activeBattler());

    var obj = this.activeAction().item();
    if (this.activeEntity().passAfterObjUse(obj))
        this.processCommandPass();
    else if (this.activeBattler().isActor()) {
        if (Lecode.S_TBS.autoPass && !this.activeEntity().canMoveCommand())
            this.processCommandPass();
        else
            LeUtilities.getScene().showCommandWindow();
    }

    this.getLayer("scopes").clear();
    this.getLayer("scopes").clearSelection();

    this.updateEndOfActionEvents();
};

BattleManagerTBS.processCommandPass = function() {
    var entity = this.activeEntity();
    var cell = entity.getCell();
    if (this.activeBattler().isActor() && Lecode.S_TBS.enableDirectionalFacing) {
        this._subPhase = "directionSelector_input";
        this._beforePassDir = entity.getDir();
        this._directionSelector.set(cell, entity);
    } else {
        this.validatePass();
    }
};

BattleManagerTBS.cancelPass = function() {
    this._subPhase = "";
    this._directionSelector.hide();
    LeUtilities.getScene().showCommandWindow();
    Input.clear();
    SoundManager.playCancel();
    this.activeEntity().setDir(this._beforePassDir);
};

BattleManagerTBS.validatePass = function() {
    this._directionSelector.hide();
    this.turnEnd();
};

BattleManagerTBS.passByTouch = function(selectedCell) {
    var entity = this._directionSelector._battlerEntity;
    entity.lookAt(selectedCell);
    this.validatePass();
};

BattleManagerTBS.turnEnd = function() {
    this._subPhase = "turn_end";
    this.activeEntity().onTurnEnd();
};

BattleManagerTBS.updateEndOfActionEvents = function() {
    this.checkDeathAndVictory();
};

BattleManagerTBS.updateEndOfTurnEvents = function() {
    var canContinue = this.updateEvents() && this.checkDeathAndVictory();
    if (canContinue) {
        this.nextTurn();
    }
};

BattleManagerTBS.updateEvents = function() {
    $gameTroop.updateInterpreter();
    $gameParty.requestMotionRefresh();
    if ($gameTroop.isEventRunning()) {
        return false;
    }
    $gameTroop.setupBattleEvent();
    if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
        return false;
    }
    return true;
};

BattleManagerTBS.nextTurn = function() {
    do {
        if (this._activeIndex === 0)
            $gameTroop.increaseTurn();
        this._activeIndex++;
        if (this._activeIndex >= this._turnOrder.length)
            this._activeIndex = 0;
    } while (this.activeEntity()._dead);
    this._turnOrderVisual.updateOnNextTurn(this._turnOrder, this._activeIndex);
    this.startTurn();
};

BattleManagerTBS.processCommandCancel = function() {
    LeUtilities.getScene().showEndCommandWindow();
};

BattleManagerTBS.onEndCommandInput = function(command) {
    switch (command) {
        case "options":
            break;
        case "escape":
            this.processEscape();
            break;
        case "cancel":
            this.resumeBattle();
            break;
    }
};

BattleManagerTBS.resumeBattle = function() {
    LeUtilities.getScene().showCommandWindow();
    Input.clear();
};

BattleManagerTBS.processEscape = function() {
    $gameParty.performEscape();
    var success = BattleManager._preemptive ? true : (Math.random() < BattleManager._escapeRatio);
    if (success) {
        BattleManager._escaped = true;
        SoundManager.playEscape();
        this.prepareAbort();
    } else {
        var audio = {};
        audio.name = Lecode.S_TBS.escapeSound;
        audio.pitch = 100;
        audio.volume = 90;
        audio.pan = 0;
        AudioManager.playSe(audio);
        BattleManager._escapeRatio += 0.1;
        this.resumeBattle();
        this.nextTurn();
    }
};

BattleManagerTBS.checkDeathAndVictory = function() {
    if ($gameParty.isAllDead()) {
        this.prepareDefeat();
        return false;
    } else if ($gameTroop.isAllDead()) {
        this.prepareVictory();
        return false;
    }
    return true;
};

BattleManagerTBS.prepareAbort = function() {
    this._battleStopStatus = "abort";
    this.stopBattle();
};

BattleManagerTBS.prepareDefeat = function() {
    this._battleStopStatus = "defeat";
    this.stopBattle();
};

BattleManagerTBS.prepareVictory = function() {
    this._battleStopStatus = "victory";
    this.stopBattle();
    this.allyEntities().forEach(function(entity) {
        entity.startSequence("victory");
    });
};

BattleManagerTBS.processDefeat = function() {
    BattleManager.processDefeat();
    this._phase = "battle_end";
    this.enemyEntities().forEach(function(entity) {
        entity.startSequence("victory");
    });
};

BattleManagerTBS.processAbort = function() {
    BattleManager.processAbort();
    this._phase = "battle_end";
};

BattleManagerTBS.processVictory = function() {
    BattleManager.processVictory();
    this._phase = "battle_end";
};

BattleManagerTBS.stopBattle = function() {
    InputHandlerTBS.setActive(false);
    this._phase = "battle_stopping";
    this.wait(Lecode.S_TBS.endOfBattleWait);
};

BattleManagerTBS.updateBattleStopping = function() {
    LeUtilities.getScene()._windowCommand.close();
    this._directionSelector.hide();
    var waiting = this.isWaiting();
    switch (this._battleStopStatus) {
        case "abort":
            waiting = waiting || this.isWaitingForAbortEvents();
            break;
        case "victory":
            waiting = waiting || this.isWaitingForVictoryEvents();
            break;
        case "defeat":
            waiting = waiting || this.isWaitingForDefeatEvents();
            break;
    }
    if (!waiting) {
        switch (this._battleStopStatus) {
            case "abort":
                this.processAbort();
                break;
            case "victory":
                this.processVictory();
                break;
            case "defeat":
                this.processDefeat();
                break;
        }
    }
};

BattleManagerTBS.isWaitingForAbortEvents = function() {
    return false;
};

BattleManagerTBS.isWaitingForVictoryEvents = function() {
    return false;
};

BattleManagerTBS.isWaitingForDefeatEvents = function() {
    return false;
};

BattleManagerTBS.updateBattleEnd = function() {
    BattleManager.updateBattleEnd();
    this._phase = null;
};

BattleManagerTBS.onEntityDeath = function(entity) {
    if (this.activeEntity() === entity)
        this.turnEnd();
    this._turnOrderVisual.updateOnEntityDeath(this._turnOrder, this._activeIndex);
};



BattleManagerTBS.drawActionScope = function(entity, data) {
    var center = [entity._cellX, entity._cellY];
    var color = this._actionScopeParam.color;
    var opacity = this._actionScopeParam.opacity;
    var invalidOpa = this._actionScopeParam.invalidOpa;
    var param = this.makeObjScopeParam();
    var scope = this.getScopeFromData(data, center, param);
    var invalidCondition = "!cell._scopeVisible";
    this.getLayer("scopes").clear();
    this.drawScope(scope, color, opacity, invalidOpa, invalidCondition);
    this._actionScope = {};
    this._actionScope.cells = scope;
    this._actionScope.center = center;
};

BattleManagerTBS.makeObjScopeParam = function(obj) {
    obj = obj || this.activeAction().item();
    var param = {
        exclude_center: true,
        line_of_sight: true,
        remove_nonvisibleCells: false
    };
    if (!obj || obj === "weapon") return param;
    var data = obj.leTbs_scopeParam;
    data = LeUtilities.stringSplit(data, ",");
    data.forEach(function(arg) {
        if (arg.match(/include_center/i))
            param.exclude_center = false;
        else if (arg.match(/through_obstacles/i))
            param.line_of_sight = false;
        else if (arg.match(/need_free_cell/i))
            param.need_free_cells = true;
    }.bind(this));
    return param;
};

BattleManagerTBS.cursorOnActionScope = function() {
    if (!this.isActionScopeAvailable()) return false;
    for (var i = 0; i < this.actionScope().cells.length; i++) {
        var cell = this.actionScope().cells[i];
        if (cell._scopeVisible && !(cell.isObstacle() && !cell.isThereEntity()))
            if (cell.x == this.cursor().cellX && cell.y == this.cursor().cellY)
                return true;
    }
    return false;
};

BattleManagerTBS.drawActionSelection = function() {
    this.clearActionSelection();
    var color = this._actionScopeParam.color;
    var opacity = this._actionScopeParam.selectedOpacity;
    for (var i = 0; i < this._actionAoE.length; i++) {
        var cell = this._actionAoE[i];
        this.getLayer("scopes").drawSelectionCell(cell.x, cell.y, opacity, color);
    }
};

BattleManagerTBS.clearActionSelection = function() {
    this.getLayer("scopes").clearSelection();
};

BattleManagerTBS.getScopeFromData = function(data, center, param, points) {
    var scope = [];
    if (data.match(/custom_(.+)/i)) {
        var scopeData = Lecode.S_TBS.Config.Custom_Scopes[String(RegExp.$1)];
        scope = this.getScopeFromRawData(scopeData, center);
        scope = LeUtilities.uniqArray(scope);
        scope = this.applyParamToScope(scope, center, points, param);
    } else if (data.match(/circle\((.+)\)/i)) {
        scope = this.makeCircleScope(center, Number(RegExp.$1), param, points);
    } else if (data.match(/line\((.+)\)/i)) {
        scope = this.makeLineScope(center, Number(RegExp.$1), param, points);
    } else if (data.match(/square\((.+)\)/i)) {
        scope = this.makeSquareScope(center, Number(RegExp.$1), param, points);
    } else {
        var cx = center[0];
        var cy = center[1];
        var aoe = eval("[" + data + "]");
        for (var i = 0; i < aoe.length; i++) {
            var cell = this.getCellAt(aoe[i][0], aoe[i][1]);
            if (cell)
                scope.push(cell);
        }
    }
    return scope;
};

BattleManagerTBS.getScopeFromRawData = function(scopeData, center) {
    var scope = [];
    var cx = center[0];
    var cy = center[1];
    var ux = this.activeEntity()._cellX;
    var uy = this.activeEntity()._cellY;
    var array = eval("[" + scopeData.data + "]");
    array.forEach(function(arr) {
        var cell = this.getCellAt(arr[0], arr[1]);
        if (cell)
            scope.push(cell);
    }.bind(this));
    return LeUtilities.uniqArray(scope);
};

//- OBSOLETE
BattleManagerTBS.getScopeFromFile = function(scopeData, center) {
    var scope = [];
    var cx = this.cursor().cellX;
    var cy = this.cursor().cellY;
    var ux = this.activeEntity()._cellX;
    var uy = this.activeEntity()._cellY;
    var file = MVC.ajaxLoadFile("data/LeTBS/" + scopeData.from_file);
    var data = JsonEx.parse(file);
    var str = data["data"].replace(/;/ig, ",");
    var array = eval("[" + str + "]");
    array.forEach(function(arr) {
        var cell = this.getCellAt(arr[0], arr[1]);
        if (cell)
            scope.push(cell);
    }.bind(this));
    return LeUtilities.uniqArray(scope);
};

BattleManagerTBS.makeCircleScope = function(center, range, param, points) {
    points = points || range;
    var cells = [];
    var start = param.exclude_center ? 1 : 0;
    var x = center[0],
        y = center[1];
    for (var i = start; i <= range; i++) {
        cells.push(this.getCellAt(x + i, y));
        cells.push(this.getCellAt(x - i, y));
        cells.push(this.getCellAt(x, y + i));
        cells.push(this.getCellAt(x, y - i));
        for (var a = start; a <= range - i; a++) {
            cells.push(this.getCellAt(x - i, y - a));
            cells.push(this.getCellAt(x - i, y + a));
            cells.push(this.getCellAt(x + i, y - a));
            cells.push(this.getCellAt(x + i, y + a));
        }
    }
    cells = LeUtilities.uniqArray(cells);
    cells = this.applyParamToScope(cells, center, points, param);
    return LeUtilities.uniqArray(cells);
};

BattleManagerTBS.makeSquareScope = function(center, range, param, points) {
    points = points || range;
    var cells = [];
    var x = center[0],
        y = center[1];
    for (var i = -range; i <= range; i++) {
        for (var j = -range; j <= range; j++) {
            if (param.exclude_center && i === 0 && j === 0)
                continue;
            cells.push(this.getCellAt(x + i, y + j));
        }
    }
    cells = LeUtilities.uniqArray(cells);
    cells = this.applyParamToScope(cells, center, points, param);
    return LeUtilities.uniqArray(cells);
};

BattleManagerTBS.makeLineScope = function(center, range, param, points) {
    points = points || range;
    var cells = [];
    var start = param.exclude_center ? 1 : 0;
    var x = center[0],
        y = center[1];
    for (var i = start; i <= range; i++) {
        cells.push(this.getCellAt(x + i, y));
        cells.push(this.getCellAt(x - i, y));
        cells.push(this.getCellAt(x, y + i));
        cells.push(this.getCellAt(x, y - i));
    }
    cells = LeUtilities.uniqArray(cells);
    cells = this.applyParamToScope(cells, center, points, param);
    return LeUtilities.uniqArray(cells);
};

BattleManagerTBS.makeCrossScope = function(center, range, param, points) {
    points = points || range;
    var cells = [];
    var start = param.exclude_center ? 1 : 0;
    var x = center[0],
        y = center[1];
    for (var i = start; i <= range; i++) {
        cells.push(this.getCellAt(x + i, y + i));
        cells.push(this.getCellAt(x + i, y - i));
        cells.push(this.getCellAt(x - i, y + i));
        cells.push(this.getCellAt(x - i, y - i));
    }
    cells = LeUtilities.uniqArray(cells);
    cells = this.applyParamToScope(cells, center, points, param);
    return LeUtilities.uniqArray(cells);
};

BattleManagerTBS.applyParamToScope = function(cells, center, points, param) {
    cells = this.removeInvalidCells(cells);
    if (!param.can_select_obstacles) {
        if (param.remove_obstacles)
            cells = this.removeObstaclesFromScope(cells);
    }
    if (param.cells_reachable) {
        this.checkScopeWalkable(cells, points, center);
        if (param.remove_unreachableCells)
            cells = this.makeScopeReachable(cells, points, center);
    }
    cells.forEach(function(cell) {
        cell._scopeVisible = true;
    }.bind(this));
    if (param.line_of_sight) {
        this.checkScopeVisibility(cells, center);
        if (param.remove_nonvisibleCells)
            cells = this.makeScopeVisible(cells, center);
    }
    if (param.need_free_cells) {
        cells = this.removeObstaclesFromScope(cells);
        cells = this.removeEntitiesFromScope(cells);
    }
    return cells;
};

BattleManagerTBS.removeInvalidCells = function(cells) {
    return cells.filter(function(cell) {
        return cell;
    });
};

BattleManagerTBS.removeObstaclesFromScope = function(cells) {
    return cells.filter(function(cell) {
        return !cell.isObstacle();
    });
};

BattleManagerTBS.removeEntitiesFromScope = function(cells) {
    return cells.filter(function(cell) {
        return !cell.isThereEntity();
    });
};

BattleManagerTBS.checkScopeWalkable = function(cells, range, center) {
    for (var i = 0; i < cells.length; i++) {
        cells[i]._walkable = false;
    }

    var grid = this.getWalkableGridForEasyStar();
    this._easystar.setGrid(grid);
    this._easystar.setAcceptableTiles([0]);
    this._easystar.enableSync();

    center.x = center[0];
    center.y = center[1];
    var scope = cells.sort(function(cella, cellb) {
        var cellaDist = LeUtilities.distanceBetween(cella, center);
        var cellbDist = LeUtilities.distanceBetween(cellb, center);
        return (cellaDist > cellbDist) ? 1 : ((cellaDist < cellbDist) ? -1 : 0);
    });
    scope.reverse();
    var reachables = [];
    for (i = 0; i < scope.length; i++) {
        var cell = scope[i];
        var isReachable = false;
        for (var j = 0; j < reachables.length; j++) {
            var coord = reachables[j];
            if (coord[0] == cell.x && coord[1] == cell.y) {
                isReachable = true;
                break;
            }
        }
        if (isReachable)
            cell._walkable = true;
        else
            cell._walkable = this.isCellReachable(cell, range, center, reachables);
        reachables = LeUtilities.uniqArray(reachables);
    }
};

BattleManagerTBS.makeScopeReachable = function(cells, range, center) {
    return cells.filter(function(cell) {
        return cell._walkable;
    }.bind(this));
};

BattleManagerTBS.isCellReachable = function(cell, range, center, reachables) {
    if (cell.getEntity()) {
        if (!cell.getEntity().entitiesCanLayOnMe())
            return false;
    } else if (cell.isObstacle())
        return false;
    var path = [];
    var pathResult = null;
    var sx = center[0];
    var sy = center[1];
    var dx = cell.x;
    var dy = cell.y;
    this._easystar.findPath(sx, sy, dx, dy, function(result) {
        pathResult = result;
    });
    this._easystar.calculate();
    if (!pathResult)
        return false;
    pathResult.shift();
    if (pathResult.length > range)
        return false;
    return true;
};

BattleManagerTBS.checkScopeVisibility = function(cells, center) {
    var w = $gameMap.tileWidth();
    var h = $gameMap.tileHeight();
    var cx = center[0] * w + w / 2;
    var cy = center[1] * h + h / 2;
    var obstacles = [];
    var boundaries = this.getScopeBoundaries(cells);
    for (var x = boundaries.left; x <= boundaries.right; x++) {
        for (var y = boundaries.top; y <= boundaries.bottom; y++) {
            var cell = this.getCellAt(x, y);
            if (cell.isObstacle())
                obstacles.push(cell);
        }
    }
    /*for (var k = 0; k < cells.length; k++) {
    	if (cells[k].isObstacle())
    		obstacles.push(cells[k]);
    }*/
    var nonVisible = [];

    for (var i = 0; i < cells.length; i++) {
        cells[i]._scopeVisible = true;
    }

    for (i = 0; i < obstacles.length; i++) {
        var cellsToCheck = this.cellsToCheckNearObstacle(obstacles[i], cells, center);
        for (var j = 0; j < cellsToCheck.length; j++) {
            var cellToCheck = cellsToCheck[j];
            if (obstacles[i].x == cellToCheck.x && obstacles[i].y == cellToCheck.y)
                continue;
            var dx = cellToCheck.x * w + w / 2;
            var dy = cellToCheck.y * h + h / 2;
            //- var sprite = SceneManager._scene._spriteset._debugLayer;
            var pixels = LeUtilities.getPixelsOfLine(cx, cy, dx, dy);
            for (var k = 0; k < obstacles.length; k++) {
                var obstacle = obstacles[k];
                if (obstacle.x == center[0] && obstacle.y == center[1])
                    continue;
                if (obstacle.isSame(cellToCheck))
                    continue;
                var x = obstacle.x * w;
                var y = obstacle.y * h;
                for (var m = 0; m < pixels.length; m++) {
                    if (LeUtilities.doesRectIncludeCoord(x, y, w, h, pixels[m])) {
                        nonVisible.push([cellToCheck.x, cellToCheck.y]);
                        m = pixels.length;
                    }
                }
            }
        }
    }

    for (i = 0; i < nonVisible.length; i++) {
        for (var j = 0; j < cells.length; j++) {
            if (cells[j].x == nonVisible[i][0] && cells[j].y == nonVisible[i][1])
                cells[j]._scopeVisible = false;
        }
    }
};

BattleManagerTBS.checkSingleCellVisibility = function(cell, center) {
    var w = $gameMap.tileWidth();
    var h = $gameMap.tileHeight();
    var cx = center[0] * w + w / 2;
    var cy = center[1] * h + h / 2;

    var obstacles = [];
    for (var i = 0; i < this._groundCells.length; i++) {
        if (this._groundCells[i].isObstacle())
            obstacles.push(this._groundCells[i]);
    }
    cell._scopeVisible = true;

    var dx = cell.x * w + w / 2;
    var dy = cell.y * h + h / 2;
    var pixels = LeUtilities.getPixelsOfLine(cx, cy, dx, dy);
    for (var k = 0; k < obstacles.length; k++) {
        var obstacle = obstacles[k];
        if (obstacle.x === center[0] && obstacle.y === center[1])
            continue;
        if (obstacle.isSame(cell))
            continue;
        var x = obstacle.x * w;
        var y = obstacle.y * h;
        for (var m = 0; m < pixels.length; m++) {
            if (LeUtilities.doesRectIncludeCoord(x, y, w, h, pixels[m])) {
                cell._scopeVisible = false;
                return;
            }
        }
    }
};

BattleManagerTBS.cellsToCheckNearObstacle = function(obstacle, cells, center) {
    var cx = center[0],
        cy = center[1];
    var result = [];
    var condition;
    if (obstacle.y > cy && obstacle.x > cx)
        condition = "cell.x >= obstacle.x && cell.y >= obstacle.y";
    else if (obstacle.y > cy && obstacle.x < cx)
        condition = "cell.x <= obstacle.x && cell.y >= obstacle.y";
    else if (obstacle.y < cy && obstacle.x > cx)
        condition = "cell.x >= obstacle.x && cell.y <= obstacle.y";
    else if (obstacle.y < cy && obstacle.x < cx)
        condition = "cell.x <= obstacle.x && cell.y <= obstacle.y";
    else if (obstacle.y == cy && obstacle.x < cx)
        condition = "cell.x <= obstacle.x";
    else if (obstacle.y == cy && obstacle.x > cx)
        condition = "cell.x >= obstacle.x";
    else if (obstacle.x == cx && obstacle.y < cy)
        condition = "cell.y <= obstacle.y";
    else if (obstacle.x == cx && obstacle.y > cy)
        condition = "cell.y >= obstacle.y";
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        if (eval(condition))
            result.push(cell);
    }
    return result;
};

BattleManagerTBS.makeScopeVisible = function(cells, center) {
    return cells.filter(function(cell) {
        return !!cell._scopeVisible;
    }.bind(this));
};

BattleManagerTBS.getScopeBoundaries = function(cells) {
    var cellsByX = cells.sort(function(cellA, cellB) {
        return (cellA.x > cellB.x) ? 1 : ((cellA.x < cellB.x) ? -1 : 0);
    });
    var rightCell = cellsByX.leU_last();
    var leftCell = cellsByX[0];
    var cellsByY = cells.sort(function(cellA, cellB) {
        return (cellA.y > cellB.y) ? 1 : ((cellA.y < cellB.y) ? -1 : 0);
    });
    var bottomCell = cellsByY.leU_last();
    var topCell = cellsByY[0];
    return {
        left: leftCell.x,
        right: rightCell.x,
        top: topCell.y,
        bottom: bottomCell.y
    };
};

BattleManagerTBS.getPathFromAToB = function(sx, sy, dx, dy, walkableGrid) {
    var path = [];
    var pathResult = null;
    var grid = walkableGrid ? this.getWalkableGridForEasyStar() : this.getGridForEasyStar();
    this._easystar.setGrid(grid);
    this._easystar.setAcceptableTiles([0]);
    this._easystar.enableSync();
    this._easystar.findPath(sx, sy, dx, dy, function(result) {
        pathResult = result;
    });
    this._easystar.calculate();
    if (!pathResult) return [];
    pathResult.shift();
    for (var i = 0; i < pathResult.length; i++) {
        var cellArr = pathResult[i];
        var cell = this.getCellAt(cellArr.x, cellArr.y);
        path.push(cell);
    }
    return path;
};

BattleManagerTBS.getGridForEasyStar = function() {
    var grid = [];
    for (var y = 0; y < $gameMap.height(); y++) {
        var arr = [];
        for (var x = 0; x < $gameMap.width(); x++) {
            var cell = this.getCellAt(x, y);
            if (!cell || cell.isObstacle())
                arr.push(1);
            else
                arr.push(0);
        }
        grid.push(arr);
    }
    return grid;
};

BattleManagerTBS.getWalkableGridForEasyStar = function() {
    //return this.getGridForEasyStar();
    var grid = [];
    for (var y = 0; y < $gameMap.height(); y++) {
        var arr = [];
        for (var x = 0; x < $gameMap.width(); x++) {
            var cell = this.getCellAt(x, y);
            if (cell) {
                var entity = cell.getEntity();
                if (entity) {
                    arr.push(entity.isPassable() ? 0 : 1);
                } else {
                    arr.push(cell.isObstacle() ? 1 : 0);
                }
            } else
                arr.push(1);
        }
        grid.push(arr);
    }
    return grid;
};

BattleManagerTBS.drawScope = function(cells, color, opa, invalidOpa, invalidCondition) {
    for (var i = 0; i < cells.length; i++) {
        var cell = cells[i];
        var opacity;
        if (eval(invalidCondition))
            opacity = invalidOpa;
        else
            opacity = opa;
        this.getLayer("scopes").drawCell(cell.x, cell.y, opacity, color);
    }
};

BattleManagerTBS.isCellInScope = function(cell, scope) {
    for (var i = 0; i < scope.length; i++) {
        if (scope[i].isSame(cell))
            return true;
    }
    return false;
};

BattleManagerTBS.getEntitiesInScope = function(scope) {
    var entities = [];
    for (var i = 0; i < scope.length; i++) {
        var cell = scope[i];
        var entity = cell.getEntity();
        if (entity)
            entities.push(entity);
    }
    return entities;
};

BattleManagerTBS.processCollisionEffects = function(entity) {
    var collisionData = entity._collisionData;
    if (!collisionData.endCell) return;

    var distance = collisionData.distance;
    var covered = collisionData.covered;
    var user = collisionData.user;
    var obj = collisionData.obj;
    var a = user.battler();
    var b = entity.battler();
    var formula = Lecode.S_TBS.defaultCollisionFormula;
    if (obj && obj.leTbs_collisionFormula) {
        formula = obj.leTbs_collisionFormula;
    }
    var damage = Math.floor(eval(formula));
    var dmgBonus = user.getCollisionDamageBonus(damage);
    var dmgMinus = entity.getCollisionDamageReduction(damage);
    damage += dmgBonus - dmgMinus;
    if (damage < 0) damage = 0;
    this.applyFloatingDamage(Math.floor(damage), entity);

    var endCell = collisionData.endCell;
    var next = endCell.getEntity();
    while (next) {
        damage -= damage * Lecode.S_TBS.collissionDamageChainRate;
        this.applyFloatingDamage(Math.floor(damage), next);
        var oldDir = next.getDir();
        next.setDir(collisionData.dir);
        endCell = next.getForwardCell();
        next.setDir(oldDir);
        next = endCell.getEntity();
    }
    entity._collisionData = null;
};

BattleManagerTBS.prepareDirectionalDamageBonus = function(user, targets, item) {
    var oldUserDir = user.getDir();
    for (var i = 0; i < targets.length; i++) {
        var entity = targets[i];
        if (entity === user) continue;
        var dir = entity.getDir();
        var effects = 0;
        user.lookAt(entity.getCell());
        if (user.getDir() === dir) {
            effects = Lecode.S_TBS.backDirectionalDamageEffects;
            effects += item.leTbs_directionalDmgBonus.back;
            effects += user.getDirectionalDmgBonus("back");
            effects -= entity.getDirectionalDmgReduction("back");
        } else if (user.getDir() === 2 && dir === 8 || user.getDir() === 8 && dir === 2 ||
            user.getDir() === 4 && dir === 6 || user.getDir() === 6 && dir === 4) {
            effects = Lecode.S_TBS.faceDirectionalDamageEffects;
            effects += item.leTbs_directionalDmgBonus.face;
            effects += user.getDirectionalDmgBonus("face");
            effects -= entity.getDirectionalDmgReduction("face");
        } else {
            effects = Lecode.S_TBS.sideDirectionalDamageEffects;
            effects += item.leTbs_directionalDmgBonus.side;
            effects += user.getDirectionalDmgBonus("side");
            effects -= entity.getDirectionalDmgReduction("side");
        }
        entity.battler().leTBS_setDirectionalDmgEffects(effects * 0.01);
    }
    user.setDir(oldUserDir);
};

BattleManagerTBS.resetDirectionalDamageBonus = function(targets) {
    for (var i = 0; i < targets.length; i++) {
        targets[i].battler().leTBS_setDirectionalDmgEffects(0);
    }
};


BattleManagerTBS.allyStartCells = function() {
    return this._startCells.filter(function(cell) {
        return cell._type === "ally";
    });
};

BattleManagerTBS.enemyStartCells = function() {
    return this._startCells.filter(function(cell) {
        return cell._type === "enemy";
    });
};

BattleManagerTBS.allyEntities = function() {
    return this.allEntities().filter(function(ent) {
        return ent._battler.isActor();
    });
};

BattleManagerTBS.enemyEntities = function() {
    return this.allEntities().filter(function(ent) {
        return !ent._battler.isActor();
    });
};

BattleManagerTBS.isCellFree = function(cell) {
    if (cell == null) return true;
    return cell.getEntity() == null;
};

BattleManagerTBS.getEntityCell = function(entity) {
    return this._groundCells.leU_find(function(c) {
        return entity._cellX === c.x && entity._cellY === c.y;
    }.bind(this));
};

BattleManagerTBS.getCellAt = function(x, y) {
    return this._groundCells.leU_find(function(c) {
        return x == c.x && y == c.y;
    }.bind(this));
};

BattleManagerTBS.getEntitiesXY = function(excludeActive) {
    var arr = [];
    if (!this.allEntities()) return arr;
    for (var i = 0; i < this.allEntities().length; i++) {
        var entity = this.allEntities()[i];
        if (!(excludeActive && entity == this.activeEntity()))
            arr.push([entity._cellX, entity._cellY]);
    }
    return arr;
};

BattleManagerTBS.battlerEntities = function() {
    return this.allEntities();
};

BattleManagerTBS.getEntityByBattler = function(battler) {
    var entities = this.allEntities();
    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.battler() === battler)
            return entity;
    }
};

BattleManagerTBS.canEndPlacementPhase = function() {
    return this._placeAllies.length === 0;
};

BattleManagerTBS.centerActiveCell = function() {
    this.centerCell(this._activeCell);
};

BattleManagerTBS.centerCell = function(cell) {
    var oldX = $gameMap._displayX;
    var oldY = $gameMap._displayY;
    $gamePlayer.center(cell.x, cell.y);
    this.adaptLayersPos();
    this.adaptMapVisuals(oldX, oldY);
};

BattleManagerTBS.scrollRight = function(distance) {
    var oldX = $gameMap._displayX;
    var oldY = $gameMap._displayY;
    $gameMap.setDisplayPos(oldX + distance, oldY);
    this.adaptLayersPos();
    this.adaptMapVisuals(oldX, oldY);
};

BattleManagerTBS.scrollDown = function(distance) {
    var oldX = $gameMap._displayX;
    var oldY = $gameMap._displayY;
    $gameMap.setDisplayPos(oldX, oldY + distance);
    this.adaptLayersPos();
    this.adaptMapVisuals(oldX, oldY);
};

BattleManagerTBS.scrollLeft = function(distance) {
    this.scrollRight(-distance);
};

BattleManagerTBS.scrollUp = function(distance) {
    this.scrollDown(-distance);
};

BattleManagerTBS.adaptLayersPos = function() {
    this.movableLayers().forEach(function(layer) {
        layer.x = -$gameMap._displayX * $gameMap.tileWidth();
        layer.y = -$gameMap._displayY * $gameMap.tileHeight();
    });
};

BattleManagerTBS.adaptMapVisuals = function(oldX, oldY) {
    var diffX = oldX - $gameMap._displayX;
    var diffY = oldY - $gameMap._displayY;
    this.mapVisuals().forEach(function(visual) {
        visual.x += diffX * $gameMap.tileWidth();
        visual.y += diffY * $gameMap.tileHeight();
    });
};

BattleManagerTBS.movableLayers = function() {
    return [this.getLayer("scopes"), this.getLayer("ground"), this.getLayer("groundEntities"), this.getLayer("battlers"),
        this.getLayer("animations"), this.getLayer("movableInfo")
    ];
};

BattleManagerTBS.mapVisuals = function() {
    var scene = LeUtilities.getScene();
    return [scene._windowPlacement, scene._windowCommand, scene._windowSkill, scene._windowItem];
};


/*-------------------------------------------------------------------------
* AI Manager
-------------------------------------------------------------------------*/
function TBSAiManager() {
    this.initialize.call(this, arguments);
}

TBSAiManager.prototype.initialize = function() {
    this._entity = null;
    this._battler = null;
    this._commandRunning = null;
    this._ifArray = [];
    this._targetData = null;
    this._cellTarget = null;
    this._failureCode = "";
    this._actionData = null;
};

TBSAiManager.prototype.process = function(entity) {
    this._entity = entity;
    this._battler = entity._battler;
    this._phase = 0;
    this._commands = this.getBehavior().slice();
    this._commandPhase = "init";
    this._commandNextPhaseCallBack = null;
    this._commandExtraData = {};
    this.makeOffenseData();
};

TBSAiManager.prototype.makeOffenseData = function() {
    var user = this._battler;
    var entity = this._entity;
    var center = [entity._cellX, entity._cellY];
    var enemies = this.getEnemiesOf(user, true);
    var offenses = [];
    var movePoints = entity.getMovePoints();
    var skills = this.getUsableSkills(user);
    //console.log("====== ", user.name());
    //console.log("USABLE SKILLS: ", skills);

    var offenseData = [];

    for (var i = 0; i < skills.length; i++) {
        var skill = skills[i];
        if (skill.id === user.attackSkillId() || skill.leTbs_aiOffenseType) {
            offenses.push(skill);
        }
    }

    enemies = enemies.sort(function(enta, entb) {
        var cellaDist = LeUtilities.distanceBetween(enta, entity);
        var cellbDist = LeUtilities.distanceBetween(entb, entity);
        return (cellaDist > cellbDist) ? 1 : ((cellaDist < cellbDist) ? -1 : 0);
    });

    //- For each enemy in the map
    for (var i = 0; i < enemies.length; i++) {
        var enemy = enemies[i];
        //- For each offense usable by the battler
        for (var j = 0; j < offenses.length; j++) {
            var offense = offenses[j];
            /* THE EASIEST BUT SLOW WAY
            var cellToMoveTo = this.getCellToMoveToForAction(entity, enemy, 0, offense, center);
            if (cellToMoveTo) {
                var action = {};
                var reqMp = LeUtilities.distanceBetweenCells(entity.getCell(), cellToMoveTo);
                action.requiredMp = reqMp;
                action.cellToMoveTo = cellToMoveTo;
                action.target = enemy;
                action.userCell = entity.getCell();
                action.obj = offense;
                offenseData.push(action);
            }*/
            var closestCellInAoE = this.getClosestActionCellToTarget(enemy, offense, center);
            var distance = Math.round(LeUtilities.distanceBetweenCells(enemy.getCell(), closestCellInAoE));
            //- If that enemy is reachable by that offense
            if (distance - movePoints <= 0) {
                var reqMp = distance;
                distance = Math.round(LeUtilities.distanceBetweenCells(entity.getCell(), enemy.getCell()));
                var cellToMoveTo = null;
                if (reqMp === 0 && distance <= 1) {
                    // No need to move
                    cellToMoveTo = entity.getCell();
                    //console.log("NO NEED TO MOVE");
                } else {
                    //- Check line of sight
                    cellToMoveTo = this.getCellToMoveToForAction(entity, enemy, reqMp, offense, center);
                }
                //console.log("cellToMoveTo: ", cellToMoveTo);
                if (cellToMoveTo) {
                    var action = {};
                    action.requiredMp = reqMp;
                    action.cellToMoveTo = cellToMoveTo;
                    action.target = enemy;
                    action.userCell = entity.getCell();
                    action.obj = offense;
                    offenseData.push(action);
                }
            }
        }
    }
    this._offenseData = offenseData;
    //console.log("OFFENSEDATA: ", this._offenseData);
};

TBSAiManager.prototype.getClosestActionCellToTarget = function(target, obj, center) {
    var entity = this._entity;
    var data = obj.id === entity._battler.attackSkillId() ? entity.getAttackScopeData() : entity.getObjectScopeData(obj);
    var param = this.BM().makeObjScopeParam(obj);
    var scope = this.BM().getScopeFromData(data, center, param);
    var closestCell = LeUtilities.closestByDistance(target.getCell(), scope);

    var aoeData = obj.id === entity._battler.attackSkillId() ? entity.getAttackAoEData() : entity.getObjectAoEData(obj);
    var aoeCenter = [closestCell.x, closestCell.y];
    var aoe = this.BM().getScopeFromData(aoeData, aoeCenter, {});
    var closestCellInAoE = LeUtilities.closestByDistance(target.getCell(), aoe);
    return closestCellInAoE;
};

TBSAiManager.prototype.getCellToMoveToForAction = function(entity, target, reqMp, obj, center) {
    var movePoints = entity.getMovePoints();
    var moveParam = this.BM().makeMoveScopeParam(entity);
    var moveData = entity.getMoveScopeData();
    var scope = this.BM().getScopeFromData(moveData, center, moveParam, movePoints);

    scope = scope.filter(function(cell) {
        return cell._walkable;// && LeUtilities.distanceBetweenCells(cell, entity.getCell()) === reqMp;
    }.bind(this));

    var cellsToCheck = scope.sort(function(a, b) {
        var obj_aDist = LeUtilities.distanceBetween(a, entity.getCell());
        var obj_bDist = LeUtilities.distanceBetween(b, entity.getCell());
        return (obj_aDist > obj_bDist) ? 1 : ((obj_aDist < obj_bDist) ? -1 : 0);
    }.bind(this));

    var cellToMoveTo = null;
    while (cellsToCheck.length > 0) {
        var cell = cellsToCheck.shift();
        var currentCenter = [cell.x, cell.y];
        var closestCell = this.getClosestActionCellToTarget(target, obj, currentCenter);
        var oldCell = entity.getCell();
        entity.setCell(cell);
        this.BM().checkSingleCellVisibility(closestCell, currentCenter);
        entity.setCell(oldCell);
        if (closestCell.isSame(target.getCell()) && closestCell._scopeVisible) {
            cellToMoveTo = cell;
            break;
        }
    }
    return cellToMoveTo;
};

TBSAiManager.prototype.getBehavior = function() {
    return Lecode.S_TBS.Config.AI["attack"];
};

TBSAiManager.prototype.currentCommand = function() {
    return this._commands[this._phase];
};

TBSAiManager.prototype.nextCommand = function() {
    this._phase++;
    this._commandRunning = null;
    this._commandPhase = "init";
    this._commandNextPhaseCallBack = null;
    this._commandExtraData = {};
};

TBSAiManager.prototype.areConditionsOkay = function() {
    if (this._ifArray.length === 0) return true;
    for (var i = 0; i < this._ifArray.length; i++) {
        if (!this._ifArray[i]) return false;
    }
    return true;
};

TBSAiManager.prototype.update = function() {
    if (this._commandRunning) {
        this.updateRunningCommand();
        return;
    }
    var command = this.currentCommand();
    if (command) {
        this.runCommand(command);
    } else
        this.forceEnd();
};

TBSAiManager.prototype.forceEnd = function() {
    this.BM().processCommandPass();
};

TBSAiManager.prototype.runCommand = function(command) {
    if (command === "else") {
        this.commandElse();
        this.nextCommand();
        return;
    } else if (command === "endif") {
        this.commandEndIf();
        this.nextCommand();
        return;
    }

    if (!command.match(/(.+)\s?:\s?(.+)/i)) {
        this.nextCommand();
        return;
    }

    var main = String(RegExp.$1).trim();
    var paramStr = String(RegExp.$2).trim();
    var param = LeUtilities.stringSplit(paramStr, ",");
    param.forEach(function(p) {
        p = p.trim().replace(" ", "");
    }.bind(this));

    if (main === "if") {
        this.commandIf(paramStr);
        this.nextCommand();
        return;
    }

    if (this.areConditionsOkay()) {
        var functionName = LeUtilities.shrinkTextWithUnderscores(main);
        var func = eval("this.command" + functionName + ".bind(this,param)");
        func();
        this._commandRunning = main;
    } else {
        this.nextCommand();
    }
};

TBSAiManager.prototype.commandIf = function(condition) {
    var user = this._battler;
    var entity = this._entity;
    var canUseOffense = this.func_CanUseOffense.bind(this);
    var isTargetValid = this.func_IsTargetValid.bind(this);
    var chance = this.func_Chance.bind(this);
    var failureCode = this.func_FailureCode.bind(this);
    var battlerInRange = this.func_BattlerInRange.bind(this);
    var distanceBetween = this.func_DistanceBetween.bind(this);
    var isInMeleeWith = this.func_IsInMeleeWith.bind(this);
    var pattern = function(str) {
        return this.func_GetPattern() === str;
    }.bind(this);

    var result = eval(condition);
    this._ifArray.push(result);
};

TBSAiManager.prototype.commandElse = function() {
    this._ifArray[this._ifArray.length - 1] = !this._ifArray.leU_last();
};

TBSAiManager.prototype.commandEndIf = function() {
    this._ifArray.pop();
};

TBSAiManager.prototype.commandWait = function(param) {
    var value = Number(param[0]);
    this.BM().wait(value);
};

TBSAiManager.prototype.commandCallBehavior = function(param) {
    var id = param[0].trim();
    var commands = Lecode.S_TBS.Config.AI[id].slice();
    commands.reverse();
    for (var i = 0; i < commands.length; i++) {
        this._commands.splice(this._phase + 1, 0, commands[i]);
    }
};

TBSAiManager.prototype.commandSearchTarget = function(param) {
    var search = param[0];
    var maxPm = param[1];

    if (maxPm.match(/(.+)%/i))
        maxPm = Number(RegExp.$1) * 0.01 * this._entity.getMovePoints();
    else
        maxPm = Number(maxPm);
    maxPm = Math.floor(maxPm);
    if (LeUtilities.isNumeric(maxPm)) {
        maxPm = Math.floor(maxPm);
        if (maxPm < 1)
            maxPm = 1;
        if (maxPm > this._entity.getMovePoints())
            maxPm = this._entity.getMovePoints();
    }

    var data;
    if (search.match(/enemy/i))
        data = this._offenseData;

    var group = this.getGroupFromActionData(data, maxPm);
    if (!group || group.length === 0) {
        this._targetData = null;
        return;
    }

    if (search.match(/lowest/i)) {
        group = group.sort(function(a, b) {
            a = a._battler;
            b = b._battler;
            return (a.hpRate() > b.hpRate()) ? 1 : ((a.hpRate() < b.hpRate()) ? -1 : 0);
        });
    } else if (search.match(/closest/i)) {
        group = group.sort(function(a, b) {
            var obj_aDist = LeUtilities.distanceBetween(a, this._entity);
            var obj_bDist = LeUtilities.distanceBetween(b, this._entity);
            return (obj_aDist > obj_bDist) ? 1 : ((obj_aDist < obj_bDist) ? -1 : 0);
        }.bind(this));
    }

    this._targetData = null;
    //- Make sure the target is reachable (previously calculated, taken into account when making action data)
    var entity = group[0];
    //console.log("SELECTED TARGET = ", entity._battler.name());
    for (var i = 0; i < data.length; i++) {
        var action = data[i];
        if (action.target === entity) {
            this._targetData = {};
            this._targetData.userCell = action.userCell;
            this._targetData.entity = entity;
            break;
        }
    }
};

TBSAiManager.prototype.commandDrawMoveScope = function(param) {
    this.BM().drawMoveScope(this._entity, this._entity.getMovePoints());
};

TBSAiManager.prototype.commandMove = function(param) {
    var search = param[0];
    var maxPm = param[1];

    if (!this._entity.canMoveCommand()) return;

    if (maxPm.match(/(.+)%/i))
        maxPm = Number(RegExp.$1) * 0.01 * this._entity.getMovePoints();
    else if (maxPm.match(/minimum/i))
        maxPm = "minimum";
    else
        maxPm = Number(maxPm);
    if (LeUtilities.isNumeric(maxPm)) {
        maxPm = Math.floor(maxPm);
        if (maxPm < 1)
            maxPm = 1;
        if (maxPm > this._entity.getMovePoints())
            maxPm = this._entity.getMovePoints();
    }

    this.commandDrawMoveScope();
    var wait = Lecode.S_TBS.aiWaitTime;
    this.BM().wait(wait);

    this._commandPhase = "move_scope_wait";
    this._commandNextPhaseCallBack = this.commandMoveP2.bind(this, param, search, maxPm);
};

TBSAiManager.prototype.commandMoveP2 = function(param, search, maxPm) {
    var target;
    if (search.match(/toward_target/i))
        target = this._targetData.entity;
    else if (search.match(/enemies/i)) {
        target = LeUtilities.closestByDistance(this._entity, this.getEnemiesOf(this._battler, true));
    } else if (search.match(/allies/i)) {
        target = LeUtilities.closestByDistance(this._entity, this.getAlliesOf(this._battler, true));
    }

    if (maxPm === "minimum") {
        maxPm = this._actionData.requiredMp;
    }

    var scope = this.BM().moveScope().cells;
    scope = scope.filter(function(cell) {
        return cell._walkable && LeUtilities.distanceBetweenCells(cell, this._entity.getCell()) <= maxPm;
    }.bind(this));

    var closestCell;
    if (search.match(/toward/i))
        closestCell = LeUtilities.closestByDistance(target.getCell(), scope);
    else
        closestCell = LeUtilities.farestByDistance(target.getCell(), scope);

    this.BM().setCursorCell(closestCell);
    var wait = Lecode.S_TBS.aiWaitTime;
    this.BM().wait(wait);

    this._commandPhase = "move_selection_wait";
    this._commandNextPhaseCallBack = this.commandMoveP3.bind(this);
    this._commandExtraData.destCell = closestCell;
    this._commandExtraData.savedParams = param.splice();
};

TBSAiManager.prototype.commandMoveP3 = function() {
    this._entity.processMovement(this.BM().movePath());
    this._commandPhase = "moving";
};

TBSAiManager.prototype.commandMoveForAction = function(param) {
    var cellToMoveTo = this._actionData.cellToMoveTo;
    if (cellToMoveTo.isSame(this._entity.getCell()))
        return;
    this.commandDrawMoveScope();
    var wait = Lecode.S_TBS.aiWaitTime;
    this.BM().wait(wait);

    this._commandPhase = "move_scope_wait";
    this._commandNextPhaseCallBack = this.commandMoveForActionP2.bind(this);
};

TBSAiManager.prototype.commandMoveForActionP2 = function() {
    var cellToMoveTo = this._actionData.cellToMoveTo;

    this.BM().setCursorCell(cellToMoveTo);
    var wait = Lecode.S_TBS.aiWaitTime;
    this.BM().wait(wait);

    this._commandPhase = "move_selection_wait";
    this._commandNextPhaseCallBack = this.commandMoveP3.bind(this);
    this._commandExtraData.destCell = cellToMoveTo;
    this._commandExtraData.savedParams = param;
};

TBSAiManager.prototype.commandSetAction = function(param) {
    var type = param[0];
    var priority = param[1];

    var searchedTarget = this._targetData.entity;
    var possibilities = [];

    if (type.match(/damage/i)) {
        var data = this._offenseData;
        for (var i = 0; i < data.length; i++) {
            var action = data[i];
            if (action.target === searchedTarget) {
                possibilities.push(action);
            }
        }
        possibilities = this.sortActionsByDmg(possibilities);
    }

    var action;
    if (type.match(/average/i)) {
        if (possibilities.length < 2) {
            action = possibilities[0];
        } else {
            var array = [];
            for (var i = 1; i < possibilities.length - 1; i++) {
                array.push(possibilities[i]);
            }
            action = LeUtilities.getRandomValueInArray(array);
        }
    } else if (type.match(/best/i)) {
        action = possibilities[0];
    } else {
        action = possibilities.leU_last();
    }

    this._actionData = action;
};

TBSAiManager.prototype.sortActionsByDmg = function(actionsData) {
    return actionsData.sort(function(data1, data2) {
        var obj1 = data1.obj;
        var obj2 = data2.obj;
        var dummyAction1 = new Game_Action(this._battler, false);
        dummyAction1.setItemObject(obj1);
        var dummyAction2 = new Game_Action(this._battler, false);
        dummyAction2.setItemObject(obj2);
        var value1 = dummyAction1.evaluate();
        var value2 = dummyAction2.evaluate();
        return (value1 < value2) ? 1 : ((value1 > value2) ? -1 : 0);
    }.bind(this));
};

TBSAiManager.prototype.commandUse = function(param) {
    var info = param[0];

    if (!this._entity.canObjCommand()) return;

    var obj;
    if (info.match(/defined_action/i))
        obj = this._actionData.obj;

    if (obj) {
        this.BM().activeAction().setItemObject(obj);
        if (this.BM().activeAction().isAttack())
            this.BM().drawAttackScope(this._entity);
        else
            this.BM().drawSkillScope(this._entity, obj);
        var wait = 40;
        this.BM().wait(wait);

        this._commandPhase = "obj_scope_wait";
        this._commandNextPhaseCallBack = this.commandUseP2.bind(this, obj);
    }
};

TBSAiManager.prototype.commandUseP2 = function(obj) {
    var enemy = this._targetData.entity;
    var center = [this._entity._cellX, this._entity._cellY];
    var cell = this.getClosestActionCellToTarget(enemy, obj, center);

    this.BM().setCursorCell(cell);
    this.BM().updateActionSelection();
    this._entity.lookAt(cell);
    var wait = Lecode.S_TBS.aiWaitTime;
    this.BM().wait(wait);

    this._commandPhase = "obj_selection_wait";
    this._commandNextPhaseCallBack = this.commandUseP3.bind(this, obj);
};

TBSAiManager.prototype.commandUseP3 = function(obj) {
    this.BM().getLayer("scopes").clear();
    this.BM().clearActionSelection();
    this.BM().processAction();
    BattleManagerTBS._subPhase = "ai";
    this._commandPhase = "invoking";
};

TBSAiManager.prototype.commandPass = function(param) {
    var look = param[0];
    switch (look) {
        case "look_closest_enemy":
            this._entity.lookClosestBattler(this.getEnemiesOf(this._battler, true));
            break;
        case "look_closest_ally":
            this._entity.lookClosestBattler(this.getAlliesOf(this._battler, true));
            break;
    }
    this.BM().processCommandPass();
};

TBSAiManager.prototype.commandScript = function(param) {
    var script = param[0];
    eval(script);
};

TBSAiManager.prototype.updateRunningCommand = function() {
    var functionName = LeUtilities.shrinkTextWithUnderscores(this._commandRunning);
    var func = eval("this.updateCommand" + functionName);
    if (func) {
        func.call(this);
    } else {
        this.nextCommand();
    }
    /*switch(this._commandRunning) {
    	case "wait":
    		this.updateCommandWait();
    		break;
    	case "move":
    		this.updateCommandMove();
    		break;
    	case "move_for_action":
    		this.updateCommandMoveForAction();
    		break;
    	case "use":
    		this.updateCommandUse();
    		break;
    	default:
    		this.nextCommand();
    		break;
    }*/
};

TBSAiManager.prototype.updateCommandWait = function() {
    if (!this.BM().isWaiting())
        this.nextCommand();
};

TBSAiManager.prototype.updateCommandMove = function() {
    var phase = this._commandPhase;
    switch (phase) {
        case "move_scope_wait":
        case "move_selection_wait":
            if (!this.BM().isWaiting())
                this._commandNextPhaseCallBack();
            break;
        case "moving":
            if (!this._entity.isMoving()) {
                this.BM().onActiveEntityMoveEnd();
                this.BM()._subPhase = "ai";
                if (this._entity.getCell() === this._commandExtraData.destCell)
                    this.nextCommand();
                else
                    this.commandMove(this._commandExtraData.savedParams);
            }
            break;
        default:
            this.nextCommand();
            break;
    }
};

TBSAiManager.prototype.updateCommandMoveForAction = function() {
    var phase = this._commandPhase;
    switch (phase) {
        case "move_scope_wait":
        case "move_selection_wait":
            if (!this.BM().isWaiting())
                this._commandNextPhaseCallBack();
            break;
        case "moving":
            if (!this._entity.isMoving()) {
                this.BM().onActiveEntityMoveEnd();
                this.BM()._subPhase = "ai";
                if (this._entity.getCell() === this._commandExtraData.destCell)
                    this.nextCommand();
                else
                    this.commandMoveForAction();
            }
            break;
        default:
            this.nextCommand();
            break;
    }
};

TBSAiManager.prototype.updateCommandUse = function() {
    var phase = this._commandPhase;
    switch (phase) {
        case "obj_scope_wait":
        case "obj_selection_wait":
            if (!this.BM().isWaiting())
                this._commandNextPhaseCallBack();
            break;
        case "invoking":
            if (!this.BM().anySequenceRunning()) {
                this.BM().onActionEnd();
                this.BM()._subPhase = "ai";
                this.nextCommand();
            }
            break;
        default:
            this.nextCommand();
            break;
    }
};

TBSAiManager.prototype.BM = function() {
    return BattleManagerTBS;
};

TBSAiManager.prototype.func_Chance = function(value) {
    return Math.random() < value * 0.01;
};

TBSAiManager.prototype.func_IsTargetValid = function() {
    return this._targetData != null;
};

TBSAiManager.prototype.func_FailureCode = function() {
    console.log("Code: ", this._failureCode);
    return this._failureCode;
};

TBSAiManager.prototype.func_CanUseOffense = function() {
    //this._failureCode = "";
    if (this.getUsableSkills(this._battler).length === 0) {
        this._failureCode = "no_usable_skill";
        return false;
    }
    if (this._offenseData.length <= 0) {
        this._failureCode = "out_of_range";
        return false;
    }
    return true;
};

TBSAiManager.prototype.func_BattlerInRange = function(target, action) {
    var entity, obj;
    if (action.match(/defined_action/i)) {
        if (this._actionData)
            obj = this._actionData.obj;
        else
            return false;
    }
    if (target.match(/defined_target/i)) {
        if (this._targetData)
            entity = this._targetData.entity;
        else
            return false;
    }

    var data = (obj.id === this._battler.attackSkillId()) ? this._entity.getAttackScopeData() : this._entity.getObjectScopeData(obj);
    var param = this.BM().makeObjScopeParam(obj);
    var center = [this._entity._cellX, this._entity._cellY];
    var scope = this.BM().getScopeFromData(data, center, param);
    for (var i = 0; i < scope.length; i++) {
        var cell = scope[i];
        if (entity.getCell().isSame(cell)) {
            return true;
        }
    }
    return false;
};

TBSAiManager.prototype.func_DistanceBetween = function(target) {
    var entity;
    if (target.match(/defined_target/i)) {
        if (this._targetData)
            entity = this._targetData.entity;
        else
            return false;
    }
    return LeUtilities.distanceBetweenCells(entity.getCell(), this._entity.getCell());
};

TBSAiManager.prototype.func_IsInMeleeWith = function(target) {
    return this.func_DistanceBetween(target) <= 1;
};

TBSAiManager.prototype.func_GetPattern = function() {
    return this._entity.getAiPattern();
};

TBSAiManager.prototype.getEnemiesOf = function(battler, needAlive) {
    var group = battler.isActor() ? this.BM().enemyEntities() : this.BM().allyEntities();
    if (needAlive) {
        return group.filter(function(ent) {
            return !ent.battler().isDead();
        });
    } else {
        return group;
    }
};

TBSAiManager.prototype.getAlliesOf = function(battler) {
    var group = battler.isEnemy() ? this.BM().enemyEntities() : this.BM().allyEntities();
    if (needAlive) {
        return group.filter(function(ent) {
            return !ent.battler().isDead();
        });
    } else {
        return group;
    }
};

TBSAiManager.prototype.getUsableSkills = function(user) {
    if (user.isActor())
        return user.usableSkills();
    var actionList = user.enemy().actions.filter(function(a) {
        return user.isActionValid(a);
    });
    var skills = [];
    for (var i = 0; i < actionList.length; i++) {
        var action = actionList[i];
        skills.push($dataSkills[action.skillId]);
    }
    return skills;
};

TBSAiManager.prototype.getGroupFromActionData = function(data, maxPm) {
    var group = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].requiredMp <= maxPm) {
            var target = data[i].target;
            if (!target._battler.isDead())
                group.push(data[i].target);
        }
    }
    return group;
};


/*-------------------------------------------------------------------------
* Sequence Manager
-------------------------------------------------------------------------*/
function TBSSequenceManager() {
    this.initialize.call(this, arguments);
}

TBSSequenceManager.prototype.initialize = function() {
    this._sequence = null;
    this._commandRunning = null;
    this._waitRequested = false;
    this._users = [];
    this._lastBattlerTargets = [];
    this._lastCellTargets = [];
    this._sequenceQueue = [];
    this._obj = null;
};

TBSSequenceManager.prototype.start = function(sequence, user, action) {
    this._sequence = this.parseSequence(sequence).slice();
    this._commandRunning = null;
    this._sequenceQueue = [];
    this._users = [user];
    if (action)
        this._obj = action.item();
};

TBSSequenceManager.prototype.append = function(sequence, user) {
    this._sequenceQueue.push([sequence, user]);
};

TBSSequenceManager.prototype.getUser = function() {
    return this._users.leU_last();
};

TBSSequenceManager.prototype.getObj = function() {
    return this._obj;
};

TBSSequenceManager.prototype.parseSequence = function(sequence) {
    if (sequence instanceof Array) return sequence;
    sequence = sequence.replace("\n", "");
    return LeUtilities.stringSplit(sequence, ";");
};

TBSSequenceManager.prototype.update = function() {
    if (!this.isRunning()) return;
    if (this._commandRunning) {
        this.updateRunningCommand();
        return;
    }
    var command = this._sequence.shift();
    if (command) {
        this.runCommand(command);
    } else
        this.endOfSequence();
};

TBSSequenceManager.prototype.runCommand = function(command) {
    if (!command.match(/(.+)\s?:\s?(.+)/i)) return;
    var main = String(RegExp.$1).trim(),
        param = LeUtilities.stringSplit(String(RegExp.$2).trim(), ",");
    for (var i = 0; i < param.length; i++) {
        param[i] = param[i].trim();
    }

    this._waitRequested = false;
    var functionName = LeUtilities.shrinkTextWithUnderscores(main);
    var func = eval("this.command" + functionName + ".bind(this,param)");
    func();

    this._commandRunning = main;
};

TBSSequenceManager.prototype.commandPlayPose = function(param) {
    var targetData = param[0];
    var pose = param[1];
    var afterPose = param[2];
    var wait = false;
    if (afterPose === "true") {
        wait = true;
        afterPose = null;
    }
    var targets = this.readTargets(targetData);

    targets.forEach(function(target) {
        target.requestPlayPose();
        target.setPose(pose, afterPose);
    }.bind(this));

    this._waitRequested = wait;
};

TBSSequenceManager.prototype.commandSetFrame = function(param) {
    var targetData = param[0];
    var pose = param[1];
    var frame = param[2];
    var targets = this.readTargets(targetData);

    targets.forEach(function(target) {
        target.setFixedPose(pose, frame);
    }.bind(this));
};

TBSSequenceManager.prototype.commandSetSpeed = function(param) {
    var targetData = param[0];
    var value = param[1];
    var targets = this.readTargets(targetData);

    if (value === "reset") {
        targets.forEach(function(target) {
            target.initializeSpeed();
        }.bind(this));
    } else if (value.match(/\+(.+)/i)) {
        targets.forEach(function(target) {
            target.changeSpeed(Number(RegExp.$1));
        }.bind(this));
    } else if (value.match(/\-(.+)/i)) {
        targets.forEach(function(target) {
            target.changeSpeed(-Number(RegExp.$1));
        }.bind(this));
    } else {
        targets.forEach(function(target) {
            target.setSpeed(Number(value));
        }.bind(this));
    }
};

TBSSequenceManager.prototype.commandSetFrameDelay = function(param) {
    var targetData = param[0];
    var value = param[1];
    var targets = this.readTargets(targetData);


    if (value === "reset") {
        targets.forEach(function(target) {
            target.sprite().initializeFrameDelay();
        }.bind(this));
    } else if (value.match(/\+(.+)/i)) {
        targets.forEach(function(target) {
            target.sprite().changeFrameDelay(Number(RegExp.$1));
        }.bind(this));
    } else if (value.match(/\-(.+)/i)) {
        targets.forEach(function(target) {
            target.sprite().changeFrameDelay(-Number(RegExp.$1));
        }.bind(this));
    } else {
        targets.forEach(function(target) {
            target.sprite().setFrameDelay(Number(value));
        }.bind(this));
    }
};

TBSSequenceManager.prototype.commandSpriteShake = function(param) {
    var targetData = param[0];
    var power = Number(param[1]);
    var duration = Number(param[2]);
    var wait = (param[3] === "true");
    var targets = this.readTargets(targetData);

    for (var i = 0; i < targets.length; i++) {
        targets[i].startShake(power, duration);
    }
    if (wait) {
        this.commandWait([duration]);
    }
};

TBSSequenceManager.prototype.commandWait = function(param) {
    var duration = Number(param[0]);

    BattleManagerTBS.wait(duration);
};

TBSSequenceManager.prototype.commandEffects = function(param) {
    var targetData = param[0];
    var objData = param[1];
    var obj = this.readObject(objData);
    var hitAnim = param[2] || null;
    var animDelay = Number(param[3] || 0);
    var wait = String(param[4] || "false");
    wait = (wait === "true");
    var targets = this.readTargets(targetData);

    if (hitAnim && hitAnim.match(/obj_anim/i)) {
        if (BattleManagerTBS.activeAction().isAttack())
            hitAnim = BattleManagerTBS.activeEntity().getAttackAnimation();
        else
            hitAnim = BattleManagerTBS.activeAction().item().animationId;
    }
    BattleManagerTBS.applyObjEffects(this.getUser(), obj, targets, hitAnim, animDelay);

    this._waitRequested = wait;
};

TBSSequenceManager.prototype.commandMapEffects = function(param) {
    var targetData = param[0];
    var objData = param[1];
    var obj = this.readObject(objData);
    var hitAnim = param[2] || null;
    var animDelay = Number(param[3] || 0);
    var wait = String(param[4] || "false");
    wait = (wait == "true");
    var cellTargets = this.readCellTargets(targetData);

    if (hitAnim && hitAnim.match(/obj_anim/i)) {
        if (BattleManagerTBS.activeAction().isAttack())
            hitAnim = BattleManagerTBS.activeEntity().getAttackAnimation();
        else
            hitAnim = BattleManagerTBS.activeAction().item().animationId;
    }
    BattleManagerTBS.applyObjEffectsOnMap(this.getUser(), obj, cellTargets, hitAnim, animDelay);

    this._waitRequested = wait;
};

TBSSequenceManager.prototype.commandPerformCollapse = function(param) {
    var targetData = param[0];
    var targets = this.readTargets(targetData);

    for (var i = 0; i < targets.length; i++) {
        targets[i].battler().performCollapse();
    }
};

TBSSequenceManager.prototype.commandAnim = function(param) {
    var targetData = param[0];
    var anim = param[1];
    var animDelay = Number(param[2] || 0);
    var wait = String(param[3] || "false");
    wait = (wait == "true");
    var targets = this.readTargets(targetData);

    if (anim.match(/obj_anim/i)) {
        if (BattleManagerTBS.activeAction().isAttack())
            anim = BattleManagerTBS.activeEntity().getAttackAnimation();
        else
            anim = BattleManagerTBS.activeAction().item().animationId;
    } else if (anim.match(/collapse_anim/i)) {
        var collapse_anim = true;
    } else {
        anim = Number(anim);
    }

    targets.forEach(function(target) {
        if (collapse_anim)
            anim = target.getCollapseAnimation();
        BattleManagerTBS.getLayer("animations").newAnimation(anim, false, animDelay, target.getCell(), target._sprite);
    }.bind(this));

    this._waitRequested = wait;
};

TBSSequenceManager.prototype.commandMapAnim = function(param) {
    var targetData = param[0];
    var anim = param[1];
    var animDelay = Number(param[2] || 0);
    var wait = String(param[3] || "false");
    wait = (wait == "true");
    var cellTargets = this.readCellTargets(targetData);

    if (anim.match(/obj_anim/i)) {
        if (BattleManagerTBS.activeAction().isAttack())
            anim = BattleManagerTBS.activeEntity().getAttackAnimation();
        else
            anim = BattleManagerTBS.activeAction().item().animationId;
    } else {
        anim = Number(anim);
    }
    cellTargets.forEach(function(cell) {
        BattleManagerTBS.getLayer("animations").newAnimation(anim, false, animDelay, cell);
    }.bind(this));

    this._waitRequested = wait;
};

TBSSequenceManager.prototype.commandDirectionalAnim = function(param) {
    var targetData1 = param[0];
    var targetData2 = param[1];
    var anim_2 = param[2];
    var anim_4 = param[3];
    var anim_6 = param[4];
    var anim_8 = param[5];
    var animDelay = Number(param[6] || 0);
    var wait = String(param[7] || "false");
    var targets1 = this.readTargets(targetData1);

    if (targets1.length > 0) {
        var anim;
        switch (targets1[0].getDir()) {
            case 2:
                anim = anim_2;
                break;
            case 4:
                anim = anim_4;
                break;
            case 6:
                anim = anim_6;
                break;
            case 8:
                anim = anim_8;
                break;
        }
        param[0] = targetData2;
        param[1] = anim;
        param[2] = animDelay;
        param[3] = wait;
        this.commandAnim(param);
    }
};

TBSSequenceManager.prototype.commandLookAt = function(param) {
    var targetData = param[0];
    var cellTargetData = param[1];
    var targets = this.readTargets(targetData);
    var cellTargets = this.readCellTargets(cellTargetData);

    if (cellTargets.length > 0) {
        var cell = cellTargets[0];
        targets.forEach(function(target) {
            target.lookAt(cell);
        }.bind(this));
    }
};

TBSSequenceManager.prototype.commandLookAway = function(param) {
    var targetData = param[0];
    var cellTargetData = param[1];
    var targets = this.readTargets(targetData);
    var cellTargets = this.readCellTargets(cellTargetData);

    if (cellTargets.length > 0) {
        var cell = cellTargets[0];
        targets.forEach(function(target) {
            target.lookAway(cell);
        }.bind(this));
    }
};

TBSSequenceManager.prototype.commandMoveToCell = function(param) {
    var targetData = param[0];
    var cellTargetData = param[1];
    var isInstant = String(param[2] || "false");
    isInstant = (isInstant.match(/true/i));
    var targets = this.readTargets(targetData);
    var cellTargets = this.readCellTargets(cellTargetData);

    if (targets.length > 0 && cellTargetData.length > 0) {
        var target = targets[0];
        var cell = cellTargets[0];
        if (isInstant) {
            target.teleport(cell);
        } else {
            var path = BattleManagerTBS.getPathFromAToB(target._cellX, target._cellY, cell.x, cell.y, true);
            target.processMovement(path);
            this._waitRequested = true;
        }
    }
};

TBSSequenceManager.prototype.commandJumpToCell = function(param) {
    var targetData = param[0];
    var cellTargetData = param[1];
    var height = param[2] || 120;
    var targets = this.readTargets(targetData);
    var cellTargets = this.readCellTargets(cellTargetData);

    if (targets.length > 0 && cellTargetData.length > 0) {
        var target = targets[0];
        var cell = cellTargets[0];
        var sx = target.x;
        var sy = target.y;
        var dx = cell.x * $gameMap.tileWidth();
        var dy = cell.y * $gameMap.tileHeight();
        var trajectory = LeUtilities.getPixelsOfJump(sx, sy, dx, dy, height);
        target.followTrajectory(trajectory, cell);
        this._waitRequested = true;
    }

};

TBSSequenceManager.prototype.commandMoveStraight = function(param) {
    var targetData = param[0];
    var nbr = Number(param[1] || 1);
    var targets = this.readTargets(targetData);

    targets.forEach(function(target) {
        target.forceMoveStraight(nbr,false);
    }.bind(this));
    this._waitRequested = true;
};

TBSSequenceManager.prototype.commandPush = function(param) {
    var targetData = param[0];
    var targetData2 = param[1];
    var distance = Number(param[2]);
    var damage = !param[3] || param[3] === "false";
    var targets = this.readTargets(targetData);
    var sourceCell = this.readCellTargets(targetData2)[0];

    for (var i = 0; i < targets.length; i++) {
        var entity = targets[i];
        entity.forcePush(this.getUser(), sourceCell, distance, this.getObj(), damage);
    }
};

TBSSequenceManager.prototype.commandPull = function(param) {
    var targetData = param[0];
    var targetData2 = param[1];
    var distance = Number(param[2]);
    var damage = !param[3] || param[3] === "false";
    var targets = this.readTargets(targetData);
    var sourceCell = this.readCellTargets(targetData2)[0];

    for (var i = 0; i < targets.length; i++) {
        var entity = targets[i];
        entity.forcePull(this.getUser(), sourceCell, distance, this.getObj(), damage);
    }
};

TBSSequenceManager.prototype.commandProjectile = function(param) {
    var id = param[0];
    var cellTargetData1 = param[1];
    var cellTargetData2 = param[2];
    var cellTargets1 = this.readCellTargets(cellTargetData1);
    var cellTargets2 = this.readCellTargets(cellTargetData2);

    if (cellTargets1.length > 0 && cellTargets2.length > 0) {
        var cellStart = cellTargets1[0];
        var cellEnd = cellTargets2[0];
        var w = $gameMap.tileWidth();
        var h = $gameMap.tileHeight();
        var sx = cellStart.x * w + w / 2;
        var sy = cellStart.y * h + h / 2;
        var dx = cellEnd.x * w + w / 2;
        var dy = cellEnd.y * h + h / 2;
        BattleManagerTBS._projectilesManager.newProjectile(id, [sx, sy], [dx, dy]);
    }
};

TBSSequenceManager.prototype.commandSetBattlerTargets = function(param) {
    var targetData = param[0];
    var targets = this.readTargets(targetData);
    this._lastBattlerTargets = targets;
};

TBSSequenceManager.prototype.commandSetCellTargets = function(param) {
    var targetData = param[0];
    var targets = this.readCellTargets(targetData);
    this._lastCellTargets = targets;
};

TBSSequenceManager.prototype.commandCall = function(param) {
    var seq = param[0];
    var times = Number(param[1] || 1);

    var seqArray = Lecode.S_TBS.Config.Sequences[seq].slice();
    for (var i = 0; i < times; i++) {
        for (var j = seqArray.length - 1; j >= 0; j--) {
            var command = seqArray[j];
            this._sequence.unshift(command);
        }
    }
};

TBSSequenceManager.prototype.commandDelegateCall = function(param) {
    var seq = param[0];
    var targetData = param[1];
    var targets = this.readTargets(targetData);

    if (targets.length > 0) {
        this._users.push(targets[0]);
        param[1] = 1;
        this.commandCall(param);
    }
};

TBSSequenceManager.prototype.commandEndDelegatedCall = function() {
    this._users.pop();
};

TBSSequenceManager.prototype.commandAskCall = function(param) {
    var seq = param[0];
    var targetData = param[1];
    var targets = this.readTargets(targetData);

    for (var i = 0; i < targets.length; i++) {
        targets[i].startSequence(seq);
    }
};

TBSSequenceManager.prototype.commandScript = function(param) {
    var code = param[0];
    var user = this.getUser();
    eval(code);
};

TBSSequenceManager.prototype.updateRunningCommand = function() {
    var command = this._commandRunning;
    switch (command) {
        case "wait":
            this.updateCommandWait();
            break;
        case "play_pose":
            this.updateCommandPlayPose();
            break;
        case "anim":
        case "map_anim":
        case "effects":
        case "map_effects":
            this.updateCommandAnim();
            break;
        case "move_to_cell":
            this.updateCommandMoveToCell();
            break;
        case "move_straight":
            this.updateCommandMoveStraight();
            break;
        case "jump_to_cell":
            this.updateCommandJumpToCell();
            break;
        case "projectile":
            this.updateCommandProjectile();
            break;
        default:
            this._commandRunning = null;
            break;
    }
};

TBSSequenceManager.prototype.updateCommandWait = function() {
    if (!BattleManagerTBS.isWaiting())
        this._commandRunning = null;
};

TBSSequenceManager.prototype.updateCommandPlayPose = function() {
    if (this._waitRequested) {
        var entities = BattleManagerTBS.battlerEntities();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (!entity.isRequestedPosePlayed())
                return;
        }
        this._commandRunning = null;
        this.update();
    } else
        this._commandRunning = null;
};

TBSSequenceManager.prototype.updateCommandAnim = function() {
    if (this._waitRequested) {
        if (!BattleManagerTBS.getLayer("animations").isAnimationPlaying())
            this._commandRunning = null;
    } else
        this._commandRunning = null;
};

TBSSequenceManager.prototype.updateCommandMoveToCell = function() {
    if (this._waitRequested) {
        var entities = BattleManagerTBS.battlerEntities();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.isMoving())
                return;
        }
        this._commandRunning = null;
    } else
        this._commandRunning = null;
};

TBSSequenceManager.prototype.updateCommandMoveStraight = function() {
    if (this._waitRequested) {
        var entities = BattleManagerTBS.battlerEntities();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity.isMoving())
                return;
        }
        this._commandRunning = null;
    } else
        this._commandRunning = null;
};

TBSSequenceManager.prototype.updateCommandJumpToCell = function() {
    if (this._waitRequested) {
        var entities = BattleManagerTBS.battlerEntities();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (entity._sprite.hasTrajectory())
                return;
        }
        this._commandRunning = null;
    } else
        this._commandRunning = null;
};

TBSSequenceManager.prototype.updateCommandProjectile = function() {
    if (!BattleManagerTBS._projectilesManager.isRunning())
        this._commandRunning = null;
};

TBSSequenceManager.prototype.readTargets = function(data) {
    var targets = [];
    if (data.match(/aoe_all_(.+)/i)) {
        var info = String(RegExp.$1);
        BattleManagerTBS._actionAoE.forEach(function(cell) {
            var target = cell.getEntity();
            if (target != null) {
                if (info.match(/battlers/i) || info.match(/allies/i) && target.battler().isActor() || info.match(/enemies/i) && !target.battler().isActor())
                    targets.push(target);
            }
        }.bind(this));
    } else if (data.match(/(\d+)_random_battlers_in_aoe/i)) {
        var battlersInAoe = [];
        BattleManagerTBS._actionAoE.forEach(function(cell) {
            var entity = cell.getEntity();
            if (entity)
                battlersInAoe.push(entity);
        }.bind(this));
        targets = LeUtilities.getXRandomValuesInArray(battlersInAoe, Number(RegExp.$1));
    } else if (data.match(/battler_toward_user/i)) {
        var cell = this.getUser().getForwardCell();
        if (cell) {
            var target = cell.getEntity();
            if (target)
                targets = [target];
        }
    } else if (data.match(/user/i)) {
        targets = [this.getUser()];
    } else if (data.match(/last_battler_targets/i)) {
        targets = this._lastBattlerTargets;
    } else if (data.match(/(.+)_at_distance_(.+)_from_(.+)/i)) {
        var info = String(RegExp.$1);
        var maxDist = Number(RegExp.$2);
        var cell = this.readCellTargets(String(RegExp.$3))[0];
        BattleManagerTBS.allEntities().forEach(function(entity) {
            if (info.match(/battlers/i) || info.match(/allies/i) && entity.battler().isActor() || info.match(/enemies/i) && !entity.battler().isActor()) {
                var distance = LeUtilities.distanceBetweenCells(cell, entity.getCell());
                if (distance <= maxDist)
                    targets.push(entity);
            }
        });
    }

    if (data.match(/-user/i)) {
        var ux = this.getUser()._cellX;
        var uy = this.getUser()._cellY;
        targets = targets.filter(function(entity) {
            return entity._cellX != ux || entity._cellY != uy;
        }.bind(this));
    }
    this._lastBattlerTargets = targets;
    return targets;
};

TBSSequenceManager.prototype.readCellTargets = function(data) {
    var targets = [];
    if (data.match(/(\d+)_random_cells_in_aoe/i)) {
        var cells = BattleManagerTBS._actionAoE;
        var randomCells = LeUtilities.getXRandomValuesInArray(cells, Number(RegExp.$1));
        targets = randomCells;
    } else if (data.match(/aoe/i)) {
        targets = BattleManagerTBS._actionAoE;
    } else if (data.match(/cursor_cell/i)) {
        var x = BattleManagerTBS.cursor().cellX;
        var y = BattleManagerTBS.cursor().cellY;
        targets = [BattleManagerTBS.getCellAt(x, y)];
    } else if (data.match(/user_cell/i)) {
        var x = this.getUser()._cellX;
        var y = this.getUser()._cellY;
        targets = [BattleManagerTBS.getCellAt(x, y)];
    }

    if (data.match(/-user_cell/i)) {
        targets = targets.filter(function(cell) {
            return !this.getUser().getCell().isSame(cell);
        }.bind(this));
    }
    this._lastCellTargets = targets;
    return targets;
};

TBSSequenceManager.prototype.readObject = function(data) {
    if (data.match(/current_obj/i))
        return BattleManagerTBS.activeAction().item();
    return null;
};

TBSSequenceManager.prototype.endOfSequence = function() {
    this._sequence = null;
    var data = this._sequenceQueue.shift();
    if (data) {
        this.start(data[0], data[1]);
        this.update();
    }
};

TBSSequenceManager.prototype.isRunning = function() {
    return this._sequence != null;
};

/*-------------------------------------------------------------------------
* TBSProjectilesManager
-------------------------------------------------------------------------*/
function TBSProjectilesManager() {
    this.initialize.apply(this, arguments);
}

TBSProjectilesManager.prototype.initialize = function(layer) {
    this._layer = layer;
    this._projectiles = [];
    this._running = false;
};

TBSProjectilesManager.prototype.isRunning = function() {
    return this._projectiles.length > 0;
};

TBSProjectilesManager.prototype.newProjectile = function(id, start, end) {
    var proj = new TBSProjectileSprite(id, start, end);
    this._projectiles.push(proj);
    this._layer.addChild(proj);
};

TBSProjectilesManager.prototype.update = function() {
    //this.updateProjectiles();
    this.destoryProjectiles();
};

TBSProjectilesManager.prototype.updateProjectiles = function() {
    for (var i = 0; i < this._projectiles.length; i++) {
        this._projectiles[i].update();
    }
};

TBSProjectilesManager.prototype.destoryProjectiles = function() {
    this._projectiles = this._projectiles.filter(function(proj) {
        if (proj.finished()) {
            this._layer.removeChild(proj);
            return false;
        }
        return true;
    }.bind(this));
};

/*-------------------------------------------------------------------------
* TBSProjectileSprite
-------------------------------------------------------------------------*/
function TBSProjectileSprite() {
    this.initialize.apply(this, arguments);
}
TBSProjectileSprite.prototype = Object.create(Sprite_Base.prototype);
TBSProjectileSprite.prototype.constructor = TBSProjectileSprite;

TBSProjectileSprite.prototype.initialize = function(id, start, end) {
    Sprite_Base.prototype.initialize.call(this);
    this._start = start;
    this._end = end;
    this._trajectory = [];
    this._speedFrame = 0;
    this.readData(id);
    this.iniPositions();
    this.makeTrajectory();
};

TBSProjectileSprite.prototype.readData = function(id) {
    var data = Lecode.S_TBS.Config.Projectiles[id];
    if (data.filename) {
        var bitmap = ImageManager.loadLeTBSProjectile(data.filename);
        this.bitmap = bitmap;
    } else if (data.anim) {
        this.bitmap = new Bitmap(data.anim[1], data.anim[2]);
        this.startAnimation(data.anim[0]);
    }
    this._speed = data.speed || 3;
    this._adaptAngle = false || data.adapt_angle;
    this._jump = data.jump || 0;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
};

TBSProjectileSprite.prototype.iniPositions = function() {
    this.x = this._start[0];
    this.y = this._start[1];
};

TBSProjectileSprite.prototype.makeTrajectory = function() {
    var sx = this._start[0];
    var sy = this._start[1];
    var dx = this._end[0];
    var dy = this._end[1];
    if (this._jump != 0) {
        this._trajectory = LeUtilities.getPixelsOfJump(sx, sy, dx, dy, this._jump);
    } else {
        this._trajectory = LeUtilities.getPixelsOfLine(sx, sy, dx, dy);
    }
    if (this._trajectory[0][0] === dx && this._trajectory[0][1] === dy)
        this._trajectory = this._trajectory.reverse();
};

TBSProjectileSprite.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (!this.finished()) {
        this.updateAngle();
        this.updateMove();
    }
};

TBSProjectileSprite.prototype.updateMove = function() {
    var frame = this._speedFrame;
    if (frame >= this._trajectory.length - 1) {
        frame = this._trajectory.length - 1;
        this._finished = true;
    }
    var newPos = this._trajectory[frame];
    this.x = newPos[0];
    this.y = newPos[1];
    this._speedFrame += this._speed;
};

TBSProjectileSprite.prototype.updateAngle = function() {
    if (this._adaptAngle) {
        var sx, sy, dx, dy;
        sx = this.x;
        sy = this.y;
        if (this._jump === 0) {
            dx = this._end[0];
            dy = this._end[1];
        } else {
            var topFrame = parseInt(this._trajectory.length / 2);
            if (this._speedFrame > topFrame) {
                dx = this._end[0];
                dy = this._end[1];
            } else {
                var topCoord = this._trajectory[topFrame];
                dx = topCoord[0];
                dy = topCoord[1];
            }
        }
        var rotation = Math.atan2(dy - sy, dx - sx);
        this.rotation = rotation;
    }
};

TBSProjectileSprite.prototype.startAnimation = function(animation) {
    animation = $dataAnimations[animation];
    var sprite = new Sprite_ProjectileAnimation();
    sprite.setup(this, animation);
    this.addChild(sprite);
    this._animationSprites.push(sprite);
};

TBSProjectileSprite.prototype.finished = function() {
    return this._finished;
};

/*-------------------------------------------------------------------------
* Sprite_ProjectileAnimation
-------------------------------------------------------------------------*/
function Sprite_ProjectileAnimation() {
    this.initialize.apply(this, arguments);
}
Sprite_ProjectileAnimation.prototype = Object.create(Sprite_Animation.prototype);
Sprite_ProjectileAnimation.prototype.constructor = Sprite_ProjectileAnimation;

Sprite_ProjectileAnimation.prototype.initialize = function() {
    Sprite_Animation.prototype.initialize.call(this);
};

Sprite_ProjectileAnimation.prototype.update = function() {
    Sprite_Animation.prototype.update.call(this);
    if (!this.isPlaying() && this._animation)
        this.setupDuration();
};

Sprite_ProjectileAnimation.prototype.setup = function(target, animation) {
    this._target = target;
    this._animation = animation;
    this._mirror = false;
    this._delay = false;
    if (this._animation) {
        this.remove();
        this.setupRate();
        this.setupDuration();
        this.loadBitmaps();
        this.createSprites();
    }
};

Sprite_ProjectileAnimation.prototype.updatePosition = function() {
    this.x = 0; //this._target.x;
    this.y = 0; //this._target.y;
};

Sprite_ProjectileAnimation.prototype.updateCellSprite = function(sprite, cell) {
    Sprite_Animation.prototype.updateCellSprite.call(this, sprite, cell);
    sprite.rotation += this._target.rotation * Math.PI / 180;
};


/*-------------------------------------------------------------------------
* Cell entity
-------------------------------------------------------------------------*/
function TBSCell(x, y) {
    this.x = x;
    this.y = y;
    this._regionId = -1;
    this._type = null;
    this._event = null;
    this._visible = false;
    this._opacity = 0;
    this._color = "";
}

TBSCell.prototype.isSame = function(otherCell) {
    return this.x === otherCell.x && this.y === otherCell.y;
};

TBSCell.prototype.select = function() {
    BattleManagerTBS._activeCell = this;
};

TBSCell.prototype.isImpassableTile = function() {
    var x = this.x,
        y = this.y;
    if (!$gameMap.isValid(x, y)) return true;
    if (!$gameMap.isPassable(x, y, 2)) return true;
    if (!$gameMap.isPassable(x, y, 4)) return true;
    if (!$gameMap.isPassable(x, y, 6)) return true;
    if (!$gameMap.isPassable(x, y, 8)) return true;
    return false;
};

TBSCell.prototype.isObstacle = function() {
    if (this.isThereEntity()) return true;
    if (this._regionId == Lecode.S_TBS.obstacleRegionId) return true;
    return false;
};

TBSCell.prototype.isThereEntity = function() {
    return this.getEntity() != null;
};

TBSCell.prototype.getEntity = function() {
    return BattleManagerTBS.allEntities().leU_find(function(entity) {
        return entity._cellX == this.x && entity._cellY == this.y;
    }.bind(this));
};

/*-------------------------------------------------------------------------
* SpriteCursorTBS
-------------------------------------------------------------------------*/
function SpriteCursorTBS() {
    this.initialize.apply(this, arguments);
}

SpriteCursorTBS.prototype = Object.create(Sprite.prototype);
SpriteCursorTBS.prototype.constructor = SpriteCursorTBS;

SpriteCursorTBS.prototype.initialize = function(bitmap) {
    Sprite.prototype.initialize.call(this, bitmap);
    this.cellX = this.cellY = 0;
    this._leU_loopFlash = true;
    this._leU_loopFlashData = {
        color: [255, 255, 255, 255],
        duration: 30
    };
};

/*-------------------------------------------------------------------------
* TBSTurnOrderVisual
-------------------------------------------------------------------------*/
function TBSTurnOrderVisual() {
    this.initialize.apply(this, arguments);
}


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
function TBSEntity() {
    this.initialize.apply(this, arguments);

    Object.defineProperty(this, 'x', {
        get: function() {
            return this._posX;
        },
        set: function(value) {
            this.setPosition(value, this.y);
        },
        configurable: true
    });

    Object.defineProperty(this, 'y', {
        get: function() {
            return this._posY;
        },
        set: function(value) {
            this.setPosition(this.x, value);
        },
        configurable: true
    });
}

TBSEntity.prototype.initialize = function(battler, layer) {
    this._battler = battler;
    this._cell = null;
    this._cellX = 0;
    this._cellY = 0;
    this._moving = false;
    this._movePoints = 0;
    this._movingDistance = [0, 0];
    this._movePath = [];
    this._movingNextCell = null;
    this._moveReducePoints = false;
    this._movePerformed = false;
    this._actionPerformed = false;
    this._dead = false;
    this.createSprite(battler, layer);
    this.createComponents();
    this.setMovePoints();
    this.initializeSpeed();
};

TBSEntity.prototype.createSprite = function(battler, layer) {
    this._sprite = new TBSEntity_Sprite(battler, this);
    this._posX = 0;
    this._posY = 0;
    this._dir = 2;
    this._lastDir = 2;
    this._pose = "idle";
    this._afterPose = "idle";
    this._poseLoop = false;
    this._fixedPose = null;
    layer.addChild(this._sprite);
};

TBSEntity.prototype.createComponents = function() {
    this._sequenceManager = new TBSSequenceManager();
};

TBSEntity.prototype.initializeSpeed = function() {
    this.setSpeed(Lecode.S_TBS.battlersMoveSpeed);
};

TBSEntity.prototype.setSpeed = function(speed) {
    this._speed = speed;
};

TBSEntity.prototype.changeSpeed = function(speed) {
    this._speed += speed;
};

TBSEntity.prototype.startSequence = function(id, action) {
    var sequence = Lecode.S_TBS.Config.Sequences[id];
    this._sequenceManager.start(sequence, this, action);
};

TBSEntity.prototype.callSequence = function(id) {
    if (this._sequenceManager.isRunning()) {
        this._sequenceManager.commandCall([id, 1]);
    } else {
        this.startSequence(id);
    }
};

TBSEntity.prototype.appendSequence = function(id) {
    if (this._sequenceManager.isRunning()) {
        var sequence = Lecode.S_TBS.Config.Sequences[id];
        this._sequenceManager.append(sequence, this);
    } else {
        this.startSequence(id);
    }
};

TBSEntity.prototype.requestPlayPose = function() {
    this._requestPlayPose = true;
};

TBSEntity.prototype.isRequestedPosePlayed = function() {
    return !this._requestPlayPose;
};

TBSEntity.prototype.setPose = function(pose, afterPose) {
    this._fixedPose = null;
    this._pose = pose;
    this._afterPose = afterPose || "idle";
    this._poseLoop = (afterPose === pose);
    this._sprite.updatePose();
    this._sprite.resetFrameCount();
    this._sprite.setFixedFrame(null);
    this._sprite.updateBitmap();
    this._sprite.updatePosition();
};

TBSEntity.prototype.setFixedPose = function(pose, frame) {
    this._pose = pose;
    this._sprite.updatePose();
    if (frame === "last")
        frame = this._sprite._maxFrame[this._sprite.getPose()];
    this._fixedPose = pose;
    this._afterPose = null;
    this._poseLoop = false;
    this._sprite.resetFrameCount();
    this._sprite.setFixedFrame(Number(frame));
    this._sprite.updateBitmap();
    this._sprite.updatePosition();
};

TBSEntity.prototype.onPosePlayed = function(oldPose) {
    if (this._fixedPose) {
        this._pose = this._fixedPose;
        this._sprite.updatePose();
        return;
    }
    if (this._poseLoop) {
        this.setPose(oldPose, oldPose);
    } else {
        this.setPose(this._afterPose);
        this._afterPose = "idle";
    }
    this._requestPlayPose = false;
};

TBSEntity.prototype.setDir = function(dir) {
    if (![2, 4, 6, 8].contains(dir)) return;
    this._lastDir = this.getDir();
    this._dir = dir;
    this._sprite.update();
};

TBSEntity.prototype.getDir = function() {
    return this._dir;
};

TBSEntity.prototype.setCell = function(cell) {
    var x = cell.x * $gameMap.tileWidth();
    var y = cell.y * $gameMap.tileHeight();
    this.setPosition(x, y);
    this._cellX = cell.x;
    this._cellY = cell.y;
    this._cell = cell;
};

TBSEntity.prototype.setPosition = function(x, y) {
    this._posX = x;
    this._posY = y;
};

TBSEntity.prototype.shiftPosition = function(x, y) {
    this._posX += x;
    this._posY += y;
};

TBSEntity.prototype.update = function() {
    this.checkDeath();
    this.updateMove();
};

TBSEntity.prototype.checkDeath = function() {
    if (this._battler.isDead() && !this._dead) {
        this.onDeath();
    } else {
        this.onRevive();
    }
};

TBSEntity.prototype.onBattleStart = function() {
    this._battler.onBattleStart();
    this.setMovePoints();
};

TBSEntity.prototype.onTurnStart = function() {
    if (this._battler.onTurnStart) //- Compatibility for YEA
        this._battler.onTurnStart();
    this.setMovePoints();
    this.callSequence("turn_start");
};

TBSEntity.prototype.onTurnEnd = function() {
    this._battler.onTurnEnd();
    this.addPopup();
    this.setMovePoints();
    this._movePerformed = false;
    this._actionPerformed = false;
};

TBSEntity.prototype.onDeath = function() {
    this._dead = true;
    this.appendSequence("dead");
    BattleManagerTBS.onEntityDeath(this);
};

TBSEntity.prototype.onRevive = function() {

};

TBSEntity.prototype.lookAt = function(cell) {
    var downD = cell.y - this._cellY;
    var upD = this._cellY - cell.y;
    var rightD = cell.x - this._cellX;
    var leftD = this._cellX - cell.x;
    var maxD = LeUtilities.getMaxInArray([downD, upD, rightD, leftD]);
    switch (maxD) {
        case downD:
            this.setDir(2);
            break;
        case upD:
            this.setDir(8);
            break;
        case leftD:
            this.setDir(4);
            break;
        case rightD:
            this.setDir(6);
            break;
    }
};

TBSEntity.prototype.lookAway = function(cell) {
    this.lookAt(cell);
    switch (this.getDir()) {
        case 2:
            this.setDir(8);
            break;
        case 4:
            this.setDir(6);
            break;
        case 6:
            this.setDir(4);
            break;
        case 8:
            this.setDir(2);
            break;
    }
};

TBSEntity.prototype.startShake = function(power, duration) {
    this._sprite._shakeEffect = {
        power: power,
        duration: duration
    };
};

TBSEntity.prototype.lookClosestBattler = function(entities) {
    if (entities.length === 0) return;
    var entity = LeUtilities.closestByDistance(this, entities);
    var cell = BattleManagerTBS.getEntityCell(entity);
    this.lookAt(cell);
};

TBSEntity.prototype.processMovement = function(path) {
    if (path.length === 0) return;
    this._moving = true;
    this._movePath = path;
    this._movePath.reverse();
    this.setPose("move", "move");
    this._moveReducePoints = true;
    this._moveUpdateDir = true;
};

TBSEntity.prototype.forceMoveStraight = function(nbrCells,checkCollision) {
    this._movePath = [];
    var cx = this._cellX;
    var cy = this._cellY;
    this._collisionData = {
        distance: nbrCells,
        covered: 0,
        dir: this.getDir(),
        endCell: null
    };
    for (var i = 0; i < nbrCells; i++) {
        var cell = this.getForwardCell(cx, cy);
        if (!cell || cell.isObstacle()) { //  || cell.isImpassableTile()
            this._collisionData.endCell = cell;
            break;
        }
        this._collisionData.covered++;
        this._movePath.push(cell);
        switch (this.getDir()) {
            case 2:
                cy++;
                break;
            case 4:
                cx--;
                break;
            case 6:
                cx++;
                break;
            case 8:
                cy--;
                break;
        }
    }
    if (!checkCollision) this._collisionData = null;
    if (this._movePath.length === 0) return;
    this._moving = true;
    this._movingStraight = true;
    this._movePath.reverse();
    this._moveReducePoints = false;
    this._moveUpdateDir = true;
};

TBSEntity.prototype.forcePush = function(user, sourceCell, distance, obj, damage) {
    if (this.isImmuneToKnockback())
        return;
    distance += user.getKnockbackBonus() - this.getKnockbackReduction();
    var old = this.getDir();
    this.lookAway(sourceCell);
    this.forceMoveStraight(distance, damage);
    this.setDir(old);
    this._moveUpdateDir = false;
    if (this._collisionData) {
        this._collisionData.user = user;
        this._collisionData.obj = obj;
    }

    if (this._movePath.length === 0 && this._collisionData)
        BattleManagerTBS.processCollisionEffects(this);
};

TBSEntity.prototype.forcePull = function(user, sourceCell, distance, obj, damage) {
    var old = this.getDir();
    this.lookAt(sourceCell);
    this.forceMoveStraight(distance, damage);
    this.setDir(old);
    this._moveUpdateDir = false;
    if (this._collisionData) {
        this._collisionData.user = user;
        this._collisionData.obj = obj;
    }

    if (this._movePath.length === 0 && this._collisionData)
        BattleManagerTBS.processCollisionEffects(this);
};

TBSEntity.prototype.getForwardCell = function(cx, cy) {
    cx = cx || this._cellX;
    cy = cy || this._cellY;
    switch (this.getDir()) {
        case 2:
            return BattleManagerTBS.getCellAt(cx, cy + 1);
        case 4:
            return BattleManagerTBS.getCellAt(cx - 1, cy);
        case 6:
            return BattleManagerTBS.getCellAt(cx + 1, cy);
        case 8:
            return BattleManagerTBS.getCellAt(cx, cy - 1);
    }
    return null;
};

TBSEntity.prototype.updateMove = function() {
    if (!this._moving) return;
    if (!this._movingNextCell) {
        this._movingNextCell = this._movePath.pop();
        this._movingDistance = [0, 0];
    }
    var cell = this._movingNextCell;
    var oldDir = this.getDir();
    this.lookAt(cell);
    this.moveForward(cell);
    if (!this._moveUpdateDir)
        this.setDir(oldDir);
    if (this._cellX == cell.x && this._cellY == cell.y) {
        var stop = this.onCellCovered();
        if (this._movePath.length === 0 || stop)
            this.onMoveEnd(!stop);
    }
};

TBSEntity.prototype.onCellCovered = function() {
    // When returning true, the movement is stoped
    this._movingNextCell = null;
    if (this._moveReducePoints) {
        this._movePoints--;
        if (this.getMovePoints() === 0)
            return true;
    }
    return false;
};

TBSEntity.prototype.moveForward = function(cell) {
    var speed = this._speed;
    var dir = this._sprite._dir;
    switch (dir) {
        case 2:
            this.shiftPosition(0, speed);
            this._movingDistance[1] += speed;
            break;
        case 4:
            this.shiftPosition(-speed, 0);
            this._movingDistance[0] += speed;
            break;
        case 6:
            this.shiftPosition(speed, 0);
            this._movingDistance[0] += speed;
            break;
        case 8:
            this.shiftPosition(0, -speed);
            this._movingDistance[1] += speed;
            break;
    }
    if (this._movingDistance[0] >= $gameMap.tileWidth() || this._movingDistance[1] >= $gameMap.tileHeight())
        this.setCell(cell);
};

TBSEntity.prototype.onMoveEnd = function() {
    this._moving = false;
    if (this._dead)
        this.setPose("dead", "dead");
    else
        this.setPose("idle");
    this._moveReducePoints = false;

    if (this._collisionData)
        BattleManagerTBS.processCollisionEffects(this);
    this._collisionData = null;
    this._movingStraight = false;
};

TBSEntity.prototype.teleport = function(cell) {
    this.setCell(cell);
};

TBSEntity.prototype.followTrajectory = function(trajectory, cell) {
    if (cell.x < this.getCell().x) {
        trajectory = trajectory.reverse();
    }
    this._sprite.setTrajectory(trajectory, cell);
};

TBSEntity.prototype.setMovePoints = function() {
    var obj = this._battler.isActor() ? this._battler.actor() : this._battler.enemy();
    this._movePoints = obj.leTbs_movePoints;
    this._battler.states().forEach(function(state) {
        if (state)
            this._movePoints += state.leTbs_movePointsPlus;
    }.bind(this));
    if (this._battler.isActor()) {
        this._battler.equips().forEach(function(equip) {
            if (equip)
                this._movePoints += equip.leTbs_movePointsPlus;
        }.bind(this));
    }
};

TBSEntity.prototype.changeMovePoints = function(plus) {
    this._movePoints += plus;
};

TBSEntity.prototype.getMovePoints = function() {
    return this._movePoints.clamp(0, this._movePoints);
};

TBSEntity.prototype.canMoveCommand = function() {
    if (this.getMovePoints() === 0) return false;
    if (this.oneTimeMove() && this._movePerformed) return false;
    return true;
};

TBSEntity.prototype.canAttackCommand = function() {
    if (!this._battler.canAttack()) return false;
    if (!this.canObjCommand()) return false;
    return true;
};

TBSEntity.prototype.canSkillCommand = function() {
    if (!this.canObjCommand()) return false;
    return true;
};

TBSEntity.prototype.canItemCommand = function() {
    if (!this.canObjCommand()) return false;
    return true;
};

TBSEntity.prototype.canObjCommand = function() {
    if (this.oneTimeOffense() && this._actionPerformed) return false;
    return true;
};

TBSEntity.prototype.getAttackAnimation = function() {
    if (this._battler.isActor()) {
        return this._battler.attackAnimationId1();
    } else {
        return this._battler.enemy().leTbs_atkAnim;
    }
};

TBSEntity.prototype.getAttackScopeData = function() {
    if (this._battler.isEnemy())
        return this._battler.enemy().leTbs_atkScopeData;
    else {
        for (var i = 0; i < this._battler.weapons().length; i++) {
            var weapon = this._battler.weapons()[i];
            if (weapon && weapon.leTbs_scopeData)
                return weapon.leTbs_scopeData;
        }
        return this._battler.actor().leTbs_atkScopeData;
    }
};

TBSEntity.prototype.getObjectScopeData = function(obj) {
    var defaultScope = DataManager.isSkill(obj) ? Lecode.S_TBS.defaultSkillScope : Lecode.S_TBS.defaultItemScope;
    return obj.leTbs_scopeData || defaultScope;
};

TBSEntity.prototype.getAttackAoEData = function() {
    if (this._battler.isEnemy())
        return this._battler.enemy().leTbs_atkAoeData;
    else {
        for (var i = 0; i < this._battler.weapons().length; i++) {
            var weapon = this._battler.weapons()[i];
            if (weapon && weapon.leTbs_aoeData)
                return weapon.leTbs_aoeData;
        }
        return this._battler.actor().leTbs_atkAoeData;
    }
};

TBSEntity.prototype.getObjectAoEData = function(obj) {
    var defaultAoe = DataManager.isSkill(obj) ? Lecode.S_TBS.defaultSkillAoE : Lecode.S_TBS.defaultItemAoE;
    return obj.leTbs_aoeData || defaultAoe;
};

TBSEntity.prototype.getMoveScopeData = function() {
    return this.getMoveScopeRawData().replace("_mp_", String(this.getMovePoints()));
};

TBSEntity.prototype.getMoveScopeRawData = function() {
    for (var i = 0; i < this._battler.states().length; i++) {
        var state = this._battler.states()[i];
        if (state && state.leTbs_moveScopeData)
            return state.leTbs_moveScopeData;
    }
    if (this._battler.isEnemy())
        return this._battler.enemy().leTbs_moveScopeData;
    else {
        for (var i = 0; i < this._battler.equips().length; i++) {
            var equip = this._battler.equips()[i];
            if (equip && equip.leTbs_moveScopeData)
                return equip.leTbs_moveScopeData;
        }
        return this._battler.actor().leTbs_moveScopeData;
    }
};

TBSEntity.prototype.getMoveScopeParamData = function() {
    for (var i = 0; i < this._battler.states().length; i++) {
        var state = this._battler.states()[i];
        if (state && state.leTbs_moveScopeParam)
            return state.leTbs_moveScopeParam;
    }
    if (this._battler.isEnemy())
        return this._battler.enemy().leTbs_moveScopeParam;
    else {
        for (var i = 0; i < this._battler.equips().length; i++) {
            var equip = this._battler.equips()[i];
            if (equip && equip.leTbs_moveScopeParam)
                return equip.leTbs_moveScopeParam;
        }
        return this._battler.actor().leTbs_moveScopeParam;
    }
};

TBSEntity.prototype.getWeaponSequenceData = function() {
    if (this._battler.isEnemy())
        return this._battler.enemy().leTbs_atkSequenceData;
    else {
        for (var i = 0; i < this._battler.weapons().length; i++) {
            var weapon = this._battler.weapons()[i];
            if (weapon && weapon.leTbs_sequenceData)
                return weapon.leTbs_sequenceData;
        }
        return this._battler.actor().leTbs_atkSequenceData;
    }
};

TBSEntity.prototype.getObjectSequenceData = function(obj) {
    var defaultSeqId = DataManager.isSkill(obj) ? Lecode.S_TBS.defaultSkillSequence : Lecode.S_TBS.defaultItemSequence;
    return obj.leTbs_sequenceData || defaultSeqId;
};

TBSEntity.prototype.passAfterObjUse = function(obj) {
    if (DataManager.isSkill(obj)) {
        if (this._battler.isEnemy())
            return !!this._battler.leTbs_passOnAtkUse;
        if (obj.id == this._battler.attackSkillId()) {
            if (this._battler.weapons().length > 0)
                return !!this._battler.weapons()[0].leTbs_passOnUse;
        }
    }
    return !!obj.leTbs_passOnUse;
};

TBSEntity.prototype.oneTimeMove = function() {
    return this.rpgObject().leTbs_oneTimeMove;
};

TBSEntity.prototype.oneTimeOffense = function() {
    return this.rpgObject().leTbs_oneTimeOffense;
};

TBSEntity.prototype.getCollapseAnimation = function() {
    return this.rpgObject().leTbs_collapseAnim;
};

TBSEntity.prototype.getAiPattern = function() {
    return this.rpgObject().leTbs_aiPattern;
};

TBSEntity.prototype.isPassableOnDeath = function() {
    var test = this.battler().states().some(function(state) {
        return state && state.leTbs_passableOnDeath;
    });
    if (test) return true;
    return this.rpgObject().leTbs_passableOnDeath;
};

TBSEntity.prototype.isPassable = function() {
    var test = this._battler.isDead() && this.isPassableOnDeath();
    if (test) return true;
    test = this.battler().states().some(function(state) {
        return state && state.leTbs_passable;
    });
    if (test) return true;
    return this.rpgObject().leTbs_passable;
};

TBSEntity.prototype.entitiesCanLayOnMe = function() {
    var test = this._battler.isDead() && this.isPassableOnDeath();
    if (test) return true;
    test = this.battler().states().some(function(state) {
        return state && state.leTbs_canLayOnMe;
    });
    if (test) return true;
    return this.rpgObject().leTbs_canLayOnMe;
};

TBSEntity.prototype.getCollisionDamageBonus = function(damage) {
    var bonus = 0;
    this.battler().states().forEach(function(state) {
        if (state) {
            bonus += state.leTbs_collisionDmgBonus;
            bonus += state.leTbs_collisionDmgBonusRate * 0.01 * damage;
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function(equip) {
            if (equip) {
                bonus += equip.leTbs_collisionDmgBonus;
                bonus += equip.leTbs_collisionDmgBonusRate * 0.01 * damage;
            }
        });
    }
    return bonus;
};

TBSEntity.prototype.getCollisionDamageReduction = function(damage) {
    var reduction = 0;
    this.battler().states().forEach(function(state) {
        if (state) {
            reduction += state.leTbs_collisionDmgReduction;
            reduction += state.leTbs_collisionDmgReductionRate * 0.01 * damage;
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function(equip) {
            if (equip) {
                reduction += equip.leTbs_collisionDmgReduction;
                reduction += equip.leTbs_collisionDmgReductionRate * 0.01 * damage;
            }
        });
    }
    return reduction;
};

TBSEntity.prototype.getDirectionalDmgBonus = function(type) {
    var value = this.rpgObject().leTbs_directionalDmgBonus[type];
    this.battler().states().forEach(function(state) {
        if (state) {
            value += state.leTbs_directionalDmgBonus[type];
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function(equip) {
            if (equip) {
                value += equip.leTbs_directionalDmgBonus[type];
            }
        });
    }
    return value;
};

TBSEntity.prototype.getDirectionalDmgReduction = function(type) {
    var value = this.rpgObject().leTbs_directionalDmgReduction[type];
    this.battler().states().forEach(function(state) {
        if (state) {
            value += state.leTbs_directionalDmgReduction[type];
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function(equip) {
            if (equip) {
                value += equip.leTbs_directionalDmgReduction[type];
            }
        });
    }
    return value;
};

TBSEntity.prototype.isImmuneToKnockback = function() {
    return this.rpgObject().leTbs_immuneKnockback;
};

TBSEntity.prototype.getKnockbackBonus = function() {
    var bonus = 0;
    bonus += this.rpgObject().leTbs_knockbackBonus;
    this.battler().states().forEach(function(state) {
        if (state) {
            bonus += state.leTbs_knockbackBonus;
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function(equip) {
            if (equip) {
                bonus += equip.leTbs_knockbackBonus;
            }
        });
    }
    return bonus;
};

TBSEntity.prototype.getKnockbackReduction = function() {
    var reduction = 0;
    reduction += this.rpgObject().leTbs_knockbackReduction;
    this.battler().states().forEach(function(state) {
        if (state) {
            reduction += state.leTbs_knockbackReduction;
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function(equip) {
            if (equip) {
                reduction += equip.leTbs_knockbackReduction;
            }
        });
    }
    return reduction;
};


TBSEntity.prototype.addPopup = function() {
    this._sprite.addPopup();
};

TBSEntity.prototype.battler = function() {
    return this._battler;
};

TBSEntity.prototype.sprite = function() {
    return this._sprite;
};

TBSEntity.prototype.width = function() {
    return this._sprite.width;
};

TBSEntity.prototype.height = function() {
    return this._sprite.height;
};

TBSEntity.prototype.getCell = function() {
    return this._cell;
};

TBSEntity.prototype.isMoving = function() {
    return this._moving;
};

TBSEntity.prototype.rpgObject = function() {
    return this.battler().isActor() ? this.battler().actor() : this.battler().enemy();
};

/*-------------------------------------------------------------------------
* TBSEntity_Sprite
-------------------------------------------------------------------------*/
function TBSEntity_Sprite() {
    this.initialize.apply(this, arguments);
}

TBSEntity_Sprite.prototype = Object.create(Sprite_Base.prototype);
TBSEntity_Sprite.prototype.constructor = TBSEntity_Sprite;

TBSEntity_Sprite.prototype.initialize = function(battler, entity) {
    Sprite_Base.prototype.initialize.call(this);
    this._battler = battler;
    this._entity = entity;
    this._bitmaps = {};
    this._frameCount = 0;
    this._maxFrame = {};
    this._fixedFrame = null;
    this._updateCount = 0;
    this._poses = [];
    this._frameLoaded = 0;
    this._popups = [];
    this._shakeEffect = {
        power: 0,
        duration: 0
    };
    this._trajectoryIndex = 0;
    this._trajectory = [];
    this._trajectoryEndCell = null;
    this.initializeFrameDelay();
    this.createBitmaps(battler);
};

TBSEntity_Sprite.prototype.initializeFrameDelay = function() {
    this.setFrameDelay(Lecode.S_TBS.battlersFrameDelay);
};

TBSEntity_Sprite.prototype.setFrameDelay = function(delay) {
    this._frameDelay = delay;
};

TBSEntity_Sprite.prototype.changeFrameDelay = function(delay) {
    this._frameDelay += delay;
};

TBSEntity_Sprite.prototype.onPosePlayed = function() {
    this._frameCount = 0;
    this._entity.onPosePlayed(this.getPose());
};

TBSEntity_Sprite.prototype.resetFrameCount = function() {
    this._frameCount = 0;
};

TBSEntity_Sprite.prototype.setFixedFrame = function(frame) {
    this._fixedFrame = frame;
};

TBSEntity_Sprite.prototype.setTrajectory = function(trajectory, cell) {
    this._trajectoryIndex = 0;
    this._trajectory = trajectory;
    this._trajectoryEndCell = cell;
};

TBSEntity_Sprite.prototype.hasTrajectory = function() {
    return !!this._trajectory[this._trajectoryIndex];
};

TBSEntity_Sprite.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (!this.isReady()) return;
    this.updateDirection();
    this.updatePose();
    this.updateFrameDelay();
    this.updatePosition();
    this.updatePopups();
};

TBSEntity_Sprite.prototype.updateFrameDelay = function() {
    this._updateCount++;
    if (this._updateCount === this._frameDelay) {
        this._updateCount = 0;
        this.onNextFrame();
    }
};

TBSEntity_Sprite.prototype.onNextFrame = function() {
    this.updateBitmap();
    this.updateFrameCount();
};

TBSEntity_Sprite.prototype.updateDirection = function() {
    this._dir = this._entity._dir;
};

TBSEntity_Sprite.prototype.updatePose = function() {
    this._pose = this._entity._pose;
};

TBSEntity_Sprite.prototype.updatePosition = function() {
    this.updateTrajectoryMove();
    this.x = this._entity._posX;
    this.y = this._entity._posY;
    if (this.bitmap) {
        var w = this.bitmap.width / (this._maxFrame[this.getPose()] + 1);
        var h = this.bitmap.height / 4;
        this.x += $gameMap.tileWidth() / 2 - w / 2;
        this.y += $gameMap.tileHeight() - h;
    }
    this.updateShakeEffect();
};

TBSEntity_Sprite.prototype.updateTrajectoryMove = function() {
    if (this.hasTrajectory()) {
        var pos = this._trajectory[this._trajectoryIndex];
        this._trajectoryIndex += this._entity._speed;
        if (!this.hasTrajectory()) {
            this._entity.setCell(this._trajectoryEndCell);
        } else {
            this._entity.setPosition(pos[0], pos[1]);
        }
    }
};

TBSEntity_Sprite.prototype.updateShakeEffect = function() {
    var min = this._shakeEffect.power * 0.6;
    var max = this._shakeEffect.power * 1.6;
    var d = this._shakeEffect.duration--;
    if (d > 0) {
        this.x += LeUtilities.randValueBetween(min, max) * LeUtilities.randValueBetween(-1, 1);
        this.y += LeUtilities.randValueBetween(min, max) * LeUtilities.randValueBetween(-1, 1);
    }
};

TBSEntity_Sprite.prototype.updateBitmap = function() {
    var pose = this.getPose();
    this.bitmap = this._bitmaps[pose];
    var w = this.bitmap.width / (this._maxFrame[pose] + 1);
    var h = this.bitmap.height / 4;
    var x;
    var y;
    var frame = this._fixedFrame != null ? this._fixedFrame : this._frameCount;
    x = w * frame;
    y = (h * this._dir) / 2 - h;
    this.setFrame(x, y, w, h);
};

TBSEntity_Sprite.prototype.updateFrameCount = function() {
    var pose = this.getPose();
    if (this._frameCount > this._maxFrame[pose]) {
        this.onPosePlayed();
    } else {
        this._frameCount++;
    }
};

TBSEntity_Sprite.prototype.updatePopups = function() {
    if (this._popups.length === 0) return;
    this._popups.forEach(function(popup) {
        popup.update();
    }.bind(this));
    if (!this._popups[0].isPlaying()) {
        this.removePopup(this._popups[0]);
    }
};

TBSEntity_Sprite.prototype.removePopup = function(popup) {
    BattleManagerTBS.getLayer("movableInfo").removeChild(popup);
    this._popups.shift();
};

TBSEntity_Sprite.prototype.createBitmaps = function(battler) {
    var config = this.getConfig(battler);
    config.forEach(function(info) {
        var pose = info[0];
        var filename = this.filenameID(battler) + info[1];
        var hue = info[3] || 0;
        this._poses.push(pose);
        var fullBitmap = ImageManager.loadLeTBSBattler(filename, hue);
        fullBitmap.addLoadListener(this.createPoseBitmaps.bind(this, fullBitmap, pose, info));
    }.bind(this));
};

TBSEntity_Sprite.prototype.createPoseBitmaps = function(fbitmap, pose, info) {
    var frames = info[2];
    this._maxFrame[pose] = frames - 1;
    this._bitmaps[pose] = fbitmap;
    this._frameLoaded++;
};

TBSEntity_Sprite.prototype.addPopup = function() {
    var sprite = new Sprite_Damage();
    sprite.x = this.x + this.width / 2;
    sprite.y = this.y;
    sprite.setup(this._battler);
    this._popups.push(sprite);
    BattleManagerTBS.getLayer("movableInfo").addChild(sprite);
};

TBSEntity_Sprite.prototype.isReady = function() {
    return this._frameLoaded === this._poses.length;
};

TBSEntity_Sprite.prototype.getPose = function() {
    return this.isValidPose(this._pose) ? this._pose : "idle";
};

TBSEntity_Sprite.prototype.getConfig = function(battler) {
    var id = battler.isActor() ? battler.name() : battler.originalName();
    var config = Lecode.S_TBS.Config.Battler_Sprites[id];
    if (!config) config = Lecode.S_TBS.Config.Battler_Sprites["Default"];
    return config;
};

TBSEntity_Sprite.prototype.isValidPose = function(pose) {
    return this._poses.indexOf(pose) >= 0;
};

TBSEntity_Sprite.prototype.filenameID = function(battler) {
    if (battler.isActor()) return battler.name();
    return battler.originalName();
};

/*-------------------------------------------------------------------------
* TBSDirectionSelector
-------------------------------------------------------------------------*/
function TBSDirectionSelector() {
    this.initialize.apply(this, arguments);
}

TBSDirectionSelector.prototype.initialize = function(layer) {
    this._cell = null;
    this._battlerEntity = null;
    this.createSprite(layer);
};

TBSDirectionSelector.prototype.createSprite = function(layer) {
    var bitmap = ImageManager.loadLeTBS("DirectionSelector", 0);
    this._sprite = new Sprite(bitmap);
    this._sprite.anchor.x = 0.5;
    this._sprite.anchor.y = 0.5;
    this._sprite.opacity = 0;
    layer.addChild(this._sprite);
};

TBSDirectionSelector.prototype.set = function(cell, battler) {
    this._cell = cell;
    this._battlerEntity = battler;
    this._sprite.x = cell.x * $gameMap.tileWidth() + $gameMap.tileWidth() / 2;
    this._sprite.y = cell.y * $gameMap.tileHeight() + $gameMap.tileHeight() / 2;
    this._sprite.opacity = 255;
    this.setDir(battler.getDir());
};

TBSDirectionSelector.prototype.setDir = function(dir) {
    this._battlerEntity.setDir(dir);
    var r = 0;
    switch (dir) {
        case 2:
            r = 0;
            break;
        case 4:
            r = 90;
            break;
        case 6:
            r = 90 * 3;
            break;
        case 8:
            r = 90 * 2;
            break;
    }
    this._sprite.rotation = r * Math.PI / 180;
    SoundManager.playCursor();
};

TBSDirectionSelector.prototype.hide = function() {
    this._sprite.opacity = 0;
};


/*-------------------------------------------------------------------------
* Window_TBSConfirm
-------------------------------------------------------------------------*/
function Window_TBSConfirm() {
    this.initialize.apply(this, arguments);
}

/*-------------------------------------------------------------------------
* Window_TBSPlacementInfo
-------------------------------------------------------------------------*/

function Window_TBSPlacementInfo() {
    this.initialize.apply(this, arguments);
}
/*-------------------------------------------------------------------------
* Window_TBSStatus
-------------------------------------------------------------------------*/
function Window_TBSStatus() {
    this.initialize.apply(this, arguments);
}

/*-------------------------------------------------------------------------
* Window_TBSCommand
-------------------------------------------------------------------------*/
function Window_TBSCommand() {
    this.initialize.apply(this, arguments);
}

/*-------------------------------------------------------------------------
* Window_TBSEndCommand
-------------------------------------------------------------------------*/
function Window_TBSEndCommand() {
    this.initialize.apply(this, arguments);
}


/*=========================================================================
*	RTPs MODIFS
=========================================================================*/


/*-------------------------------------------------------------------------
* Game_Battler
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldGameBattler_initMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function() {
    Lecode.S_TBS.oldGameBattler_initMembers.call(this);
    this._leTbsDirectionalDmg = 0;
};

Game_Battler.prototype.leTBS_setDirectionalDmgEffects = function(amount) {
    this._leTbsDirectionalDmg = amount;
};

Lecode.S_TBS.oldGameBattler_addNewState = Game_Battler.prototype.addNewState;
Game_Battler.prototype.addNewState = function(stateId) {
    if (LeUtilities.isScene("Scene_Battle") && Lecode.S_TBS.commandOn) {
        var state = $dataStates[stateId];
        var entity = BattleManagerTBS.getEntityByBattler(this);
        entity.changeMovePoints(state.leTbs_movePointsPlus);
    }
    Lecode.S_TBS.oldGameBattler_addNewState.call(this, stateId);
};


/*-------------------------------------------------------------------------
* Game_Action
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldGameAction_executeDamage = Game_Action.prototype.executeDamage;
Game_Action.prototype.executeDamage = function(target, value) {
    value += value * target._leTbsDirectionalDmg;
    Lecode.S_TBS.oldGameAction_executeDamage.call(this, target, Math.floor(value));
};


/*-------------------------------------------------------------------------
* Game_Interpreter
-------------------------------------------------------------------------*/
Lecode.S_TBS.old_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Lecode.S_TBS.old_pluginCommand.call(this, command, args);
    if (command === 'LeTBS') {
        switch (args[0]) {
            case 'ON':
                Lecode.S_TBS.commandOn = true;
                break;
            case 'OFF':
                Lecode.S_TBS.commandOn = false;
                break;
        }
    }
};

/*-------------------------------------------------------------------------
* DataManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldDMisDatabaseLoaded_method = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
    if (!Lecode.S_TBS.oldDMisDatabaseLoaded_method.call(this)) return false;
    this.processLeTBSTags();
    return true;
};

DataManager.processLeTBSTags = function() {
    this.processLeTBSTagsForBattlers();
    this.processLeTBSTagsForEquipmentsAndStates();
    this.processLeTBSTagsForObjects();
};

DataManager.processLeTBSTagsForBattlers = function() {
    var groups = [$dataActors, $dataEnemies, $dataClasses];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_movePoints = Lecode.S_TBS.defaultMovePoints;
            obj.leTbs_moveScopeData = Lecode.S_TBS.defaultMoveScope;
            obj.leTbs_moveScopeParam = "";
            obj.leTbs_atkAnim = Lecode.S_TBS.defaultAttackAnimation;
            obj.leTbs_atkScopeData = Lecode.S_TBS.defaultAttackScope;
            obj.leTbs_atkAoeData = Lecode.S_TBS.defaultAttackAoE;
            obj.leTbs_atkSequenceData = Lecode.S_TBS.defaultAttackSequence;
            obj.leTbs_oneTimeMove = Lecode.S_TBS.oneTimeMove;
            obj.leTbs_oneTimeOffense = Lecode.S_TBS.oneTimeOffense;
            obj.leTbs_collapseAnim = Lecode.S_TBS.collapseAnimation;
            obj.leTbs_passOnAtkUse = false;
            obj.leTbs_aiPattern = Lecode.S_TBS.defaultAiPattern;
            obj.leTbs_passable = false;
            obj.leTbs_passableOnDeath = false;
            obj.leTbs_canLayOnMe = false;
            obj.leTbs_collisionDmgBonus = 0;
            obj.leTbs_collisionDmgBonusRate = 0;
            obj.leTbs_collisionDmgReduction = 0;
            obj.leTbs_collisionDmgReductionRate = 0;
            obj.leTbs_immuneKnockback = false;
            obj.leTbs_knockbackBonus = 0;
            obj.leTbs_knockbackReduction = 0;
            obj.leTbs_directionalDmgBonus = {
                face: 0,
                back: 0,
                side: 0
            };
            obj.leTbs_directionalDmgReduction = {
                face: 0,
                back: 0,
                side: 0
            };

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/move_points\s?:\s?(.+)/i))
                        obj.leTbs_movePoints = Number(RegExp.$1);
                    else if (line.match(/move_scope\s?:\s?(.+)/i))
                        obj.leTbs_moveScopeData = String(RegExp.$1);
                    else if (line.match(/move_scope_options\s?:\s?((.|\n)*)/i))
                        obj.leTbs_moveScopeParam = String(RegExp.$1);
                    else if (line.match(/atk_anim\s?:\s?(.+)/i))
                        obj.leTbs_atkAnim = Number(RegExp.$1);
                    else if (line.match(/atk_scope\s?:\s?(.+)/i))
                        obj.leTbs_atkScopeData = String(RegExp.$1);
                    else if (line.match(/atk_aoe\s?:\s?(.+)/i))
                        obj.leTbs_atkAoeData = String(RegExp.$1);
                    else if (line.match(/atk_sequence\s?:\s?(.+)/i))
                        obj.leTbs_atkSequence = String(RegExp.$1);
                    else if (line.match(/one_time_move/i))
                        obj.leTbs_oneTimeMove = true;
                    else if (line.match(/one_time_offense/i))
                        obj.leTbs_oneTimeOffense = true;
                    else if (line.match(/collapse_anim\s?:\s?(.+)/i))
                        obj.leTbs_collapseAnim = Number(RegExp.$1);
                    else if (line.match(/pass_on_atk_use/i))
                        obj.leTbs_passOnAtkUse = true;
                    else if (line.match(/ai_pattern\s?:\s?(.+)/i))
                        obj.leTbs_aiPattern = String(RegExp.$1);
                    else if (line.match(/passable_on_death/i))
                        obj.leTbs_passableOnDeath = true;
                    else if (line.match(/passable/i))
                        obj.leTbs_passable = true;
                    else if (line.match(/entities_can_lay_on_me/i))
                        obj.leTbs_canLayOnMe = true;
                    else if (line.match(/collision_damage_bonus\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgBonus = Number(RegExp.$1);
                    else if (line.match(/collision_damage_bonus\%\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgBonusRate = Number(RegExp.$1);
                    else if (line.match(/collision_damage_reduction\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgReduction = Number(RegExp.$1);
                    else if (line.match(/collision_damage_reduction\%\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgReductionRate = Number(RegExp.$1);
                    else if (line.match(/immune_knockback/i))
                        obj.leTbs_immuneKnockback = true;
                    else if (line.match(/knockback_bonus\s?:\s?(.+)/i))
                        obj.leTbs_knockbackBonus = Number(RegExp.$1);
                    else if (line.match(/knockback_reduction\s?:\s?(.+)/i))
                        obj.leTbs_knockbackReduction = Number(RegExp.$1);
                    else if (line.match(/back_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.back = Number(RegExp.$1);
                    else if (line.match(/back_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.back = Number(RegExp.$1);
                    else if (line.match(/face_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.face = Number(RegExp.$1);
                    else if (line.match(/face_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.face = Number(RegExp.$1);
                    else if (line.match(/side_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.side = Number(RegExp.$1);
                    else if (line.match(/side_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.side = Number(RegExp.$1);
                }
            }
        }
    }
};

DataManager.processLeTBSTagsForEquipmentsAndStates = function() {
    var groups = [$dataWeapons, $dataArmors, $dataStates];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_movePointsPlus = 0;
            obj.leTbs_scopeData = Lecode.S_TBS.defaultAttackScope;
            obj.leTbs_aoeData = null;
            obj.leTbs_sequenceData = null;
            obj.leTbs_moveScopeData = null;
            obj.leTbs_moveScopeParam = null;
            obj.leTbs_passable = false;
            obj.leTbs_passableOnDeath = false;
            obj.leTbs_canLayOnMe = false;
            obj.leTbs_collisionDmgBonus = 0;
            obj.leTbs_collisionDmgBonusRate = 0;
            obj.leTbs_collisionDmgReduction = 0;
            obj.leTbs_collisionDmgReductionRate = 0;
            obj.leTbs_immuneKnockback = false;
            obj.leTbs_knockbackBonus = 0;
            obj.leTbs_knockbackReduction = 0;
            obj.leTbs_directionalDmgBonus = {
                face: 0,
                back: 0,
                side: 0
            };
            obj.leTbs_directionalDmgReduction = {
                face: 0,
                back: 0,
                side: 0
            };

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/move_points_plus\s?:\s?(.+)/i))
                        obj.leTbs_movePointsPlus = Number(RegExp.$1);
                    else if (line.match(/scope\s?:\s?(.+)/i))
                        obj.leTbs_scopeData = String(RegExp.$1);
                    else if (line.match(/aoe\s?:\s?(.+)/i))
                        obj.leTbs_aoeData = String(RegExp.$1);
                    else if (line.match(/sequence\s?:\s?(.+)/i))
                        obj.leTbs_sequenceData = String(RegExp.$1);
                    else if (line.match(/move_scope\s?:\s?(.+)/i))
                        obj.leTbs_moveScopeData = String(RegExp.$1);
                    else if (line.match(/move_scope_options\s?:\s?((.|\n)*)/i))
                        obj.leTbs_moveScopeParam = String(RegExp.$1);
                    else if (line.match(/passable_on_death/i))
                        obj.leTbs_passableOnDeath = true;
                    else if (line.match(/passable/i))
                        obj.leTbs_passable = true;
                    else if (line.match(/entities_can_lay_on_me/i))
                        obj.leTbs_canLayOnMe = true;
                    else if (line.match(/collision_damage_bonus\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgBonus = Number(RegExp.$1);
                    else if (line.match(/collision_damage_bonus\%\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgBonusRate = Number(RegExp.$1);
                    else if (line.match(/collision_damage_reduction\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgReduction = Number(RegExp.$1);
                    else if (line.match(/collision_damage_reduction\%\s?:\s?(.+)/i))
                        obj.leTbs_collisionDmgReductionRate = Number(RegExp.$1);
                    else if (line.match(/immune_knockback/i))
                        obj.leTbs_immuneKnockback = true;
                    else if (line.match(/knockback_bonus\s?:\s?(.+)/i))
                        obj.leTbs_knockbackBonus = Number(RegExp.$1);
                    else if (line.match(/knockback_reduction\s?:\s?(.+)/i))
                        obj.leTbs_knockbackReduction = Number(RegExp.$1);
                    else if (line.match(/knockback_bonus\s?:\s?(.+)/i))
                        obj.leTbs_knockbackBonus = Number(RegExp.$1);
                    else if (line.match(/knockback_reduction\s?:\s?(.+)/i))
                        obj.leTbs_knockbackReduction = Number(RegExp.$1);
                    else if (line.match(/back_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.back = Number(RegExp.$1);
                    else if (line.match(/back_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.back = Number(RegExp.$1);
                    else if (line.match(/face_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.face = Number(RegExp.$1);
                    else if (line.match(/face_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.face = Number(RegExp.$1);
                    else if (line.match(/side_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.side = Number(RegExp.$1);
                    else if (line.match(/side_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.side = Number(RegExp.$1);
                }
            }
        }
    }
};

DataManager.processLeTBSTagsForObjects = function() {
    var groups = [$dataSkills, $dataItems, $dataWeapons];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_scopeData = null;
            obj.leTbs_aoeData = null;
            obj.leTbs_sequenceData = null;
            obj.leTbs_passOnUse = false;
            obj.leTbs_maxUse = 1;
            obj.leTbs_scopeParam = [];
            obj.leTbs_aiOffenseType = null;
            obj.leTbs_collisionFormula = null;
            obj.leTbs_directionalDmgBonus = {
                face: 0,
                back: 0,
                side: 0
            };
            obj.leTbs_directionalDmgReduction = {
                face: 0,
                back: 0,
                side: 0
            };

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs>/i))
                    letbs = true;
                else if (line.match(/<\/letbs>/i))
                    letbs = false;

                if (letbs) {
                    if (line.match(/scope\s?:\s?(.+)/i))
                        obj.leTbs_scopeData = String(RegExp.$1);
                    else if (line.match(/aoe\s?:\s?(.+)/i))
                        obj.leTbs_aoeData = String(RegExp.$1);
                    else if (line.match(/sequence\s?:\s?(.+)/i))
                        obj.leTbs_sequenceData = String(RegExp.$1);
                    else if (line.match(/pass_on_use/i))
                        obj.leTbs_passOnUse = true;
                    else if (line.match(/max_use:\s?:\s?(.+)/i))
                        obj.leTbs_maxUse = Number(RegExp.$1);
                    else if (line.match(/scope_options\s?:\s?((.|\n)*)/i))
                        obj.leTbs_scopeParam = String(RegExp.$1);
                    else if (line.match(/ai_offense_type/i))
                        obj.leTbs_aiOffenseType = true;
                    else if (line.match(/collision_formula\s?:\s?(.+)/i))
                        obj.leTbs_collisionFormula = String(RegExp.$1);
                    else if (line.match(/knockback_bonus\s?:\s?(.+)/i))
                        obj.leTbs_knockbackBonus = Number(RegExp.$1);
                    else if (line.match(/knockback_reduction\s?:\s?(.+)/i))
                        obj.leTbs_knockbackReduction = Number(RegExp.$1);
                    else if (line.match(/back_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.back = Number(RegExp.$1);
                    else if (line.match(/back_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.back = Number(RegExp.$1);
                    else if (line.match(/face_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.face = Number(RegExp.$1);
                    else if (line.match(/face_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.face = Number(RegExp.$1);
                    else if (line.match(/side_dmg_bonus\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgBonus.side = Number(RegExp.$1);
                    else if (line.match(/side_dmg_reduction\s?:\s?(.+)/i))
                        obj.leTbs_directionalDmgReduction.side = Number(RegExp.$1);
                }
            }
        }
    }
};

/*-------------------------------------------------------------------------
* ImageManager
-------------------------------------------------------------------------*/
ImageManager.loadLeTBS = function(filename, hue) {
    return this.loadBitmap('img/leTBS/', filename, hue, true);
};

ImageManager.loadLeTBSTurnOrder = function(filename, hue) {
    return this.loadBitmap('img/leTBS/TurnOrder/', filename, hue, true);
};

ImageManager.loadLeTBSBattler = function(filename, hue) {
    return this.loadBitmap('img/leTBS/Battlers/', filename, hue, true);
};

ImageManager.loadLeTBSStatus = function(filename, hue) {
    return this.loadBitmap('img/leTBS/Status/', filename, hue, true);
};

ImageManager.loadLeTBSProjectile = function(filename, hue) {
    return this.loadBitmap('img/leTBS/Projectiles/', filename, hue, true);
};

ImageManager.loadLeTBS("Battle_Start");

/*-------------------------------------------------------------------------
* Game_Map
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldIsPassable_method = Game_Map.prototype.isPassable;
Game_Map.prototype.isPassable = function(x, y, d) {
    var result = Lecode.S_TBS.oldIsPassable_method.call(this, x, y, d);
    if (LeUtilities.isScene("Scene_Battle") && BattleManagerTBS.activeEntity()) {
        var entityCell = BattleManagerTBS.activeEntity().getCell();
        var cell = BattleManagerTBS.getCellAt(x, y);
        if (cell && !(entityCell.x == x && entityCell.y == y) && cell.isThereEntity())
            return false;
    }
    return result;
};


/*-------------------------------------------------------------------------
* TBS_FloatingAction
-------------------------------------------------------------------------*/
function TBS_FloatingAction() {
    this.initialize.apply(this, arguments);
}
TBS_FloatingAction.prototype = Object.create(Game_Action.prototype);
TBS_FloatingAction.prototype.constructor = TBS_FloatingAction;

TBS_FloatingAction.prototype.initialize = function() {
    Game_Action.prototype.initialize.call(this, arguments);
};

TBS_FloatingAction.prototype.setSubject = function(subject) {
    this._subject = subject;
};

TBS_FloatingAction.prototype.subject = function() {
    return this._subject;
};

/*
#=============================================================================
# Windows for LeTBS
# LeTBSWindows.js
# By Lecode
# Version A - 1.2
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : The tag sprite_name is correctly taken into account
# - 1.2 : The status window is updated
#=============================================================================
*/
var Lecode = Lecode || {};
if (!Lecode.S_TBS)
    throw new Error("LeTBSWindows must be below LeTBS");
Lecode.S_TBS.Windows = {};
/*:
 * @plugindesc (WIP)Version A Windows for LeTBS
 * @author Lecode
 * @version 1.2
 *
 * @help
 * ...
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBSWindows');

Lecode.S_TBS.Windows.positioningWindowFloatRange = 20;

Lecode.S_TBS.Windows.hpTextColor = 2;                   //  (): Color code of HP
Lecode.S_TBS.Windows.mpTextColor = 3;                   //  (): Color code of MP

Lecode.S_TBS.Windows.statusWindowW = "270";
Lecode.S_TBS.Windows.statusWindowH = "window.fittingHeight(3);";
Lecode.S_TBS.Windows.statusWindowX = "0";
Lecode.S_TBS.Windows.statusWindowY = "Graphics.height - window.height";
Lecode.S_TBS.Windows.statusWindowSpriteBoxW = 100;
Lecode.S_TBS.Windows.statusWindowSpriteBoxH = "window.lineHeight(2);";
Lecode.S_TBS.Windows.statusWindowMaxStates = 3;

Lecode.S_TBS.Windows.commandWindowW = "200";
Lecode.S_TBS.Windows.commandWindowVisibleLines = "4";
Lecode.S_TBS.Windows.commands = "['Move','Attack','Skill','Item','Pass','Examine']";
Lecode.S_TBS.Windows.commandIcons = "[82,76,64,182,75,84]";
Lecode.S_TBS.Windows.commandWindowFloatRange = 20;

Lecode.S_TBS.Windows.skillWindowW = "450";
Lecode.S_TBS.Windows.skillWindowH = "window.fittingHeight(4);";
Lecode.S_TBS.Windows.skillWindowFloatRange = 20;

Lecode.S_TBS.Windows.itemWindowW = "300";
Lecode.S_TBS.Windows.itemWindowH = "window.fittingHeight(4);";
Lecode.S_TBS.Windows.itemWindowFloatRange = 20;

Lecode.S_TBS.Windows.endCommandWindowW = "220";
Lecode.S_TBS.Windows.endCommandWindowVisibleLines = "3";

/*-------------------------------------------------------------------------
* Window_TBSConfirm
-------------------------------------------------------------------------*/
Window_TBSConfirm.prototype = Object.create(LeU_WindowConfirmation.prototype);
Window_TBSConfirm.prototype.constructor = Window_TBSConfirm;

Window_TBSConfirm.prototype.initialize = function () {
    LeU_WindowConfirmation.prototype.initialize.call(this);
};

/*-------------------------------------------------------------------------
* Window_TBSPositioning
-------------------------------------------------------------------------*/
Window_TBSPositioning.prototype = Object.create(Window_Selectable.prototype);
Window_TBSPositioning.prototype.constructor = Window_TBSPositioning;

Window_TBSPositioning.prototype.initialize = function () {
    var w = this.windowWidth();
    var h = this.windowHeight();
    Window_Selectable.prototype.initialize.call(this, 0, 0, w, h);
    this._lastIndex = 0;
    this._disabled = {};
    this._fixedIndexes = [];
    this.loadFaces();
};

Window_TBSPositioning.prototype.loadFaces = function() {
    $gameParty.members().forEach(function(actor) {
        ImageManager.loadFace(actor.faceName());
    });
};

Window_TBSPositioning.prototype.actor = function () {
    return $gameParty.members()[this._index];
};

Window_TBSPositioning.prototype.selectLast = function () {
    this.select(this._lastIndex);
};

Window_TBSPositioning.prototype.windowWidth = function () {
    return this.itemFrameWidth() + this.standardPadding() * 2;
};

Window_TBSPositioning.prototype.windowHeight = function () {
    return this.fittingHeight(4 * 3);
};

Window_TBSPositioning.prototype.itemFrameWidth = function () {
    return Window_Base._faceWidth + Window_Base._iconWidth * 5;
};

Window_TBSPositioning.prototype.visibleItems = function () {
    return 3;
};

Window_TBSPositioning.prototype.maxCols = function () {
    return 1;//$gameParty.members().length;//this.visibleItems();
};

Window_TBSPositioning.prototype.maxItems = function () {
    return $gameParty.members().length;
};

Window_TBSPositioning.prototype.spacing = function () {
    return 0;
};

Window_TBSPositioning.prototype.itemWidth = function () {
    return this.itemFrameWidth();
};

Window_TBSPositioning.prototype.itemHeight = function () {
    return this.lineHeight() * 4;
};

Window_TBSPositioning.prototype.disableSelection = function () {
    this._disabled[this._index] = true;
};

Window_TBSPositioning.prototype.enableSelection = function () {
    this._disabled[this._index] = false;
};

Window_TBSPositioning.prototype.setFixedActor = function (actor) {
    var i = 0;
    $gameParty.members().forEach(function(member){
        if (member.actorId() === actor.actorId()) {
            this._disabled[i] = true;
            this._fixedIndexes.push(i);
        }
        i++;
    }.bind(this));
};

Window_TBSPositioning.prototype.isEnabled = function(index) {
    return !this._fixedIndexes.contains(index);
};

Window_TBSPositioning.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.index());
};

Window_TBSPositioning.prototype.drawItem = function (index) {
    var actor = $gameParty.members()[index];
    var rect = this.itemRect(index);
    var x = rect.x;
    var y = rect.y;
    var w;
    this.changePaintOpacity(!this._disabled[index]);
    this.drawActorFace(actor, x, y, Window_Base._faceWidth, Window_Base._faceHeight);
    x += Window_Base._faceWidth;
    this.drawText(actor.name(), x, y, this.contents.height);
    w = this.itemFrameWidth() - Window_Base._faceWidth - 2;
    y += this.lineHeight();
    this.drawActorHp(actor, x, y, w);
    y += this.lineHeight();
    this.drawActorMp(actor, x, y, w);
    y += this.lineHeight();
    this.drawActorIcons(actor, x, y, Window_Base._iconWidth * 5);
};

Window_TBSPositioning.prototype.drawFace = function(faceName, faceIndex, x, y, width, height) {
    width = width || Window_Base._faceWidth;
    height = height || Window_Base._faceHeight;
    var bitmap = ImageManager.loadFace(faceName);
    var pw = Window_Base._faceWidth;
    var ph = Window_Base._faceHeight;
    var sw = Math.min(width, pw);
    var sh = Math.min(height, ph);
    var dx = Math.floor(x + Math.max(width - pw, 0) / 2);
    var dy = Math.floor(y + Math.max(height - ph, 0) / 2);
    var sx = faceIndex % 4 * pw + (pw - sw) / 2;
    var sy = Math.floor(faceIndex / 4) * ph + (ph - sh) / 2;
    bitmap.smooth = true;
    this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
};

Window_TBSPositioning.prototype._updateCursor = function () {
    var blinkCount = this._animationCount % 40;
    var cursorOpacity = 255;
    if (this.active) {
        if (blinkCount < 20) {
            cursorOpacity -= blinkCount * 8;
        } else {
            cursorOpacity -= (40 - blinkCount) * 8;
        }
    }
    this._windowCursorSprite.alpha = cursorOpacity / 255;
    this._windowCursorSprite.visible = this.isOpen();
};

Window_TBSPositioning.prototype.cursorUp = function (wrap) {
    Window_Selectable.prototype.cursorUp.call(this, wrap);
    if (this.index() === this.maxItems() - 1)
        this.callHandler("exit_up");
};

Window_TBSPositioning.prototype.processOk = function() {
    this._lastIndex = this.index();
    Window_Selectable.prototype.processOk.call(this);
};


/*-------------------------------------------------------------------------
* Window_TBSPositioningConfirm
-------------------------------------------------------------------------*/
Window_TBSPositioningConfirm.prototype = Object.create(Window_Command.prototype);
Window_TBSPositioningConfirm.prototype.constructor = Window_TBSPositioningConfirm;

Window_TBSPositioningConfirm.prototype.initialize = function (w) {
    this._goalWidth = w;
    Window_Command.prototype.initialize.call(this, 0, 0);
    this._enabled = false;
    this.deselect();
};

Window_TBSPositioningConfirm.prototype.setEnabled = function (bool) {
    this._enabled = !!bool;
};

Window_TBSPositioningConfirm.prototype.makeCommandList = function () {
    this.addCommand(this.text(), 'ok', this._enabled );
};

Window_TBSPositioningConfirm.prototype.text = function () {
    return "Start battle";
};

Window_TBSPositioningConfirm.prototype.windowWidth = function () {
    return this._goalWidth;
};

Window_TBSPositioningConfirm.prototype.windowHeight = function () {
    return this.fittingHeight(1);
};

Window_TBSPositioningConfirm.prototype.numVisibleRows = function () {
    return 1;
};

Window_TBSPositioningConfirm.prototype.drawItem = function (index) {
    var w = this.textWidth(this.text()) + Window_Base._iconWidth + 2;
    var x = this.contentsWidth() / 2 - w / 2;
    this.changePaintOpacity(this._enabled);
    this.drawIcon(77, x, 0);
    x += Window_Base._iconWidth + 2;
    this.leU_drawText(this.text(), x, 0);
};

Window_TBSPositioningConfirm.prototype.cursorDown = function (wrap) {
    Window_Command.prototype.cursorDown.call(this, wrap);
    this.callHandler("cursor_down");
};

Window_TBSPositioningConfirm.prototype.isCursorMovable = function() {
    return this.active;
};


/*-------------------------------------------------------------------------
* Window_TBSPositioningInfo
-------------------------------------------------------------------------*/
Window_TBSPositioningInfo.prototype = Object.create(Window_Base.prototype);
Window_TBSPositioningInfo.prototype.constructor = Window_TBSPositioningInfo;

Window_TBSPositioningInfo.prototype.initialize = function (x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._battler = null;
    this.refresh();
    this._leU_floatData = {
        range: [0, Lecode.S_TBS.Windows.positioningWindowFloatRange],
        sens: ["+", "+"],
        speed: 2
    };
};

Window_TBSPositioningInfo.prototype.windowWidth = function () {
    return 180;
};

Window_TBSPositioningInfo.prototype.windowHeight = function () {
    return this.fittingHeight(3);
};

Window_TBSPositioningInfo.prototype.refresh = function () {
    this.contents.clear();
    this.resetFontSettings();
    if (!this._battler) return;
    var x = 0;
    var y = 0;
    //- Character
    this.drawActorCharacter(this._battler, x, y);
    //- HP
    x = 48 + 2;
    this.drawIcon(84, x, y);
    x += 32;
    this.changeTextColor(this.normalColor());
    this.leU_drawText(String(this._battler.hp), x, y);
    //- MP
    x = 48 + 2;
    y += this.lineHeight();
    this.drawIcon(67, x, y);
    x += 32;
    this.changeTextColor(this.normalColor());
    this.leU_drawText(String(this._battler.mp), x, y);
    //- TP
    x = 48 + 2;
    y += this.lineHeight();
    this.drawIcon(78, x, y);
    x += 32;
    this.changeTextColor(this.normalColor());
    this.leU_drawText(String(this._battler.tp), x, y);
};

Window_TBSPositioningInfo.prototype.drawCharacter = function (characterName, characterIndex, x, y) {
    var bitmap = ImageManager.loadCharacter(characterName);
    var big = ImageManager.isBigCharacter(characterName);
    var pw = bitmap.width / (big ? 3 : 12);
    var ph = bitmap.height / (big ? 4 : 8);
    var n = characterIndex;
    var sx = (n % 4 * 3 + 1) * pw;
    var sy = (Math.floor(n / 4) * 4) * ph;
    this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
};


/*-------------------------------------------------------------------------
* Window_TBSStatus
-------------------------------------------------------------------------*/
Window_TBSStatus.prototype = Object.create(Window_Base.prototype);
Window_TBSStatus.prototype.constructor = Window_TBSStatus;

Window_TBSStatus.prototype.initialize = function () {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    var window = this;
    var x = eval(Lecode.S_TBS.Windows.statusWindowX);
    var y = eval(Lecode.S_TBS.Windows.statusWindowY);
    this.x = x;
    this.y = y;
    this._entity = null;
    this._sliding = false;
    this.refresh();
};

Window_TBSStatus.prototype.windowWidth = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.statusWindowW);
};

Window_TBSStatus.prototype.windowHeight = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.statusWindowH);
};

Window_TBSStatus.prototype.slide  = function () {
    this._sliding = true;
    this.x = -this.width;
};

Window_TBSStatus.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    var speed = 8;
    var destX = eval(Lecode.S_TBS.Windows.statusWindowX);
    if (this._sliding) {
        this.x += speed;
        if (this.x >= destX) {
            this._sliding = false;
            this.x = destX;
        }
    }
};

Window_TBSStatus.prototype.refresh = function () {
    this.contents.clear();
    this.resetFontSettings();
    if (!this._entity) return;
    var x, y, w, h;
    //- Face
    x = 20;
    y = this.lineHeight();
    this.drawSprite(x, y);
    //- Name
    x = Lecode.S_TBS.Windows.statusWindowSpriteBoxW;
    y = 0;
    this.contents.fontSize += 2;
    this.changeTextColor(this.systemColor());
    this.leU_drawText(this._entity.battler().name(), "center", y);
    this.contents.fontSize -= 4;
    //- HP and Gauge
    y += this.lineHeight();
    this.drawActorHp(this._entity.battler(), x, y, 130);
    //- MP and Gauge
    y += this.lineHeight();
    this.drawActorMp(this._entity.battler(), x, y, 130);
    // - States
    x = 2;
    var max = Lecode.S_TBS.Windows.statusWindowMaxStates;
    this.drawActorIcons(this._entity.battler(), x, y, Window_Base._iconWidth * max);
};

Window_TBSStatus.prototype.drawSprite = function (x, y) {
    var bitmap = ImageManager.loadLeTBSStatus(this._entity.filenameID());
    var window = this;
    bitmap.addLoadListener(function () {
        var dx = eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxW) / 2 - bitmap.width / 2;
        var dy = 20 + eval(Lecode.S_TBS.Windows.statusWindowSpriteBoxH) / 2 - bitmap.height / 2;
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy);
    }.bind(this));
};


/*-------------------------------------------------------------------------
* Window_TBSCommand
-------------------------------------------------------------------------*/
Window_TBSCommand.prototype = Object.create(Window_Command.prototype);
Window_TBSCommand.prototype.constructor = Window_TBSCommand;

Window_TBSCommand.prototype.initialize = function () {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._battler = null;
    this._entity = null;
    this.startFloat();
    this.endFloat();
};

Window_TBSCommand.prototype.startFloat = function () {
    this._leU_floatData = {
        range: [0, Lecode.S_TBS.Windows.commandWindowFloatRange],
        sens: ["+", "+"],
        speed: 2
    };
};

Window_TBSCommand.prototype.endFloat = function () {
    this._leU_floatData.speed = 0;
};

Window_TBSCommand.prototype.resumeFloat = function () {
    this._leU_floatData.speed = 2;
};

Window_TBSCommand.prototype.windowWidth = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.commandWindowW);
};

Window_TBSCommand.prototype.numVisibleRows = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.commandWindowVisibleLines);
};

Window_TBSCommand.prototype.makeCommandList = function () {
    var window = this;
    if (this._battler) {
        var array = eval(Lecode.S_TBS.Windows.commands);
        array.forEach(function (com) {
            eval("window.add" + com + "Command();");
        }.bind(this));
    }
};

Window_TBSCommand.prototype.addAttackCommand = function () {
    this.addCommand(TextManager.attack, 'attack', this._entity.canAttackCommand());
};

Window_TBSCommand.prototype.addSkillCommand = function () {
    this.addSkillCommands();
};

Window_TBSCommand.prototype.addSkillCommands = function () {
    var skillTypes = this._battler.addedSkillTypes();
    skillTypes.sort(function (a, b) {
        return a - b;
    });
    skillTypes.forEach(function (stypeId) {
        var name = $dataSystem.skillTypes[stypeId];
        this.addCommand(name, 'skill', this._entity.canSkillCommand(), stypeId);
    }, this);
};

Window_TBSCommand.prototype.addGuardCommand = function () {
    this.addCommand(TextManager.guard, 'guard', this._entity.canGuard());
};

Window_TBSCommand.prototype.addItemCommand = function () {
    this.addCommand(TextManager.item, 'item', this._entity.canItemCommand());
};

Window_TBSCommand.prototype.addMoveCommand = function () {
    this.addCommand("Move", "move", this._entity.canMoveCommand());
};

Window_TBSCommand.prototype.addPassCommand = function () {
    this.addCommand("Pass", "pass");
};

Window_TBSCommand.prototype.addExamineCommand = function () {
    this.addCommand("Examine", "examine");
};

Window_TBSCommand.prototype.setup = function (actor, entity) {
    this._battler = actor;
    this._entity = entity;
    this.clearCommandList();
    this.makeCommandList();
    this.refresh();
    this.selectLast();
    this.activate();
    this.show();
    this.open();
};

Window_TBSCommand.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if(this._entity) {
        var x = this._entity._posX - this.windowWidth() / 2;
        var y = this._entity._posY - this.windowHeight();
        this.x = x + this._entity.width() / 2;
        this.y = y;
    }
};

Window_TBSCommand.prototype.processOk = function () {
    if (this._battler) {
        if (ConfigManager.commandRemember) {
            this._battler.setLastCommandSymbol(this.currentSymbol());
        } else {
            this._battler.setLastCommandSymbol('');
        }
    }
    Window_Command.prototype.processOk.call(this);
};

Window_TBSCommand.prototype.selectLast = function () {
    this.select(0);
    if (this._battler && ConfigManager.commandRemember) {
        this.selectSymbol(this._battler.lastCommandSymbol());
    }
};

Window_TBSCommand.prototype.drawItem = function (index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawIcon(this.commandIcon(index), rect.x, rect.y + 2);
    rect.x += Window_Base._iconWidth + 2;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_TBSCommand.prototype.commandIcon = function (index) {
    var array = eval(Lecode.S_TBS.Windows.commandIcons);
    return array[index];
};

/*-------------------------------------------------------------------------
* Window_TBSSkillList
-------------------------------------------------------------------------*/
function Window_TBSSkillList() {
    this.initialize.apply(this, arguments);
}
Window_TBSSkillList.prototype = Object.create(Window_BattleSkill.prototype);
Window_TBSSkillList.prototype.constructor = Window_TBSSkillList;

Window_TBSSkillList.prototype.initialize = function () {
    var w = this.windowWidth();
    var h = this.windowHeight();
    Window_BattleSkill.prototype.initialize.call(this, 0, 0, w, h);
    this._entity = null;
};

Window_TBSSkillList.prototype.includes = function (item) {
    return item;
};

Window_TBSSkillList.prototype.windowWidth = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.skillWindowW);
};

Window_TBSSkillList.prototype.windowHeight = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.skillWindowH);
};

Window_TBSSkillList.prototype.maxCols = function () {
    return 1;
};

Window_TBSSkillList.prototype.update = function () {
    Window_BattleSkill.prototype.update.call(this);
    if(this._entity) {
        var x = this._entity._posX - this.windowWidth() / 2;
        var y = this._entity._posY - this.windowHeight();
        this.x = x + this._entity.width() / 2;
        this.y = y;
    }
};

/*-------------------------------------------------------------------------
* Window_TBSItemList
-------------------------------------------------------------------------*/
function Window_TBSItemList() {
    this.initialize.apply(this, arguments);
}
Window_TBSItemList.prototype = Object.create(Window_BattleItem.prototype);
Window_TBSItemList.prototype.constructor = Window_TBSItemList;

Window_TBSItemList.prototype.initialize = function () {
    var w = this.windowWidth();
    var h = this.windowHeight();
    Window_BattleItem.prototype.initialize.call(this, 0, 0, w, h);
    this._entity = null;
};

Window_TBSItemList.prototype.windowWidth = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.itemWindowW);
};

Window_TBSItemList.prototype.windowHeight = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.itemWindowH);
};

Window_TBSItemList.prototype.maxCols = function () {
    return 1;
};

Window_TBSItemList.prototype.update = function () {
    Window_ItemList.prototype.update.call(this);
    if(this._entity) {
        var x = this._entity._posX - this.windowWidth() / 2;
        var y = this._entity._posY - this.windowHeight();
        this.x = x + this._entity.width() / 2;
        this.y = y;
    }
};


/*-------------------------------------------------------------------------
* Window_TBSEndCommand
-------------------------------------------------------------------------*/
Window_TBSEndCommand.prototype = Object.create(Window_Command.prototype);
Window_TBSEndCommand.prototype.constructor = Window_TBSEndCommand;

Window_TBSEndCommand.prototype.initialize = function () {
    var x = Graphics.width / 2 - this.windowWidth() / 2;
    var y = Graphics.height / 2 - this.windowHeight() / 2;
    Window_Command.prototype.initialize.call(this, x, y);
    this.openness = 0;
    this.deactivate();
};

Window_TBSEndCommand.prototype.windowWidth = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.endCommandWindowW);
};

Window_TBSEndCommand.prototype.numVisibleRows = function () {
    var window = this;
    return eval(Lecode.S_TBS.Windows.endCommandWindowVisibleLines);
};

Window_TBSEndCommand.prototype.makeCommandList = function () {
    this.addCommand("Options", "options", false);
    this.addCommand("Escape", "escape", BattleManager.canEscape());
};
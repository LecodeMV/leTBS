/*
#=============================================================================
# Windows for Lecode's TBS
# LeTBSWindows.js
# By Lecode
# Version A - 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# This plugin is under the MIT License.
# (http://choosealicense.com/licenses/mit/)
# In addition, you should keep this header.
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Lecode = Lecode || {};
if (!Lecode.S_TBS)
    throw new Error("LeTBSWindows must be below LeTBS");
/*:
 * @plugindesc (WIP)Version A Windows for LeTBS
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
var parameters = PluginManager.parameters('LeTBSWindows');

Lecode.S_TBS.placementWindowFloatRange = 20;

Lecode.S_TBS.hpTextColor = 2;                   //  (): Color code of HP
Lecode.S_TBS.mpTextColor = 3;                   //  (): Color code of MP

Lecode.S_TBS.statusWindowW = "240";
Lecode.S_TBS.statusWindowH = "window.fittingHeight(3);";
Lecode.S_TBS.statusWindowX = "0";
Lecode.S_TBS.statusWindowY = "Graphics.height - window.height";
Lecode.S_TBS.statusWindowSpriteBoxW = 100;
Lecode.S_TBS.statusWindowSpriteBoxH = "window.lineHeight(2);";
Lecode.S_TBS.statusWindowMaxStates = 3;

Lecode.S_TBS.commandWindowW = "200";
Lecode.S_TBS.commandWindowVisibleLines = "4";
Lecode.S_TBS.commands = "['Move','Attack','Skill','Item','Pass','Examine']";
Lecode.S_TBS.commandIcons = "[82,76,64,182,75,84]";
Lecode.S_TBS.commandWindowFloatRange = 20;

Lecode.S_TBS.skillWindowW = "450";
Lecode.S_TBS.skillWindowH = "window.fittingHeight(4);";
Lecode.S_TBS.skillWindowFloatRange = 20;

Lecode.S_TBS.itemWindowW = "300";
Lecode.S_TBS.itemWindowH = "window.fittingHeight(4);";
Lecode.S_TBS.itemWindowFloatRange = 20;

Lecode.S_TBS.endCommandWindowW = "200";
Lecode.S_TBS.endCommandWindowVisibleLines = "2";


/*-------------------------------------------------------------------------
* Window_TBSConfirm
-------------------------------------------------------------------------*/
Window_TBSConfirm.prototype = Object.create(LeU_WindowConfirmation.prototype);
Window_TBSConfirm.prototype.constructor = Window_TBSConfirm;

Window_TBSConfirm.prototype.initialize = function() {
    LeU_WindowConfirmation.prototype.initialize.call(this);
};

/*-------------------------------------------------------------------------
* Window_TBSPlacementInfo
-------------------------------------------------------------------------*/
Window_TBSPlacementInfo.prototype = Object.create(Window_Base.prototype);
Window_TBSPlacementInfo.prototype.constructor = Window_TBSPlacementInfo;

Window_TBSPlacementInfo.prototype.initialize = function(x, y) {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, x, y, width, height);
    this._battler = null;
    this.refresh();
    this._leU_floatData = {
        range: [0, Lecode.S_TBS.placementWindowFloatRange],
        sens: ["+", "+"],
        speed: 2
    };
};

Window_TBSPlacementInfo.prototype.windowWidth = function() {
    return 180;
};

Window_TBSPlacementInfo.prototype.windowHeight = function() {
    return this.fittingHeight(3);
};

Window_TBSPlacementInfo.prototype.refresh = function() {
    this.contents.clear();
    this.resetFontSettings();
    if (!this._battler) return;
    var x;
    var y;
    //- Character
    x = 20;
    y = this.lineHeight() * 2.5;
    this.drawActorCharacter(this._battler, x, y);
    //- Name
    x = 0;
    y = 4;
    this.contents.fontSize += 3;
    this.changeTextColor(this.systemColor());
    this.leU_drawText(this._battler.name(), x, y, "x");
    //- HP
    x = 60;
    y += this.lineHeight() + 4;
    this.contents.fontSize -= 12;
    this.changeTextColor(this.normalColor());
    var rect = this.leU_drawText(String(this._battler.hp), x, y);
    x += rect.w + 4;
    this.changeTextColor(this.textColor(Lecode.S_TBS.hpTextColor));
    this.leU_drawText(TextManager.hpA, x, y);
    //- MP
    x = 60;
    y += this.lineHeight();
    this.changeTextColor(this.normalColor());
    var rect = this.leU_drawText(String(this._battler.mp), x, y);
    x += rect.w + 4;
    this.changeTextColor(this.textColor(Lecode.S_TBS.mpTextColor));
    this.leU_drawText(TextManager.mpA, x, y);
};

/*-------------------------------------------------------------------------
* Window_TBSStatus
-------------------------------------------------------------------------*/
Window_TBSStatus.prototype = Object.create(Window_Base.prototype);
Window_TBSStatus.prototype.constructor = Window_TBSStatus;

Window_TBSStatus.prototype.initialize = function() {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    var window = this;
    var x = eval(Lecode.S_TBS.statusWindowX);
    var y = eval(Lecode.S_TBS.statusWindowY);
    this.x = x;
    this.y = y;
    this._battler = null;
    this.refresh();
};

Window_TBSStatus.prototype.windowWidth = function() {
    var window = this;
    return eval(Lecode.S_TBS.statusWindowW);
};

Window_TBSStatus.prototype.windowHeight = function() {
    var window = this;
    return eval(Lecode.S_TBS.statusWindowH);
};

Window_TBSStatus.prototype.refresh = function() {
    this.contents.clear();
    this.resetFontSettings();
    if (!this._battler) return;
    var x, y, w, h;
    //- Face
    x = 20;
    y = this.lineHeight();
    this.drawSprite(this._battler, x, y);
    //- Name
    x = Lecode.S_TBS.statusWindowSpriteBoxW;
    y = 0;
    this.contents.fontSize += 2;
    this.changeTextColor(this.systemColor());
    this.leU_drawText(this._battler.name(), x, y);
    this.contents.fontSize -= 4;
    //- HP and Gauge
    y += this.lineHeight();
    this.drawActorHp(this._battler, x, y, 100);
    //- MP and Gauge
    y += this.lineHeight();
    this.drawActorMp(this._battler, x, y, 100);
    // - States
    x = 2;
    var max = Lecode.S_TBS.statusWindowMaxStates;
    this.drawActorIcons(this._battler, x, y, Window_Base._iconWidth * max);
};

Window_TBSStatus.prototype.drawSprite = function(battler, x, y) {
    var bitmap;
    if (battler.isActor())
        bitmap = ImageManager.loadLeTBSStatus(battler.name() + "_Sprite");
    else
        bitmap = ImageManager.loadLeTBSStatus(battler.originalName() + "_Sprite");
    var window = this;
    bitmap.addLoadListener(function() {
        var dx = eval(Lecode.S_TBS.statusWindowSpriteBoxW) / 2 - bitmap.width / 2;
        var dy = 20 + eval(Lecode.S_TBS.statusWindowSpriteBoxH) / 2 - bitmap.height / 2;
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy);
    }.bind(this));
};
/*
Window_TBSStatus.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var icons = actor.allIcons().slice(0, Math.floor(width / Window_Base._iconWidth));
    for (var i = 0; i < icons.length; i++) {
        this.drawIcon(icons[i], x + Window_Base._iconWidth * i, y + 2);
    }
};*/


/*-------------------------------------------------------------------------
* Window_TBSCommand
-------------------------------------------------------------------------*/
Window_TBSCommand.prototype = Object.create(Window_Command.prototype);
Window_TBSCommand.prototype.constructor = Window_TBSCommand;

Window_TBSCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.openness = 0;
    this.deactivate();
    this._battler = null;
    this._entity = null;
    this.startFloat();
    this.endFloat();
};

Window_TBSCommand.prototype.startFloat = function() {
    this._leU_floatData = {
        range: [0, Lecode.S_TBS.commandWindowFloatRange],
        sens: ["+", "+"],
        speed: 2
    };
};

Window_TBSCommand.prototype.endFloat = function() {
    this._leU_floatData.speed = 0;
};

Window_TBSCommand.prototype.resumeFloat = function() {
    this._leU_floatData.speed = 2;
};

Window_TBSCommand.prototype.windowWidth = function() {
    var window = this;
    return eval(Lecode.S_TBS.commandWindowW);
};

Window_TBSCommand.prototype.numVisibleRows = function() {
    var window = this;
    return eval(Lecode.S_TBS.commandWindowVisibleLines);
};

Window_TBSCommand.prototype.makeCommandList = function() {
    var window = this;
    if (this._battler) {
        var array = eval(Lecode.S_TBS.commands);
        array.forEach(function(com) {
            eval("window.add" + com + "Command();");
        }.bind(this));
    }
};

Window_TBSCommand.prototype.addAttackCommand = function() {
    this.addCommand(TextManager.attack, 'attack', this._entity.canAttackCommand());
};

Window_TBSCommand.prototype.addSkillCommand = function() {
    this.addSkillCommands();
};

Window_TBSCommand.prototype.addSkillCommands = function() {
    var skillTypes = this._battler.addedSkillTypes();
    skillTypes.sort(function(a, b) {
        return a - b;
    });
    skillTypes.forEach(function(stypeId) {
        var name = $dataSystem.skillTypes[stypeId];
        this.addCommand(name, 'skill', this._entity.canSkillCommand(), stypeId);
    }, this);
};

Window_TBSCommand.prototype.addGuardCommand = function() {
    this.addCommand(TextManager.guard, 'guard', this._entity.canGuard());
};

Window_TBSCommand.prototype.addItemCommand = function() {
    this.addCommand(TextManager.item, 'item', this._entity.canItemCommand());
};

Window_TBSCommand.prototype.addMoveCommand = function() {
    this.addCommand("Move", "move", this._entity.canMoveCommand());
};

Window_TBSCommand.prototype.addPassCommand = function() {
    this.addCommand("Pass", "pass");
};

Window_TBSCommand.prototype.addExamineCommand = function() {
    this.addCommand("Examine", "examine");
};

Window_TBSCommand.prototype.setup = function(actor, entity) {
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

Window_TBSCommand.prototype.processOk = function() {
    if (this._battler) {
        if (ConfigManager.commandRemember) {
            this._battler.setLastCommandSymbol(this.currentSymbol());
        } else {
            this._battler.setLastCommandSymbol('');
        }
    }
    Window_Command.prototype.processOk.call(this);
};

Window_TBSCommand.prototype.selectLast = function() {
    this.select(0);
    if (this._battler && ConfigManager.commandRemember) {
        this.selectSymbol(this._battler.lastCommandSymbol());
    }
};

Window_TBSCommand.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawIcon(this.commandIcon(index), rect.x, rect.y + 2);
    rect.x += Window_Base._iconWidth + 2;
    this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
};

Window_TBSCommand.prototype.commandIcon = function(index) {
    var array = eval(Lecode.S_TBS.commandIcons);
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

Window_TBSSkillList.prototype.initialize = function() {
    var w = this.windowWidth();
    var h = this.windowHeight();
    Window_BattleSkill.prototype.initialize.call(this, 0, 0, w, h);
    this.startFloat();
    this.endFloat();
};

Window_TBSSkillList.prototype.startFloat = function() {
    this._leU_floatData = {
        range: [0, Lecode.S_TBS.commandWindowFloatRange],
        sens: ["+", "+"],
        speed: 2
    };
};

Window_TBSSkillList.prototype.endFloat = function() {
    this._leU_floatData.speed = 0;
};

Window_TBSSkillList.prototype.resumeFloat = function() {
    this._leU_floatData.speed = 2;
};

Window_TBSSkillList.prototype.includes = function(item) {
    return item;
};

Window_TBSSkillList.prototype.windowWidth = function() {
    var window = this;
    return eval(Lecode.S_TBS.skillWindowW);
};

Window_TBSSkillList.prototype.windowHeight = function() {
    var window = this;
    return eval(Lecode.S_TBS.skillWindowH);
};

Window_TBSSkillList.prototype.maxCols = function() {
    return 1;
};

/*-------------------------------------------------------------------------
* Window_TBSItemList
-------------------------------------------------------------------------*/
function Window_TBSItemList() {
    this.initialize.apply(this, arguments);
}
Window_TBSItemList.prototype = Object.create(Window_BattleItem.prototype);
Window_TBSItemList.prototype.constructor = Window_TBSItemList;

Window_TBSItemList.prototype.initialize = function() {
    var w = this.windowWidth();
    var h = this.windowHeight();
    Window_BattleItem.prototype.initialize.call(this, 0, 0, w, h);
    this.startFloat();
    this.endFloat();
};

Window_TBSItemList.prototype.startFloat = function() {
    this._leU_floatData = {
        range: [0, Lecode.S_TBS.commandWindowFloatRange],
        sens: ["+", "+"],
        speed: 2
    };
};

Window_TBSItemList.prototype.endFloat = function() {
    this._leU_floatData.speed = 0;
};

Window_TBSItemList.prototype.resumeFloat = function() {
    this._leU_floatData.speed = 2;
};

Window_TBSItemList.prototype.windowWidth = function() {
    var window = this;
    return eval(Lecode.S_TBS.itemWindowW);
};

Window_TBSItemList.prototype.windowHeight = function() {
    var window = this;
    return eval(Lecode.S_TBS.itemWindowH);
};

Window_TBSItemList.prototype.maxCols = function() {
    return 1;
};


/*-------------------------------------------------------------------------
* Window_TBSEndCommand
-------------------------------------------------------------------------*/
Window_TBSEndCommand.prototype = Object.create(Window_Command.prototype);
Window_TBSEndCommand.prototype.constructor = Window_TBSEndCommand;

Window_TBSEndCommand.prototype.initialize = function() {
    var x = Graphics.width / 2 - this.windowWidth() / 2;
    var y = Graphics.height / 2 - this.windowHeight() / 2;
    Window_Command.prototype.initialize.call(this, x, y);
    this.openness = 0;
    this.deactivate();
};

Window_TBSEndCommand.prototype.windowWidth = function() {
    var window = this;
    return eval(Lecode.S_TBS.endCommandWindowW);
};

Window_TBSEndCommand.prototype.numVisibleRows = function() {
    var window = this;
    return eval(Lecode.S_TBS.endCommandWindowVisibleLines);
};

Window_TBSEndCommand.prototype.makeCommandList = function() {
    this.addCommand("Options", "options", false);
    this.addCommand("Escape", "escape", BattleManager.canEscape());
};
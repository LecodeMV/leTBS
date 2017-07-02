/*
#=============================================================================
# LeTBS: Commands
# LeTBS_Commands.js
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
Imported.LeTBS_Commands = true;

var Lecode = Lecode || {};
Lecode.S_TBS.Commands = {};
/*:
 * @plugindesc LeTBS Commands Window
 * @author Lecode
 * @version 1.0
 **
* @param Commands
* @desc Default commands string
* @default move 82, attack 76, [extra], skills 64, items 182, scan 75, pass 84
*
* @param Move Command Text
* @desc ...
* @default Move
*
* @param Scan Command Text
* @desc ...
* @default Scan
*
* @param Pass Command Text
* @desc ...
* @default End Turn
*
* @param Width
* @desc ...
* @default 240
*
* @param Visible Lines
* @desc Visible lines of the window
* @default 4
*
* @param Preview Move Scope
* @desc Show the move scope when the command window is open ?
* @default true
*
* @param Preview Action Scopes
* @desc Show skills and items scopes when the command window is open ?
* @default true
*
 * @help
 * ...
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_Commands');

Lecode.S_TBS.Commands.default = String(parameters["Commands"] || "move 82, attack 76, [extra], skills 64, items 182, scan 75, pass 84");	//	(Commands): Default commands string
Lecode.S_TBS.Commands.moveCommandText = String(parameters["Move Command Text"] || "Move");
Lecode.S_TBS.Commands.scanCommandText = String(parameters["Scan Command Text"] || "Scan");
Lecode.S_TBS.Commands.passCommandText = String(parameters["Pass Command Text"] || "End Turn");
Lecode.S_TBS.Commands.width = Number(parameters["Width"] || 240);
Lecode.S_TBS.Commands.visibleLines = Number(parameters["Visible Lines"] || 4);	//	(): Visible lines of the window
Lecode.S_TBS.Commands.previewMoveScope = String(parameters["Preview Move Scope"] || 'true') === 'true';	//	(): Show the move scope when the command window is open ?
Lecode.S_TBS.Commands.previewActionScopes = String(parameters["Preview Action Scopes"] || 'true') === 'true';	//	(): Show skills and items scopes when the command window is open ?


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
TBSEntity.prototype.getCommandsString = function () {
    var value = this.rpgObject().leTbs_commands;
    var extra = "";
    this.battler().states().forEach(function (state) {
        if (state) {
            extra += " " + state.leTbs_commands;
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function (equip) {
            if (equip) {
                extra += " " + equip.leTbs_commands;
            }
        });
    }
    return value.replace("[extra]",extra);
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
    this._icons = [];
};

Window_TBSCommand.prototype.windowWidth = function () {
    return Lecode.S_TBS.Commands.width;
};

Window_TBSCommand.prototype.numVisibleRows = function () {
    return Lecode.S_TBS.Commands.visibleLines;
};

Window_TBSCommand.prototype.callOkHandler = function () {
    var symbol = this.currentSymbol();
    BattleManagerTBS.getLayer("scopes").clear();
    BattleManagerTBS.clearMoveSelection();
    BattleManagerTBS.clearActionSelection();
    BattleManagerTBS._moveScope = {};
    BattleManagerTBS._actionScope = {};
    if (symbol === "ok" || symbol === "cancel") {
        Window_Command.prototype.callOkHandler.call(this);
        return;
    }
    LeUtilities.getScene().onCommandInput(symbol);
};

Window_TBSCommand.prototype.makeCommandList = function () {
    if (this._battler) {
        var str = this.getCommandsString();
        var array = str.split(",").map(function (str) {
            return str.trim();
        });
        this.makeIcons(array);
        array = array.map(function (str) {
            return str.replace(/\s+\d+/ig, "");
        });
        array.forEach(function (com) {
            if (com.match(/skill\[(\d+)\]/i))
                this.addCommand_skill(Number(RegExp.$1));
            else
                eval("this.addCommand_" + com + "();");
        }.bind(this));
    }
};

Window_TBSCommand.prototype.getCommandsString = function () {
    var str = this._entity.getCommandsString();
    return str || Lecode.S_TBS.Commands.default.replace(/\[extra\]\s*\,/ig,"");
};

Window_TBSCommand.prototype.makeIcons = function (array) {
    this._icons = array.map(function (str) {
        if (str.match(/\s+(\d+)/i))
            return Number(RegExp.$1);
        if (str.match(/skill\[(\d+)\]/i))
            return $dataSkills[Number(RegExp.$1)].iconIndex;
        return 0;
    });
};

Window_TBSCommand.prototype.addCommand_attack = function () {
    this.addCommand(TextManager.attack, 'attack', this._entity.canAttackCommand());
};

Window_TBSCommand.prototype.addCommand_skills = function () {
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

Window_TBSCommand.prototype.addCommand_skill = function (id) {
    var skill = $dataSkills[id];
    this.addCommand(skill.name, "skill[" + id + "]", this._entity.canSkillCommand(), skill.stypeId);
};

Window_TBSCommand.prototype.addCommand_guard = function () {
    this.addCommand(TextManager.guard, 'guard', this._entity.canGuard());
};

Window_TBSCommand.prototype.addCommand_items = function () {
    this.addCommand(TextManager.item, 'item', this._entity.canItemCommand());
};

Window_TBSCommand.prototype.addCommand_move = function () {
    this.addCommand(Lecode.S_TBS.Commands.moveCommandText, "move", this._entity.canMoveCommand());
};

Window_TBSCommand.prototype.addCommand_pass = function () {
    this.addCommand(Lecode.S_TBS.Commands.passCommandText, "pass");
};

Window_TBSCommand.prototype.addCommand_scan = function () {
    this.addCommand(Lecode.S_TBS.Commands.scanCommandText, "scan");
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
    //this.updateHelp();
};

Window_TBSCommand.prototype.update = function () {
    Window_Command.prototype.update.call(this);
    if (this._entity) {
        var x = this._entity._posX - this.windowWidth() / 2;
        var y = this._entity._posY - this.windowHeight();
        this.x = x + this._entity.width() / 2;
        this.y = y;
        if (this.y < 0)
            this.y += this.windowHeight();
        while (this.x < 0)
            this.x++;
        while ((this.x + this.width) > Graphics.width)
            this.x--;
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
    return this._icons[index];
};

Window_TBSCommand.prototype.callUpdateHelp = function () {
    if (this.active) {
        this.updateHelp();
    }
};

Window_TBSCommand.prototype.updateHelp = function () {
    if (!this._list[0]) return;
    var symbol = this.commandSymbol(this.index());
    if (BattleManagerTBS._spriteset) {
        BattleManagerTBS.getLayer("scopes").clear();
        BattleManagerTBS.clearMoveSelection();
        BattleManagerTBS.clearActionSelection();
        BattleManagerTBS._moveScope = {};
        BattleManagerTBS._actionScope = {};
    }
    if (symbol.match(/skill\[(\d+)\]/i) && Lecode.S_TBS.Commands.previewActionScopes)
        BattleManagerTBS.previewObjectScope(this._entity, $dataSkills[Number(RegExp.$1)], "skill");
    else if (symbol === "attack" && Lecode.S_TBS.Commands.previewActionScopes)
        BattleManagerTBS.previewObjectScope(this._entity, null, "attack");
    else if (symbol === "move" && Lecode.S_TBS.Commands.previewMoveScope)
        BattleManagerTBS.drawMoveScope(this._entity);
};


/*-------------------------------------------------------------------------
* Window_TBSSkillList
-------------------------------------------------------------------------*/
Window_TBSSkillList.prototype.updateHelp = function () {
    Window_BattleSkill.prototype.updateHelp.call(this);
    if (Lecode.S_TBS.Commands.previewActionScopes)
        BattleManagerTBS.previewObjectScope(this._entity, this.item(), "skill");
};

Window_TBSSkillList.prototype.selectLast = function () {
    var skill = BattleManagerTBS.activeAction().item();
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);
    this.updateHelp();
};


/*-------------------------------------------------------------------------
* Window_TBSItemList
-------------------------------------------------------------------------*/
Window_TBSItemList.prototype.updateHelp = function () {
    Window_BattleItem.prototype.updateHelp.call(this);
    if (Lecode.S_TBS.Commands.previewActionScopes)
        BattleManagerTBS.previewObjectScope(this._entity, this.item(), "item");
};

Window_TBSItemList.prototype.selectLast = function () {
    var skill = BattleManagerTBS.activeAction().item();
    var index = this._data.indexOf(skill);
    this.select(index >= 0 ? index : 0);
    this.updateHelp();
};


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.Commands.oldBattleManagerTBS_onCommandInput = BattleManagerTBS.onCommandInput;
BattleManagerTBS.onCommandInput = function (command) {
    if (command.match(/skill\[(\d+)\]/i)) {
        this.processCommandCallSkill(Number(RegExp.$1));
        return;
    }
    Lecode.S_TBS.Commands.oldBattleManagerTBS_onCommandInput.call(this, command);
};

BattleManagerTBS.processCommandCallSkill = function (id) {
    var skill = $dataSkills[id];
    if (skill) {
        this._subPhase = "skill";
        this.activeAction().setItemObject(skill);
        this.drawSkillScope(this.activeEntity());
    }
};

BattleManagerTBS.previewObjectScope = function (entity, item, type) {
    this.activeAction().setItemObject(item);
    if (type === "skill")
        this.drawSkillScope(entity, item);
    else if (type === "attack")
        this.drawAttackScope(entity);
    else
        this.drawItemScope(entity, item);
};


/*-------------------------------------------------------------------------
* DataManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.Commands.oldDataManager_processLeTBSTags = DataManager.processLeTBSTags;
DataManager.processLeTBSTags = function () {
    Lecode.S_TBS.Commands.oldDataManager_processLeTBSTags.call(this);
    this.processLeTBS_CommandsTags();
};


DataManager.processLeTBS_CommandsTags = function () {
    var groups = [$dataActors, $dataEnemies, $dataClasses,$dataWeapons, $dataArmors, $dataStates];
    for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        for (var j = 1; j < group.length; j++) {
            var obj = group[j];
            var notedata = obj.note.split(/[\r\n]+/);
            var letbs = false;

            obj.leTbs_commands = "";

            for (var k = 0; k < notedata.length; k++) {
                var line = notedata[k];
                if (line.match(/<letbs_commands>/i)) {
                    letbs = true;
                    continue;
                } else if (line.match(/<\/letbs_commands>/i))
                    letbs = false;

                if (letbs) {
                    obj.leTbs_commands += line;
                }
            }
        }
    }
};
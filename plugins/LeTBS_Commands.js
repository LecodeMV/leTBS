/*
#=============================================================================
# LeTBS: Commands
# LeTBS_Commands.js
# By Lecode
# Version 1.3
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : Do not attempt to preview non-existant skills
# - 1.2 : Do not attempt to preview non-existant items
# - 1.3 : Add a shortcut to common events
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeTBS_Commands = true;

var Lecode = Lecode || {};
Lecode.S_TBS.Commands = {};
/*:
 * @plugindesc LeTBS Commands Window
 * @author Lecode
 * @version 1.3
 *
 * @param Commands
 * @desc Default commands string
 * @default move 82, attack 76, [extra], skills, items 182, scan 75, pass 74
 *
 * @param Move Command Text
 * @desc [No description]
 * @default Move
 *
 * @param Scan Command Text
 * @desc [No description]
 * @default Scan
 *
 * @param Pass Command Text
 * @desc [No description]
 * @default End Turn
 *
 * @param Skill Type Icons
 * @desc [No description]
 * @default [64, 79, 80]
 *
 * @param Width
 * @desc [No description]
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
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This is a core plugin. It helps to customize the battle commands window.
 * The following extra features are available:
 * 
 * ============================================================================
 * Scopes Preview
 * ============================================================================
 *
 * You can set up parameters to preview actions' scopes directly while the
 * command window is active.
 * 
 * ============================================================================
 * Custom Commands
 * ============================================================================
 *
 * The default commands setup is defined by the first plugin parameter.
 * It is the following:
 * 'move 82, attack 76, [extra], skills, items 182, scan 75, pass 74'
 * 
 * It is, in fact a little script, which defines which action, with which icon
 * will be displayed on the commands window.
 * This is the default script and it applies to all your actors, but you can
 * define custom scripts for them as well.
 * 
 * To do so, you would have to use a tag (inside the desired actor's notebox):
 * <letbs_commands>
 * ...(the script goes here)...
 * </letbs_commands>
 * 
 * ============================================================================
 * How To Set Up Commands Script
 * ============================================================================
 * 
 * The script is a list of element, each element being in the following format:
 * [command_id] [icon_index]
 * So, each element refers to a command (that should be available in the code) and
 * an icon index which is displayed next to it.
 * [icon_index] is optional.
 * 
 * The [extra] element is a special element who doesn't match this rule.
 * '[extra]' is in fact a placeholder for extra commands that are dynamically
 * added in play time. For example through an equipment granting a new command.
 * So, if for example you move '[extra]' to the beginning of the script,
 * the extra commands granted by states or equipments will be displayed at the
 * top of the command window.
 * 
 * This is the list of the available commands:
 * *move        Move action
 * *attack      The default attack command
 * *skills      Use skills
 * *items       Use items
 * *scan        Let you examine battlers and the battle field
 * *pass        End the turn
 * 
 * ============================================================================
 * Shortcut Commands
 * ============================================================================
 * 
 * You can create commands that act like shortcuts to skills, items and common
 * events. In that case, [command_id] can be replaced with:
 * 
 * skill[ID]        a shortcut to the specified skill
 * item[ID]         a shortcut to the specified item
 * event[ID]        a shortcut to a common event.
 * 
 * If [icon_index] is missing, the specified object's icon index will be used.
 * (In the case of a skill or an item)
 * 
 * Example of a commands script using the shortcut feature:
 * move 82, skill[18], item[1] 5, pass 84, event[10]
 * 
 * ============================================================================
 * Extra Commands
 * ============================================================================
 * 
 * Equipment and states can add extra commands to your actors' battle commands.
 * Simply use this tag:
 * <letbs_commands>
 * ...(the script goes here)...
 * </letbs_commands>
 * 
 * The script will add up to the '[Extra]' element in the base script.
 * For instance, let's take a dummy battler with the following commands: 
 * 'move, [extra], pass'
 * and a state with the following tag:
 * <letbs_commands>
 * skill[18], skill[20]
 * </letbs_commands>
 * 
 * The battler will have in fine the following commands: move, skill[18], skill[20], pass
 * 
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_Commands');

Lecode.S_TBS.Commands.default = String(parameters["Commands"] || "move 82, attack 76, [extra], skills, items 182, scan 75, pass 74");	//	(Commands): Default commands string
Lecode.S_TBS.Commands.moveCommandText = String(parameters["Move Command Text"] || "Move");
Lecode.S_TBS.Commands.scanCommandText = String(parameters["Scan Command Text"] || "Scan");
Lecode.S_TBS.Commands.passCommandText = String(parameters["Pass Command Text"] || "End Turn");
Lecode.S_TBS.Commands.skillTypeIcons = String(parameters["Skill Type Icons"] || "[64, 79, 80]");
Lecode.S_TBS.Commands.width = Number(parameters["Width"] || 240);
Lecode.S_TBS.Commands.visibleLines = Number(parameters["Visible Lines"] || 4);	//	(): Visible lines of the window
Lecode.S_TBS.Commands.previewMoveScope = String(parameters["Preview Move Scope"] || 'true') === 'true';	//	(): Show the move scope when the command window is open ?
Lecode.S_TBS.Commands.previewActionScopes = String(parameters["Preview Action Scopes"] || 'true') === 'true';	//	(): Show skills and items scopes when the command window is open ?


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
TBSEntity.prototype.getCommandsString = function () {
    var value = this.rpgObject().TagsLetbsCommands.toString();
    var extra = "";
    this.battler().states().forEach(function (state) {
        if (state) {
            extra += " " + state.TagsLetbsCommands.toString();
        }
    });
    if (this.battler().isActor()) {
        this.battler().equips().forEach(function (equip) {
            if (equip) {
                extra += " " + equip.TagsLetbsCommands.toString();
            }
        });
    }
    return LeUtilities.perfectStringList(value.replace("[extra]", extra));
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
        }).filter(function(str){
            return str;
        });
        this.makeIcons(array);
        array = array.map(function (str) {
            return str.replace(/\s+\d+/ig, "");
        });
        array.forEach(function (com) {
            if (com.match(/skill\[(\d+)\]/i))
                this.addCommand_skill(Number(RegExp.$1));
            else if (com.match(/item\[(\d+)\]/i))
                this.addCommand_item(Number(RegExp.$1));
            else if (com.match(/event\[(\d+)\]/i))
                this.addCommand_event(Number(RegExp.$1));
            else if (com)
                eval("this.addCommand_" + com + "();");
        }.bind(this));
    }
};

Window_TBSCommand.prototype.getCommandsString = function () {
    var str = this._entity.getCommandsString();
    return str || Lecode.S_TBS.Commands.default.replace(/\[extra\]\s*\,/ig, "");
};

Window_TBSCommand.prototype.makeIcons = function (array) {
    var skillTypes = this._battler.addedSkillTypes();
    skillTypes.sort(function (a, b) {
        return a - b;
    });
    this._icons = [];
    for (var i = 0; i < array.length; i++) {
        var str = array[i];
        if (str.match("skills")) {
            for (var j = 0; j < skillTypes.length; j++) {
                var icon = eval(Lecode.S_TBS.Commands.skillTypeIcons)[skillTypes[j] - 1];
                this._icons.push(icon);
            }
        } else if (str.match(/\s+(\d+)/i)) {
            this._icons.push(Number(RegExp.$1));
        } else if (str.match(/skill\[(\d+)\]/i)) {
            this._icons.push($dataSkills[Number(RegExp.$1)].iconIndex);
        } else if (str.match(/item\[(\d+)\]/i)) {
            this._icons.push($dataItems[Number(RegExp.$1)].iconIndex);
        } else
            this._icons.push(0);
    }
};

Window_TBSCommand.prototype.addCommand_attack = function () {
    this.addCommand(TextManager.attack, 'attack', this._entity.canAttackCommand());
};

Window_TBSCommand.prototype.addCommand_skills = function () {
    this.addSkillCommands();
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
};

Window_TBSCommand.prototype.addCommand_skill = function (id) {
    var skill = $dataSkills[id];
    this.addCommand(skill.name, "skill[" + id + "]", this._entity.canSkillCommand(), skill.stypeId);
};

Window_TBSCommand.prototype.addCommand_item = function (id) {
    var item = $dataItems[id];
    var canUse = this._entity.battler().canUse(item);
    this.addCommand(skill.name, "item[" + id + "]", canUse);
};

Window_TBSCommand.prototype.addCommand_event = function (id) {
    this.addCommand(skill.name, "event[" + id + "]", true);
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
    if (this._entity) {
        this._entity.attachWindow(this);
    }
};

Window_TBSCommand.prototype.processOk = function () {
    if (this._battler) {
        this._battler.setLastCommandSymbol(this.currentSymbol());
    }
    Window_Command.prototype.processOk.call(this);
};

Window_TBSCommand.prototype.selectLast = function () {
    this.select(0);
    if (this._battler) {
        var last = this._battler.lastCommandSymbol();
        if (last !== "pass")
            this.selectSymbol(last);
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
    else if (symbol.match(/item\[(\d+)\]/i) && Lecode.S_TBS.Commands.previewActionScopes)
        BattleManagerTBS.previewObjectScope(this._entity, $dataItems[Number(RegExp.$1)], "item");
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
    if (Lecode.S_TBS.Commands.previewActionScopes && this.item())
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
    if (Lecode.S_TBS.Commands.previewActionScopes && this.item())
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
        this.drawSkillScope(this.activeEntity(), skill);
    }
};

BattleManagerTBS.processCommandCallItem = function (id) {
    var item = $dataItems[id];
    if (item) {
        this._subPhase = "item";
        this.activeAction().setItemObject(item);
        this.drawItemScope(this.activeEntity(), item);
    }
};

BattleManagerTBS.processCommandCallEvent = function (id) {
    var list = $dataCommonEvents[id].list;
    if (list)
        $gameTroop._interpreter.setupInQueue(list);
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
* Scene_Boot
-------------------------------------------------------------------------*/
Lecode.S_TBS.Commands.oldSceneBoot_getLeTBSMainTags = Scene_Boot.prototype.getLeTBSMainTags;
Scene_Boot.prototype.getLeTBSMainTags = function () {
    return Lecode.S_TBS.Commands.oldSceneBoot_getLeTBSMainTags.call(this)
        .concat({ name: "letbs_commands", type: "array" }); //TagsLetbsCommands
};
/*
#=============================================================================
# LeTBS: Scan Command
# LeTBS_ScanCommand.js
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
Imported.LeTBS_ScanCommand = true;

var Lecode = Lecode || {};
Lecode.S_TBS.ScanCommand = {};
/*:
 * @plugindesc Adds a command to examine and interact with the battle field.
 * @author Lecode
 * @version 1.0
 *
 * @param Scope Color
 * @desc [No description]
 * @default #FFFFFF
 *
 * @param Scope Opacity
 * @desc [No description]
 * @default 175
 *
 * @param Command Text Color
 * @desc [No description]
 * @default 14
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds a command allowing to examine entities but also to 
 * interact with them and the battle field.
 * The command shows a window over the selected entity or event.
 * This window shows customizable information as well as customizable commands
 * to interact with the element.
 * 
 * ============================================================================
 * Window Content
 * ============================================================================
 *
 * The content of the scan window is formatted following this template:
 * 
 * *---------*  [Text]
 * * Picture *  [Stats]
 * *---------*  [Commands]
 * 
 * The stats are only available if the element selected is an entity.
 * 
 * ============================================================================
 * Setting Up The Window Content
 * ============================================================================
 *
 * This can be done on two ways:
 * 
 * ***For entities
 * Simply use the following tags:
 * 
 * <Letbs_Scan_Text>
 * ...(text goes here)...
 * ...(another line)....
 * </Letbs_Scan_Text>
 * 
 * <Letbs_Scan_Options>
 * picture: [Filename]
 * show_stats: [true or false]
 * </Letbs_Scan_Options>
 * 
 * <Letbs_Scan_Commands>
 * [Name] [Icon Index] [AoE Of Availability] [Effect]
 * [Name] [Icon Index] [AoE Of Availability] [Effect]
 * ...
 * </Letbs_Scan_Commands>
 * 
 * ***For TBS events
 * Use the following tags inside a comment:
 * 
 * <LeTBS: Scan Text>
 * ...(text goes here)...|
 * ...(another line)....|
 * ...
 * </LeTBS: Scan Text>
 * 
 * <LeTBS> Scan_Picture: [Filename]
 * 
 * <LeTBS: Scan Commands>
 * [Name] [Icon Index] [AoE Of Availability]|
 * [Name] [Icon Index] [AoE Of Availability]|
 * ...
 * </LeTBS: Scan Commands>
 * 
 * ***************************************************
 * 
 * If 'picture' isn't defined, the entity or event graphic will be used.
 * Otherwise, a file will be picked in the picture folder.
 * 
 * While setting up the scan data for a TBS event, don't forget to use the
 * delimiter '|' to specify a break of line.
 * 
 * ============================================================================
 * Scan Commands
 * ============================================================================
 * 
 * The commands that you set up can trigger various effects.
 * Following the tags above, [AoE Of Availability] refers to the area on which
 * the user has to be in order to be able to trigger the command.
 * This prevents interacting with objects too far away from the user.
 * The format of [AoE Of Availability] is a scope. circle(x), square(x), ect.
 * 
 * As for [Effect], firstly this data is only available for entities. TBS events
 * use another mean which is described later.
 * As for now, the only effect that can be triggered is a common event.
 * Replace [effect] with 'event(ID)'.
 * 
 * When a command is selected, the value of 'Lecode.S_TBS.ScanResult' becomes
 * the name of that command in lower cases.
 * This can be used inside TBS events to execute various things depending
 * on the choice of the command.
 * 
 * For better understanding, refers to the demo.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently. A few features are missing.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_ScanCommand');
Lecode.S_TBS.ScanCommand.scopeColor = String(parameters["Scope Color"] || "#FFFFFF");
Lecode.S_TBS.ScanCommand.scopeOpacity = Number(parameters["Scope Opacity"] || 175);
Lecode.S_TBS.ScanCommand.commandTextColor = Number(parameters["Command Text Color"] || 14);



/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_onCommandInput = BattleManagerTBS.onCommandInput;
BattleManagerTBS.onCommandInput = function (command) {
    if (command === "scan") {
        this.processCommandScan();
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_onCommandInput.call(this, command);
};

BattleManagerTBS.processCommandScan = function () {
    this._subPhase = "scan";
    this._scanEntity = null;
    var text = "Select an element to examine";
    LeUtilities.getScene().showHelpWindow();
    LeUtilities.getScene()._helpWindow.setText(text);
};

BattleManagerTBS.scanCommandCancel = function () {
    LeUtilities.getScene().hideHelpWindow();
    this.onActionCancel();
    this._scanEntity = null;
};

BattleManagerTBS.scanCommandOk = function (cell) {
    cell = this._activeCell || cell;
    var obj = cell.getEntity() || cell.getEvent();
    if (obj) {
        this._subPhase = "scan_active";
        LeUtilities.getScene().showScanWindow(obj);
        SoundManager.playOk();
    } else {
        SoundManager.playBuzzer();
    }
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputCancel = BattleManagerTBS.battlePhaseOnInputCancel;
BattleManagerTBS.battlePhaseOnInputCancel = function () {
    if (this._subPhase === "scan") {
        this.scanCommandCancel();
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputCancel.call(this);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputLeft = BattleManagerTBS.battlePhaseOnInputLeft;
BattleManagerTBS.battlePhaseOnInputLeft = function () {
    if (this._subPhase === "scan") {
        this.moveCursor("left");
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputLeft.call(this);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputRight = BattleManagerTBS.battlePhaseOnInputRight;
BattleManagerTBS.battlePhaseOnInputRight = function () {
    if (this._subPhase === "scan") {
        this.moveCursor("right");
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputRight.call(this);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputDown = BattleManagerTBS.battlePhaseOnInputDown;
BattleManagerTBS.battlePhaseOnInputDown = function () {
    if (this._subPhase === "scan") {
        this.moveCursor("down");
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputDown.call(this);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputUp = BattleManagerTBS.battlePhaseOnInputUp;
BattleManagerTBS.battlePhaseOnInputUp = function () {
    if (this._subPhase === "scan") {
        this.moveCursor("up");
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputUp.call(this);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnTouchInput = BattleManagerTBS.battlePhaseOnTouchInput;
BattleManagerTBS.battlePhaseOnTouchInput = function (selectedCell) {
    if (this._subPhase === "scan") {
        if (selectedCell.isSame(this._activeCell))
            this.scanCommandOk(selectedCell);
        else {
            this.setCursorCell(selectedCell);
        }
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnTouchInput.call(this, selectedCell);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputOk = BattleManagerTBS.battlePhaseOnInputOk;
BattleManagerTBS.battlePhaseOnInputOk = function () {
    if (this._subPhase === "scan") {
        this.scanCommandOk();
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_battlePhaseOnInputOk.call(this);
};

BattleManagerTBS.executeScanCommand = function (sym, comData, obj) {
    this._subPhase = "scan_execute";
    Lecode.S_TBS.ScanResult = sym;
    var effect = comData.effect;
    var isAction = comData.isAction;
    var scanData = obj._scanData;
    if (isAction) {
        this.activeEntity()._actionPerformed = true;
    }
    if (scanData.isEntity) {
        this._scanEntity = obj;
    } else {
        obj.start();
    }
    if (effect.match(/event\((.+)\)/i)) {
        var id = Number(RegExp.$1);
        var list = $dataCommonEvents[id].list;
        $gameTroop._interpreter.setupInQueue(list);
    }
};

BattleManagerTBS.drawScanScope = function (scope) {
    var color = Lecode.S_TBS.ScanCommand.scopeColor;
    var opa = Lecode.S_TBS.ScanCommand.scopeOpacity;
    var invalidOpa = Lecode.S_TBS.moveInvalidCellOpacity;
    var invalidCondition = "false";
    this.getLayer("scopes").clear();
    this.drawScope(scope, color, opa, invalidOpa, invalidCondition);
};

Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_checkSubPhase = BattleManagerTBS.checkSubPhase;
BattleManagerTBS.checkSubPhase = function () {
    if (this._subPhase === "scan_execute") {
        this.setCursorCell(this.activeEntity().getCell());
        this._subPhase = "";
        return;
    }
    Lecode.S_TBS.ScanCommand.oldBattleManagerTBS_checkSubPhase.call(this);
};


/*-------------------------------------------------------------------------
* Game_Interpreter
-------------------------------------------------------------------------*/
Lecode.S_TBS.ScanCommand.oldGameInterpreter_readEntityForLeTBS = Game_Interpreter.prototype.readEntityForLeTBS;
Game_Interpreter.prototype.readEntityForLeTBS = function (data) {
    if (data.toLowerCase() === "scanentity") {
        return BattleManagerTBS._scanEntity;
    }
    return Lecode.S_TBS.ScanCommand.oldGameInterpreter_readEntityForLeTBS.call(this, data);
};

Game_Interpreter.prototype.interpretLeTBS_ScanCommand = function (args) {
    var type = args[0].toLowerCase();
    var command = args[1].toLowerCase();
    var disable = args[2].toLowerCase() === "disable";
    var obj;
    if (type.match(/entity\((.+)\)/i)) {
        obj = this.readEntityForLeTBS(RegExp.$1);
    } else if (type.match(/event\((.+)\)/i)) {
        obj = BattleManagerTBS.getEvent(Number(RegExp.$1));
    }
    if (obj && obj.getScanData()) {
        obj._scanData.disabled[command] = !!disable;
    } else {
        return false;
    }
    return {};
};


/*-------------------------------------------------------------------------
* TBSEvent
-------------------------------------------------------------------------*/
Lecode.S_TBS.ScanCommand.oldTBSEvent_initialize = TBSEvent.prototype.initialize;
TBSEvent.prototype.initialize = function (event) {
    Lecode.S_TBS.ScanCommand.oldTBSEvent_initialize.call(this, event);
};

Lecode.S_TBS.ScanCommand.oldTBSEvent_setupFlags = TBSEvent.prototype.setupFlags;
TBSEvent.prototype.setupFlags = function () {
    Lecode.S_TBS.ScanCommand.oldTBSEvent_setupFlags.call(this);
    this.makeScanData();
};

TBSEvent.prototype.makeScanData = function () {
    this._scanData = {
        isEntity: false,
        picture: "base",
        text: "",
        commands: "",
        showStats: false,
        disabled: {}
    };
    var scanText = false;
    var scanCommands = false;
    for (var i = 0; i < this._event.list().length; i++) {
        var command = this._event.list()[i];
        if (command && command.code === 108 || command.code === 408) {
            var comment = command.parameters[0];
            if (comment.match(/<LeTBS>\s?Scan_Picture\s?:\s?(.+)/i))
                this._scanData.picture = String(RegExp.$1).toLowerCase();
            else if (comment.match(/<LeTBS: Scan Text>/i)) {
                scanText = true;
                continue;
            } else if (comment.match(/<\/LeTBS: Scan Text>/i)) {
                scanText = false;
                continue;
            } else if (comment.match(/<LeTBS: Scan Commands>/i)) {
                scanCommands = true;
                continue;
            } else if (comment.match(/<\/LeTBS: Scan Commands>/i)) {
                scanCommands = false;
                continue;
            }
            if (scanText)
                this._scanData.text += comment;
            else if (scanCommands)
                this._scanData.commands += comment;
        }
    }
};

TBSEvent.prototype.getScanData = function () {
    return this._scanData;
};


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.ScanCommand.oldTBSEntity_initialize = TBSEntity.prototype.initialize;
TBSEntity.prototype.initialize = function (battler, layer) {
    Lecode.S_TBS.ScanCommand.oldTBSEntity_initialize.call(this, battler, layer);
    this.makeScanData();
};

TBSEntity.prototype.makeScanData = function () {
    this._scanData = {
        isEntity: true,
        picture: this.rpgObject().TagsLetbsScanOptions.picture,
        text: this.rpgObject().TagsLetbsScanText.join("|"),
        commands: this.rpgObject().TagsLetbsScanCommands.join("|"),
        showStats: this.rpgObject().TagsLetbsScanOptions.showStats === "true",
        disabled: {}
    };
};

TBSEntity.prototype.getScanData = function () {
    return this._scanData;
};


/*-------------------------------------------------------------------------
* Window_TBSCommand
-------------------------------------------------------------------------*/
Window_TBSCommand.prototype.addCommand_scan = function () {
    this.addCommand(Lecode.S_TBS.Commands.scanCommandText, "scan");
};


/*-------------------------------------------------------------------------
* Scene_Battle
-------------------------------------------------------------------------*/
Lecode.S_TBS.ScanCommand.oldSceneBattle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
    Lecode.S_TBS.ScanCommand.oldSceneBattle_createAllWindows.call(this);
    if (Lecode.S_TBS.commandOn) {
        this.createScanWindow();
        this.createScanCommandWindow();
    }
};

Scene_Battle.prototype.createScanWindow = function () {
    this._windowScan = new Window_TBSScan();
    this._windowScan.hide();
};

Scene_Battle.prototype.createScanCommandWindow = function () {
    this._windowScanCommand = new Window_TBSScanCommand();
    this._windowScanCommand.setHandler('cancel', this.onScanCommandCancel.bind(this));
    this._windowScanCommand.hide();
    this._windowScanCommand.deactivate();
    this._windowScan._commandWindow = this._windowScanCommand;
};

Scene_Battle.prototype.showScanWindow = function (obj) {
    var data = obj.getScanData();
    this._windowScan.setup(data, obj);
    this._windowScan.open();
    this._windowScanCommand.activate();
    this._windowScan.update();
    this.hideHelpWindow();
    Input.clear();
};

Scene_Battle.prototype.onScanCommandCancel = function () {
    BattleManagerTBS.getLayer("scopes").clear();
    this.closeScanCommand();
    BattleManagerTBS.processCommandScan();
};

Scene_Battle.prototype.closeScanCommand = function () {
    this._windowScan.close();
    this._windowScanCommand.close();
    this._windowScanCommand.deactivate();
};

Lecode.S_TBS.ScanCommand.oldSceneBattle_setMovableWindows = Scene_Battle.prototype.setMovableWindows;
Scene_Battle.prototype.setMovableWindows = function () {
    Lecode.S_TBS.ScanCommand.oldSceneBattle_setMovableWindows.call(this);
    BattleManagerTBS.getLayer("movableWindows").addChild(this._windowScan);
    BattleManagerTBS.getLayer("movableWindows").addChild(this._windowScanCommand);
};


/*-------------------------------------------------------------------------
* Window_TBSScan
-------------------------------------------------------------------------*/
function Window_TBSScan() {
    this.initialize.apply(this, arguments);
}

Window_TBSScan.prototype = Object.create(Window_Base.prototype);
Window_TBSScan.prototype.constructor = Window_TBSScan;

Window_TBSScan.prototype.initialize = function () {
    Window_Base.prototype.initialize.call(this, 0, 0, 1, 1);
    this._scanData = {};
    this._obj = null;
};

Window_TBSScan.prototype.setup = function (data, obj) {
    this._scanData = data;
    this._obj = obj;
    this.preparePicture();
    this.resizeForContent();
    this.drawPicture();
    this.drawScanText();
    this.drawStats();
    this.drawCommand();
    this.open();
    this.show();
};

Window_TBSScan.prototype.preparePicture = function () {
    if (this._scanData.picture === "base") {
        var sprite, bitmap;
        var isEntity = this._scanData.isEntity;
        if (isEntity) {
            sprite = this._obj._sprite;
            bitmap = sprite._bitmaps["idle"];
            var pw = bitmap.width / (sprite._maxFrame["idle"] + 1);
            var ph = bitmap.height / 4;
            this._picture = new Bitmap(pw, ph);
            this._picture.blt(bitmap, 0, 0, pw, ph, 0, 0);
        } else {
            sprite = BattleManagerTBS._spriteset.getEventSprite(this._obj);
            bitmap = sprite.bitmap;
            var f = sprite._frame;
            this._picture = new Bitmap(f.width, f.height);
            this._picture.blt(bitmap, f.x, f.y, f.width, f.height, 0, 0);
        }
    }
};

Window_TBSScan.prototype.picturePadding = function () {
    return 4;
};

Window_TBSScan.prototype.scanTextWidth = function () {
    var lines = this.getLines();
    if(lines.length === 0) return 0;
    var widths = lines.map(function (line) {
        return this.textWidth(line);
    }.bind(this));
    return widths.reduce(function (a, b) {
        return Math.max(a, b);
    });
};

Window_TBSScan.prototype.statsWidth = function () {
    var scanTextWidth = this.scanTextWidth();
    var minSpace = 0;
    var width = 4 * (this.textWidth("XXX 00000") + minSpace + (this.showStatIcons() ? Window_Base._iconWidth : 0));
    return Math.max(width, scanTextWidth);
};

Window_TBSScan.prototype.showStatIcons = function () {
    return false;
};

Window_TBSScan.prototype.resizeForContent = function () {
    var lines = this.getLines();
    //- Determine width
    var width = this.scanTextWidth();
    if (this._scanData.showStats)
        width = Math.max(width, this.statsWidth());
    if (this._picture)
        width += this._picture.width + this.picturePadding() * 2 + this.standardPadding() * 2;
    //- Determine height
    var nbrLines = lines.length;
    nbrLines += this.getCommandsData().length > 0 ? 1 : 0;
    nbrLines += this._scanData.showStats ? 2 : 0;
    var height = this.fittingHeight(nbrLines);
    var maxHeight = this._picture.height + this.picturePadding() * 2 + this.standardPadding() * 2;
    height = Math.max(height, maxHeight);

    this.move(0, 0, width, height);
    this.createContents();
};

Window_TBSScan.prototype.drawPicture = function () {
    var bitmap = this._picture;
    if (bitmap) {
        var y = this.contentsHeight() / 2 - bitmap.height / 2;
        if (this.getCommandsData().length > 0)
            y -= this.lineHeight() / 2;
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, this.picturePadding(), y);
    }
};

Window_TBSScan.prototype.drawScanText = function () {
    var x = this._picture ? this._picture.width + this.picturePadding() * 2 : 0;
    var y = 0;
    this.getLines().forEach(function (line) {
        this.drawTextEx(line, x, y);
        y += this.lineHeight();
    }.bind(this));
};

Window_TBSScan.prototype.drawStats = function () {
    if (this._scanData.isEntity && this._scanData.showStats) {
        var entity = this._obj;
        var battler = entity.battler();
        var counter = 1;
        var icons = [84, 79, 77, 64, 81, 68, 82, 87];
        var texts = ["HP", "MP", "ATK", "MAT", "MDF", "DEF", "AGI", "LUK"];
        var iniX = this._picture ? this._picture.width + this.picturePadding() * 2 : 0;
        var iniY = this.getLines().length * this.lineHeight();
        var space = 0;
        var x = iniX;
        var y = iniY;
        ["hp", "mp", "atk", "mat", "def", "mdf", "agi", "luk"].forEach(function (stat) {
            var value = battler[stat];
            var xPlus = 0;
            if (this.showStatIcons()) {
                this.drawIcon(icons[counter - 1], x, y);
                xPlus = Window_Base._iconWidth;
            }
            this.changeTextColor(this.systemColor());
            this.leU_drawText(texts[counter - 1], x + xPlus, y);
            var shift = x + xPlus + this.textWidth(texts[counter - 1] + " ");
            this.changeTextColor(this.normalColor());
            this.leU_drawText(value, shift, y);
            if (counter % 2 === 0) {
                x += xPlus + space + this.textWidth("XXX 00000");
                y = this.getLines().length * this.lineHeight();
            } else {
                y += this.lineHeight();
            }
            counter++;
        }, this);
    }
};

Window_TBSScan.prototype.drawCommand = function () {
    var commands = this.getCommandsData();
    this._commandWindow.show();
    this._commandWindow.open();
    if (commands.length > 0) {
        this._commandWindow._scanCommands = commands;
        this._commandWindow._scanData = this._scanData;
        this._commandWindow._obj = this._obj;
        this._commandWindow.width = this.width;
        this._commandWindow.select(0);
        var height = this.lineHeight() * this.getLines().length;
        if (this._scanData.showStats)
            height += this.lineHeight() * 2;
        this.drawHorzLine(height - 18);
    } else {
        this._commandWindow._scanCommands = [];
        this._commandWindow.select(-1);
    }
    this._commandWindow.refresh();
};

Window_TBSScan.prototype.drawHorzLine = function (y) {
    var lineY = y + this.lineHeight() / 2 - 1;
    this.contents.paintOpacity = 48;
    this.contents.fillRect(0, lineY, this.contentsWidth(), 2, this.normalColor());
    this.contents.paintOpacity = 255;
};

Window_TBSScan.prototype.getLines = function () {
    return this._scanData.text.split("|").filter(function(val){
        return val !== "" && val != null;
    });
};

Window_TBSScan.prototype.getCommandsData = function () {
    var lines = this._scanData.commands.split("|");
    if (!lines.join("")) return [];
    return lines.map(function (line) {
        var args = line.split(";");
        return {
            text: args[0].trim(),
            icon: Number(args[1].trim()),
            scope: args[2].trim(),
            effect: args[3] ? args[3].trim() : "",
            isAction: args.join().match(/is_action/i)
        };
    });
};

Window_TBSScan.prototype.update = function () {
    Window_Base.prototype.update.call(this);

    this._commandWindow.x = this.x;
    this._commandWindow.y = this.y + this.height - this._commandWindow.height + 6;

    if (!this._obj) return;
    var x, y, w;
    if (this._scanData.isEntity) {
        x = this._obj._posX;
        y = this._obj._posY;
        w = this._obj.width();
    } else {
        x = this._obj.screenX();
        y = this._obj.screenY();
        w = $gameMap.tileWidth();
    }
    x -= this.width / 2;
    y -= this.height;
    this.x = x + w / 2;
    this.y = y;
    if (this.y < 0)
        this.y += this.windowHeight();
    while (this.x < 0)
        this.x++;
    while ((this.x + this.width) > Graphics.width)
        this.x--;
};


/*-------------------------------------------------------------------------
* Window_TBSScanCommand
-------------------------------------------------------------------------*/
function Window_TBSScanCommand() {
    this.initialize.apply(this, arguments);
}

Window_TBSScanCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_TBSScanCommand.prototype.constructor = Window_TBSScanCommand;

Window_TBSScanCommand.prototype.initialize = function () {
    this._scanCommands = [];
    Window_HorzCommand.prototype.initialize.call(this, 0, 0);
    this.opacity = 0;
};

Window_TBSScanCommand.prototype.makeCommandList = function () {
    this.makeScopes();
    var i = 0;
    this._scanCommands.forEach(function (data) {
        this.addCommand(data.text, data.text.toLowerCase(), 
            this.checkScope(i) && this.checkAction(data) && !this._scanData.disabled[data.text.toLowerCase()] );
        i++;
    }.bind(this));
};

Window_TBSScanCommand.prototype.makeScopes = function () {
    this._scopes = [];
    this._scanCommands.forEach(function (data) {
        this._scopes.push(BattleManagerTBS.getScopeFromData(data.scope, this._obj.getCell(), { exclude_center: true }));
    }, this);
};

Window_TBSScanCommand.prototype.callUpdateHelp = function () {
    if (this.active && this._scanCommands.length !== 0 && this.index() > -1) {
        BattleManagerTBS.drawScanScope(this._scopes[this.index()]);
    }
};

Window_TBSScanCommand.prototype.checkScope = function (index) {
    var scope = this._scopes[index];
    var user = BattleManagerTBS.activeEntity();
    return BattleManagerTBS.isCellInScope(user.getCell(), scope);
};

Window_TBSScanCommand.prototype.checkAction = function (data) {
    if (data.isAction) {
        var user = BattleManagerTBS.activeEntity();
        return user.canObjCommand();
    }
    return true;
};

Window_TBSScanCommand.prototype.maxCols = function () {
    return 4;
};

Window_TBSScanCommand.prototype.itemTextAlign = function () {
    return 'left';
};

Window_TBSScanCommand.prototype.normalColor = function (index) {
    return this.textColor(Lecode.S_TBS.ScanCommand.commandTextColor);
};

Window_TBSScanCommand.prototype.itemWidth = function () {
    return Math.floor((this.width - this.padding * 2 +
        this.spacing()) / this.maxCols() - this.spacing() + Window_Base._iconWidth);
};

Window_TBSScanCommand.prototype.drawItem = function (index) {
    if (!this._scanCommands) return;
    var rect = this.itemRectForText(index);
    var align = this.itemTextAlign();
    var icon = this._scanCommands[index].icon;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    var x = icon ? rect.x + Window_Base._iconWidth : rect.x;
    if (icon) this.drawIcon(icon, rect.x, rect.y);
    this.drawText(this.commandName(index), x, rect.y, rect.width, align);
};

Lecode.S_TBS.ScanCommand.oldWindowTBSScanCommand_callOkHandler = Window_TBSScanCommand.prototype.callOkHandler;
Window_TBSScanCommand.prototype.callOkHandler = function () {
    var symbol = this.currentSymbol();
    if (symbol != "cancel") {
        LeUtilities.getScene().closeScanCommand();
        BattleManagerTBS.executeScanCommand(symbol, this._scanCommands[this.index()], this._obj);
    }
    Lecode.S_TBS.ScanCommand.oldWindowTBSScanCommand_callOkHandler.call(this);
};


/*-------------------------------------------------------------------------
* Scene_Boot
-------------------------------------------------------------------------*/
Lecode.S_TBS.ScanCommand.oldSceneBoot_getLeTBSMainTags = Scene_Boot.prototype.getLeTBSMainTags;
Scene_Boot.prototype.getLeTBSMainTags = function () {
    var array = Lecode.S_TBS.ScanCommand.oldSceneBoot_getLeTBSMainTags.call(this);
    return array.concat([
        { name: "letbs_scan_text", type: "array" },          //TagsLetbsScanText
        { name: "letbs_scan_commands", type: "array" },      //TagsLetbsScanCommands
        {
            name: "letbs_scan_options", type: "object",      //TagsLetbsScanOptions
            default: {
                picture: "base",
                show_stats: true
            }
        }
    ]);
};
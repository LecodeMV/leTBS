/*
#=============================================================================
# LeTBS: Auto Battle Mode
# LeTBS_AutoBattle.js
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
Imported.LeTBS_AutoMode = true;

var Lecode = Lecode || {};
Lecode.S_TBS.AutoMode = {};
/*:
 * @plugindesc Add an auto battle mode
 * @author Lecode
 * @version 1.0
 *
 * @param Command Text
 * @desc The text drawn on the command window
 * @default Auto Battle
 *
 * @param Input
 * @desc Key to activate/deactivate auto mode
 * @default tab
 *
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds the Auto Battle feature to LeTBS.
 * A command is added to the "End Commands" window, which is accessible
 * by pressing esc during a idle turn.
 * 
 * You can set up a keyboard as a shortcut to activate or deactive the auto
 * battle mode, instead of using the commands window.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently. Activating the auto battle won't work
 * right away. It'll only be in pending mode. Only the next turns after the
 * current one will be automated.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_AutoBattle');
Lecode.S_TBS.AutoMode.commandText = String(parameters["Command Text"] || "Auto Battle"); // (): The text drawn on the command window
Lecode.S_TBS.AutoMode.input = String(parameters["Input"] || "tab");	// (): Key to activate/deactivate auto mode


/*-------------------------------------------------------------------------
* Window_TBSEndCommand
-------------------------------------------------------------------------*/
Lecode.S_TBS.AutoMode.oldWindowTBSEndCommand_makeCommandList = Window_TBSEndCommand.prototype.makeCommandList;
Window_TBSEndCommand.prototype.makeCommandList = function () {
    Lecode.S_TBS.AutoMode.oldWindowTBSEndCommand_makeCommandList.call(this);
    this.addCommand(Lecode.S_TBS.AutoMode.commandText, "auto_mode", true);
};


/*-------------------------------------------------------------------------
* Scene_Battle
-------------------------------------------------------------------------*/
Lecode.S_TBS.AutoMode.oldSB_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function () {
    Lecode.S_TBS.AutoMode.oldSB_createAllWindows.call(this);
    if (Lecode.S_TBS.commandOn) {
        this.createAutoModeWindow();
    }
};

Scene_Battle.prototype.createAutoModeWindow = function () {
    this._windowAutoMode = new Window_TBSAutoMode();
    this._windowAutoMode.hide();
    this.addWindow(this._windowAutoMode);
};

Lecode.S_TBS.AutoMode.oldSB_createEndCommandWindow = Scene_Battle.prototype.createEndCommandWindow;
Scene_Battle.prototype.createEndCommandWindow = function () {
    Lecode.S_TBS.AutoMode.oldSB_createEndCommandWindow.call(this);
    this._windowEndCommand.setHandler('auto_mode', this.setAutoMode.bind(this));
};

Scene_Base.prototype.setAutoMode = function () {
    BattleManagerTBS._autoModePending = !BattleManagerTBS._autoModePending;
    if (BattleManagerTBS._autoModePending) {
        this._windowAutoMode.show();
    } else {
        this._windowAutoMode.hide();
    }
    this._windowEndCommand.activate();
    this._windowAutoMode.refresh();
};

Lecode.S_TBS.AutoMode.oldSB_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function () {
    Lecode.S_TBS.AutoMode.oldSB_start.call(this);
    if (Lecode.S_TBS.commandOn) {
        if (BattleManagerTBS._autoModePending) {
            BattleManagerTBS._autoModePending = false;
            this.setAutoMode();
        }
    }
};


/*-------------------------------------------------------------------------
* TBSEntity
-------------------------------------------------------------------------*/
Lecode.S_TBS.AutoMode.oldTBSEntity_playableByAI = TBSEntity.prototype.playableByAI;
TBSEntity.prototype.playableByAI = function () {
    if (BattleManagerTBS._autoMode) return true;
    return Lecode.S_TBS.AutoMode.oldTBSEntity_playableByAI.call(this);
};


/*-------------------------------------------------------------------------
* Window_TBSAutoMode
-------------------------------------------------------------------------*/
function Window_TBSAutoMode() {
    this.initialize.apply(this, arguments);
}
Window_TBSAutoMode.prototype = Object.create(Window_Base.prototype);
Window_TBSAutoMode.prototype.constructor = Window_TBSAutoMode;

Window_TBSAutoMode.prototype.initialize = function () {
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.x = Graphics.width - width;
    this.y = Graphics.height - height;
    this.opacity = 0;
    this.contentsOpacity = 175;
};

Window_TBSAutoMode.prototype.windowWidth = function () {
    return 300;
};

Window_TBSAutoMode.prototype.windowHeight = function () {
    return this.fittingHeight(1);
};

Window_TBSAutoMode.prototype.refresh = function () {
    this.contents.clear();
    this.resetFontSettings();
    var text = BattleManagerTBS._autoMode ? "Auto Mode ON" : (BattleManagerTBS._autoModePending ? "Pending Auto Mode" : "");
    this.leU_drawText(text, "center", 0);
};


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
BattleManagerTBS.processAutoBattle = function () {
    var entity = this.activeEntity();
    var battler = entity.battler();
    this.newAction(battler, true);
    this.startAiTurn(entity);
};

Lecode.S_TBS.AutoMode.oldBattleManagerTBS_turnEnd = BattleManagerTBS.turnEnd;
BattleManagerTBS.turnEnd = function() {
    Lecode.S_TBS.AutoMode.oldBattleManagerTBS_turnEnd.call(this);
    this._autoMode = !!this._autoModePending;
    LeUtilities.getScene()._windowAutoMode.refresh();
};

Lecode.S_TBS.AutoMode.oldBattleManagerTBS_startTurn = BattleManagerTBS.startTurn;
BattleManagerTBS.startTurn = function() {
    Lecode.S_TBS.AutoMode.oldBattleManagerTBS_startTurn.call(this);
    this._autoMode = !!this._autoModePending;
    LeUtilities.getScene()._windowAutoMode.refresh();
};

Lecode.S_TBS.AutoMode.oldBattleManagerTBS_stopBattle = BattleManagerTBS.stopBattle;
BattleManagerTBS.stopBattle = function() {
    Lecode.S_TBS.AutoMode.oldBattleManagerTBS_stopBattle.call(this);
    LeUtilities.getScene()._windowAutoMode.hide();
};


/*-------------------------------------------------------------------------
* InputHandlerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.AutoMode.oldInputHandlerTBS_update = InputHandlerTBS.update;
InputHandlerTBS.update = function () {
    if (!this.isActive()) return;
    if (BattleManagerTBS.isWaiting()) return;

    if (Input.isTriggered(Lecode.S_TBS.AutoMode.input)) {
        LeUtilities.getScene().setAutoMode();
    }
    Lecode.S_TBS.AutoMode.oldInputHandlerTBS_update.call(this);
};
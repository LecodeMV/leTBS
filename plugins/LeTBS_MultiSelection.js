/*
#=============================================================================
# LeTBS: Multi Selection
# LeTBS_MultiSelection.js
# By Lecode
# Version 1.1
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# https://github.com/LecodeMV/leTBS/blob/master/LICENSE.txt
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
# - 1.1 : Updated parameter
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeTBS_MultiSelection = true;

var Lecode = Lecode || {};
Lecode.S_TBS.MultiSelection = {};
/*:
 * @plugindesc Adds extra selections to skills and items
 * @author Lecode
 * @version 1.1
 *
 * @param Scope Color
 * @desc [No description]
 * @default #E4A110
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin adds the possibility to select multiple AoEs for an action.
 * The selected areas are then used in the sequences for advanced effects.
 * 
 * ============================================================================
 * Set Up A Multi Selection
 * ============================================================================
 * 
 * You can activate this feature for a given skill by using this instruction
 * inside LeTBS tag:
 * [X] selections: [Type]; [Help Text]
 * 
 * This will define that the user can select X AoEs for this skill,
 * and how they will be processed will depend on [Type].
 * [Help Text] is optional.
 * [Type] can be either 'append' or 'distinct'.
 * With append, the final AoE is a merge of the selections. With distinct, 
 * each selection is unique and can be used differently during sequences,
 * with a loop. (using the sequence command 'call_for_every_mscope')
 * 
 * Feel free to look at the demo skills 'Mega Sparkle' and 'Multi Fire'
 * for better understanding.
 * 
 * ============================================================================
 * Prompt Selections During Sequences
 * ============================================================================
 * 
 * The add-on adds a mean to request a selection during sequences. The sequence 
 * command "request_selection: skill(ID)" draws the scope of the designated 
 * skill and wait for the user to select an AoE.
 * 
 * Check the demo skill "Ally Teleport" for better understanding.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_MultiSelection');

Lecode.S_TBS.MultiSelection.ScopeColor = String(parameters["Scope Color"] || "#E4A110");



/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_onSkillSelected = BattleManagerTBS.onSkillSelected;
BattleManagerTBS.onSkillSelected = function () {
    var skill = LeUtilities.getScene()._windowSkill.item();
    this._multiSelectionTimes = 0;
    this._multiSelectionScopes = [];
    this._multiSelectionData = skill.TagsLetbs.multiSelection;
    if (this._multiSelectionData && this._multiSelectionData.help) {
        LeUtilities.getScene().showHelpWindow();
        LeUtilities.getScene()._helpWindow.setText(this._multiSelectionData.help);
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_onSkillSelected.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_onItemSelected = BattleManagerTBS.onItemSelected;
BattleManagerTBS.onItemSelected = function () {
    var item = LeUtilities.getScene()._windowItem.item();
    this._multiSelectionTimes = 0;
    this._multiSelectionScopes = [];
    this._multiSelectionData = item.TagsLetbs.multiSelection;
    if (this._multiSelectionData && this._multiSelectionData.help) {
        LeUtilities.getScene().showHelpWindow();
        LeUtilities.getScene()._helpWindow.setText(this._multiSelectionData.help);
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_onItemSelected.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_processCommandCallSkill = BattleManagerTBS.processCommandCallSkill;
BattleManagerTBS.processCommandCallSkill = function (id) {
    var skill = $dataSkills[id];
    this._multiSelectionTimes = 0;
    this._multiSelectionScopes = [];
    this._multiSelectionData = skill.TagsLetbs.multiSelection;
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_processCommandCallSkill.call(this, id);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_processCommandAttack = BattleManagerTBS.processCommandAttack;
BattleManagerTBS.processCommandAttack = function () {
    this._multiSelectionTimes = 0;
    this._multiSelectionScopes = [];
    this._multiSelectionData = null;
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_processCommandAttack.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_updateActionSelection = BattleManagerTBS.updateActionSelection;
BattleManagerTBS.updateActionSelection = function () {
    if (this._multiSelectionData)
        this._multiSelectionData.oldAoE = this._actionAoE;
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_updateActionSelection.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_validateActionSelection = BattleManagerTBS.validateActionSelection;
BattleManagerTBS.validateActionSelection = function () {
    if (this._subPhase === "request_selection") {
        this._subPhase = "obj_invokation";
        this.getLayer("scopes").clear();
        this.clearActionSelection();
        return;
    }

    var mData = this._multiSelectionData;
    var selectedCell = this._activeCell;
    if (mData) {
        //-If scope already selected
        if (this._multiSelectionScopes.some(function (data) { return data.center.isSame(selectedCell); })) {
            SoundManager.playBuzzer();
            return;
        }

        SoundManager.playOk();
        this._multiSelectionScopes.push({
            aoe: this._actionAoE,
            center: selectedCell
        });
        this.drawMultiScope(this._actionAoE);
        if (mData.mode === "append") {
            this._actionAoE = [];
            this._multiSelectionScopes.forEach(function (data) {
                this._actionAoE = this._actionAoE.concat(data.aoe);
            }, this);
        }
        this._multiSelectionTimes++;
        if (this._multiSelectionTimes === mData.times) {
            Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_validateActionSelection.call(this);
            if (mData.help) {
                LeUtilities.getScene().hideHelpWindow();
            }
        }
    } else {
        Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_validateActionSelection.call(this);
    }
};

BattleManagerTBS.drawMultiScope = function (scope) {
    var color = Lecode.S_TBS.MultiSelection.ScopeColor;
    var opacity = this._actionScopeParam.selectedOpacity;
    var invalidOpa = this._actionScopeParam.invalidOpa;
    var invalidCondition = "false";
    this.drawScope(scope, color, opacity, invalidOpa, invalidCondition);
};

BattleManagerTBS.requestSelection = function (obj, entity) {
    this._subPhase = "request_selection";
    this.makeSkillScope(entity, obj);
    this.drawSkillScope(entity, obj);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_onActionCancel = BattleManagerTBS.onActionCancel;
BattleManagerTBS.onActionCancel = function () {
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_onActionCancel.call(this);
    var mData = this._multiSelectionData;
    if (mData)
        LeUtilities.getScene().hideHelpWindow();
    this._multiSelectionData = null;
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnTouchInput = BattleManagerTBS.battlePhaseOnTouchInput;
BattleManagerTBS.battlePhaseOnTouchInput = function (selectedCell) {
    switch (this._subPhase) {
        case "request_selection":
            this.touchActionSelection(selectedCell);
            return;
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnTouchInput.call(this, selectedCell);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputOk = BattleManagerTBS.battlePhaseOnInputOk;
BattleManagerTBS.battlePhaseOnInputOk = function () {
    switch (this._subPhase) {
        case "request_selection":
            this.validateActionSelection();
            return;
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputOk.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputLeft = BattleManagerTBS.battlePhaseOnInputLeft;
BattleManagerTBS.battlePhaseOnInputLeft = function () {
    switch (this._subPhase) {
        case "request_selection":
            this.moveCursor("left");
            return;
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputLeft.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputRight = BattleManagerTBS.battlePhaseOnInputRight;
BattleManagerTBS.battlePhaseOnInputRight = function () {
    switch (this._subPhase) {
        case "request_selection":
            this.moveCursor("right");
            return;
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputRight.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputDown = BattleManagerTBS.battlePhaseOnInputDown;
BattleManagerTBS.battlePhaseOnInputDown = function () {
    switch (this._subPhase) {
        case "request_selection":
            this.moveCursor("down");
            return;
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputDown.call(this);
};

Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputUp = BattleManagerTBS.battlePhaseOnInputUp;
BattleManagerTBS.battlePhaseOnInputUp = function () {
    switch (this._subPhase) {
        case "request_selection":
            this.moveCursor("up");
            return;
    }
    Lecode.S_TBS.MultiSelection.oldBattleManagerTBS_battlePhaseOnInputUp.call(this);
};


/*-------------------------------------------------------------------------
* TBSSequenceManager
-------------------------------------------------------------------------*/
TBSSequenceManager.prototype.commandCallForEveryMscope = function (param) {
    var seq = param[0];
    var sortType = param[1] || "random";

    var mData = BattleManagerTBS._multiSelectionData;
    var mScopes = BattleManagerTBS._multiSelectionScopes;
    var seqArray = Lecode.S_TBS.Config.Sequences[seq].slice();
    this._savedCells["mscope_aoe_base"] = mScopes.map(function (data) {
        return data.aoe;
    });
    this._savedCells["mscope_center_base"] = mScopes.map(function (data) {
        return data.center;
    });
    for (var i = 0; i < mData.times; i++) {
        for (var j = seqArray.length - 1; j >= 0; j--) {
            var command = seqArray[j];
            this._sequence.unshift(command);
        }
        this._sequence.table.unshift("save_cells: mscope_aoe, saved(mscope_aoe_base), shift");
        this._sequence.table.unshift("save_cells: mscope_center, saved(mscope_center_base), shift");
    }

    return {};
};

TBSSequenceManager.prototype.commandRequestSelection = function (param) {
    var objData = param[0];
    var obj = this.readObject(objData);

    BattleManagerTBS.requestSelection(obj, this.getUser());

    return {
        requestWait: true,
        waitWhile: function () {
            return BattleManagerTBS._subPhase === "request_selection";
        }
    };
};


/*-------------------------------------------------------------------------
* Scene_Boot
-------------------------------------------------------------------------*/
Lecode.S_TBS.MultiSelection.oldSceneBoot_parseLeTBSTag = Scene_Boot.prototype.parseLeTBSTag;
Scene_Boot.prototype.parseLeTBSTag = function (prop, obj, tags) {
    Lecode.S_TBS.MultiSelection.oldSceneBoot_parseLeTBSTag.call(this, prop, obj, tags);
    var element = tags[prop];
    var str = prop + ":" + element;
    if (str.match(/(\d+)\sselections\s?:\s?(.+)\;(.+)/i)) {
        tags.multiSelection = {
            times: Number(RegExp.$1),
            mode: RegExp.$2,
            help: RegExp.$3.trim()
        };
    } else if (str.match(/(\d+)\sselections\s?:\s?(.+)/i)) {
        tags.multiSelection = {
            times: Number(RegExp.$1),
            mode: RegExp.$2,
            help: null
        };
    }
};
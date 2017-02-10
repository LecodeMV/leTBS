/*
#=============================================================================
# LeTBS: Win Conditions
# LeTBS_WinConditions.js
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
Imported["LeTBS_WinConditions"] = true;

var Lecode = Lecode || {};
Lecode.S_TBS.WinConditions = {};
/*:
 * @plugindesc Add a win condition system
 * @author Lecode
 * @version 1.0
 *
 * @help
 * See the documentation
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* DataManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.WinConditions.oldDataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    Lecode.S_TBS.WinConditions.oldDataManager_createGameObjects.call();
    LeTBSWinCds.setup();
};


/*-------------------------------------------------------------------------
* Game_Interpreter
-------------------------------------------------------------------------*/
Lecode.S_TBS.WinConditions.old_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Lecode.S_TBS.WinConditions.old_pluginCommand.call(this, command, args);
    if (command === 'LeTBSWinCds') {
        switch (args[0]) {
            case 'Clear':
                LeTBSWinCds.clear();
                break;
            case 'Add':
                switch (args[1]) {
                    case "Defeat":
                        if (args[2] === "All") {
                            LeTBSWinCds.addDefeatAll();
                        } else if (args[2] === "Enemies") {
                            var nbrStr = args[3];
                            var enemyId = Number(args[4]);
                            if (nbrStr === "All")
                                LeTBSWinCds.addDefeatAllEnemies(enemyId);
                            else
                                LeTBSWinCds.addDefeatXEnemies(Number(nbrStr), enemyId);
                        } else if (args[2] === "FlaggedEntity") {
                            var flagId = args[3];
                            LeTBSWinCds.addDefeatFlaggedEntity(flagId);
                        }
                        break;
                    case "Prevent":
                        if (args[2] === "ActorDeath") {
                            var actorId = Number(args[3]);
                            LeTBSWinCds.addPreventActorDeath(actorId);
                        } else if (args[2] === "EntityDeath") {
                            var flagId = args[3];
                            var flagName = "";
                            for (var i = 3; i < args.length; i++)
                                flagName += args[i];
                            LeTBSWinCds.addPreventEntityDeath(flagId, flagName);
                        }
                        break;
                    case "Flag":
                        var flagId = args[2];
                        var flagName = "";
                        for (var i = 3; i < args.length; i++)
                            flagName += args[i] + " ";
                        LeTBSWinCds.addFlag(flagId, flagName);
                        break;
                }
                break;
            case "ActivateFlag":
                var flagId = args[1];
                LeTBSWinCds.setFlag(flagId, true);
                break;
            case "DeactivateFlag":
                var flagId = args[1];
                LeTBSWinCds.setFlag(flagId, false);
                break;
        }
    }
};


/*-------------------------------------------------------------------------
* Scene_Battle
-------------------------------------------------------------------------*/
Lecode.S_TBS.WinConditions.oldSB_start = Scene_Battle.prototype.start;
Scene_Battle.prototype.start = function() {
    if (Lecode.S_TBS.commandOn) {
        if (LeTBSWinCds.noConditions()) {
            throw new Error('[LeTBS]There is no win condition !!');
        }
    }
    Lecode.S_TBS.WinConditions.oldSB_start.call(this);
};

Lecode.S_TBS.WinConditions.oldSceneBattle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    Lecode.S_TBS.WinConditions.oldSceneBattle_createAllWindows.call(this);
    if (Lecode.S_TBS.commandOn) {
        this.createWinConditionsWindow();
    }
};

Scene_Battle.prototype.createWinConditionsWindow = function() {
    this._windowWinCds = new Window_TBSWinConditions();
    this._windowWinCds.hide();
    this.addWindow(this._windowWinCds);
};

Scene_Battle.prototype.showWinConditionsWindow = function(sprite) {
    this._windowWinCds._startSprite = sprite;
    this._windowWinCds.x = 0;
    this._windowWinCds.y = sprite.y + sprite.height - this._windowWinCds.standardPadding();
    this._windowWinCds.show();
};

Scene_Battle.prototype.hideWinConditionsWindow = function(sprite) {
    this._windowWinCds.hide();
};


/*-------------------------------------------------------------------------
* Window_TBSWinConditions
-------------------------------------------------------------------------*/
function Window_TBSWinConditions() {
    this.initialize.apply(this, arguments);
}

Window_TBSWinConditions.prototype = Object.create(Window_Base.prototype);
Window_TBSWinConditions.prototype.constructor = Window_TBSWinConditions;

Window_TBSWinConditions.prototype.initialize = function() {
    this._texts = LeTBSWinCds.getConditionTexts();
    var width = this.windowWidth();
    var height = this.windowHeight();
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
    this.opacity = 0;
    this.refresh();
};

Window_TBSWinConditions.prototype.windowWidth = function() {
    return Graphics.width;
};

Window_TBSWinConditions.prototype.windowHeight = function() {
    return this.fittingHeight(this._texts.length);
};

Window_TBSWinConditions.prototype.refresh = function() {
    this.contents.clear();
    this.resetFontSettings();
    this.contents.fontSize += 3;
    var y = 0;
    this._texts.forEach(function(text) {
        this.leU_drawText(text, "center", y);
        y += this.lineHeight();
    }.bind(this));
};

Lecode.S_TBS.oldWindow_TBSWinConditions_update = Window_TBSWinConditions.prototype.update;
Window_TBSWinConditions.prototype.update = function() {
    Lecode.S_TBS.oldWindow_TBSWinConditions_update.call(this);
    if (this._startSprite) {
        this.contentsOpacity = this._startSprite.opacity;
    }
};


/*-------------------------------------------------------------------------
* LeTBSWinCds
-------------------------------------------------------------------------*/
function LeTBSWinCds() {
    throw new Error('This is a static class');
}

LeTBSWinCds.setup = function() {
    this._defeatAll = false;
    this._defeatAllEnemies = [];
    this._defeatXEnemies = [];
    this._defeatFlaggedEntities = [];
    this._preventActorsDeath = [];
    this._preventEntitiesDeath = [];
    this._flagCds = [];
    this._flags = {};
    this._startupFlags = {};
};

LeTBSWinCds.clear = function() {
    this.setup();
};

LeTBSWinCds.addDefeatAll = function() {
    this._defeatAll = true;
};

LeTBSWinCds.addDefeatAllEnemies = function(enemyId) {
    this._defeatAllEnemies.push(enemyId);
};

LeTBSWinCds.addDefeatXEnemies = function(nbr, enemyId) {
    this._defeatXEnemies.push([nbr, enemyId]);
};

LeTBSWinCds.addDefeatFlaggedEntity = function(flagId, flagName) {
    this._defeatFlaggedEntities.push(flagId, flagName);
};

LeTBSWinCds.addPreventActorDeath = function(actorId) {
    this._preventActorsDeath.push(actorId);
};

LeTBSWinCds.addPreventEntityDeath = function(flagId, flagName) {
    this._preventEntitiesDeath.push([flagId, flagName]);
};

LeTBSWinCds.addFlag = function(flagId, flagName) {
    this._flagCds.push([flagId, flagName]);
    this._flags[flagId] = false;
};

LeTBSWinCds.getConditionTexts = function() {
    var texts = [];
    if (this._defeatAll)
        texts.push("Defeat all enemies");
    this._defeatAllEnemies.forEach(function(enemyId) {
        texts.push("Defeat all " + $dataEnemies[enemyId].name + "s");
    }.bind(this));
    this._defeatXEnemies.forEach(function(info) {
        var nbr = info[0];
        var enemyId = info[1];
        if (nbr > 1)
            texts.push("Defeat " + nbr + " " + $dataEnemies[enemyId].name + "s");
        else
            texts.push("Defeat " + $dataEnemies[enemyId].name);
    }.bind(this));
    this._defeatFlaggedEntities.forEach(function(info) {
        var flagName = info[1];
        texts.push("Defeat " + flagName);
    }.bind(this));
    this._preventActorsDeath.forEach(function(actorId) {
        texts.push("Keep " + $dataActors[actorId].name + " alive");
    }.bind(this));
    this._preventEntitiesDeath.forEach(function(info) {
        var flagName = info[1];
        texts.push("Keep " + flagName + " alive");
    }.bind(this));
    this._flagCds.forEach(function(info) {
        var flagName = info[1];
        texts.push(flagName);
    });
    return texts;
};

LeTBSWinCds.noConditions = function() {
    return this.getConditionTexts().length === 0;
};

LeTBSWinCds.checkVictory = function() {
    var nbrSuccess = 0;
    var goalSuccess = this.getConditionTexts().length;
    if (this._defeatAll && $gameTroop.isAllDead())
        nbrSuccess++;
    this._defeatAllEnemies.forEach(function(enemyId) {
        var entities = BattleManagerTBS.getEntitiesWithEnemyId(enemyId);
        if (entities.every(function(ent) { return ent.battler().isDead(); }.bind(this))) {
            nbrSuccess++;
        }
    }.bind(this));
    this._defeatXEnemies.forEach(function(info) {
        var nbr = info[0];
        var enemyId = info[1];
        var nbrDeath = 0;
        var entities = BattleManagerTBS.getEntitiesWithEnemyId(enemyId);
        entities.forEach(function(ent) {
            if (ent && ent.battler().isDead())
                nbrDeath++;
        }.bind(this));
        if (nbrDeath >= nbr)
            nbrSuccess++;
    }.bind(this));
    this._defeatFlaggedEntities.forEach(function(info) {
        var flagId = info[0];
        var entity = BattleManagerTBS.getFlaggedEntity(flagId);
        if (entity && entity.battler().isDead())
            nbrSuccess++;
    }.bind(this));
    this._flagCds.forEach(function(info) {
        var flagId = info[0];
        if (this._flags[flagId])
            nbrSuccess++;
    }.bind(this));
    return nbrSuccess === goalSuccess;
};

LeTBSWinCds.checkDefeat = function() {
    this._preventActorsDeath.forEach(function(actorId) {
        var entity = BattleManagerTBS.getEntityWithActorId(actorId);
        if (entity && entity.battler().isDead())
            return true;
    }.bind(this));
    this._preventEntitiesDeath.forEach(function(info) {
        var flagId = info[0];
        var entity = BattleManagerTBS.getFlaggedEntity(flagId);
        if (entity && entity.battler().isDead())
            return true;
    }.bind(this));
    return false;
};

LeTBSWinCds.setFlag = function(flagId, on) {
    this._flags[flagId] = on;
    BattleManagerTBS.checkDefeatAndVictory();
};


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
BattleManagerTBS.canPrepareDefeat = function() {
    return $gameParty.isAllDead() || LeTBSWinCds.checkDefeat();
};

BattleManagerTBS.canPrepareVictory = function() {
    return LeTBSWinCds.checkVictory();
};

Lecode.S_TBS.WinConditions.oldBattleManagerTBS_battleBeginning = BattleManagerTBS.battleBeginning;
BattleManagerTBS.battleBeginning = function() {
    Lecode.S_TBS.WinConditions.oldBattleManagerTBS_battleBeginning.call(this);
    LeUtilities.getScene().showWinConditionsWindow(this._startSprite);
};

Lecode.S_TBS.WinConditions.oldBattleManagerTBS_beginningPhaseEnd = BattleManagerTBS.beginningPhaseEnd;
BattleManagerTBS.beginningPhaseEnd = function() {
    Lecode.S_TBS.WinConditions.oldBattleManagerTBS_beginningPhaseEnd.call(this);
    LeUtilities.getScene().hideWinConditionsWindow();
};

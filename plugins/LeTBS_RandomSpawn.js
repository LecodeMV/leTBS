/*
#=============================================================================
# LeTBS: Random Spawn
# LeTBS_RandomSpawn.js
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
Imported.LeTBS_RandomSpawn = true;

var Lecode = Lecode || {};
Lecode.S_TBS.RandomSpawn = {};
/*:
 * @plugindesc Spawn neutral entities randomly
 * @author Lecode
 * @version 1.0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin allow your battle maps to spawn neutral entities randomly at
 * battle start.
 * The demo uses this to spawn chests at random locations.
 * 
 * ============================================================================
 * Set Up
 * ============================================================================
 *
 * You'll need an event on your map with the tag <LeTBS Random Spawn>.
 * You'll then need to add a comment with the following data:
 * 
 * entities: [actor(ID) or enemy(ID)], [actor(ID) or enemy(ID)], ...
 * amounts: [Number or Min-Max], [Number or Min-Max], ...
 * rates: [Number], [Number], ...
 * locations: (X1,Y1); (X2,Y); ...
 * 
 * The first 3 data, entities, amounts, and rates should be set up just like a
 * table. Meaning, the first entity can be spawn X times (defined by amounts)
 * with a given odd (defined by rates) for each spawn.
 * When an entity is spawn, a random cell is selected.
 * The spawning stops if ever all locations are occupied.
 * 
 * Example:
 * entities: enemy(35), enemy(36), enemy(37)
 * amounts: 2, 1-2, 1
 * rates: 0.65, 0.25, 0.1
 * locations: (16,17);(11,19);(22,17);(29,26);(21,13);(16,29)
 * 
 * Meaning:
 * The enemy whose ID is 35 can be spawn 2 times, with a odd of 65% for each try.
 * The enemy whose ID is 36 can be spawn 1 to 2 times, with a odd of 25% for each try.
 * The enemy whose ID is 37 can be spawn one time, with a odd of 10% for each try.
 */
//#=============================================================================


/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/
var parameters = PluginManager.parameters('LeTBS_RandomSpawn');


/*-------------------------------------------------------------------------
* BattleManagerTBS
-------------------------------------------------------------------------*/
Lecode.S_TBS.RandomSpawn.oldBattleManagerTBS_createNeutralEntities = BattleManagerTBS.createNeutralEntities;
BattleManagerTBS.createNeutralEntities = function () {
    Lecode.S_TBS.RandomSpawn.oldBattleManagerTBS_createNeutralEntities.call(this);
    this.spawnRandomNeutrals();
};

BattleManagerTBS.spawnRandomNeutrals = function () {
    var layer = this.getLayer("battlers");
    $gameMap.events().forEach(function (event) {
        if (event.event().note.match(/<LeTBS Random Spawn>/i)) {
            var battlers = [];
            var amounts = [];
            var rates = [];
            var locations = [];
            for (var i = 0; i < event.list().length; i++) {
                var command = event.list()[i];
                if (command && command.code === 108 || command.code === 408) {
                    var comment = command.parameters[0];
                    if (comment.match(/entities\s?:\s?(.+)/i)) {
                        battlers = LeUtilities.stringSplit(RegExp.$1, ",");
                    } else if (comment.match(/amounts\s?:\s?(.+)/i)) {
                        amounts = LeUtilities.stringSplit(RegExp.$1, ",");
                    } else if (comment.match(/rates\s?:\s?(.+)/i)) {
                        rates = LeUtilities.stringSplit(RegExp.$1, ",");
                    } else if (comment.match(/locations\s?:\s?(.+)/i)) {
                        locations = LeUtilities.stringSplit(RegExp.$1, ";");
                    }
                }
            }

            if (battlers.length === amounts.length && amounts.length === rates.length) {
                battlers = battlers.map(function (data) {
                    var type = data.match(/actor\((.+)\)/i) ? "actor" : (data.match(/enemy\((.+)\)/i) ? "enemy" : null);
                    var id = Number(RegExp.$1);
                    return type === "actor" ? new Game_Actor(id) : new Game_Enemy(id, 0, 0);
                }, this);
                amounts = amounts.map(function (data) {
                    if (data.match(/(\d+)\-(\d+)/i)) {
                        return LeUtilities.randValueBetween(Number(RegExp.$1), Number(RegExp.$2));
                    }
                    return parseInt(data);
                }, this);
                locations = locations.map(function (data) {
                    if (data.match(/\((\d+)\,(\d+)\)/i)) {
                        return this.getCellAt(Number(RegExp.$1), Number(RegExp.$2));
                    }
                    return null;
                }, this);
                locations = LeUtilities.shuffleArray(locations);
                for (var i = 0; i < rates.length; i++) {
                    var rate = rates[i];
                    var battler = battlers[i];
                    var nbrTry = amounts[i];
                    for (var j = 0; j < nbrTry; j++) {
                        if (Math.random() < rate) {
                            var cell = locations.shift();
                            if (cell) {
                                BattleManagerTBS.addEntity(battler, cell, 0, true);
                            } else {
                                return;
                            }
                        }
                    }
                }
            } else {
                throw new Error("<LeTBS Random Spawn>'entities','rates' and 'amounts' should have the same size");
            }
        }
    },this);
};
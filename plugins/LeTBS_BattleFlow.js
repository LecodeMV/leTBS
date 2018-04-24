
/*
#=============================================================================
# LeTBS: BattleFlow
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
/*:
 * @plugindesc Improve popups and show states alterations
 * @author Lecode
 * @version 1.5
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin add some extra features to the popup display for LeTBS.
 * The popup system is also modified to display the damage in chain.
 * 
 * ============================================================================
 * Force Popup
 * ============================================================================
 *
 * You can force a popup on an entity using a plugin command
 * LeTBS ShowPopup [Entity] Text(...) FontSize(...) Color(...) IconL(...) IconR(...)
 * 
 * The parameters after Text are optional. Replace the dots with wanted values.
 * For more details, see the documentation page about plugin commands.
 * 
 * ============================================================================
 * WARNING: Work In Progress
 * ============================================================================
 *
 * The plugin is in WIP state currently. Most of the features are unexploited.
 */
//#=============================================================================

let tasks = [];
/*-------------------------------------------------------------------------
* Get Parameters
-------------------------------------------------------------------------*/

SceneManager.updateScene = function () {
    if (this._scene) {
        if (!this._sceneStarted && this._scene.isReady()) {
            this._scene.start();
            this._sceneStarted = true;
            this.onSceneStart();
        }
        if (this.isCurrentSceneStarted()) {
            this._scene.update();
            tasks = tasks.filter(task => {
                try {
                    if (task.trigger()) {
                        task.callback();
                        Input.clear();
                        return false;
                    }
                } catch (e) {

                }
                return true;
            });
        }
    }
};

function Do(func) {
    let task = {
        callback: func
    };
    return {
        When: function (whenFunc) {
            task.trigger = whenFunc;
            tasks.push(task);
        }
    };
}

function When(func) {
    let task = {
        trigger: func
    };
    return {
        Do: function (doFunc) {
            task.callback = doFunc;
            tasks.push(task);
        }
    };
}

Do(function () {
    console.log("Yay !");
}).When(function () {
    return $gamePlayer.y === 4;
});

function startBattle() {
    console.log("-Battle Start");
    /*async.series([
        processPositioningPhase,
        processBattlePhase,
        processBattleStoping,
        processBattleEnd
    ]);*/
    processPositioningPhase()
        .then(processBattlePhase)
        .then(processBattleStoping)
        .then(processBattleEnd);
}

function processPositioningPhase() {
    return new Promise((resolve, reject) => {
        console.log("-Positioning");
        positionateEnemies()
            .then(positionateActors)
            .then(resolve);
    });
}

function positionateEnemies() {
    return new Promise((resolve, reject) => {
        let enemies = [{ id: 2 }, { id: 4 }, { id: 1 }, { id: 5 }];
        enemies.forEach(e => {
            console.log("--Enemy ID ", e.id, " positioned");
        });
        resolve();
    });
}

function positionateActors() {
    return new Promise((resolve, reject) => {
        let actors = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
        actors.forEach(actor => {
            Do(function () {
                let actor = actors.shift();
                console.log("--Actor ID ", actor.id, " positioned");
            }).When(function () {
                return Input.isTriggered("ok");
            });
        });
        Do(() => {
            console.log("Yay !");
            resolve();
        }).When(() => {
            return actors.length === 0;
        });
    });
}

function processBattlePhase() {
    return new Promise((resolve, reject) => {
        console.log("-Battle");
        resolve();
    });
}

function processBattleStoping() {
    return new Promise((resolve, reject) => {
        console.log("-Battle Stopping");
        resolve();
    });
}

function processBattleEnd() {
    return new Promise((resolve, reject) => {
        console.log("-Battle End");
        resolve();
    });
}

var arr = [];
for (var i = 0; i < 1000; i++) {
    arr[i] = i;
}

function someFn(ix) {
    return ix * 5 + 1 / 3 * 8;
}
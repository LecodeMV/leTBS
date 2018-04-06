/*
#=============================================================================
# Lecode's Utilities
# LeUtilities.js
# By Lecode
# Version 2.4
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credit required
# - Keep this header
# - Free for commercial use
#=============================================================================
*/
var Imported = Imported || {};
Imported["LE - Utilities"] = true;
/*:
 * @plugindesc Lecode's utilities plugin.
 * @author Lecode
 * @version 2.4
 *
 * @help
 * ( Nothing :B )
 */
//#=============================================================================

/*-------------------------------------------------------------------------
* Version 1.0
-------------------------------------------------------------------------*/

function LeUtilities() {
    throw new Error('This is a static class');
}

LeUtilities.findBattlerSprite = function (battler) {
    if (LeUtilities.isScene("Scene_Battle")) {
        if (battler.isActor()) {
            var sprites = LeUtilities.getScene()._spriteset._actorSprites;
        } else {
            var sprites = LeUtilities.getScene()._spriteset._enemySprites;
        }
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (sprite._battler === battler) return sprite;
        }
    } else {
        return null;
    }
};

LeUtilities.getScene = function () {
    return SceneManager._scene;
};

LeUtilities.isScene = function (str) {
    var scene = this.getScene();
    var bool = eval("scene instanceof " + str);
    return bool;
};

/*-------------------------------------------------------------------------
* Version 1.1
-------------------------------------------------------------------------*/

LeUtilities.stringAppendWithSym = function (str, toAppend, sym) {
    toAppend = String(toAppend);
    sym = String(sym);
    if (toAppend === "") return str;
    return (str === "") ? toAppend : str + sym + toAppend;
};

LeUtilities.stringAppendWithComma = function (str, toAppend) {
    return this.stringAppendWithSym(str, toAppend, ",");
};

LeUtilities.stringSplit = function (str, sym) {
    str = String(str);
    if (str === "") {
        return [];
    } else if (!str.match(sym)) {
        return [str];
    } else {
        return str.split(sym);
    }
};

LeUtilities.CommandGetTextAsArg = function (args, start) {
    var text = "";
    for (var i = start; i < args.length; i++) {
        text += args[i];
        if (i != args.length - 1) {
            text += " ";
        }
    }
    return text;
};

/*-------------------------------------------------------------------------
* Version 1.2
-------------------------------------------------------------------------*/

LeUtilities.getRandomValueInArray = function (array) {
    var index = Math.floor((Math.random() * array.length));
    return array[index];
};

LeUtilities.getXRandomValuesInArray = function (array, x) {
    var finalArray = [];
    if (x >= array.length) return array;
    for (var i = 0; i < x; i++) {
        var obj = this.getRandomValueInArray(array);
        this.removeInArray(array, obj);
        finalArray.push(obj);
    }
    return finalArray;
};

LeUtilities.removeInArray = function (array, element) {
    var index = array.indexOf(element);
    if (index > -1) {
        array.splice(index, 1);
    }
};

/*-------------------------------------------------------------------------
* Version 1.3
-------------------------------------------------------------------------*/

LeUtilities.removeAllChildren = function (holder) {
    while (holder.children[0]) {
        holder.removeChild(holder.children[0]);
    }
};

/*-------------------------------------------------------------------------
* Version 1.4
-------------------------------------------------------------------------*/

LeUtilities.rectRectCollision = function (rect1, rect2) {
    return !(rect2.leU_left() > rect1.leU_right() ||
        rect2.leU_right() < rect1.leU_left() ||
        rect2.leU_top() > rect1.leU_bottom() ||
        rect2.leU_bottom() < rect1.leU_top());
};

/*-------------------------------------------------------------------------
* Version 1.5
-------------------------------------------------------------------------*/

LeUtilities.isMyFriend = function (battler, test) {
    return (battler.isActor() && test.isActor()) || (!battler.isActor() && !test.isActor());
};

LeUtilities.isMyEnemy = function (battler, test) {
    return !this.isMyFriend(battler, test);
};

/*-------------------------------------------------------------------------
* Version 1.6
-------------------------------------------------------------------------*/

LeUtilities.uniqArray = function (array) {
    /*var holder = {};
    return array.filter(function(item) {
        return holder.hasOwnProperty(item) ? false : (holder[item] = true);
    });*/
    var func = function (value, index, self) {
        return self.indexOf(value) === index;
    };
    return array.filter(func);
};

/*-------------------------------------------------------------------------
* Version 1.7
-------------------------------------------------------------------------*/

Sprite.prototype.leU_left = function () {
    return this.x - Math.floor(this.leU_trueWidth() * (this.anchor ? this.anchor.x : 0));
};

Sprite.prototype.leU_right = function () {
    return this.leU_left() + this.leU_trueWidth();
}

Sprite.prototype.leU_top = function () {
    return this.y - Math.floor(this.leU_trueHeight() * (this.anchor ? this.anchor.y : 0));
}

Sprite.prototype.leU_bottom = function () {
    return this.leU_top() + this.leU_trueHeight();
}

Sprite.prototype.leU_trueWidth = function () {
    return Math.floor(this.width * (this.scale ? this.scale.x : 1));
}

Sprite.prototype.leU_trueHeight = function () {
    return Math.floor(this.height * (this.scale ? this.scale.y : 1));
}

Sprite.prototype.leU_halfWidth = function () {
    return Math.floor(this.leU_trueWidth() / 2);
}

Sprite.prototype.leU_halfHeight = function () {
    return Math.floor(this.leU_trueHeight() / 2);
}

Sprite.prototype.leU_center = function () {
    return {
        x: this.leU_left() + this.leU_halfWidth(),
        y: this.leU_top() + this.leU_halfHeight()
    };
}

LeUtilities.AToBRelation = function (x, x1, x2, y1, y2, s) {
    s = s || 1.0;
    return ((y2 - y1) / Math.pow((x2 - x1), s) * 1.0) * Math.pow((x - x1), s) + y1;
};

/*-------------------------------------------------------------------------
* Version 1.8
-------------------------------------------------------------------------*/

var oldSpriteIni1 = Sprite.prototype.initialize;
Sprite.prototype.initialize = function (bitmap) {
    oldSpriteIni1.call(this, bitmap);
    this._leU_flashColor = [0, 0, 0, 0];
    this._leU_flashDuration = 0;
    this._leU_loopFlash = false;
    this._leU_loopFlashData = {
        color: [0, 0, 0, 0],
        duration: 0
    };
    this._leU_flashMode = "blend";
};

Sprite.prototype.leU_startFlash = function (color, duration) {
    this._leU_flashColor = LeUtilities.cloneArray(color);
    this._leU_flashDuration = duration;
};

Sprite.prototype.leU_startLoopFlash = function (color, duration) {
    this._leU_loopFlash = true;
    this._leU_loopFlashData = {
        color: LeUtilities.cloneArray(color),
        duration: duration
    };
};

Sprite.prototype.leU_setFlashMode = function (mode) {
    this._leU_flashMode = mode;
};

Sprite.prototype.leU_endLoopFlash = function () {
    this._leU_loopFlash = false;
};

var oldSpriteUpdate1 = Sprite.prototype.update;
Sprite.prototype.update = function () {
    oldSpriteUpdate1.call(this);
    this.leU_updateFlash();
};

Sprite.prototype.leU_updateFlash = function () {
    if (this._leU_flashDuration > 0) {
        var d = this._leU_flashDuration--;
        this._leU_flashColor[3] *= (d - 1) / d;
    }
    if (this._leU_loopFlash && this._leU_flashDuration === 0)
        this.leU_startFlash(this._leU_loopFlashData.color, this._leU_loopFlashData.duration);
    switch (this._leU_flashMode) {
        case "blend":
            this.setBlendColor(this._leU_flashColor);
            break;
        case "tone":
            this.setColorTone(this._leU_flashColor);
            break;
        case "opacity":
            this.opacity = this._leU_flashColor[3];
            break;
    }
};

Sprite.prototype.leU_clearFlash = function () {
    this.setBlendColor([0, 0, 0, 0]);
    this.setColorTone([0, 0, 0, 0]);
};

/*-------------------------------------------------------------------------
* Version 1.9
-------------------------------------------------------------------------*/

LeUtilities.cloneArray = function (array) {
    return array.slice(0);
}

Window_Base.prototype.leU_drawText = function (text, x, y) {
    if (x === "center") {
        x = this.contentsWidth() / 2 - (this.textWidth(text) + 1) / 2;
    }
    if (y === "center") {
        y = this.contentsHeight() / 2 - (this.contents.fontSize + 1) / 2;
    }
    var rect = {
        x: x,
        y: y,
        w: this.textWidth(text) + 1,
        h: this.contents.fontSize + 1
    };
    this.drawText(text, x, y, this.contentsWidth(), this.lineHeight());
    return rect;
};

/*-------------------------------------------------------------------------
* Version 2.0
-------------------------------------------------------------------------*/

var oldWB_initialize1 = Window_Base.prototype.initialize;
Window_Base.prototype.initialize = function (x, y, width, height) {
    oldWB_initialize1.call(this, x, y, width, height);
    this._leU_float = false;
    this._leU_floatData = {
        ini_pos: [x, y],
        range: [0, 0],
        sens: ["+", "+"],
        speed: 3
    };
};

var oldWB_update1 = Window_Base.prototype.update;
Window_Base.prototype.update = function () {
    oldWB_update1.call(this);
    this.leU_updateFloat();
};

Window_Base.prototype.leU_updateFloat = function () {
    if (!this._leU_float) return;
    var data = this._leU_floatData;
    //- X
    var op = data.sens[0] === "+" ? "this.x+data.speed" : "this.x-data.speed";
    var fx = eval(op);
    var dist = Math.abs(fx - data.ini_pos[0]);
    if (dist >= data.range[0]) {
        fx = this.x;
        data.sens[0] = data.sens[0] === "+" ? "-" : "+";
    }
    this.move(fx, this.y, this.width, this.height);
    //- Y
    var op = data.sens[1] === "+" ? "this.y+data.speed" : "this.y-data.speed";
    var fy = eval(op);
    var dist = Math.abs(fy - data.ini_pos[1]);
    if (dist >= data.range[1]) {
        fy = this.y;
        data.sens[1] = data.sens[1] === "+" ? "-" : "+";
    }
    this.move(this.x, fy, this.width, this.height);
};

/*-------------------------------------------------------------------------
* Version 2.1
-------------------------------------------------------------------------*/
function LeU_WindowConfirmation() {
    this.initialize.apply(this, arguments);
}

LeU_WindowConfirmation.prototype = Object.create(Window_HorzCommand.prototype);
LeU_WindowConfirmation.prototype.constructor = LeU_WindowConfirmation;

LeU_WindowConfirmation.prototype.initialize = function (width, texts) {
    this._okText = "Ok";
    this._cancelText = "Cancel";
    this._headerTexts = texts || ["Are you sure ?"];
    this._windowWidth = width || 300;
    var x = Graphics.width / 2 - this.windowWidth() / 2;
    var y = Graphics.height / 2 - this.windowHeight() / 2;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

LeU_WindowConfirmation.prototype.windowWidth = function () {
    return this._windowWidth;
};

LeU_WindowConfirmation.prototype.headerHeight = function () {
    return this._headerTexts.length * this.lineHeight();
};

LeU_WindowConfirmation.prototype.windowHeight = function () {
    return Window_HorzCommand.prototype.windowHeight.call(this) + this.headerHeight();
};

LeU_WindowConfirmation.prototype.maxCols = function () {
    return 2;
};

LeU_WindowConfirmation.prototype.makeCommandList = function () {
    this.addCommand(this._okText, 'ok');
    this.addCommand(this._cancelText, 'cancel');
};

LeU_WindowConfirmation.prototype.drawHeader = function () {
    this.changeTextColor(this.systemColor());
    for (var i = 0; i < this._headerTexts.length; i++) {
        var text = this._headerTexts[i];
        this.leU_drawText(text, 0, this.lineHeight() * i, "x");
    }
};

LeU_WindowConfirmation.prototype.itemRect = function (index) {
    var rect = new Rectangle();
    var maxCols = this.maxCols();
    rect.width = this.itemWidth();
    rect.height = this.itemHeight();
    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
    rect.y = Math.floor(index / maxCols) * rect.height - this._scrollY;
    rect.y += this.headerHeight();
    return rect;
};

var oldLeU_WC_drawAllItems = LeU_WindowConfirmation.prototype.drawAllItems;
LeU_WindowConfirmation.prototype.drawAllItems = function () {
    this.resetFontSettings();
    this.drawHeader();
    this.contents.fontSize -= 4;
    this.changeTextColor(this.normalColor());
    oldLeU_WC_drawAllItems.call(this);
};

/*-------------------------------------------------------------------------
* Version 2.2
-------------------------------------------------------------------------*/
LeUtilities.getMinInArray = function (array) {
    return array.sort(function (a, b) {
        return (a > b) ? 1 : ((a < b) ? -1 : 0);
    }.bind(this))[0];
};

LeUtilities.getMaxInArray = function (array) {
    return array.sort(function (a, b) {
        return (a > b) ? 1 : ((a < b) ? -1 : 0);
    }.bind(this)).pop();
};

LeUtilities.distanceBetween = function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};

LeUtilities.distanceBetweenCells = function (a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

LeUtilities.sortByClosestDistance = function (obj, array, prop) {
    return array.sort(function (a, b) {
        var obj_aDist = LeUtilities.distanceBetween(prop ? prop(a) : a, obj);
        var obj_bDist = LeUtilities.distanceBetween(prop ? prop(b) : b, obj);
        return obj_aDist - obj_bDist;
    });
};

LeUtilities.sortByFarthestDistance = function (obj, array, prop) {
    return array.sort(function (a, b) {
        var obj_aDist = LeUtilities.distanceBetween(prop ? prop(a) : a, obj);
        var obj_bDist = LeUtilities.distanceBetween(prop ? prop(b) : b, obj);
        return obj_bDist - obj_aDist;
    });
};

LeUtilities.closestByDistance = function (obj, array) {
    return this.sortByClosestDistance(obj, array)[0];
};

LeUtilities.farthestByDistance = function (obj, array) {
    return this.sortByClosestDistance(obj, array).leU_last();
};

Array.prototype.leU_find = function (func) {
    for (var i = 0; i < this.length; i++)
        if (func(this[i]))
            return this[i];
    return null;
};

Sprite.prototype.leU_move = function (speed, destX, destY, callback) {
    if (this.x == destX && this.y == destY) return;
    this.leU_moveX(speed, destX);
    this.leU_moveY(speed, destY);
    if (this.x == destX && this.y == destY && callback)
        callback();
};

Sprite.prototype.leU_moveX = function (speed, destX) {
    if (this.x == destX) return;
    var dir = (this.x > destX) ? -1 : 1;
    this.x += speed * dir;
    if (dir == 1 && this.x >= destX || dir == -1 && this.x <= destX)
        this.x = destX;
};

Sprite.prototype.leU_moveY = function (speed, destY) {
    if (this.y == destY) return;
    var dir = (this.y > destY) ? -1 : 1;
    this.y += speed * dir;
    if (dir == 1 && this.y >= destY || dir == -1 && this.y <= destY)
        this.y = destY;
};

Array.prototype.leU_last = function () {
    return this[this.length - 1];
};

LeUtilities.getPixelsOfLine = function (x0, y0, x1, y1, sprite) {
    var pixels = [];
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    while (true) {
        pixels.push([x0, y0]);
        if (sprite)
            sprite.bitmap.fillRect(x0, y0, 1, 1, "#000000");

        if ((x0 == x1) && (y0 == y1)) break;
        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
    return pixels;
};

LeUtilities.EXP_getPixelsOfParabola = function (x0, y0, x1, y1, height) {
    if (x0 == x1 || y0 === y1) return this.getPixelsOfLine(x0, y0, x1, y1);
    var pixels = [];
    var top_y, top_x, start_x, start_y, dest_x, dest_y;

    top_y = (y0 + y1) / 2 - height;
    if (y0 > y1) {
        start_y = y1;
        dest_y = y0;
    } else {
        start_y = y0;
        dest_y = y1;
    }
    if (x0 > x1) {
        start_x = x1;
        dest_x = x0;
    } else {
        dest_x = x1;
        start_x = x0;
    }
    var k = -Math.sqrt((top_y - start_y) / (top_y - dest_y));
    var v = (k * dest_x - start_x) / (k - 1);
    var u = (top_y - start_y) / ((start_x - v) * (start_x - v));
    for (var x = start_x; x <= dest_x; x++) {
        var y = top_y - u * (x - v) * (x - v);
        pixels.push([parseInt(x), parseInt(y)]);
    }
    if (x0 > x1)
        pixels.reverse();
    return pixels;
};

LeUtilities.doesRectIncludeCoord = function (cx, cy, w, h, coords) {
    var x = coords[0],
        y = coords[1];
    if (x > cx && x < (cx + w) && y > cy && y < (cy + h))
        return true;
    return false;
};

LeUtilities.isNumeric = function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
};

/*-------------------------------------------------------------------------
* Version 2.3
-------------------------------------------------------------------------*/
LeUtilities.getPixelsOfParabola = function (x1, y1, x2, y2, x3, y3) {
    if (x1 == x3) return this.getPixelsOfLine(x1, y1, x3, y3);
    var pixels = [];
    var a = (x1 * (y3 - y2) - x2 * y3 + y2 * x3 + y1 * (x2 - x3)) / (x1 * ((x3 * x3) - (x2 * x2)) - x2 * (x3 * x3) + (x2 * x2) * x3 + (x1 * x1) * (x2 - x3));
    var b = -((x1 * x1) * (y3 - y2) - (x2 * x2) * y3 + y2 * (x3 * x3) + y1 * ((x2 * x2) - (x3 * x3))) / (x1 * ((x3 * x3) - (x2 * x2)) - x2 * (x3 * x3) + (x2 * x2) * x3 + (x1 * x1) * (x2 - x3));
    var c = (x1 * (y2 * (x3 * x3) - (x2 * x2) * y3) + (x1 * x1) * (x2 * y3 - y2 * x3) + y1 * ((x2 * x2) * x3 - x2 * (x3 * x3))) / (x1 * ((x3 * x3) - (x2 * x2)) - x2 * (x3 * x3) + (x2 * x2) * x3 + (x1 * x1) * (x2 - x3));
    var start_x;
    var end_x;
    if (x1 <= x3) {
        start_x = x1;
        end_x = x3;
    } else {
        start_x = x3;
        end_x = x1;
    }
    for (var x = start_x; x <= end_x; x++) {
        var y = a * x * x + b * x + c;
        pixels.push([x, y]);
    }
    return pixels;
};

LeUtilities.getPixelsOfJump = function (sx, sy, dx, dy, h) {
    var mx = sx + (sx - dx) / 2;
    var my = sy + (sy - dy) / 2 + h;
    return this.getPixelsOfParabola(sx, sy, mx, my, dx, dy);
};

LeUtilities.randValueBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

/*-------------------------------------------------------------------------
* Version 2.4
-------------------------------------------------------------------------*/
var oldTI_onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function (event) {
    oldTI_onMouseMove.call(this, event);
    this._leMouseX = event.pageX;
    this._leMouseY = event.pageY;
};

Window_Base.prototype.isMouseInsideFrame = function () {
    return this.getBounds().contains(TouchInput._leMouseX, TouchInput._leMouseY);
};

function LeU_WindowScrollable() {
    this.initialize.apply(this, arguments);
}

LeU_WindowScrollable.prototype = Object.create(Window_Base.prototype);
LeU_WindowScrollable.prototype.constructor = LeU_WindowScrollable;

LeU_WindowScrollable.prototype.initialize = function (x, y, w, h) {
    Window_Base.prototype.initialize.call(this, x, y, w, h);
};

LeU_WindowScrollable.prototype.lineHeight = function () {
    return Window_Base.prototype.lineHeight.call(this);
};

LeU_WindowScrollable.prototype.contentsHeight = function () {
    return this._lines * this.lineHeight() + this.standardPadding() * 2;
};

LeU_WindowScrollable.prototype.visibleLines = function () {
    return 1;
};

LeU_WindowScrollable.prototype.refresh = function () {
    this.contents.clear();
    this.makeLineNumbers.apply(this, arguments);
    this.createContents();
    this.drawConcents.apply(this, arguments);
};

LeU_WindowScrollable.prototype.makeLineNumbers = function () {
    if (!this._lines) this._lines = 1;
    this._hiddenLines = this._lines - this.visibleLines();
};

LeU_WindowScrollable.prototype.drawConcents = function () {

};

LeU_WindowScrollable.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    this.downArrowVisible = this.needScroll();
    if (this.isMouseInsideFrame())
        this.processWheel();
};

LeU_WindowScrollable.prototype.needScroll = function () {
    return this._hiddenLines > 0;
};

LeU_WindowScrollable.prototype.processWheel = function () {
    var threshold = 20;
    if (TouchInput.wheelY >= threshold && this.needScroll()) {
        this.scrollDown();
    }
    if (TouchInput.wheelY <= -threshold && this.origin.y > 0) {
        this.scrollUp();
    }
};

LeU_WindowScrollable.prototype.scrollDown = function () {
    this.origin.y += this.scrollSpeed();
    this._hiddenLines--;
};

LeU_WindowScrollable.prototype.scrollUp = function () {
    this.origin.y -= this.scrollSpeed();
    this._hiddenLines++;
};

LeU_WindowScrollable.prototype.scrollSpeed = function () {
    return this.lineHeight();
};


/*-------------------------------------------------------------------------
* Version 2.5
-------------------------------------------------------------------------*/
LeUtilities.rectCoordCollision = function (rect1, x, y) {
    var sprite = new Sprite();
    sprite.x = x;
    sprite.y = y;
    return this.rectRectCollision(rect1, sprite);
};

LeUtilities.getWrappedLines = function (text, window) {
    var words = text.split(" ");
    var lines = [];
    var line = "";
    var lineWidth = 0;
    for (var i = 0; i < words.length; i++) {
        var word = (i === words.length - 1) ? words[i] : words[i] + " ";
        lineWidth += window.textWidth(word);
        if (lineWidth > window.contentsWidth()) {
            i--;
            lineWidth = 0;
            lines.push(line);
            line = "";
            continue;
        }
        line += word;
        if (i === words.length - 1)
            lines.push(line);
    }
    return lines;
};

LeUtilities.shrinkTextWithUnderscores = function (text, lower) {
    return text.replace(/\_(.)/ig, function (word) {
        return word[1].toUpperCase();
    }).replace(/\b(.)/i, function (word) {
        if (lower) return word;
        return word.toUpperCase();
    });
};


/*-------------------------------------------------------------------------
* Version 2.6
-------------------------------------------------------------------------*/
LeUtilities.directionCodeToText = function (dirCode) {
    switch (dirCode) {
        case 2:
            return "down";
        case 4:
            return "left";
        case 6:
            return "right";
        case 8:
            return "up";
    }
    return "";
};

LeUtilities.directionTextToCode = function (dirText) {
    switch (dirText) {
        case "down":
            return 2;
        case "left":
            return 4;
        case "right":
            return 6;
        case "up":
            return 8;
    }
    return "";
};

LeUtilities.resetMapEvents = function () {
    var letters = ["A", "B", "C", "D"];
    var events = $gameMap.events();
    for (var i = 0; i < events.length; i++) {
        var id = events[i].eventId();
        var mapId = events[i]._mapId;
        for (var j = 0; j < letters.length; j++) {
            var key = [mapId, id, letters[j]];
            $gameSelfSwitches.setValue(key, 0);
        }
        events[i].refresh();
    }
};


/*-------------------------------------------------------------------------
* Version 2.7
-------------------------------------------------------------------------*/
LeUtilities.sumOfArray = function (array) {
    if (array.length === 0) return 0;
    return array.reduce(function (a, b) {
        return a + b;
    });
};

LeUtilities.avgOfArray = function (array) {
    return this.sumOfArray(array) / array.length;
};
LeUtilities.getMinInArrayBy = function (array, prop) {
    return array.sort(function (a, b) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    }.bind(this))[0];
};

LeUtilities.getMaxInArrayBy = function (array, prop) {
    return array.sort(function (a, b) {
        return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
    }.bind(this)).pop();
};

LeUtilities.stringToArray = function (str) {
    if (!str) return [];
    str = str.replace(/ /ig, "").replace(/\,$/, "");
    return str.replace(/ /ig, "").split(",").map(function (data) {
        if (isNaN(Number(data.trim()))) return String(data).trim();
        return Number(data.trim());
    });
};

LeUtilities.shuffleArray = function (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
};


/*-------------------------------------------------------------------------
* Version 2.8
-------------------------------------------------------------------------*/
LeUtilities.hexToRgb = function (hex) {
    var str = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return str ? {
        r: parseInt(str[1], 16),
        g: parseInt(str[2], 16),
        b: parseInt(str[3], 16)
    } : null;
};

LeUtilities.doesResourceExist = function (path) {
    var bitmap = Bitmap.load(path);
    return !bitmap.isError();
};

LeUtilities.fastEase = function (time, step, func) {
    step = Math.round(step);
    var stepsTime = 0;
    while (stepsTime < time) {
        stepsTime += step;
        setTimeout(func, stepsTime);
    }
};

LeUtilities.isAlly = function (user, battler) {
    return user.isActor() && battler.isActor() || user.isEnemy() && battler.isEnemy();
};

LeUtilities.isEnemy = function (user, battler) {
    return !this.isAlly(user, battler);
};

LeUtilities.perfectStringList = function (str) {
    while (str.match(/\,\,/ig))
        str = str.replace(/\,\,/ig, ",");
    while (str.match(/\, /ig))
        str = str.replace(/\, /ig, ",");
    while (str.match(/\,$/ig))
        str = str.replace(/\,$/ig, "");
    while (str.match(/^\,/ig))
        str = str.replace(/^\,/ig, "");
    return str;
};

String.prototype.regExValue = function (pattern) {
    if (this.match(pattern))
        return RegExp.$1;
    return null;
};


/*-------------------------------------------------------------------------
* Version 2.9
-------------------------------------------------------------------------*/
LeUtilities.aOrB = function (a, b) {
    return Math.random() >= 0.5 ? a : b;
};

LeUtilities.getBezier = function (t, C1, C2, C3, C4) {
    var pos = { x: 0, y: 0 };
    var b1 = t * t * t;
    var b2 = 3 * t * t * (1 - t);
    var b3 = 3 * t * (1 - t) * (1 - t);
    var b4 = (1 - t) * (1 - t) * (1 - t);
    pos.x = C1.x * b1 + C2.x * b2 + C3.x * b3 + C4.x * b4;
    pos.y = C1.y * b1 + C2.y * b2 + C3.y * b3 + C4.y * b4;
    return pos;
};

LeUtilities.getBezierTrajectory = function (duration, p1, p2, p3, p4) {
    var coords = [];
    for (var i = 0; i < duration; i++) {
        var t = i * (1 / duration);
        var b = this.getBezier(t, p1, p2, p3, p4);
        coords.push([b.x, b.y]);
    }
    return coords;
};

LeUtilities.rotatePoint = function (cx, cy, angle, p) {
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    p.x -= cx;
    p.y -= cy;
    var xnew = p.x * c - p.y * s;
    var ynew = p.x * s + p.y * c;
    p.x = Math.round(xnew + cx);
    p.y = Math.round(ynew + cy);
    return p;
};


/*!	Curve calc function for canvas 2.3.7
 *	(c) Epistemex 2013-2016
 *	www.epistemex.com
 *	License: MIT
 */

/**
 * Calculates an array containing points representing a cardinal spline through given point array.
 * Points must be arranged as: [x1, y1, x2, y2, ..., xn, yn].
 *
 * There must be a minimum of two points in the input array but the function
 * is only useful where there are three points or more.
 *
 * The points for the cardinal spline are returned as a new array.
 *
 * @param {Array} points - point array
 * @param {Number} [tension=0.5] - tension. Typically between [0.0, 1.0] but can be exceeded
 * @param {Number} [numOfSeg=25] - number of segments between two points (line resolution)
 * @param {Boolean} [close=false] - Close the ends making the line continuous
 * @returns {Float32Array} New array with the calculated points that was added to the path
 */
LeUtilities.getCurvePoints = function(points, tension, numOfSeg, close) {

    'use strict';

    if (typeof points === "undefined" || points.length < 2) return new Float32Array(0);

    // options or defaults
    tension = typeof tension === "number" ? tension : 0.5;
    numOfSeg = typeof numOfSeg === "number" ? numOfSeg : 25;

    var pts,															// for cloning point array
        i = 1,
        l = points.length,
        rPos = 0,
        rLen = (l - 2) * numOfSeg + 2 + (close ? 2 * numOfSeg : 0),
        res = new Float32Array(rLen),
        cache = new Float32Array((numOfSeg + 2) << 2),
        cachePtr = 4;

    pts = points.slice(0);

    if (close) {
        pts.unshift(points[l - 1]);										// insert end point as first point
        pts.unshift(points[l - 2]);
        pts.push(points[0], points[1]); 								// first point as last point
    }
    else {
        pts.unshift(points[1]);											// copy 1. point and insert at beginning
        pts.unshift(points[0]);
        pts.push(points[l - 2], points[l - 1]);							// duplicate end-points
    }

    // cache inner-loop calculations as they are based on t alone
    cache[0] = 1;														// 1,0,0,0

    for (; i < numOfSeg; i++) {

        var st = i / numOfSeg,
            st2 = st * st,
            st3 = st2 * st,
            st23 = st3 * 2,
            st32 = st2 * 3;

        cache[cachePtr++] = st23 - st32 + 1;							// c1
        cache[cachePtr++] = st32 - st23;								// c2
        cache[cachePtr++] = st3 - 2 * st2 + st;							// c3
        cache[cachePtr++] = st3 - st2;									// c4
    }

    cache[++cachePtr] = 1;												// 0,1,0,0

    // calc. points
    parse(pts, cache, l, tension);

    if (close) {
        //l = points.length;
        pts = [];
        pts.push(points[l - 4], points[l - 3],
            points[l - 2], points[l - 1], 							// second last and last
            points[0], points[1],
            points[2], points[3]); 								// first and second
        parse(pts, cache, 4, tension);
    }

    function parse(pts, cache, l, tension) {

        for (var i = 2, t; i < l; i += 2) {

            var pt1 = pts[i],
                pt2 = pts[i + 1],
                pt3 = pts[i + 2],
                pt4 = pts[i + 3],

                t1x = (pt3 - pts[i - 2]) * tension,
                t1y = (pt4 - pts[i - 1]) * tension,
                t2x = (pts[i + 4] - pt1) * tension,
                t2y = (pts[i + 5] - pt2) * tension,
                c = 0, c1, c2, c3, c4;

            for (t = 0; t < numOfSeg; t++) {

                c1 = cache[c++];
                c2 = cache[c++];
                c3 = cache[c++];
                c4 = cache[c++];

                res[rPos++] = c1 * pt1 + c2 * pt3 + c3 * t1x + c4 * t2x;
                res[rPos++] = c1 * pt2 + c2 * pt4 + c3 * t1y + c4 * t2y;
            }
        }
    }

    // add last point
    l = close ? 0 : points.length - 2;
    res[rPos++] = points[l++];
    res[rPos] = points[l];

    return res;
}
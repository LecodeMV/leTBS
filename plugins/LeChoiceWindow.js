/*
#=============================================================================
# Choice Window
# LeChoiceWindow.js
# By Lecode
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credit goes to Lecode
#-----------------------------------------------------------------------------
# Version History
#-----------------------------------------------------------------------------
# - 1.0 : Initial release
#=============================================================================
*/
var Imported = Imported || {};
Imported.LeChoiceWindow = true;

var Lecode = Lecode || {};
Lecode.S_ChoiceWindow = {};
/*:
 * @plugindesc Add a detailed choice menu
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
var parameters = PluginManager.parameters('LeChoiceMenu');
Lecode.S_ChoiceWindow.scopeColor = "#380B61";


/*-------------------------------------------------------------------------
* Scene_List
-------------------------------------------------------------------------*/
function Scene_List() {
    this.initialize.apply(this, arguments);
}

Scene_List.prototype = Object.create(Scene_MenuBase.prototype);
Scene_List.prototype.constructor = Scene_List;

Scene_List.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_List.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createListWindow();
    this.structurate();
};

Scene_List.prototype.createHelpWindow = function () {
    this._helpWindow = new Window_ListHelp();
    this.addWindow(this._helpWindow);
};

Scene_List.prototype.createListWindow = function () {
    this._listWindow = new Window_List();
    this._listWindow.setHelp(this._helpWindow);
    this._listWindow.setHandler('ok',     this.onListOk.bind(this));
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.refresh();
    this._listWindow.select(0);
    this._listWindow.activate();
    this.addWindow(this._listWindow);
};

Scene_List.prototype.structurate = function () {
    this.centerWindow(this._listWindow);
    this._helpWindow.y = this._listWindow.y;
    this._helpWindow.x = this._listWindow.x + this._listWindow.width;
    this._helpWindow.x -= this._helpWindow.width / 2;
    this._listWindow.x -= this._helpWindow.width / 2;
};

Scene_List.prototype.centerWindow = function (win) {
    win.x = Graphics.width / 2 - win.width / 2;
    win.y = Graphics.height / 2 - win.height / 2;
};

Scene_List.prototype.onListOk = function() {
};

Scene_List.prototype.onListCancel = function() {
};


/*-------------------------------------------------------------------------
* Window_ListHelp
-------------------------------------------------------------------------*/
function Window_ListHelp() {
    this.initialize.apply(this, arguments);
}

Window_ListHelp.prototype = Object.create(Window_Base.prototype);
Window_ListHelp.prototype.constructor = Window_ListHelp;

Window_ListHelp.prototype.initialize = function() {
    var width = 450;
    var height = this.fittingHeight(8);
    Window_Base.prototype.initialize.call(this, 0, 0, width, height);
};

Window_ListHelp.prototype.refresh = function(item) {
    this.contents.clear();
};


/*-------------------------------------------------------------------------
* Window_List
-------------------------------------------------------------------------*/
function Window_List() {
    this.initialize.apply(this, arguments);
}

Window_List.prototype = Object.create(Window_Selectable.prototype);
Window_List.prototype.constructor = Window_List;

Window_List.prototype.initialize = function() {
    var width = 300;
    var height = this.fittingHeight(8);
    Window_Selectable.prototype.initialize.call(this, 0, 0, width, height);
    this._helpWindow = null;
    this._data = [];
};

Window_List.prototype.setHelp = function(help) {
    this._helpWindow = help;
};

Window_List.prototype.maxCols = function() {
    return 1;
};

Window_List.prototype.spacing = function() {
    return 48;
};

Window_List.prototype.maxItems = function() {
    return this._data ? this._data.length : 1;
};

Window_List.prototype.item = function() {
    var index = this.index();
    return this._data && index >= 0 ? this._data[index] : null;
};

Window_List.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.item());
};

Window_List.prototype.includes = function(item) {
    return true;
};

Window_List.prototype.isEnabled = function(item) {
    return true;
};

Window_List.prototype.makeItemList = function() {
    this._data = [
        {
            name: "Catch The Thieves",
            icon: 3
        },
        {
            name: "Stop All Waves",
            icon: 4
        }
    ];
};

Window_List.prototype.drawItem = function(index) {
    var item = this._data[index];
    if (item) {
        var rect = this.itemRect(index);
        this.drawIcon(item.icon, rect.x, rect.y);
        rect.x += Window_Base._iconWidth;
        this.leU_drawText(item.name, rect.x, rect.y);
    }
};

Window_List.prototype.updateHelp = function() {
    this._helpWindow.refresh(this.item());
};

Window_List.prototype.refresh = function() {
    this.makeItemList();
    this.createContents();
    this.drawAllItems();
};
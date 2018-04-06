//=============================================================================
// ShowConsoleOnBoot.js
//=============================================================================
/*:
* Why did they take this feature out of RMMV? This, along with the built-in
* script editor where you could see all the default scripts was one of the
* most dev-friendly features they had for scripters. Now you have to press
* F8 to manually bring it up.

* @plugindesc Shows the developer console on boot.
*
* @param Console Width
* @desc The width of the developer console. Default = 800.
* @default 800
*
* @param Console Height
* @desc The height of the developer console. Default = 300.
* @default 300
*
* @param Console X-Position
* @desc The x-coordinate where the console appears. Default = 0.
* @default 0
*
* @param Console Y-Position
* @desc The y-coordinate where the console appears. Default = 0.
* @default 0
*
* @param Game Window X-Offset
* @desc Sideways position from the center where the game window is shifted. Default = 150.
* @default 150
*
* @param Game Window Y-Offset
* @desc Vertical position from the center where the game window is shifted. Default = 0.
* @default 0
*
* @param Autofocus
* @desc Will bring the game window in front of the console if set to "true".
* @default true
*
* @ No other settings required.
*/

(function() {
    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin+1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);

    var devtool_width = Number(parameters['Console Width'] || 800);
    var devtool_height = Number(parameters['Console Height'] || 300);
    var devtool_x = Number(parameters['Console X-Position'] || 0);
    var devtool_y = Number(parameters['Console Y-Position'] || 0);
    var win_x_offset = Number(parameters['Game Window X-Offset'] || 150);
    var win_y_offset = Number(parameters['Game Window Y-Offset'] || 0);
    var autofocus = String(parameters['Autofocus']);
    
    var _Scene_Boot_new_initialize_showconsole_24102015 = Scene_Boot.prototype.initialize;    
    Scene_Boot.prototype.initialize = function() {
        _Scene_Boot_new_initialize_showconsole_24102015.call(this);
        if (Utils.isNwjs() && Utils.isOptionValid('test')) {
            require('nw.gui').Window.get().showDevTools().resizeTo(devtool_width,devtool_height);
            require('nw.gui').Window.get().showDevTools().moveTo(devtool_x,devtool_y);
            require('nw.gui').Window.get().moveBy(win_x_offset,win_y_offset);
            if (autofocus === 'true') {
                require('nw.gui').Window.get().focus();
            };
        };
    };
    
}) ();
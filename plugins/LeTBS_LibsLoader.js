var Lecode = Lecode || {};
Lecode.S_TBS = {};

/*-------------------------------------------------------------------------
* PluginManager
-------------------------------------------------------------------------*/
Lecode.S_TBS.oldPluginManager_setup = PluginManager.setup;
PluginManager.setup = function () {
    ["easystar.js", "Tween.js", "async.min.js", "gridLoS.js"].forEach(dep => {
        this.loadLeTBSDependency(dep);
    });
    Lecode.S_TBS.oldPluginManager_setup.call(this);
};

PluginManager.loadLeTBSDependency = function (name) {
    var url = "js/libs" + name;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.async = false;
    script.onerror = this.onError.bind(this);
    script._url = url;
    document.body.appendChild(script);
};
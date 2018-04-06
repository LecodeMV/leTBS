
var oldSceneManagerRenderScene = SceneManager.renderScene;
SceneManager.renderScene = function () {
    oldSceneManagerRenderScene.call(this);
    TWEEN.update();
};

LeUtilities.tweenProperty = function (obj, prop, last, time, opts) {
    opts = opts || {};
    var easing = opts.easing || TWEEN.Easing.Quadratic.Out;
    var data = { value: obj[prop] };
    var tween = new TWEEN.Tween(data)
        .to( {value: last}, time)
        .easing(easing)
        .interpolation(TWEEN.Interpolation.CatmullRom)
        .onUpdate(function (object) {
            obj[prop] = data.value;
            if (opts.onUpdate) opts.onUpdate(object);
        });
    return tween;
};
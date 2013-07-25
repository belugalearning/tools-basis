
require.config({
    paths: {
        'cocos2d': 'cocosLoader',
        'resources': 'src/resource',
        'domReady': '../../tools/common/lib/domReady',
        'underscore': '../../tools/common/lib/underscore',
        'vec2': '../../tools/common/lib/vec2',
        'segseg': '../../tools/common/lib/segseg',
        'polygon': '../../tools/common/lib/polygon',
        'polygonclip': '../../tools/common/lib/polygon.clip',
        'qlayer': '../../host-helpers/shared-qlayer',
        'extensions': '../../tools/common/extensions',
        'bldrawnode': '../../tools/common/BLDrawNode',
        'stackedsprite': '../../tools/common/stacked-sprite',
        'toollayer': '../../tools/common/toollayer',
        'draggable': '../../tools/common/draggable',
        'draggableLayer': '../../tools/common/draggableLayer',

        'geoboardtool': '../../tools/geoboard/main',
        'clocktool': '../../tools/clock/main',
        'longdivisiontool': '../../tools/longdivision/main',
        'sortingtool': '../../tools/sorting/main',
        'shapebuilder': '../../tools/tests/shapebuilder/main',
        'tool_base': '../../tools/tests/tool_base/main',
        'numberbondstool': '../../tools/numberbonds/main'
    },
    shim: {
        'cocos2d': {
            exports: 'cc'
        },
        'resources': {
            exports: 'g_resources'
        },
        'underscore': {
            exports: '_'
        }
    }
});

var reqs = ['domReady', 'underscore', 'cocos2d', 'qlayer', 'resources', 'extensions'];

var url = top.location.href;

if (url.match('geoboard')) {
    reqs.push('geoboardtool');
} else if (url.match('clock')) {
    reqs.push('clocktool');
} else if (url.match('sorting')) {
    reqs.push('sortingtool');
} else if (url.match('shape')) {
    reqs.push('shapebuilder');
} else if (url.match('tool_base')) {
    reqs.push('tool_base');
} else if (url.match('numberbonds')) {
    reqs.push('numberbondstool');
} else {
    reqs.push('longdivisiontool');
}


window.bl = top.$.extend(window.bl, {
    _tool_resources: undefined,
    getResource: function (key, resources) {

        if (_.isUndefined(this._tool_resources)) {
            this._tool_resources = this.getResources(bl.toolTag);
            this._tool_resources = this._tool_resources.concat(this.getResources('images_'));
        }

        resources = _.isUndefined(resources) 
            ? this._tool_resources 
            : this.getResources(resources);

        var rxp = new RegExp(RegExp.quote(key), 'i');
        var exact = _.find(resources, function (x) {
            return x.match(rxp);
        });
        return window.bl.resources[exact];

    },

    getResources: function (key) {

        return _.filter(_.keys(window.bl.resources), function (x) {
            return x.match(key);
        });

    }
}, true);

require(reqs, function(domReady, _, cocos2d, QLayer, resources, extensions, tool) {
    'use strict';

    window.bl.qs = window.bl.getQueryParams(window.top.location.search);

    domReady(function() {

        var d = document;

        if(!d.createElement('canvas').getContext){
            var s = d.createElement('div');
            s.innerHTML = '<h2>Your browser does not support HTML5 canvas!</h2>' +
                '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
                '<a href="http://www.google.com/chrome" target="_blank"><img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
            var p = d.getElementById(document.ccConfig.tag).parentNode;
            p.style.background = 'none';
            p.style.border = 'none';
            p.insertBefore(s);

            d.body.style.background = '#ffffff';
            return;
        }

        if (url.match('debug')) {
            cc.SPRITE_DEBUG_DRAW = 1;
        }

        var Cocos2dApp = cc.Application.extend({
            config:document['ccConfig'],
            ctor:function (scene) {
                this._super();
                this.startScene = scene;
                cc.COCOS2D_DEBUG = this.config['COCOS2D_DEBUG'];
                cc.initDebugSetting();
                cc.setup(this.config['tag']);
                cc.AppController.shareAppController().didFinishLaunchingWithOptions();
            },
            applicationDidFinishLaunching:function () {
                // initialize director
                var director = cc.Director.getInstance();

                cc.EGLView.getInstance().setDesignResolutionSize(window.bl.qs.width || 1024, window.bl.qs.height || 768,cc.RESOLUTION_POLICY.SHOW_ALL);

                // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
                //director.enableRetinaDisplay(true);

                // turn on display FPS
                director.setDisplayStats(this.config['showFPS']);

                // set FPS. the default value is 1.0/60 if you don't call this
                director.setAnimationInterval(1.0 / this.config['frameRate']);

                //load resources
                cc.LoaderScene.preload(g_resources, function () {
                    director.replaceScene(new this.startScene());
                }, this);

                return true;
            }
        });

        window.bl.app = new Cocos2dApp(function () {
            var scene = cc.Scene.create();
            var layer = new tool.ToolLayer();
            if (layer && layer.init(cc.c4b(255, 255, 255, 255))) {
                scene.addChild(layer);

                scene.layer = layer;
                window.bl.toolLayer = layer;

                scene.ql = new QLayer();
                scene.ql.init();
                layer.addChild(scene.ql, 99);

                scene.update = function(dt) {
                    this.layer.update(dt);
                    this.ql.update(dt);
                };
                scene.scheduleUpdate();

                return scene;
            }
            return null;
        });
    });
});

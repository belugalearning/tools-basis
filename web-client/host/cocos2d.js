
require.config({
    paths: {
        'cocos2d': 'cocosloader',
        'resources': 'src/resource',
        'domReady': '../../tools/common/lib/domReady',
        'underscore': '../../tools/common/lib/underscore',
        'qlayer': '../../host-helpers/shared-qlayer',
        'extensions': '../../tools/common/extensions',
        'geoboardtool': '../../tools/geoboard/main',
        'clocktool': '../../tools/clock/main'
    },
    shim: {
        'cocos2d': {
            exports: 'cc'
        },
        'resources': {
            exports: 'g_ressources'
        },
        'underscore': {
            exports: '_'
        }
    }
});

document.ccConfig = {
    COCOS2D_DEBUG:2, //0 to turn debug off, 1 for basic debug, and 2 for full debug
    box2d:false,
    chipmunk:true,
    showFPS:true,
    loadExtension:false,
    frameRate:60,
    tag:'gameCanvas', //the dom element to run cocos2d on
    engineDir:'../cocos2d/',
    appFiles:[]
};

require(['domReady', 'underscore', 'cocos2d', 'qlayer', 'resources', 'extensions', 'geoboardtool'], function(domReady, _, cocos2d, QLayer, resources, extensions, tool) {
    'use strict';

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

                cc.EGLView.getInstance().setDesignResolutionSize(1024,768,cc.RESOLUTION_POLICY.SHOW_ALL);

                // enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
                //director.enableRetinaDisplay(true);

                // turn on display FPS
                director.setDisplayStats(this.config['showFPS']);

                // set FPS. the default value is 1.0/60 if you don't call this
                director.setAnimationInterval(1.0 / this.config['frameRate']);

                //load resources
                cc.LoaderScene.preload(g_ressources, function () {
                    director.replaceScene(new this.startScene());
                }, this);

                return true;
            }
        });

        window.bl = window.bl || {};
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

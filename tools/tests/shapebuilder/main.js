require.config({
    paths: {
    }
});

define(['exports', 'cocos2d', 'qlayer', 'bldrawnode', 'polygonclip', 'toollayer', 'stackedsprite'], function (exports, cc, QLayer, BLDrawNode, Polygon, ToolLayer, StackedSprite) {
    'use strict';


    window.toolTag = 'shapebuilder';
    var Tool = ToolLayer.extend({

        _windowSize: undefined,
        _background: undefined,
        _backgroundLayer: undefined,

        init: function () {
            var self = this;

            this._super();

            this.setTouchEnabled(true);

            this._windowSize = cc.Director.getInstance().getWinSize();

            cc.Director.getInstance().setDisplayStats(false);

            var color = cc.c4b(255,255,255,255);
            var l = new cc.LayerColor();
            l.init(color, this._windowSize.width, this._windowSize.height);

            this.addChild(l)

            this.setQuestion(
              window.bl.contentService.question({
                tool:'sorting',
                toolMode:'table',
                setCategory:'shape',
                numSets:2
              })
            )
            return this;
        },

        setBackground: function (resource) {
            if (_.isUndefined(this._background)) {
                this._backgroundLayer = cc.Layer.create();
                this.addChild(this._backgroundLayer, BACKGROUND_Z);
                this._background = new cc.Sprite();
            }
            this._background.initWithFile(resource);
            this._background.setPosition(this._windowSize.width/2, this._windowSize.height/2);
            this._backgroundLayer.addChild(this._background);
        },


        getState: function () {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },


        _totalLabels: [],
        _subTotalLabels: [],
        setQuestion: function (question) {
            var self = this;

            this._super(question);

            // add draggables
            var shapes = ['dart', 'irregular_polygon', 'short_isosceles_triangle', 'equilateral_triangle', 'isosceles_triangle', 'kite', 'parallelogram', 'rectangle', 'decagon', 'dodecagon', 'hendecagon', 'heptagon', 'hexagon', 'nonagon', 'octagon', 'pentagon', 'right_angle_triangle', 'scalene_triangle', 'square', 'trapezium']
            _.each(shapes, function (shape, i) {
                _.times(10, function (j) {

                    var layers = [
                      {
                        shape: shape,
                        color: { r: 1, g: 1, b: 1, a: 255 },
                        width: 100,
                        height: 100,
                        position: { x: 0, y: 0 }
                      }
                    ];

                    var sprite = new StackedSprite();
                    sprite.setup({ layers: layers });
                    sprite.setPosition({x:100 + (i * 100), y:100 + (j * 100)});
                    var dbg = new cc.DrawNode();
                    dbg.drawPoly(bl.PolyRectMake(10,15,60,60), cc.c4f(0,0,0,0), 1, cc.c4f(0,1,0,1))
                    sprite.addChild(dbg);
                    self.addChild(sprite);
                })
                i++;
            });

        }
    });

    ToolLayer.create = function () {

        var sg = new ToolLayer();
        if (sg && sg.init(cc.c4b(255, 255, 255, 255))) {
            return sg;
        }
        return null;
    };

    ToolLayer.scene = function () {
        var scene = cc.Scene.create();
        var layer = ToolLayer.create();
        scene.addChild(layer);

        scene.layer=layer;

        scene.ql = new QLayer();
        scene.ql.init();
        layer.addChild(scene.ql, 99);

        scene.update = function(dt) {
            this.layer.update(dt);
            this.ql.update(dt);
        };
        scene.scheduleUpdate();


        return scene;
    };

    exports.ToolLayer = Tool;

});

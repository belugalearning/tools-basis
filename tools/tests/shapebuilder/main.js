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

            this.setQuestion({
                'type': 'vector'
            })
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

                    var sprite_width = 100;
                    var sprite_height = 100;
                    var shape_width = 40;
                    var shape_height = 40;

                    var layers = [
                      {
                        color: { r: 1, g: 1, b: 1, a: 25 },
                        width: sprite_width,
                        height: sprite_height,
                        position: { x: 0, y: 0 }
                      },
                      {
                        shape: shape,
                        color: { r: 1, g: 1, b: 1, a: 255 },
                        width: shape_width,
                        height: shape_height,
                        position: { x: (sprite_width - shape_width) / 2, y: (sprite_height - shape_height) / 2 },
                        rotation: (Math.PI * 2) * Math.random()
                      }
                    ];

                    var sprite = new StackedSprite();
                    sprite.setup({ layers: layers });
                    sprite.setPosition({x:sprite_width + (i * sprite_width), y:sprite_height + (j * sprite_height)});
                    var dbg = new cc.DrawNode();
                    dbg.drawPoly(bl.PolyRectMake(0,0,sprite_width,sprite_height), cc.c4f(0,0,0,0), 1, cc.c4f(0,1,0,1))
                    dbg.drawPoly(bl.PolyRectMake((sprite_width - shape_width) / 2,(sprite_height - shape_height) / 2,shape_width,shape_height), cc.c4f(0,0,0,0), 0.5, cc.c4f(1,0,0,1))
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

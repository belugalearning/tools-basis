define(['exports', 'underscore', 'cocos2d'], function(exports, _, cc) {
    'use strict';

    var WIDTH = 10;
    var HEIGHT = 10;

    var SPRITE_WIDTH = 100;
    var SPRITE_HEIGHT = 100;

    window.bl = window.bl || {};


    var drawing = {};

    drawing.trapezium = function() {

        var square = drawing.regularShape(4);

        var min_x = _.min(square, function (p) { return p.x; }).x;
        var max_x = _.max(square, function (p) { return p.x; }).x;

        var range = (max_x - min_x);
        var sign = Math.random() >= 0.5 ? 1 : -1;
        var offset = ((Math.random() * range - (range * 0.3)) + (range * 0.5)) * sign;

        var side = Math.random() >= 0.5 ? 'x' : 'y';

        var trapezium = _.map(square, function (point, i) {
            if (side == 'x' && i < 2 ||
                side == 'y' && i >= 1 && i < 3) {
                point[side] = point[side] + (offset / (i + 1));
            }
            return point;
        });

        return trapezium;
    };

    drawing.dart = function() {

        var scene_width = 1;
        var scene_height = 1;

        var a = Math.floor(Math.random() * (scene_height * 0.3)) + (scene_height * 0.3);
        var theta = Math.PI * (Math.floor(Math.random() * 20) + 15) / 180;
        var b = a * Math.cos(theta);
        var c = a * Math.sin(theta);
        var d = (Math.floor(Math.random() * c) + 2 * c);

        var points = [
            cc.p(0,0),
            cc.p((0 + b), (0 - c)),
            cc.p(0, (0 + d)),
            cc.p((0 - b), (0 - c)),
            cc.p(0,0)
        ];

        return points;
    };

    drawing.polygon = function() {

        var scene_width = 1;
        var scene_height = 1;

        var i = 6;
        var theta = (2 * Math.PI) / i;

        var points = [
            cc.p(scene_width / 2, 0),

        ];
        for (var n = 0; n < i; n++) {
            points.push(cc.p(scene_width / 3 * (Math.random() + 0.5) * Math.cos(n * theta), scene_width / 3 * (Math.random() + 0.5) * Math.sin(n * theta)));
        }
        points.push(cc.p(scene_width / 2, 0));

        return points;
    };

    drawing.isoceles = function() {

        var triangle = drawing.regularShape(3);

        var min_y = _.min(triangle, function (p) { return p.y; }).y;
        var max_y = _.max(triangle, function (p) { return p.y; }).y;

        var range = (max_y - min_y);
        var scale_height = (_.random(0.3, 0.7) * range);
        var sign = Math.random() >= 0.5 ? 1 : 0;
        triangle[0].y = triangle[0].y + (scale_height * sign);

        return triangle;
    };

    drawing.kite = function() {

        var triangle = drawing.isoceles();

        var min_y = _.min(triangle, function (p) { return p.y; }).y;
        var max_y = _.max(triangle, function (p) { return p.y; }).y;

        var range = (max_y - min_y);
        var p = cc.p(triangle[0].x, triangle[0].y - (range * _.random(1.3, 1.7)));
        triangle.splice(2,0,p);

        return triangle;
    };

    drawing.parallelogram = function(rotation) {

        var square = drawing.regularShape(4);

        var offset = _.random(0.2, 0.7);

        var parallelogram = _.map(square, function (p, i) {
            if (i < 2) {
                p.x += offset;
            }
            return p;
        });

        return parallelogram;
    };

    drawing.rectangle = function() {

        var square = drawing.regularShape(4);

        var offset = _.random(0.3, 0.4);

        var parallelogram = _.map(square, function (p, i) {
            if (i == 1 || i == 2) {
                p.x += offset;
            }
            return p;
        });

        return parallelogram;
    };

    drawing.rightAngleTriangle = function() {

        var square = drawing.regularShape(4);
        square.splice(2, 1);

        return square;
    };

    drawing.scaleneTriangle = function() {

        var triangle = drawing.rightAngleTriangle();

        triangle[0].x += _.random(1, 1.6);
        triangle[1].y += _.random(0.8, 1.2);

        return triangle;
    };

    /*
     * Draws a regular vector shape on a scale of 0,0 -> 1,1 orientated around 0.5,0.5 with n sides
     */
    drawing.regularShape = function (sides) {

        var scene_width = 1;
        var scene_height = 1;
        var scene_center = cc.p(scene_width / 2, scene_height / 2);

        var shape_sides = sides;
        var shape_max_side = 1;
        var shape_theta = ((2 * Math.PI) / shape_sides);
        var shape_offset = (shape_theta - (Math.PI / 2)) + (Math.PI / shape_sides);

        var points = [];

        for (var i = 0; i < shape_sides; i++) {
            points.push(
                cc.p(
                    shape_max_side * Math.cos((i * shape_theta) + shape_offset),
                    shape_max_side * Math.sin((i * shape_theta) + shape_offset)
                )
            );
        }
        
        return drawing.centerVector(points);

    };

    drawing.getVectorBounds = function (position, poly) {
        var max_x = _.max(poly, function (p) { return p.x; }).x;
        var min_x = _.min(poly, function (p) { return p.x; }).x;
        var max_y = _.max(poly, function (p) { return p.y; }).y;
        var min_y = _.min(poly, function (p) { return p.y; }).y;
        return cc.SizeMake(max_x - min_x, max_y - min_y);
    };

    drawing.convertVectorToPx = function (points, width, height) {
        return _.map(points, function (p) {
            return cc.p(p.x * width, p.y * height);
        });
    };

    drawing.centerVector = function (vector) {
        var min_x = _.min(vector, function (p) { return p.x; }).x;
        var min_y = _.min(vector, function (p) { return p.y; }).y;
        vector = _.map(vector, function (p) {
            return cc.p(p.x + (min_x * -1), p.y + (min_y * -1));
        });
        return vector;
    };

    drawing.rotateVector = function (vector, angle, center) {
        if (angle === 0) return vector;
        center = center || cc.p(0, 0);
        var cosAngle = Math.cos(angle);
        var sinAngle = Math.sin(angle);
        return _.map(vector, function (p) {
            return cc.p(
                center.x + ((p.x - center.x) * cosAngle - (p.y - center.y) * sinAngle),
                center.y + ((p.x - center.x) * sinAngle + (p.y - center.y) * cosAngle)
            );
        });
    };

    drawing.scaleToFit = function(vector, width, height) {
        var size = drawing.getVectorBounds(cc.p(0,0), vector);

        var multiplier = Math.min(width, height) / Math.max(size.width, size.height);
        
        vector = _.map(vector, function (p) {
            return cc.p(p.x * multiplier, p.y * multiplier);
        });

        return vector;
    };

    bl.DRAWNODE_TYPE_CIRCLE = 'circle';
    bl.DRAWNODE_TYPE_DART = 'dart';
    bl.DRAWNODE_TYPE_IRREGULAR_POLYGON = 'irregular_polygon';
    bl.DRAWNODE_TYPE_ISOSCELES = 'isosceles_triangle';
    bl.DRAWNODE_TYPE_EQUILATERAL = 'equilateral_triangle';
    bl.DRAWNODE_TYPE_TALL_ISOSCELES = 'isosceles_triangle';
    bl.DRAWNODE_TYPE_KITE = 'kite';
    bl.DRAWNODE_TYPE_PARALLELOGRAM = 'parallelogram';
    bl.DRAWNODE_TYPE_RECTANGLE = 'rectangle';
    bl.DRAWNODE_TYPE_DECAGON = 'decagon';
    bl.DRAWNODE_TYPE_DODECAGON = 'dodecagon';
    bl.DRAWNODE_TYPE_HENDECAGON = 'hendecagon';
    bl.DRAWNODE_TYPE_HEPTAGON = 'heptagon';
    bl.DRAWNODE_TYPE_HEXAGON = 'hexagon';
    bl.DRAWNODE_TYPE_NONAGON = 'nonagon';
    bl.DRAWNODE_TYPE_OCTAGON = 'octagon';
    bl.DRAWNODE_TYPE_PENTAGON = 'pentagon';
    bl.DRAWNODE_TYPE_RIGHT_ANGLE_TRIANGLE = 'right_angle_triangle';
    bl.DRAWNODE_TYPE_SCALENE = 'scalene_triangle';
    bl.DRAWNODE_TYPE_SQUARE = 'square';
    bl.DRAWNODE_TYPE_TRAPEZIUM = 'trapezium';

    var BLDrawNode = cc.DrawNodeCanvas.extend({

        ctor: function(sprite_width, sprite_height, width, height) {
            this._sprite_width = sprite_width || SPRITE_WIDTH;
            this._sprite_height = sprite_height || SPRITE_HEIGHT;
            this._width = width || WIDTH;
            this._height = height || HEIGHT;

            this._min_sprite_dimension = Math.min(this._sprite_width, this._sprite_height);
            this._min_dimension = Math.min(this._width, this._height);

            this._super();
        },


        drawShape: function(type, rotation, fillColor, borderWidth, borderColor) {
            var shape;

            if (type === bl.DRAWNODE_TYPE_EQUILATERAL) {
                shape = drawing.regularShape(3);
            } else if (type === bl.DRAWNODE_TYPE_SQUARE) {
                shape = drawing.regularShape(4);
            } else if (type === bl.DRAWNODE_TYPE_PENTAGON) {
                shape = drawing.regularShape(5);
            } else if (type === bl.DRAWNODE_TYPE_HEXAGON) {
                shape = drawing.regularShape(6);
            } else if (type === bl.DRAWNODE_TYPE_HEPTAGON) {
                shape = drawing.regularShape(7);
            } else if (type === bl.DRAWNODE_TYPE_OCTAGON) {
                shape = drawing.regularShape(8);
            } else if (type === bl.DRAWNODE_TYPE_NONAGON) {
                shape = drawing.regularShape(9);
            } else if (type === bl.DRAWNODE_TYPE_DECAGON) {
                shape = drawing.regularShape(10);
            } else if (type === bl.DRAWNODE_TYPE_HENDECAGON) {
                shape = drawing.regularShape(11);
            } else if (type === bl.DRAWNODE_TYPE_DODECAGON) {
                shape = drawing.regularShape(12);
            } else if (type === bl.DRAWNODE_TYPE_TRAPEZIUM) {
                shape = drawing.trapezium();
            } else if (type === bl.DRAWNODE_TYPE_DART) {
                shape = drawing.dart();
            } else if (type === bl.DRAWNODE_TYPE_IRREGULAR_POLYGON) {
                shape = drawing.polygon();
            } else if (type === bl.DRAWNODE_TYPE_ISOSCELES) {
                shape = drawing.isoceles();
            } else if (type === bl.DRAWNODE_TYPE_KITE) {
                shape = drawing.kite();
            } else if (type === bl.DRAWNODE_TYPE_PARALLELOGRAM) {
                shape = drawing.parallelogram();
            } else if (type === bl.DRAWNODE_TYPE_RECTANGLE) {
                shape = drawing.rectangle();
            } else if (type === bl.DRAWNODE_TYPE_RIGHT_ANGLE_TRIANGLE) {
                shape = drawing.rightAngleTriangle();
            } else if (type === bl.DRAWNODE_TYPE_SCALENE) {
                shape = drawing.scaleneTriangle();
            }

            shape = drawing.rotateVector(shape, rotation);
            shape = drawing.centerVector(shape);
            shape = drawing.scaleToFit(shape, this._width, this._height);
            this.drawPoly(shape, fillColor, borderWidth, borderColor);

        }

    });

    return BLDrawNode;

});
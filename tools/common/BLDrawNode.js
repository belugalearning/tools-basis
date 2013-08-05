define(['exports', 'underscore', 'cocos2d'], function(exports, _, cc) {
    'use strict';

    var WIDTH = 10;
    var HEIGHT = 10;

    var SPRITE_WIDTH = 100;
    var SPRITE_HEIGHT = 100;

    window.bl = window.bl || {};


    var drawing = {};
    /*
     * Draws a regular shape of n sides.
     */
    drawing.scaleToFit = function(vector, width, height) {
        var size = drawing.getVectorBounds(cc.p(0,0), vector);

        var multiplier = Math.min(width, height) / Math.max(size.width, size.height);
        
        vector = _.map(vector, function (p) {
            return cc.p(p.x * multiplier, p.y * multiplier);
        });

        return vector;
    };

    drawing.trapezium = function(rotation) {

        var square = drawing.regularShape(4, rotation);

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

        trapezium = drawing.centerVector(trapezium);

        return trapezium;
    };

    drawing.dart = function(rotation) {

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

        points = drawing.rotateVector(points, rotation, cc.p(0.5,0.5));
        points = drawing.centerVector(points);


        return points;
    };

    drawing.polygon = function(rotation) {

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

        points = drawing.rotateVector(points, rotation, cc.p(0.5,0.5));
        points = drawing.centerVector(points);

        return points;
    };

    drawing.isoceles = function(rotation) {

        var triangle = drawing.regularShape(3, 0);

        var min_y = _.min(triangle, function (p) { return p.y; }).y;
        var max_y = _.max(triangle, function (p) { return p.y; }).y;

        var range = (max_y - min_y);
        var scale_height = (_.random(0.3, 0.7) * range);
        var sign = Math.random() >= 0.5 ? 1 : 0;
        triangle[0].y = triangle[0].y + (scale_height * sign);

        triangle = drawing.rotateVector(triangle, rotation);
        triangle = drawing.centerVector(triangle);

        return triangle;
    };

    drawing.kite = function(rotation) {

        var triangle = drawing.isoceles(0);

        var min_y = _.min(triangle, function (p) { return p.y; }).y;
        var max_y = _.max(triangle, function (p) { return p.y; }).y;


        var range = (max_y - min_y);
        var p = cc.p(triangle[0].x, triangle[0].y - (range * _.random(1.3, 1.9)));
        triangle.splice(2,0,p);
        triangle = drawing.rotateVector(triangle, rotation);
        triangle = drawing.centerVector(triangle);


        return triangle;
    };

    /*
     * Draws a regular vector shape on a scale of 0,0 -> 1,1 orientated around 0.5,0.5 with n sides
     */
    drawing.regularShape = function (sides, rotation) {

        rotation = rotation || 0;

        var scene_width = 1;
        var scene_height = 1;
        var scene_center = cc.p(scene_width / 2, scene_height / 2);

        var shape_sides = sides;
        var shape_max_side = 1;
        var shape_theta = ((2 * Math.PI) / shape_sides);
        var shape_offset = (shape_theta - (Math.PI / 2)) + (Math.PI / shape_sides) + rotation;

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

        draw: function(ctx) {
            this._super(ctx);
            var self = this;

            var context = ctx || cc.renderContext;

            _.each(this._buffer, function(element) {
                context.fillStyle = "rgba(" + (0 | (element.fillColor.r * 255)) + "," + (0 | (element.fillColor.g * 255)) + "," + (0 | (element.fillColor.b * 255)) + "," + element.fillColor.a + ")";
                context.lineWidth = element.borderWidth * 2;
                context.lineCap = "round";
                context.strokeStyle = "rgba(" + (0 | (element.borderColor.r * 255)) + "," + (0 | (element.borderColor.g * 255)) + "," + (0 | (element.borderColor.b * 255)) + "," + element.borderColor.a + ")";

                if (element.type === bl.DRAWNODE_TYPE_CIRCLE) {

                    cc.drawingUtil.drawCircle(element.position, element.radius, element.angle, element.segments, element.drawLineToCenter, element.fillColor, element.borderWidth, element.borderColor);

                } else if (element.type === bl.DRAWNODE_TYPE_TRAPEZIUM) {

                    context.translate((self._width - (element.x + element.a + element.x2)) / 2, (self._height - element.y) / 2);
                    context.beginPath();
                    context.moveTo(element.x, 0);
                    context.lineTo((element.x + element.a), 0);
                    context.lineTo((element.x + element.a + element.x2), element.y);
                    context.lineTo(0, element.y);
                    context.lineTo(element.x, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_SQUARE) {

                    context.translate((self._width - element.x) / 2, (self._height - element.x) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, element.x);
                    context.lineTo(element.x, element.x);
                    context.lineTo(element.x, 0);
                    context.lineTo(0, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_SCALENE) {

                    context.translate((self._width - (element.b + element.a * Math.cos(element.theta))) / 2, (self._height + element.a * Math.sin(element.theta)) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo((0 + element.b), 0);
                    context.lineTo((0 + element.a * Math.cos(element.theta)), (0 - element.a * Math.sin(element.theta)));
                    context.lineTo(0, 0);


                } else if (element.type === bl.DRAWNODE_TYPE_RIGHT_ANGLE_TRIANGLE) {

                    context.translate((self._width - element.b) / 2, (self._height - element.a) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, element.a);
                    context.lineTo(element.b, 0);
                    context.lineTo(0, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_EQUILATERAL) {

                    var h = element.side * (Math.sqrt(3) / 2);

                    context.beginPath();
                    context.translate(self._width / 2, self._height / 2);
                    context.moveTo(0, -h / 2);
                    context.lineTo(-element.side / 2, h / 2);
                    context.lineTo(element.side / 2, h / 2);
                    context.lineTo(0, -h / 2);

                } else if (
                    element.type === bl.DRAWNODE_TYPE_PENTAGON ||
                    element.type === bl.DRAWNODE_TYPE_HEXAGON ||
                    element.type === bl.DRAWNODE_TYPE_HEPTAGON ||
                    element.type === bl.DRAWNODE_TYPE_OCTAGON ||
                    element.type === bl.DRAWNODE_TYPE_NONAGON ||
                    element.type === bl.DRAWNODE_TYPE_DECAGON ||
                    element.type === bl.DRAWNODE_TYPE_HENDECAGON ||
                    element.type === bl.DRAWNODE_TYPE_DODECAGON) {

                    context.translate((self._width) / 2, (self._height) / 2);
                    context.beginPath();
                    context.moveTo(element.side, 0);
                    for (var i = 0; i < element.sides; i++) {
                        context.lineTo(element.side * Math.cos(i * element.theta), element.side * Math.sin(i * element.theta));
                    }

                } else if (element.type === bl.DRAWNODE_TYPE_RECTANGLE) {

                    context.translate((self._width - element.b) / 2, (self._height - element.a) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, element.a);
                    context.lineTo(element.b, element.a);
                    context.lineTo(element.b, 0);
                    context.lineTo(0, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_PARALLELOGRAM) {

                    context.translate((self._width - element.a - (2 * element.x)) / 2, (self._height - element.y) / 2);
                    context.beginPath();
                    context.moveTo(element.x, 0);
                    context.lineTo(((2 * element.x) + element.a), 0);
                    context.lineTo((element.x + element.a), element.y);
                    context.lineTo(0, element.y);
                    context.lineTo(element.x, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_KITE) {

                    context.translate((self._width - (2 * element.c)) / 2, (self._height - element.a - element.b) / 2);
                    context.beginPath();
                    context.moveTo(0, element.b);
                    context.lineTo(element.c, (element.a + element.b));
                    context.lineTo((2 * element.c), element.b);
                    context.lineTo(element.c, 0);
                    context.lineTo(0, element.b);

                } else if (element.type === bl.DRAWNODE_TYPE_TALL_ISOSCELES) {
                    context.translate(self._width / 2, ((self._height - element.a) / 2));
                    context.beginPath();
                    context.moveTo((-self._sprite_width/ 5), (element.a + 10));
                    context.lineTo(0, 0);
                    context.lineTo((self._sprite_width / 5), (element.a + 10));
                    context.lineTo((-self._sprite_width / 5), (element.a + 10));

                } else if (element.type === bl.DRAWNODE_TYPE_SHORT_ISOSCELES) {

                    context.translate(self._width / 2, ((self._height - element.a) / 2));
                    context.beginPath();
                    context.moveTo((self._width / 2), (element.a));
                    context.lineTo(0, 0);
                    context.lineTo((-self._width / 2), (element.a));
                    context.lineTo((self._width / 2), (element.a));
                    context.stroke();

                } else if (element.type === bl.DRAWNODE_TYPE_IRREGULAR_POLYGON) {

                    var i = 6
                    var theta = (2 * Math.PI) / i;
                    context.translate((self._sprite_width * 0.5) - ((self._sprite_width - self._width) * 0.5), (self._sprite_height * 0.5) - ((self._sprite_height - self._height) * 0.5));
                    context.beginPath();
                    context.moveTo(self._width / 2, 0);
                    for (var n = 0; n < i; n++) {
                        context.lineTo(self._width / 3 * (element.seeds[i] + 0.5) * Math.cos(n * theta), self._width / 3 * (element.seeds[i + 1] + 0.5) * Math.sin(n * theta));
                    }
                    context.lineTo(self._width / 2, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_DART) {

                    context.translate(self._width / 2, (self._height + element.c - element.d) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo((0 + element.b), (0 - element.c));
                    context.lineTo(0, (0 + element.d));
                    context.lineTo((0 - element.b), (0 - element.c));
                    context.lineTo(0, 0);

                }
                context.fill();
                context.stroke();
                context.closePath();
            });
        },

        drawShape: function(type, rotation, fillColor, borderWidth, borderColor) {
            console.log(type);
            var shape;
            if (type === bl.DRAWNODE_TYPE_EQUILATERAL) {
                shape = drawing.regularShape(3, rotation);
            } else if (type === bl.DRAWNODE_TYPE_SQUARE) {
                shape = drawing.regularShape(4, rotation);
            } else if (type === bl.DRAWNODE_TYPE_PENTAGON) {
                shape = drawing.regularShape(5, rotation);
            } else if (type === bl.DRAWNODE_TYPE_HEXAGON) {
                shape = drawing.regularShape(6, rotation);
            } else if (type === bl.DRAWNODE_TYPE_HEPTAGON) {
                shape = drawing.regularShape(7, rotation);
            } else if (type === bl.DRAWNODE_TYPE_OCTAGON) {
                shape = drawing.regularShape(8, rotation);
            } else if (type === bl.DRAWNODE_TYPE_NONAGON) {
                shape = drawing.regularShape(9, rotation);
            } else if (type === bl.DRAWNODE_TYPE_DECAGON) {
                shape = drawing.regularShape(10, rotation);
            } else if (type === bl.DRAWNODE_TYPE_HENDECAGON) {
                shape = drawing.regularShape(11, rotation);
            } else if (type === bl.DRAWNODE_TYPE_DODECAGON) {
                shape = drawing.regularShape(12, rotation);
            } else if (type === bl.DRAWNODE_TYPE_TRAPEZIUM) {
                shape = drawing.trapezium(rotation);
            } else if (type === bl.DRAWNODE_TYPE_DART) {
                shape = drawing.dart(rotation);
            } else if (type === bl.DRAWNODE_TYPE_IRREGULAR_POLYGON) {
                shape = drawing.polygon(rotation);
            } else if (type === bl.DRAWNODE_TYPE_ISOSCELES) {
                shape = drawing.isoceles(rotation);
            } else if (type === bl.DRAWNODE_TYPE_KITE) {
                shape = drawing.kite(rotation);
            }

            if (!_.isUndefined(shape)) {
                shape = drawing.scaleToFit(shape, this._width, this._height);
                this.drawPoly(shape, fillColor, borderWidth, borderColor);
            } else {
                this._drawShape(type, fillColor, borderWidth, borderColor);
            }

        },

        _drawShape: function(shape, fillColor, borderWidth, borderColor) {
            var self = this;
            var element = new cc._DrawNodeElement(shape);
            element.fillColor = fillColor;
            element.borderWidth = borderWidth;
            element.borderColor = borderColor;

            if (element.type === bl.DRAWNODE_TYPE_TRAPEZIUM) {

                element.x = Math.floor(Math.random() * this._width * 0.4);
                element.x2 = Math.floor(Math.random() * this._width * 0.2) + 5;
                element.a = Math.floor(Math.random() * this._width * 0.25) + 15;
                element.y = Math.floor(Math.random() * this._width * 0.4) + 30;

            } else if (element.type === bl.DRAWNODE_TYPE_SQUARE) {

                element.x = Math.floor(Math.random() * (this._width - 20)) + 20;

            } else if (element.type === bl.DRAWNODE_TYPE_SCALENE) {

                element.a = Math.floor(Math.random() * 10) + 25;
                element.b = Math.floor(Math.random() * 10) + (1.2 * element.a);
                element.theta = Math.PI * (Math.floor(Math.random() * 60) + 100) / 180;

            } else if (element.type === bl.DRAWNODE_TYPE_RIGHT_ANGLE_TRIANGLE) {

                element.a = Math.floor(Math.random() * (this._width - 15)) + 15;
                element.b = Math.floor(Math.random() * (self._height - 15)) + 15;

            } else if (element.type === bl.DRAWNODE_TYPE_IRREGULAR_POLYGON) {

                element.rand = ((this._width * 0.6 / 3) - 10) * Math.random() + 10;
                element.seeds = [];
                _.times(20, function() {
                    element.seeds.push(Math.random());
                })

            } else if (element.type === bl.DRAWNODE_TYPE_EQUILATERAL) {

                element.side = Math.random() * (self._min_dimension - 30) + 30;

            } else if (element.type === bl.DRAWNODE_TYPE_PENTAGON) {

                element.sides = 5;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_HEXAGON) {

                element.sides = 6;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_HEPTAGON) {

                element.sides = 7;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_OCTAGON) {

                element.sides = 8;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_NONAGON) {

                element.sides = 9;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_DECAGON) {

                element.sides = 10;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_HENDECAGON) {

                element.sides = 11;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_DODECAGON) {

                element.sides = 12;
                element.side = Math.random() * (self._min_dimension / 3 - 30) + 30;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_RECTANGLE) {

                element.b = Math.floor(Math.random() * this._width * 0.4) + this._width * 0.6;
                element.a = Math.floor(Math.random() * self._sprite_height * 0.25) + self._sprite_height * 0.3;

            } else if (element.type === bl.DRAWNODE_TYPE_PARALLELOGRAM) {

                element.x = Math.floor(Math.random() * 5) + 5;
                element.a = Math.floor(Math.random() * 30) + 10;
                element.y = Math.floor(Math.random() * 20) + 40;

            } else if (element.type === bl.DRAWNODE_TYPE_KITE) {

                element.a = Math.floor(Math.random() * (self._width * 0.3 - 5)) + 5;
                element.b = Math.floor(Math.random() * (self._height * 0.7 - 30)) + 30;
                element.c = Math.floor(Math.random() * ((this._width / 2) - 10)) + 10;

            } else if (element.type === bl.DRAWNODE_TYPE_TALL_ISOSCELES) {

                element.a = Math.floor(Math.random() * (self._height / 2)) + (self._height / 2);
                element.seed = 30 * Math.random();

            } else if (element.type === bl.DRAWNODE_TYPE_SHORT_ISOSCELES) {

                element.a = Math.floor(Math.random() * (self._height / 3)) + 10;

            } else if (element.type === bl.DRAWNODE_TYPE_DART) {

                element.a = Math.floor(Math.random() * (self._height * 0.3)) + (self._height * 0.3);
                element.theta = Math.PI * (Math.floor(Math.random() * 20) + 15) / 180;
                element.b = element.a * Math.cos(element.theta);
                element.c = element.a * Math.sin(element.theta);
                element.d = (Math.floor(Math.random() * element.c) + 2 * element.c);

            }

            this._buffer.push(element);
        },

        /**
         * draws a circle given the center, radius and number of segments.
         * @param {cc.Point} center center of circle
         * @param {Number} radius
         * @param {Number} angle angle in radians
         * @param {Number} segments
         * @param {Boolean} drawLineToCenter
         */
        drawCircle: function(pos, radius, angle, segments, drawLineToCenter, fillColor, borderWidth, borderColor) {
            var element = new cc._DrawNodeElement(bl.DRAWNODE_TYPE_CIRCLE);
            element.position = pos;
            element.radius = radius;
            element.angle = angle;
            element.segments = segments;
            element.drawLineToCenter = drawLineToCenter;
            element.fillColor = fillColor;
            element.borderWidth = borderWidth;
            element.borderColor = borderColor;
            this._buffer.push(element);
            this.setContentSize(cc.SizeMake(radius * 2, radius * 2));
        }

    });

    return BLDrawNode;

});
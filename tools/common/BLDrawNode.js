define(['exports', 'underscore', 'cocos2d'], function(exports, _, cc) {
    'use strict';

    var WIDTH = 60;
    var HEIGHT = 60;

    var SPRITE_WIDTH = 100;
    var SPRITE_HEIGHT = 100;

    window.bl = window.bl || {};
    bl.DRAWNODE_TYPE_CIRCLE = 'circle';
    bl.DRAWNODE_TYPE_DART = 'dart';
    bl.DRAWNODE_TYPE_IRREGULAR_POLYGON = 'irregular_polygon';
    bl.DRAWNODE_TYPE_SHORT_ISOSCELES = 'short_isosceles_triangle';
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

        ctor: function (width, height, sprite_width, sprite_height) {
            this._width = width || WIDTH;
            this._height = height || HEIGHT;
            this._sprite_height = sprite_height || SPRITE_HEIGHT;
            this._sprite_width = sprite_width || SPRITE_WIDTH;

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

                    context.translate((self._sprite_width - (element.x + element.a + element.x2)) / 2, (self._sprite_height - element.y) / 2);
                    context.beginPath();
                    context.moveTo(element.x, 0);
                    context.lineTo((element.x + element.a), 0);
                    context.lineTo((element.x + element.a + element.x2), element.y);
                    context.lineTo(0, element.y);
                    context.lineTo(element.x, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_SQUARE) {

                    context.translate((self._sprite_width - element.x) / 2, (self._sprite_height - element.x) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, element.x);
                    context.lineTo(element.x, element.x);
                    context.lineTo(element.x, 0);
                    context.lineTo(0, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_SCALENE) {

                    context.translate((self._sprite_width - (element.b + element.a * Math.cos(element.theta))) / 2, (self._sprite_height + element.a * Math.sin(element.theta)) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo((0 + element.b), 0);
                    context.lineTo((0 + element.a * Math.cos(element.theta)), (0 - element.a * Math.sin(element.theta)));
                    context.lineTo(0, 0);


                } else if (element.type === bl.DRAWNODE_TYPE_RIGHT_ANGLE_TRIANGLE) {

                    context.translate((self._sprite_width - element.b) / 2, (self._sprite_height - element.a) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, element.a);
                    context.lineTo(element.b, 0);
                    context.lineTo(0, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_EQUILATERAL) {

                    var h = element.side * (Math.sqrt(3) / 2);

                    context.beginPath();
                    context.translate(self._sprite_width / 2, self._sprite_height / 2);
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

                    context.translate((self._sprite_width) / 2, (self._sprite_height) / 2);
                    context.beginPath();
                    context.moveTo(self._width / 2, 0);
                    for (var i = 0; i < element.sides; i++) {
                        context.lineTo(self._width / 2 * Math.cos(i * element.theta), self._width / 2 * Math.sin(i * element.theta));
                    }

                } else if (element.type === bl.DRAWNODE_TYPE_RECTANGLE) {

                    context.translate((self._sprite_width - element.b) / 2, (self._sprite_height - element.a) / 2);
                    context.beginPath();
                    context.moveTo(0, 0);
                    context.lineTo(0, element.a);
                    context.lineTo(element.b, element.a);
                    context.lineTo(element.b, 0);
                    context.lineTo(0, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_PARALLELOGRAM) {

                    context.translate((self._sprite_width - element.a - (2 * element.x)) / 2, (self._sprite_height - element.y) / 2);
                    context.beginPath();
                    context.moveTo(element.x, 0);
                    context.lineTo(((2 * element.x) + element.a), 0);
                    context.lineTo((element.x + element.a), element.y);
                    context.lineTo(0, element.y);
                    context.lineTo(element.x, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_KITE) {

                    context.translate((self._sprite_width - (2 * element.c)) / 2, (self._sprite_height - element.a - element.b) / 2);
                    context.beginPath();
                    context.moveTo(0, element.b);
                    context.lineTo(element.c, (element.a + element.b));
                    context.lineTo((2 * element.c), element.b);
                    context.lineTo(element.c, 0);
                    context.lineTo(0, element.b);

                } else if (element.type === bl.DRAWNODE_TYPE_TALL_ISOSCELES) {
                    context.translate(self._sprite_width / 2, ((self._sprite_height - element.a) / 2));
                    context.beginPath();
                    context.moveTo((-self._width / 5), (element.a));
                    context.lineTo(0, 0);
                    context.lineTo((self._width / 5), (element.a));
                    context.lineTo((-self._width / 5), (element.a));

                } else if (element.type === bl.DRAWNODE_TYPE_SHORT_ISOSCELES) {

                    context.translate(self._sprite_width / 2, ((self._sprite_height - element.a) / 2));
                    context.beginPath();
                    context.moveTo((self._width / 2), (element.a));
                    context.lineTo(0, 0);
                    context.lineTo((-self._width / 2), (element.a));
                    context.lineTo((self._width / 2), (element.a));
                    context.stroke();

                } else if (element.type === bl.DRAWNODE_TYPE_IRREGULAR_POLYGON) {

                    var i = 6
                    var theta = (2 * Math.PI) / i;
                    context.translate(self._sprite_width / 2, self._sprite_height / 2);
                    context.beginPath();
                    context.moveTo(self._width / 2, 0);
                    for (var n = 0; n < i; n++) {
                        context.lineTo(self._width / 3 * (element.seeds[i] + 0.5) * Math.cos(n * theta), self._width / 3 * (element.seeds[i + 1] + 0.5) * Math.sin(n * theta));
                    }
                    context.lineTo(self._width / 2, 0);

                } else if (element.type === bl.DRAWNODE_TYPE_DART) {

                    context.translate(self._sprite_width / 2, (self._sprite_height + element.c - element.d) / 2);
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

        drawShape: function(shape, fillColor, borderWidth, borderColor) {
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
                element.b = Math.floor(Math.random() * (this._height - 15)) + 15;

            } else if (element.type === bl.DRAWNODE_TYPE_IRREGULAR_POLYGON) {

                element.rand = ((this._width / 3) - 10) * Math.random() + 10;
                element.seeds = [];
                _.times(20, function() {
                    element.seeds.push(Math.random());
                })

            } else if (element.type === bl.DRAWNODE_TYPE_EQUILATERAL) {

                element.side = Math.random() * (Math.min(WIDTH, HEIGHT) - 20) + 20;

            } else if (element.type === bl.DRAWNODE_TYPE_PENTAGON) {

                element.sides = 5;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_HEXAGON) {

                element.sides = 6;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_HEPTAGON) {

                element.sides = 7;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_OCTAGON) {

                element.sides = 8;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_NONAGON) {

                element.sides = 9;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_DECAGON) {

                element.sides = 10;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_HENDECAGON) {

                element.sides = 11;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_DODECAGON) {

                element.sides = 12;
                element.theta = (2 * Math.PI) / element.sides;

            } else if (element.type === bl.DRAWNODE_TYPE_RECTANGLE) {

                element.b = Math.floor(Math.random() * this._width * 0.4) + this._width * 0.6;
                element.a = Math.floor(Math.random() * this._height * 0.25) + this._height * 0.3;

            } else if (element.type === bl.DRAWNODE_TYPE_PARALLELOGRAM) {

                element.x = Math.floor(Math.random() * 5) + 5;
                element.a = Math.floor(Math.random() * 30) + 10;
                element.y = Math.floor(Math.random() * 20) + 40;

            } else if (element.type === bl.DRAWNODE_TYPE_KITE) {

                element.a = Math.floor(Math.random() * (this._height * 0.3 - 5)) + 5;
                element.b = Math.floor(Math.random() * (this._height * 0.7 - 30)) + 30;
                element.c = Math.floor(Math.random() * ((this._width / 2) - 10)) + 10;

            } else if (element.type === bl.DRAWNODE_TYPE_TALL_ISOSCELES) {

                element.a = Math.floor(Math.random() * (this._height / 2)) + (this._height / 2);

            } else if (element.type === bl.DRAWNODE_TYPE_SHORT_ISOSCELES) {

                element.a = Math.floor(Math.random() * (this._height / 3)) + 10;

            } else if (element.type === bl.DRAWNODE_TYPE_DART) {

                element.a = Math.floor(Math.random() * (this._height * 0.3)) + (this._height * 0.3);
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
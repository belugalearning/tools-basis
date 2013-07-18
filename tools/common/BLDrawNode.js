define(['exports', 'underscore','cocos2d'], function (exports, _, cc) {
    'use strict';

    window.bl = window.bl || {};
    bl.DRAWNODE_TYPE_CIRCLE = 'DRAWNODE_TYPE_CIRCLE';
    var BLDrawNode = cc.DrawNodeCanvas.extend({

        draw:function (ctx) {
            this._super(ctx);

            var context = ctx || cc.renderContext;

            _.each(this._buffer, function (element) {
                if (element.type === bl.DRAWNODE_TYPE_CIRCLE) {
                    context.fillStyle = "rgba(" + (0 | (element.fillColor.r * 255)) + "," + (0 | (element.fillColor.g * 255)) + ","
                        + (0 | (element.fillColor.b * 255)) + "," + element.fillColor.a + ")";

                    context.lineWidth = element.borderWidth * 2;
                    context.lineCap = "round";
                    context.strokeStyle = "rgba(" + (0 | (element.borderColor.r * 255)) + "," + (0 | (element.borderColor.g * 255)) + ","
                        + (0 | (element.borderColor.b * 255)) + "," + element.borderColor.a + ")";
                    cc.drawingUtil.drawCircle(element.position, element.radius, element.angle, element.segments, element.drawLineToCenter, element.fillColor, element.borderWidth, element.borderColor);
                    context.fill();
                    context.stroke();
                }
            });
        },

        /**
         * draws a circle given the center, radius and number of segments.
         * @param {cc.Point} center center of circle
         * @param {Number} radius
         * @param {Number} angle angle in radians
         * @param {Number} segments
         * @param {Boolean} drawLineToCenter
         */
        drawCircle:function (pos, radius, angle, segments, drawLineToCenter, fillColor, borderWidth, borderColor) {
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
            this.setContentSize(cc.SizeMake(radius*2, radius*2));
        }

    });

    return BLDrawNode;

});
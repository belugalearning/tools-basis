define(['cocos2d'], function() {
    'use strict';



    window.bl = window.bl || {};
    window.bl.PolyRectMake = function(x, y, width, height) {
        return [{
            x: x,
            y: y
        }, {
            x: x,
            y: y + height
        }, {
            x: x + width,
            y: y + height
        }, {
            x: x + width,
            y: y
        }];
    };

    window.bl.getQueryParams = function(queryString) {
        var query = (queryString || window.location.search).substring(1); // delete ?
        if (!query) {
            return false;
        }
        return _
            .chain(query.split('&'))
            .map(function(params) {
                var p = params.split('=');
                return [p[0], decodeURIComponent(p[1])];
            })
            .object()
            .value();
    };

    cc.Sprite.prototype.touched = function(touchLocation) {
        var parent = this.getParent();
        var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
        var boundingBox = this.getBoundingBox();
        var contains = cc.rectContainsPoint(boundingBox, touchRelativeToParent);
        return contains;
    };

    cc.Sprite.prototype.touchClose = function(touchLocation) {
        var closeDistance = 20;
        var parent = this.getParent();
        var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
        var position = this.getPosition();
        var distance = cc.pDistance(touchRelativeToParent, position);
        return distance < closeDistance;
    };

    Array.prototype.indexWraparound = function(index) {
        var arraySize = this.length;
        index = index % arraySize;
        if (index < 0) {
            index += arraySize;
        }
        return this[index];
    };

    cc.DrawNode.prototype.drawSector = function(position, radius, startAngle, throughAngle, anticlockwise, fillColour, borderWidth, borderColour) {
        var vertices = [];
        for (var i = 0; i <= 100; i++) {
            var multiplier = anticlockwise ? 1 : -1;
            var angle = startAngle + multiplier * (throughAngle * i) / 100;
            var xPosition = position.x + radius * Math.sin(angle);
            var yPosition = position.y + radius * Math.cos(angle);
            var vertex = cc.p(xPosition, yPosition);
            vertices.push(vertex);
        }
        vertices.push(position);
        this.drawPoly(vertices, fillColour, 1, borderColour);
    };

    cc.DrawNode.generateCircle = function(position, radius) {
        var vertices = [];
        var x = 0;
        var y = radius;
        var angle = 0;
        var range = 2 * Math.PI;

        var vertices = [];
        while (angle < range) {
            angle += 0.01;
            x = position.x + (radius * Math.cos(angle));
            y = position.y + (radius * Math.sin(angle));
            vertices.push(cc.p(x, y));
        }

        return vertices;
    };

    cc.DrawNode.prototype.drawCircle = function(position, radius, fillColour, borderWidth, borderColour) {

        var vertices = cc.DrawNode.generateCircle(position, radius);
        this.drawPoly(vertices, fillColour, 1, borderColour);
    };

    cc.MenuItemImage.prototype.propertyHighlight = function(highlight) {
        if (highlight !== this.highlight) {
            var position;
            if (highlight) {
                position = cc.p(-15, this.getPosition().y);
                this.label.setColor(cc.c3b(0, 0, 0));
                this.highlight = true;
            } else {
                position = cc.p(0, this.getPosition().y);
                this.label.setColor(cc.c3b(255, 255, 255));
                this.highlight = false;
            }
            var moveAction = cc.MoveTo.create(0.3, position);
            this.runAction(moveAction);
        }
    };

    cc.Sprite.prototype.setTextureWithFilename = function(filename) {
        var texture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(filename));
        this.setTexture(texture);
    };

    Number.prototype.numberInCorrectRange = function(lowerBound, upperBound) {
        var result = this;
        var range = upperBound - lowerBound;
        if (result < lowerBound) {
            result += Math.floor((upperBound - result) / range) * range;
        } else if (result >= upperBound) {
            result -= Math.floor((result - lowerBound) / range) * range;
        };
        return result;
    };

    String.prototype.removeUnnecessaryZerosFromNumberString = function() {
        var numberString = this;
        if (numberString.indexOf(".") !== -1) {
            while (numberString[numberString.length - 1] === "0") {
                numberString = numberString.slice(0, numberString.length - 1);
            };
        };
        while (numberString[0] === "0" && numberString[1] !== ".") {
            numberString = numberString.slice(1);
        };
        if (numberString[numberString.length - 1] === ".") {
            numberString = numberString.slice(0, numberString.length - 1);
        };
        return numberString;
    };

    RegExp.quote = function(str) {
        return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    };

    cc.LabelTTF.prototype.setStringAutoFontSize = function(string, maxSize, tolerance) {
        var upperLimit = maxSize;
        var lowerLimit = 0;
        this.setString(string);
        while (true) {
            var halfway = (upperLimit + lowerLimit) / 2;
            this.setFontSize(halfway);
            var contentSize = this.getContentSize();
            if (this.getContentSize().width > this.boundary.width || this.getContentSize().height > this.boundary.height) {
                upperLimit = halfway;
            } else {
                lowerLimit = halfway;
            }
            if (upperLimit - lowerLimit < tolerance) {
                this.setFontSize(lowerLimit);
                break;
            };
        }
    };

});
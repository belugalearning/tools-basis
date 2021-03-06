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

    window.bl.animation = {};
    window.bl.animation.popIn = function () {
        return cc.Sequence.create(cc.FadeIn.create(0.4), cc.ScaleTo.create(0.2, 1.2, 1.2), cc.ScaleTo.create(0.2, 1, 1));
    };

    window.bl.animation.moveTo = function (duration, end) {
        return window.bl.animation.moveThrough(duration, [end]);
    };

    window.bl.animation.moveAndRotateTo = function (duration, end, rotation, cb) {
        cb = cb || function () {};
        var callback = cc.CallFunc.create(cb, this);
        return cc.Sequence.create(cc.MoveTo.create(duration / 2, end), cc.RotateTo.create(duration / 2, rotation), callback);
    };

    window.bl.animation.moveThrough = function (duration, points) {
        points = _.map(points, function (p) {
            return cc.MoveTo.create(duration / points.length, p);
        });
        return cc.Sequence.create.apply(undefined, points);
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

    window.bl.isPointInsideArea = function (point, area, offset) {
            var self = this;

        var nCross = 0;

        _.each(area, function (p1, i) {
            p1 = {
                x: p1.x + (offset.x),
                y: p1.y + (offset.y)
            };
            var p2 = area[(i + 1) % area.length];
            p2 = {
                x: p2.x + (offset.x),
                y: p2.y + (offset.y)
            };

            if (p1.y == p2.y) {
                return;
            }

            if (point.y < Math.min(p1.y, p2.y)) {
                return;
            }

            if (point.y >= Math.max(p1.y, p2.y)) {
                return;
            }

            var x = (point.y - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

            if (x > point.x) {
                nCross++;
            }
        });

        if (nCross % 2 == 1) {
            return true;
        }
        return false;
    };

    window.bl.getDistanceBetweenPoints = function(p1, p2) {
        var dY = p2.y - p1.y;
        var dX = p2.x - p1.x;
        return Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
    };

    window.bl.getClosestPoint = function(point, points) {
        var distance = 9999999 * 99999999;
        var index = 0;
        _.each(points, function (p, i) {
            var x = Math.abs(point.x - p.x);
            var y = Math.abs(point.y - p.y);
            var distanceSq = Math.min(x * x + y * y, distance);
            if (distanceSq < distance) {
                distance = distanceSq;
                index = i;
            }
        });
        return points[index];
    };

    window.bl.polygonArea = function(points) {
        var area = 0;
        var nPoints = points.length;
        var j = nPoints - 1;
        var p1; var p2;

        for (var i = 0; i < nPoints; j = i++) {
           p1 = points[i];
           p2 = points[j];
           area += p1.x * p2.y;
           area -= p1.y * p2.x;
        }
        area /= 2;
         
        return area;
    };

    window.bl.polygonCentroid = function(points) {
        var nPoints = points.length;
        var x = 0;
        var y = 0;
        var f;
        var j = nPoints - 1;
        var p1; var p2;

        for (var i = 0; i < nPoints; j = i++) {
            p1 = points[i];
            p2 = points[j];
            f = p1.x * p2.y - p2.x * p1.y;
            x += (p1.x + p2.x) * f;
            y += (p1.y + p2.y) * f;
        }

        f = window.bl.polygonArea(points) * 6;

        return cc.p(x/f, y/f);
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
        var inc = range / 360;

        while (angle < range - inc) {
            angle += inc;
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

    Number.prototype.sign = function () {
        return this > 0 ? 1 : this < 0 ? -1 : 0;
    }

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

    Array.prototype.spaceNodesLinear = function(horizontalSpacing, verticalSpacing) {
        for (var i = 0; i < this.length; i++) {
              var xPosition = -horizontalSpacing * (this.length-1)/2 + horizontalSpacing * i;
              var yPosition = -verticalSpacing * (this.length-1)/2 + verticalSpacing * i;
              this[i].setPosition(xPosition, yPosition);
        };
    };

    Number.prototype.putInBounds = function(lowerBound, upperBound) {
        return Math.max(Math.min(this, upperBound), lowerBound);
    };

    cc.Rect.prototype.latticePoints = function(xDistance, yDistance, angle, offsetX, offsetY) {
        var self = this;

        var rowHeight = Math.sin(angle);
        var rowOffset = Math.cos(angle);
        
        var pinPosition = function(i, j) {
            var xValue = self.origin.x + xDistance * i + yDistance * rowOffset * j;
            var yValue = self.origin.y + yDistance * rowHeight * j;
            var pinPosition = cc.p(xValue, yValue);
            return pinPosition;
        };

        var positionOnBackground = function(pinPosition) {
            var xRelativeToBackground = pinPosition.x + self.origin.x + offsetX;
            var yRelativeToBackground = pinPosition.y + self.origin.y + offsetY;
            var pinPositionRelativeToBackground= cc.p(xRelativeToBackground, yRelativeToBackground);
            var onBackground = cc.rectContainsPoint(self, pinPosition);
            return onBackground;
        };

        var latticePoints = [];    
        var firstCoordinate = 0;
        var secondCoordinate = 0;
        while (positionOnBackground(pinPosition(0, secondCoordinate))) {
            while (positionOnBackground(pinPosition(firstCoordinate, secondCoordinate))) {
                latticePoints.push(pinPosition(firstCoordinate, secondCoordinate));
                firstCoordinate++;
            }
            firstCoordinate = -1;
            while (positionOnBackground(pinPosition(firstCoordinate, secondCoordinate))) {
                latticePoints.push(pinPosition(firstCoordinate, secondCoordinate));
                firstCoordinate--;
            }
            firstCoordinate = 0;
            secondCoordinate++;
        }
        return latticePoints;
    };
});

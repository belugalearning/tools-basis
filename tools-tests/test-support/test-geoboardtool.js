var ToolLayer = cc.Layer.extend({
    titleLabel:null,
    clc:null,
    lastcount:null,
    label:null,
    geoboard:null,

    init:function () {

        this._super();

/*
        if ('touches' in sys.capabilities) {
            this.setTouchEnabled(true);
        }
        if ('mouse' in sys.capabilities) {
            this.setMouseEnabled(true);
        }
*/
        this.setTouchEnabled(true);

        var size = cc.Director.getInstance().getWinSize();

        clc=cc.LayerColor.create(cc.c4b(0, 0, 0, 255));
        this.addChild(clc,0);
        setupInheritances();

        //this.setPosition(cc.p(-500, 0));

        geoboard = new SquareGeoboard();
        geoboard.background.setPosition(cc.p(size.width/2, size.height/2));
        this.addChild(geoboard.background);
        geoboard.setupPins();

        var pin1 = geoboard.pins[0];
        var pin2 = geoboard.pins[39];
        var pin3 = geoboard.pins[43];
        var pin4 = geoboard.pins[1]; 

        var band = new Band();
        band.setupWithGeoboardAndPins(geoboard, [pin1, pin2, pin3, pin4]);

        return this;
    },

    onTouchesBegan:function (touches, event) {
        var touchLocation = this.convertTouchToNodeSpace(touches[0]);
        geoboard.processTouch(touchLocation);
    },

    onTouchesMoved:function (touches, event) {
        var touchLocation = this.convertTouchToNodeSpace(touches[0]);
        geoboard.processMove(touchLocation);
    },

    onTouchesEnded:function(touches, event) {
        var touchLocation = this.convertTouchToNodeSpace(touches[0]);
        geoboard.processEnd(touchLocation);
    },

});

var setupInheritances = function() {
    inherits(RegularGeoboard, Geoboard);
    inherits(SquareGeoboard, RegularGeoboard);
    inherits(TriangleGeoboard, RegularGeoboard);
    inherits(CircleGeoboard, Geoboard);
}


function Geoboard() {
    this.background = new cc.Sprite();
    this.background.initWithFile(s_geoboard_background);
    this.pins = new Array();
    this.bands = new Array();
    this.movingBand = null;

    this.addPinsToBackground = function() {
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            this.background.addChild(this.pins[i].sprite);
        };
    }

    this.addBand = function(band) {
        this.bands.push(band);
        this.background.addChild(band.bandNode);
    }

    this.processTouch = function(touchLocation) {
        for (var i = 0; i < this.bands.length; i++) {
            this.bands[i].processTouch(touchLocation);
        };
    }

    this.processMove = function(touchLocation) {
        if (this.movingBand !== null) {
            touchLocation = this.background.convertToNodeSpace(touchLocation);
            this.movingBand.processMove(touchLocation);
        }
    }

    this.processEnd = function(touchLocation) {
        if (this.movingBand !== null) {
            var placedOnPin = false;
            for (var i = 0; i < this.pins.length; i++) {
                var pin = this.pins[i];
                if (pin.sprite.touched(touchLocation)) {
                    this.movingBand.pinBandOnPin(pin);
                    placedOnPin = true;
                };
            };
            if (!placedOnPin) {
                this.movingBand.removeMovingPin();
            };
            this.movingBand.processEnd(touchLocation);
        };
        this.movingBand = null;
    }

    this.setMovingBand = function(band) {
        this.movingBand = band;
    }
}


function RegularGeoboard() {
    Geoboard.call(this);

    this.distanceBetweenPins = 40;

    this.setupPins = function () {
        var firstCoordinate = 0;
        var secondCoordinate = 0;
        this.rowHeight = Math.sin(this.angleBetweenAxes);
        this.rowOffset = Math.cos(this.angleBetweenAxes);
        while (this.positionOnBackground(this.pinPosition(0, secondCoordinate))) {
            while (this.positionOnBackground(this.pinPosition(firstCoordinate, secondCoordinate))) {
                var pin = new Pin();
                pin.sprite.setPosition(this.pinPosition(firstCoordinate, secondCoordinate));
                this.pins.push(pin);
                firstCoordinate++;
            }
            firstCoordinate = -1;
            while (this.positionOnBackground(this.pinPosition(firstCoordinate, secondCoordinate))) {
                var pin = new Pin();
                pin.sprite.setPosition(this.pinPosition(firstCoordinate, secondCoordinate));
                this.pins.push(pin);
                firstCoordinate--;
            }
            firstCoordinate = 0;
            secondCoordinate++;
        }

        this.addPinsToBackground();
    }

    this.pinPosition = function(i, j) {
        var xValue = 10 + this.distanceBetweenPins * (i + this.rowOffset * j);
        var yValue = 10 + this.distanceBetweenPins * this.rowHeight * j;
        var pinPosition = cc.p(xValue, yValue);
        return pinPosition;
    }

    this.positionOnBackground = function(pinPosition) {
        var xRelativeToBackground = pinPosition.x + this.background.getBoundingBox().origin.x;
        var yRelativeToBackground = pinPosition.y + this.background.getBoundingBox().origin.y;
        var pinPositionRelativeToBackground= cc.p(xRelativeToBackground, yRelativeToBackground);
        var background = this.background;
        var boundingBox = this.background.getBoundingBox();
        var onBackground = cc.rectContainsPoint(boundingBox, pinPositionRelativeToBackground);
        return onBackground;
    }
}


function SquareGeoboard() {
    RegularGeoboard.call(this);
    this.angleBetweenAxes = Math.PI/2;
}

function TriangleGeoboard() {
    RegularGeoboard.call(this);
    this.angleBetweenAxes = Math.PI/3;
}


function CircleGeoboard() {
    Geoboard.call(this);
    this.radius = 100;
    this.numberOfPins = 8;
    this.includeCentre = true;

    this.setupPins = function() {
        var background = this.background;
        var contentSize = background.getContentSize();
        var centreOfCircle = cc.p(contentSize.width/2, contentSize.height/2);
        if (this.includeCentre) {
            var pin = new Pin();
            pin.sprite.setPosition(centreOfCircle);
            this.pins.push(pin);
        }
        for (var i = 0; i < this.numberOfPins; i++) {
            var pin = new Pin();
            var xPosition = centreOfCircle.x + this.radius * Math.sin(2 * Math.PI * i/this.numberOfPins);
            var yPosition = centreOfCircle.y + this.radius * Math.cos(2 * Math.PI * i/this.numberOfPins);
            pin.sprite.setPosition(cc.p(xPosition, yPosition));
            this.pins.push(pin);
        }
        this.addPinsToBackground();
    }
}


function Pin() {
    this.sprite = new cc.Sprite();
    this.sprite.initWithFile(s_pin);
}

function Band() {
    this.bandNode = new cc.Node();
    this.bandParts = new Array();
    this.movingPin = null;

    this.setupWithGeoboardAndPins = function(geoboard, pins) {
        this.geoboard = geoboard;
        this.geoboard.addBand(this);
        this.pins = pins;
        this.bandParts = new Array();

        this.setupBandParts();
    }

    this.setupBandParts = function() {
        this.bandParts = [];
        this.bandNode.removeAllChildren();
        if (this.pins.length > 1) {
            for (var i = 0; i < this.pins.length; i++) {
                var fromPin = this.pins[i];
                var toPin = this.pins.indexWraparound(i+1);
                this.addBandPartBetween(fromPin, toPin);
            };
            /*
            var lastPin = this.pins[this.pins.length - 1];
            var firstPin = this.pins[0];
            this.addBandPartBetween(lastPin, firstPin);
            */
            this.setPositionAndRotationOfBandParts();
        };
    }

    this.addBandPartBetween = function(fromPin, toPin) {
        var bandPart = new BandPart();
        bandPart.setup(this, fromPin, toPin);
        this.bandNode.addChild(bandPart.baseNode);
        this.bandParts.push(bandPart);
    }

    this.setPositionAndRotationOfBandParts = function() {
        for (var i = 0; i < this.bandParts.length; i++) {
            this.bandParts[i].setPositionAndRotation();
        };
    }

    this.processTouch = function(touchLocation) {
        var selected = false;
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            if (pin.sprite.touched(touchLocation)) {
                this.unpinBandFromPin(i);
                selected = true;
                this.geoboard.setMovingBand(this);
                break;
            };
        };
        if (!selected) {
            for (var i = 0; i < this.bandParts.length; i++) {
                var bandPart = this.bandParts[i];

/*                
                The following is a hack, the _transform property of the bandParts is being calculated incorrectly due to the rotation 
                (reflected in the x axis from the fromPin of the bandPart) resulting in the sprites incorrectly detecting touches.
                These lines ensure the point passed in to touched() will give the correct touch detection, but the cause for this 
                behaviour should be found. The corresponding code in the objective C version of this app gives the correct transform. 
*/
                var bandPartX = this.geoboard.background.convertToWorldSpace(bandPart.bandPartNode.getPosition()).x;
                var difference = (touchLocation.x - bandPartX);
                var touchLocationXCorrected = bandPartX - (difference);
                var touchLocationCorrected = cc.p(touchLocationXCorrected, touchLocation.y);
                if (bandPart.sprite.touched(touchLocationCorrected)) {
                    this.splitBandPart(i, touchLocation);
                    this.geoboard.setMovingBand(this);
                    selected = true;
                    break;
                };
            };
        };
        if (selected) {
            this.setupBandParts();
        };
    }

    this.unpinBandFromPin = function(index) {
        var pin = this.pins[index];
        this.movingPin = new Pin();
        this.movingPin.sprite.setPosition(pin.sprite.getPosition());
        this.pins.splice(index, 1, this.movingPin);
        this.geoboard.background.addChild(this.movingPin.sprite);
    }

    this.splitBandPart = function(index, touchLocation) {
        var bandPart = this.bandParts[index];
        this.movingPin = new Pin();
        var pinPosition = this.bandNode.convertToNodeSpace(touchLocation);
        this.movingPin.sprite.setPosition(pinPosition);
        this.geoboard.background.addChild(this.movingPin.sprite);
        this.pins.splice(index + 1, 0, this.movingPin);
    }

    this.processMove = function(touchLocation) {
        this.movingPin.sprite.setPosition(touchLocation);
        this.setPositionAndRotationOfBandParts();
    }

    this.processEnd = function(touchLocation) {
        this.movingPin.sprite.removeFromParent();
        this.movingPin = null;
        this.setupBandParts();
        this.setPositionAndRotationOfBandParts();
    }

    this.pinBandOnPin = function(pin) {
        var movingPinIndex = this.pins.indexOf(this.movingPin);
        this.pins.splice(movingPinIndex, 1, pin);
    }

    this.removeMovingPin = function() {
        var index = this.pins.indexOf(this.movingPin);
        this.removePin(index);
        this.movingPin.sprite.removeFromParent();
    }

    this.removePin = function(index) {
        this.pins.splice(index, 1);
    }

}


function BandPart() {
    this.baseNode = new cc.Node();
    this.sprite = new cc.Sprite(); 
    this.sprite.initWithFile(s_bandPart);
    this.bandPartNode = new cc.Node();
    this.sprite.setAnchorPoint(cc.p(0.5, 0));
    //this.baseNode.setAnchorPoint(cc.p(0.5, 0));
    this.baseNode.addChild(this.bandPartNode);
    this.bandPartNode.addChild(this.sprite);

    this.setup = function(band, fromPin, toPin) {
        this.band = band;
        this.fromPin = fromPin;
        this.toPin = toPin;
    }

    this.setPositionAndRotation = function() {
        var fromPin = this.fromPin;
        var toPin = this.toPin;
        this.bandPartNode.setPosition(fromPin.sprite.getPosition());
        var xDifference = toPin.sprite.getPosition().x - fromPin.sprite.getPosition().x;
        var yDifference = toPin.sprite.getPosition().y - fromPin.sprite.getPosition().y;
        var angle =  Math.atan2(xDifference, yDifference);
        this.bandPartNode.setRotation(cc.RADIANS_TO_DEGREES(angle));
        var pinDistance = this.pinDistance();
        var scaleFactor = pinDistance/this.sprite.getContentSize().height;
        this.bandPartNode.setScaleY(scaleFactor);
    }

    this.pinDistance = function() {
        var fromPosition = this.fromPin.sprite.getPosition();
        var toPosition = this.toPin.sprite.getPosition();
        var pinDistance = cc.pDistance(fromPosition, toPosition);
        return pinDistance;
    }
}


function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

cc.Sprite.prototype.touched = function(touchLocation) {
    var parent = this.getParent();
    var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);

/*
    var touchRelativeX = touchRelativeToParent.x;
    var spriteX = this.getPosition().x;
    var touchRelativeXCorrected = spriteX - (touchRelativeX - spriteX);
    touchRelativeToParent = cc.p(touchRelativeXCorrected, touchRelativeToParent.y);
*/
    var boundingBox = this.getBoundingBox();
    var contains = cc.rectContainsPoint(boundingBox, touchRelativeToParent);
    return contains;
}

Array.prototype.indexWraparound = function(index) {
    var arraySize = this.length;
    index = index % arraySize;
    if (index < 0) {
        index += arraySize;
    };
    return this[index];
}









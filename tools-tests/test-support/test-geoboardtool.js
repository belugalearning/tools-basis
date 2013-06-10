var ToolLayer = cc.Layer.extend({
    titleLabel:null,
    clc:null,
    lastcount:null,
    label:null,
    geoboard:null,
    circleNumberOfPins:8,
    circleIncludeCentre:true,

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

        clc=cc.LayerColor.create(cc.c4b(0, 0, 0, 255));
        this.addChild(clc,0);
        setupInheritances();

        //this.setPosition(cc.p(-500, 0));

        this.geoboard = new CircleGeoboard(this.circleNumberOfPins, this.circleIncludeCentre);
        this.setupGeoboard();





        // Currently using a MenuItemImage isn't working here (the 'activate' function on the object is not triggered, 
        //I have used MenuItemFonts instead)
        var squareGeoboardButton = new cc.MenuItemFont.create("Square", 'squareGeoboardTapped', this);

        //var squareGeoboardButton = new cc.MenuItemImage.create(s_square_geoboard_button, s_square_geoboard_button, 'squareGeoboardTapped', this);

        var triangleGeoboardButton = new cc.MenuItemFont.create("Triangle", 'triangleGeoboardTapped', this);
        triangleGeoboardButton.setPosition(0, -110);

        var circleGeoboardButton = new cc.MenuItemFont.create("Circle", 'circleGeoboardTapped', this);
        circleGeoboardButton.setPosition(-20, -220);

        var centrePinButton = new cc.MenuItemFont.create("Centre", 'centrePinTapped', this);
        centrePinButton.setPosition(85, -190);
        centrePinButton.setFontSize(16);

        var addPinButton = new cc.MenuItemFont.create("Add", 'addPinTapped', this);
        addPinButton.setPosition(85, -225);
        addPinButton.setFontSize(16);

        var removePinButton = new cc.MenuItemFont.create("Remove", 'removePinTapped', this);
        removePinButton.setPosition(85, -260);
        removePinButton.setFontSize(16);

        var geoboardTypesMenu = new cc.Menu.create(squareGeoboardButton, triangleGeoboardButton, circleGeoboardButton,
            centrePinButton, addPinButton, removePinButton);
        geoboardTypesMenu.setPosition(110, 500);
        this.addChild(geoboardTypesMenu);

        var addBandButton = new cc.MenuItemFont.create("Add band", 'addBandTapped', this);

        var removeBandButton = new cc.MenuItemFont.create("Remove band", 'removeBandTapped', this);
        removeBandButton.setPosition(0, -60);

        var addRemoveBandMenu = new cc.Menu.create(addBandButton, removeBandButton);
        addRemoveBandMenu.setPosition(110, 130);
        this.addChild(addRemoveBandMenu);

        this.selectBandMenu = new cc.Menu.create();
        this.selectBandMenu.setPosition(800, 700);
        this.addChild(this.selectBandMenu);
        this.selectBandButtons = new Array();

        var propertiesIndicator = new cc.Node();
        propertiesIndicator.setPosition(900, 500);
        this.addChild(propertiesIndicator);

        var regularIndicator = new cc.Sprite();
        regularIndicator.initWithFile(s_property_background);
        this.regularIndicatorLabel = new cc.LabelTTF.create("", "Arial", 24);
        this.regularIndicatorLabel.setColor(0,0,0);
        this.regularIndicatorLabel.setPosition(regularIndicator.getBoundingBox().width/2, regularIndicator.getBoundingBox().height/2);
        regularIndicator.addChild(this.regularIndicatorLabel);
        propertiesIndicator.addChild(regularIndicator);

        var showAnglesButton = cc.MenuItemFont.create("Show angles", 'showAnglesTapped', this);
        showAnglesButton.setPosition(cc.p(-200, 50));

        var bandPropertiesMenu = cc.Menu.create(showAnglesButton);
        bandPropertiesMenu.setPosition(600, 100);
        this.addChild(bandPropertiesMenu);

        return this;
    },

    setupGeoboard:function (touches, event) {
        var size = cc.Director.getInstance().getWinSize();
        this.geoboard.background.setPosition(size.width/2, size.height/2);
        this.addChild(this.geoboard.background);
        this.geoboard.layer = this;
        this.geoboard.setupPins();
    },

    clearGeoboardSprites:function (touches, event) {
        this.geoboard.background.removeFromParent();
    },

    onTouchesBegan:function (touches, event) {
        var touchLocation = this.convertTouchToNodeSpace(touches[0]);
        this.geoboard.processTouch(touchLocation);
    },

    onTouchesMoved:function (touches, event) {
        var touchLocation = this.convertTouchToNodeSpace(touches[0]);
        this.geoboard.processMove(touchLocation);
    },

    onTouchesEnded:function(touches, event) {
        if (touches.length > 0) {
            var touchLocation = this.convertTouchToNodeSpace(touches[0]);
            this.geoboard.processEnd(touchLocation);
        };
    },

    squareGeoboardTapped:function() {
        if(!(this.geoboard instanceof SquareGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new SquareGeoboard();
            this.setupGeoboard();
        }
    },

    triangleGeoboardTapped:function() {
        if (!(this.geoboard instanceof TriangleGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new TriangleGeoboard();
            this.setupGeoboard();
        };
    },

    circleGeoboardTapped:function() {
        if (!(this.geoboard instanceof CircleGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new CircleGeoboard(this.circleNumberOfPins, this.circleIncludeCentre);
            this.setupGeoboard();
        };
    },

    centrePinTapped:function() {
        if (this.geoboard instanceof CircleGeoboard) {
            this.circleIncludeCentre = !this.circleIncludeCentre;
            if (this.circleIncludeCentre) {
                this.geoboard.addCentrePin();
            } else {
                this.geoboard.removeCentrePin();
            };
        };
    },

    addPinTapped:function() {
        if (this.geoboard instanceof CircleGeoboard) {
            if (this.circleNumberOfPins < 20) {
                this.circleNumberOfPins++;
                this.geoboard.addEdgePin();
            };
        }
    },

    removePinTapped:function() {
        if(this.geoboard instanceof CircleGeoboard) {
            if (this.circleNumberOfPins > 3) {
                this.circleNumberOfPins--;
                this.geoboard.removeEdgePin();
            };
        }
    },

    addBandTapped:function() {
        if (this.geoboard.bands.length < 24) {
            var band = this.geoboard.newBand();
            var selectBandButton = new cc.MenuItemFont.create("X", "selectBandFromButton", this.geoboard);
            selectBandButton.band = band;
            selectBandButton.setColor(band.colour);
            this.addSelectBandButton(selectBandButton);
        };
    },

    removeBandTapped:function() {
        this.geoboard.removeSelectedBand();
    },

    addSelectBandButton:function(selectBandButton) {
        this.selectBandButtons.push(selectBandButton);
        this.selectBandMenu.addChild(selectBandButton);
        this.positionBandSelectButtons();
    },

    removeSelectBandButton:function(band) {
        for (var i = 0; i < this.selectBandButtons.length; i++) {
            var button = this.selectBandButtons[i];
            if (button.band === band) {
                this.selectBandButtons.splice(i, 1);
                button.removeFromParent();
                this.positionBandSelectButtons();
            };
        };
    },

    showAnglesTapped:function() {
        this.geoboard.setAngleDisplay("angles");
    },

    positionBandSelectButtons:function() {
        var numberOfRows = 6;
        var numberOfButtons =  this.selectBandButtons.length;
        for (var i = 0; i < numberOfButtons; i++) {
            var bandSelectButton = this.selectBandButtons[i];
            var xPosition = 0 + 30 * (i % numberOfRows);
            var yPosition = 0 - 30 * Math.floor(i/numberOfRows);
            bandSelectButton.setPosition(xPosition, yPosition);
        };
    },

    setRegularIndicatorWith:function(string) {
        this.regularIndicatorLabel.setString(string);
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

    this.border = new cc.Sprite();
    this.border.initWithFile(s_geoboard_border);
    this.background.addChild(this.border);
    this.border.setZOrder(-1);
    var box = this.background.getBoundingBox();
    this.border.setPosition(box.width/2, box.height/2);
    this.border.setScaleX(2.6);
    this.border.setScaleY(3.2);



    this.angleDisplayType = "none";

    this.addPinsToBackground = function() {
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            this.background.addChild(this.pins[i].sprite);
        };
    }

    this.addBand = function(band) {
        this.bands.push(band);
        this.background.addChild(band.bandNode);
        this.selectBand(band);
    }

    this.processTouch = function(touchLocation) {
        for (var i = 0; i < this.bands.length; i++) {
            this.bands[i].processTouch(touchLocation);
            if (this.movingBand !== null) {
                break;
            };
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
            //this.setPropertyIndicatorsForSelectedBand();
        };
        this.movingBand = null;
    }

    this.setMovingBand = function(band) {
        this.movingBand = band;
        this.selectBand(band);
    }

    this.newBand = function() {
        var firstPin = this.pins[0];
        var secondPin = this.pins[1];
        var band = new Band();
        band.setupWithGeoboardAndPins(this, [firstPin, secondPin]);
        band.setupBandParts();
        return band;
    }

    this.removeBand = function(index) {
        var band = this.bands[index];
        band.bandNode.removeFromParent();
        this.bands.splice(index, 1);
        this.layer.removeSelectBandButton(band);
        if (index === 0) {
            if (this.bands.length > 0) {
                this.selectBand(this.bands[0]);
            } else {
                this.selectNoBand();
            };
        };
    }

    this.selectNoBand = function() {
        this.border.setColor(cc.c3b(255, 255, 255));
    }

    this.removeSelectedBand = function() {
        this.removeBand(0);
    }

    this.selectBand = function(band) {
        var index = this.bands.indexOf(band);
        this.bands.splice(index, 1);
        this.bands.splice(0, 0, band);
        this.setBandsZIndexToPriorityOrder();
        this.border.setColor(band.colour);
    }

    this.selectBandFromButton = function(sender) {
        var band = sender.band;
        this.selectBand(band);        
    }

    this.setBandsZIndexToPriorityOrder = function() {
        for (var i = 1; i <= this.bands.length; i++) {
            var index = this.bands.length - i;
            var band = this.bands[index];
            this.background.reorderChild(band.bandNode, i);
        };
    }

    this.setPropertyIndicatorsForBand = function() {
        if (this.bands.length > 0) {
            var band = this.bands[0];
            this.layer.setRegularIndicatorWith(band.regular());
        };

    }
}


function RegularGeoboard() {
    Geoboard.call(this);

    this.distanceBetweenPins = 40;
    this.unitDistance = this.distanceBetweenPins;



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


function CircleGeoboard(numberOfPins, includeCentre) {
    Geoboard.call(this);
    this.radius = 100;
    this.numberOfPins = numberOfPins;
    this.includeCentre = includeCentre;
    var contentSize = this.background.getContentSize();
    this.centreOfCircle = cc.p(contentSize.width/2, contentSize.height/2);
    this.unitDistance = this.radius;

    this.setupPins = function() {
        if (this.includeCentre) {
            var pin = new Pin();
            pin.circlePinIndex = 0;
            pin.sprite.setPosition(this.centreOfCircle);
            this.pins.push(pin);
        }
        for (var i = 0; i < this.numberOfPins; i++) {
            var pin = new Pin();
            pin.circlePinIndex = i + 1;
            pin.sprite.setPosition(this.edgePinPosition(pin.circlePinIndex - 1));
            this.pins.push(pin);
        }
        this.addPinsToBackground();
    }

    this.edgePinPosition = function(index) {
        var xPosition = this.centreOfCircle.x + this.radius * Math.sin(2 * Math.PI * index/this.numberOfPins);
        var yPosition = this.centreOfCircle.y + this.radius * Math.cos(2 * Math.PI * index/this.numberOfPins);
        return cc.p(xPosition, yPosition);
    }

    this.addCentrePin = function() {
        this.includeCentre = true;
        var pin = new Pin();
        pin.circlePinIndex = 0;
        pin.sprite.setPosition(this.centreOfCircle)
        this.background.addChild(pin.sprite);
        this.pins.push(pin);
    }

    this.removeCentrePin = function() {
        this.includeCentre = false;
        var pinToDelete;
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            if (pin.circlePinIndex === 0) {
                pinToDelete = pin;
                this.pins.splice(i, 1);
                break;
            }
        };
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            for (var j = band.pins.length - 1; j >= 0; j--) {
                var pin = band.pins[j];
                if (pin === pinToDelete) {
                    band.pins.splice(j, 1);
                }
            };
            if (band.pins.length === 0) {
                this.removeBand(i);
            };
            band.setupBandParts();
        };
        pinToDelete.sprite.removeFromParent();
    }

    this.addEdgePin = function() {
        this.numberOfPins++;
        var pin = new Pin();
        pin.circlePinIndex = this.numberOfPins;
        this.pins.push(pin);
        this.background.addChild(pin.sprite);
        this.positionEdgePins();
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.setPositionAndRotationOfBandParts();
            band.cleanPins();
        };
    }

    this.removeEdgePin = function() {
        var pinToDelete;
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            if (pin.circlePinIndex === this.numberOfPins) {
                pinToDelete = pin;
                this.pins.splice(i, 1);
                break;
            };
        };
        this.numberOfPins--;
        this.positionEdgePins();
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            for (var j = 0; j < band.pins.length; j++) {
                var pin = band.pins[j];
                if (pin === pinToDelete) {
                    band.pins.splice(j, 1);
                };
            };
            if(band.pins.length === 0) {
                this.removeBand(i);
            }
            band.setupBandParts();
            band.cleanPins();
        };
        pinToDelete.sprite.removeFromParent();
    }

    this.positionEdgePins = function() {
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            var circleIndex = pin.circlePinIndex;
            if (circleIndex !== 0) {
                var position = this.edgePinPosition(circleIndex - 1);
                pin.sprite.setPosition(position);
            }; 
        };
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


    var red = 0, green = 0, blue = 0;
    while (red + green + blue < 256) {
        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);
    }
    this.colour = cc.c3b(red, green, blue);

    this.setupWithGeoboardAndPins = function(geoboard, pins) {
        this.geoboard = geoboard;
        this.geoboard.addBand(this);
        this.pins = pins;
        this.bandParts = new Array();

        this.setupBandParts();
        this.setupPropertiesNode();
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
            this.setPositionAndRotationOfBandParts();
        };
    }

    this.addBandPartBetween = function(fromPin, toPin) {
        var bandPart = new BandPart();
        bandPart.setup(this, fromPin, toPin);
        bandPart.sprite.setColor(this.colour);
        bandPart.sprite.setOpacity(255);
        this.bandNode.addChild(bandPart.baseNode);
        this.bandParts.push(bandPart);
    }

    this.setPositionAndRotationOfBandParts = function() {
        for (var i = 0; i < this.bandParts.length; i++) {
            this.bandParts[i].setPositionAndRotation();
        };
    }

    this.setupPropertiesNode = function() {
        this.propertiesNode = new cc.Node();
        this.propertiesNode.setZOrder(1);
        this.bandNode.addChild(this.propertiesNode);

        this.angleNode = new cc.Node();
        this.angles = new Array();
        this.propertiesNode.addChild(this.angleNode);
        this.setupAngles();

    }

    this.processTouch = function(touchLocation) {
        var selected = false;
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            if (pin.sprite.touched(touchLocation)) {
                if (this.pins.length > 1) {
                    this.unpinBandFromPin(i);
                } else {
                    this.splitBandPart(0, touchLocation);
                };
                selected = true;
                this.geoboard.setMovingBand(this);
                break;
            };
        };
        if (!selected) {
            for (var i = 0; i < this.bandParts.length; i++) {
                var bandPart = this.bandParts[i];

/*                
                The following is a hack, the _transform property of the bandParts is being calculated incorrectly due to their rotation 
                (the transform is reflected in the x axis from the fromPin of the bandPart) resulting in the sprites incorrectly 
                detecting touches.
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
        this.cleanPins();
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

    this.cleanPins = function() {
        if (this.pins.length > 1) {
            var repeatPinsIndexes = new Array();
            for (var i = 0; i < this.pins.length; i++) {
                var currentPin = this.pins[i];
                var nextPin = this.pins[(i+1) % this.pins.length];
                if (currentPin == nextPin) {
                    repeatPinsIndexes.push(i);
                };
            };
            for (var i = repeatPinsIndexes.length - 1; i >= 0; i--) {
                this.pins.splice(repeatPinsIndexes[i], 1);
            };
            this.setupBandParts();

            var indexOfStraightThroughPin = this.indexOfStraightThroughPin();
            while (indexOfStraightThroughPin != -1) {
                this.pins.splice(indexOfStraightThroughPin, 1);
                this.setupBandParts();
                indexOfStraightThroughPin = this.indexOfStraightThroughPin();
            }
        };
    }

    this.indexOfStraightThroughPin = function() {
        var indexToReturn = -1;
        for (var i = 0; i < this.pins.length; i++) {
            var currentPart = this.bandParts[i];
            var nextPart = this.bandParts[(i+1) % this.bandParts.length];
            var currentParent = currentPart.sprite.getParent();
            var nextParent = nextPart.sprite.getParent();
            if (this.closeFloats(currentParent.getRotation(), nextParent.getRotation())) {
                indexToReturn = (i+1) % this.pins.length;
            };
        };
        return indexToReturn;
    }

    this.setupAngles = function() {
        this.angles = [];
        this.angleNode.removeAllChildren();
        for (var i = 0; i < this.pins.length; i++) {
            var angle = new Angle();
            //angle.init();
            this.angles.push(angle);
            var pin = this.pins[i];
            angle.setPosition(pin.sprite.getPosition());
            this.angleNode.addChild(angle);
        };
        this.setAngleValues();


    }

    this.setAngleValues = function() {
        var totalAngle = 0;
        for (var i = 0; i < this.angles.length; i++) {
            var angle = this.angles[i];
            var inPart = this.bandParts.indexWraparound(i-1);
            var outPart = this.bandParts[i];
            var inPartAngle = cc.DEGREES_TO_RADIANS(180 + inPart.bandPartNode.getRotation());
            var outPartAngle = cc.DEGREES_TO_RADIANS(outPart.bandPartNode.getRotation());
            angle.startAngle = inPartAngle;
            var thisAngle = this.angleInCorrectRange(outPartAngle - inPartAngle);
            angle.anticlockwise = this.anticlockwise;
            if (this.anticlockwise) {
                angle.throughAngle = thisAngle;
            } else {
                angle.throughAngle = 2 * Math.PI - thisAngle;
            };
            if (Math.abs(angle.throughAngle - 2 * Math.PI) < 0.0001) {
                angle.throughAngle = 0;
            };
            var pin = this.pins[i];
            angle.setPosition(pin.sprite.getPosition());
            totalAngle += Math.PI - thisAngle;
            angle.label = new cc.LabelTTF.create("", "Arial", 24);
            angle.label.setString(Math.round(cc.RADIANS_TO_DEGREES(angle.throughAngle)*100)/100);
        };

        var beforeAnticlockwise = this.anticlockwise;
        if (Math.abs(totalAngle) > 1) {
            if (totalAngle < 0 || Math.abs(totalAngle) < 1) {
                this.anticlockwise = false;
            } else {
                this.anticlockwise = true;
            };
        };

        if (beforeAnticlockwise != this.anticlockwise) {
            this.setAngleValues();
        };
    }

    this.angleInCorrectRange = function(angle) {
        angle = angle % (2 * Math.PI);
        if (angle < 0) {
            angle += 2 * Math.PI;
        };
        return angle;
    }

/*
    this.regular = function() {
        var regular;
        if (this.bandParts.length < 3) {
            regular = "";
        } else {
            regular = "Regular";
            var firstBandPart = this.bandParts[0];
            var sideLength = firstBandPart.length();
            for (var i = 0; i < this.bandParts.length; i++) {
                var bandPart = this.bandParts[i];
                var thisLength = bandPart.length();
                if (Math.abs(thisLength - sideLength) > 0.0001) {
                    regular = "Irregular";
                    break;
                };
            };
            if (regular) {
                var angle = 
            };
        };
    }
    */

    this.closeFloats = function(floatA, floatB) {
        return Math.abs(floatA - floatB) < 0.001;
    }

}


function BandPart() {
    this.baseNode = new cc.Node();
    this.sprite = new cc.Sprite(); 
    this.sprite.initWithFile(s_bandPart);
    this.bandPartNode = new cc.Node();
    this.sprite.setAnchorPoint(cc.p(0.5, 0));
    this.baseNode.setAnchorPoint(cc.p(0.5, 0));
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

    this.length = function() {
        var pinDistance = this.pinDistance();
        var distanceBetweenPins = this.band.geoboard.unitDistance;
        var length = pinDistance/distanceBetweenPins;
        return length;
    }
}

/*
function Angle() {
    this.baseNode = new cc.Node();
    this.startAngle = 0;
    this.throughAngle = 0;
    this.label = cc.LabelTTF.create("", "Arial", 12);
    this.label.setPosition(0, 10);
    this.baseNode.addChild(this.label);

    this.setDrawAngle = function() {
        this.baseNode.clear();
        this.baseNode.drawSector(cc.p(0,0), 30, this.startAngle, 3/2 * Math.PI, true, cc.c4f(1, 0, 0, 1), 2, cc.c4f(0, 1, 0, 1));
    }
} 
*/

var Angle = cc.DrawNode.extend({
    startAngle:0,
    throughAngle:0,
    label: null,

    init:function() {
                this.label = cc.LabelTTF.create("", "Arial", 12);
        this._super();
        this.label.setPosition(0, 10);
        this.addChild(this.label);


    },

    draw:function() {
        this._super();
        this.drawSector(cc.p(0,0), 30, this.startAngle, 3/2 * Math.PI, true, cc.c4f(1,0,0,1), 2, cc.c4f(0,1,0,1));
    },

});


/*cc.DrawNode.extend({
    displaySameAngles:false,
    numberOfArcs:0,

    draw:function() {
        var ctx = document.getElementById('gameCanvas').getContext('2d');
        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect(10, 10, 55, 50);
    },
    

    draw:function () {
        this.drawSector(cc.p(0,0), 100, 0, 5, true, cc.c4f(1,0,0,1), 1, cc.c4f(0,1,0,1));
    },

        var angle = new cc.DrawNode.create();
        this.addChild(angle);
        angle.drawSector(cc.p(100, 100), 100, 0, 5, true, cc.c4f(1,0,0,1), 1, cc.c4f(0,1,0,1));
        //angle.drawSegment(cc.p(100, 100), cc.p(500, 500), 0.5, cc.c4f(1, 0, 0, 1));
        
})
*/

/*
function Angle() {
    this.displaySameAngles = false;
    this.numberOfArcs = 0;
}
*/

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
/*
enum AngleDisplayTypes {
    none,
    anglesValues,
    sameAngles
}
*/

cc.DrawNode.prototype.drawSector = function(position, radius, startAngle, throughAngle, anticlockwise, fillColour, borderWidth, borderColour) {
    var vertices = [];
    for (var i = 0; i < 100; i++) {
        var multiplier = anticlockwise ? -1 : 1;
        var angle = startAngle + multiplier * (throughAngle * i)/100;
        var xPosition = position.x + radius * Math.sin(angle);
        var yPosition = position.y + radius * Math.cos(angle);
        var vertex = cc.p(xPosition, yPosition);
        vertices.push(vertex);
    };
    vertices.push(position);
    this.drawPoly(vertices, fillColour, 1, borderColour);
}








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
        //var squareGeoboardButton = new cc.MenuItemFont.create("Square", 'squareGeoboardTapped', this);

        var squareGeoboardButton = new cc.MenuItemImage.create(s_square_geoboard_button, s_square_geoboard_button, 'squareGeoboardTapped', this);

        var triangleGeoboardButton = new cc.MenuItemImage.create(s_triangle_geoboard_button, s_triangle_geoboard_button, 'triangleGeoboardTapped', this);
        triangleGeoboardButton.setPosition(0, -110);

        var circleGeoboardButton = new cc.MenuItemImage.create(s_circle_geoboard_button, s_circle_geoboard_button, 'circleGeoboardTapped', this);
        circleGeoboardButton.setScaleX(0.75);
        circleGeoboardButton.setPosition(-30, -220);

        var centrePinButton = new cc.MenuItemImage.create(s_centre_pin_button, s_centre_pin_button, 'centrePinTapped', this);
        centrePinButton.setPosition(85, -190);

        var addPinButton = new cc.MenuItemImage.create(s_add_pin_button, s_add_pin_button, 'addPinTapped', this);
        addPinButton.setPosition(85, -225);

        var removePinButton = new cc.MenuItemImage.create(s_remove_pin_button, s_remove_pin_button, 'removePinTapped', this);
        removePinButton.setPosition(85, -260);

        var geoboardTypesMenu = new cc.Menu.create(squareGeoboardButton, triangleGeoboardButton, circleGeoboardButton,
            centrePinButton, addPinButton, removePinButton);
        geoboardTypesMenu.setPosition(110, 500);
        this.addChild(geoboardTypesMenu);

        var addBandButton = new cc.MenuItemImage.create(s_add_band_button, s_add_band_button, 'addBandTapped', this);
        addBandButton.setPosition(0, 10);
        addBandButton.setScaleY(0.75);

        var removeBandButton = new cc.MenuItemImage.create(s_remove_band_button, s_remove_band_button, 'removeBandTapped', this);
        removeBandButton.setPosition(0, -75);
        removeBandButton.setScaleY(0.75);

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

        var shapeIndicator = new cc.Sprite();
        shapeIndicator.initWithFile(s_property_background);
        shapeIndicator.setPosition(0, -90);
        this.shapeIndicatorLabel = new cc.LabelTTF.create("", "Arial", 24);
        this.shapeIndicatorLabel.setColor(0,0,0);
        this.shapeIndicatorLabel.setPosition(shapeIndicator.getBoundingBox().width/2, shapeIndicator.getBoundingBox().height/2);
        shapeIndicator.addChild(this.shapeIndicatorLabel);
        propertiesIndicator.addChild(shapeIndicator);

        var perimeterIndicator = new cc.Sprite();
        perimeterIndicator.initWithFile(s_property_background);
        perimeterIndicator.setPosition(0, -180);        
        var perimeterLabel = new cc.LabelTTF.create("Perimeter", "Arial", 24);
        perimeterLabel.setColor(0,0,0);
        perimeterLabel.setPosition(perimeterIndicator.getBoundingBox().width/2, 2/3 * perimeterIndicator.getBoundingBox().height)
        perimeterIndicator.addChild(perimeterLabel);
        this.perimeterIndicatorLabel = new cc.LabelTTF.create("", "Arial", 24);
        this.perimeterIndicatorLabel.setColor(0,0,0);
        this.perimeterIndicatorLabel.setPosition(perimeterIndicator.getBoundingBox().width/2, 1/3 * perimeterIndicator.getBoundingBox().height);
        perimeterIndicator.addChild(this.perimeterIndicatorLabel);
        propertiesIndicator.addChild(perimeterIndicator);

        var areaIndicator = new cc.Sprite();
        areaIndicator.initWithFile(s_property_background);
        areaIndicator.setPosition(0, -270);
        var areaLabel = new cc.LabelTTF.create("Area", "Arial", 24);
        areaLabel.setColor(0,0,0);
        areaLabel.setPosition(areaIndicator.getBoundingBox().width/2, 2/3 * areaIndicator.getBoundingBox().height);
        areaIndicator.addChild(areaLabel);
        this.areaIndicatorLabel = new cc.LabelTTF.create("", "Arial", 24);
        this.areaIndicatorLabel.setColor(0,0,0);
        this.areaIndicatorLabel.setPosition(areaIndicator.getBoundingBox().width/2, 1/3 * areaIndicator.getBoundingBox().height);
        areaIndicator.addChild(this.areaIndicatorLabel);
        propertiesIndicator.addChild(areaIndicator);

        var showAnglesButtonUnselected = cc.MenuItemImage.create(s_show_angles_button, s_show_angles_button, null, null);
        var showAnglesButtonSelected = cc.MenuItemImage.create(s_show_angles_button_selected, s_show_angles_button_selected, null, null);
        this.showAnglesButton = cc.MenuItemToggle.create(showAnglesButtonUnselected, showAnglesButtonSelected, this.showAnglesTapped, this);
        this.showAnglesButton.setPosition(-210, 50);

        var showSameAnglesButtonUnselected = cc.MenuItemImage.create(s_show_same_angles_button, s_show_same_angles_button, null, null);
        var showSameAnglesButtonSelected = cc.MenuItemImage.create(s_show_same_angles_button_selected, s_show_same_angles_button_selected, null, null);
        this.showSameAnglesButton = cc.MenuItemToggle.create(showSameAnglesButtonUnselected, showSameAnglesButtonSelected, this.showSameAnglesTapped, this);
        this.showSameAnglesButton.setPosition(40, 50);

        var showSideLengthsButtonUnselected = cc.MenuItemImage.create(s_show_side_lengths_button, s_show_side_lengths_button, null, null);
        var showSideLengthsButtonSelected = cc.MenuItemImage.create(s_show_side_lengths_button_selected, s_show_side_lengths_button_selected, null, null);
        this.showSideLengthsButton = cc.MenuItemToggle.create(showSideLengthsButtonUnselected, showSideLengthsButtonSelected, this.showSideLengthsTapped, this);
        this.showSideLengthsButton.setPosition(-245, -30);

        var showSameSideLengthsButtonUnselected = cc.MenuItemImage.create(s_show_same_side_lengths_button, s_show_same_side_lengths_button, null, null);
        var showSameSideLengthsButtonSelected = cc.MenuItemImage.create(s_show_same_side_lengths_button_selected, s_show_side_lengths_button_selected, null, null);
        this.showSameSideLengthsButton = cc.MenuItemToggle.create(showSameSideLengthsButtonUnselected, showSameSideLengthsButtonSelected, this.showSameSideLengthsTapped, this);
        this.showSameSideLengthsButton.setPosition(-35, -30);

        var showParallelSidesButtonUnselected = cc.MenuItemImage.create(s_show_parallel_sides_button, s_show_parallel_sides_button, null, null);
        var showParallelSidesButtonSelected = cc.MenuItemImage.create(s_show_parallel_sides_button_selected, s_show_parallel_sides_button_selected, null, null);
        this.showParallelSidesButton = cc.MenuItemToggle.create(showParallelSidesButtonUnselected, showParallelSidesButtonSelected, this.showParallelSidesTapped, this);
        this.showParallelSidesButton.setPosition(175, -30);

        var bandPropertiesMenu = cc.Menu.create(this.showAnglesButton, this.showSameAnglesButton,
        this.showSideLengthsButton, this.showSameSideLengthsButton, this.showParallelSidesButton);
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
            this.geoboard.setPropertyIndicatorsForSelectedBand();
            this.clearBandSelectButtons();
        }
    },

    triangleGeoboardTapped:function() {
        if (!(this.geoboard instanceof TriangleGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new TriangleGeoboard();
            this.setupGeoboard();
            this.geoboard.setPropertyIndicatorsForSelectedBand();
            this.clearBandSelectButtons();
        };
    },

    circleGeoboardTapped:function() {
        if (!(this.geoboard instanceof CircleGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new CircleGeoboard(this.circleNumberOfPins, this.circleIncludeCentre);
            this.setupGeoboard();
            this.geoboard.setPropertyIndicatorsForSelectedBand();
            this.clearBandSelectButtons();
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
            var selectBandButton = new cc.MenuItemImage.create(s_select_band_button, s_select_band_button, "selectBandFromButton", this.geoboard);
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
        this.geoboard.toggleAngleDisplay("angleValues");
        this.showSameAnglesButton.setSelectedIndex(0);
    },

    showSameAnglesTapped:function() {
        this.geoboard.toggleAngleDisplay("sameAngles");
        this.showAnglesButton.setSelectedIndex(0);
    },

    showSideLengthsTapped:function() {
        this.geoboard.toggleSideDisplay("sideLengthValues");
        this.showSameSideLengthsButton.setSelectedIndex(0);
        this.showParallelSidesButton.setSelectedIndex(0);
    },

    showSameSideLengthsTapped:function() {
        this.geoboard.toggleSideDisplay("sameSideLengths");
        this.showSideLengthsButton.setSelectedIndex(0);
        this.showParallelSidesButton.setSelectedIndex(0);

    },

    showParallelSidesTapped:function() {
        this.geoboard.toggleSideDisplay("parallelSides");
        this.showSideLengthsButton.setSelectedIndex(0);
        this.showSameSideLengthsButton.setSelectedIndex(0);
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

    setShapeIndicatorWith:function(string) {
        this.shapeIndicatorLabel.setString(string);
    },

    setPerimeterIndicatorWith:function(perimeter) {
        var string = "";
        if (perimeter !== null) {
            string = (Math.round(perimeter * 10000)/10000).toString();
        };
        this.perimeterIndicatorLabel.setString(string);
    },

    setAreaIndicatorWith:function(area) {
        var string = "";
        if (area !== null) {
            string = (Math.round(area * 10000)/10000).toString();
        };
        this.areaIndicatorLabel.setString(string);

    },

    clearBandSelectButtons:function() {
        this.selectBandMenu.removeAllChildren();
        this.selectBandButtons = [];
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

    this.angleDisplay = "none";
    this.sideDisplay = "none";

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
                    break;
                };
            };
            if (!placedOnPin) {
                this.movingBand.removeMovingPin();
            };
            this.movingBand.processEnd(touchLocation);
            this.groupSameAngles();
            this.groupSameSideLengths();
            this.groupParallelSides();
            this.setPropertyIndicatorsForSelectedBand();
        };
        this.setAllDrawAngles();
        this.movingBand = null;
    }

    this.setMovingBand = function(band) {
        this.movingBand = band;
        this.selectBand(band);
    }

    this.setAllDrawAngles = function() {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            for (var j = 0; j < band.angles.length; j++) {
                band.angles[j].setDrawAngle;
            };
        };
    }

    this.newBand = function() {
        var firstPin = this.pins[0];
        var secondPin = this.pins[1];
        var band = new Band();
        band.setupWithGeoboardAndPins(this, [firstPin, secondPin]);
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
        for (var i = 0; i < band.pins.length; i++) {
            var pin = band.pins[i];
            var colour = this.colourForPin(pin);
            pin.colourPin(colour);
        };
        this.groupSameAngles();
        this.groupSameSideLengths();
        this.groupParallelSides();

    }

    this.selectNoBand = function() {
        this.border.setColor(cc.c3b(255, 255, 255));
    }

    this.removeSelectedBand = function() {
        if (this.bands.length > 0) {
            this.removeBand(0);
        };
    }

    this.selectBand = function(band) {

        var index = this.bands.indexOf(band);
        this.bands.splice(index, 1);
        this.bands.splice(0, 0, band);
        this.setBandsZIndexToPriorityOrder();
        this.border.setColor(band.colour);
        this.setPropertyIndicatorsForSelectedBand();
        this.bands[0].colourAllPins();
        
               /*
        for (var i = 0; i < band.pins.length; i++) {
            band.pins[i].colourPin(band.colour);
        };
        */
        
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

    this.setAllProperties = function() {
        this.setPropertyIndicatorsForSelectedBand();
        this.groupSameAngles();
        this.groupSameSideLengths();
        this.groupParallelSides();
        this.setupAngleDisplay();
        this.setupSideDisplay();
    }

    this.setPropertyIndicatorsForSelectedBand = function() {
        if (this.bands.length > 0) {
            var band = this.bands[0];
            this.layer.setRegularIndicatorWith(band.getRegular());
            this.layer.setShapeIndicatorWith(band.getShape());
            this.layer.setPerimeterIndicatorWith(band.getPerimeter());
            this.layer.setAreaIndicatorWith(band.getArea());
        } else {
            this.layer.setRegularIndicatorWith("");
            this.layer.setShapeIndicatorWith("");
            this.layer.setPerimeterIndicatorWith(null);
            this.layer.setAreaIndicatorWith(null);
        };
    }

    this.toggleAngleDisplay = function(string) {
        if (this.angleDisplay === string) {
            this.angleDisplay = "none"
        } else {
            this.angleDisplay = string;
        };
        this.setupAngleDisplay();
    }

    this.setupAngleDisplay = function() {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            if (this.angleDisplay === "angleValues") {
                band.angleNode.setVisible(true);
                band.displaySameAngles(false)
            } else if (this.angleDisplay === "sameAngles") {
                band.angleNode.setVisible(true);
                band.displaySameAngles(true);
            } else {    
                band.angleNode.setVisible(false);
            };
            for (var j = 0; j < band.angles.length; j++) {
                band.angles[j].setDrawAngle();
            };
        };
        this.setAllDrawAngles();
    }

    this.toggleSideDisplay = function(string) {
        if (this.sideDisplay === string) {
            this.sideDisplay = "none";
        } else {
            this.sideDisplay = string;
        };
        this.setupSideDisplay();
    }

    this.setupSideDisplay = function() {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.sideLengthsNode.setVisible(false);
            band.sameSideLengthNotchesVisible(false);
            band.parallelSideArrowsVisible(false);
            var sideDisplay = this.sideDisplay;
            if (sideDisplay === "sideLengthValues") {
                band.sideLengthsNode.setVisible(true);
            } else if (sideDisplay === "sameSideLengths") {
                band.sameSideLengthNotchesVisible(true);
            } else if (sideDisplay === "parallelSides") {
                band.parallelSideArrowsVisible(true);
            }
        };
    }

    this.groupSameAngles = function() {
        var angles = [];
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.setupAngles();
            angles = angles.concat(band.angles);
        };
        var numberOfArcs = 1;
        while(angles.length > 0) {
            var thisAngle = angles[0];
            var sameAngles = [];
            sameAngles.push(thisAngle);
            for (var i = 1; i < angles.length; i++) {
                var otherAngle = angles[i];
                if (Math.abs(thisAngle.throughAngle - otherAngle.throughAngle) < 0.0001) {
                    sameAngles.push(otherAngle);
                };
            };
            if (sameAngles.length > 1) {
                for (var i = 0; i < sameAngles.length; i++) {
                    var angle = sameAngles[i];
                    angle.numberOfArcs = numberOfArcs;
                    angle.setDrawAngle();
                };
                numberOfArcs++;
            };
            for (var i = 0; i < sameAngles.length; i++) {
                var index = angles.indexOf(sameAngles[i]);
                angles.splice(index, 1);
            };
        }

    }

    this.groupSameSideLengths = function() {
        var sides = [];
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i]
            band.clearSameSideLengthNotches();
            band.setupSideLengths();
            if (band.pins.length > 2) {
                sides = sides.concat(band.bandParts);
            } else if (band.pins.length === 2) {
                sides.push(band.bandParts[0]);
            };
        };
        var numberOfNotches = 1;
        while(sides.length > 0) {
            var thisSide = sides[0];
            var sameSideLengths = [];
            sameSideLengths.push(thisSide);
            for (var i = 1; i < sides.length; i++) {
                var otherSide = sides[i];
                if (Math.abs(thisSide.length() - otherSide.length()) < 0.0001) {
                    sameSideLengths.push(otherSide);
                };
            };
            if (sameSideLengths.length > 1) {
                for (var i = 0; i < sameSideLengths.length; i++) {
                    var side = sameSideLengths[i];
                    side.addNotches(numberOfNotches);
                };
                numberOfNotches++;
            };
            for (var i = 0; i < sameSideLengths.length; i++) {
                var index = sides.indexOf(sameSideLengths[i]);
                sides.splice(index, 1);
            };
        }
    }

    this.groupParallelSides = function() {
        var sides = [];
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.clearParallelSideArrows();
            if (band.pins.length > 2) {
                sides = sides.concat(band.bandParts);
            } else if (band.pins.length === 2) {
                sides.push(band.bandParts[0]);
            };
        };
        var numberOfArrows = 1;
        while(sides.length > 0) {
            var thisSide = sides[0];
            var parallelSidesSameOrientation = [];
            var parallelSidesReverseOrientation = [];
            parallelSidesSameOrientation.push(thisSide);
            for (var i = 1; i < sides.length; i++) {
                var otherSide = sides[i];
                if (thisSide.parallelTo(otherSide)) {
                    if (Math.abs(thisSide.bandPartNode.getRotation() - otherSide.bandPartNode.getRotation()) < 0.0001) {
                        parallelSidesSameOrientation.push(otherSide);
                    } else {
                        parallelSidesReverseOrientation.push(otherSide);
                    };
                };
            };
            if (parallelSidesSameOrientation.length + parallelSidesReverseOrientation.length > 1) {
                for (var i = 0; i < parallelSidesSameOrientation.length; i++) {
                    parallelSidesSameOrientation[i].addArrows(numberOfArrows, true);
                };
                for (var i = 0; i < parallelSidesReverseOrientation.length; i++) {
                    parallelSidesReverseOrientation[i].addArrows(numberOfArrows, false);
                };
                numberOfArrows++;
            };
            for (var i = 0; i < parallelSidesSameOrientation.length; i++) {
                var index = sides.indexOf(parallelSidesSameOrientation[i]);
                sides.splice(index, 1);
            };
            for (var i = 0; i < parallelSidesReverseOrientation.length; i++) {
                var index = sides.indexOf(parallelSidesReverseOrientation[i]);
                sides.splice(index, 1);
            };
        }
    }

    this.colourForPin = function(pin) {
        var colour = null;
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i]
            if (band.pins.indexOf(pin) !== -1) {
                colour = band.colour;
                break;
            };
        };
        return colour;
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
        this.pins.splice(0, 0, pin);
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
        this.removeDeletedPinFromBands(pinToDelete);
        pinToDelete.sprite.removeFromParent();
    }

    this.removeDeletedPinFromBands = function(pinToDelete) {
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
            band.setupAngles();
            band.setupSideLengths();
        };
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
            band.setupAngles();
            band.setupSideLengths();
            band.dirtyProperties = true;
        };
        this.groupSameAngles();
        this.groupSameSideLengths();
        this.groupParallelSides();
        this.setPropertyIndicatorsForSelectedBand();
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
        for (var i = 0; i < this.bands.length; i++) {
            this.bands[i].dirtyProperties = true;
        };
        this.numberOfPins--;
        this.positionEdgePins();
        this.removeDeletedPinFromBands(pinToDelete);
        pinToDelete.sprite.removeFromParent();
        this.groupSameAngles();
        this.groupSameSideLengths();
        this.groupParallelSides();
        this.setPropertyIndicatorsForSelectedBand();
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

    this.colourPin = function(colour) {
        if (colour === null) {
            var pinTexture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(s_pin));
            this.sprite.setTexture(pinTexture);
            this.sprite.setColor(cc.c4f(255, 255, 255, 255));
        } else {
            var whitePinTexture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(s_white_pin));
            this.sprite.setTexture(whitePinTexture);
            this.sprite.setColor(colour);
            this.sprite.setOpacity(255);
        };
    }
}

function Band() {
    this.bandNode = new cc.Node();
    this.bandPartsNode = new cc.Node();
    this.bandNode.addChild(this.bandPartsNode);
    this.bandParts = new Array();
    this.movingPin = null;
    this.sideLengthsLabels = new Array();

    this.dirtyProperties = true;
    this.regular = null;
    this.shape = null;
    this.perimeter = null;
    this.area = null;


    var red = 0, green = 0, blue = 0;
    while (red + green + blue < 256) {
        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);
    }
    this.colour = cc.c4f(red, green, blue, 255);

    this.setupWithGeoboardAndPins = function(geoboard, pins) {
        this.geoboard = geoboard;
        this.pins = pins;
        this.bandParts = new Array();
        this.geoboard.addBand(this);

        this.setupBandParts();
        this.setupPropertiesNode();
    }

    this.setupBandParts = function() {
        this.bandParts = [];
        this.bandPartsNode.removeAllChildren();
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
        //bandPart.sprite.setOpacity(255);
        this.bandPartsNode.addChild(bandPart.baseNode);
        this.bandParts.push(bandPart);
        return bandPart;
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
        var angleNodeVisible = this.geoboard.angleDisplay === "none" ? false : true;
        this.angleNode.setVisible(angleNodeVisible);
        this.angles = new Array();
        this.propertiesNode.addChild(this.angleNode);
        this.setupAngles();

        this.sideLengthsNode = new cc.Node();
        this.propertiesNode.addChild(this.sideLengthsNode);
        this.sideLengthsNode.setVisible(false);
        this.setupSideLengths();

        this.sameSideLengthNotches = new Array();
        this.geoboard.groupSameSideLengths()

        this.parallelSideArrows = new Array();
        this.geoboard.groupParallelSides();
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
            this.setupAngles();
            this.setupSideLengths();
        };
    }

    this.unpinBandFromPin = function(index) {
        var pin = this.pins[index];
        this.movingPin = new Pin();
        this.movingPin.colourPin(this.colour);
        this.movingPin.sprite.setPosition(pin.sprite.getPosition());
        this.pins.splice(index, 1, this.movingPin);
        this.geoboard.background.addChild(this.movingPin.sprite);
        var pinColour = this.geoboard.colourForPin(pin);
        pin.colourPin(pinColour);
    }

    this.splitBandPart = function(index, touchLocation) {
        var bandPart = this.bandParts[index];
        this.movingPin = new Pin();
        this.movingPin.colourPin(this.colour);
        var pinPosition = this.bandNode.convertToNodeSpace(touchLocation);
        this.movingPin.sprite.setPosition(pinPosition);
        this.geoboard.background.addChild(this.movingPin.sprite);
        this.pins.splice(index + 1, 0, this.movingPin);
    }

    this.processMove = function(touchLocation) {
        this.movingPin.sprite.setPosition(touchLocation);
        this.setPositionAndRotationOfBandParts();
        this.setAngleValues();
        this.setSideLengthValues();
    }

    this.processEnd = function(touchLocation) {
        this.movingPin.sprite.removeFromParent();
        this.movingPin = null;
        this.setupBandParts();
        this.setPositionAndRotationOfBandParts();
        this.setupAngles();
        this.cleanPins();
        this.geoboard.setAllProperties();
    }

    this.pinBandOnPin = function(pin) {
        var movingPinIndex = this.pins.indexOf(this.movingPin);
        this.pins.splice(movingPinIndex, 1, pin);
        pin.colourPin(this.colour);
        this.dirtyProperties = true;
    }

    this.removeMovingPin = function() {
        var index = this.pins.indexOf(this.movingPin);
        this.removePin(index);
        this.movingPin.sprite.removeFromParent();
        this.dirtyProperties = true;
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
            this.setupAngles();

            var indexOfStraightThroughPin = this.indexOfStraightThroughPin();
            while (indexOfStraightThroughPin != -1) {
                var pin = this.pins[indexOfStraightThroughPin];
                var pinColour = this.geoboard.colourForPin(pin);
                pin.colourPin(pinColour);
                this.pins.splice(indexOfStraightThroughPin, 1);
                this.setupBandParts();
                this.setupAngles();
                indexOfStraightThroughPin = this.indexOfStraightThroughPin();
            }
        };
    }

    this.indexOfStraightThroughPin = function() {
        var indexToReturn = -1;
        for (var i = 0; i < this.pins.length; i++) {
            var currentPart = this.bandParts[i];
            var nextPart = this.bandParts[(i+1) % this.bandParts.length];
            var currentRotation = currentPart.sprite.getParent().getRotation();
            if (currentRotation < 0) {
                currentRotation += 360;
            };
            var nextRotation = nextPart.sprite.getParent().getRotation();
            if (nextRotation < 0) {
                nextRotation += 360;
            };
            if (this.closeFloats(currentRotation, nextRotation)) {
                indexToReturn = (i+1) % this.pins.length;
            };
        };
        return indexToReturn;
    }

    this.colourAllPins = function() {
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            pin.colourPin(this.colour);
        };
    }

    this.setupAngles = function() {
        this.angles = [];
        this.angleNode.removeAllChildren();
        if (this.pins.length > 1) {
            for (var i = 0; i < this.pins.length; i++) {
                var angle = new Angle();
                angle.init();
                angle.setColour(this.colour);
                var displaySameAngles = this.geoboard.angleDisplay === "sameAngles";
                angle.displaySameAngles = displaySameAngles;
                angle.background.setVisible(!displaySameAngles);
                this.angles.push(angle);
                var pin = this.pins[i];
                angle.setPosition(pin.sprite.getPosition());
                this.angleNode.addChild(angle);
            };
        }
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
            angle.setDrawAngle();
            var pin = this.pins[i];
            angle.setPosition(pin.sprite.getPosition());
            totalAngle += Math.PI - thisAngle;
            var stringToSet;
            if (angle.throughAngle === 0) {
                stringToSet = "0";
            } else {
                stringToSet = (Math.round(cc.RADIANS_TO_DEGREES(angle.throughAngle)*100)/100).toString();
            };
            angle.label.setString(stringToSet);
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

    this.displaySameAngles = function(same) {
        for (var i = 0; i < this.angles.length; i++) {
            var angle = this.angles[i]
            angle.displaySameAngles = same;
            angle.background.setVisible(!same);
        }
    }

    this.setupSideLengths = function() {
        this.sideLengthsNode.removeAllChildren();
        this.sideLengthsLabels = [];
        for (var i = 0; i < this.bandParts.length; i++) {
            var bandPart = this.bandParts[i];
            var label = cc.LabelTTF.create("", "Arial", 12);
            label.setColor(cc.c4f(0,0,0,1));
            var labelBackground = new cc.Sprite();
            labelBackground.initWithFile(s_side_length_background);
            labelBackground.setColor(this.colour);
            this.sideLengthsLabels.push(label);
            label.setPosition(labelBackground.getContentSize().width * labelBackground.getScaleX()/2,
                labelBackground.getContentSize().height * labelBackground.getScaleY()/2);
            labelBackground.addChild(label);
            this.sideLengthsNode.addChild(labelBackground);
        };
        this.setSideLengthValues();
    }

    this.setSideLengthValues = function() {
        for (var i = 0; i < this.bandParts.length; i++) {
            var bandPart = this.bandParts[i];
            var length = bandPart.length();
            var lengthString;
            if (length < 0.0001) {
                lengthString = "0";
            } else {
                lengthString = (Math.round(length*100)/100).toString();
            };
            var label = this.sideLengthsLabels[i];
            var labelXPosition = (bandPart.fromPin.sprite.getPosition().x + bandPart.toPin.sprite.getPosition().x)/2.0;
            var labelYPosition = (bandPart.fromPin.sprite.getPosition().y + bandPart.toPin.sprite.getPosition().y)/2.0;
            label.getParent().setPosition(labelXPosition, labelYPosition);
            label.setString(lengthString);
        };
    }

    this.clearSameSideLengthNotches = function() {
        for (var i = 0; i < this.sameSideLengthNotches.length; i++) {
            this.sameSideLengthNotches[i].removeFromParent();
        };
        this.sameSideLengthNotches = [];
    }

    this.sameSideLengthNotchesVisible = function(visible) {
        for (var i = 0; i < this.bandParts.length; i++) {
            this.bandParts[i].notchNode.setVisible(visible);
        };
    }

    this.clearParallelSideArrows = function() {
        for (var i = 0; i < this.parallelSideArrows.length; i++) {
            this.parallelSideArrows[i].removeFromParent();
        };
        this.parallelSideArrows = [];
    }

    this.parallelSideArrowsVisible = function(visible) {
        for (var i = 0; i < this.bandParts.length; i++) {
            this.bandParts[i].arrowNode.setVisible(visible);
        };
    }

    this.propertiesClean = function() {
        this.regularClean();
        this.shapeClean();
        this.perimeterClean();
        this.areaClean();
        this.dirtyProperties = false;
    }

    this.getRegular = function() {
        if (this.dirtyProperties) {
            this.propertiesClean();
        };
        return this.regular;
    }

    this.getShape = function() {
        if (this.dirtyProperties) {
            this.propertiesClean();
        }
        return this.shape;
    }

    this.getPerimeter = function() {
        if (this.dirtyProperties) {
            this.propertiesClean();
        };
        return this.perimeter;
    }

    this.getArea = function() {
        if (this.dirtyProperties) {
            this.propertiesClean();
        };
        return this.area;
    }

    this.regularClean = function() {
        var regular;
        if (this.bandParts.length < 3) {
            regular = "";
        } else {
            regular = "Regular";
            var firstBandPart = this.bandParts[0];
            var sideLength = firstBandPart.length();
            for (var i = 1; i < this.bandParts.length; i++) {
                var bandPart = this.bandParts[i];
                var thisLength = bandPart.length();
                if (Math.abs(thisLength - sideLength) > 0.0001) {
                    regular = "Irregular";
                    break;
                };
            };
            if (regular) {
                var angle = this.angles[0];
                for (var i = 1; i < this.angles.length; i++) {
                    var thisAngle = this.angles[i];
                    if (Math.abs(angle.throughAngle - thisAngle.throughAngle) > 0.0001) {
                        regular = "Irregular";
                        break;
                    };
                };
            };
        };
        this.regular = regular;
    }

    this.shapeClean = function() {
        var numberOfSides = this.bandParts.length;
        var shapeName = "";
        switch(numberOfSides) {
            case 3:
                shapeName = this.triangleName();
                break;
            case 4:
                shapeName = this.quadrilateralName();
                break;
            case 5:
                shapeName = "Pentagon";
                break;
            case 6:
                shapeName = "Hexagon";
                break;
            case 7:
                shapeName = "Heptagon";
                break;
            case 8 :
                shapeName = "Octagon";
                break;
            case 9:
                shapeName = "Nonagon";
                break;
            case 10:
                shapeName = "Decagon";
                break;
            default:
                if (numberOfSides < 3) {
                    shapeName = "";
                } else if (numberOfSides > 10) {
                    shapeName = "Polygon";
                };
                break;
        }
        this.shape =  shapeName;
    }

    this.triangleName = function() {
        var triangleName = "Scalene triangle";
        var sides = [];
        for (var i = 0; i < 3; i++) {
            sides.push(this.bandParts[i].length());
        };
        sides.sort(function(a,b) {return a-b});
        if (this.closeFloats(sides[0], sides[2])) {
            triangleName = "Equilateral triangle";
        } else if (this.closeFloats(sides[0], sides[1]) || this.closeFloats(sides[1], sides[2])) {
            triangleName = "Isoceles triangle";
        };
        return triangleName;
    }

    this.quadrilateralName = function() {
        var quadrilateralName = "Quadrilateral";
        var angles = [];
        for (var i = 0; i < 4; i++) {
            angles.push(this.angles[i].throughAngle);
        };
        angles.sort(function(a,b) {return a-b});
        var sides = [];
        for (var i = 0; i < this.bandParts.length; i++) {
            sides.push(this.bandParts[i].length());
        };
        sides.sort(function(a,b) {return a-b});

        if (this.closeFloats(angles[0], angles[3]) && this.closeFloats(angles[0], Math.PI/2)) {
            if (this.closeFloats(sides[0], sides[3])) {
                quadrilateralName = "Square";
            } else {
                quadrilateralName = "Rectangle";
            };
        } else {
            if (this.closeFloats(sides[0], sides[3])) {
                quadrilateralName = "Rhombus";
            } else if (this.bandParts[0].parallelTo(this.bandParts[2]) && this.bandParts[1].parallelTo(this.bandParts[3])) {
                quadrilateralName = "Parallelogram";
            } else if (this.bandParts[0].parallelTo(this.bandParts[2]) || this.bandParts[1].parallelTo(this.bandParts[3])) {
                quadrilateralName = "Trapezium";
            } else if ((this.closeFloats(sides[0], sides[1]) && this.closeFloats(sides[2], sides[3])) 
                || (this.closeFloats(sides[1], sides[2]) && this.closeFloats(sides[0], sides[3]))) {
                quadrilateralName = "Kite";
            };
        };
        return quadrilateralName;
    }

    this.perimeterClean = function() {
        var perimeter = null;
        if (!this.edgesCrossOver()) {
            perimeter = 0;
            for (var i = 0; i < this.bandParts.length; i++) {
                perimeter += this.bandParts[i].length();
            };
        }
        this.perimeter = perimeter;
    }

    this.areaClean = function() {
        var area = null;
        if (!this.edgesCrossOver()) {
            var dummyGeoboard = new Geoboard();
            dummyGeoboard.unitDistance = this.geoboard.unitDistance;
            var band = new Band();
            band.geoboard = dummyGeoboard;
            band.pins = this.pins.slice(0);
            band.angleNode = new cc.Node();
            band.setupBandParts();
            band.setupAngles();
            area = band.areaRecursive();
        };
        this.area = area;
    }

    this.areaRecursive = function() {
        var area;
        if (this.pins.length < 3) {
            area = 0;
        } else if (this.pins.length === 3) {
            area = this.areaOfEar(0);
        } else {
            var earPinIndex;
            for (var i = 0; i < this.angles.length; i++) {
                if (this.isEarPin(i)) {
                    earPinIndex = i;
                    break;
                };
            };
            var previousPin = this.pins.indexWraparound(earPinIndex-1);
            var thisPin = this.pins[earPinIndex];
            var nextPin = this.pins.indexWraparound(earPinIndex+1);
            var earArea = this.areaOfEar(earPinIndex);
            this.pins.splice(earPinIndex, 1);
            this.setupBandParts();
            this.setupAngles();
            var remainderArea = this.areaRecursive();
            area = earArea + remainderArea;
        }
        return area;
    }

    this.isEarPin = function(index) {
        var isEarPin = true;
        var angle = this.angles[index];
        if (angle.throughAngle > 180) {
            isEarPin = false;
        } else {
            var previousPin = this.pins.indexWraparound(index-1);
            var nextPin = this.pins.indexWraparound(index+1);
            var bandPart = new BandPart();
            bandPart.setup(this, previousPin, nextPin);
            for (var i = 0; i < this.bandParts.length; i++) {
                var otherBandPart = this.bandParts[i];
                if (bandPart.crosses(otherBandPart)) {
                    isEarPin = false;
                };
            };
        };
        return isEarPin;
    }

    this.areaOfEar = function(index) {
        var fromPart = this.bandParts.indexWraparound(index - 1);
        var toPart = this.bandParts[index];
        var angle = this.angles[index];
        var area = 1/2 * fromPart.length() * toPart.length() * Math.sin(angle.throughAngle);
        return area;
    }

    this.edgesCrossOver = function() {
        var edgesCrossOver = false;
        for (var i = 0; i < this.bandParts.length; i++) {
            var thisBandPart = this.bandParts[i];
            for (var j = i+1; j < this.bandParts.length; j++) {
                var otherBandPart = this.bandParts[j];
                if (thisBandPart.crosses(otherBandPart)) {
                    edgesCrossOver = true;
                    break;
                };
            };
            if (edgesCrossOver) {
                break;
            };
        };
        return edgesCrossOver;
    }
    

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
    this.notchNode = new cc.Node();
    this.baseNode.addChild(this.notchNode);
    this.arrowNode = new cc.Node();
    this.baseNode.addChild(this.arrowNode);

    this.setup = function(band, fromPin, toPin) {
        this.band = band;
        this.fromPin = fromPin;
        this.toPin = toPin;
        this.notchNode.setVisible(this.band.geoboard.sideDisplay === "sameSideLengths");
        this.arrowNode.setVisible(this.band.geoboard.sideDisplay === "parallelSides");
    }

    this.setPositionAndRotation = function() {
        var fromPin = this.fromPin;
        var toPin = this.toPin;
        this.bandPartNode.setPosition(fromPin.sprite.getPosition());
        this.notchNode.setPosition(fromPin.sprite.getPosition());
        this.arrowNode.setPosition(fromPin.sprite.getPosition());
        var xDifference = toPin.sprite.getPosition().x - fromPin.sprite.getPosition().x;
        var yDifference = toPin.sprite.getPosition().y - fromPin.sprite.getPosition().y;
        var angle =  Math.atan2(xDifference, yDifference);
        this.bandPartNode.setRotation(cc.RADIANS_TO_DEGREES(angle));
        this.notchNode.setRotation(cc.RADIANS_TO_DEGREES(angle));
        this.arrowNode.setRotation(cc.RADIANS_TO_DEGREES(angle));
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

    this.addNotches = function(numberOfNotches) {
        this.numberOfIndicators = numberOfNotches;
        var spacing = 8;
        for (var i = 1; i <= numberOfNotches; i++) {
            var notch = new cc.Sprite();
            notch.initWithFile(s_same_side_length_notch);
            notch.setRotation(90);
            var yPosition = this.indicatorYPosition(i, spacing);
            notch.setPosition(0, yPosition);
            notch.setColor(this.band.colour);
            this.notchNode.addChild(notch);
            this.band.sameSideLengthNotches.push(notch);
        };
    }

    this.addArrows = function(numberOfArrows, forward) {
        this.numberOfIndicators = numberOfArrows;
        var spacing = 8;
        for (var i = 1; i <= numberOfArrows; i++) {
            var arrow = new cc.Sprite();
            arrow.initWithFile(s_parallel_side_arrow);
            var rotation = forward ? 90 : -90;
            arrow.setRotation(rotation);
            arrow.setScale(0.5);
            var yPosition = this.indicatorYPosition(i, spacing);
            arrow.setPosition(0, yPosition);
            arrow.setColor(this.band.colour);
            this.arrowNode.addChild(arrow)
            this.band.parallelSideArrows.push(arrow);
        };
    }

    this.indicatorYPosition = function(index, spacing) {
        var halfway = this.sprite.getContentSize().height * this.bandPartNode.getScaleY()/2;
        var offset = (2 * index - this.numberOfIndicators - 1) * spacing/2;
        var yPosition = halfway + offset;
        return yPosition;
    }

    this.parallelTo = function(otherBandPart) {
        var parallel = false;
        var firstRotation = this.bandPartNode.getRotation();
        var secondRotation = otherBandPart.bandPartNode.getRotation();
        if (Math.abs(firstRotation - secondRotation) < 0.0001) {
            parallel = true;
        };
        if (Math.abs(Math.abs(firstRotation - secondRotation) - 180) < 0.0001) {
            parallel = true;
        };
        return parallel;
    }

    this.crosses = function(otherBandPart) {
        /*
        this bandPart from point A (i.e., (a_1, a_2) to B, other bandPart from C to D, this function solves
        (a_1, a_2) + lambda * ((b_1, b_2) - (a_1, a_2)) = (c_1, c_2) + mu * ((d_1, d_2) - (c_1, c_2)), the solution corresponding
        to point where the two lines cross (if they do), and returns true if lambda and mu are both between 0 and 1,
        i.e., the crossing point is between A and B on this bandPart, and C and D on other bandPart.
        */
        var crosses;
        var pointA = this.fromPin.sprite.getPosition();
        var pointB = this.toPin.sprite.getPosition();
        var pointC = otherBandPart.fromPin.sprite.getPosition();
        var pointD = otherBandPart.toPin.sprite.getPosition();

        var thisNumeratorFirst = (pointD.x - pointC.x) * (pointA.y - pointC.y);
        var thisNumeratorSecond = (pointD.y - pointC.y) * (pointA.x - pointC.x);
        var thisNumerator = thisNumeratorFirst - thisNumeratorSecond;

        var otherNumeratorFirst = (pointC.x - pointA.x) * (pointB.y - pointA.y);
        var otherNumeratorSecond = (pointC.y - pointA.y) * (pointB.x - pointA.x);
        var otherNumerator = otherNumeratorFirst - otherNumeratorSecond;

        var denominatorFirst = (pointD.y - pointC.y) * (pointB.x - pointA.x);
        var denominatorSecond = (pointD.x - pointC.x) * (pointB.y - pointA.y);
        var denominator = denominatorFirst - denominatorSecond;
        if (denominator === 0) {
            crosses = false;
        } else {
            var lambda= parseFloat(thisNumerator)/denominator;
            var mu = parseFloat(otherNumerator)/denominator;
            crosses = 0 < lambda && lambda < 1 && 0 < mu && mu < 1;
        };
        return crosses;
    }
}

var Angle = cc.DrawNode.extend({
    startAngle:0,
    throughAngle:0,
    label: null,
    anticlockwise: false,
    colour:null,
    displaySameAngles:null,
    numberOfArcs:0,

    init:function() {
        this._super();
        this.background = new cc.Sprite()
        this.background.initWithFile(s_angle_background);
        this.addChild(this.background);
        this.label = cc.LabelTTF.create("", "Arial", 12);
        this.label.setColor(cc.c4f(0,0,0,1));
        this.background.setPosition(0, 14);
        this.label.setPosition(this.background.getContentSize().width/2, this.background.getContentSize().height/2);
        this.background.addChild(this.label);
    },

    setColour:function(colour) {
        this.colour = colour;
        this.background.setColor(colour);
    },

    setDrawAngle:function() {
        this.clear();
        if (this.displaySameAngles) {
            for (var i = 0; i < this.numberOfArcs; i++) {
                this.drawSector(cc.p(0,0), 25 + 5 * i, this.startAngle, this.throughAngle, this.anticlockwise, 
                    cc.c4f(0,0,0,0), 2, this.colourCorrect());
            };
        } else {
            this.drawSector(cc.p(0,0), 30, this.startAngle, this.throughAngle, this.anticlockwise, this.lightColour(), 2, this.colourCorrect());
        };
    },

    colourCorrect:function() {
        var red = this.colour.r/255;
        var green = this.colour.g/255;
        var blue = this.colour.b/255;
        return cc.c4f(red, green, blue, 1);
    },

    lightColour:function() {
        var red = this.colour.r/255;
        var green = this.colour.g/255;
        var blue = this.colour.b/255;
        return cc.c4f(red, green, blue, 0.5);
    }


});

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

cc.DrawNode.prototype.drawSector = function(position, radius, startAngle, throughAngle, anticlockwise, fillColour, borderWidth, borderColour) {
    var vertices = [];
    for (var i = 0; i <= 100; i++) {
        var multiplier = anticlockwise ? 1 : -1;
        var angle = startAngle + multiplier * (throughAngle * i)/100;
        var xPosition = position.x + radius * Math.sin(angle);
        var yPosition = position.y + radius * Math.cos(angle);
        var vertex = cc.p(xPosition, yPosition);
        vertices.push(vertex);
    };
    vertices.push(position);
    this.drawPoly(vertices, fillColour, 1, borderColour);
}








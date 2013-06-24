var ToolLayer = cc.Layer.extend({

    titleLabel:null,
    clc:null,
    lastcount:null,
    label:null,
    geoboard:null,
    circleNumberOfPins:8,
    circleIncludeCentre:true,
    maxNumberOfBands:9,

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

        clc=cc.Layer.create();
        var background = new cc.Sprite();
        background.initWithFile(s_deep_water_background);
        background.setPosition(size.width/2, size.height/2);
        clc.addChild(background);
        this.addChild(clc,0);
        setupInheritances();

        var title = new cc.Sprite();
        title.initWithFile(s_geoboard_title);
        title.setPosition(485, 700);
        this.addChild(title);

        this.geoboard = new SquareGeoboard();
        this.setupGeoboard();

        this.squareGeoboardButtonBase = new cc.MenuItemImage.create(s_square_geoboard_button_base, s_square_geoboard_button_base, 'squareGeoboardTapped', this);
        var squareGeoboardButton = new cc.Sprite();
        squareGeoboardButton.initWithFile(s_square_geoboard_button);
        squareGeoboardButton.setPosition(this.squareGeoboardButtonBase.getAnchorPointInPoints());
        this.squareGeoboardButtonBase.addChild(squareGeoboardButton);

        this.triangleGeoboardButtonBase = new cc.MenuItemImage.create(s_triangle_geoboard_button_base, s_triangle_geoboard_button_base, 'triangleGeoboardTapped', this);
        var triangleGeoboardButton = new cc.Sprite();
        triangleGeoboardButton.initWithFile(s_triangle_geoboard_button);
        triangleGeoboardButton.setPosition(this.triangleGeoboardButtonBase.getAnchorPointInPoints());
        this.triangleGeoboardButtonBase.addChild(triangleGeoboardButton);
        this.triangleGeoboardButtonBase.setPosition(-15, -100);

        this.circleGeoboardButtonBase = new cc.MenuItemImage.create(s_circle_geoboard_button_base, s_circle_geoboard_button_base, 'circleGeoboardTapped', this);
        var circleGeoboardButton = new cc.Sprite();
        circleGeoboardButton.initWithFile(s_circle_geoboard_button);
        circleGeoboardButton.setPosition(this.circleGeoboardButtonBase.getAnchorPointInPoints());
        this.circleGeoboardButtonBase.addChild(circleGeoboardButton);
        this.circleGeoboardButtonBase.setPosition(-15, -200);
       
        var geoboardTypesMenu = new cc.Menu.create(this.squareGeoboardButtonBase, this.triangleGeoboardButtonBase, this.circleGeoboardButtonBase);
        geoboardTypesMenu.setPosition(this.squareGeoboardButtonBase.getContentSize().width/2, 580);
        this.addChild(geoboardTypesMenu);

        var centrePinButton = new cc.MenuItemImage.create(s_centre_pin_button, s_centre_pin_button, 'centrePinTapped', this);
        centrePinButton.setPosition(0,0);

        var removePinButton = new cc.MenuItemImage.create(s_remove_pin_button, s_remove_pin_button, 'removePinTapped', this);
        removePinButton.setPosition(80, 0);

        var numberBox = new cc.Sprite();
        numberBox.initWithFile(s_number_box);
        numberBox.setPosition(675, 390);
        this.numberOfPinsLabel = cc.LabelTTF.create(this.circleNumberOfPins, "mikadoBold", 24);
        var boxSize = numberBox.getContentSize();
        this.numberOfPinsLabel.setPosition(boxSize.width/2, boxSize.height/2);
        this.numberOfPinsLabel.setColor(cc.c3b(0,0,0));
        numberBox.addChild(this.numberOfPinsLabel);

        var addPinButton = new cc.MenuItemImage.create(s_add_pin_button, s_add_pin_button, 'addPinTapped', this);
        addPinButton.setPosition(250, 0);


        var circleControlsMenu = new cc.Menu.create(centrePinButton, addPinButton, removePinButton);

        this.circleControlsNode = new cc.Node();
        this.circleControlsNode.addChild(circleControlsMenu);
        this.circleControlsNode.addChild(numberBox);
        this.circleControlsNode.setPosition(-450, -500);
        this.addChild(this.circleControlsNode);


        var addBandButtonBase = new cc.MenuItemImage.create(s_add_band_button_base, s_add_band_button_base, 'addBandTapped', this);
        var addBandButton = new cc.Sprite();
        addBandButton.initWithFile(s_add_band_button);
        addBandButton.setPosition(addBandButtonBase.getAnchorPointInPoints());
        addBandButtonBase.setPosition(0, -125);
        addBandButtonBase.addChild(addBandButton);

        var removeBandButtonBase = new cc.MenuItemImage.create(s_remove_band_button_base, s_remove_band_button_base, 'removeBandTapped', this);
        var removeBandButton = new cc.Sprite();
        removeBandButton.initWithFile(s_remove_band_button);
        removeBandButton.setPosition(removeBandButtonBase.getAnchorPointInPoints());
        removeBandButtonBase.setPosition(0, 10);
        removeBandButtonBase.addChild(removeBandButton);

        var addRemoveBandMenu = new cc.Menu.create(addBandButtonBase, removeBandButtonBase);
        addRemoveBandMenu.setPosition(addBandButtonBase.getContentSize().width/2, 270);
        this.addChild(addRemoveBandMenu);

        this.selectBandMenu = new cc.Menu.create();
        this.selectBandMenu.setPosition(210, 600);
        this.addChild(this.selectBandMenu);
        this.selectBandButtons = new Array();
        this.positionBandSelectButtons();

        this.propertyDisplay = PropertyDisplays.NONE;

        this.propertyButtonsMenu = cc.Menu.create();
        this.propertyButtonsMenu.setPosition(950, 590);
        this.addChild(this.propertyButtonsMenu);
        this.propertyButtons = [];

        this.buttonYPosition = 0;

        this.regularButton = this.setupPropertyButton(this.regularButtonTapped, "Regular?");
        this.shapeButton = this.setupPropertyButton(this.shapeButtonTapped, "Shape");
        this.perimeterButton = this.setupPropertyButton(this.perimeterButtonTapped, "Perimeter");
        this.areaButton = this.setupPropertyButton(this.areaButtonTapped, "Area");
        this.showAngleButton = this.setupPropertyButton(this.showAnglesTapped, "Angles");
        this.showSameAnglesButton = this.setupPropertyButton(this.showSameAnglesTapped, "Equal angles");
        this.showSideLengthsButton = this.setupPropertyButton(this.showSideLengthsTapped, "Side lengths");
        this.showSameSideLengthsButton = this.setupPropertyButton(this.showSameSideLengthsTapped, "Equal sides");
        this.showParallelSidesButton = this.setupPropertyButton(this.showParallelSidesTapped, "Parallel sides");

        return this;
    },

    setupPropertyButton:function(selector, label) {
        var centreOfIndicator = cc.p(62, 35);
        var button = cc.MenuItemImage.create(s_property_background, s_property_background, selector, this);
        button.label = new cc.LabelTTF.create(label, 'mikadoBold');
        button.label.setPosition(centreOfIndicator);
        button.label.setColor(0,0,0);
        button.addChild(button.label);
        button.setPosition(200, this.buttonYPosition);
        button.highlight = false;
        this.propertyButtonsMenu.addChild(button);
        this.propertyButtons.push(button);
        this.buttonYPosition -= 55;
        return button;
    },

    setupGeoboard:function (touches, event) {
        var size = cc.Director.getInstance().getWinSize();
        this.geoboard.background.setPosition(size.width/2, size.height * 0.4);
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
        if (this.geoboard instanceof CircleGeoboard) {
            var action = cc.MoveBy.create(0.3, cc.p(0, -180));
            this.circleControlsNode.runAction(action);
        };
        if(!(this.geoboard instanceof SquareGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new SquareGeoboard();
            this.setupGeoboard();
            this.geoboard.setPropertyIndicatorsForSelectedBand();
            this.clearBandSelectButtons();
            this.clearPropertyButtonHighlights();
            this.displaySelectedProperty();
            this.selectGeoboardButton(this.squareGeoboardButtonBase);
            this.movePropertyButtonsOffscreen();
            this.positionBandSelectButtons();
        }
    },

    triangleGeoboardTapped:function() {
        if (this.geoboard instanceof CircleGeoboard) {
            var action = cc.MoveBy.create(0.3, cc.p(0, -180));
            this.circleControlsNode.runAction(action);
        };
        if (!(this.geoboard instanceof TriangleGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new TriangleGeoboard();
            this.setupGeoboard();
            this.geoboard.setPropertyIndicatorsForSelectedBand();
            this.clearBandSelectButtons();
            this.clearPropertyButtonHighlights();
            this.displaySelectedProperty();
            this.selectGeoboardButton(this.triangleGeoboardButtonBase);
            this.movePropertyButtonsOffscreen();
            this.positionBandSelectButtons();
        };
    },

    circleGeoboardTapped:function() {
        if (!(this.geoboard instanceof CircleGeoboard)) {
            this.clearGeoboardSprites();
            this.geoboard = new CircleGeoboard(this.circleNumberOfPins, this.circleIncludeCentre);
            this.setupGeoboard();
            this.geoboard.setPropertyIndicatorsForSelectedBand();
            this.clearBandSelectButtons();
            this.clearPropertyButtonHighlights();
            this.displaySelectedProperty();
            var action = cc.MoveBy.create(0.3, cc.p(0, 180));
            this.circleControlsNode.runAction(action);
            this.selectGeoboardButton(this.circleGeoboardButtonBase);
            this.movePropertyButtonsOffscreen();
            this.positionBandSelectButtons();
        };
    },

    selectGeoboardButton:function(base) {
        var bases = [this.squareGeoboardButtonBase, this.triangleGeoboardButtonBase, this.circleGeoboardButtonBase];
        for (var i = 0; i < bases.length; i++) {
            var thisBase = bases[i];
            var position;
            if (thisBase === base) {
                position = cc.p(0, thisBase.getPosition().y);
            } else {
                position = cc.p(-15, thisBase.getPosition().y);
            };
            var action = cc.MoveTo.create(0.3, position);
            thisBase.runAction(action);
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
            this.numberOfPinsLabel.setString(this.circleNumberOfPins);
        }
    },

    removePinTapped:function() {
        if(this.geoboard instanceof CircleGeoboard) {
            if (this.circleNumberOfPins > 3) {
                this.circleNumberOfPins--;
                this.geoboard.removeEdgePin();
            };
            this.numberOfPinsLabel.setString(this.circleNumberOfPins);
        }
    },

    addBandTapped:function() {
        if (this.geoboard.bands.length < this.maxNumberOfBands) {
            var band = this.geoboard.newBand();
            var selectBandButton = new cc.MenuItemImage.create(s_select_band_button, s_select_band_button, "selectBandFromButton", this.geoboard);
            selectBandButton.band = band;
            selectBandButton.setColor(band.colour);
            this.addSelectBandButton(selectBandButton);
            this.displaySelectedBand(band);
        };
        if (this.geoboard.bands.length === 1) {
            this.movePropertyButtonsOnscreen();
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

    selectButton:function(button) {
        for (var i = 0; i < this.propertyButtons.length; i++) {
            var thisButton = this.propertyButtons[i];
            if (button !== thisButton) {
                thisButton.propertyHighlight(false);
            } else {
                thisButton.propertyHighlight(true);
            };
        };
    },

    deselectAllButtons:function() {
        for (var i = 0; i < this.propertyButtons.length; i++) {
            this.propertyButtons[i].propertyHighlight(false);
        };
    },

    togglePropertyDisplay:function(propertyDisplay) {
        if (this.propertyDisplay === propertyDisplay) {
            this.propertyDisplay = PropertyDisplays.NONE;
        } else {
            this.propertyDisplay = propertyDisplay;
        };
    },

    displaySelectedProperty:function() {
        this.geoboard.setPropertyIndicatorsForSelectedBand();
        this.geoboard.displayArea(false);
        this.geoboard.displayAngles(false);
        this.geoboard.displaySameAngles(false);
        this.geoboard.displaySideLengths(false);
        this.geoboard.displaySameSideLengths(false);
        this.geoboard.displayParallelSides(false);
        switch (this.propertyDisplay) {
            case PropertyDisplays.NONE:
                this.deselectAllButtons();
                break;
            case PropertyDisplays.REGULAR:
                this.selectButton(this.regularButton);
                break;
            case PropertyDisplays.SHAPE:
                this.selectButton(this.shapeButton);
                break;
            case PropertyDisplays.PERIMETER:
                this.selectButton(this.perimeterButton);
                break;
            case PropertyDisplays.AREA:
                this.geoboard.displayArea(true);
                this.selectButton(this.areaButton);
                break;
            case PropertyDisplays.ANGLES:
                this.geoboard.displayAngles(true);
                this.selectButton(this.showAngleButton);
                break;
            case PropertyDisplays.SAME_ANGLES:
                this.geoboard.displaySameAngles(true);
                this.selectButton(this.showSameAnglesButton);
                break;
            case PropertyDisplays.SIDE_LENGTHS:
                this.geoboard.displaySideLengths(true);
                this.selectButton(this.showSideLengthsButton);
                break;
            case PropertyDisplays.SAME_SIDE_LENGTHS:
                this.geoboard.displaySameSideLengths(true);
                this.selectButton(this.showSameSideLengthsButton);
                break;
            case PropertyDisplays.PARALLEL_SIDES:
                this.geoboard.displayParallelSides(true);
                this.selectButton(this.showParallelSidesButton);
                break;                
        }
    },

    regularButtonTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.REGULAR);
        this.displaySelectedProperty();
    },

    shapeButtonTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.SHAPE);
        this.displaySelectedProperty();

    },

    perimeterButtonTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.PERIMETER);
        this.displaySelectedProperty();
    },

    areaButtonTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.AREA);
        this.displaySelectedProperty();
    },

    showAnglesTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.ANGLES);
        this.displaySelectedProperty();
    },

    showSameAnglesTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.SAME_ANGLES);
        this.displaySelectedProperty();
    },

    showSideLengthsTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.SIDE_LENGTHS);
        this.displaySelectedProperty();
    },

    showSameSideLengthsTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.SAME_SIDE_LENGTHS);
        this.displaySelectedProperty();
    },

    showParallelSidesTapped:function() {
        this.togglePropertyDisplay(PropertyDisplays.PARALLEL_SIDES);
        this.displaySelectedProperty();
    },

    positionBandSelectButtons:function() {
        var numberOfButtons =  this.selectBandButtons.length;
        this.selectBandMenu.removeAllChildren();
        for (var i = 0; i < this.maxNumberOfBands; i++) {
            var bandSelectButton;
            if (i < numberOfButtons) {
                bandSelectButton = this.selectBandButtons[i];
            } else {
                bandSelectButton = cc.MenuItemImage.create(s_empty_select_band_button, s_empty_select_band_button, 'emptyFunction', this);
            };
            bandSelectButton.selectedSprite = null;
            this.selectBandMenu.addChild(bandSelectButton);
            var xPosition = 0 + 70 * i;
            var yPosition = 0;
            bandSelectButton.setPosition(xPosition, yPosition);
        };
    },

    setRegularIndicatorWith:function(string) {
        if (this.propertyDisplay === PropertyDisplays.REGULAR) {
            this.regularButton.label.setString(string);
        } else {
            this.regularButton.label.setString("Regular?");
        };
    },

    setShapeIndicatorWith:function(string) {
        if (this.propertyDisplay === PropertyDisplays.SHAPE) {
            this.shapeButton.label.setString(string);
        } else {
            this.shapeButton.label.setString("Shape");
        };
    },

    setPerimeterIndicatorWith:function(perimeter) {
        if (this.propertyDisplay === PropertyDisplays.PERIMETER) {    
            var string = "";
            if (perimeter !== null) {
                string = (Math.round(perimeter * 10000)/10000).toString();
            };
            this.perimeterButton.label.setString(string);
        } else {
            this.perimeterButton.label.setString("Perimeter");
        };
    },

    setAreaIndicatorWith:function(area) {
        if (this.propertyDisplay === PropertyDisplays.AREA) {        
            var string = "";
            if (area !== null) {
                string = (Math.round(area * 10000)/10000).toString();
            };
            this.areaButton.label.setString(string);
        } else {
            this.areaButton.label.setString("Area");
        };
    },

    clearBandSelectButtons:function() {
        this.selectBandMenu.removeAllChildren();
        this.selectBandButtons = [];
    },

    clearPropertyButtonHighlights:function() {
    },

    movePropertyButtonsOnscreen:function() {
        for (var i = 0; i < this.propertyButtons.length; i++) {
            var button = this.propertyButtons[i];
            var position = cc.p(0, button.getPosition().y);
            var action = cc.MoveTo.create(0.3, position);
            button.runAction(action);
        };
    },

    movePropertyButtonsOffscreen:function() {
        this.propertyDisplay = PropertyDisplays.NONE;
        for (var i = 0; i < this.propertyButtons.length; i++) {
            var button = this.propertyButtons[i];
            var position = cc.p(200, button.getPosition().y);
            var action = cc.MoveTo.create(0.3, position);
            button.highlight = false;
            button.runAction(action);
        };
    },

    displaySelectedBand:function(band) {
        for (var i = 0; i < this.selectBandButtons.length; i++) {
            var button = this.selectBandButtons[i];
            if (button.selectedSprite !== null) {
                button.selectedSprite.removeFromParent();
                button.selectedSprite = null;
            };
            if (button.band === band) {
                var selectedSprite = new cc.Sprite();
                selectedSprite.initWithFile(s_band_selected);
                selectedSprite.setPosition(button.getAnchorPointInPoints());
                selectedSprite.setScale(1.1);
                button.selectedSprite = selectedSprite;
                button.addChild(selectedSprite);
            };
        };
    },

    emptyFunction:function() {},
});

var PropertyDisplays = {
    NONE:"none",
    REGULAR:"regular",
    SHAPE:"shape",
    PERIMETER:"perimeter",
    AREA:"area",
    ANGLES:"angles",
    SAME_ANGLES:"same angles",
    SIDE_LENGTHS:"side lengths",
    SAME_SIDE_LENGTHS:"same side lengths",
    PARALLEL_SIDES:"parallel sides",
};

var setupInheritances = function() {
    inherits(RegularGeoboard, Geoboard);
    inherits(SquareGeoboard, RegularGeoboard);
    inherits(TriangleGeoboard, RegularGeoboard);
    inherits(CircleGeoboard, Geoboard);
}


function Geoboard() {
    this.background = new cc.Node();
    this.background.boundary = cc.RectMake(-300, -250, 600, 520);
    this.pins = new Array();
    this.bands = new Array();
    this.movingBand = null;

    this.angleDisplay = "none";
    this.sideDisplay = "none";

    this.pinNode = new cc.Node();
    this.background.addChild(this.pinNode);

    this.bandColours = [];
    var rgbValues = [75, 160, 245];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            for (var k = 0; k < 3; k++) {
                this.bandColours.push(cc.c3b(rgbValues[i], rgbValues[j], rgbValues[k]));
            };
        };
    };

    this.addPinsToBackground = function() {
        for (var i = 0; i < this.pins.length; i++) {
            var pin = this.pins[i];
            this.pinNode.addChild(this.pins[i].sprite);
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
            var touchLocationRelativeToBackground = this.background.convertToNodeSpace(touchLocation);
            this.movingBand.processMove(touchLocationRelativeToBackground);
            for (var i = 0; i < this.pins.length; i++) {
                var pin = this.pins[i];
                pin.highlightPin(pin.sprite.touchClose(touchLocation));
            };
        }
    }

    this.processEnd = function(touchLocation) {
        if (this.movingBand !== null) {
            var placedOnPin = false;
            for (var i = 0; i < this.pins.length; i++) {
                var pin = this.pins[i];
                pin.highlightPin(false);
                if (pin.sprite.touchClose(touchLocation)) {
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
            this.layer.displaySelectedProperty();
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
                band.angles[j].setDrawAngle();
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
        this.bandColours.push(band.colour);
        if (index === 0) {
            if (this.bands.length > 0) {
                this.selectBand(this.bands[0]);
            } else {
                this.selectNoBand();
            };
        };
        for (var i = 0; i < band.pins.length; i++) {
            var pin = band.pins[i];
        };
        this.groupSameAngles();
        this.groupSameSideLengths();
        this.groupParallelSides();

    }

    this.selectNoBand = function() {
        this.setPropertyIndicatorsForSelectedBand();
        this.layer.movePropertyButtonsOffscreen();
    }

    this.removeSelectedBand = function() {
        if (this.bands.length > 0) {
            this.removeBand(0);
        };
    }

    this.selectBand = function(band) {
        var previousBand;
        if (this.bands.length > 1) {
            previousBand = this.bands[0];
        } else {
            previousBand = null;
        }
        var index = this.bands.indexOf(band);
        this.bands.splice(index, 1);
        this.bands.splice(0, 0, band);
        this.setBandsZIndexToPriorityOrder();
        this.setPropertyIndicatorsForSelectedBand();
        this.layer.displaySelectedBand(band);
        if (this.layer.propertyDisplay === PropertyDisplays.AREA) {
            this.displayArea(true);
        };
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

    /*this.toggleAngleDisplay = function(string) {
        if (this.angleDisplay === string) {
            this.angleDisplay = "none"
        } else {
            this.angleDisplay = string;
        };
        this.setupAngleDisplay();
    }*/

    this.displayAngles = function(visible) {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.angleNode.setVisible(visible);
            band.displaySameAngles(false);
        };
        this.setAllDrawAngles();
    };

    this.displaySameAngles = function(visible) {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.angleNode.setVisible(visible);
            band.displaySameAngles(true);
        };
        this.setAllDrawAngles();
    };

/*    this.setupAngleDisplay = function() {
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
*/
/*    this.toggleSideDisplay = function(string) {
        if (this.sideDisplay === string) {
            this.sideDisplay = "none";
        } else {
            this.sideDisplay = string;
        };
        this.setupSideDisplay();
    }
*/
    this.displaySideLengths = function(visible) {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.sideLengthsNode.setVisible(visible);
        };
    }

    this.displaySameSideLengths = function(visible) {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.sameSideLengthNotchesVisible(visible);
        };
    }

    this.displayParallelSides = function(visible) {
        for (var i = 0; i < this.bands.length; i++) {
            var band = this.bands[i];
            band.parallelSideArrowsVisible(visible);
        };
    }

    this.displayArea = function(visible) {
        if (this.bands.length > 0) {
            var band = this.bands[0];
            band.areaNode.setVisible(visible);
            for (var i = 1; i < this.bands.length; i++) {
                this.bands[i].areaNode.setVisible(false);
            };
        };
    };

/*    this.setupSideDisplay = function() {
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
*/
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
}


function RegularGeoboard() {
    Geoboard.call(this);

    this.distanceBetweenPins = 70;
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
        var xValue = this.background.boundary.origin.x + this.distanceBetweenPins * (i + this.rowOffset * j);
        var yValue = this.background.boundary.origin.y + this.distanceBetweenPins * this.rowHeight * j;
        var pinPosition = cc.p(xValue, yValue);
        return pinPosition;
    }

    this.positionOnBackground = function(pinPosition) {
        var xRelativeToBackground = pinPosition.x + this.background.boundary.origin.x;
        var yRelativeToBackground = pinPosition.y + this.background.boundary.origin.y;
        var pinPositionRelativeToBackground= cc.p(xRelativeToBackground, yRelativeToBackground);
        var background = this.background;
        var boundary = this.background.boundary;
        var onBackground = cc.rectContainsPoint(boundary, pinPosition);
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
    this.radius = 250;
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

    this.highlightPin = function(highlight) {
        if (highlight) {
            /*
            var highlightPinTexture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(s_white_pin));
            this.sprite.setTexture(highlightPinTexture);
            */
            var highlightColour = cc.c3b(233, 142, 51);
            this.sprite.setColor(highlightColour);
        } else {
            var pinTexture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(s_pin));
            this.sprite.setTexture(pinTexture);
            var unHighlightColour = cc.c3b(255,255,255);
            this.sprite.setColor(unHighlightColour);
        };
    }
}

function MovingPin() {
    this.sprite = new cc.Sprite();
    this.sprite.initWithFile(s_moving_pin);
    this.sprite.setAnchorPoint(cc.p(0.5, 0.1));
}

function NoShadowPin() {
    this.sprite = new cc.Sprite();
    this.sprite.initWithFile(s_pin_no_shadow);
    this.sprite.setAnchorPoint(cc.p(0.5, 0.45))
}

function Band() {
    this.bandNode = new cc.Node();
    this.bandPartsNode = new cc.Node();
    this.bandNode.addChild(this.bandPartsNode);
    this.areaNode = new cc.DrawNode();
    this.areaNode.setZOrder(-1);
    this.bandNode.addChild(this.areaNode);
    this.bandParts = new Array();
    this.movingPin = null;
    this.sideLengthsLabels = new Array();
    this.singleBandPart = null;

    this.dirtyProperties = true;
    this.regular = null;
    this.shape = null;
    this.perimeter = null;
    this.area = null;

/*
    var red = 0, green = 0, blue = 0;
    while (red + green + blue < 256) {
        red = Math.floor(Math.random() * 256);
        green = Math.floor(Math.random() * 256);
        blue = Math.floor(Math.random() * 256);
    }
    this.colour = cc.c4f(red, green, blue, 255);
*/

    this.setupWithGeoboardAndPins = function(geoboard, pins) {
        this.geoboard = geoboard;
        this.pins = pins;
        this.bandParts = new Array();

        var randomIndex = Math.floor(Math.random() * this.geoboard.bandColours.length);
        this.colour = this.geoboard.bandColours[randomIndex];
        this.geoboard.bandColours.splice(randomIndex, 1);

        this.geoboard.addBand(this);
        this.setupBandParts();
        this.setupPropertiesNode();

        if (this.geoboard.layer) {
            this.areaNode.setVisible(this.geoboard.layer.propertyDisplay === PropertyDisplays.AREA);
        };
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
        } else if (this.pins.length === 1 && this.singleBandPart === null) {
            var pin = this.pins[0];
            this.singleBandPart = new cc.Sprite();
            this.singleBandPart.initWithFile(s_single_band_part);
            this.singleBandPart.setColor(this.colour);
            // this.singleBandPart.setPosition(pin.sprite.getPosition());
            this.singleBandPart.setPosition(cc.pAdd(pin.sprite.getPosition(), cc.p(0, 3)));
            this.bandNode.addChild(this.singleBandPart);
            var dummyPin = new NoShadowPin();
            dummyPin.sprite.setPosition(this.singleBandPart.getAnchorPointInPoints());
            this.singleBandPart.addChild(dummyPin.sprite);
        };
    }

    this.addBandPartBetween = function(fromPin, toPin) {
        var bandPart = new BandPart();
        bandPart.setup(this, fromPin, toPin);
        bandPart.sprite.setColor(this.colour);
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
        
        if (this.pins.length === 1) {
            if (this.singleBandPart.touched(touchLocation)) {
                this.singleBandPart.removeFromParent();
                this.singleBandPart = null;
                this.splitBandPart(0, touchLocation);
                selected = true;
                this.geoboard.setMovingBand(this);
            };
        } else if (this.pins.length > 1) {
            for (var i = 0; i < this.pins.length; i++) {
                var pin = this.pins[i];
                if (pin.sprite.touched(touchLocation)) {
                    this.unpinBandFromPin(i);
                    selected = true;
                    this.geoboard.setMovingBand(this);
                    break;
                };
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
            this.setDrawArea();
        };
    }

    this.unpinBandFromPin = function(index) {
        var pin = this.pins[index];
        this.movingPin = new MovingPin();
        var thing = this.bandPartsNode.getZOrder();
        this.movingPin.sprite.setZOrder(1);
        this.movingPin.sprite.setPosition(pin.sprite.getPosition());
        this.pins.splice(index, 1, this.movingPin);
        this.bandNode.addChild(this.movingPin.sprite);
    }

    this.splitBandPart = function(index, touchLocation) {
        this.movingPin = new MovingPin();
        var pinPosition = this.bandNode.convertToNodeSpace(touchLocation);
        this.movingPin.sprite.setZOrder(1);
        this.movingPin.sprite.setPosition(pinPosition);
        this.bandNode.addChild(this.movingPin.sprite);
        this.pins.splice(index + 1, 0, this.movingPin);
    }

    this.processMove = function(touchLocation) {
        this.movingPin.sprite.setPosition(touchLocation);
        this.setPositionAndRotationOfBandParts();
        this.setAngleValues();
        this.setSideLengthValues();
        this.setDrawArea();
    }

    this.processEnd = function(touchLocation) {
        this.movingPin.sprite.removeFromParent();
        this.movingPin = null;
        this.setupBandParts();
        this.setPositionAndRotationOfBandParts();
        this.setupAngles();
        this.cleanPins();
        this.geoboard.setAllProperties();
        this.setDrawArea();
    }

    this.pinBandOnPin = function(pin) {
        var movingPinIndex = this.pins.indexOf(this.movingPin);
        this.pins.splice(movingPinIndex, 1, pin);
        this.dirtyProperties = true;
        pin.highlightPin(false);
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

    this.setDrawArea = function() {
        this.areaNode.clear();
        if (this.pins.length > 2) {
            var vertices = [];
            for (var i = 0; i < this.pins.length; i++) {
                vertices.push(this.pins[i].sprite.getPosition());
            };
            this.areaNode.drawPoly(vertices, cc.c4f(0, 0, 0, 0.35), 0, cc.c4f(0,0,0,0));
        };
    };

    this.setupAngles = function() {
        this.angles = [];
        this.angleNode.removeAllChildren();
        if (this.pins.length > 1) {
            for (var i = 0; i < this.pins.length; i++) {
                var angle = new Angle();
                angle.init();
                angle.setColour(this.colour);
                if (this.geoboard.layer) {
                    var displaySameAngles = this.geoboard.layer.propertyDisplay === PropertyDisplays.SAME_ANGLES;
                    angle.displaySameAngles = displaySameAngles;
                    angle.background.setVisible(!displaySameAngles);
                };
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
            var label = cc.LabelTTF.create("", "mikadoBold", 20);
            //label.setColor(cc.c4f(255,255,255,1));
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
        if (this.bandParts.length === 0) {
            this.setupBandParts();
            this.setPositionAndRotationOfBandParts();
        };
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
        if (!this.edgesCrossOver()) {  
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
        };
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
            band.colour = cc.c3b(0,0,0);
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
    this.sprite.setScaleX(1.5);
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
        if (!(toPin instanceof MovingPin)) {
            this.dummyEndPin = new NoShadowPin();
            this.dummyEndPin.sprite.setZOrder(1);
            this.baseNode.addChild(this.dummyEndPin.sprite);            
        };
        if (!(fromPin instanceof MovingPin)) {
            this.dummyStartPin = new NoShadowPin();
            this.dummyStartPin.sprite.setZOrder(1);
            this.baseNode.addChild(this.dummyStartPin.sprite);
        };
        this.notchNode.setVisible(this.band.geoboard.sideDisplay === "sameSideLengths");
        this.arrowNode.setVisible(this.band.geoboard.sideDisplay === "parallelSides");
    }

    this.setPositionAndRotation = function() {
        var fromPin = this.fromPin;
        var toPin = this.toPin;
        this.bandPartNode.setPosition(fromPin.sprite.getPosition());
        this.notchNode.setPosition(fromPin.sprite.getPosition());
        this.arrowNode.setPosition(fromPin.sprite.getPosition());
        if (this.dummyStartPin) {
            this.dummyStartPin.sprite.setPosition(fromPin.sprite.getPosition());
        };
        if (this.dummyEndPin) {
            this.dummyEndPin.sprite.setPosition(toPin.sprite.getPosition());
        };
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
        this.label = cc.LabelTTF.create("", "mikadoBold", 15);
        this.label.setColor(cc.c4f(255,255,255,1));
        this.background.setPosition(0, 35);
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
                this.drawSector(cc.p(0,0), 45 + 5 * i, this.startAngle, this.throughAngle, this.anticlockwise, 
                    cc.c4f(0,0,0,0), 2, this.colourCorrect());
            };
        } else {
            this.drawSector(cc.p(0,0), 50, this.startAngle, this.throughAngle, this.anticlockwise, this.lightColour(), 2, this.colourCorrect());
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
    },
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

cc.Sprite.prototype.touchClose = function(touchLocation) {
    var closeDistance = 20;
    var parent = this.getParent();
    var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
    var position = this.getPosition();
    var distance = cc.pDistance(touchRelativeToParent, position);
    return distance < closeDistance;
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

cc.MenuItemImage.prototype.propertyHighlight = function(highlight) {
    if (highlight !== this.highlight) {
        var position;
        if (highlight) {
            position = cc.p(-15, this.getPosition().y);
            this.highlight = true;
        } else {
            position = cc.p(0, this.getPosition().y);
            this.highlight = false;
        };
        var moveAction = cc.MoveTo.create(0.3, position);
        this.runAction(moveAction);
    };
}
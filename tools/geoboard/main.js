require.config({
    paths: {
        'angle': '../../tools/geoboard/angle',
        'bandpart': '../../tools/geoboard/band-part',
        'band': '../../tools/geoboard/band',
        'constants': '../../tools/geoboard/constants',
        'geoboard': '../../tools/geoboard/geoboard',
        'regulargeoboard': '../../tools/geoboard/regular-geoboard',
        'squaregeoboard': '../../tools/geoboard/square-geoboard',
        'trianglegeoboard': '../../tools/geoboard/triangle-geoboard',
        'circlegeoboard': '../../tools/geoboard/circle-geoboard',
        'pin': '../../tools/geoboard/pin',
        'moving-pin': '../../tools/geoboard/moving-pin',
        'noshadow-pin': '../../tools/geoboard/noshadow-pin',
        'utils': '../../tools/geoboard/utils'
    }
});

define(['cocos2d', 'qlayer', 'angle', 'band', 'constants', 'geoboard', 'squaregeoboard', 'regulargeoboard', 'trianglegeoboard', 'circlegeoboard', 'utils'], function(cocos2d, QLayer, Angle, Band, constants, Geoboard, SquareGeoboard, RegularGeoboard, TriangleGeoboard, CircleGeoboard) {
    'use strict';

    var PropertyDisplays = constants['PropertyDisplays'];

    var ToolLayer = cc.Layer.extend({

        titleLabel:null,
        clc:null,
        lastcount:null,
        label:null,
        geoboard:null,
        circleNumberOfPins:8,
        circleIncludeCentre:true,
        maxNumberOfBands:9,

        init: function () {

            this._super();

            this.setTouchEnabled(true);

            var size = cc.Director.getInstance().getWinSize();

            cc.Director.getInstance().setDisplayStats(false);

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(s_deep_water_background);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

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
            this.selectBandButtons = [];
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
            button.label = new cc.LabelTTF.create(label, 'mikadoBold', 17, cc.SizeMake(110, 59), cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
            button.label.setPosition(centreOfIndicator);
            button.label.setColor(cc.c3b(255,255,255));
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
            this.deselectAllButtons();
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

        emptyFunction:function() {}
    });

    ToolLayer.create = function () {
        var sg = new ToolLayer();
        if (sg && sg.init(cc.c4b(255, 255, 255, 255))) {
            return sg;
        }
        return null;
    };

    ToolLayer.scene = function () {
        var scene = cc.Scene.create();
        var layer = ToolLayer.create();
        scene.addChild(layer);

        scene.layer=layer;

        // scene.setMouseEnabled(true);
        // scene.onMouseDown=function(event){cc.log("mouse down");};

        scene.ql=new QLayer();
        scene.ql.init();
        layer.addChild(scene.ql, 99);

        scene.update = function(dt) {
            this.layer.update(dt);
            this.ql.update(dt);
        };
        scene.scheduleUpdate();


        return scene;
    };

    return {
        'ToolLayer': ToolLayer
    };

});

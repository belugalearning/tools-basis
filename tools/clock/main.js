// require.config({
//     paths: {}
// });

define(['cocos2d', 'qlayer'], function(cocos2d, QLayer) {
    'use strict';

    var ToolLayer = cc.Layer.extend({
        titleLabel:null,
        clc:null,
        lastcount:null,
        label:null,
        clocks:null,

        init:function () {

            this._super();
     
            this.setTouchEnabled(true);
     
            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(s_deep_water_background);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            this.clocks = [];

            var clock1 = new AnalogueClock();
            clock1.init();
            clock1.layer = this;
            clock1.setPosition(size.width * 1/4, size.height/2);
            this.addChild(clock1);
            this.clocks.push(clock1);

            var clock2 = new DigitalClock();
            clock2.init();
            clock2.layer = this;
            clock2.setPosition(size.width * 3/4, size.height/2);
            this.addChild(clock2);
            this.clocks.push(clock2);

            var clock3 = new WordClock();
            clock3.init();
            clock3.layer = this;
            clock3.setPosition(600, 50);
            this.addChild(clock3);
            this.clocks.push(clock3);

            this.setupOptionsPanel();

            var time = new Time();
            time.setTime(23,59);
            for (var i = 0; i < this.clocks.length; i++) {
                var clock = this.clocks[i];
                clock.setupTime(time);
            };
            this.displayTimeOnAllClocks();



            return this;
        },

        onTouchesBegan:function(touches, event) {
            var touch = touches[0];
            var touchLocation = this.convertTouchToNodeSpace(touch);
            for (var i = 0; i < this.clocks.length; i++) {
                var clock = this.clocks[i];
                clock.processTouch(touchLocation);
            };
            this.displayTimeOnAllClocks();
        },

        onTouchesMoved:function(touches, event) {
            var touch = touches[0];
            var touchLocation = this.convertTouchToNodeSpace(touch);
            for (var i = 0; i < this.clocks.length; i++) {
                var clock = this.clocks[i];
                clock.processMove(touchLocation)
            };
            this.displayTimeOnAllClocks();
        },

        onTouchesEnded:function(touches, event) {
            if (touches.length > 0) {
                var touch = touches[0];
                var touchLocation = this.convertTouchToNodeSpace(touch);
                for (var i = 0; i < this.clocks.length; i++) {
                    var clock = this.clocks[i];
                    clock.processEnd(touchLocation);
                };
            };
        },

        displayTimeOnAllClocks:function() {
            for (var i = 0; i < this.clocks.length; i++) {
                var clock = this.clocks[i];
                clock.displayTime();
            };
        },

        setupOptionsPanel:function() {
            var optionsPanel = new cc.Sprite();
            this.optionsPanel = optionsPanel;
            optionsPanel.onScreen = false;
            optionsPanel.initWithFile(s_options_panel);
            optionsPanel.setPosition(this.size.width + 30, this.size.height/2);
            this.addChild(optionsPanel);
            var optionsOpenButton = new cc.MenuItemImage.create(s_options_open_button, s_options_open_button);
            var optionsCloseButton = new cc.MenuItemImage.create(s_options_close_button, s_options_close_button);
            var openClosePanel = new cc.MenuItemToggle.create(optionsOpenButton, optionsCloseButton, this.movePanel, this);
            openClosePanel.setPosition(-48, 2);
            var optionsMenu = new cc.Menu.create(openClosePanel);
            optionsMenu.setPosition(optionsPanel.getAnchorPointInPoints());
            optionsPanel.addChild(optionsMenu);
        },

        movePanel:function() {
            var position;
            if (this.optionsPanel.onScreen) {
                position = cc.p(this.size.width + 30, this.size.height/2);
            } else {
                position = cc.p(this.size.width - this.optionsPanel.getContentSize().width/2, this.size.height/2);
            };
            var moveAction = cc.MoveTo.create(0.3, position);
            this.optionsPanel.runAction(moveAction);
            this.optionsPanel.onScreen = !this.optionsPanel.onScreen;
        },

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

    var Clock = cc.Sprite.extend({
        linkedClock:null,
        time:null,

        setupTime:function(timeToSet) {
            this.time = timeToSet;
        },

        setTime:function(hours, minutes) {
            this.time.setTime(hours, minutes);
        },

        addHours:function(hoursToAdd) {
            this.setTime(this.time.hours + hoursToAdd, this.time.minutes);
        },

        addMinutes:function(minutesToAdd) {
            this.setTime(this.time.hours, this.time.minutes + minutesToAdd);
        },

        processTouch:function() {},
        processMove:function() {},
        processEnd:function() {},
    });

    var AnalogueClock = Clock.extend({
        hourHand:null,
        minuteHand:null,
        movingHand:null,
        previousAngle:null,

        init:function() {
            this._super();

            this.initWithFile(s_analogue_clockface);

            this.setupHands();
        },

        setupHands:function() {
            this.hourHand = new Hand();
            this.hourHand.initWithHandType(HandTypes.HOUR);
            this.hourHand.setZOrder(1);

            this.minuteHand = new Hand();
            this.minuteHand.initWithHandType(HandTypes.MINUTE);
            this.minuteHand.setZOrder(0);

            var clockSize = this.getContentSize();
            var clockCentre = cc.p(clockSize.width * 1/2, clockSize.height * 1/2);

            var hands = [this.hourHand, this.minuteHand];
            for (var i = 0; i < hands.length; i++) {
                var hand = hands[i];
                hand.setPosition(clockCentre);
                hand.clock = this;
                this.addChild(hand);
                hand.setupHandle();
            };

            var clockfacePin = new cc.Sprite();
            clockfacePin.initWithFile(s_clockface_pin);
            clockfacePin.setPosition(clockCentre);
            clockfacePin.setZOrder(2);
            this.addChild(clockfacePin);
        },

        displayTime:function() {
            var timeInMinutes = 60 * this.time.hours + this.time.minutes;
            this.minuteHand.setRotation(timeInMinutes * 6);
            this.hourHand.setRotation(timeInMinutes * 1/2);
        },

        processTouch:function(touchLocation) {
            var hands = [this.hourHand, this.minuteHand];
            for (var i = 0; i < hands.length; i++) {
                var hand = hands[i];
                if (hand.handleTouched(touchLocation)) {
                    this.movingHand = hand;
                    this.previousAngle = hand.getRotation();
                    return true;
                };
            };
        },

        processMove:function(touchLocation) {
            if (this.movingHand !== null) {
                var touchLocationAR = this.convertToNodeSpaceAR(touchLocation);
                var angle = Math.atan2(touchLocationAR.x, touchLocationAR.y);
                angle = cc.RADIANS_TO_DEGREES(angle);
                angle = numberInCorrectRange(angle, 0, 360);

                var type = this.movingHand.type;
                if (type === HandTypes.HOUR) {
                    var pmMultiplier = this.time.hours >= 12 ? 1 : 0;
                    var timeInMinutes = Math.floor(angle * 2);
                    if (this.handPassesVertical(this.previousAngle, angle)) {
                        pmMultiplier = 1 - pmMultiplier;
                    };
                    timeInMinutes += pmMultiplier * 12 * 60;
                    this.setTime(Math.floor(timeInMinutes/60), timeInMinutes % 60);
                } else if (type === HandTypes.MINUTE) {
                    this.addHours(this.handPassesVertical(this.previousAngle, angle));
                    var minutes = Math.floor(angle/6);
                    this.setTime(this.time.hours, minutes);
                };
                this.displayTime();
                this.previousAngle = angle;
                return true;
            };
        },

        handPassesVertical:function(previousAngle, thisAngle) {
            var change = 0;
            if (previousAngle < 90 && thisAngle > 270) {
                change = -1;
            } else if (previousAngle > 270 && thisAngle < 90) {
                change = 1;
            };
            return change;
        },

        processEnd:function(touchLocation) {
            this.movingHand = null;
        },


    });

    var Hand = cc.Sprite.extend({
        type:null,
        handle:null,
        clock:null,

        initWithHandType:function(type) {
            this.type = type;
            var fileName;
            var anchorPoint;
            switch (this.type) {
                case HandTypes.HOUR:
                    fileName = s_hour_hand;
                    anchorPoint = cc.p(0.5, 0.02);
                    break;
                case HandTypes.MINUTE:
                    fileName = s_minute_hand;
                    anchorPoint = cc.p(0.5, 0.02);
                    break;
            }
            this.initWithFile(fileName);
            this.setAnchorPoint(anchorPoint);
        },

        setupHandle:function() {
            this.handle = new HandHandle();
            this.handle.initWithHandType(this.type);
            var size = this.getContentSize();
            this.handle.setPosition(size.width/2, size.height/2);
            this.handle.clock = this.clock;
            this.addChild(this.handle);
        },

        handleTouched:function(touchLocation) {
            /*
            This is a hack to get around the transform for rotated sprites being mis-set (it is rotated the wrong way, this function reflects
            the touchLocation in the x-axis so that it will correspond to the handle).
            */
            var handleX = this.clock.convertToWorldSpace(this.getPosition()).x;
            var difference = touchLocation.x - handleX;
            var touchLocationXCorrected = handleX - difference;
            var touchLocationCorrected = cc.p(touchLocationXCorrected, touchLocation.y);
            return this.handle.touched(touchLocationCorrected);
        },
    });

    var HandHandle = cc.Sprite.extend({
        type:null,
        clock:null,

        initWithHandType:function(type) {
            this.type = type;
            var fileName;
            switch (this.type) {
                case HandTypes.HOUR:
                    fileName = s_hour_handle;
                    break;
                case HandTypes.MINUTE:
                    fileName = s_minute_handle;
                    break;
            }
            this.initWithFile(fileName);
        },
    });

    var DigitalClock = Clock.extend({
        digits:null,
        hour24:null,
        buttons:null,
        holdTimer:null,

        init:function() {
            this._super();
            this.initWithFile(s_digital_background);
            this.setupDigits();
            this.setupColon();
            this.setupPmIndicator();
            this.setupButtons();
            this.hour24 = true;
        },

        setupDigits:function() {
            this.digits = [];
            for (var i = 0; i < 4; i++) {
                var digit = new cc.Sprite();
                digit.initWithFile(s_digits[0]);
                this.digits.push(digit);
                this.addChild(digit);
            };

            this.digits[0].setPosition(80, 80);
            this.digits[1].setPosition(170, 80);
            this.digits[2].setPosition(270, 80);
            this.digits[3].setPosition(360, 80);
        },

        setupColon:function() {
            var colon = new cc.Sprite();
            colon.initWithFile(s_colon);
            colon.setPosition(220, 80);
            this.addChild(colon);
            var blinkOnce = cc.Blink.create(2, 1);
            var continuousBlink = cc.RepeatForever.create(blinkOnce);
            colon.runAction(continuousBlink);
        },

        setupPmIndicator:function() {
            this.pmIndicator = new cc.Sprite();
            this.pmIndicator.setPosition(cc.p(396, 120));
            this.pmIndicator.setScale(0.5);
            this.addChild(this.pmIndicator);
        },

        setupButtons:function() {
            this.buttons = [];
            this.buttonNode = new cc.Node();
            this.setupButton(125, 190, true, 1);
            this.setupButton(125, -40, true, -1);
            this.setupButton(270, 190, false, 10);
            this.setupButton(360, 190, false, 1);
            this.setupButton(270, -40, false, -10);
            this.setupButton(360, -40, false, -1);
            this.addChild(this.buttonNode);
        },

        setupButton:function(positionX, positionY, changeHour, changeBy) {
            var button = new cc.Sprite();
            var filename = changeBy > 0 ? s_arrow_up : s_arrow_down;
            button.initWithFile(filename);
            button.setPosition(positionX, positionY);
            button.changeHour = changeHour;
            button.changeBy = changeBy;
            this.buttonNode.addChild(button);
            this.buttons.push(button);
        },

        displayTime:function() {
            var hoursToDisplay = this.time.hours;
            var minutesToDisplay = this.time.minutes;

            if (!this.hour24) {
                if (hoursToDisplay > 12) {
                    hoursToDisplay -= 12;
                } else if (hoursToDisplay === 0) {
                    hoursToDisplay = 12;
                };
            };
            
            var firstDigit = Math.floor(hoursToDisplay/10);
            if (firstDigit === 0) {
                this.setBlankDigit(1);
            } else {
                this.setDigit(1, firstDigit);
            };
            var secondDigit = hoursToDisplay % 10;
            this.setDigit(2, secondDigit);
            var thirdDigit = Math.floor(minutesToDisplay/10);
            this.setDigit(3, thirdDigit);
            var fourthDigit = minutesToDisplay % 10;
            this.setDigit(4, fourthDigit);

            if (this.hour24) {
                this.pmIndicator.setVisible(false);
            } else {
                this.pmIndicator.setVisible(true);
                if (this.time.hours >= 12) {
                    this.pmIndicator.setTextureWithFilename(s_pm_indicator);
                } else {
                    this.pmIndicator.setTextureWithFilename(s_am_indicator);
                };
            };
        },

        setDigit:function(position, digit) {
            var digitSprite = this.digits[position - 1];
            digitSprite.setVisible(true);
            digitSprite.setTextureWithFilename(s_digits[digit]);
        },

        setBlankDigit:function(position) {
            var digit = this.digits[position - 1];
            digit.setVisible(false);
        },

        processTouch:function(touchLocation) {
            for (var i = 0; i < this.buttons.length; i++) {
                var button = this.buttons[i];
                if (button.touched(touchLocation)) {
                    this.buttonTouch(button);
                    this.displayTime();
                    var that = this;
                    this.holdTimer = setTimeout(function() {that.repeatButtonTouch(button)}, 700);
                    break;
                };
            };
        },

        buttonTouch:function(button) {
            if (button.changeHour) {
                this.addHours(button.changeBy);
            } else {
                this.addMinutes(button.changeBy);
            };
            this.layer.displayTimeOnAllClocks();
        },

        repeatButtonTouch:function(button) {
            this.buttonTouch(button);
            var that = this;
            this.holdTimer = setTimeout(function() {that.repeatButtonTouch(button)}, 100);
        },

        processMove:function(touchLocation) {

        },

        processEnd:function(touchLocation) {
            clearTimeout(this.holdTimer);
        },
    });

    var DigitalClockButton = cc.Sprite.extend({
        changeHour:null,
        valueToChange:null,
    });

    var WordClock = Clock.extend({
        label:null,
        hour24:null,
        init:function() {
            this.label = cc.LabelTTF.create("HELLO!", "mikadoBold", 24);
            this.addChild(this.label);
            this.hour24 = false;
        },

        displayTime:function() {
            var timeInWords = this.timeInWords();
            this.label.setString(timeInWords);
        },

        timeInWords:function() {
            var hours = this.time.hours;
            var minutes = this.time.minutes;
            var timeString = "It is ";
            if (minutes === 0) {
                timeString += this.hoursInWords(hours) + " o'clock";
            } else if (minutes <= 30) {
                timeString += this.minutesInWords(minutes) + " past " + this.hoursInWords(hours);
            } else {
                timeString += this.minutesInWords(60 - minutes) + " to " + this.hoursInWords(hours + 1);
            }
            return timeString;
        },

        minutesInWords:function(minutes) {
            var minutesInWords;
            if (minutes === 15) {
                minutesInWords = "quarter";
            } else if (minutes === 30) {
                minutesInWords = "half";
            } else {
                minutesInWords = this.numberInWords(minutes) + (minutes === 1 ? " minute" : " minutes");
            };
            return minutesInWords;
        },

        hoursInWords:function(hours) {
            var hoursInWords;
            hours %= 24;
            if (this.hour24) {
                hoursInWords = this.numberInWords(hours);
            } else {
                hoursInWords = this.numberInWords(hours % 12);
            };
            return hoursInWords;
        },

        numberInWords:function(number) {
            var digits = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
            var teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
            var twenties = ["twenty"];
            for (var i = 1; i < digits.length; i++) {
                twenties.push("twenty-" + digits[i]);
            };
            var numbersInWords = digits.concat(teens).concat(twenties);
            return numbersInWords[number];
        },
    });

    var Time = function() {
        this.hours = null;
        this.minutes = null;
        this.hoursInDay = 24;
        this.minutesInHour = 60;

        this.setTime = function(hoursToSet, minutesToSet) {
            if (minutesToSet < 0) {
                hoursToSet += Math.floor(minutesToSet/this.minutesInHour);
                minutesToSet += this.minutesInHour;
            } else {
                hoursToSet += Math.floor(minutesToSet/this.minutesInHour);
                minutesToSet = minutesToSet % this.minutesInHour;
            };

            hoursToSet = hoursToSet % this.hoursInDay;
            if (hoursToSet < 0) {
                hoursToSet += this.hoursInDay;
            };

            this.hours = hoursToSet;
            this.minutes = minutesToSet;
        };
    };

    var HandTypes = {
        HOUR:"hour",
        MINUTE:"minute",
    };

    cc.Sprite.prototype.touched = function(touchLocation) {
        var parent = this.getParent();
        var touchRelativeToParent = parent.convertToNodeSpace(touchLocation);
        var boundingBox = this.getBoundingBox();
        var contains = cc.rectContainsPoint(boundingBox, touchRelativeToParent);
        return contains;
    };

    var numberInCorrectRange = function(number, lowerBound, upperBound) {
        var result = number;
        var range = upperBound - lowerBound;
        if (number < lowerBound) {
            result = number + Math.floor((upperBound - number)/range) * range;
        } else if (number >= upperBound) {
            result = number - Math.floor((number - lowerBound)/range) * range;
        };
        return result;
    };

    cc.Sprite.prototype.setTextureWithFilename = function(filename) {
        var texture = cc.TextureCache.getInstance().textureForKey(cc.FileUtils.getInstance().fullPathForFilename(filename));
        this.setTexture(texture);
    };

    return {
        'ToolLayer': ToolLayer
    };
});

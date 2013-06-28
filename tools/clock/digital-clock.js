define(['clock', 'digitalclockbutton'], function(Clock, DigitalClockButton) {
    'use strict';

    var DigitalClock = Clock.extend({
        digits:null,
        hour24:null,
        buttons:null,
        holdTimer:null,

        ctor:function() {
            this._super();
            this.initWithFile(s_digital_background);
            this.setupDigits();
            this.setupColon();
            this.setupPmIndicator();
            this.setupButtons();
            this.hour24 = false;
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
            this.pmIndicator.initWithFile(s_pm_indicator);
            this.pmIndicator.setPosition(cc.p(407, 125));
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

        processEnd:function(touchLocation) {
            clearTimeout(this.holdTimer);
        },
    });

    return DigitalClock;
})

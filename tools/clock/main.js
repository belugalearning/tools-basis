require.config({
    paths: {
        'clock': '../../tools/clock/clock',
        'analogueclock': '../../tools/clock/analogue-clock',
        'hand': '../../tools/clock/hand',
        'handhandle': '../../tools/clock/hand-handle',
        'digitalclock': '../../tools/clock/digital-clock',
        'digitalclockbutton': '../../tools/clock/digital-clock-button',
        'wordclock': '../../tools/clock/word-clock',
        'time': '../../tools/clock/time',
        'constants': '../../tools/clock/constants',
        'toollayer': '../../tools/common/toollayer'
    }
});

define(['exports', 'cocos2d', 'toollayer', 'qlayer', 'constants', 'clock', 'analogueclock', 'hand', 'handhandle', 'digitalclock', 'digitalclockbutton', 'wordclock', 'time'], function(exports, cocos2d, ToolLayer, QLayer, constants, Clock, AnalogueClock, Hand, HandHandle, DigitalClock, DigitalClockButton, WordClock, Time) {
    'use strict';

    var HandTypes = constants['HandTypes'];

    var Tool = ToolLayer.extend({
        titleLabel:null,
        clc:null,
        lastcount:null,
        label:null,
        clocks:null,

        init:function () {

            this._super();

            this.setTouchEnabled(true);

            cc.Director.getInstance().setDisplayStats(false);

            this.size = cc.Director.getInstance().getWinSize();
            var size = this.size;

            var clc = cc.Layer.create();
            var background = new cc.Sprite();
            background.initWithFile(bl.resources['images_deep_water_background']);
            background.setPosition(size.width/2, size.height/2);
            clc.addChild(background);
            this.addChild(clc,0);

            var title = new cc.Sprite();
            title.initWithFile(bl.resources['images_clock_title']);
            title.setPosition(this.size.width/2, 700);
            this.addChild(title);

            this.clocks = [];

            this.analogueClock = new AnalogueClock();
            this.analogueClock.layer = this;
            this.addChild(this.analogueClock);
            this.clocks.push(this.analogueClock);

            this.digitalClock = new DigitalClock();
            this.digitalClock.layer = this;
            this.addChild(this.digitalClock);
            this.clocks.push(this.digitalClock);

            this.positionClocks();

            this.wordClock = new WordClock();
            this.wordClock.layer = this;
            this.wordClock.setPosition(this.size.width/2, 65);
            this.addChild(this.wordClock);
            this.clocks.push(this.wordClock);

            this.setupSettingsPanel();

            var time = new Time();
            time.setTime(10, 10);
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

        setupSettingsPanel:function() {
            var settingsPanel = new cc.Sprite();
            this.settingsPanel = settingsPanel;
            settingsPanel.onScreen = false;
            settingsPanel.initWithFile(bl.resources['images_clock_settings_free_form_bg']);
            settingsPanel.setPosition(this.size.width/2, this.size.height * 3/2);
            settingsPanel.setZOrder(1);
            this.addChild(settingsPanel);
            var settingsButtonBase = new cc.Sprite();
            settingsButtonBase.initWithFile(bl.resources['images_clock_settings_settings_button_base']);
            settingsButtonBase.setPosition(settingsButtonBase.getContentSize().width/2, 650);
            this.addChild(settingsButtonBase);
            var settingsButton = new cc.MenuItemImage.create(bl.resources['images_clock_settings_settings_button'], bl.resources['images_clock_settings_settings_button'], this.moveSettingsOn, this);
            settingsButton.setPosition(10, -2);
            var settingsButtonMenu = new cc.Menu.create(settingsButton);
            settingsButtonMenu.setPosition(settingsButtonBase.getAnchorPointInPoints());
            settingsButtonBase.addChild(settingsButtonMenu);

            var settingsCloseButton = new cc.MenuItemImage.create(bl.resources['images_clock_settings_free_form_closebutton'], bl.resources['images_clock_settings_free_form_closebutton'], this.moveSettingsOff, this);
            settingsCloseButton.setPosition(440, 320);

            this.analogueButton = new cc.MenuItemImage.create(bl.resources['images_clock_settings_analog_button_off'], bl.resources['images_clock_settings_analog_button_on'], this.selectAnalogue, this);
            this.analogueButton.setPosition(-170, 140);

            this.digitalButton = new cc.MenuItemImage.create(bl.resources['images_clock_settings_digital_button_off'], bl.resources['images_clock_settings_digital_button_on'], this.selectDigital, this);
            this.digitalButton.setPosition(-5, 140);

            this.bothButton = new cc.MenuItemImage.create(bl.resources['images_clock_settings_analoganddigital_button_off'], bl.resources['images_clock_settings_analoganddigital_button_on'], this.selectBoth, this);
            this.bothButton.setPosition(160, 140);

            this.bothButton.selected();

            this.hour12Button = new cc.MenuItemImage.create(bl.resources['images_clock_settings_12hr_off'], bl.resources['images_clock_settings_12hr_on'], this.select12Hour, this);
            this.hour12Button.setPosition(-85, 43);

            this.hour24Button = new cc.MenuItemImage.create(bl.resources['images_clock_settings_24hr_off'], bl.resources['images_clock_settings_24hr_on'], this.select24Hour, this);
            this.hour24Button.setPosition(75, 43);

            this.hour12Button.selected();

            var wordsButtonUnselected = new cc.MenuItemImage.create(bl.resources['images_clock_settings_words_off'], bl.resources['images_clock_settings_words_off']);
            var wordsButtonSelected = new cc.MenuItemImage.create(bl.resources['images_clock_settings_words_on'], bl.resources['images_clock_settings_words_on']);
            this.wordsButton = cc.MenuItemToggle.create(wordsButtonUnselected, wordsButtonSelected, this.wordsToggle, this);
            this.wordsButton.setPosition(-200, -50);

            var numbersButtonUnselected = new cc.MenuItemImage.create(bl.resources['images_clock_settings_numbers_off'], bl.resources['images_clock_settings_numbers_off']);
            var numbersButtonSelected = new cc.MenuItemImage.create(bl.resources['images_clock_settings_numbers_on'], bl.resources['images_clock_settings_numbers_on']);
            this.numbersButton = new cc.MenuItemToggle.create(numbersButtonUnselected, numbersButtonSelected, this.numbersToggle, this);
            this.numbersButton.setPosition(0, -50);
            this.numbersButton.setSelectedIndex(1);

            var sentenceButtonUnselected = new cc.MenuItemImage.create(bl.resources['images_clock_settings_sentence_off'], bl.resources['images_clock_settings_sentence_off']);
            var sentenceButtonSelected = new cc.MenuItemImage.create(bl.resources['images_clock_settings_sentence_on'], bl.resources['images_clock_settings_sentence_on']);
            this.sentenceButton = new cc.MenuItemToggle.create(sentenceButtonUnselected, sentenceButtonSelected, this.sentenceToggle, this);
            this.sentenceButton.setPosition(200, -50);
            this.sentenceButton.setSelectedIndex(1);

            var settingsMenu = new cc.Menu.create(settingsCloseButton, this.analogueButton, this.digitalButton, this.bothButton, this.hour12Button, this.hour24Button, this.wordsButton, this.numbersButton, this.sentenceButton);
            settingsPanel.addChild(settingsMenu);

        },

        moveSettingsOn:function() {
            var position = this.getAnchorPointInPoints();
            var moveOn = cc.MoveTo.create(0.3, position);
            this.settingsPanel.runAction(moveOn);
        },

        moveSettingsOff:function() {
            var position = cc.p(this.size.width/2, this.size.height * 3/2);
            var moveOff = cc.MoveTo.create(0.3, position);
            this.settingsPanel.runAction(moveOff);
        },

        selectAnalogue:function() {
            this.digitalClock.setVisible(false);
            this.analogueClock.setVisible(true);
            this.positionClocks();
            this.unselectClockTypeButtons();
            this.analogueButton.selected();
            this.setUnusedButtonsEnabled(true);
        },

        selectDigital:function() {
            this.analogueClock.setVisible(false);
            this.digitalClock.setVisible(true);
            this.positionClocks();
            this.unselectClockTypeButtons();
            this.digitalButton.selected();
            this.setUnusedButtonsEnabled(false);
        },

        selectBoth:function() {
            this.analogueClock.setVisible(true);
            this.digitalClock.setVisible(true);
            this.positionClocks();
            this.unselectClockTypeButtons();
            this.bothButton.selected();
            this.setUnusedButtonsEnabled(true);
        },

        setUnusedButtonsEnabled:function(enabled) {
            var opacity = enabled ? 255 : 128;
            var buttons = [this.wordsButton, this.numbersButton];
            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                button.setOpacity(opacity);
                button.setEnabled(enabled);
                if (!enabled) {
                    button.setSelectedIndex(0);
                };
            };
            if (!enabled) {
                this.analogueClock.wordNode.setVisible(false);
                this.analogueClock.numbers.setVisible(false);
            };
        },

        select12Hour:function() {
            this.digitalClock.setHour24(false);
            this.hour24Button.unselected();
            this.hour12Button.selected();
        },

        select24Hour:function() {
            this.digitalClock.setHour24(true);
            this.hour12Button.unselected();
            this.hour24Button.selected();
        },

        unselectClockTypeButtons:function() {
            this.analogueButton.unselected();
            this.digitalButton.unselected();
            this.bothButton.unselected();
        },

        wordsToggle:function() {
            var wordNode = this.analogueClock.wordNode;
            wordNode.setVisible(!wordNode.isVisible());
            this.positionClocks();
        },

        numbersToggle:function() {
            var numbers = this.analogueClock.numbers;
            numbers.setVisible(!numbers.isVisible());
        },

        sentenceToggle:function() {
            this.wordClock.setVisible(!this.wordClock.isVisible());
        },

        positionClocks:function() {
            var centrePosition = cc.p(this.size.width/2, this.size.height/2 - 50);
            var leftPosition = cc.p(this.size.width * 0.29, this.size.height/2 - 50);
            var rightPosition = cc.p(this.size.width * 0.74, this.size.height/2 - 50);
            var veryRightPosition = cc.p(this.size.width * 0.79, this.size.height/2 - 50);

            var analogueVisible = this.analogueClock.isVisible();
            var digitalVisible = this.digitalClock.isVisible();
            var wordsVisible = this.analogueClock.wordNode.isVisible();
            if (analogueVisible) {
                if (digitalVisible) {
                    this.analogueClock.setPosition(leftPosition);
                    if (wordsVisible) {
                        this.digitalClock.setPosition(veryRightPosition);
                    } else {
                        this.digitalClock.setPosition(rightPosition);
                    };
                } else {
                    this.analogueClock.setPosition(centrePosition);
                };
            } else {
                this.digitalClock.setPosition(centrePosition);
            };
        },

    });

    exports.ToolLayer = Tool;

});

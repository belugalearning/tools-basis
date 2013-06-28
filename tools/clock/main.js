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
    }
});

define(['cocos2d', 'qlayer', 'constants', 'clock', 'analogueclock', 'hand', 'handhandle', 'digitalclock', 'digitalclockbutton', 'wordclock', 'time'], function(cocos2d, QLayer, constants, Clock, AnalogueClock, Hand, HandHandle, DigitalClock, DigitalClockButton, WordClock, Time) {
    'use strict';

    var HandTypes = constants['HandTypes'];

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

            var title = new cc.Sprite();
            title.initWithFile(s_clock_title);
            title.setPosition(this.size.width/2, 700);
            this.addChild(title);


            this.centrePosition = cc.p(size.width/2, size.height/2 - 50);
            this.leftPosition = cc.p(size.width * 0.29, size.height/2 - 50);
            this.rightPosition = cc.p(size.width * 0.74, size.height/2 - 50);
            this.veryRightPosition = cc.p(size.width * 0.79, size.height/2 - 50);

            this.clocks = [];

            this.analogueClock = new AnalogueClock();
            this.analogueClock.layer = this;
            this.analogueClock.setPosition(this.leftPosition);
            this.addChild(this.analogueClock);
            this.clocks.push(this.analogueClock);

            this.digitalClock = new DigitalClock();
            this.digitalClock.layer = this;
            this.digitalClock.setPosition(this.rightPosition);
            this.addChild(this.digitalClock);
            this.clocks.push(this.digitalClock);

            this.wordClock = new WordClock();
            this.wordClock.layer = this;
            this.wordClock.setPosition(this.size.width/2, 70);
            this.addChild(this.wordClock);
            this.clocks.push(this.wordClock);
            this.wordClock.setVisible(false);

            this.setupSettingsPanel();

            var time = new Time();
            time.setTime(0,1);
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
            settingsPanel.initWithFile(s_settings_panel);
            settingsPanel.setPosition(this.size.width/2, this.size.height * 3/2);
            settingsPanel.setZOrder(1);
            this.addChild(settingsPanel);
            var settingsButtonBase = new cc.Sprite();
            settingsButtonBase.initWithFile(s_settings_button_base);
            settingsButtonBase.setPosition(settingsButtonBase.getContentSize().width/2, 650);
            this.addChild(settingsButtonBase);
            var settingsButton = new cc.MenuItemImage.create(s_settings_button, s_settings_button, this.moveSettingsOn, this);
            settingsButton.setPosition(10, -2);
            var settingsButtonMenu = new cc.Menu.create(settingsButton);
            settingsButtonMenu.setPosition(settingsButtonBase.getAnchorPointInPoints());
            settingsButtonBase.addChild(settingsButtonMenu);

            var settingsCloseButton = new cc.MenuItemImage.create(s_settings_close_button, s_settings_close_button, this.moveSettingsOff, this);
            settingsCloseButton.setPosition(440, 320);

            this.analogueButton = new cc.MenuItemImage.create(s_analogue_button_unselected, s_analogue_button_selected, this.selectAnalogue, this);
            this.analogueButton.setPosition(-170, 140);

            this.digitalButton = new cc.MenuItemImage.create(s_digital_button_unselected, s_digital_button_selected, this.selectDigital, this);
            this.digitalButton.setPosition(-5, 140);

            this.bothButton = new cc.MenuItemImage.create(s_both_button_unselected, s_both_button_selected, this.selectBoth, this);
            this.bothButton.setPosition(160, 140);

            this.bothButton.selected();

            this.hour12Button = new cc.MenuItemImage.create(s_hour_12_button_unselected, s_hour_12_button_selected, this.select12Hour, this);
            this.hour12Button.setPosition(-85, 43);

            this.hour24Button = new cc.MenuItemImage.create(s_hour_24_button_unselected, s_hour_24_button_selected, this.select24Hour, this);
            this.hour24Button.setPosition(75, 43);

            this.hour12Button.selected();

            var wordsButtonUnselected = new cc.MenuItemImage.create(s_words_button_unselected, s_words_button_unselected);
            var wordsButtonSelected = new cc.MenuItemImage.create(s_words_button_selected, s_words_button_selected);
            var wordsButton = cc.MenuItemToggle.create(wordsButtonUnselected, wordsButtonSelected, this.wordsToggle, this);
            wordsButton.setPosition(-200, -50);

            var numbersButtonUnselected = new cc.MenuItemImage.create(s_numbers_button_unselected, s_numbers_button_unselected);
            var numbersButtonSelected = new cc.MenuItemImage.create(s_numbers_button_selected, s_numbers_button_selected);
            var numbersButton = new cc.MenuItemToggle.create(numbersButtonUnselected, numbersButtonSelected, this.numbersToggle, this);
            numbersButton.setPosition(0, -50);

            var sentenceButtonUnselected = new cc.MenuItemImage.create(s_sentence_button_unselected, s_sentence_button_unselected);
            var sentenceButtonSelected = new cc.MenuItemImage.create(s_sentence_button_selected, s_sentence_button_selected);
            var sentenceButton = new cc.MenuItemToggle.create(sentenceButtonUnselected, sentenceButtonSelected, this.sentenceToggle, this);
            sentenceButton.setPosition(200, -50);

            var settingsMenu = new cc.Menu.create(settingsCloseButton, this.analogueButton, this.digitalButton, this.bothButton, this.hour12Button, this.hour24Button, wordsButton, numbersButton, sentenceButton);
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
            this.analogueClock.setPosition(this.centrePosition);
            this.unselectClockTypeButtons();
            this.analogueButton.selected();
        },

        selectDigital:function() {
            this.analogueClock.setVisible(false);
            this.digitalClock.setVisible(true);
            this.digitalClock.setPosition(this.centrePosition);
            this.unselectClockTypeButtons();
            this.digitalButton.selected();
        },

        selectBoth:function() {
            this.analogueClock.setVisible(true);
            this.digitalClock.setVisible(true);
            this.analogueClock.setPosition(this.leftPosition);
            if (this.analogueClock.wordNode.isVisible()) {
                this.digitalClock.setPosition(this.veryRightPosition);
            } else {
                this.digitalClock.setPosition(this.rightPosition);
            };
            this.unselectClockTypeButtons();
            this.bothButton.selected();
        },

        select12Hour:function() {
            for (var i = 0; i < this.clocks.length; i++) {
                this.clocks[i].setHour24(false);
            };
            this.hour24Button.unselected();
            this.hour12Button.selected();
        },

        select24Hour:function() {
            for (var i = 0; i < this.clocks.length; i++) {
                this.clocks[i].setHour24(true);
            };
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
            if (this.digitalClock.isVisible()) {
                if (wordNode.isVisible()) {
                    this.digitalClock.setPosition(this.veryRightPosition);
                } else {
                    this.digitalClock.setPosition(this.rightPosition);
                };
            };
        },

        numbersToggle:function() {
            var numbers = this.analogueClock.numbers;
            numbers.setVisible(!numbers.isVisible());
        },

        sentenceToggle:function() {
            this.wordClock.setVisible(!this.wordClock.isVisible());
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

    return {
        'ToolLayer': ToolLayer
    };
});

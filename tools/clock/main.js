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

            this.clocks = [];

            var clock1 = new AnalogueClock();
            clock1.layer = this;
            clock1.setPosition(size.width * 1/4, size.height/2);
            this.addChild(clock1);
            this.clocks.push(clock1);

            var clock2 = new DigitalClock();
            clock2.layer = this;
            clock2.setPosition(size.width * 3/4, size.height/2);
            this.addChild(clock2);
            this.clocks.push(clock2);

            var clock3 = new WordClock();
            clock3.layer = this;
            clock3.setPosition(600, 50);
            this.addChild(clock3);
            this.clocks.push(clock3);
            clock3.setVisible(false);

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
            openClosePanel.setPosition(-50, 2);
            this.optionsMenu = new cc.Menu.create(openClosePanel);
            this.optionsMenu.setPosition(optionsPanel.getAnchorPointInPoints());
            optionsPanel.addChild(this.optionsMenu);
            this.optionsButtonYPosition = 110;
            this.setupOptionsPanelButton(s_options_hour_button_unselected, s_options_hour_button_selected, this.hourButtonTapped);
            this.setupOptionsPanelButton(s_options_minute_button_unselected, s_options_minute_button_selected, this.minuteButtonTapped);
            this.setupOptionsPanelButton(s_options_digital_button_unselected, s_options_digital_button_selected, this.digitalButtonTapped);
            this.setupOptionsPanelButton(s_options_words_button_unselected, s_options_words_button_selected, this.wordsButtonTapped);
            this.setupOptionsPanelButton(s_options_sentence_button_unselected, s_options_sentence_button_selected, this.sentenceButtonTapped);
        },

        setupOptionsPanelButton:function(unselectedFilename, selectedFilename, selector) {
            var unselectedButton = new cc.MenuItemImage.create(unselectedFilename, unselectedFilename);
            var selectedButton = new cc.MenuItemImage.create(selectedFilename, selectedFilename);
            var button = cc.MenuItemToggle.create(unselectedButton, selectedButton, selector, this);
            button.setPosition(30, this.optionsButtonYPosition);
            this.optionsButtonYPosition -= 50;
            this.optionsMenu.addChild(button);
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

        hourButtonTapped:function() {},
        minuteButtonTapped:function() {},
        digitalButtonTapped:function() {},
        wordsButtonTapped:function() {},

        sentenceButtonTapped:function() {
            var wordClock = this.clocks[2];
            wordClock.setVisible(!wordClock.isVisible());
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

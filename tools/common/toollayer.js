define(['exports', 'underscore','cocos2d'], function (exports, _, cc) {
    'use strict';

    var BACKGROUND_Z = 0;
    var QUESTION_Z = 100;

    var ToolLayer = cc.Layer.extend({

        _background: undefined,
        _backgroundLayer: undefined,
        _windowSize: undefined,

        tag: '',
        ctor: function () {
            this._super();

            this._director = cc.Director.getInstance();
            this._windowSize = this._director.getWinSize();

        },

        _controls: {},

        reset: function () {
            this._controls = {};
            this._background = undefined;
            this._backgroundLayer = undefined;
            this.removeAllChildren();
        },

        registerControl: function (id, control) {
            /* 
            Used to register a control with the toolLayer, which in turn exposes access to the ToolHandler
            */
            this._controls[id] = control;
        },

        getControls: function (pattern) {
            /* 
            Returns an array of controls whose id matches a pattern
            */
            var ret = [];
            _.each(this._controls, function (v, k) {
                if (k.match(pattern)) {
                    ret.push(v);
                }
            });
            return ret;
        },

        getControl: function (id) {
            /* 
            Returns a control for an id
            */
            if (this._controls.hasOwnProperty(id)) {
                return this._controls[id];
            }
            return null;
        },

        setBackground: function (resource) {
            if (_.isUndefined(this._background)) {
                this._backgroundLayer = cc.Layer.create();
                this.addChild(this._backgroundLayer, BACKGROUND_Z);
                this._background = new cc.Sprite();
            }
            this._background.initWithFile(resource);
            this._background.setPosition(this._windowSize.width/2, this._windowSize.height/2);
            this._backgroundLayer.addChild(this._background);
        },

        addBackgroundComponent: function (resource, position) {
            var component = new cc.Sprite();
            component.initWithFile(resource);
            component.setPosition(position);
            this._backgroundLayer.addChild(component);
        },

        getState: function () {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        hideQuestion: function () {
            this._questionLabel.setVisible(false);
            this._questionLabelBlock.setVisible(false);
        },

        showQuestion: function () {
            this._questionLabel.setVisible(true);
            this._questionLabelBlock.setVisible(true);
        },

        _questionLabel: undefined,
        _questionLabelBlock: undefined,
        setQuestion: function (question) {
            var self = this;
            this._question = question;

            if (!_.isUndefined(question.text)) {

                var sliceBorderWidth = 24;
                var sliceInternalWidth = 34;
                var questionBlockWidth = self._windowSize.width * 0.76;
                var questionWidth = questionBlockWidth - (sliceBorderWidth * 2);

                if (_.isUndefined(this._questionLabel)) {
                    this._questionLabel = cc.LabelTTF.create(question.text, "mikadoBold", 30);
                    this._questionLabel.setColor(cc.c3b(255,255,255));
                    this.addChild(this._questionLabel, QUESTION_Z);
                    this._questionLabel.setDimensions(cc.SizeMake(questionWidth, 0));
                    this._questionLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
                    this._questionLabel.setVerticalAlignment(cc.TEXT_ALIGNMENT_CENTER);

                    var batchNode = cc.SpriteBatchNode.create(window.bl.getResource('question_tray_9_slice'));
                    this._questionLabelBlock = cc.Scale9Sprite.create();
                    this._questionLabelBlock.updateWithBatchNode(batchNode, cc.rect(0, 0, sliceBorderWidth * 2 + sliceInternalWidth,  sliceBorderWidth * 2 + sliceInternalWidth), false, cc.rect(sliceBorderWidth, sliceBorderWidth, sliceInternalWidth, sliceInternalWidth));
                    var size = cc.size(questionBlockWidth, this._questionLabel.getContentSize().height + (sliceBorderWidth * 2));
                    var pos = cc.p(self._windowSize.width / 2, self._windowSize.height - 20 - (size.height / 2));
                    this._questionLabelBlock.setContentSize(size);
                    this._questionLabel.setPosition(pos);
                    this._questionLabelBlock.setPosition(pos);
                    this.addChild(this._questionLabelBlock, QUESTION_Z - 1);
                }
                this._questionLabel.setString(question.text);
            }

            function recursiveApply (control, state) {
                if (state.hasOwnProperty('enabled') && typeof control.setEnabled === 'function') {
                    control.setEnabled(state.enabled || false);
                }
                if (state.hasOwnProperty('opacity') && typeof control.setOpacity === 'function') {
                    control.setOpacity(state.opacity || 0);
                }
                if (control._children) {
                    _.each(control._children, function (child) {
                        recursiveApply(child, state);
                    });
                }
            }

            if (question.hasOwnProperty('toolConfig') && question.toolConfig.hasOwnProperty('controls')) {

                var controls = question.toolConfig.controls;

                _.each(controls, function (v, k) {
                    var control = self.getControl(k);
                    if (control) {
                        recursiveApply(control, v);
                        if (v.set) {
                            control.click();
                        }
                    }
                });
            }
        },

        noop: function() {}

    });

    return ToolLayer;

});

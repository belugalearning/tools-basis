define(['exports', 'underscore','cocos2d'], function (exports, _, cc) {
    'use strict';

    var BACKGROUND_Z = 0;

    var ToolLayer = cc.Layer.extend({

        _background: undefined,
        _backgroundLayer: undefined,

        tag: '',
        ctor: function () {
            this._super();
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

        setQuestion: function (question) {
            var self = this;
            this.question = question;

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

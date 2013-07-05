define(['exports', 'underscore','cocos2d'], function (exports, _, cc) {
    'use strict';

    var ToolLayer = cc.Layer.extend({

        ctor: function () {
            this._super();
        },

        _controls: {},

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

        getState: function () {
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        setQuestion: function (question) {
            var self = this;
            this.question = question;

            var controls = question.toolConfig.controls;

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

            _.each(controls, function (v, k) {
                var control = self.getControl(k);
                if (control) {
                    recursiveApply(control, v);
                    if (v.set) {
                        control.click();
                    }
                }
            });
        },

        noop: function() {}

    });

    return ToolLayer;

});

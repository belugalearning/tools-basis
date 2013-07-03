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
            throw {name : "NotImplementedError", message : "This needs implementing"};
        },

        noop: function() {}

    });

    return ToolLayer;

});

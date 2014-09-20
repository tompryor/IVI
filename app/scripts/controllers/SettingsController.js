/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.SettingsController = M.Controller.extend({

        // Called from the router when the application starts
        applicationStart: function () {
            console.log('SettingsController.applicationStart()');
            this._initLayout();
        },

        // Called from the router everytime the route/url matchs the controller (binding in main.js)
        show: function () {
            console.log('SettingsController.show()');
            this.initViews();
            this._applyViews();
            

        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
            console.log('SettingsController.applicationReady()');
        },
        
        _initLayout : function () {
            console.debug("3) SettingsController#_initLayout: START");
            /*
            var layout = M.SwitchLayout.extend().create(this);
            LibertyMutualIVIBaseApp.setLayout(layout);
            */
            var layout = LibertyMutualIVIBaseApp.Layouts.TestLayout.create(this);
            LibertyMutualIVIBaseApp.setLayout(layout);
            this.initViews();
            this._applyViews();
            
        },
        
        initViews: function(){
            console.log('SettingsController.initViews()');
            this._indexView = LibertyMutualIVIBaseApp.Views.SettingsView.create(this);
          },

        _applyViews : function () {
            console.log('SettingsController._applyViews()');

        	LibertyMutualIVIBaseApp.getLayout().applyViews({
                content: this._indexView
            });
        }

    });

})();

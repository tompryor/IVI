/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.AccidentchecklistController = M.Controller.extend({

        // Called from the router when the application starts
        applicationStart: function () {
            console.log('AccidentchecklistController.applicationStart()');
        },

        // Called from the router everytime the route/url matchs the controller (binding in main.js)
        show: function () {
            console.log('AccidentchecklistController.show()');
        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
            console.log('AccidentchecklistController.applicationReady()');
        },
    });

})();

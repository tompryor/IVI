/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Controllers = LibertyMutualIVIBaseApp.Controllers || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Controllers.RegistrationController = M.Controller.extend({

        // Called from the router when the application starts
        applicationStart: function () {
            console.log('RegistrationcontrollerController.applicationStart()');
        },

        // Called from the router everytime the route/url matchs the controller (binding in main.js)
        show: function () {
            console.log('RegistrationcontrollerController.show()');
        },

        // Called for every controller when the application is ready. applicationStart is always called before.
        applicationReady: function () {
            console.log('RegistrationcontrollerController.applicationReady()');
        },
    });

})();

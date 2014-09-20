/*global LibertyMutualIVIBaseApp, $*/

// PLEASE DON'T CHANGE OR REMOVE THE COMMENTS.
// All comments in this file are necessary for the build process.

 /**
  * This is the start point for your application.
  * Here we have two things to do.
  *
  * 1. Initialize the routers
  * 2. Initialize the controllers
  *
  * Routers are used for routing your application URL to a controller.
  * Any ":param" in the route definitions are passed as arguments
  * to the controller.
  *
  * Hint:
  * Use the generator to create a controller.
  * https://github.com/mwaylabs/generator-m#controller
  *
  * Example:
  *
  * routing: {
  *     routes: {
  *         ''         : 'indexController',
  *         'settings' : 'settingsController',
  *         'page/:id' : 'pageController'
  *     },
  *     ''                   : global.APPNAME.Controllers.IndexController.create(),
  *     'settingsController' : global.APPNAME.Controllers.SettingsController.create(),
  *     'pageController'     : global.APPNAME.Controllers.PageController.create(),
  * }
  *
  * http://localhost:9000/ will call the indexController
  * http://localhost:9000/#settings will call the settingsController
  * http://localhost:9000/#page/1 will call the pageController with id as an agrument.
  *
  * For further information go to:
  * http://backbonejs.org/#Router
  */

(function (global) {
    'use strict';

    global.LibertyMutualIVIBaseApp = M.Application.extend().create(global.LibertyMutualIVIBaseApp.mconfig);

    $(document).ready(function() {
    	
    	LibertyMutualIVIBaseApp.CoreEngine.start();
    	
        global.LibertyMutualIVIBaseApp.start({
            routing: {
                routes: {
                	'' : 'TermsAndConditionsController',
                	'welcome' : 'WelcomeController',
                	'settings' : 'SettingsController',
                	'registration' : 'RegistrationController',
                	'reports' : 'HistoryController',
                	'accidentchecklist' : 'AccidentchecklistController',
                	'contact' : 'ContactController',
                	'menu' : 'MenuController',
                	'error' : 'ErrorController',
                	'reportdetail' : 'ReportDetailController',
                	'triptracking' : 'TriptrackingController'
           
                },
                	'TermsAndConditionsController' : global.LibertyMutualIVIBaseApp.Controllers.TermsAndConditionsController.create(),	
               		'WelcomeController' : global.LibertyMutualIVIBaseApp.Controllers.WelcomeController.create(),
                	'SettingsController' : global.LibertyMutualIVIBaseApp.Controllers.SettingsController.create(),
                	'RegistrationController' : global.LibertyMutualIVIBaseApp.Controllers.RegistrationController.create(),
                	'HistoryController' : global.LibertyMutualIVIBaseApp.Controllers.HistoryController.create(),
                	'AccidentchecklistController' : global.LibertyMutualIVIBaseApp.Controllers.AccidentchecklistController.create(),
                  	'ErrorController' : global.LibertyMutualIVIBaseApp.Controllers.ErrorController.create(),
                  	'ReportDetailController' : global.LibertyMutualIVIBaseApp.Controllers.ReportDetailController.create(),
                	'TriptrackingController' : global.LibertyMutualIVIBaseApp.Controllers.TriptrackingController.create()
            }
        });
    });
})(this);


/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.SettingsView = M.View.extend({
        // The properties of a view
    	template: LibertyMutualIVIBaseApp.Templates.Views_Settings,
        // The views grid
        grid: 'col-xs-12',
        cssClass: 'xxx yyy zzz',
        value: {'Title':'Welcome to the Settings View', 'Sub-Title':'Compiled, External, Handlebars Templates, provided by an excellent grunt plugin called - grunt-contrib-handlebars;)',
        	'Link':'https://github.com/gruntjs/grunt-contrib-handlebars',
        		'LinkName':'grunt-contrib-handlebars',
            	'WikiLink':'https://wiki.lmig.com/display/PIInternet/Guide+to+Using+Templates+-+Handlebars+-+DSS+IVI',
        		'WikiName':'Guide to Using Templates - Handlebars'
        		}
    }, {
        // The childViews as object
        // e.q. button: M.ButtonView.extend({value: 'Test'})
    	// button: M.ButtonView.extend({value: 'Save Settings'})
    });

})();

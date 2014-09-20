/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.ErrorView = M.View.extend({

    	grid: 'col-xs-12',

    	template: LibertyMutualIVIBaseApp.Templates.Error,

        cssClass: '',
        value: '',


	    initialize: function() { 
		    this.render();
			this.listenTo(this.model, "change", this.render);
    	},
    	
    	render: function() {
     		this.$el.html(this.template()); 
     		
    		return this;
    	},
    	
    	events: {
    		"click #quit_button":"quitApp"
    		
    	},
 
    	
    	quitApp: function(){
    		window.close();
    	},
    });
})();

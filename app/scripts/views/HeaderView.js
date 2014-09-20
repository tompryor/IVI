/*global LibertyMutualIVIBaseApp, Backbone, JST*/

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.HeaderView = M.View.extend({

    	template: LibertyMutualIVIBaseApp.Templates.Header,

        cssClass: '',
        value: '',


	    initialize: function() { 
		  	console.debug("HeaderView#initialize");
		    this.render();
			this.listenTo(this.model, "change", this.render);
    	},
    	
    	render: function() {
     		this.$el.html(this.template());

    		if (LibertyMutualIVIBaseApp.Models.UserModel.get('isRegistered')) {
    			//$('#register_icon').html('<span class="fa fa-gear fa-2x"></span>');
    			$('#register_icon').remove();
    			$('#register_settings_icon_element').html('<button data-contentKey="header_settings_icon" id="settings_icon" class="header_icon button_override"><span class="fa fa-gear fa-2x"></span></button>');
    		};
    		
    		return this;
    	},
    	
        events: {
            "click #home_icon":"welcome",
            "click #register_icon":"registration",
            "click #phone_icon":"contact",
            "click #menu_button":"menu",
            "click #settings_icon":"settings"
            	
        },

        registration: function(){
    		LibertyMutualIVIBaseApp.navigate({route : '#registration', trigger : true});
    	},
    	
    	contact: function() {
    		LibertyMutualIVIBaseApp.navigate({route : '#contact', trigger : true});
    	},
    	
    	welcome: function() {
    		LibertyMutualIVIBaseApp.navigate({route : '#welcome', trigger : true});
    	},
    	
    	menu: function() {
    		LibertyMutualIVIBaseApp.navigate({route : '#menu', trigger : true});
    	},
    	
    	settings: function() {
    		LibertyMutualIVIBaseApp.navigate({route : '#settings', trigger : true});
    	}
    	
    	
    	

    	
    	
    });
})();

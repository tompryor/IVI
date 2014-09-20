/*global LibertyMutualIVIBaseApp, Backbone, JST*/

/* TEST VIEW, PLEASE IGNORE */

LibertyMutualIVIBaseApp.Views = LibertyMutualIVIBaseApp.Views || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Views.POCView = M.View.extend({
        // The properties of a view
    	
    	defaults: {
    		tagname: 'div',
        	id: 'score',
        	model: '',
    	},
    	

        // The views grid
        grid: 'col-xs-12',
 
        // The childViews as object
        // e.q. button: M.ButtonView.extend({value: 'Test'})
    	
    	initialize: function() { 
    		  console.debug("POCView#initialize");
    		//this.model.on('sync', function() {
    		    this.render();
    		//}, this);
    		this.listenTo(this.model, "change", this.render);
    	},
    	
    	events: {
			'click .start-trip': 'startTrip',
			"click .end-trip":   "endTrip",
			"click .get-report": "getReport"
		},
    	
    	render: function() {
    		console.debug("POCVIEW#render");
    		
    		var page = 0;
    		
    		//$('main').html( "<div id='score'></div>" );
   
    		$('#score').html( "<p>Test View. Vehicle Data Simulator</p>" );
    		
    		//show the score
    		$('#score').append( "<p>Score:" + this.model.get('score') + "</p>" );
    		
    		//add sum buTtTtOn!N!?
    		//$('#score').append("<button type='button' class='start-trip'>START TRIP</button>");
    		//$('#score').append("<button type='button' class='end-trip'>END TRIP</button>");
    		//$('#score').append("<button type='button' class='get-report'>GET REPORT</button>");
    		
    		
    		this.$el.html(this.model.attributes);
    		return this;
    	},
		
		startTrip: function() {
			console.debug("startTrip");
		},
		
		endTrip: function() {
			console.debug("endTrip");
		},
		
		getReport: function() {
			console.debug("getReport");
		}
    });

})();

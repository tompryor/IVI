/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';

    LibertyMutualIVIBaseApp.Models.DeviceModel = M.Model.extend({
    	url: 'http://localhost:9081/ivi/resources/devices' , 
    	
    	// The Model Identifier
        idAttribute: '_id',
        //The Model options
        	
        defaults: {
             id: '',
             vinNum: '',
             latitude: '',
             longitude: ''
        },
        /*
        initialize: function() {
        	//console.debug('DeviceModel#initialize');
			var id = window.localStorage.deviceID;
			if (id != null && id != undefined) {
				this.set({id: id});
				console.log("Loaded id " + id);
			} else {
				// Must get id from server.
				var device = this;
				this.save(undefined, {
					success: function (response) {
						var id = device.get("id");
						if (id != undefined && id != null) {
							console.log("Create id " + id);
							window.localStorage.deviceID = id;
						} else {
							console.log("Error, no id from server");
						}
						console.log(response);
						alert(device.get("id"));
						console.log(device.get("id"));
						// need to figure out how to get device id returned by server. then save it to localStorage.
						
					},
					
					error: function (response) {
						console.log("TODO: handle errors");
					}
				});
			}
        }
        */
	});       
})();

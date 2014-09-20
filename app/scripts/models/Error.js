/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function() {
	'use strict';

	LibertyMutualIVIBaseApp.Models.ErrorModel = M.Model.extend({
		/*url: function() {
        	return 'http://localhost:9081/ivi/resources/users?deviceid=1ee3adb2-64bd-4ab6-b0ec-dc670643f95c';
		},*/
		
		defaults: {
			errorCode: ''
		},

		// The Model Identifier
		idAttribute : '_id',
		
		/*
		initialize: function() {
			var id = window.localStorage.userID;
			if (id != null && id != undefined) {
				this.set({id: id});
				console.log("Loaded id " + id);
			} else {
				// Must get id from server.
				var user = this;
				this.save(undefined, {
					success: function (response) {
						// need to fix server returning 304 if this email is used on another device.
						// server should only do email re-use for the same device, and needs to return existing user id.
						var id = user.get("id");
						if (id != undefined && id != null) {
							console.log("Create id " + id);
							window.localStorage.userID = id;
						} else {
							console.log("Error, no id from server");
						}
						console.log(response);
						alert(user.get("id"));
						console.log(user.get("id"));
						// need to figure out how to get user id returned by server. then save it to localStorage.
						
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

//window.localStorage.setItem("userID", "foo");
//alert(window.localStorage.getItem("userID"));
// 			delete window.localStorage.userID;

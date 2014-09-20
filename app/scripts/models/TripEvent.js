/*global LibertyMutualIVIBaseApp, Backbone*/

LibertyMutualIVIBaseApp.Models = LibertyMutualIVIBaseApp.Models || {};

(function () {
    'use strict';
    // we assume app does not support resuming an incomplete trip after restarting app,
    // so id always starts from zero
    //need to reset global trpEventNum after the trip ends so that events always start from 0 for each new trip
    
    var tripEventNum = 0;
    
    LibertyMutualIVIBaseApp.Models.TripEventModel = M.Model.extend({
        // The Model Identifier
        idAttribute: '_id',
        //url: 'http://localhost:9081/ivi/resources/trips?userID=345',
        //url: 'http://localhost:9081/ivi/resources/trips?userID=' + UserIdModel.get('userID'),
        url: function() {
        	return 'http://localhost:9081/ivi/resources/trips/' + this.get("tripID") + '/events';
        },
        //The Model options
            
        defaults : {
        	eventCode: '',
        	type : '',
        	tripID : '',
        	contactNumber : '',
        	voucherNumber : '',
        	pointDateStamp : '',
        	pointTimeStamp : '',
        	pointGPSquality : '',
        	pointLocalTimeOffset : '',
        	eventIntensity : '',
        	eventDuration : '',
        	chassisVINnumber : '',
        	odometerReading : '',
        	avSpeedDuringEvent : '',
        	maxAccelDuringEvent : '',
        	yardsTravelled : '',
        	timeElapsed : '',
        	pointSpeedVSS : '',
        	pointSpeedGPS : '',
        	pointHeading : '',
        	avSpeedFromPrevPoint : '',
        	roadType : ''
        },
        
        // Override toJSON to print object as a 1-element list
        // In the future we should save a batch of multiple events at once.
        toJSON : function() {

        },

        initialize : function () {
        	this.set({eventNum: tripEventNum});
        	tripEventNum++;
        	//this.set({speed: LibertyMutualIVIBaseApp.Models.BridgeModel.get("gpsSpeed")});
        }
    });

})();

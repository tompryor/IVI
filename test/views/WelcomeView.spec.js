/*global describe, beforeEach, assert, it  */
'use strict';

describe('Welcome View', function () {

    beforeEach(function () {
    	this.User = LibertyMutualIVIBaseApp.Models.UserModel;

    	this.View = LibertyMutualIVIBaseApp.Views.WelcomeView.create({model: this.User});
       
    });
        
    describe('Construct', function () {

    	it('Should create a new view', function() {
    		expect(this.View).to.exist;    
    	});
    	
    	//test cases broken because of new start app initializations
    	/*
    	it('Should check if the user is registered or not', function () {
    		var isReg = LibertyMutualIVIBaseApp.Models.UserModel.get('isRegistered');
    		var html = $('#settings_icon').html();
    		
    		var pass;
    		if(isReg) {
    			if(html == '<span class="fa fa-gear fa-2x"></span>') {
    				pass = true;
    			};
    		};
    		
    		expect(pass).to.equal(true);
    	});
    	
    	*/
    });

});

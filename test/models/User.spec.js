/*global describe, beforeEach, assert, it  */
(function() {
	'use strict';
    var expect = chai.expect;
    var should = chai.should();
    var assert = chai.assert;

	describe('User Model', function() {
		describe('Construct', function() {
			it('should create a new User with default values', function() {

				should.exist(LibertyMutualIVIBaseApp.Models.UserModel);
				assert.equal(LibertyMutualIVIBaseApp.Models.UserModel.get('firstName'), '');
				assert.equal(LibertyMutualIVIBaseApp.Models.UserModel.get('lastName'), '');
				//assert.equal(LibertyMutualIVIBaseApp.Models.UserModel.get('id'), '');
				assert.equal(LibertyMutualIVIBaseApp.Models.UserModel.get('email'), '');
				assert.equal(LibertyMutualIVIBaseApp.Models.UserModel.get('viewedTutorial'), '');

			});
		});
	});
})();

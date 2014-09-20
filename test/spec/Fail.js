/* global describe, it */

(function () {
    'use strict';
    
	describe('Failure Example', function() {
		describe('This test will fail', function() {
			it('Should have not succeded', function() {
				assert.equal(true, false);
			});
		});
	});
})();

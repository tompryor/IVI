var webdriver = require('selenium-webdriver');
var driver = require('./client').driver;
var expect = require('chai').expect;

describe('Application load', function(){
	it('sets page title', function(done){	
		driver.get('http://localhost:9000');
		driver.getTitle().then(function(title) {
			   expect(title).to.equal('libertymutual-ivi-base-app');
			   done();
		});
	});
	it('can navigate to #drive_coach with buttons', function(done){
		driver.findElement(webdriver.By.id('accept_button')).click();
		driver.findElement(webdriver.By.id('start_drive_button')).click();
		driver.getCurrentUrl().then(function(url) {
			   expect(url).to.equal('http://localhost:9000/#drive_coach');
			   done();
		});
	});
});
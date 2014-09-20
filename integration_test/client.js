// http://code.tutsplus.com/tutorials/headless-functional-testing-with-selenium-and-phantomjs--net-30545
// https://www.npmjs.org/package/selenium-webdriver

var webdriver = require('selenium-webdriver');
var builder = new webdriver.Builder();
builder.usingServer("http://127.0.0.1:4444/wd/hub");
var driver = builder.withCapabilities(webdriver.Capabilities.phantomjs()).build();
exports.driver = driver;

after(function() {
    driver.quit();
});
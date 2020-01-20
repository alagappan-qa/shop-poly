let autoReloadJson = require ('auto-reload-json');

const getShadowDomHtml = (shadowRoot) => {
    let shadowHTML = '';
    for (let el of shadowRoot.childNodes) {
        shadowHTML += el.nodeValue || el.outerHTML;
    }
    return shadowHTML;
};

// Recursively replaces shadow DOMs with their HTML.
const replaceShadowDomsWithHtml = (rootElement) => 
{
    for (let el of rootElement.querySelectorAll('*')) {
        if (el.shadowRoot) {
            replaceShadowDomsWithHtml(shadowRoot);
            el.innerHTML += getShadowDomHtml(el.shadowRoot);
        }
    }
};

const EC = protractor.ExpectedConditions;
let dataJSONPageInfo = browser.params.dataConfigJSONPageStaticInfo;
let dataJSONPageInfoRead = autoReloadJson(dataJSONPageInfo);

//let PO_automationPractice = new browser.params.automationPractice_PO();

beforeEach(async () => {
	await browser.waitForAngularEnabled(false);
});

describe('Testing Automation Practice site', () => {

it('Login Page', async () =>{
	let homePage=await element(by.tagName('shop-app'));
	let ecWaitForLoginPageToLoad = EC.and (EC.visibilityOf(homePage));
	await browser.get(dataJSONPageInfoRead.indexPage.pageURL);
	await browser.wait(ecWaitForLoginPageToLoad, 20000, 'Timeout: PageLoadError');
	expect(await  browser.getTitle()).toEqual(dataJSONPageInfoRead.indexPage.pageTitle);
	});

it('After Login', async () =>{
	
//Working Code:
	let elm1=await element(by.tagName('shop-app'));
	let elm2 =  await elm1.element(by.css_sr("::sr iron-pages"));
	let elm3 =  await elm2.element(by.tagName("shop-home"));
	let elm4 =  await elm3.all(by.css_sr("::sr div")).get(0);
	let elm5 = await elm4.element(by.tagName('shop-button'));
	await elm5.click();
	
/*	
// Non-Working Code by siply specifying Root Element with the deep leaf element.
	let elm1=await element(by.tagName('shop-app'));
	let elm2 =  await elm1.element(by.css_sr("::sr iron-pages"));
	let elm5 = await elm2.element(by.tagName('shop-button'));
	await elm5.click();
	*/

/*
//When using replaceShadowDomsWithHtml function it's not working
await replaceShadowDomsWithHtml(element(by.tagName('shop-app')));
await console.log(element.all(by.tagName('shop-button')));
*/
	browser.driver.sleep(30000);
	},60000);

});
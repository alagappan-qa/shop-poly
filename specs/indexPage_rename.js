let autoReloadJson = require ('auto-reload-json');

var querySelectorAllDeep =  function querySelectorAllDeep(selector, root = document) {
    return _querySelectorDeep(selector, true, root);
}

var querySelectorDeep =  function querySelectorDeep(selector, root = document) {
    return _querySelectorDeep(selector, false, root);
}

var getObject = function getObject(selector, root = document) {
	// split on > for multilevel selector
    const multiLevelSelectors = splitByCharacterUnlessQuoted(selector, '>');
	if (multiLevelSelectors.length == 1) {
		return querySelectorDeep(multiLevelSelectors[0], root);
	} else if (multiLevelSelectors.length == 2) {
		return querySelectorDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root);
	} else if (multiLevelSelectors.length == 3) {
		return querySelectorDeep(multiLevelSelectors[2], querySelectorDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root));
	}
	//can add more level if we need to
	
}

var getAllObject = function getAllObject(selector, root = document) {
    // split on > for multilevel selector
    const multiLevelSelectors = splitByCharacterUnlessQuoted(selector, '>');
    if (multiLevelSelectors.length == 1) {
        return querySelectorAllDeep(multiLevelSelectors[0], root);
    } else if (multiLevelSelectors.length == 2) {
        return querySelectorAllDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root);
    } else if (multiLevelSelectors.length == 3) {
        return querySelectorAllDeep(multiLevelSelectors[2], querySelectorDeep(multiLevelSelectors[1], querySelectorDeep(multiLevelSelectors[0]).root));
    }
    //can add more level if we need to
    
}

function _querySelectorDeep(selector, findMany, root) {
    let lightElement = root.querySelector(selector);

    if (document.head.createShadowRoot || document.head.attachShadow) {
        // no need to do any special if selector matches something specific in light-dom
        if (!findMany && lightElement) {
            return lightElement;
        }

        // split on commas because those are a logical divide in the operation
        const selectionsToMake = splitByCharacterUnlessQuoted(selector, ',');

        return selectionsToMake.reduce((acc, minimalSelector) => {
            // if not finding many just reduce the first match
            if (!findMany && acc) {
                return acc;
            }
            // do best to support complex selectors and split the query
            const splitSelector = splitByCharacterUnlessQuoted(minimalSelector
                    //remove white space at start of selector
                    .replace(/^\s+/g, '')
                    .replace(/\s*([>+~]+)\s*/g, '$1'), ' ')
                // filter out entry white selectors
                .filter((entry) => !!entry);
            const possibleElementsIndex = splitSelector.length - 1;
            const possibleElements = collectAllElementsDeep(splitSelector[possibleElementsIndex], root);
            const findElements = findMatchingElement(splitSelector, possibleElementsIndex, root);
            if (findMany) {
                acc = acc.concat(possibleElements.filter(findElements));
                return acc;
            } else {
                acc = possibleElements.find(findElements);
                return acc;
            }
        }, findMany ? [] : null);


    } else {
        if (!findMany) {
            return lightElement;
        } else {
            return root.querySelectorAll(selector);
        }
    }

}

function findMatchingElement(splitSelector, possibleElementsIndex, root) {
    return (element) => {
        let position = possibleElementsIndex;
        let parent = element;
        let foundElement = false;
        while (parent) {
            const foundMatch = parent.matches(splitSelector[position]);
            if (foundMatch && position === 0) {
                foundElement = true;
                break;
            }
            if (foundMatch) {
                position--;
            }
            parent = findParentOrHost(parent, root);
        }
        return foundElement;
    };

}

function splitByCharacterUnlessQuoted(selector, character) {
    return selector.match(/\\?.|^$/g).reduce((p, c) => {
        if (c === '"' && !p.sQuote) {
            p.quote ^= 1;
            p.a[p.a.length - 1] += c;
        } else if (c === '\'' && !p.quote) {
            p.sQuote ^= 1;
            p.a[p.a.length - 1] += c;

        } else if (!p.quote && !p.sQuote && c === character) {
            p.a.push('');
        } else {
            p.a[p.a.length - 1] += c;
        }
        return p;
    }, { a: [''] }).a;
}


function findParentOrHost(element, root) {
    const parentNode = element.parentNode;
    return (parentNode && parentNode.host && parentNode.nodeType === 11) ? parentNode.host : parentNode === root ? null : parentNode;
}


function collectAllElementsDeep(selector = null, root) {
    const allElements = [];

    const findAllElements = function(nodes) {
        for (let i = 0, el; el = nodes[i]; ++i) {
            allElements.push(el);
            // If the element has a shadow root, dig deeper.
            if (el.shadowRoot) {
                findAllElements(el.shadowRoot.querySelectorAll('*'));
            }
        }
    };

    findAllElements(root.querySelectorAll('*'));

    return selector ? allElements.filter(el => el.matches(selector)) : allElements;
}

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
/*	
//Working Code:
	let elm1=await element(by.tagName('shop-app'));
	let elm2 =  await elm1.element(by.css_sr("::sr iron-pages"));
	let elm3 =  await elm2.element(by.tagName("shop-home"));
	let elm4 =  await elm3.all(by.css_sr("::sr div")).get(0);
	let elm5 = await elm4.element(by.tagName('shop-button'));
	await elm5.click();
	*/
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

// While trying to use a different function
querySelectorAllDeep(element.all(by.tagName('shop-button')).get(2),document.body);

	browser.driver.sleep(30000);
	},60000);

});
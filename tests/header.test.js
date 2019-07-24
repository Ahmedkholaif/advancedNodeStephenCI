const Page = require('./helpers/Page');

let page;

beforeEach(async () => {
    page = await Page.build();
    await page.goto('http://localhost:3000');
})

test('the header has the correct text', async () => {

    const text = await page.$eval('a.brand-logo', elm => elm.innerHTML);
    console.log(text);
    expect(text).toEqual('Blogster');
});


test('click login starts oAuth flow', async () => {

    await page.click('.right a');
    const url = await page.url();

    console.log(url);
    // expect(url).toContain('accounts.google')
    expect(url).toMatch(/accounts\.google/);
});

test('When sign in show logout button', async () => {
    await page.login();

    const text = await page.$eval("li a[href='/auth/logout']", el => el.innerHTML);
    expect(text).toEqual('Logout');
});

afterEach(async () => {
    await page.close();
})

//======================================

describe('when logged in ', async () => {
    beforeEach(async () => {
        await page.login();
        await page.click('a.btn-floating');
    });

    test('can see blog create form ', async () => {
        // await page.WaitFor('form label');
        const label = await page.$eval('form label', el => el.innerHTML);
        expect(label).toEqual('Blog Title');
    });
});
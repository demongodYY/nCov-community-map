const puppeteer = require('puppeteer');
const fs = require('fs'); //文件模块

(async () => {
  const province = '四川省';
  const city = '成都市';
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('https://ncov.html5.qq.com/community');
  // page.on('console', msg => {
  //   console.log(msg);
  // });
  await page.waitFor(2000);

  await page.$$eval('.area-sele-item', el => {
    el[0].click();
  });

  await page.$$eval('.area-list .list .item', (el, province) => {
    const list = Array.from(el);
    const target = list.find((item) => item.innerText === province);
    target.click();
  }, province);

  await page.$$eval('.area-sele-item', el => {
    el[1].click();
  });

  await page.$$eval('.area-list .list .item', (el, city) => {
    const list = Array.from(el);
    const target = list.find((item) => item.innerText === city);
    target.click();
  }, city);

  await page.waitFor(2000);

  await page.$$eval('#viewMore', el => {
    el.forEach(item => item.click());
  })

  const result = await page.$$eval('#trafficList tbody tr', (el, city) => {
    const list = Array.from(el);
    return list.map((item) => {
      const title = item.parentNode.parentNode.parentElement.previousElementSibling.innerText.split('(')[0];
      const address = item.childNodes[0].firstChild.innerText;
      const count = item.childNodes[1].firstChild.innerText;
      return [city + title + address, count];
    });
  }, city);

  const sum = result.reduce((sofar, curr) => {
    const num = parseInt(curr[1]);
    num === num ? sofar += num : sofar += 1;
    return sofar;
  }, 0)

  console.log(sum);
  fs.writeFileSync(`${city}.json`, JSON.stringify({ total: sum, data: result }));
  await browser.close();
})();

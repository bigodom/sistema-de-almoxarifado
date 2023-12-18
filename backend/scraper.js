import { launch } from 'puppeteer';
import axios from 'axios';

const ARMARIO_URL = process.env.ARMARIO_URL;

async function scrapeData() {
  const browser = await launch({ headless: false });
  const page = await browser.newPage();

  // Navegar até a página de login e realizar o login
  await page.goto(ARMARIO_URL);
  await page.type('#email', 'uniforme@comercialmonlevade.com.br');
  await page.type('#senha', 'Horizonte');
  await page.click('#open');
  await page.setViewport({ width: 1080, height: 1024 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  const element = await page.waitForSelector('#navbarSupportedContent > ul.nav.navbar-nav.navbar-right > li:nth-child(2)')
  await element.click();
  await new Promise(resolve => setTimeout(resolve, 2000));
  const element2 = await page.waitForSelector('#navbarSupportedContent > ul.nav.navbar-nav.navbar-right > li:nth-child(3)')
  await element2.click();
  await new Promise(resolve => setTimeout(resolve, 2000));

  const data = [];

  for (let i = 1; i <= 492; i++) {
    const selector1 = `#registro > tr:nth-child(${i}) > td:nth-child(1)`;
    const selector2 = `#registro > tr:nth-child(${i}) > td:nth-child(2)`;
    const selector3 = `#registro > tr:nth-child(${i}) > td:nth-child(3)`;

    const number = await page.$eval(selector1, (el) => parseInt(el.textContent.trim(), 10));

    const date = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.textContent.trim() : null;
    }, selector2);

    const name = await page.evaluate((sel) => {
      const element = document.querySelector(sel);
      return element ? element.textContent.trim() : null;
    }, selector3);

    data.push({
      number,
      date,
      name,
    });
  }

  await browser.close();

  return data;
}

const API_URL = process.env.API_URL;

scrapeData().then((result) => {
  const updateWardrobe = async () => {
    for (let i = 0; i < result.length; i++) {
      const armario = {
        number: result[i].number,
        situation: "Ocupado",
        name: result[i].name,
        date: result[i].date,
      };

      console.log(armario);

      try {
        const response = await axios.put(`${API_URL}/api/wardrobe/${armario.number}`, armario);
        console.log(`Armário atualizado com sucesso: ${JSON.stringify(response.data)}`);
      } catch (error) {
        console.error('Erro ao atualizar armário:', error.message);
      }
    }
  }
  updateWardrobe();
});


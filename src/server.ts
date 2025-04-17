import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

interface Anime {
  id: number;
  title: string;
  image_url: string;
  url: string;
}

app.get('/api/anime-list/:username', async (req, res) => {
  const { username } = req.params;

  const allAnimes: Anime[] = [];

  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();

    let offset = 0;
    const status = 6; // Completed
    let hasMore = true;

    while (hasMore) {
      const url = `https://myanimelist.net/animelist/${username}?status=${status}&offset=${offset}`;

      await page.goto(url, { waitUntil: 'networkidle0' });

      try {
        await page.waitForSelector('.list-table', { timeout: 5000 });
      } catch (e) {
        // Lista não carregou = fim da lista
        break;
      }

      const animesOnPage = await page.evaluate(() => {
        const animes: Anime[] = [];
        const rows = document.querySelectorAll('.list-table-data');

        rows.forEach((row: Element) => {
          const titleElement = row.querySelector('.data.title a');
          const imageElement = row.querySelector('.data.image img');

          if (titleElement && imageElement) {
            const title = titleElement.textContent?.trim() || '';
            const url = titleElement.getAttribute('href') || '';
            const imageUrl = imageElement.getAttribute('src') || '';
            const id = parseInt(url.split('/')[4]) || 0;

            animes.push({
              id,
              title,
              image_url: imageUrl,
              url,
            });
          }
        });

        return animes;
      });

      if (animesOnPage.length === 0) {
        hasMore = false;
      } else {
        allAnimes.push(...animesOnPage);
        offset += 300;
      }
    }

    await browser.close();
    res.json(allAnimes);
  } catch (error) {
    console.error('Erro ao fazer scraping:', error);
    res.status(500).json({ error: 'Erro ao buscar lista de animes' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

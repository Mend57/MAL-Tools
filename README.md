# MAL Tools

Um aplicativo web que randomiza animes da sua lista "Plan to Watch" do MyAnimeList.

## Instalação

1. Clone este repositório
2. Instale as dependências:
```bash
npm install
```

## Como Usar

1. Inicie o servidor backend (em um terminal):
```bash
npm run server
```

2. Inicie o servidor frontend (em outro terminal):
```bash
npm start
```

3. Abra seu navegador e acesse `http://localhost:3000`

4. Digite seu nome de usuário do MyAnimeList

5. Clique em "Buscar Lista" para carregar sua lista de animes

6. Clique em "Randomizar Anime" para obter um anime aleatório da sua lista

## Observações Importantes

- O aplicativo usa web scraping para obter os dados do MyAnimeList
- O scraping é feito através do Puppeteer, que simula um navegador
- A lista é obtida da página "Plan to Watch" do seu perfil
- O servidor backend roda na porta 3001
- O frontend roda na porta 3000

## Tecnologias Utilizadas

- React
- TypeScript
- Tailwind CSS
- Express
- Puppeteer
- Axios 

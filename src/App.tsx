import React, { useState } from 'react';
import axios from 'axios';

interface Anime {
  id: number;
  title: string;
  image_url: string;
  url: string;
}

const App: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [randomAnime, setRandomAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchAnimeList = async () => {
    if (!username) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`http://localhost:3001/api/anime-list/${username}`);
      // Ordena os animes alfabeticamente
      const sortedAnimes = response.data.sort((a: Anime, b: Anime) => 
        a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base' })
      );
      setAnimeList(sortedAnimes);
    } catch (err) {
      setError('Erro ao buscar lista de animes. Por favor, tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const randomizeAnime = () => {
    if (animeList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * animeList.length);
    setRandomAnime(animeList[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden p-6 mb-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-200">
            MAL Tools
          </h1>
          
          <div className="mb-6">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your MAL username"
              className="w-full px-4 py-2 border border-gray-700 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={fetchAnimeList}
              disabled={loading || !username}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Loading...' : 'Load List'}
            </button>
          </div>

          {error && (
            <div className="text-red-400 text-center mb-4">
              {error}
            </div>
          )}

          {animeList.length > 0 && (
            <div className="text-center mb-8">
              <p className="mb-4 text-gray-300">
                You have {animeList.length} animes in your "Plan to Watch" list
              </p>
              <button
                onClick={randomizeAnime}
                className="bg-emerald-600 text-white py-2 px-6 rounded-lg hover:bg-emerald-500 transition-colors"
              >
                Randomize Anime
              </button>
            </div>
          )}

          {randomAnime && (
            <div className="mt-8 p-4 border border-gray-700 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-4 text-center text-gray-200">{randomAnime.title}</h2>
              <div className="flex justify-center">
                <img
                  src={randomAnime.image_url}
                  alt={randomAnime.title}
                  className="max-w-xs w-full h-auto object-contain rounded-lg shadow-lg"
                />
              </div>
              <div className="text-center mt-4">
                <a
                  href={`https://myanimelist.net${randomAnime.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  View on MyAnimeList
                </a>
              </div>
            </div>
          )}
        </div>

        {animeList.length > 0 && (
          <div className="bg-gray-900 rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-200">
              Your Complete List
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {animeList.map((anime, index) => (
                <div key={anime.id} className="border border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-800">
                  <div className="flex items-center mb-2">
                    <span className="bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-2">
                      {index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-200">{anime.title}</h3>
                  </div>
                  <img
                    src={anime.image_url}
                    alt={anime.title}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <a
                    href={`https://myanimelist.net${anime.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors"
                  >
                    View on MyAnimeList
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App; 
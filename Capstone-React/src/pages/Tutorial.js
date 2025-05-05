import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_KEY = 'AIzaSyDLK4BMsbTpUgkO9a4PVl2G0pVvmASppxg';

const menuItems = [
  {
    name: 'Home',
    href: '/',
  },
];

const placeholderOptions = [
  'wedding tips',
  'birthday ideas',
  'conference checklist',
  'event decoration inspiration'
];

const Tutorial = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [placeholder, setPlaceholder] = useState(placeholderOptions[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const currentIndex = placeholderOptions.indexOf(prev);
        return placeholderOptions[(currentIndex + 1) % placeholderOptions.length];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const searchVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=tips for organizing ${searchTerm}&type=video&key=${API_KEY}`
      );
      const data = await response.json();
      setVideos(data.items);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
    setLoading(false);
  };

  const handleVideoClick = (videoId) => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    window.open(youtubeUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-blue-100 px-4 py-6">
      <header className="w-full border-b bg-white shadow-sm mb-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="inline-flex items-center space-x-2">
            <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text tracking-wide">
              Eventio
            </span>
          </div>
          <ul className="inline-flex space-x-8">
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10 font-poppins">Need Ideas?</h1>
      <form
  onSubmit={(e) => {
    e.preventDefault(); // Prevent page reload
    searchVideos();     // Trigger search
  }}
  className="flex justify-center mb-10"
>
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder={`Try: ${placeholder}`}
    className="p-3 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
  />
  <button
    type="submit"
    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-r-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <Search size={20} />
  </button>
</form>


      {loading && <p className="text-center text-blue-600 font-medium">Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {videos.map((video) => (
          <div
            key={video.id.videoId}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden relative group"
          >
            <img
              src={video.snippet.thumbnails.medium.url}
              alt={video.snippet.title}
              className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300">
              <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-1 text-gray-800 line-clamp-2">
                {video.snippet.title}
              </h2>
              <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                {video.snippet.description}
              </p>
              <button
                onClick={() => handleVideoClick(video.id.videoId)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition"
              >
                Watch Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tutorial;
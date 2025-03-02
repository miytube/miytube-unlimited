
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };
  
  const clearSearch = () => {
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search"
        className="search-input transition-all duration-300 focus:shadow-lg"
        aria-label="Search MiyTube"
      />
      {query && (
        <button 
          type="button" 
          onClick={clearSearch}
          className="absolute right-12 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
      <button type="submit" className="search-button" aria-label="Search">
        <Search size={20} />
      </button>
    </form>
  );
};

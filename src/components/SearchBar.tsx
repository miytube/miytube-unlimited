
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
    <form onSubmit={handleSubmit} className="search-bar w-full max-w-xl mx-auto relative">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search MiyTube"
        className="search-input transition-all duration-300 focus:shadow-lg w-full pl-4 pr-12 py-2 rounded-full border border-input bg-background"
        aria-label="Search MiyTube"
      />
      {query && (
        <button 
          type="button" 
          onClick={clearSearch}
          className="absolute right-12 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
      <button 
        type="submit" 
        className="search-button absolute right-0 top-0 h-full px-4 rounded-r-full bg-secondary hover:bg-secondary/80 transition-colors" 
        aria-label="Search"
      >
        <Search size={20} />
      </button>
    </form>
  );
};

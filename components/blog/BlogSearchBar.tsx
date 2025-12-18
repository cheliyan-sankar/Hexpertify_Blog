'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';

interface BlogSearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function BlogSearchBar({ placeholder = 'Search Blogs', onSearch }: BlogSearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:border-transparent text-sm"
        style={{
          '--tw-ring-color': '#450BC8',
        } as React.CSSProperties}
        onFocus={(e) => (e.currentTarget.style.boxShadow = '0 0 0 2px #450BC8')}
        onBlur={(e) => (e.currentTarget.style.boxShadow = '')}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors"
        style={{ transition: 'color 0.2s' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#450BC8')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '')}
        aria-label={placeholder ?? 'Search'}
        title={placeholder ?? 'Search'}
      >
        <Search size={20} aria-hidden="true" />
      </button>
    </form>
  );
}

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchContextType {
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  openSearch: () => void;
  closeSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = () => setSearchOpen(true);
  const closeSearch = () => setSearchOpen(false);

  return (
    <SearchContext.Provider value={{ searchOpen, setSearchOpen, openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchDialog() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearchDialog must be used within a SearchProvider');
  }
  return context;
}

import { useState } from "react";

// Calls onSearch({ search, location }). The parent decides what "search" means.
export default function SearchBar({ initialSearch = "", initialLocation = "", onSearch }) {
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ search: search.trim(), location: location.trim() });
  };

  const inputClass = "w-full rounded border border-stone-300 bg-white px-3 py-2 text-stone-900";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row" role="search">
      <div className="flex-1">
        <label htmlFor="search-title" className="sr-only">Job title</label>
        <input id="search-title" type="text" placeholder="Job title (e.g. React)" value={search}
          onChange={(e) => setSearch(e.target.value)} className={inputClass} />
      </div>
      <div className="flex-1">
        <label htmlFor="search-location" className="sr-only">Location</label>
        <input id="search-location" type="text" placeholder="Location (e.g. Pune)" value={location}
          onChange={(e) => setLocation(e.target.value)} className={inputClass} />
      </div>
      <button type="submit"
        className="rounded bg-ink px-6 py-2 font-medium text-white hover:bg-stone-700">
        Search
      </button>
    </form>
  );
}

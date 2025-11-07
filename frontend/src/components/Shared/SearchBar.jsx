import React from "react";
export default function Searchbar({ query, setQuery, filterBy, setFilterBy }) {
  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Search notes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 border rounded w-64 text-black"
      />
      <select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="p-2 border rounded text-black"
      >
        <option value="all">All</option>
        <option value="title">Title</option>
        <option value="description">Description</option>
      </select>
    </div>
  );
}

import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ onSearch, categories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  const handleSearch = () => {
    onSearch?.({ search: query, category, type });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    onSearch?.({ search: query, category: e.target.value, type });
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    onSearch?.({ search: query, category, type: newType });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search events"
          className="w-full border rounded-full py-2 px-4 pl-10 h-10 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-eventify-500"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {categories && (
          <select
            value={category}
            onChange={handleCategoryChange}
            className="h-10 w-full rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white outline-none sm:max-w-xs"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange("")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
              type === ""
                ? "bg-eventify-500 text-white"
                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            All types
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("NORMAL")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
              type === "NORMAL"
                ? "bg-eventify-500 text-white"
                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Normal Event
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("VOTING")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
              type === "VOTING"
                ? "bg-eventify-500 text-white"
                : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Voting Event
          </button>
        </div>
      </div>
    </div>
  );
}

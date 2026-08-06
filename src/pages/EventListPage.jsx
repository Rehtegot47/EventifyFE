import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getEvents, getCategories } from "../services/eventService";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EventListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback((params = {}) => {
    setLoading(true);
    setError(null);
    getEvents(params)
      .then((res) => {
        setEvents(res.events || res || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events. Please try again.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    fetchEvents({ search, category });
  }, [searchParams, fetchEvents]);

  const handleSearch = ({ search, category, type }) => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (type) params.type = type;
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-10 xl:px-0 py-10">
      <div className="mb-8 space-y-5 rounded-3xl border border-eventify-200/70 bg-eventify-50/80 p-5 shadow-sm dark:border-eventify-900/40 dark:bg-eventify-950/20">
        <div className="space-y-2">
          <p className="text-sm font-medium text-eventify-700 dark:text-eventify-300">Explore Events</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find what matches your vibe</h1>
          <p className="hidden max-w-2xl text-sm text-gray-500 dark:text-gray-400 sm:block">
            Browse by keyword, category, and event type. Find the perfect event for you.
          </p>
        </div>
        <SearchBar onSearch={handleSearch} categories={categories} />
      </div>

      <div className="mt-8">
        {loading ? (
          <LoadingSpinner size="lg" className="py-16" />
        ) : error ? (
          <div className="text-center py-16 text-red-500">
            <p className="text-lg">{error}</p>
            <button
              onClick={() => fetchEvents({ search: searchParams.get("search") || "", category: searchParams.get("category") || "" })}
              className="mt-3 text-eventify-600 hover:underline cursor-pointer"
            >
              Try again
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <p className="text-lg">No events found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-16">
            {events.map((evt) => (
              <EventCard key={evt.id} event={evt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

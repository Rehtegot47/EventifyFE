import { Link } from "react-router-dom";

const EVE_IMAGES = Array.from({ length: 12 }, (_, i) => `/EVE${i + 1}.jpg`);

const CATEGORY_ICONS = {
  music: "🎵", conference: "🎤", sports: "⚽", arts: "🎨",
  tech: "💻", food: "🍔", charity: "❤️", business: "💼",
  default: "🎪",
};

export default function CategoryCard({ category }) {
  const catNum = Number(category._id) || (category.name ? category.name.charCodeAt(0) : 0);
  const bgImage = EVE_IMAGES[Math.abs(catNum - 1) % 12];
  const icon = CATEGORY_ICONS[category.slug] || CATEGORY_ICONS[category.name?.toLowerCase()] || CATEGORY_ICONS.default;

  return (
    <Link
      to={`/events?category=${category.slug || category.name}`}
      className="group relative flex flex-col items-center justify-end p-4 sm:p-6 h-36 sm:h-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-lg overflow-hidden transition-shadow duration-300 card-3d"
    >
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <span className="relative text-2xl sm:text-3xl mb-1 transition-transform duration-300 group-hover:scale-125">{icon}</span>
      <span className="relative font-semibold text-white text-sm">{category.name}</span>
    </Link>
  );
}

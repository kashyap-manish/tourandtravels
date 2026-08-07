import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';

export default function TourCard({ _id, id, slug, img, price, days, title, location, features, rating = 4, reviews = 24, rank = 99 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardId = _id || id;
  const isWishlisted = useSelector(s => s.wishlist.ids.includes(cardId));
  const isPopular = rank < 3;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden h-52 shrink-0">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${img}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badges row */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isPopular && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
              🔥 Popular
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => dispatch(toggleWishlist(cardId))}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
        >
          <i className={`fa ${isWishlisted ? 'fa-heart text-red-500' : 'fa-heart-o text-gray-400 hover:text-red-500'} text-sm transition-colors`} />
        </button>

        {/* Duration */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <i className="fa fa-clock-o text-orange-400" />
          {days}
        </div>

        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          {price}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          onClick={() => navigate(`/destination/${slug}`)}
          className="font-bold text-gray-900 text-base leading-snug hover:text-orange-500 transition-colors cursor-pointer mb-1 line-clamp-2"
        >
          {title}
        </h3>

        <p className="text-sm text-gray-400 flex items-center gap-1.5 mb-3">
          <i className="fa fa-map-marker text-orange-400" />
          {location}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa fa-star text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1.5">({reviews} reviews)</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-gray-100 mt-auto">
          {features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              {f}
            </span>
          ))}
          {features.length > 3 && (
            <span className="text-[11px] bg-orange-50 border border-orange-100 text-orange-500 px-2.5 py-1 rounded-full">
              +{features.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 pb-5">
        <button
          onClick={() => navigate(`/destination/${slug}`)}
          className="w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200 group/btn"
        >
          View Details
          <i className="fa fa-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}

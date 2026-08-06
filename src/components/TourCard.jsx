import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';

export default function TourCard({ _id, id, slug, img, price, days, title, location, features }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardId = _id || id;
  const isWishlisted = useSelector(s => s.wishlist.ids.includes(cardId));
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">

      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${img}')` }}
        />
        {/* Price badge */}
        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          {price}
        </div>
        {/* Wishlist */}
        <button
          onClick={() => dispatch(toggleWishlist(cardId))}
          className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors group/btn">
          <i className={`fa ${isWishlisted ? 'fa-heart text-red-500' : 'fa-heart-o text-gray-400 group-hover/btn:text-red-500'} transition-colors text-sm`} />
        </button>
        {/* Days badge */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <i className="fa fa-clock-o text-orange-400" />
          {days}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-orange-500 transition-colors cursor-pointer">
            {title}
          </h3>
        </div>

        <p className="text-sm text-gray-400 mb-3 flex items-center gap-1.5">
          <i className="fa fa-map-marker text-orange-400" />
          {location}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa fa-star text-xs ${i < 4 ? 'text-yellow-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1">(24 reviews)</span>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
          {features.map((f, i) => (
            <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button
          onClick={() => navigate(`/destination/${slug}`)}
          className="w-full bg-gray-950 hover:bg-orange-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-200"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistAsync } from '../store/wishlistSlice';

export default function TourCard({ _id, id, slug, img, price, days, title, location, features, rating = 4.5, reviews = 24, rank = 99, hotelLink }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardId = _id || id;
  const isWishlisted = useSelector(s => s.wishlist.ids.includes(cardId));
  const isPopular = rank < 3;

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img src={img} alt={title} className="w-full h-52 object-cover" />
        {isPopular && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">Popular</span>
        )}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={e => { e.stopPropagation(); dispatch(toggleWishlistAsync({ id: cardId, type: 'tour', title, img, price, location, slug })); }}
        >
          <i className={`fa ${isWishlisted ? 'fa-heart text-red-500' : 'fa-heart-o text-gray-400'} text-sm`} />
        </button>
        <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <i className="fa fa-clock-o text-orange-400" />{days}
        </span>
        <span className="absolute bottom-3 right-3 bg-orange-500 text-white text-[11px] font-bold px-3 py-1 rounded-full">{price}</span>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
        <p className="text-xs text-gray-400 mb-2"><i className="fa fa-map-marker text-orange-400 mr-1" />{location}</p>
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa ${
              i < fullStars ? 'fa-star text-yellow-400' :
              i === fullStars && hasHalf ? 'fa-star-half-o text-yellow-400' :
              'fa-star text-gray-200'
            } text-xs`} />
          ))}
          <span className="text-[11px] font-semibold text-yellow-500 ml-1">{rating}</span>
          <span className="text-[11px] text-gray-400">({reviews})</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {features.slice(0, 3).map((f, i) => (
            <span key={i} className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{f}</span>
          ))}
        </div>
        <button
          onClick={() => navigate(hotelLink || `/destination/${slug}`)}
          className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-xl transition-colors"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

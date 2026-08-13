import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';

export default function HotelCard({ img, name, location, stars, price, tag, amenities, website }) {
  const dispatch = useDispatch();
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const photo = img || `https://picsum.photos/seed/${seed}/600/400`;
  const href = website || `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + location)}`;
  const cardId = `hotel-${seed}`;
  const isWishlisted = useSelector(s => s.wishlist.ids.includes(cardId));

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <img src={photo} alt={name} className="w-full h-52 object-cover" />
        <span className="absolute top-3 left-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{tag || 'Hotel'}</span>
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={e => { e.stopPropagation(); dispatch(toggleWishlist({ id: cardId, type: 'hotel', title: name, img: photo, price, location, stars, website })); }}
        >
          <i className={`fa ${isWishlisted ? 'fa-heart text-red-500' : 'fa-heart-o text-gray-400'} text-sm`} />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-sm mb-1">{name}</h3>
        <p className="text-xs text-gray-400 mb-2"><i className="fa fa-map-marker text-orange-400 mr-1" />{location}</p>
        <div className="flex items-center gap-0.5 mb-3">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa fa-star text-xs ${i < stars ? 'text-yellow-400' : 'text-gray-200'}`} />
          ))}
        </div>
        <div className="flex flex-col gap-1 mb-4">
          {amenities?.slice(0, 3).map((a, i) => (
            <span key={i} className="text-[11px] text-gray-500">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm font-bold text-orange-500">{price ? `${price} / night` : 'Price on request'}</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-colors"
          >
            {website ? 'Visit Site' : 'Book Now'}
          </a>
        </div>
      </div>
    </div>
  );
}


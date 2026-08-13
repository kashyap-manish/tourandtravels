import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromWishlist, clearWishlist } from '../store/wishlistSlice';

export default function Wishlist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(s => s.wishlist.items);

  const tours  = items.filter(i => i.type === 'tour');
  const hotels = items.filter(i => i.type === 'hotel');

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/bg_2.jpg')", minHeight: '40vh' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
        <div className="relative z-10 text-center text-white pb-12 px-4">
          <p className="text-xs mb-3 flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-[10px] text-orange-500" />
            <span className="text-white">Wishlist</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            My <span className="text-orange-500">Wishlist</span>
          </h1>
          <p className="mt-2 text-gray-300 text-sm">{items.length} saved {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </section>

      <section className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-6">

          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <i className="fa fa-heart-o text-orange-300 text-4xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
              <p className="text-gray-400 text-sm mb-6">Save tours and hotels you love by clicking the heart icon</p>
              <div className="flex gap-3">
                <Link to="/destination" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
                  Browse Tours
                </Link>
                <Link to="/hotel" className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors">
                  Browse Hotels
                </Link>
              </div>
            </div>
          )}

          {items.length > 0 && (
            <>
              {/* Top bar */}
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-gray-500">
                  <span className="font-bold text-gray-900">{items.length}</span> saved items
                </p>
                <button
                  onClick={() => dispatch(clearWishlist())}
                  className="flex items-center gap-2 text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-4 py-2 rounded-full transition-colors"
                >
                  <i className="fa fa-trash" /> Clear All
                </button>
              </div>

              {/* Tours */}
              {tours.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <i className="fa fa-map-marker text-orange-500" /> Tours
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{tours.length}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {tours.map(item => (
                      <WishlistCard key={item.id} item={item} onRemove={() => dispatch(removeFromWishlist(item.id))} onView={() => navigate(`/destination/${item.slug}`)} />
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels */}
              {hotels.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                    <i className="fa fa-building text-orange-500" /> Hotels
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{hotels.length}</span>
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {hotels.map(item => (
                      <WishlistCard key={item.id} item={item} onRemove={() => dispatch(removeFromWishlist(item.id))} onView={() => window.open(item.website || `https://www.google.com/maps/search/${encodeURIComponent(item.title + ' ' + item.location)}`, '_blank')} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

function WishlistCard({ item, onRemove, onView }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-48 overflow-hidden shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${item.img}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Type badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${item.type === 'tour' ? 'bg-orange-500' : 'bg-blue-500'}`}>
            {item.type === 'tour' ? <><i className="fa fa-map-marker mr-1" />Tour</> : <><i className="fa fa-building mr-1" />Hotel</>}
          </span>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-red-500 rounded-full flex items-center justify-center shadow-md transition-all duration-200 group/btn"
        >
          <i className="fa fa-heart text-red-500 group-hover/btn:text-white text-sm transition-colors" />
        </button>

        {/* Stars for hotels */}
        {item.type === 'hotel' && item.stars && (
          <div className="absolute bottom-3 left-3 flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fa fa-star text-[10px] ${i < item.stars ? 'text-yellow-400' : 'text-white/30'}`} />
            ))}
          </div>
        )}

        {/* Price for tours */}
        {item.type === 'tour' && item.price && (
          <div className="absolute bottom-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {item.price}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-orange-500 transition-colors">
          {item.title}
        </h3>
        {item.location && (
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
            <i className="fa fa-map-marker text-orange-400" /> {item.location}
          </p>
        )}
        <button
          onClick={onView}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-orange-500 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors duration-200"
        >
          {item.type === 'tour' ? 'View Tour' : 'View Hotel'}
          <i className="fa fa-arrow-right text-[10px]" />
        </button>
      </div>
    </div>
  );
}


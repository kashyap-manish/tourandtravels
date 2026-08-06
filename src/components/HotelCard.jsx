export default function HotelCard({ img, name, location, stars, price, tag, amenities, website }) {
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const photo = img || `https://picsum.photos/seed/${seed}/600/400`;
  const href = website || `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + location)}`;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
          style={{ backgroundImage: `url('${photo}')` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Tag */}
        <div className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
          {tag}
        </div>

        {/* Wishlist */}
        <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all duration-200 border border-white/30 group/btn">
          <i className="fa fa-heart-o text-white group-hover/btn:text-red-500 transition-colors text-sm" />
        </button>

        {/* Stars on image */}
        <div className="absolute bottom-4 left-4 flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa fa-star text-[11px] drop-shadow ${i < stars ? 'text-yellow-400' : 'text-white/30'}`} />
          ))}
          <span className="text-white/80 text-[10px] ml-1.5 font-medium">{stars}-Star</span>
        </div>

        {/* Hover CTA overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xl transition-colors duration-200 flex items-center gap-2"
          >
            <i className="fa fa-external-link text-xs" />
            {website ? 'Visit Website' : 'View on Map'}
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-orange-500 transition-colors duration-200 mb-1 line-clamp-1">
          {name}
        </h3>

        <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
          <i className="fa fa-map-marker text-orange-400 text-xs" />
          <span className="line-clamp-1">{location}</span>
        </p>

        {/* Amenity pills */}
        {amenities?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {amenities.map((a, i) => (
              <span key={i} className="text-[11px] bg-orange-50 border border-orange-100 text-orange-600 px-2.5 py-1 rounded-full font-medium">
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          {price
            ? <div><span className="text-xl font-extrabold text-orange-500">{price}</span><span className="text-xs text-gray-400 ml-1">/ night</span></div>
            : <span className="text-xs text-gray-400 italic">Price on request</span>
          }
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-950 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors duration-200 flex items-center gap-1.5"
          >
            {website ? 'Visit' : 'Book Now'}
            <i className="fa fa-arrow-right text-[10px]" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function HotelCard({ img, name, location, stars, price, tag, amenities }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden h-56">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${img}')` }}
        />
        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          {tag}
        </div>
        <button className="absolute top-4 right-4 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors group/btn">
          <i className="fa fa-heart-o text-gray-400 group-hover/btn:text-red-500 transition-colors text-sm" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-2">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`fa fa-star text-xs ${i < stars ? 'text-yellow-400' : 'text-gray-200'}`} />
          ))}
          <span className="text-xs text-gray-400 ml-1.5">({stars}-star hotel)</span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-orange-500 transition-colors cursor-pointer mb-1">
          {name}
        </h3>

        <p className="text-sm text-gray-400 mb-4 flex items-center gap-1.5">
          <i className="fa fa-map-marker text-orange-400" />
          {location}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-5">
          {amenities.map((a, i) => (
            <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full flex items-center gap-1">
              {a}
            </span>
          ))}
        </div>

        {/* Price + Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-xl font-extrabold text-orange-500">{price}</span>
            <span className="text-xs text-gray-400 ml-1">/ night</span>
          </div>
          <button className="bg-gray-950 hover:bg-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors duration-200">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

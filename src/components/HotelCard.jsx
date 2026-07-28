export default function HotelCard({ img, price, days, title, location }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow">
      <a href="#" className="card-img block" style={{ backgroundImage: `url('${img}')` }}>
        <span className="price">{price}</span>
      </a>
      <div className="p-4">
        <div className="flex text-yellow-400 text-xs mb-1">
          {[...Array(5)].map((_, i) => <i key={i} className="fa fa-star" />)}
        </div>
        <span className="text-xs text-orange-500 font-semibold uppercase tracking-wide">{days}</span>
        <h3 className="text-base font-bold mt-1 mb-1"><a href="#" className="hover:text-orange-500">{title}</a></h3>
        <p className="text-sm text-gray-500"><i className="fa fa-map-marker mr-1 text-orange-400" />{location}</p>
      </div>
    </div>
  );
}

import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';
import '../styles/FlipCard.css';

export default function TourCard({ _id, id, slug, img, price, days, title, location, features, rating = 4, reviews = 24, rank = 99 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cardId = _id || id;
  const isWishlisted = useSelector(s => s.wishlist.ids.includes(cardId));
  const isPopular = rank < 3;

  return (
    <div className="flip-card-container">
      <div className="flip-card">

        {/* Front */}
        <div className="card-front">
          <figure>
            <img className="card-photo" src={img} alt={title} />
            <div className="img-bg" />
            <figcaption>{location}</figcaption>
          </figure>

          {isPopular && <span className="badge-popular">🔥 Popular</span>}
          <button className="wishlist-btn" onClick={e => { e.stopPropagation(); dispatch(toggleWishlist({ id: cardId, type: 'tour', title, img, price, location, slug })); }}>
            <i className={`fa ${isWishlisted ? 'fa-heart text-red-500' : 'fa-heart-o text-gray-400'} text-sm`} />
          </button>
          <span className="badge-days"><i className="fa fa-clock-o" style={{ color: '#f97316' }} />{days}</span>
          <span className="badge-price">{price}</span>

          <ul className="front-content">
            <li style={{ fontWeight: 700, fontSize: 14 }}>{title}</li>
            {[...Array(5)].map((_, i) => (
              <li key={i}><i className={`fa fa-star text-xs ${i < rating ? 'text-yellow-400' : 'text-white/20'}`} /></li>
            )).slice(0, 1)}
            <li style={{ fontSize: 11, color: '#94a3b8' }}>({reviews} reviews)</li>
            {features.slice(0, 3).map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>

        {/* Back */}
        <div className="card-back">
          <figure>
            <img className="card-photo" src={img} alt={title} />
            <div className="img-bg" />
          </figure>

          <div className="back-content">
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, textAlign: 'center', letterSpacing: 1 }}>{title}</p>
            <p style={{ color: '#94a3b8', fontSize: 12 }}><i className="fa fa-map-marker" style={{ color: '#f97316' }} /> {location}</p>
            <p style={{ color: '#f97316', fontWeight: 700, fontSize: 18 }}>{price}</p>
            <button className="book-btn" onClick={() => navigate(`/destination/${slug}`)}>Book Now</button>
            <div className="design-container">
              {[1,2,3,4,5,6,7,8].map(n => <span key={n} className={`design design--${n}`} />)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist } from '../store/wishlistSlice';
import '../styles/FlipCard.css';

export default function HotelCard({ img, name, location, stars, price, tag, amenities, website }) {
  const dispatch = useDispatch();
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const photo = img || `https://picsum.photos/seed/${seed}/600/400`;
  const href = website || `https://www.google.com/maps/search/${encodeURIComponent(name + ' ' + location)}`;
  const cardId = `hotel-${seed}`;
  const isWishlisted = useSelector(s => s.wishlist.ids.includes(cardId));

  return (
    <div className="flip-card-container">
      <div className="flip-card">

        {/* Front */}
        <div className="card-front">
          <figure>
            <img className="card-photo" src={photo} alt={name} />
            <div className="img-bg" />
            <figcaption>{tag || 'Hotel'}</figcaption>
          </figure>

          <div className="badge-stars">
            {[...Array(5)].map((_, i) => (
              <i key={i} className={`fa fa-star text-xs drop-shadow ${i < stars ? 'text-yellow-400' : 'text-white/30'}`} />
            ))}
          </div>
          <button className="wishlist-btn" onClick={e => { e.stopPropagation(); dispatch(toggleWishlist({ id: cardId, type: 'hotel', title: name, img: photo, price, location, stars, website })); }}>
            <i className={`fa ${isWishlisted ? 'fa-heart text-red-500' : 'fa-heart-o text-gray-400'} text-sm`} />
          </button>

          <ul className="front-content">
            <li style={{ fontWeight: 700, fontSize: 14 }}>{name}</li>
            <li style={{ fontSize: 11, color: '#94a3b8' }}>
              <i className="fa fa-map-marker" style={{ color: '#f97316' }} /> {location}
            </li>
            {amenities?.slice(0, 3).map((a, i) => <li key={i}>{a}</li>)}
            <li style={{ color: '#f97316', fontWeight: 700 }}>
              {price ? `${price} / night` : 'Price on request'}
            </li>
          </ul>
        </div>

        {/* Back */}
        <div className="card-back">
          <figure>
            <img className="card-photo" src={photo} alt={name} />
            <div className="img-bg" />
          </figure>

          <div className="back-content">
            <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, textAlign: 'center', letterSpacing: 1 }}>{name}</p>
            <div style={{ display: 'flex', gap: 2 }}>
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fa fa-star text-xs ${i < stars ? 'text-yellow-400' : 'text-white/20'}`} />
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontSize: 12 }}><i className="fa fa-map-marker" style={{ color: '#f97316' }} /> {location}</p>
            <a href={href} target="_blank" rel="noopener noreferrer" className="book-btn">
              {website ? 'Visit Site' : 'Book Now'}
            </a>
            <div className="design-container">
              {[1,2,3,4,5,6,7,8].map(n => <span key={n} className={`design design--${n}`} />)}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import '../styles/BlogCard.css';

export default function BlogCard({ img, date, category, title, excerpt, author, readTime, url }) {
  const initial = author?.[0]?.toUpperCase() || 'A';

  return (
    <a
      href={url || '/blog'}
      target={url ? '_blank' : '_self'}
      rel="noreferrer"
      className="blog-card-wrap"
    >
      {/* Overlay panel */}
      <div className="blog-card-overlay">
        <div className="blog-card-overlay-content">
          <span className="blog-card-category">{category}</span>
          <div className="blog-card-meta">
            <div className="blog-card-avatar">{initial}</div>
            <span className="blog-card-author">{author}</span>
          </div>
        </div>
        {/* Background image (shrinks on hover) */}
        <div
          className="blog-card-image"
          style={{ backgroundImage: `url('${img}')` }}
        />
        {/* Dots */}
        <div className="blog-card-dots">
          <div className="blog-card-dot" />
          <div className="blog-card-dot" />
          <div className="blog-card-dot" />
        </div>
      </div>

      {/* Text panel */}
      <div className="blog-card-text">
        <p className="blog-card-date">
          <i className="fa fa-calendar-o" /> {date} · {readTime}
        </p>
        <h3 className="blog-card-title">{title}</h3>
        <p className="blog-card-excerpt">{excerpt}</p>
        <span className="blog-card-readmore">
          Read More <i className="fa fa-arrow-right" />
        </span>
      </div>
    </a>
  );
}

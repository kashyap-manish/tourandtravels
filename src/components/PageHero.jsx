import { Link } from 'react-router-dom';

export default function PageHero({ title, breadcrumb, bgImage }) {
  return (
    <section
      className="relative hero-bg flex items-end justify-center"
      style={{ backgroundImage: `url('${bgImage || '/images/bg_1.jpg'}')`, minHeight: '50vh' }}
    >
      {/* <div className="overlay" /> */}
      <div className="relative z-10 text-center text-white pb-16 px-4">
        <p className="text-sm mb-2">
          <Link to="/" className="hover:text-orange-400">Home</Link>
          <i className="fa fa-chevron-right mx-2 text-xs" />
          <span>{breadcrumb}</span>
        </p>
        <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
      </div>
    </section>
  );
}

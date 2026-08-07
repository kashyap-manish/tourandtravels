export default function BlogCard({ img, date, category, title, excerpt, author, readTime, url }) {
  const initial = author?.[0]?.toUpperCase() || 'A';

  return (
    <a
      href={url || '/blog'}
      target={url ? '_blank' : '_self'}
      rel="noreferrer"
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52 shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${img}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow">
          {category}
        </div>

        {/* Read time */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <i className="fa fa-clock-o text-orange-400" /> {readTime}
        </div>

        {/* Hover excerpt overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-black/75 backdrop-blur-sm p-4">
          <p className="text-white text-xs leading-relaxed line-clamp-3">{excerpt}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Date */}
        <p className="text-xs text-gray-400 mb-2 flex items-center gap-1.5">
          <i className="fa fa-calendar-o text-orange-400" /> {date}
        </p>

        <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-orange-500 transition-colors mb-3 line-clamp-2 flex-1">
          {title}
        </h3>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
              {initial}
            </div>
            <span className="text-xs font-semibold text-gray-600 line-clamp-1 max-w-[100px]">{author}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-orange-500 group-hover:text-white group-hover:bg-orange-500 border border-orange-200 group-hover:border-orange-500 px-3 py-1.5 rounded-lg transition-all duration-200">
            Read More <i className="fa fa-arrow-right text-[10px]" />
          </span>
        </div>
      </div>
    </a>
  );
}

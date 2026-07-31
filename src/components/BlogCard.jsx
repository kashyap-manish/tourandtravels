export default function BlogCard({ img, date, category, title, excerpt, author, readTime }) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">

      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <div
          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${img}')` }}
        />
        <div className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1"><i className="fa fa-calendar-o text-orange-400" />{date}</span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1"><i className="fa fa-clock-o text-orange-400" />{readTime}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-base leading-snug hover:text-orange-500 transition-colors cursor-pointer mb-2">
          {title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{excerpt}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
              <i className="fa fa-user text-orange-500 text-xs" />
            </div>
            <span className="text-xs font-semibold text-gray-600">{author}</span>
          </div>
          <a href = "/blog" className="text-xs font-semibold text-orange-500 hover:text-white hover:bg-orange-500 border border-orange-500 px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1" >
            Read More <i className="fa fa-arrow-right text-xs" />
          </a>
        </div>
      </div>
    </div>
  );
}

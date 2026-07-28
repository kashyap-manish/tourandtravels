export default function BlogCard({ img, day, year, month, title, excerpt }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow flex flex-col">
      <a href="#" className="blog-img block" style={{ backgroundImage: `url('${img}')`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl font-bold text-orange-500 leading-none">{day}</span>
          <div className="text-xs text-gray-500 leading-tight">
            <div className="font-semibold">{year}</div>
            <div>{month}</div>
          </div>
        </div>
        <h3 className="font-bold text-base mb-2"><a href="#" className="hover:text-orange-500">{title}</a></h3>
        {excerpt && <p className="text-sm text-gray-500 mb-3">{excerpt}</p>}
        <a href="#" className="mt-auto inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm px-4 py-2 rounded transition-colors w-fit">Read more</a>
      </div>
    </div>
  );
}

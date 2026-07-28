import PageHero from '../components/PageHero';
import BlogCard from '../components/BlogCard';
import CallToAction from '../components/CallToAction';

const blogs = [
  { img: '/images/image_1.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World', excerpt: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/image_2.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World', excerpt: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/image_3.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World', excerpt: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/image_4.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World', excerpt: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/image_5.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World', excerpt: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
  { img: '/images/image_6.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World', excerpt: 'A small river named Duden flows by their place and supplies it with the necessary regelialia.' },
];

const pages = [1, 2, 3, 4, 5];

export default function Blog() {
  return (
    <>
      <PageHero title="Blog" breadcrumb="Blog" />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b, i) => <BlogCard key={i} {...b} />)}
          </div>
          <div className="flex justify-center gap-2 mt-10">
            <a href="#" className="w-9 h-9 flex items-center justify-center border rounded hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors text-sm">&lt;</a>
            {pages.map(p => (
              <a key={p} href="#" className={`w-9 h-9 flex items-center justify-center border rounded text-sm transition-colors ${p === 1 ? 'bg-orange-500 text-white border-orange-500' : 'hover:bg-orange-500 hover:text-white hover:border-orange-500'}`}>{p}</a>
            ))}
            <a href="#" className="w-9 h-9 flex items-center justify-center border rounded hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors text-sm">&gt;</a>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}

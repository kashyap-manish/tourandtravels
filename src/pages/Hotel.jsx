import PageHero from '../components/PageHero';
import HotelCard from '../components/HotelCard';
import SearchForm from '../components/SearchForm';
import CallToAction from '../components/CallToAction';

const hotels = [
  { img: '/images/hotel-resto-1.jpg', price: '$200/person', days: '8 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-2.jpg', price: '$200/person', days: '10 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-3.jpg', price: '$200/person', days: '7 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-4.jpg', price: '$200/person', days: '8 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-5.jpg', price: '$200/person', days: '10 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-6.jpg', price: '$200/person', days: '7 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-7.jpg', price: '$200/person', days: '7 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-8.jpg', price: '$200/person', days: '7 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
  { img: '/images/hotel-resto-9.jpg', price: '$200/night', days: '3 Days Tour', title: 'Manila Hotel', location: 'Manila, Philippines' },
];

const pages = [1, 2, 3, 4, 5];

export default function Hotel() {
  return (
    <>
      <PageHero title="Hotel" breadcrumb="Hotel" />

      <section className="max-w-7xl mx-auto px-4 py-8">
        <SearchForm />
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hotels.map((h, i) => <HotelCard key={i} {...h} />)}
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

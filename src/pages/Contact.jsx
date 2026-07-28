import PageHero from '../components/PageHero';
import CallToAction from '../components/CallToAction';

const contactInfo = [
  { icon: 'fa-map-marker', title: 'Address', text: '198 West 21th Street, Suite 721 New York NY 10016' },
  { icon: 'fa-phone', title: 'Contact Number', text: '+ 1235 2355 98' },
  { icon: 'fa-paper-plane', title: 'Email Address', text: 'info@yoursite.com' },
  { icon: 'fa-globe', title: 'Website', text: 'yoursite.com' },
];

export default function Contact() {
  return (
    <>
      <PageHero title="Contact us" breadcrumb="Contact us" />

      {/* Contact Info Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {contactInfo.map(c => (
              <div key={c.title} className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                  <i className={`fa ${c.icon} text-orange-500 text-xl`} />
                </div>
                <h3 className="font-bold text-base mb-2">{c.title}</h3>
                <p className="text-gray-500 text-sm">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Form + Map */}
          <div className="grid md:grid-cols-2 gap-8">
            <form className="bg-gray-50 p-8 rounded-lg shadow space-y-4">
              <input type="text" placeholder="Your Name" className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
              <input type="email" placeholder="Your Email" className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
              <input type="text" placeholder="Subject" className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
              <textarea rows={6} placeholder="Message" className="w-full border border-gray-200 rounded px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors resize-none" />
              <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors">Send Message</button>
            </form>
            <div className="rounded-lg overflow-hidden shadow min-h-64 bg-gray-200 flex items-center justify-center">
              <iframe
                title="map"
                className="w-full h-full min-h-64"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076684379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew+York%2C+NY+10001!5e0!3m2!1sen!2sus!4v1555341793820!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}

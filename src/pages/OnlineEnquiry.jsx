import PageHero from '../components/PageHero';

export default function OnlineEnquiry() {
  return (
    <>
      <PageHero title="Online Enquiry" breadcrumb="Online Enquiry" />
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">Get In Touch</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">Send Us an Enquiry</h2>
          <p className="text-gray-500 mb-10">Fill out the form below and our team will get back to you within 24 hours.</p>

          <form className="space-y-6" onSubmit={e => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">First Name</label>
                <input type="text" placeholder="John" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Last Name</label>
                <input type="text" placeholder="Doe" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" placeholder="you@example.com" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
              <input type="tel" placeholder="+1 234 567 890" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Destination of Interest</label>
              <input type="text" placeholder="e.g. Philippines, Greece..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Travel Date</label>
              <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors text-gray-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Message</label>
              <textarea rows="5" placeholder="Tell us about your travel plans..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 transition-colors resize-none" />
            </div>
            <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

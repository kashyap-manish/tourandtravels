import PageHero from '../components/PageHero';

const faqs = [
  { q: 'How do I book a tour?', a: 'You can book a tour by filling out our Online Enquiry form or by contacting us directly via phone or email. Our team will confirm availability and send you a booking confirmation within 24 hours.' },
  { q: 'Can I customize my travel itinerary?', a: 'Absolutely. All our tours can be fully customized to suit your preferences, budget, and travel dates. Just let us know your requirements and we will craft a personalized itinerary for you.' },
  { q: 'What is included in the tour package?', a: 'Our packages typically include accommodation, guided tours, airport transfers, and select meals. Specific inclusions vary per package and are clearly listed on each tour page.' },
  { q: 'Do you offer group discounts?', a: 'Yes, we offer special rates for groups of 6 or more travelers. Contact us directly to discuss group pricing and availability.' },
  { q: 'Is travel insurance included?', a: 'Travel insurance is not included by default but we strongly recommend it. We can connect you with our trusted insurance partners to find the right coverage for your trip.' },
  { q: 'What languages do your guides speak?', a: 'Our guides are fluent in English and the local language of each destination. For other language requirements, please contact us in advance and we will do our best to accommodate.' },
];

export default function GeneralEnquiries() {
  return (
    <>
      <PageHero title="General Enquiries" breadcrumb="General Enquiries" />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">FAQ</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">Frequently Asked Questions</h2>
          <p className="text-gray-500 mb-10">Can't find what you're looking for? <a href="/contact" className="text-orange-500 hover:underline">Contact us</a> and we'll be happy to help.</p>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <details key={i} className="group border border-gray-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-gray-800 text-sm list-none hover:bg-gray-50 transition-colors">
                  {f.q}
                  <i className="fa fa-chevron-down text-orange-500 text-xs transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-6 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {f.a}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-14 bg-orange-50 border border-orange-100 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fa fa-envelope text-white" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">Still have questions?</h3>
            <p className="text-gray-500 text-sm mb-5">Our team is available Monday–Friday, 9am–6pm.</p>
            <a href="mailto:info@yourdomain.com" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors">
              <i className="fa fa-paper-plane text-xs" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

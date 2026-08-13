import { Link } from 'react-router-dom';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing or using Pacific Travel Agency's website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to update these terms at any time, and continued use of our services constitutes acceptance of any changes.`,
  },
  {
    title: '2. Booking & Reservations',
    content: `All bookings are subject to availability and confirmation. A booking is only confirmed once you receive a written confirmation from Pacific Travel Agency and the required deposit or full payment has been received. We reserve the right to decline any booking at our discretion.`,
  },
  {
    title: '3. Payments',
    content: `A deposit of 25% of the total tour cost is required at the time of booking. The remaining balance must be paid no later than 30 days before the departure date. For bookings made within 30 days of departure, full payment is required immediately. All prices are inclusive of applicable taxes unless stated otherwise.`,
  },
  {
    title: '4. Cancellations & Refunds',
    content: `Cancellations made 30+ days before departure are eligible for a full refund minus the deposit. Cancellations made 15–29 days before departure will incur a 50% cancellation fee. Cancellations made within 14 days of departure are non-refundable. Please refer to our Refund Policy for complete details.`,
  },
  {
    title: '5. Travel Documents',
    content: `It is the traveler's sole responsibility to ensure they hold valid passports, visas, and any other required travel documents. Pacific Travel Agency is not liable for any losses incurred due to insufficient or invalid documentation. We recommend checking entry requirements well in advance of your travel date.`,
  },
  {
    title: '6. Travel Insurance',
    content: `We strongly recommend that all travelers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, baggage loss, and personal liability. Pacific Travel Agency is not responsible for any costs arising from the lack of adequate travel insurance.`,
  },
  {
    title: '7. Liability',
    content: `Pacific Travel Agency acts as an agent for hotels, airlines, transport operators, and other service providers. We are not liable for any injury, damage, loss, delay, or irregularity that may occur due to the actions or omissions of these third-party providers. Our liability is limited to the total amount paid for the tour package.`,
  },
  {
    title: '8. Changes to Itinerary',
    content: `We reserve the right to modify tour itineraries due to unforeseen circumstances including but not limited to weather conditions, natural disasters, political unrest, or operational requirements. We will make every effort to provide suitable alternatives and notify travelers as soon as possible.`,
  },
  {
    title: '9. Code of Conduct',
    content: `All travelers are expected to behave respectfully toward fellow travelers, tour guides, and local communities. Pacific Travel Agency reserves the right to remove any traveler from a tour without refund if their behavior is deemed disruptive, offensive, or harmful to others.`,
  },
  {
    title: '10. Governing Law',
    content: `These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.`,
  },
];

export default function TermsOfService() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_2.jpg')", minHeight: '45vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-14 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Terms of Service</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto">Last updated: January 1, 2025</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        {/* Intro */}
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
              <i className="fa fa-file-text text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 mb-1">Please Read Carefully</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                These Terms of Service govern your use of Pacific Travel Agency's website and the purchase of travel services. By booking with us, you acknowledge that you have read, understood, and agreed to these terms.
              </p>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title} className="border-b border-gray-100 pb-8 last:border-0">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full inline-block" />
                {s.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">{s.content}</p>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-12 bg-gray-950 rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2">Have Questions?</h3>
          <p className="text-gray-400 text-sm mb-5">If you have any questions about these Terms of Service, please contact us.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <i className="fa fa-envelope" /> Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}


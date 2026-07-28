import PageHero from '../components/PageHero';

const sections = [
  {
    icon: 'fa-check-square',
    title: 'Booking & Confirmation',
    content: 'A booking is confirmed once we receive a completed booking form and the required deposit. You will receive a written confirmation within 48 hours. Pacific Travel Agency acts as an agent for the various travel service providers and is not liable for their acts or omissions.',
  },
  {
    icon: 'fa-credit-card',
    title: 'Payment Terms',
    content: 'A deposit of 25% of the total tour cost is required at the time of booking. The remaining balance is due no later than 30 days before the departure date. For bookings made within 30 days of departure, full payment is required at the time of booking.',
  },
  {
    icon: 'fa-ban',
    title: 'Cancellation by the Client',
    content: 'Cancellations must be submitted in writing. The following charges apply: more than 60 days before departure — deposit forfeited; 30–60 days — 50% of total cost; less than 30 days — 100% of total cost. We strongly recommend purchasing travel insurance.',
  },
  {
    icon: 'fa-refresh',
    title: 'Cancellation by Pacific',
    content: 'Pacific Travel Agency reserves the right to cancel any tour due to insufficient bookings or circumstances beyond our control. In such cases, a full refund will be issued or an alternative tour of equal value will be offered.',
  },
  {
    icon: 'fa-exchange',
    title: 'Changes & Amendments',
    content: 'Requests to change travel dates, destinations, or other booking details must be made in writing. An amendment fee of $50 per person applies. Changes are subject to availability and may result in a price difference.',
  },
  {
    icon: 'fa-shield',
    title: 'Travel Insurance',
    content: 'We strongly recommend that all travelers obtain comprehensive travel insurance covering cancellation, medical expenses, personal accident, and loss of baggage. Pacific Travel Agency is not responsible for any costs incurred due to lack of insurance.',
  },
  {
    icon: 'fa-globe',
    title: 'Passports & Visas',
    content: 'It is the traveler\'s responsibility to ensure they hold a valid passport and any required visas for their destination. Pacific Travel Agency can provide general guidance but is not responsible for any issues arising from invalid travel documents.',
  },
];

export default function BookingConditions() {
  return (
    <>
      <PageHero title="Booking Conditions" breadcrumb="Booking Conditions" />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">Legal</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">Terms & Booking Conditions</h2>
          <p className="text-gray-500 mb-10">Please read these conditions carefully before making a booking. By confirming your booking, you agree to be bound by these terms.</p>

          <div className="space-y-6">
            {sections.map((s, i) => (
              <div key={i} className="flex gap-5 p-6 border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className={`fa ${s.icon} text-orange-500`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-10 text-center">Last updated: January 2024. For questions, contact <a href="mailto:info@yourdomain.com" className="text-orange-500 hover:underline">info@yourdomain.com</a></p>
        </div>
      </section>
    </>
  );
}

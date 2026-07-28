import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const timeline = [
  { range: 'More than 60 days', refund: '75% refund', color: 'bg-green-500', text: 'text-green-600', bg: 'bg-green-50 border-green-100' },
  { range: '30 – 60 days', refund: '50% refund', color: 'bg-yellow-500', text: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
  { range: '14 – 30 days', refund: '25% refund', color: 'bg-orange-500', text: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
  { range: 'Less than 14 days', refund: 'No refund', color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50 border-red-100' },
];

const steps = [
  { icon: 'fa-envelope', title: 'Submit Request', desc: 'Email us at refunds@yourdomain.com with your booking reference and reason for cancellation.' },
  { icon: 'fa-search', title: 'Review', desc: 'Our team will review your request within 3 business days and confirm the applicable refund amount.' },
  { icon: 'fa-check-circle', title: 'Approval', desc: 'Once approved, you will receive a confirmation email with the refund details and timeline.' },
  { icon: 'fa-bank', title: 'Refund Issued', desc: 'Refunds are processed to the original payment method within 7–14 business days after approval.' },
];

export default function RefundPolicy() {
  return (
    <>
      <PageHero title="Refund Policy" breadcrumb="Refund Policy" />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">Legal</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">Refund Policy</h2>
          <p className="text-gray-500 mb-12">We understand that plans change. Our refund policy is designed to be fair and transparent. Please review the terms below before making a booking.</p>

          {/* Refund Timeline */}
          <h3 className="font-bold text-gray-900 mb-5">Cancellation & Refund Schedule</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-14">
            {timeline.map((t, i) => (
              <div key={i} className={`border rounded-2xl p-5 ${t.bg}`}>
                <div className={`inline-block w-2.5 h-2.5 rounded-full ${t.color} mb-3`} />
                <p className="font-bold text-gray-800 text-sm">{t.range}</p>
                <p className={`text-lg font-extrabold mt-1 ${t.text}`}>{t.refund}</p>
                <p className="text-xs text-gray-500 mt-1">before departure date</p>
              </div>
            ))}
          </div>

          {/* Process */}
          <h3 className="font-bold text-gray-900 mb-5">How to Request a Refund</h3>
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
            <div className="space-y-8">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-5 relative">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 z-10 shadow-md shadow-orange-500/20">
                    <i className={`fa ${s.icon} text-white text-sm`} />
                  </div>
                  <div className="pt-1.5">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="mt-14 space-y-4">
            <h3 className="font-bold text-gray-900">Important Notes</h3>
            {[
              'Deposits are non-refundable in all cases.',
              'Refunds are not applicable for no-shows or early departures.',
              'Force majeure events (natural disasters, pandemics, etc.) are handled on a case-by-case basis.',
              'We strongly recommend purchasing travel insurance to cover unforeseen cancellations.',
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-500">
                <i className="fa fa-exclamation-circle text-orange-400 mt-0.5 flex-shrink-0" />
                {note}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm mb-4">Have questions about your refund?</p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-7 py-3 rounded-full transition-colors">
              <i className="fa fa-phone text-xs" />
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

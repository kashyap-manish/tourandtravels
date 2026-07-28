import PageHero from '../components/PageHero';

const sections = [
  {
    title: 'Information We Collect',
    content: [
      'Personal identification information (name, email address, phone number)',
      'Travel preferences and booking history',
      'Payment information (processed securely — we do not store card details)',
      'Device and usage data when you visit our website',
    ],
  },
  {
    title: 'How We Use Your Information',
    content: [
      'To process and manage your bookings and enquiries',
      'To send booking confirmations, itineraries, and travel updates',
      'To personalize your experience and recommend relevant destinations',
      'To improve our website and services based on usage patterns',
      'To comply with legal obligations',
    ],
  },
  {
    title: 'Sharing Your Information',
    content: [
      'We do not sell or rent your personal data to third parties',
      'We share data with trusted service providers (hotels, airlines, guides) solely to fulfill your booking',
      'We may disclose information if required by law or to protect our legal rights',
    ],
  },
  {
    title: 'Data Security',
    content: [
      'We use industry-standard SSL encryption to protect data in transit',
      'Access to personal data is restricted to authorized staff only',
      'We regularly review and update our security practices',
    ],
  },
  {
    title: 'Your Rights',
    content: [
      'Access the personal data we hold about you',
      'Request correction of inaccurate data',
      'Request deletion of your data (subject to legal obligations)',
      'Opt out of marketing communications at any time',
    ],
  },
  {
    title: 'Cookies',
    content: [
      'We use cookies to improve your browsing experience',
      'Analytics cookies help us understand how visitors use our site',
      'You can control cookie settings through your browser preferences',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero title="Privacy & Policy" breadcrumb="Privacy & Policy" />

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6">
          <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">Legal</span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-3">Privacy Policy</h2>
          <p className="text-gray-500 mb-10">
            At Pacific Travel Agency, your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use our services.
          </p>

          <div className="space-y-8">
            {sections.map((s, i) => (
              <div key={i}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-7 h-7 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <h3 className="font-bold text-gray-900 text-lg">{s.title}</h3>
                </div>
                <ul className="space-y-2 pl-10">
                  {s.content.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-500">
                      <i className="fa fa-check text-orange-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                {i < sections.length - 1 && <hr className="mt-8 border-gray-100" />}
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-50 rounded-2xl p-6 text-sm text-gray-500">
            <p className="font-semibold text-gray-700 mb-1">Contact Our Privacy Team</p>
            <p>If you have any questions about this policy or how we handle your data, please contact us at <a href="mailto:privacy@yourdomain.com" className="text-orange-500 hover:underline">privacy@yourdomain.com</a></p>
            <p className="mt-3 text-xs text-gray-400">Last updated: January 2024</p>
          </div>
        </div>
      </section>
    </>
  );
}

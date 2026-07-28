export default function CallToAction() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="intro-bg rounded-lg text-center text-white relative overflow-hidden"
          style={{ backgroundImage: "url('/images/bg_2.jpg')" }}
        >
          <div className="overlay rounded-lg" />
          <div className="relative z-10 py-16 px-4">
            <h2 className="text-3xl font-bold mb-3">We Are Pacific A Travel Agency</h2>
            <p className="text-gray-200 mb-6">We can manage your dream building A small river named Duden flows by their place</p>
            <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded font-semibold transition-colors">Ask For A Quote</a>
          </div>
        </div>
      </div>
    </section>
  );
}

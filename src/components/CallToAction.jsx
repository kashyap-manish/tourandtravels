export default function CallToAction() {
  return (
    <section className="py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div
          className="intro-bg rounded-2xl text-center text-white relative overflow-hidden"
          style={{ backgroundImage: "url('/images/bg_2.jpg')" }}
        >
          <div className="overlay rounded-2xl" />
          <div className="relative z-10 py-12 md:py-16 px-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">We Are Pacific A Travel Agency</h2>
            <p className="text-gray-200 mb-6 text-sm md:text-base">We can manage your dream building A small river named Duden flows by their place</p>
            <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-colors">Ask For A Quote</a>
          </div>
        </div>
      </div>
    </section>
  );
}

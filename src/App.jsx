import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Destination from './pages/Destination';
import Hotel from './pages/Hotel';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import OnlineEnquiry from './pages/OnlineEnquiry';
import GeneralEnquiries from './pages/GeneralEnquiries';
import BookingConditions from './pages/BookingConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import CallUs from './pages/CallUs';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/hotel" element={<Hotel />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/online-enquiry" element={<OnlineEnquiry />} />
          <Route path="/general-enquiries" element={<GeneralEnquiries />} />
          <Route path="/booking-conditions" element={<BookingConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/call-us" element={<CallUs />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

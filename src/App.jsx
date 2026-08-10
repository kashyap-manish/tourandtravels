import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
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
import TourDetail from './pages/TourDetail';
import Adventure from './pages/Adventure';
import Beach from './pages/Beach';
import Nature from './pages/Nature';
import Camping from './pages/Camping';
import Party from './pages/Party';
import HotelRestaurant from './pages/HotelRestaurant';
import ChatBox from './components/ChatBox';
import Flight from './pages/Flight';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/PrivateRoute';
import AdminBookings from './pages/AdminBookings';
import TermsOfService from './pages/TermsOfService';
import Sitemap from './pages/Sitemap';
import Gallery from './pages/Gallery';
import Wishlist from './pages/Wishlist';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth routes — no Navbar/Footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Main routes — protected */}
        <Route path="/*" element={
          <PrivateRoute>
            <>
              <Navbar />
              <main>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/destination" element={<Destination />} />
                <Route path="/destination/:slug" element={<TourDetail />} />
                <Route path="/hotel" element={<Hotel />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/online-enquiry" element={<OnlineEnquiry />} />
                <Route path="/general-enquiries" element={<GeneralEnquiries />} />
                <Route path="/booking-conditions" element={<BookingConditions />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/call-us" element={<CallUs />} />
                <Route path="/experience/adventure" element={<Adventure />} />
                <Route path="/experience/hotel-restaurant" element={<HotelRestaurant />} />
                <Route path="/experience/beach" element={<Beach />} />
                <Route path="/experience/nature" element={<Nature />} />
                <Route path="/experience/camping" element={<Camping />} />
                <Route path="/experience/party" element={<Party />} />
                <Route path="/flight" element={<Flight />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/wishlist" element={<Wishlist />} />
              </Routes>
            </main>
            <Footer />
            <ChatBox />
          </>
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

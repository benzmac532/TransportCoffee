import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './components/CartContext';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import About from './pages/About';
import Subscriptions from './pages/Subscriptions';
import Wholesale from './pages/Wholesale';
import Contact from './pages/Contact';
import Locations from './pages/Locations';
import RefundPolicy from './pages/RefundPolicy';
import ShippingPolicy from './pages/ShippingPolicy';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <CartDrawer />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/collections/:handle" element={<Shop />} />
            <Route path="shop/:handle" element={<ProductDetail />} />
            <Route path="about" element={<About />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="wholesale" element={<Wholesale />} />
            <Route path="contact" element={<Contact />} />
            <Route path="locations" element={<Locations />} />
            <Route path="refund-policy" element={<RefundPolicy />} />
            <Route path="shipping-policy" element={<ShippingPolicy />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

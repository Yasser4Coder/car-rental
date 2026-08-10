import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout';
import {
  HomePage,
  CarsPage,
  CarDetailPage,
  LoginPage,
  RegisterPage,
  BookingsPage,
  PaySuccessPage,
  PayCancelledPage,
} from '../pages';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="cars/:slug" element={<CarDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/pay-success" element={<PaySuccessPage />} />
          <Route path="bookings/pay-cancelled" element={<PayCancelledPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

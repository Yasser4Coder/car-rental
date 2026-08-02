import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout';
import {
  HomePage,
  CarsPage,
  CarDetailPage,
  LoginPage,
  RegisterPage,
  BookingsPage,
} from '../pages';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cars" element={<CarsPage />} />
          <Route path="cars/:id" element={<CarDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="bookings" element={<BookingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

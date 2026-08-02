import { Link } from 'react-router-dom';
import { Button } from '../common';

export default function CarCard({ car }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {car.image_url ? (
          <img src={car.image_url} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{car.year} · {car.category}</p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-primary-600">${car.daily_rate}/day</span>
          <Link to={`/cars/${car.id}`}>
            <Button variant="outline" className="text-sm py-1.5 px-3">View</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

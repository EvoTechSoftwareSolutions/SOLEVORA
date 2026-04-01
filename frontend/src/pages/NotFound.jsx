import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="p-8 text-center font-manrope">
      <h1 className="mb-2">Page not found</h1>
      <p className="text-gray-500 mb-4">This URL does not exist.</p>
      <Link to="/home" className="text-orange-500 font-bold">Go back home</Link>
    </div>
  );
}

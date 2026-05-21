import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div>
      <h1>404</h1>

      <p>Page not found.</p>

      <Link to="/">Go back home</Link>
    </div>
  );
}

export default NotFoundPage;

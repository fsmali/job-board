import { Link } from 'react-router-dom';
import StarsBackground from '../components/StarsBackground';
import '../styles/notFound.css';

function NotFoundPage() {
  return (
    <main className="not-found-page">
      <StarsBackground />

      <section className="not-found-card">
        <p className="error-code">404</p>

        <h1>Page not found</h1>

        <p className="not-found-text">
          The page you are looking for does not exist or has been moved.
        </p>

        <Link className="home-link" to="/">
          Go back home
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

function Navbar() {
  const { user, token, setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/');
  };

  return (
    <nav className={styles.navbar} aria-label="Main navigation">
      <div className={styles.left}>
        <Link to="/" className={styles.logo} aria-label="Job Board home">
          Job Board
        </Link>
      </div>

      <div className={styles.right} role="list" aria-label="Navigation links">
        {token && user?.role === 'employer' && (
          <Link role="listitem" to="/create-job">
            Create Job
          </Link>
        )}

        {token && user?.role === 'freelancer' && (
          <Link role="listitem" to="/my-applications">
            My Applications
          </Link>
        )}

        {token && user?.role === 'employer' && (
          <Link role="listitem" to="/my-jobs">
            My Jobs
          </Link>
        )}

        {!token && (
          <Link role="listitem" to="/login">
            Login
          </Link>
        )}

        {!token && (
          <Link role="listitem" to="/signup">
            Signup
          </Link>
        )}

        {token && (
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out of your account"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

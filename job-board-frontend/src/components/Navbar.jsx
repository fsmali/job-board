import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    <nav>
      <Link to="/">Home</Link>

      {token && user?.role === 'employer' && (
        <Link to="/create-job">Create Job</Link>
      )}

      {token && user?.role === 'freelancer' && (
        <Link to="/my-applications">My Applications</Link>
      )}
      {token && user?.role === 'employer' && <Link to="/my-jobs">My Jobs</Link>}

      {!token && <Link to="/login">Login</Link>}
      {!token && <Link to="/signup">Signup</Link>}
      {token && <button onClick={handleLogout}>Logout</button>}
    </nav>
  );
}

export default Navbar;

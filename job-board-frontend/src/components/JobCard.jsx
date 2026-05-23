import { Link } from 'react-router-dom';
import styles from './JobCard.module.css';

const JobCard = ({ user, job, alreadyApplied = false }) => {
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h2>{job.title}</h2>
      </div>

      <p className={styles.location}>{job.location}</p>

      <p className={styles.description}>{job.description.slice(0, 100)}...</p>

      {user?.role === 'freelancer' && alreadyApplied && (
        <p className={styles.applied}>Already applied</p>
      )}

      {user ? (
        <Link
          className={styles.link}
          to={`/jobs/${job.id}`}
          state={{ from: '/' }}
        >
          View details
        </Link>
      ) : (
        <Link className={styles.link} to="/login">
          Login to apply
        </Link>
      )}
    </article>
  );
};

export default JobCard;

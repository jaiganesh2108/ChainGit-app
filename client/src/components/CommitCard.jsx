import { Link } from 'react-router-dom';
import "./CommitCard.css"

function CommitCard({ commit }) {
  return (
    <div className="commit-card">
      <h3 className="commit-card-title">{commit.message}</h3>
      <p className="commit-card-info"><strong>Hash:</strong> {commit.hash.substring(0, 8)}...</p>
      <p className="commit-card-info"><strong>Author:</strong> {commit.author}</p>
      <p className="commit-card-info"><strong>Status:</strong> {commit.blockchainStatus}</p>
      <Link to={`/commit/${commit.hash}`} className="commit-card-link">
        View Details
      </Link>
    </div>
  )
}

export default CommitCard;
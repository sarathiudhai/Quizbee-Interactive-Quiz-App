import { useState, useEffect } from 'react';
import API from '../api/axios';
import Loader from '../components/common/Loader';
import { getRankSuffix } from '../utils/helpers';
import { HiTrophy } from 'react-icons/hi2';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get('/leaderboard?limit=50');
      setLeaderboard(res.data.data);
    } catch (err) {
      console.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Loading leaderboard..." />;

  const topThree = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="leaderboard-page" id="leaderboard-page">
      <div className="container">
        <div className="leaderboard-header animate-fadeIn">
          <h1>🏆 <span className="gradient-text">Leaderboard</span></h1>
          <p>See how you rank among other quiz champions!</p>
        </div>

        {leaderboard.length === 0 ? (
          <div className="empty-state animate-fadeIn">
            <span className="empty-emoji">🏆</span>
            <h3>No rankings yet</h3>
            <p>Complete quizzes to appear on the leaderboard!</p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="podium animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              {topThree.map((entry, idx) => {
                const positions = [1, 0, 2]; // Order: 2nd, 1st, 3rd
                const pos = positions[idx];
                if (!topThree[pos]) return null;
                const player = topThree[pos];
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={pos} className={`podium-item podium-${pos + 1}`}>
                    <div className="podium-medal">{medals[pos]}</div>
                    <div className="podium-avatar">{player.user.name.charAt(0).toUpperCase()}</div>
                    <h3 className="podium-name">{player.user.name}</h3>
                    <span className="podium-score">{player.totalScore} pts</span>
                    <span className="podium-quizzes">{player.quizzesTaken} quizzes</span>
                    <div className={`podium-bar bar-${pos + 1}`}></div>
                  </div>
                );
              })}
            </div>

            {/* Full Rankings Table */}
            {rest.length > 0 && (
              <div className="rankings-table glass-card animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Student</th>
                      <th>Total Score</th>
                      <th>Quizzes</th>
                      <th>Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map((entry, idx) => (
                      <tr key={entry._id}>
                        <td className="rank-cell">{getRankSuffix(idx + 4)}</td>
                        <td className="name-cell">
                          <div className="rank-avatar">{entry.user.name.charAt(0).toUpperCase()}</div>
                          {entry.user.name}
                        </td>
                        <td className="score-cell">{entry.totalScore}</td>
                        <td>{entry.quizzesTaken}</td>
                        <td>{entry.avgScore}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

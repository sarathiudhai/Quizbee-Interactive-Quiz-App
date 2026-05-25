import './Loader.css';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="loader-container" id="app-loader">
      <div className="loader-bee">
        <span className="bee-emoji">🐝</span>
        <div className="loader-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
};

export default Loader;

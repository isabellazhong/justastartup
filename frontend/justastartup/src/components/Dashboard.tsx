import './Dashboard.css'

interface DashboardProps {
  onGetStarted: () => void;
}

export default function Dashboard({ onGetStarted }: DashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <h1>Justastartup</h1>
        <h3>Your future starts up here.</h3>
        <button className="get-started-btn" onClick={onGetStarted}>Get started!</button>
      </div>
    </div>
  );
}
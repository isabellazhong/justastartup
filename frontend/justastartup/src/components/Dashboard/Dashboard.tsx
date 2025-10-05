import './Dashboard.css'
import TextType from '../TextType';


interface DashboardProps {
  onGetStarted: () => void;
}

export default function Dashboard({ onGetStarted }: DashboardProps) {
  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <TextType text={["JustAStartUp"]}typingSpeed={200}pauseDuration={1500}showCursor={true}cursorCharacter="|"/>
        <h3>Your future starts up here.</h3>
        <button className="get-started-btn" onClick={onGetStarted}>Get started!</button>
      </div>
    </div>
  );
}
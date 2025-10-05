import './Landing.css'
import TextType from '../TextType/TextType';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };
  return (
    <div className="landing">
      <div className="landing-content">
        <TextType text={["JustAStartUp"]}typingSpeed={200}pauseDuration={1500}showCursor={true}cursorCharacter="|"/>
        <h3>Your future starts up here.</h3>
        <button className="get-started-btn" onClick={handleGetStarted}>Get started!</button>
      </div>
    </div>
  );
}
import './Landing.css'
import TextType from '../TextType/TextType';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../database/supaBaseClient';

export default function Landing() {
  const navigate = useNavigate();

  const handleGetStarted = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // User is logged in, navigate to projects
        navigate('/projects');
      } else {
        // User is not logged in, navigate to login
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // If there's an error, default to login page
      navigate('/login');
    }
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
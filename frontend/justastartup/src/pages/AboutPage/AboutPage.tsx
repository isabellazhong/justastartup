import './AboutPage.css';
import { useNavigate } from 'react-router-dom';
import { Navbar05 } from '@/components/ui/shadcn-io/navbar-05';

export default function AboutPage() {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    navigate(href);
  };

  const handleGetStarted = () => {
    navigate('/create-project');
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar05 onNavItemClick={handleNavClick} />
      <main className="flex-1 w-full">
        <div className="about-page">
          <div className="about-content">
            <div className="about-hero">
              <h1>About JustAStartUp</h1>
              <p className="hero-subtitle">Empowering founders with data-driven insights for smarter business decisions.</p>
            </div>

            <div className="about-sections">
              <section className="about-section image-left">
                <div className="section-image">
                  <div className="placeholder-image">💡</div>
                </div>
                <div className="section-content">
                  <h2>Our Inspiration</h2>
                  <p>
                    One of our teammates started a small cookie business in grade 10 but didn't understand how pricing and market demand worked. 
                    They ended up selling cookies at a loss and realized how hard it is to start a business without proper guidance or market analysis. 
                    That valuable experience inspired us to create JustAStartUp — a tool to help new founders understand their market and plan for sustainable growth.
                  </p>
                </div>
              </section>

              <section className="about-section image-right">
                <div className="section-content">
                  <h2>What We Do</h2>
                  <p>
                    JustAStartUp helps startup founders analyze their market, identify competitors, and estimate future growth potential. 
                    We provide clear insights on pricing, demand, and industry trends so founders can make smarter decisions before launching. 
                    Our platform also generates customized pitch decks based on market data to help founders present their ideas confidently.
                  </p>
                </div>
                <div className="section-image">
                  <div className="placeholder-image">🚀</div>
                </div>
              </section>

              <section className="about-section image-left">
                <div className="section-image">
                  <div className="placeholder-image">🛠️</div>
                </div>
                <div className="section-content">
                  <h2>How We Built It</h2>
                  <p>
                    We built JustAStartUp using ReactJS, TypeScript, TailwindCSS, and HTML for the frontend. 
                    The backend was developed with Node.js and Supabase, which connects to a PostgreSQL database. 
                    Together, these technologies allowed us to create a responsive web app with secure data handling and real-time analytics.
                  </p>
                </div>
              </section>

              <section className="about-section image-right">
                <div className="section-content">
                  <h2>What We've Accomplished</h2>
                  <div className="accomplishments">
                    <div className="accomplishment-item">
                      <span className="accomplishment-icon">📊</span>
                      <p>Created a prototype that analyzes market data and generates pitch decks</p>
                    </div>
                    <div className="accomplishment-item">
                      <span className="accomplishment-icon">💡</span>
                      <p>Built an intuitive interface for startup founders with no prior business experience</p>
                    </div>
                    <div className="accomplishment-item">
                      <span className="accomplishment-icon">🔗</span>
                      <p>Learned how to connect multiple tools (Supabase, Node, React) into a smooth workflow</p>
                    </div>
                  </div>
                </div>
                <div className="section-image">
                  <div className="placeholder-image">🎯</div>
                </div>
              </section>

              <div className="about-cta">
                <h2>Ready to start your journey?</h2>
                <p>Join founders who are making smarter business decisions with data-driven insights.</p>
                <button className="get-started-btn" onClick={handleGetStarted}>
                  Start Your Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

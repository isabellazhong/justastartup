import { useState, useEffect } from 'react';
import './SelectPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthNavbar } from '../../components';
import { Button } from '../../components/ui/button';
import { supabase } from '../../database/supaBaseClient';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ChevronDownIcon } from 'lucide-react';

interface StartupSelections {
  targetMarketSize: string;
  marketNeed: string;
  targetCustomers: string;
  marketTrends: string;
}

const marketSizeOptions = [
  'Small (< $100M)',
  'Medium ($100M - $1B)',
  'Large ($1B - $10B)',
  'Massive (> $10B)'
];

const marketNeedOptions = [
  'Efficiency & Productivity',
  'Cost Reduction',
  'New Capabilities',
  'Better User Experience',
  'Regulatory Compliance',
  'Market Gap Solution'
];

const targetCustomerOptions = [
  'Individual Consumers (B2C)',
  'Small Businesses (SMB)',
  'Medium Enterprises',
  'Large Corporations (Enterprise)',
  'Government/Public Sector',
  'Non-Profit Organizations'
];

const marketTrendsOptions = [
  'Growing Rapidly (>20% YoY)',
  'Steady Growth (5-20% YoY)',
  'Stable Market (0-5% YoY)',
  'Declining Market (<0% YoY)',
  'Emerging/New Market',
  'Cyclical Market'
];

export default function SelectPage() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<StartupSelections>({
    targetMarketSize: '',
    marketNeed: '',
    targetCustomers: '',
    marketTrends: ''
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Authentication protection - redirect to login if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSelectionChange = (category: keyof StartupSelections, value: string) => {
    setSelections(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = () => {
    // Check if all selections are made
    const isComplete = Object.values(selections).every(value => value !== '');
    
    if (!isComplete) {
      alert('Please complete all selections before proceeding.');
      return;
    }

    console.log('Startup selections:', selections);
    // TODO: Save selections to database or pass to next step
    navigate('/create-project');
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isFormComplete = Object.values(selections).every(value => value !== '');

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen w-screen flex flex-col">
        <AuthNavbar />
        <main className="flex-1 w-full">
          <div className="select-page">
            <div className="select-content">
              <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl opacity-75">Checking authentication...</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If not authenticated, return null (user will be redirected)
  if (isAuthenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <AuthNavbar />
      <main className="flex-1 w-full">
        <div className="select-page">
          <div className="select-content">
            <div className="select-header">
              <h1>Define Your Startup</h1>
              <p className="header-subtitle">
                Help us understand your startup by selecting the categories that best describe your business model and market.
              </p>
            </div>

            <div className="selection-form">
              <div className="selection-grid">
                {/* Target Market Size */}
                <div className="selection-item">
                  <h3>Target Market Size</h3>
                  <p className="selection-description">
                    What's the estimated size of your total addressable market (TAM)?
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="selection-dropdown"
                        style={{
                          backgroundColor: selections.targetMarketSize ? 'rgba(161, 194, 189, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                          borderColor: '#A1C2BD',
                          color: 'white'
                        }}
                      >
                        {selections.targetMarketSize || 'Select market size'}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dropdown-content">
                      <DropdownMenuLabel>Market Size Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {marketSizeOptions.map((option) => (
                        <DropdownMenuItem 
                          key={option}
                          onClick={() => handleSelectionChange('targetMarketSize', option)}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Market Need */}
                <div className="selection-item">
                  <h3>Market Need</h3>
                  <p className="selection-description">
                    What primary need or problem does your startup address?
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="selection-dropdown"
                        style={{
                          backgroundColor: selections.marketNeed ? 'rgba(161, 194, 189, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                          borderColor: '#A1C2BD',
                          color: 'white'
                        }}
                      >
                        {selections.marketNeed || 'Select market need'}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dropdown-content">
                      <DropdownMenuLabel>Market Need Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {marketNeedOptions.map((option) => (
                        <DropdownMenuItem 
                          key={option}
                          onClick={() => handleSelectionChange('marketNeed', option)}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Target Customers */}
                <div className="selection-item">
                  <h3>Target Customers</h3>
                  <p className="selection-description">
                    Who is your primary target customer segment?
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="selection-dropdown"
                        style={{
                          backgroundColor: selections.targetCustomers ? 'rgba(161, 194, 189, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                          borderColor: '#A1C2BD',
                          color: 'white'
                        }}
                      >
                        {selections.targetCustomers || 'Select customer type'}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dropdown-content">
                      <DropdownMenuLabel>Customer Type Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {targetCustomerOptions.map((option) => (
                        <DropdownMenuItem 
                          key={option}
                          onClick={() => handleSelectionChange('targetCustomers', option)}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Market Trends */}
                <div className="selection-item">
                  <h3>Market Trends/Growth</h3>
                  <p className="selection-description">
                    What's the current growth trend in your target market?
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="selection-dropdown"
                        style={{
                          backgroundColor: selections.marketTrends ? 'rgba(161, 194, 189, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                          borderColor: '#A1C2BD',
                          color: 'white'
                        }}
                      >
                        {selections.marketTrends || 'Select market trend'}
                        <ChevronDownIcon className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="dropdown-content">
                      <DropdownMenuLabel>Market Trend Options</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {marketTrendsOptions.map((option) => (
                        <DropdownMenuItem 
                          key={option}
                          onClick={() => handleSelectionChange('marketTrends', option)}
                        >
                          {option}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="action-buttons">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="back-button"
                  style={{
                    borderColor: '#A1C2BD',
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!isFormComplete}
                  className="continue-button"
                  style={{
                    backgroundColor: isFormComplete ? '#A1C2BD' : 'rgba(161, 194, 189, 0.3)',
                    color: '#19183B',
                    border: 'none'
                  }}
                >
                  Continue to Create Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar05 } from '../ui/shadcn-io/navbar-05';
import { useAuth } from '../../hooks/useAuth';

interface AuthNavbarProps {
  onNavItemClick?: (href: string) => void;
}

export const AuthNavbar: React.FC<AuthNavbarProps> = ({ onNavItemClick }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuth();

  const handleNavClick = (href: string) => {
    if (onNavItemClick) {
      onNavItemClick(href);
    } else {
      navigate(href);
    }
  };

  const handleUserItemClick = async (item: string) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'logout':
        await signOut();
        navigate('/');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'about':
        navigate('/about');
        break;
      default:
        break;
    }
  };



  // Generate user display name and email
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'User';
                   
  const userEmail = user?.email || 'No email';
  
  // Get avatar from user metadata (Google/provider avatar) or generate initials
  const userAvatar = user?.user_metadata?.avatar_url || 
                     user?.user_metadata?.picture;

  if (!isAuthenticated) {
    // Show simplified navbar for non-authenticated users
    return (
      <Navbar05 
        onNavItemClick={handleNavClick}
        navigationLinks={[
          { href: '/login', label: 'Login' }
        ]}
        userName="Guest"
        userEmail="Not signed in"
        isAuthenticated={false}
        onUserItemClick={handleUserItemClick}
      />
    );
  }

  return (
    <Navbar05 
      onNavItemClick={handleNavClick}
      userName={userName}
      userEmail={userEmail}
      userAvatar={userAvatar}
      isAuthenticated={true}
      onUserItemClick={handleUserItemClick}
    />
  );
};
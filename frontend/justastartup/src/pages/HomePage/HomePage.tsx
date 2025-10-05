import { useNavigate } from 'react-router-dom';
import { Landing } from '../../components';
import { Navbar05 } from '@/components/ui/shadcn-io/navbar-05';

export default function Home() {
  const navigate = useNavigate();

  const handleNavClick = (href: string) => {
    navigate(href);
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar05 onNavItemClick={handleNavClick} />
      <main className="flex-1 w-full flex">
        <Landing />
      </main>
    </div>
  );
}

import { Landing } from '../components';
import { Navbar05 } from '@/components/ui/shadcn-io/navbar-05';

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar05 />
      <main className="flex-1 w-full flex">
        <Landing />
      </main>
    </div>
  );
}

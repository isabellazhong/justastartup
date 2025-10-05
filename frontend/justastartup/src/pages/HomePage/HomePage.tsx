import { Landing, AuthNavbar } from '../../components';

export default function Home() {
  return (
    <div className="h-screen w-screen flex flex-col">
      <AuthNavbar />
      <main className="flex-1 w-full flex">
        <Landing />
      </main>
    </div>
  );
}

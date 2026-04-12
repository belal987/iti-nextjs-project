export default function Navbar() {
  return (
    <header className="h-16 bg-white shadow-sm flex items-center px-6 justify-between">
      <h2 className="text-lg font-semibold">Store Manager</h2>
      <button className="text-red-600 font-medium">Logout</button>
    </header>
  );
}

type SidebarProps = {
  onNavigate: (page: string) => void;
  onLogout: () => void;
};

function Sidebar({
  onNavigate,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white p-5">

      {/* LOGO */}

      <h1 className="text-2xl font-bold mb-8">
        BankFlow 🏦
      </h1>


      {/* MENU */}

      <nav className="space-y-3">

        <button
          onClick={() =>
            onNavigate("dashboard")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          📊 Dashboard
        </button>


        <button
          onClick={() =>
            onNavigate("transactions")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          💸 Transactions
        </button>


        <button
          onClick={() =>
            onNavigate("transfer")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          💰 Money Transfer
        </button>


        <button
          onClick={() =>
            onNavigate("cards")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          💳 Cards
        </button>


        <button
          onClick={() =>
            onNavigate("budget")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          🎯 Budget
        </button>


        <button
          onClick={() =>
            onNavigate("notifications")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          🔔 Notifications
        </button>


        <button
          onClick={() =>
            onNavigate("settings")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          ⚙️ Settings
        </button>


        <button
          onClick={() =>
            onNavigate("admin")
          }
          className="w-full text-left p-3 rounded-lg hover:bg-blue-600"
        >
          👑 Admin Panel
        </button>

      </nav>


      {/* LOGOUT */}

      <button
        onClick={onLogout}
        className="w-full mt-10 bg-red-600 p-3 rounded-lg hover:bg-red-700"
      >
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;
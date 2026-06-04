import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { sidebarLinks } from "../../router/routes.config";

const linkBase =
  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition";

export const AdminLayout = () => {
  const { user, logout, hasAnyRole } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-8 text-xl font-bold">MiTiendita</h2>

        <nav className="flex flex-col gap-2">
          {sidebarLinks
            .filter((link) => hasAnyRole(...link.roles))
            .map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-md"
                      : "text-gray-400 hover:bg-zinc-800"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
        </nav>

        {/* USER INFO & LOGOUT */}
        <div className="mt-auto pt-6">
          <div className="mb-2 text-xs text-gray-500">
            <div className="text-sm font-medium text-white">
              {user!.nombre} {user!.apellido}
            </div>
            <div className="mt-0.5">{user!.email}</div>
            <div className="mt-1 flex flex-wrap gap-1">
              {(user!.roles ?? []).map((rol) => (
                <span
                  key={rol.id}
                  className="rounded-md border border-emerald-500/30 bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400"
                >
                  {rol.nombre}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-400 hover:bg-red-500/30"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export interface SidebarLink {
  to: string;
  label: string;
  roles: string[];
}

export const sidebarLinks: SidebarLink[] = [
  {
    to: "/dashboard",
    label: "Dashboard",
    roles: ["ADMIN", "STOCK", "PEDIDOS"],
  },
  { to: "/productos", label: "Productos", roles: ["ADMIN", "STOCK"] },
  { to: "/categorias", label: "Categorías", roles: ["ADMIN", "STOCK"] },
  { to: "/ingredientes", label: "Ingredientes", roles: ["ADMIN", "STOCK"] },
  { to: "/usuarios", label: "Usuarios", roles: ["ADMIN"] },
  { to: "/pedidos", label: "Pedidos", roles: ["ADMIN", "PEDIDOS"] },
];

export const routeRoles: Record<string, string[]> = Object.fromEntries(
  sidebarLinks.map(({ to, roles }) => [to, roles])
);

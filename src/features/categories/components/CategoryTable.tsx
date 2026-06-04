import { Link } from "react-router-dom";
import type { CategoriaRead } from "../types/categoria.types";

interface CategoryTableProps {
  categories: CategoriaRead[];
  isAdmin: boolean;
  onEdit: (category: CategoriaRead) => void;
  onDelete: (id: number) => void;
}

export const CategoryTable = ({
  categories,
  isAdmin,
  onEdit,
  onDelete,
}: CategoryTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-800 text-gray-300">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Descripción</th>
            <th className="p-3">Parent</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className="border-t border-zinc-700 hover:bg-zinc-800 transition"
            >
              <td className="p-3 font-medium">{category.nombre}</td>
              <td className="p-3 text-gray-400">
                {category.descripcion || "-"}
              </td>
              <td className="p-3 text-gray-400">
                {category.parent_id ?? "-"}
              </td>

              <td className="p-3">
                <div className="flex justify-end gap-2">
                  <Link
                    to={`/productos?categoria_id=${category.id}`}
                    className="rounded-lg bg-emerald-500/20 px-3 py-1 text-emerald-400 hover:bg-emerald-500/30 transition text-xs"
                  >
                    Productos
                  </Link>
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        className="rounded-lg bg-yellow-500/20 px-3 py-1 text-yellow-400 hover:bg-yellow-500/30 transition"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => void onDelete(category.id)}
                        className="rounded-lg bg-red-500/20 px-3 py-1 text-red-400 hover:bg-red-500/30 transition"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                  {!isAdmin && (
                    <span className="text-xs text-gray-500">
                      Solo lectura
                    </span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

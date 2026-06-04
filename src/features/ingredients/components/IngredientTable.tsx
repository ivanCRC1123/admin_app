import type { IngredienteRead } from "../types/ingrediente.types";

interface IngredientTableProps {
  ingredients: IngredienteRead[];
  isAdmin: boolean;
  onEdit: (ingredient: IngredienteRead) => void;
  onDelete: (id: number) => void;
}

export const IngredientTable = ({
  ingredients,
  isAdmin,
  onEdit,
  onDelete,
}: IngredientTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl">
      <table className="min-w-full text-sm">
        <thead className="bg-zinc-800 text-gray-300 text-left">
          <tr>
            <th className="p-3">Nombre</th>
            <th className="p-3">Descripción</th>
            <th className="p-3">Alérgeno</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {ingredients.map((ingredient) => (
            <tr
              key={ingredient.id}
              className="border-t border-zinc-700 hover:bg-zinc-800 transition"
            >
              <td className="p-3 font-medium">{ingredient.nombre}</td>

              <td className="p-3 text-gray-400">
                {ingredient.descripcion || "-"}
              </td>

              <td className="p-3">
                {ingredient.es_alergeno ? (
                  <span className="rounded-lg bg-red-500/20 px-2 py-1 text-xs text-red-400">
                    ⚠ Alérgeno
                  </span>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </td>

              <td className="p-3">
                <div className="flex justify-end gap-2">
                  {isAdmin ? (
                    <>
                      <button
                        type="button"
                        onClick={() => onEdit(ingredient)}
                        className="rounded-lg bg-yellow-500/20 px-3 py-1 text-yellow-400 hover:bg-yellow-500/30 transition"
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => void onDelete(ingredient.id)}
                        className="rounded-lg bg-red-500/20 px-3 py-1 text-red-400 hover:bg-red-500/30 transition"
                      >
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-gray-500">Solo lectura</span>
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

import type { CategoriaRead } from "../../categories/types/categoria.types";
import type { IngredienteRead } from "../../ingredients/types/ingrediente.types";

export interface Categoria {
  id: number;
  nombre: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precio_base: number;

  imagenes_url?: string[];

  stock_cantidad?: number;
  disponible?: boolean;
}

export interface ProductoRead {
  id: number;

  nombre: string;
  descripcion?: string;
  precio_base: number;

  imagenes_url: string[];

  stock_cantidad: number;
  disponible: boolean;

  categorias: CategoriaRead[];
  ingredientes: IngredienteRead[];

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ProductoUpdate {
  nombre?: string;
  descripcion?: string;
  precio_base?: number;

  imagenes_url?: string[];

  stock_cantidad?: number;
  disponible?: boolean;
}

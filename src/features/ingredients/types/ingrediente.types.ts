export interface IngredienteRead {
  id: number;

  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;

  created_at: string;
  updated_at: string;
}

export interface IngredienteReadSimple {
  id: number;
  nombre: string;
}

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string;
  es_alergeno?: boolean;
}

export interface IngredienteUpdate {
  nombre?: string;
  descripcion?: string;
  es_alergeno?: boolean;
}

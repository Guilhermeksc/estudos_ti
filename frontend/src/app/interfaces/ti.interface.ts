export interface TiSubarea {
  id?: number | null;
  slug: string;
  titulo: string;
  descricao?: string | null;
  ordem?: number | null;
}

export interface TiFerramenta {
  id?: number | null;
  slug: string;
  titulo: string;
  descricao?: string | null;
  ordem?: number | null;
}

export interface TiMateria {
  id?: number | null;
  slug: string;
  titulo: string;
  descricao: string;
  areaSlug: string;
  ativo?: boolean | null;
  ordem?: number | null;
  subareas?: TiSubarea[];
  ferramentas?: TiFerramenta[];
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface TiMateriaCard {
  id: number;
  slug: string;
  titulo: string;
  descricao: string;
  areaSlug: string;
  subareasCount: number;
  ferramentasCount: number;
}

export interface TiMateriaCreatePayload {
  slug: string;
  titulo: string;
  descricao: string;
  areaSlug: string;
  ativo?: boolean;
  ordem?: number;
  subareas?: Omit<TiSubarea, 'id'>[];
  ferramentas?: Omit<TiFerramenta, 'id'>[];
}

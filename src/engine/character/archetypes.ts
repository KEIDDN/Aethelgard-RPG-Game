export type Archetype = "guerrero" | "picaro" | "mago";

export interface Attributes {
  fuerza: number;
  destreza: number;
  inteligencia: number;
}

export interface ArchetypeDefinition {
  id: Archetype;
  name: string;
  description: string;
  attributes: Attributes;
  maxHp: number;
}

export const ARCHETYPES: Record<Archetype, ArchetypeDefinition> = {
  guerrero: {
    id: "guerrero",
    name: "Guerrero",
    description: "Fuerza bruta y resistencia en el campo de batalla.",
    attributes: { fuerza: 15, destreza: 10, inteligencia: 8 },
    maxHp: 20,
  },
  picaro: {
    id: "picaro",
    name: "Pícaro",
    description: "Agilidad y astucia para evitar el peligro.",
    attributes: { fuerza: 10, destreza: 15, inteligencia: 10 },
    maxHp: 14,
  },
  mago: {
    id: "mago",
    name: "Mago",
    description: "Dominio de las artes arcanas a costa de la fragilidad física.",
    attributes: { fuerza: 8, destreza: 10, inteligencia: 15 },
    maxHp: 10,
  },
};

export function getArchetype(id: Archetype): ArchetypeDefinition {
  return ARCHETYPES[id];
}

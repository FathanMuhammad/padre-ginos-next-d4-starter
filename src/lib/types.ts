export type PizzaSize = "S" | "M" | "L";

export interface Pizza {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  sizes: Record<PizzaSize, number>;
}

export interface RatingSummary {
  average: number;
  count: number;
}

export type Role = "customer" | "staff" | "admin";

export interface User {
  id: number;
  login: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
  phone: string | null;
  address: string | null;
}

export interface Profile {
  name: string;
  phone: string | null;
  address: string | null;
}

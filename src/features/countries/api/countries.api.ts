import type { Country } from "../types/country.types";
import { api } from "@/lib/api";

export const getCountries = async (): Promise<Country[]> => {
  const response = await api.get<Country[]>("/Country");
  return response.data;
};
export type TravelStatus = "Y" | "X";

export type TravelCountry = {
  name: string;
  continent: string;
  status: TravelStatus;
};

// Source list to be populated from Ravi's authoritative travel record.
// Y = visited; X = cannot be visited. Do not infer or reclassify status.
export const travelCountries: TravelCountry[] = [];

export const travelStatusLabel: Record<TravelStatus, string> = {
  Y: "Visited",
  X: "Cannot be visited",
};

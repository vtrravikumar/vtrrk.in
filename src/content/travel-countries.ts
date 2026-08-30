export type TravelStatus = "Y" | "X";

export type TravelCountry = {
  name: string;
  continent: string;
  status: TravelStatus;
  slug: string;
  hasBlog: boolean;
};

// Source: Ravi's travel record. Y = visited; X = cannot be visited.
// The index intentionally includes only visited countries for now.
// Blog availability is kept separate so the index can grow as stories are added.
export const travelCountries: TravelCountry[] = [
  { name: "Armenia", continent: "Asia", status: "Y", slug: "armenia", hasBlog: true },
  { name: "Azerbaijan", continent: "Asia", status: "Y", slug: "azerbaijan", hasBlog: false },
  { name: "Australia", continent: "Oceania", status: "Y", slug: "australia", hasBlog: false },
  { name: "Georgia", continent: "Asia", status: "Y", slug: "georgia", hasBlog: false },
  { name: "India", continent: "Asia", status: "Y", slug: "india", hasBlog: false },
  { name: "Malaysia", continent: "Asia", status: "Y", slug: "malaysia", hasBlog: false },
  { name: "Singapore", continent: "Asia", status: "Y", slug: "singapore", hasBlog: false },
  { name: "Sri Lanka", continent: "Asia", status: "Y", slug: "sri-lanka", hasBlog: false },
  { name: "Thailand", continent: "Asia", status: "Y", slug: "thailand", hasBlog: false },
  { name: "Italy", continent: "Europe", status: "Y", slug: "italy", hasBlog: true },
  { name: "Portugal", continent: "Europe", status: "Y", slug: "portugal", hasBlog: false },
  { name: "Spain", continent: "Europe", status: "Y", slug: "spain", hasBlog: false },
  { name: "Switzerland", continent: "Europe", status: "Y", slug: "switzerland", hasBlog: false },
  { name: "United Kingdom", continent: "Europe", status: "Y", slug: "united-kingdom", hasBlog: false },
  { name: "Jordan", continent: "Asia", status: "Y", slug: "jordan", hasBlog: true },
  { name: "Oman", continent: "Asia", status: "Y", slug: "oman", hasBlog: false },
  { name: "United Arab Emirates", continent: "Asia", status: "Y", slug: "united-arab-emirates", hasBlog: false },
  { name: "Mauritius", continent: "Africa", status: "Y", slug: "mauritius", hasBlog: false },
  { name: "Seychelles", continent: "Africa", status: "Y", slug: "seychelles", hasBlog: false },
  { name: "United States", continent: "North America", status: "Y", slug: "united-states", hasBlog: false },
];

export const travelStatusLabel: Record<TravelStatus, string> = {
  Y: "Visited",
  X: "Cannot be visited",
};

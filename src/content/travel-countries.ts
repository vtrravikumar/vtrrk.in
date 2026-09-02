export type TravelStatus = "Y" | "X";

export type TravelCountry = {
  name: string;
  continent: string;
  status: TravelStatus;
  slug: string;
};

// Source: Ravi's travel record. Y = visited; X = cannot be visited.
// Publication state is intentionally NOT stored here. It belongs to each
// country's travel YAML as content_status, so there is one source of truth.
export const travelCountries: TravelCountry[] = [
  { name: "Armenia", continent: "Asia", status: "Y", slug: "armenia" },
  { name: "Azerbaijan", continent: "Asia", status: "Y", slug: "azerbaijan" },
  { name: "Australia", continent: "Oceania", status: "Y", slug: "australia" },
  { name: "Georgia", continent: "Asia", status: "Y", slug: "georgia" },
  { name: "India", continent: "Asia", status: "Y", slug: "india" },
  { name: "Malaysia", continent: "Asia", status: "Y", slug: "malaysia" },
  { name: "Singapore", continent: "Asia", status: "Y", slug: "singapore" },
  { name: "Sri Lanka", continent: "Asia", status: "Y", slug: "srilanka" },
  { name: "Thailand", continent: "Asia", status: "Y", slug: "thailand" },
  { name: "Italy", continent: "Europe", status: "Y", slug: "italy" },
  { name: "Portugal", continent: "Europe", status: "Y", slug: "portugal" },
  { name: "Spain", continent: "Europe", status: "Y", slug: "spain" },
  { name: "Switzerland", continent: "Europe", status: "Y", slug: "switzerland" },
  { name: "United Kingdom", continent: "Europe", status: "Y", slug: "united-kingdom" },
  { name: "Jordan", continent: "Asia", status: "Y", slug: "jordan" },
  { name: "Oman", continent: "Asia", status: "Y", slug: "oman" },
  { name: "United Arab Emirates", continent: "Asia", status: "Y", slug: "united-arab-emirates" },
  { name: "Mauritius", continent: "Africa", status: "Y", slug: "mauritius" },
  { name: "Seychelles", continent: "Africa", status: "Y", slug: "seychelles" },
  { name: "United States", continent: "North America", status: "Y", slug: "united-states" },
];

export const travelStatusLabel: Record<TravelStatus, string> = {
  Y: "Visited",
  X: "Cannot be visited",
};

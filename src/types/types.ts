// export type Currency = {
//   name: string;
//   code: string;
//   symbol: string;
// }

export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  occupation?: string;
  is_admin: boolean;
  team_id?: string;
  created_at: number;
  updated_at: number | null;
};

// When a new user logs in for the first time, they are put into a brand new team
// and are automatically set as an admin. They are the only ones that can add, edit,
// and remove users as well as assign the role of admin
export type Team = {
  id: string;
  organization_name?: string;
  team_name: string;
};

export type Currencies = {
  id: string;
  symbol: string;
  code: string;
  name: string;
  project_id: string;
  project_name: string;
  contractor_id: string;
  contractor_name: string;
  contract_id: string | null;
  team_id: string;
  created_at: number;
  updated_at: number | null;
};

export type Project = {
  id: string;
  name: string;
  team_id: string;
  city?: string | null;
  country: string;
  start_month: string;
  start_year: number;
  is_ongoing: boolean;
  created_at: number;
  updated_at: number | null;
};

export type Contractor = {
  id: string;
  name: string;
  project_id: string;
  team_id: string;
  location?: string | null;
  banks: string[];
  importance_level: number;
  text?: string | null;
  status: "active" | "unavailable";
  created_at: number;
  updated_at: number | null;
};

export type ContractAmount = {
  id: string;
  amount: number;
  currency: string;
  currency_id: string;
  project_id: string;
  contractor_id: string | null;
  contract_id: string;
}

export type Contract = {
  id: string;
  date: string;
  project_id: string;
  contractor_id: string;
  team_id: string;
  stage_id: string;
  project_name: string;
  contractor_name: string;
  contract_code: string;
  status: "paid" | "pending";
  description: string;
  comment?: string | null;
  currencies: ContractAmount[];
  is_contract: boolean;
  created_at: number;
  updated_at: number | null;
};

// Since NonContract is also a Payment, schema has to match with Payment
export type NonContract = {
  id: string;
  date: string;
  project_id: string;
  contractor_id: string;
  contract_id?: null;
  team_id: string;
  stage_id: string;
  project_name: string;
  contractor_name: string;
  description: string;
  comment?: string | null;
  amount: number;
  currency: string;
  currency_id: string;
  is_contract: boolean;
  contract_code?: null;
  status: "paid" | "pending";
  created_at: number;
  updated_at: number | null;
};

export type Payment = {
  id: string;
  date: Date;
  project_id: string;
  contractor_id: string;
  contract_id: string | null;
  stage_id: string;
  team_id: string;
  project_name: string;
  contractor_name: string;
  description: string;
  comment: string | null;
  amount: number;
  currency: string;
  currency_id: string;
  is_contract: boolean;
  contract_code: string | null;
  status: "paid" | "pending";
  created_at: number;
  updated_at: number | null;
};

export type Stage = {
  id: string;
  name: string;
  team_id: string;
  description: string;
  created_at: number;
  updated_at: number | null;
};

export type Chart = {
  id: string;
  date: string;
  amount: string;
  project_name: string;
};
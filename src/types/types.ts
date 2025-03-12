export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  occupation?: string;
  is_admin: boolean;
  bg_image_index?: number;
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
  team_id: string;
  created_at: number;
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
  importance_level: number;
  text?: string | null;
  is_unavailable: boolean;
  created_at: number;
  updated_at: number | null;
};

export type Amount = {
  symbol: string;
  code: string;
  name: string;
  amount: number;
  created_at?: number;
};

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
  bank_name: string[];
  currencies: Amount[];
  is_completed: boolean;
  description: string;
  comment?: string | null;
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
  bank_name: string;
  comment?: string | null;
  amount: number;
  currency_id: string;
  currency_name: string;
  currency_code: string;
  currency_symbol: string;
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
  bank_name: string;
  currency_id: string;
  currency_name: string;
  currency_code: string;
  currency_symbol: string;
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
  project_id: string;
  description: string;
  is_completed: boolean;
  created_at: number;
  updated_at: number | null;
};

export type Chart = {
  id: string;
  date: string;
  amount: string;
  project_name: string;
};
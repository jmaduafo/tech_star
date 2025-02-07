export type User = {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    occupation: string;
    is_admin: boolean;
    team_id: string;
    created_at: number;
}

// Example: url -> techstar/[team_id]/dashboard/...
// When a new user logs in for the first time, they are put into a brand new team
// and are automatically set as an admin. They are the only ones that can add, edit, 
// and remove users as well as assign the role of admin
export type Team = {
    id: string;
    organization_name?: string;
    team_name: string;
}

export type Contractor = {
    id: string;
    name: string;
    project_id: string;
    location?: string | null;
    currencies: string[];
    banks: string[];
    importance_level: number;
    text?: string | null;
    status: "active" | "discontinued";
    created_at: number;
    updated_at: number;
}

export type Contract = {
    id: string;
    date: string;
    project_id: string;
    contractor_id: string;
    stage_id: string;
    contract_code: string;
    status: "paid" | "pending";
    description: string;
    comment?: string | null;
    amount: number | null;
    currency: string;
    is_contract: boolean;
    created_at: number;
    updated_at: number;
}

// Since NonContract is also a Payment, schema has to match with Payment
export type NonContract = {
    id: string;
    date: string;
    project_id: string; 
    contractor_id: string; 
    contract_id?: null;
    stage_id: string;
    description: string;
    comment?: string | null;
    amount: number;
    currency: string;
    is_contract: boolean;
    contract_code?: null; 
    status: "paid" | "pending";
    created_at: number;
    updated_at: number;
}

export type Payment = {
    id: string;
    date: Date;
    project_id: string; 
    contractor_id: string; 
    contract_id: string | null;
    stage_id: string;
    description: string;
    comment: string | null;
    amount: number | null;
    currency: string;
    is_contract: boolean;
    contract_code: string | null; 
    status: "paid" | "pending";
    created_at: number;
    updated_at: number;
}

export type Stage = {
    id: string;
    name: string;
    description: string;
    created_at: number;
    updated_at: number;
}




import { db, auth } from "./config";
import {
  getDocs,
  getDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
  setDoc,
  serverTimestamp,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  User,
  Project,
  Contractor,
  Contract,
  NonContract,
} from "@/types/types";
import { redirect } from "next/navigation";

const usersRef = collection(db, "users");
const projectsRef = collection(db, "projects");
const stagesRef = collection(db, "stages");
const contractorsRef = collection(db, "contractors");
const contractsRef = collection(db, "contracts");
const noncontractsRef = collection(db, "noncontracts");
const paymentsRef = collection(db, "payments");
const teamsRef = collection(db, "teams");



export async function logout(
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  signOut(auth)
    .then(() => {
      redirect("/");
    })
    .catch((err) => {
      // An error happened.
      setError(err.code + ": " + err.message);
    })
    .finally(() => {
      setLoading(false);
    });
}

// /Projects

// Get all projects

export async function getAllProjects(
  setResult: React.Dispatch<React.SetStateAction<Project[] | undefined>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  try {
    // Display only projects by a specific team
    
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}

// Get one project

export async function getOneProject(id: string) {
  let result = {};
  let loading = true;
  let error = null;

  try {
    const oneProjectRef = doc(db, "projects", id);

    const unsub = onSnapshot(oneProjectRef, (doc) => {
      result = doc?.data() as Project;
    });

    return () => unsub();
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get all contractors

export async function getAllContractors() {
  let result: Contractor[] = [];
  let loading = true;
  let error = null;

  try {
    
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get all contractors under one project

export async function getContractorsByProject(project_id: string) {
  let result: Contractor[] = [];
  let loading = true;
  let error = null;

  try {
    // Display only projects by a specific team
   
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get one contractor

export async function getOneContractor(id: string) {
  let result = {};
  let loading = true;
  let error = null;

  try {
    const oneContractorRef = doc(db, "contractors", id);

    const unsub = onSnapshot(oneContractorRef, (doc) => {
      result = doc?.data() as Contractor;
    });
    return () => unsub();
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get all contracts under one contractor

export async function getContractsByContractor(contractor_id: string) {
  let result: Contract[] = [];
  let loading = true;
  let error = "";

  try {
   
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get all non-contracts under one contractor

export async function getNonContractsByContractor(non_contractor_id: string) {
  let result: NonContract[] = [];
  let loading = true;
  let error = "";

  try {
    
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get one contract

export async function getOneContract(id: string) {
  let result = {};
  let loading = true;
  let error = null;

  try {
    const oneContractRef = doc(db, "contract", id);

    const unsub = onSnapshot(oneContractRef, (doc) => {
      result = doc?.data() as Contract;
    });
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get one non-contract

export async function getOneNonContract(id: string) {
  let result = {};
  let loading = true;
  let error = null;

  try {
    const oneNonContractRef = doc(db, "noncontract", id);

    const unsub = onSnapshot(oneNonContractRef, (doc) => {
      result = doc?.data() as NonContract;
    });
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get all payments under one contract

// Get all stages

// Get all contracts under one stage

// Get all non-contracts under one stage

// Get all payments under one stage

// Create a project

// Create a contractor

// Create a payment

// Create a stage

// Update a project

// Update a contractor

// Update a payment

// Update a stage

// Delete a project

// Delete a contractor

// Delete a payment

// Delete a stage

// /Payments

// Get all payments

// /Team

// Get all users under one team

// Get all admins

// Create a user (only admin can create a user)

// Update a user (only admin can update a user)

// Delete a user (only admin can delete a user)

// /Charts

"use server";
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

import { User, Project, Contractor, Contract } from "@/types/types";
import { redirect } from "next/navigation";

const usersRef = collection(db, "users");
const projectsRef = collection(db, "projects");
const stagesRef = collection(db, "stages");
const contractorsRef = collection(db, "contractors");
const contractsRef = collection(db, "contracts");
const noncontractsRef = collection(db, "noncontracts");
const paymentsRef = collection(db, "payments");
const teamsRef = collection(db, "teams");

let team_id = "";

if (auth) {
  team_id = window.location.pathname.split("/")[1];
}

// /Authentication

// Add user to auth table and "users" collection

export async function createUser(password: string, data: User) {
  let error = "";
  let loading = true;

  createUserWithEmailAndPassword(auth, data.email, password)
    .then((userCredential) => {
      // Signed up

      const user = userCredential.user;

      async () => {
        try {
          // newly authenticated user should relate to "users" collection with same id
          const newUserRef = doc(db, "users", user.uid);

          await setDoc(newUserRef, {
            id: user?.uid,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            is_admin: true,
            created_at: serverTimestamp(),
          });

          // Instantly create a new team after user is registered
          const newTeam = await addDoc(teamsRef, {
            team_name: data.first_name + "'s team",
          });

          // If new team is created, add team_id to the newly added user's document
          if (newTeam) {
            await updateDoc(newUserRef, {
              team_id: newTeam?.id,
            });

            // Take user to dashboard
            redirect(`/team/${newTeam?.id}/dashboard`);
          }
        } catch (err: any) {
          error = err.code + ": " + err.message;
        } finally {
          loading = true;
        }
      };
      // ...
    })
    .catch((err) => {
      error = err.code + ": " + err.message;
    })
    .finally(() => {
      loading = false;
    });

  return { loading, error };
}

export async function login(email: string, password: string) {
  let error = "";
  let loading = true;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      async () => {
        try {
          // Make reference to an already existing user in "users" collection
          const oldUserRef = doc(db, "users", user?.uid);

          const oldUser = await getDoc(oldUserRef);

          // Set their team_id to route
          redirect(`/team/${oldUser?.data()?.team_id}/dashbaord`);
        } catch (err: any) {
          error = err.code + ": " + err.message;
        } finally {
          loading = false;
        }
      };
    })
    .catch((err) => {
      error = err.code + ": " + err.message;
    })
    .finally(() => {
      loading = false;
    });

  return { loading, error };
}

// Update user from auth table and "users" collection

// Delete user from auth table and "users" collection

// Logout

export async function logout() {
  let error = "";
  let loading = true;

  signOut(auth)
    .then(() => {
      redirect("/");
    })
    .catch((err) => {
      // An error happened.
      error = err.code + ": " + err.message;
    })
    .finally(() => {
      loading = false;
    });

  return { loading, error };
}

// /Projects

// Get all projects

export async function getAllProjects() {
  let result: Project[] = [];
  let loading = true;
  let error = "";

  try {
    // Display only projects by a specific team
    const allProjectsRef = query(projectsRef, where("team_id", "==", team_id));

    const unsub = onSnapshot(allProjectsRef, (doc) => {
      doc.forEach((item) => {
        result.push(item.data() as Project);
      });
    });
  } catch (err: any) {
    error = err.message;
  } finally {
    loading = false;
  }

  return { result, loading, error };
}

// Get one project

export async function getOneProject(id: string) {
  let result = {};
  let loading = true;
  let error = "";

  try {
    const oneProjectRef = doc(db, "projects", id);

    const unsub = onSnapshot(oneProjectRef, (doc) => {
      result = doc?.data() as Project;
    });
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
    let error = "";
  
    try {

      const allContractorsRef = query(
        contractorsRef,
        where("team_id", "==", team_id)
      );
  
      const unsub = onSnapshot(allContractorsRef, (doc) => {
        doc.forEach((item) => {
          result.push(item.data() as Contractor);
        });
      });
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
  let error = "";

  try {
    // Display only projects by a specific team
    const allContractorsRef = query(
      contractorsRef,
      where("team_id", "==", team_id),
      where("project_id", "==", project_id)
    );

    const unsub = onSnapshot(allContractorsRef, (doc) => {
      doc.forEach((item) => {
        result.push(item.data() as Contractor);
      });
    });
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
  let error = "";

  try {
    const oneContractorRef = doc(db, "contractors", id);

    const unsub = onSnapshot(oneContractorRef, (doc) => {
      result = doc?.data() as Contractor;
    });
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
        
      const allContractsRef = query(
        contractsRef,
        where("team_id", "==", team_id),
        where("contractor_id", "==", contractor_id)
      );
  
      const unsub = onSnapshot(allContractsRef, (doc) => {
        doc.forEach((item) => {
          result.push(item.data() as Contract);
        });
      });
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  
    return { result, loading, error };
  }

// Get all non-contracts under one contractor

// Get one contract

// Get one non-contract

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

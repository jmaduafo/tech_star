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
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { User } from "@/types/types";
import { redirect } from "next/navigation";
import { Project } from "next/dist/build/swc/types";

const usersRef = collection(db, "users");
const projectsRef = collection(db, "projects");
const stagesRef = collection(db, "stages");
const contractorsRef = collection(db, "contractors");
const contractsRef = collection(db, "contracts");
const noncontractsRef = collection(db, "noncontracts");
const paymentsRef = collection(db, "payments");
const teamsRef = collection(db, "teams");

let team_id = ""

if (auth) {
  team_id = window.location.pathname.split("/")[1];
}

// /Authentication

// Add user to auth table and "users" collection

export async function createUser(password: string, data: User) {
  createUserWithEmailAndPassword(auth, data.email, password)
    .then((userCredential) => {
      // Signed up

      let error = "";
      let loading = true;

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
          return { message: err.code + ": " + err.message };
        }
      };
      // ...
    })
    .catch((error) => {
      return { message: error.code + ": " + error.message };
    });
}

export async function login(email: string, password: string) {
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
          return { message: err.code + ": " + err.message };
        }
      };
    })
    .catch((error) => {
      return { message: error.code + ": " + error.message };
    });
}

// Update user from auth table and "users" collection

// Delete user from auth table and "users" collection

// Logout

export async function logout() {
  let error = "";
  let loading = false;

  loading = true;
  signOut(auth)
    .then(() => {
      redirect("/");
    })
    .catch((error) => {
      // An error happened.
      error = error.code + ": " + error.message;
    });
  loading = false;

  return { loading, error };
}

// /Projects

// Get all projects

export async function getAllProjects() {
  let result: Project[] = [];
  let loading = false;
  let error = "";

  try {
    loading = true;
    
    const allProjectsRef = query(projectsRef, where("team_id", "==", team_id));

    const unsub = onSnapshot(allProjectsRef, (projects) => {
      projects.forEach((item) => {
        result.push(item.data() as Project);
      });
    });

    loading = false;
  } catch (err: any) {
    error = err.message;
    loading = false;
  }

  return { result, loading, error };
}

// Get one project

export async function getOneProject() {
  let result: Project[] = [];
  let loading = false;
  let error = "";

  try {
    loading = true;

    const unsub = onSnapshot(projectsRef, (projects) => {
      projects.forEach((item) => {
        result.push(item.data() as Project);
      });
    });

    loading = false;
  } catch (err: any) {
    error = err.message;
    loading = false;
  }

  return { result, loading, error };
}

// Get all contractors under one project

// Get one contractor

// Get all contracts under one contractor

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

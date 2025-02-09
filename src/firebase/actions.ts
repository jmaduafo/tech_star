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

import { CreateUserSchema } from "@/zod/validation";

const usersRef = collection(db, "users");
const projectsRef = collection(db, "projects");
const stagesRef = collection(db, "stages");
const contractorsRef = collection(db, "contractors");
const contractsRef = collection(db, "contracts");
const noncontractsRef = collection(db, "noncontracts");
const paymentsRef = collection(db, "payments");
const teamsRef = collection(db, "teams");

let team_id = "";
// console.log(window.location.pathname)

// // if (auth) {
// //   team_id = window.location.pathname.split("/")[1];
// // }

// /Authentication

// Add user to auth table and "users" collection

export async function checkUniqueUser(newEmail: string) {
  let error : string | null = null;

  try {
    // Check if there is an email in the schema that is the same as the entered email
    const findEmail = query(usersRef, where("email", "==", newEmail));

    const notUnique = [];
    const unsub = onSnapshot(findEmail, (doc) => {
      doc.forEach((item) => {
        notUnique.push(item.data().email);
      });
    });

    if (notUnique.length) {
      error = "This email address is already in use.";
    }
  } catch (err: any) {
    error = err.message;
  }

  return error;
}

type Signup = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
};

export async function createUser(data: Signup, setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
   // Validates the entered data with zod

  setLoading(true)

  // const userResult = CreateUserSchema.safeParse(data);

  // if (!userResult.success) {
  //   setError(userResult.error.issues[0].message)
  //   setLoading(false)
  //   return;
  // }

  // // Deconstruct object
  // const { email, password, first_name, last_name } = userResult.data;

  // // Checks to see if the email entered has already been used
  // const error = await checkUniqueUser(email);

  // if (error) {
  //   setError(error)
  //   setLoading(false)
  //   return;
  // }

  // Finally create new user if validations are successful
  createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      // Signed up

      const user = userCredential.user;

      async function create() {
        try {
          // Instantly create a new team after user is registered
          const newTeam = await addDoc(teamsRef, {
            team_name: data.first_name + "'s team",
          });

          // If new team is created, add new team id to the new user's document in "users" schema
          if (newTeam) {
            // newly authenticated user should relate to "users" collection with same id
            const newUserRef = doc(db, "users", user.uid);

            await setDoc(newUserRef, {
              id: user?.uid,
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
              team_id: newTeam?.id,
              is_admin: true,
              created_at: serverTimestamp(),
            });

            // Take user to dashboard
            redirect(`/team/${newTeam?.id}/dashboard`);
          }
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false)
        }
      }

      create();
      // ...
    })

    .catch((err) => {
      setError(err.message);
    })
    .finally(() => {
      setLoading(false)
    });
}

type Login = {
  email: string;
  password: string;
};

export async function login(data: Login) {
  let error: string | null = null;
  let loading = true;
  // Validates the entered data with zod
  // const userResult = LoginUserSchema.safeParse(data);

  // if (!userResult.success) {
  //   error = userResult.error.message;
  //   loading = false;

  //   return
  // }

  const { email, password } = data;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;

      async function login() {
      try {
          // Make reference to an already existing user in "users" collection
          const oldUserRef = doc(db, "users", user?.uid);

          const oldUser = await getDoc(oldUserRef);

          // Set their team_id to route
          redirect(`/team/${oldUser?.data()?.team_id}/dashboard`);
        
      } catch (err: any) {
        error += err.code + ": " + err.message;
      } finally {
        loading = false;
      }
    }

    login()
})
    .catch((err) => {
      error += err.code + ": " + err.message;
    });
    // .finally(() => {
      //   loading = false;
      // });
      return { loading, error }
}

// Update user from auth table and "users" collection

// Delete user from auth table and "users" collection

// Logout

export async function logout(setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) {

  signOut(auth)
    .then(() => {
      redirect("/");
    })
    .catch((err) => {
      // An error happened.
      setError(err.code + ": " + err.message)
    })
    .finally(() => {
      setLoading(false);
    });

}

// /Projects

// Get all projects

export async function getAllProjects() {
  let result: Project[] = [];
  let loading = true;
  let error = null;

  try {
    // Display only projects by a specific team
    const allProjectsRef = query(projectsRef, where("team_id", "==", team_id));

    let array = [];
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
  let error = null;

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
  let error = null;

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
  let error = null;

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
  let error = null;

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

export async function getNonContractsByContractor(non_contractor_id: string) {
  let result: NonContract[] = [];
  let loading = true;
  let error = "";

  try {
    const allNonContractsRef = query(
      noncontractsRef,
      where("team_id", "==", team_id),
      where("non_contractor_id", "==", non_contractor_id)
    );

    const unsub = onSnapshot(allNonContractsRef, (doc) => {
      doc.forEach((item) => {
        result.push(item.data() as NonContract);
      });
    });
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

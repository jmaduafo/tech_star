import { db } from "./config";
import {
  collection,
  deleteDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  DocumentData,
  Query,
  getCountFromServer,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
} from "firebase/firestore";

export async function getUserData(id: string) {
  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);

  let user = userSnap?.data()
  
  return user
}

export async function getAllItems(collectionName: string) {
  const dataRef = collection(db, collectionName);

  try {
    // Display only projects by a specific team
    const allItems: DocumentData[] = [];
    const unsub = onSnapshot(dataRef, (snap) => {
      snap.forEach((item) => {
        allItems.push(item.data());
      });
    });

    unsub();

    return allItems;
  } catch (err: any) {
    console.error(err.message);
  }
}

export async function getQueriedItems<T = DocumentData>(ref: Query<DocumentData, DocumentData>): Promise<T[]> {
  try {
    const snap = await getDocs(ref);
    return snap.docs.map((item) => ({
      id: item.id,
      ...item.data() as T,
    }));
  } catch (err: any) {
    console.log(err.message);
    return [];
  }
}

export async function getDocumentItem(collectionName: string, id: string) {
  try {
    // Display only projects by a specific team
    const docRef = doc(db, collectionName, id)
    
    const docSnap = await getDoc(docRef)

    if (!docSnap?.exists()) {
      return;
    }

    return docSnap?.data()

  } catch (err: any) {
    throw new err.message();
  }
}

export async function getCount(collectionName: string) {
  const queryRef = collection(db, collectionName);

  try {
    // Display only projects by a specific team
    const snapshot = await getCountFromServer(queryRef);
    return snapshot?.data()?.count;
  } catch (err: any) {
    console.error(err.message);
  }
}

export async function getQueriedCount(ref: Query<DocumentData, DocumentData>) {
  try {
    // Display only projects by a specific team
    const snapshot = await getCountFromServer(ref);
    return snapshot?.data()?.count;
  } catch (err: any) {
    console.log(err.message);
  }
}

export async function addItem(collectionName: string, items: object) {
  try {
    // Display only projects by a specific team
    const ref = collection(db, collectionName);

    await addDoc(ref, items);
  } catch (err: any) {
    return err;
  }
}

export async function updateItem(
  collectionName: string,
  id: string,
  items: object
) {
  try {
    // Display only projects by a specific team
    const ref = doc(db, collectionName, id);

    await updateDoc(ref, items);
  } catch (err: any) {
    return err;
  }
}

export async function deleteItem(collectionName: string, id: string) {
  try {
    // Display only projects by a specific team
    const ref = doc(db, collectionName, id);

    await deleteDoc(ref);
  } catch (err: any) {
    return err;
  }
}

export async function updateQueriedItem(
  ref: DocumentReference<DocumentData, object>,
  items: object
) {
  try {
    await updateDoc(ref, items);
  } catch (err: any) {
    return err;
  }
}

// Get one project

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

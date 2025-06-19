import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "./config";
import {
  collection,
  deleteDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  DocumentData,
  Query,
  getCountFromServer,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  writeBatch,
  query,
  where,
} from "firebase/firestore";

export async function uploadImage(file: File, path: string) {
  try {
    const storageRef = ref(storage, `${path}/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    return {
      response: url,
      success: true
    }
  } catch (err: any) {
    return {
      response: err.message,
      success: false
    }
  }
}

export async function getUserData(id: string) {
  const userRef = doc(db, "users", id);
  const userSnap = await getDoc(userRef);

  let user = userSnap?.data()
  
  return user
}

export async function checkUniqueUser(email: string): Promise<boolean> {
  const usersRef = collection(db, "users");
  const findEmail = query(usersRef, where("email", "==", email));
  const snapshot = await getDocs(findEmail);

  return !snapshot.empty; // true if email exists
}

export function getAllItems(collectionName: string) {
  const dataRef = collection(db, collectionName);

  try {
    // Display only projects by a specific team
    const unsub = onSnapshot(dataRef, (snap) => {
      const allItems: DocumentData[] = [];

      snap.forEach((item) => {
        allItems.push({...item.data(), id: item.id});
      });

      unsub();

      return allItems;
    });


  } catch (err: any) {
    console.error(err.message);
  }
}

export async function getQueriedItems<T = DocumentData>(ref: Query<DocumentData>): Promise<T[]> {
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

export async function getQueriedCount(ref: Query<DocumentData>) {
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
  ref: DocumentReference<DocumentData>,
  items: object
) {
  try {
    await updateDoc(ref, items);
  } catch (err: any) {
    return err;
  }
}

export async function deleteContractAndPayments(contractId: string, projectId: string) {
  try {
    // Start a batch operation
    const batch = writeBatch(db);

    // Query all payments linked to the contract
    const paymentsQuery = query(
      collection(db, "payments"),
      where("contract_id", "==", contractId),
      where("project_id", "==", projectId)
    );

    const paymentsSnapshot = await getDocs(paymentsQuery);

    // Add each payment delete operation to the batch
    paymentsSnapshot.forEach((paymentDoc) => {
      batch.delete(doc(db, "payments", paymentDoc.id));
    });

    // Delete the contract itself
    batch.delete(doc(db, "contracts", contractId));

    // Commit the batch operation
    await batch.commit();

    return "success"
  } catch (error: any) {
    return error.message
  }
}

export async function deleteProject(projectId: string) {
  try {
    // Start a batch operation
    const batch = writeBatch(db);

    // Query all payments linked to the contract
    const contractorsQuery = query(
      collection(db, "contractors"),
      where("project_id", "==", projectId)
    );

    const stagesQuery = query(
      collection(db, "stages"),
      where("project_id", "==", projectId)
    );

    const contractQuery = query(
      collection(db, "contracts"),
      where("project_id", "==", projectId)
    );

    const paymentsQuery = query(
      collection(db, "payments"),
      where("project_id", "==", projectId)
    );

    const [contractors, stages, contracts, payments] = await Promise.all([
      getDocs(contractorsQuery),
      getDocs(stagesQuery),
      getDocs(contractQuery),
      getDocs(paymentsQuery),
      
    ]) 

    // Add each payment delete operation to the batch
    contractors.forEach((snap) => {
      batch.delete(doc(db, "contractors", snap.id));
    });
    stages.forEach((snap) => {
      batch.delete(doc(db, "stages", snap.id));
    });
    contracts.forEach((snap) => {
      batch.delete(doc(db, "contracts", snap.id));
    });
    payments.forEach((snap) => {
      batch.delete(doc(db, "payments", snap.id));
    });


    batch.delete(doc(db, "projects", projectId));

    // Commit the batch operation
    await batch.commit();

    return "success"
  } catch (error: any) {
    return error.message
  }
}
export async function deleteContractor(contractorId: string) {
  try {
    // Start a batch operation
    const batch = writeBatch(db);

    const contractQuery = query(
      collection(db, "contracts"),
      where("contractor_id", "==", contractorId)
    );

    const paymentsQuery = query(
      collection(db, "payments"),
      where("contractor_id", "==", contractorId)
    );

    const [contracts, payments] = await Promise.all([
      getDocs(contractQuery),
      getDocs(paymentsQuery),
      
    ]) 

    contracts.forEach((snap) => {
      batch.delete(doc(db, "contracts", snap.id));
    });
    payments.forEach((snap) => {
      batch.delete(doc(db, "payments", snap.id));
    });

    batch.delete(doc(db, "contractors", contractorId));

    // Commit the batch operation
    await batch.commit();

    return "success"
  } catch (error: any) {
    return error.message
  }
}
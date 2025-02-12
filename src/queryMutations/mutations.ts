import { useFirestoreDocumentMutation, useFirestoreQuery, useFirestoreDocument, useFirestoreCollectionMutation  } from "@react-query-firebase/firestore";


export const getAllItems = (key: string[], ref: any) => {
    return useFirestoreQuery(key, ref, {
        subscribe: true,
    });
};

export const getSingleItem = (key: string, id: string, ref: any) => {
    return useFirestoreDocument([key, id], ref, {
        subscribe: true,
    });
};

// Add item to a collection
export const addSingleItem = (ref: any) => {
    return useFirestoreCollectionMutation(ref);
};

// Update a document based on id
export const updateSingleItem = (ref: any) => {
    return useFirestoreCollectionMutation(ref);
};

// Delete a document based on id
export const deleteSingleItem = (ref: any) => {
    return useFirestoreDocumentMutation(ref);
};

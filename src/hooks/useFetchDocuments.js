import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { database } from "../firebase/firebase";

export default function useFetchDocuments(collectionName, documentID) {
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const getDocument = async () => {
      const docRef = doc(database, collectionName, documentID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        const obj = { id: documentID, ...docSnap.data() };
        setDocument(obj);
      } else {
        toast.error("Document not found", {
          autoClose: 5000,
          pauseOnFocusLoss: false,
        });
      }
    };
    getDocument();
  }, [collectionName, documentID]);

  return { document };
}

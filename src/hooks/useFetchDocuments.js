import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCustomAlert } from "../contexts/AlertContext";
import { database } from "../firebase/firebase";

export default function useFetchDocuments(collectionName, documentID) {
  const [document, setDocument] = useState(null);
  const { setShowAlert, setAlertMessage, setAlertType } = useCustomAlert();

  useEffect(() => {
    const getDocument = async () => {
      const docRef = doc(database, collectionName, documentID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        const obj = { id: documentID, ...docSnap.data() };
        setDocument(obj);
      } else {
        setShowAlert(true);
        setAlertMessage(`Document not found`);
        setAlertType("error");
        window.setTimeout(() => {
          setShowAlert(false);
          setAlertMessage(null);
          setAlertType(null);
        }, 6000);
      }
    };
    getDocument();
  }, [collectionName, documentID]);

  return { document };
}

/* eslint-disable react-hooks/exhaustive-deps */
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase/config";

const useFetchCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(false);

function getCollection() {
    setisLoading(true);

    try {
      const docRef = collection(db, collectionName);
      const q = query(docRef, orderBy("createdAt", "desc"));

     onSnapshot(q, (snapshot) => {
        // console.log(snapshot.docs);
        const allData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log(allData);
        setData(allData);
        setisLoading(false);
      });
    } catch (error) {
      setisLoading(false);
      console.log(error.message)
      toast.error(error.message);
    }
  }
  useEffect(() => {
    getCollection();
  }, []);

  return { data, isLoading };
};

export default useFetchCollection;

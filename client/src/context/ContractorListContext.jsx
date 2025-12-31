// src/context/ContractorListContext.js
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const ContractorListContext = createContext();

export const ContractorListProvider = ({ children }) => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContractors = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/contractors/allContractors"); // GET all contractors
      setContractors(res.data);
      console.log("Fetched contractors:", res.data);
    } catch (err) {
      console.error("Error fetching contractors:", err);
      setContractors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, []);

  return (
    <ContractorListContext.Provider value={{ contractors, loading }}>
      {children}
    </ContractorListContext.Provider>
  );
};

export const useContractorList = () => useContext(ContractorListContext);

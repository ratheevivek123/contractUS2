import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create context
const ContractorContext = createContext();

// Create provider
export const ContractorProvider = ({ children }) => {
    const [contractor, setContractor] = useState(null);
    const [loading, setLoading] = useState(true);
    

    const fetchContractor = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/contractors/token", { withCredentials: true });
            setContractor(res.data.contractor);
        } catch (err) {
            console.error("Error fetching contractor:", {
                message: err.message,
                code: err.code,
                status: err.response?.status,
                responseData: err.response?.data,
                headers: err.response?.headers
            });

            if (err.response?.status === 401) {
                setContractor(null);
            } else {
                setContractor(null);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContractor();
    }, []);

    return (
        <ContractorContext.Provider value={{ contractor, setContractor, loading }}>
            {children}
        </ContractorContext.Provider>
    );
};

// Export custom hook
export const useContractor = () => useContext(ContractorContext);
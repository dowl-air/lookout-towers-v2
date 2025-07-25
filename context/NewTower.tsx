import { Tower } from "@/types/Tower";
import { createContext, useContext, useState } from "react";

interface FormContextType {
    tower: Partial<Tower>;
    updateTower: (newData: Partial<Tower>) => void;
    reset: () => void;
}

const TowerContext = createContext<FormContextType | undefined>(undefined);

export const NewTowerProvider = ({ children }) => {
    const [tower, setFormData] = useState({});

    const updateTower = (newData: Partial<Tower>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    const reset = () => {
        setFormData({});
    };

    return <TowerContext.Provider value={{ tower, updateTower, reset }}>{children}</TowerContext.Provider>;
};

export const useNewTowerContext = () => useContext(TowerContext);

import { Tower } from "@/types/Tower";
import { createContext, useContext, useState } from "react";

interface FormContextType {
    tower: Partial<Tower>;
    updateTower: (newData: Partial<Tower>) => void;
}

const TowerContext = createContext<FormContextType | undefined>(undefined);

export const NewTowerProvider = ({ children }) => {
    const [tower, setFormData] = useState({});

    const updateTower = (newData: Partial<Tower>) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    return <TowerContext.Provider value={{ tower, updateTower }}>{children}</TowerContext.Provider>;
};

export const useNewTowerContext = () => useContext(TowerContext);

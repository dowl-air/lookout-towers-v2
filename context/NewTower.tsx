import { createContext, useContext, useState } from "react";

import { Tower } from "@/types/Tower";

interface FormContextType {
    replaceTower: (newData: Partial<Tower>) => void;
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

    const replaceTower = (newData: Partial<Tower>) => {
        setFormData(newData);
    };

    const reset = () => {
        setFormData({});
    };

    return (
        <TowerContext.Provider value={{ replaceTower, tower, updateTower, reset }}>
            {children}
        </TowerContext.Provider>
    );
};

export const useNewTowerContext = () => useContext(TowerContext);

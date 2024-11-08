import * as React from 'react';
import { createContext, useState } from 'react';

interface DataStore {
  [key: string]: any;
}

interface DataContextType {
  dataStore: DataStore;
  setData: ((key: string, value: any) => void) | null;
}

const DataContext = createContext<DataContextType>({
  dataStore: {},
  setData: null,
});
interface DataProviderProps {
  children: React.ReactNode;
}
const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [dataStore, setDataStore] = useState<DataStore>({});

  const setData = (key: string, value: any) => {
    setDataStore((prevDataStore) => ({ ...prevDataStore, [key]: value }));
  };

  return (
    <DataContext.Provider value={{ dataStore, setData }}>
      {children}
    </DataContext.Provider>
  );
};

export { DataContext, DataProvider };
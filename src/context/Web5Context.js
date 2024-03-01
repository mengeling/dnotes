import React, { createContext, useContext, useEffect, useState } from "react";
import { Web5 } from "@web5/api";

const Web5Context = createContext();

export const Web5Provider = ({ children }) => {
  const [web5, setWeb5] = useState(null);

  useEffect(() => {
    const connectWeb5 = async () => {
      const { web5 } = await Web5.connect();
      setWeb5(web5);
    };

    connectWeb5();
  }, []);

  return <Web5Context.Provider value={web5}>{children}</Web5Context.Provider>;
};

export const useWeb5 = () => useContext(Web5Context);

import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

interface SidebarContextType {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export const SidebarContext = createContext<SidebarContextType>({
  isSidebarOpen: false,
  setIsSidebarOpen: () => {}
});
function SidebarProvider(props: Props) {
  const { children } = props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setIsSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;

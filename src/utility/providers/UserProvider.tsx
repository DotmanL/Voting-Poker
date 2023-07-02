import React, { createContext, useEffect, useState } from "react";
import UserService from "api/UserService";
import { IUser } from "interfaces/User/IUser";

type Props = {
  children: React.ReactNode;
};

interface UserContextType {
  currentUser: IUser | undefined;
  setCurrentUser: (user: IUser | undefined) => void;
}
export const UserContext = createContext<UserContextType>({
  currentUser: undefined,
  setCurrentUser: () => {}
});
function UserProvider(props: Props) {
  const { children } = props;
  const [currentUser, setCurrentUser] = useState<IUser>();

  useEffect(() => {
    const getCurrentUser = async () => {
      const getUserId = localStorage.getItem("userId");
      const userId = JSON.parse(getUserId!);
      if (!userId) {
        return;
      }
      const user = await UserService.loadUser(userId);
      setCurrentUser(user);
    };
    getCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;

import { IIssue } from "interfaces/Issues";
import React, { createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

interface IssueContextType {
  activeIssue: IIssue | undefined;
  setActiveIssue: (issue: IIssue | undefined) => void;
}
export const IssueContext = createContext<IssueContextType>({
  activeIssue: undefined,
  setActiveIssue: () => {}
});
function IssuesProvider(props: Props) {
  const { children } = props;
  const [activeIssue, setActiveIssue] = useState<IIssue | undefined>(undefined);

  return (
    <IssueContext.Provider value={{ activeIssue, setActiveIssue }}>
      {children}
    </IssueContext.Provider>
  );
}

export default IssuesProvider;

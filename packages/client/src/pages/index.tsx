import { useContext } from "react";
import { AdminHome, PoliceHome } from "../components";
import { RootContext } from "../contexts";
import { useIsAuthenticated } from "../hooks";

const Index = () => {
  useIsAuthenticated();
  const { currentUser } = useContext(RootContext);
  if (!currentUser) {
    return null;
  }
  return currentUser.type === "admin" ? <AdminHome /> : <PoliceHome />
};

export default Index;

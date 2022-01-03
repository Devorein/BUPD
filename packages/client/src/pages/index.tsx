import { useContext } from "react";
import { AdminHome, PoliceHome } from "../components";
import { RootContext } from "../contexts";

const Index = () => {
  const { currentUser } = useContext(RootContext);
  if (!currentUser) {
    return null;
  }
  return currentUser.type === "admin" ? <AdminHome /> : <PoliceHome />
};

export default Index;

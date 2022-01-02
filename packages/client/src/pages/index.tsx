import { useContext } from "react";
import { AdminHome, Page, PoliceHome } from "../components";
import { RootContext } from "../contexts";

const Index = () => {
  const { currentUser } = useContext(RootContext);
  function render() {
    if (!currentUser) {
      return null;
    }
    return currentUser.type === "admin" ? <AdminHome /> : <PoliceHome />
  }

  return (
    <Page>
      {render()}
    </Page>
  );
};

export default Index;

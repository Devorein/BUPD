import { AdminHome, Page, PoliceHome } from "../components";
import { useIsAuthenticated } from "../hooks";

const Index = () => {
  const currentUser = useIsAuthenticated();

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

import { AdminHome, Page, PoliceHome } from "../components";
import { useIsAuthenticated } from "../hooks";

const Index = () => {
  const currentUser = useIsAuthenticated();
  if (!currentUser) {
    return null;
  }
  return (
    <Page>
      {currentUser.type === "admin" ? <AdminHome /> : <PoliceHome />}
    </Page>
  );
};

export default Index;

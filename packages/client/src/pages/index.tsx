import { Page } from "../components";
import { useIsAuthenticated } from "../hooks";

const Index = () => {
  useIsAuthenticated();
  return (
    <Page>
      <div>
        Hello World
      </div>
    </Page>
  );
};

export default Index;

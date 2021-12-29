import { Page } from "../components";
import { useIsAuthenticated, useIsAuthorized } from "../hooks";

// const createCasefileInitialPayload: CreateCasefilePayload = {
//   categories: [],
//   criminals: [],
//   location: "",
//   priority: "low",
//   time: Date.now(),
//   victims: [],
//   weapons: [],
//   status: "open"
// };

export default function Case() {
  useIsAuthenticated();
  useIsAuthorized(["police"]);

  return <Page>
    Case
  </Page>
}
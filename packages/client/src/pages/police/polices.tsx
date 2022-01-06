import { PoliceList } from "../../components/PoliceList";
import { useIsAuthenticated, useIsAuthorized } from "../../hooks";

export default function Polices() {
  useIsAuthenticated();
  useIsAuthorized(["police"]);
  return <PoliceList />
}

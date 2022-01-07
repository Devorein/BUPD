import { useIsAuthenticated, useIsAuthorized } from "../hooks";

export default function Profile() {
  const currentUser = useIsAuthenticated();
  useIsAuthorized(["police"])

  return null
}
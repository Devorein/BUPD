import React from "react";
import AdminAccessList from '../components/AdminAccessList';
import { PoliceAccessList } from "../components/PoliceAccessList";
import { useIsAuthenticated } from '../hooks/useIsAuthenticated';

export default function Accesses() {
  const currentUser = useIsAuthenticated();
  if (!currentUser) {
    return null;
  }
  return currentUser.type === "admin" ? <AdminAccessList /> : <PoliceAccessList />
}

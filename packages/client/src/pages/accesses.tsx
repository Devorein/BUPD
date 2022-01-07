import React from "react";
import AdminAccessList from '../components/AdminAccessList';
import { PoliceAccessList } from "../components/PoliceAccessList";
import { useIsAuthenticated } from '../hooks/useIsAuthenticated';

export default function Accesses() {
  const currentUser = useIsAuthenticated();

  return currentUser.type === "admin" ? <AdminAccessList /> : <PoliceAccessList />
}

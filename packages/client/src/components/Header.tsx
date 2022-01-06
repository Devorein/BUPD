import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import MedicationIcon from '@mui/icons-material/Medication';
import WorkIcon from '@mui/icons-material/Work';
import router from 'next/router';
import { useContext } from 'react';
import { useGetCurrentUserQueryData } from '../api';
import { JWT_LS_KEY } from '../constants';
import { RootContext } from '../contexts';
import Logo from '../svg/logo';
import { Button } from './Button';
import { DropDownMenu, DropDownMenuItem } from './DropDownMenu';

export function Header() {
  const { currentUser } = useContext(RootContext);

  // Find the user name from the current logged in entity
  const getCurrentUserQueryData = useGetCurrentUserQueryData();
  let currentUserName: string | null = null;
  if (currentUser) {
    if (currentUser.type === 'admin') {
      currentUserName = `Admin ${currentUser.id}`;
    } else {
      currentUserName = currentUser.name;
    }
  }

  return (
    <div className="flex gap-3 items-center justify-between shadow-md p-3">
      <div
        onClick={() => {
          router.push({ pathname: '/' });
        }}
        className="flex gap-1 items-center cursor-pointer"
      >
        <Logo />
        <span className="font-bold text-xl">BUPD</span>
      </div>
      <div className="flex gap-3 items-center">
        {currentUser ? (
          <div className="mr-3">
            <span className="font-medium flex gap-2 items-center">
              Welcome back,
              <DropDownMenu
                menuItems={[
                  <DropDownMenuItem iconComponent={<DashboardIcon fontSize="small" />} key="dashboard" label="Dashboard" link={`/`} />,
                  <DropDownMenuItem iconComponent={<LocalPoliceIcon fontSize="small" />} key="polices" label="Polices" link={`${currentUser.type}/polices`} />,
                  <DropDownMenuItem iconComponent={<WorkIcon fontSize="small" />} key="casefiles" label="Casefiles" link={`${currentUser.type}/casefiles`} />,
                  <DropDownMenuItem iconComponent={<svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" data-darkreader-inline-stroke ><g><path fill="none" d="M0 0h24v24H0z" /><path d="M22.373 19.44a1.5 1.5 0 0 1-2.121 2.12l-4.596-4.596L12.12 20.5l-7.778-7.778a8 8 0 0 1-.174-11.135l.174-.179L22.373 19.44z" /></g></svg>} key="criminals" label="Criminals" link={`${currentUser.type}/criminals`} />,
                  <DropDownMenuItem iconComponent={<MedicationIcon fontSize="small" />} key="victims" label="Victims" link={`${currentUser.type}/victims`} />,
                ]}
                menuLabel={<span className="font-bold text-lg">{currentUserName}</span>}
              />
            </span>
          </div>
        ) : null}
        {currentUser?.type === 'admin' ? (
          <Button
            content="Register a police"
            onClick={() => {
              router.push(`/admin/register`);
            }}
          />
        ) : null}
        {currentUser?.type === 'police' ? (
          <Button
            content="Report a case"
            onClick={() => {
              router.push(`/police/case`);
            }}
          />
        ) : null}
        {!currentUser ? (
          <Button
            content="Login"
            onClick={() => {
              router.push(`/login`);
            }}
          />
        ) : (
          <Button
            content="Logout"
            onClick={() => {
              getCurrentUserQueryData(() => ({
                status: 'error',
                message: 'Logged out',
              }));
              if (typeof window !== 'undefined') {
                localStorage.removeItem(JWT_LS_KEY);
              }
              router.push('/login');
            }}
          />
        )}
      </div>
    </div>
  );
}

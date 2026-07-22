import type { ReactNode } from 'react';
import {
  UsersIcon,
  UsersGroupIcon,
  CreditCardIcon,
  PlaidLockIcon,
  LayoutGridIcon,
  UserCheckIcon,
  BuildingIcon,
  HomeIcon,
  FileCheckIcon,
  ActivityIcon,
  GraduationCapIcon,
  ClipboardListIcon,
  LogsIcon
} from './nav-icons';

// ----------------------------------------------------------------------

export interface NavItem {
  title: string;
  path: string;
  icon: ReactNode;
}

export interface NavGroup {
  subheader: string;
  items: NavItem[];
}

// ----------------------------------------------------------------------

export const navConfig: NavGroup[] = [
  {
    subheader: 'ADMIN',
    items: [
      {
        title: 'Users Management',
        path: '#users-management',
        icon: <UsersIcon />,
      },
      {
        title: 'Insurance Payers',
        path: '#insurance-payers',
        icon: <CreditCardIcon />,
      },
      {
        title: 'Plaid',
        path: '#plaid',
        icon: <PlaidLockIcon />,
      },
    ],
  },
  {
    subheader: 'ENROLLMENT',
    items: [
      {
        title: 'Dashboard',
        path: '#enrollment-dashboard',
        icon: <LayoutGridIcon />,
      },
      {
        title: 'Provider Management',
        path: '#provider-management',
        icon: <UserCheckIcon />,
      },
      {
        title: 'Client Management',
        path: '#client-management',
        icon: <BuildingIcon />,
      },
      {
        title: 'Client Group',
        path: '#client-group',
        icon: <UsersGroupIcon />,
      },
    ],
  },
  {
    subheader: 'OVERVIEW',
    items: [
      {
        title: 'Home',
        path: '#dashboard',
        icon: <HomeIcon />,
      },
      {
        title: 'Active Incomplete Cases',
        path: '#active-incomplete-cases',
        icon: <FileCheckIcon />,
      },
      {
        title: 'ED Floor Visits',
        path: '#ed-floor-visits',
        icon: <ActivityIcon />,
      },
      {
        title: 'Educational Resources',
        path: '#educational-resources',
        icon: <GraduationCapIcon />,
      },
    ],
  },
  {
    subheader: 'REPORTS',
    items: [
      {
        title: 'Report Management',
        path: '#report-management',
        icon: <ClipboardListIcon />,
      },
    ],
  },
  {
    subheader: 'Logs',
    items: [
      {
        title: 'Logs',
        path: '#logs',
        icon: <LogsIcon />,
      },
    ],
  },
];

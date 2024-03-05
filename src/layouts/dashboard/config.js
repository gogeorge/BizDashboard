import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import GlobeEuropeAfricaIcon from '@heroicons/react/24/solid/GlobeEuropeAfricaIcon';
import DocumentTextIcon from '@heroicons/react/24/solid/DocumentTextIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/solid/DocumentDuplicateIcon';
import BuildingOffice2Icon from '@heroicons/react/24/solid/BuildingOffice2Icon';
import DocumentChartBarIcon from '@heroicons/react/24/solid/DocumentChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Dashboard',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Clients',
    path: '/clients',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Suppliers',
    path: '/suppliers',
    icon: (
      <SvgIcon fontSize="small">
        <BuildingOffice2Icon />
      </SvgIcon>
    )
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentDuplicateIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Docs',
    path: '/docs',
    icon: (
      <SvgIcon fontSize="small">
        <DocumentTextIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];

import { useCallback } from 'react';
import Map, { GeolocateControl } from "react-map-gl";
import { useEffect, useState, useMemo } from 'react';
import { applyPagination } from 'src/utils/apply-pagination';
import { useSelection } from 'src/hooks/use-selection';
import { subDays, subHours } from 'date-fns';
import { AltTable } from 'src/sections/countries/alt-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';




const now = new Date();

let cdata = []

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(cdata, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

export const CountryTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [resData, setData] = useState({});
  const [clientData, setClients] = useState({});
  const [projects, setProjects] = useState({})

  const fillCData = (countries) => {
    for (let i = 0; i < countries.length; i++) {
      let pnr = 0
      for (let j = 0; j < countries[i].folders.length; j++) {
        pnr = Math.floor(projects.filter((obj) => obj["country"] === countries[i].folders[j].country).length)
      }
      cdata.push({
        name: countries[i].name,
        avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
        createdAt: subDays(subHours(now, 15), 4).getTime(),
        country: pnr,
        tableid: Math.floor(10000 + Math.random() * 90000),
      })
    }
  }

  fillCData(clientData)

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  )

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <div style={{height: 200}}>
      <CustomersSearch />
      <AltTable
        count={cdata.length}
        items={customers}
        data={clientData}
        onDeselectAll={customersSelection.handleDeselectAll}
        onDeselectOne={customersSelection.handleDeselectOne}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onSelectAll={customersSelection.handleSelectAll}
        onSelectOne={customersSelection.handleSelectOne}
        page={page}
        rowsPerPage={rowsPerPage}
        selected={customersSelection.selected}
      />
    </div>
  );
};

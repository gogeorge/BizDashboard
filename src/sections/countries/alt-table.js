import { useState } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  CardContent,
  Button
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { EditClient } from 'src/sections/companies/edit-client';
import { useCallback } from 'react';
import Map, { GeolocateControl } from "react-map-gl";
import { useEffect, useMemo } from 'react';
import { applyPagination } from 'src/utils/apply-pagination';
import { useSelection } from 'src/hooks/use-selection';
import { subDays, subHours } from 'date-fns';
import { CustomersTable } from 'src/sections/customer/customers-table';
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


export const AltTable = (props) => {
  const {
    count = 0,
    items = [],
    data = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onClick = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    // page = 0,
    // rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
  const [cardVisibility, setCardVisibility] = useState(false);
  const [selectedCountry, setCountry] = useState('');
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [addClient, setAddClient] = useState(false)

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [resData, setData] = useState({});
  const [clientData, setClients] = useState({});
  const [projects, setProjects] = useState({})

  const fillCData = (countries, selected) => {
    for (let i = 0; i < countries.length; i++) {
      for (let j = 0; j < countries[i].folders.length; j++) {
        console.log(selected, countries[i].folders[j].name)
        if (selected == countries[i].name) {
          cdata.push({
            name: countries[i].folders[j].name,
            avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
            country: countries[i].folders[j].country,
            createdAt: subDays(subHours(now, 15), 4).getTime(),
            tableid: Math.floor(10000 + Math.random() * 90000),
            eid: countries[i].folders[j].eid,
            folderId: countries[i].folders[j].folderId,
            webpage: countries[i].folders[j].webpage,
            vat: countries[i].folders[j].vat,
            field: countries[i].folders[j].field,
            address: countries[i].folders[j].address,
            folders: countries[i].folders[j].folders,
            files: countries[i].folders[j].files,
            contactPurchasing: 
            {
              name: countries[i].folders[j].contactPurchasing.name1,
              fixTel: countries[i].folders[j].contactPurchasing.fixTel, 
              mobTel: countries[i].folders[j].contactPurchasing.mobTel,
              email: countries[i].folders[j].contactPurchasing.email
            },
            contactAccountant :
            {
              name: "Vlad Popescu",
              fixTel: '', 
              mobTel: '',
              email: ''
            },
            contactOther :
            {
              name: "Ana-Maria Popescu",
              fixTel: '', 
              mobTel: '',
              email: ''
            },
            // contact: contactPurchasing.name,
          })
        }
      }
    }
  }


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
    <Card>
      <Scrollbar>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(event) => {
                      if (event.target.checked) {
                        onSelectAll?.();
                      } else {
                        onDeselectAll?.();
                      }
                    }}
                  />
                </TableCell>
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Projects
                </TableCell>
                <TableCell>
                  Phone
                </TableCell>
                <TableCell>
                  Signed Up
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((customer, index) => {
                const isSelected = selected.includes(customer.id);
                const createdAt = format(customer.createdAt, 'dd/MM/yyyy');
                // const createdAt = ''
                return (
                  <TableRow
                    hover
                    key={customer.tableid}
                    selected={isSelected}
                    onClick={() => {
                        setSelectedRowIndex(index)
                        // setCountry(customer.country)
                        fillCData(clientData, customer.name)
                        setCardVisibility(true)
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            onSelectOne?.(customer.id);
                          } else {
                            onDeselectOne?.(customer.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                      >
                        <Avatar src={customer.avatar}>
                          {getInitials(customer.name)}
                        </Avatar>
                        <Typography variant="subtitle2">
                          {customer.name}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      {customer.webpage}
                    </TableCell>
                    <TableCell>
                      {customer.country}
                    </TableCell>
                    <TableCell>
                      {customer.vat}
                    </TableCell>
                    <TableCell>
                      {createdAt}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {cardVisibility && selectedRowIndex !== null ? (
        // <RowDetailsCard customer={items[selectedRowIndex]} />
        <CustomersTable
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
      ) : null
      }
    </Card>
  );
};
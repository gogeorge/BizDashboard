import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Stack, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { SuppliersTable } from 'src/sections/customer/suppliers-table';

import { CompanySearch } from 'src/sections/companies/companies-search';
import { applyPagination } from 'src/utils/apply-pagination';

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

const Page = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const [supplierData, setSuppliers] = useState({});
  const [clients, setClients] = useState({});


  const { data } = props

  useEffect(() => {
    if (data.folders != undefined) {
      setClients(data.folders[1].folders)
      setSuppliers(data.folders[2].folders)
    }
  }, []);

  const fillCData = (countries) => {
    cdata=[]
    for (let i = 0; i < countries.length; i++) {
      cdata.push(countries[i])
    }
  }

  fillCData(supplierData)

  return (
    <>
      <Head>
        <title>
          Suppliers | BizDash
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Suppliers
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
            </Stack>
            <CompanySearch data={supplierData} clients={clients} />
              <SuppliersTable
              data={cdata}
              clients={clients}
              />
          </Stack>
        </Container>
        <ul>
      </ul>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

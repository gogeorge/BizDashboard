
import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { CustomersSearch } from 'src/sections/customer/customers-search';
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
  const [clientData, setClients] = useState({});
  const [projects, setProjects] = useState([{}])


  const { data } = props

  useEffect(() => {
    if (data.folders != undefined) {
      setProjects(data.folders[0].folders)
      setClients(data.folders[1].folders)
    } 
  }, []);

  const fillCData = (countries) => {
    cdata=[]
    for (let i = 0; i < countries.length; i++) {
      for (let j = 0; j < countries[i].folders.length; j++) {
        cdata.push(
          countries[i].folders[j]
        )
      }
    }
  }

  fillCData(clientData)

  return (
    <>
      <Head>
        <title>
          Clients | BizDash
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
                  Clients
                </Typography>
                <Stack
                  alignItems="center"
                  direction="row"
                  spacing={1}
                >
                </Stack>
              </Stack>
              
            </Stack>
            <CustomersSearch data={clientData} projects={projects} />
            <CustomersTable
              data={cdata}
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

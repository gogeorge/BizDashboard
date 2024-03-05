import { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ProjectTable } from 'src/sections/customer/project-table';
import { ProjectSearch } from 'src/sections/customer/project-search';
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
  const [projects, setProjects] = useState({});
  const { data } = props

  useEffect(() => {
    if (data.folders != undefined) {
      setProjects(data.folders[0].folders)
    }
  }, []);

  const fillCData = (proj) => {
    cdata=[]
    for (let i = 0; i < proj.length; i++) {
      cdata.push(proj[i])
    }
  }

  fillCData(projects)

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
    <>
      <Head>
        <title>
          Projects | BizDash
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
                  Projects
                </Typography>
              </Stack>
            </Stack>
            <ProjectSearch data={projects} lists={data}/>
            <ProjectTable
              data={cdata}
              lists={data}
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

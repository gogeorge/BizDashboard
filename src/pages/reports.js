import Head from 'next/head';
import { Box, Container, Stack, Typography } from '@mui/material';
import { ReportGen } from 'src/sections/reports/report-gen';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';

const Page = ({ data }) => (
  <>
    <Head>
      <title>
        Reports | BizDash
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Typography variant="h4">
            Reports
          </Typography>
          <ReportGen data={data}/>
        </Stack>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;

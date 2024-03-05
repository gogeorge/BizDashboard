import { useEffect, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import { Box, Container, Button, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { OverviewLatestOrders } from 'src/sections/overview/overview-latest-orders';
import { OverviewLatestProducts } from 'src/sections/overview/overview-latest-products';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { AddClient } from 'src/sections/overview/add-client';
import { AddSupplier } from 'src/sections/overview/add-supplier';
import { AddProject } from 'src/sections/overview/add-project';
import { NewClient } from 'src/sections/companies/new-client';
import { NewSupplier } from 'src/sections/companies/new-supplier';
import { NewProject } from 'src/sections/companies/new-project';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import { OverviewSearch } from 'src/sections/overview/overview-search';
import { ViewPriorities } from 'src/sections/overview/view-priorities';
import { Priorities } from 'src/sections/overview/priorities';

const now = new Date();


const Page = (props) => {
  const [addProject, setAddProject] = useState(false)
  const [addClient, setAddClient] = useState(false)
  const [addSupplier, setAddSupplier] = useState(false)
  const [viewPriorities, setViewPriorities] = useState(false)
  const [projects, setProjects] = useState([{}])
  const [clients, setClients] = useState(0)
  const [suppliers, setSuppliers] = useState([{}])
  const [priorities, setPriorities] = useState([])
  const [ongoingProjects, setOngoingProjects] = useState([])
  const [pieData, setPieData] = useState()
  const [currentYearData, setCurrentYearData] = useState()
  const [prevYearData, setPrevYearData] = useState()

  const { data } = props

  useEffect(() => {
    if (data.folders != undefined) {
      setProjects(data.folders[0].folders)
      setClients(data.folders[1].folders)
      setSuppliers(data.folders[2].folders)
      setPriorities(data.folders[0].folders.filter(obj => obj.status == "ONGOING"))
      calcPie(data.folders[0].folders)
      calcBar(data.folders[0].folders)

      const standbyProjects = data.folders[0].folders.filter(obj => obj.status == "STANDBY")
      const ongngProjects = data.folders[0].folders.filter(obj => obj.status == "ONGOING")
      const combProjects = [...standbyProjects, ...ongngProjects]
      const filteredProjects = combProjects.filter(proj => {
        const sndbyDeadline = compareDays(proj.start, "30")
        const ongngDeadline = compareDays(proj.start, "40")
        return sndbyDeadline || ongngDeadline
      })
      setOngoingProjects(filteredProjects)
    }
    
  }, []);

  const calcPie = (proj) => {
    let attributeCounts = {}

    proj.forEach(obj => {
      let attributeValue = obj.client;
      if (attributeValue in attributeCounts) {
          attributeCounts[attributeValue]++;
      } else {
          attributeCounts[attributeValue] = 1;
      }
    });

    let countArray = Object.entries(attributeCounts)
    countArray.sort((a, b) => b[1] - a[1]);    
    let top3Counts = countArray.slice(0, 3);
    setPieData(top3Counts)
  }

  const sortByMonth = (a, b) => {
    const [monthA, yearA] = a.split('/');
    const [monthB, yearB] = b.split('/');
  
    // Compare years first
    if (yearA !== yearB) {
      return yearA - yearB;
    }
  
    // If years are the same, compare months
    return monthA - monthB;
  };

  const calcBar = (proj) => {
    let attributeCountsCurrent = {
      "01/2024" : 0,
      "02/2024" : 0,
      "03/2024" : 0,
      "04/2024" : 0,
      "05/2024" : 0,
      "06/2024" : 0,
      "07/2024" : 0,
      "08/2024" : 0,
      "09/2024" : 0,
      "10/2024" : 0,
      "11/2024" : 0,
      "12/2024" : 0
    }
    let attributeCountsPrev = {
      "01/2023" : 0,
      "02/2023" : 0,
      "03/2023" : 0,
      "04/2023" : 0,
      "05/2023" : 0,
      "06/2023" : 0,
      "07/2023" : 0,
      "08/2023" : 0,
      "09/2023" : 0,
      "10/2023" : 0,
      "11/2023" : 0,
      "12/2023" : 0
    }
    const currentYear = new Date().getFullYear();
    console.log(currentYear - 1)
    proj.forEach(obj => {
      let attributeValue = obj.start.split('/')[1] + '/' + obj.start.split('/')[2]
      if (attributeValue in attributeCountsCurrent) {
        attributeCountsCurrent[attributeValue]++;
      } else if (attributeValue.split('/')[1] == currentYear) {
        attributeCountsCurrent[attributeValue] = 1;
      }

      if (attributeValue in attributeCountsPrev) {
        attributeCountsPrev[attributeValue]++;
      } else if (attributeValue.split('/')[1] == (currentYear-1)) {
        attributeCountsPrev[attributeValue] = 1;
      }
    })

    const sortedDataPrev = Object.fromEntries(
      Object.entries(attributeCountsPrev).sort(([keyA], [keyB]) => sortByMonth(keyA, keyB))
    );
    const sortedDataCurrent = Object.fromEntries(
      Object.entries(attributeCountsCurrent).sort(([keyA], [keyB]) => sortByMonth(keyA, keyB))
    );

    setPrevYearData(sortedDataPrev)
    setCurrentYearData(sortedDataCurrent)
  }


  const compareDays = (pdate, cnt) => {
    const projDate = pdate.split('/')
    const formattedDate = new Date(`${projDate[2]}-${projDate[1]}-${projDate[0]}`)

    formattedDate.setDate(formattedDate.getDate() + cnt)

    if (formattedDate > new Date()) {
      return true
    } else {
      return false
    }
  }


  return (
    <DashboardLayout>
    <Head>
      <title>
        Overview | BizDash
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
          {addClient ? (
            <NewClient onCancel={() => setAddClient(false)} clients={clients}/>
          ) : (addSupplier) ? (
            <NewSupplier onCancel={() => setAddSupplier(false)} countries={clients} suppliers={suppliers}/>
          ) : (addProject) ? (
            <NewProject 
              onCancel={() => setAddProject(false)} 
              clients={data.folders[1].folders}
              suppliers={data.folders[2].folders}
            />
          ) : (viewPriorities) ? (
            <Priorities onCancel={() => setViewPriorities(false)} projects={data.folders[0].folders} />
          ) : (
            <div>
            <OverviewSearch />
            <br/>
            <Grid
            container
            spacing={3}
          >
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <ViewPriorities
                difference={12}
                positive
                sx={{ height: '100%' }}
                value="View Priorities"
                prioCount={priorities.length}
                onClick={() => {
                  setViewPriorities(true)}}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <AddProject
                difference={12}
                positive
                sx={{ height: '100%' }}
                value="Create Project"
                pCount={projects.length}
                onClick={() => {setAddProject(true)}}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <AddClient
                difference={16}
                positive={false}
                sx={{ height: '100%' }}
                value="Add Client"
                cCount={clients.length}
                onClick={() => {setAddClient(true)}}
              />
            </Grid>
            <Grid
              xs={12}
              sm={6}
              lg={3}
            >
              <AddSupplier
                difference={12}
                positive
                sx={{ height: '100%' }}
                value="Add Supplier"
                sCount={suppliers.length}
                onClick={() => {
                  setAddSupplier(true)}}
              />
            </Grid>
            <Grid
            xs={12}
            lg={8}
          >

            {
              (currentYearData != undefined && prevYearData != undefined) && (
                <OverviewSales
                  chartSeries={[
                    {
                      name: 'This year',
                      data: [...Object.values(currentYearData)]
                    },
                    {
                      name: 'Last year',
                      data: [...Object.values(prevYearData)]
                    }
                  ]}
                  sx={{ height: '100%' }}
                />
              )
            }
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          > 
          { pieData != undefined && (
            <OverviewTraffic
            chartSeries={[
                Math.round(100 * (pieData[0][1] / (pieData[0][1] + pieData[1][1] + pieData[2][1]))), 
                Math.round(100 * (pieData[1][1] / (pieData[0][1] + pieData[1][1] + pieData[2][1]))), 
                Math.round(100 * (pieData[2][1] / (pieData[0][1] + pieData[1][1] + pieData[2][1])))
            ]}
            labels={[pieData[0][0], pieData[1][0], pieData[2][0]]}
            sx={{ height: '100%' }}
          />
          )}
          </Grid>
          <Grid
            xs={12}
            md={6}
            lg={4}
          >
            <OverviewLatestProducts
              products={ongoingProjects.map(proj => {
                  return {
                    id: proj.projectId,
                    image: '/assets/notifications/notif-icon.png',
                    name: proj.name,
                    status: proj.status,
                    updatedAt: proj.start,
                  }
              })}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            md={12}
            lg={8}
          >
            <OverviewLatestOrders
              orders={priorities.map((pri) => {
                return {
                  id: pri.projectId,
                  ref: pri.projectId,
                  amount: 30.5,
                  customer: {
                    name: pri.name
                  },
                  createdAt: pri.start,
                  status: pri.status
                }
              })}
              sx={{ height: '100%' }}
            />
          </Grid>
        </Grid>
        </div>
          )}


          
      </Container>
    </Box>
  </DashboardLayout>
  )
}

export default Page;

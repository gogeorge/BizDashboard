import { Box, Card, CardContent, Divider, Stack, Tabs, Tab, Typography, Grid, Button } from '@mui/material';
import { useState } from 'react';

export const Priorities = ({ onCancel, projects }) => {
  const [tabValue, setTabValue] = useState('QUO')

  const getDelay = (date) => {

    if (date != undefined) {
      const parts = date.split('/');
      const inputDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);


      // Calculate the difference in days
      const currentDate = new Date();
      const timeDifference = currentDate - inputDate; // Time difference in milliseconds
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert to days

      console.log(`Number of days: ${daysDifference}`);

      return daysDifference
    } else {
      return '<no start date added>'
    }

  }

  const handleTabs = (event, newValue) => {
    console.log(projects)
    setTabValue(newValue);
  };

  const interestColor = (interest) => {
    return (interest == 'High') ? 'red' : (interest == 'Medium') ? 'orange' : 'green'
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
      {/* First container */}
      <Grid item xs={6}>

      </Grid>

      {/* Second container */}
      <Grid item xs={6}>
      </Grid>
    </Grid>

      </CardContent>
      <CardContent>
            {/* Customize this section to display the details you want */}
        <Typography variant="h5">Current Projects</Typography>
        <Tabs
          value={tabValue}
          onChange={handleTabs}
          textColor="secondary"
          indicatorColor="secondary"
          aria-label="secondary tabs example"
        >
          <Tab value="CNCL" label="Cancelled" />
          <Tab value="STANDBY" label="Standby" />
          <Tab value="ONGOING" label="Ongoing" />
          <Tab value="COMPLETED" label="Completed" />
        </Tabs>
        {projects.map((p) => (
          <Card key={p.eid}>
            {(p.status == 'CNCL' && tabValue=='CNCL') ? (
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="h7" color={'grey'}>{p.projectId}</Typography>
                <br />
                <b>{p.status}</b> - <Typography variant="body" color={interestColor(p.interest)}>{p.interest}</Typography>
                <br />
                <p>This project has not been signed for {getDelay(p.start)} days</p>
              </CardContent>
            ) : (p.status == 'OC' && tabValue=='OC') ? (
              <CardContent>
                <Typography variant="h6">{p.name}</Typography>
                <Typography variant="h7" color={'grey'}>{p.projectId}</Typography>
                <br />
                <b>{p.status}</b>
                <br />
                <p>This project has not been signed for {getDelay(p.start)} days</p>
              </CardContent>
              ) : ((p.status == 'OCS' && tabValue=='OCS')) ? (
                <CardContent>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="h7" color={'grey'}>{p.projectId}</Typography>
                  <br />
                  <b>{p.status}</b>
                  <br />
                  <p>This project was signed on {p.end}</p>
                </CardContent>
              ) : (p.status == '' || p.status == 'QUO' && tabValue=='QUO') ? (
                <CardContent>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="h7" color={'grey'}>{p.projectId}</Typography>
                  <br />
                  <b>{p.status}</b> - <Typography variant="body" color={interestColor(p.interest)}>{p.interest}</Typography>
                  <br />
                  <p>This project was started on {p.start}</p>
                </CardContent>
              ) : (p.status == 'DONE' && tabValue == 'DONE') ? (
                <CardContent>
                  <Typography variant="h6">{p.name}</Typography>
                  <Typography variant="h7" color={'grey'}>{p.projectId}</Typography>
                  <br />
                  <b>{p.status}</b> - <Typography variant="body" color={interestColor(p.interest)}>{p.interest}</Typography>
                  <br />
                  <p>This project was started on {p.start}</p>
                </CardContent>
              ) : null
              }
          </Card>
        ))}
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Typography
            color="text.secondary"
            display="inline"
            variant="body1"
          >
            <Button color='secondary' onClick={onCancel}>Close</Button>
          </Typography>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body1"
          >
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

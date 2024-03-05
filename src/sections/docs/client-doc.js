import { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
  Typography
} from '@mui/material';

export const ClientDoc = () => {

  return (
    <Card>
    <CardHeader
        subheader="Creating a client"
        title="Client"
    />
    <Divider />
    <CardContent>
        <Stack
        spacing={3}
        sx={{ maxWidth: 400 }}
        >
            <Typography variant='body1'>When creating a client there are several inputs to consider. 
            Their definitions and where to acquire this information is listed below:</Typography>
            <Typography variant='body1'>
                <b>Client</b>: Name of the client <br/>
                <b>Country</b>: Clients Origin | Found in emails<br/>
                <b>Address</b>: Location | Found in email or internet <br/>
                <b>Website</b>: Website address | Found online <br/>
                <b>Contact</b>: Contact details for a representative of the client | Found in emails or online <br/>

            </Typography>
        </Stack>
    </CardContent>
    <Divider />
    <CardHeader
        subheader="Creating a supplier"
        title="Supplier"
    />
    <Divider />
    <CardContent>
        <Stack
        spacing={3}
        sx={{ maxWidth: 400 }}
        >
            <Typography variant='body1'>When creating a supplier there are several inputs to consider. 
            Their definitions and where to acquire this information is listed below:</Typography>
            <Typography variant='body1'>
                <b>Supplier</b>: Name of the supplier <br/>
                <b>Country</b>: Supplier Origin | Found in emails<br/>
                <b>Address</b>: Location | Found in email or internet <br/>
                <b>Website</b>: Website address | Found online <br/>
                <b>Contact</b>: Contact details for a representative of the supplier | Found in emails or online <br/>
            </Typography>
        </Stack>
    </CardContent>
    <CardHeader
        subheader="Creating a project"
        title="Project"
    />
    <Divider />
    <CardContent>
        <Stack
        spacing={3}
        sx={{ maxWidth: 400 }}
        >
            <Typography variant='body1'>When creating a project there are several inputs to consider. 
            Their definitions and where to acquire this information is listed below:</Typography>
            <Typography variant='body1'>
                <b>Project Name</b>: Name of the project <br/>
                <b>Client</b>: Name of the Client <br/>
                <b>Supplier(s)</b>: Name of the supplier(s) <br/>
                <b>Country</b>: Supplier Origin | Found in emails<br/>
                <b>Start Date</b>: Date of creation <br/>
                <b>End Date</b>: Completion Date <br/>
                <b>Address</b>: Location | Found in email or internet <br/>
                <b>Website</b>: Website address | Found online <br/>
                <b>Contact</b>: Contact details for a representative of the supplier | Found in emails or online <br/>
            </Typography>
        </Stack>
    </CardContent>
    </Card>
  );
};

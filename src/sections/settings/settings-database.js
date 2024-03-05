import { useCallback } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  Unstable_Grid2 as Grid
} from '@mui/material';

export const SettingsDB = ({ data }) => {
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
    },
    []
  );

  const handleDownload = () => {
    const jsonString = JSON.stringify(data, null, 2); // Convert JSON object to string

    // Create a Blob object from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element for downloading
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'data.json';
    anchor.click();

    // Revoke the URL to free up resources
    window.URL.revokeObjectURL(url);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader
          subheader="Manage Database"
          title="Databse"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={6}
            wrap="wrap"
          >
            <Grid
              xs={12}
              sm={6}
              md={4}
            >
              <Stack spacing={1}>
                <Typography variant="h6">
                  Database
                </Typography>
                Download the complete Database: <Button variant='contained' onClick={handleDownload}>Download DB</Button>
              </Stack>
            </Grid>
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
            >
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
        </CardActions>
      </Card>
    </form>
  );
};

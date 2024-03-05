import PropTypes from 'prop-types';
import { Box, Typography, Unstable_Grid2 as Grid } from '@mui/material';


export const Layout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flex: '1 1 auto'
      }}
    >
      <Grid
        container
        sx={{ flex: '1 1 auto' }}
      >
        <Grid
          xs={12}
          lg={6}
          sx={{
            backgroundColor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
          }}
        >
          {children}
        </Grid>
        <Grid
          xs={12}
          lg={6}
          sx={{
            alignItems: 'center',
            background: 'radial-gradient(50% 50% at 50% 50%, #FFFFFF 0%, #ffe9e8 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            '& img': {
              maxWidth: '100%'
            }
          }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              align="center"
              color="inherit"
              sx={{
                fontSize: '24px',
                lineHeight: '32px',
                mb: 1
              }}
              variant="h1"
            >
              <Box
                component="a"
                sx={{ color: '#15B79E' }}
                target="_blank"
              >
              </Box>
            </Typography>
            <Typography
              align="center"
              sx={{ mb: 3 }}
              variant="subtitle1"
            >

            </Typography>
            <img
              alt="text"
              src="/assets/logos/ms.png"
              style={{ width: 210*0.6, height: 212*0.6}}
              />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

Layout.prototypes = {
  children: PropTypes.node
};
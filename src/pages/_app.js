import { useState, useEffect } from 'react';
import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline, Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import CircularProgress from '@mui/material/CircularProgress';


import 'simplebar-react/dist/simplebar.min.css';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => {
  return (
  <Box
    sx={{
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress sx={{
      padding: 5,
      color: '#CB2C2C',
      position: 'relative',
      top: -10
    }}/>
    <br/><br/>
    <Typography
      variant="caption"
      component="div"
      color="text.main"
    ><b>Triangle & Co</b> <p style={{color: 'grey'}}>via BizDash</p></Typography>
  </Box>
)
};


const App = (props) => {
  const [data, setData] = useState({})

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  useEffect(() => {
    fetch("http://localhost:3001/api")
      .then((res) => {
        return res.json()
      })
      .then((d) => {
        setData(d)
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          BizDash
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      {
          data.folders != undefined ? (
            <AuthProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AuthConsumer>
                {
                  (auth) => auth.isLoading
                    ? <CircularProgress />
                    : getLayout(<Component {...pageProps} data={data} />)
                }
              </AuthConsumer>
            </ThemeProvider>
          </AuthProvider>
          ) : <SplashScreen />
      }
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App

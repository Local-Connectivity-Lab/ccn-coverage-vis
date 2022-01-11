import React, { useState, useEffect } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Fade from '@mui/material/Fade';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { homeListItems } from './ListItems';
import MapSelectionRadio, { MapType } from './MapSelectionRadio';
import DisplaySelection from './DisplaySelection';
import SiteSelect, { siteOptions } from './SiteSelect';
import MeasurementMap from './MeasurementMap';
import LineChart from './LineChart';

// import { setOptions } from 'leaflet';

const drawerWidth: number = 320;
const barHeight: number = 64;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    height: window.innerHeight,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    ...(!open && {
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: 0,
      [theme.breakpoints.up('sm')]: {
        width: 0,
      },
    }),
  },
}));

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions(),
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowDimensions;
}

const mdTheme = createTheme();

const INITIAL_DISPLAY_OPTIONS = [
  {
    label: 'Graph',
    name: 'displayGraph',
    checked: true,
  },
];

function displayValue(displayOptions: DisplayOption[], name: string) {
  for (let option of displayOptions) {
    if (option.name === name && option.checked === true) {
      return true;
    }
    return false;
  }
}

export default function App() {
  const [mapType, setMapType] = useState<MapType>('ping');
  const [selectedSites, setSelectedSites] =
    useState<SidebarOption[]>(siteOptions);
  const [displayOptions, setDisplayOptions] = useState<DisplayOption[]>(
    INITIAL_DISPLAY_OPTIONS,
  );
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingLine, setLoadingLine] = useState(true);
  const [open, setOpen] = React.useState(true);
  const { height, width } = useWindowDimensions();

  document.title = 'Performance Evaluation';
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex', overflowY: 'hidden', overflowX: 'hidden' }}>
        <CssBaseline />
        <AppBar position='absolute' open={open}>
          <Toolbar
            sx={{
              pr: '0px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge='start'
              color='inherit'
              aria-label='open drawer'
              onClick={toggleDrawer}
              sx={{
                marginRight: '0px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component='h1'
              variant='h6'
              color='inherit'
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Performance Evaluation
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant='permanent' open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <Container>
            <MapSelectionRadio
              mapType={mapType}
              setMapType={setMapType}
              loading={loadingLine || loadingMap}
            />
            <SiteSelect
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              loading={loadingLine || loadingMap}
            />
            <DisplaySelection
              displayOptions={displayOptions}
              setDisplayOptions={setDisplayOptions}
              loading={loadingLine || loadingMap}
            />
          </Container>
          <Divider />
          <Container>
            <List>{homeListItems}</List>
          </Container>
        </Drawer>
        <MeasurementMap
          mapType={mapType}
          selectedSites={selectedSites}
          setLoading={setLoadingMap}
          width={width}
          height={height - barHeight}
          loading={loadingMap}
        />
      </Box>
      <Box
        component='main'
        sx={{
          backgroundColor: 'transparent',
          overflow: 'none',
          position: 'absolute',
          right: '50px',
          bottom: '50px',
          zIndex: '3',
        }}
      >
        <Fade in={displayValue(displayOptions, 'displayGraph')}>
          <Card>
            <LineChart
              mapType={mapType}
              offset={0}
              width={600}
              height={200}
              selectedSites={selectedSites}
              setLoading={setLoadingLine}
              loading={loadingLine}
            />
          </Card>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}

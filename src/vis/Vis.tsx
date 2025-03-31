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
import Visibility from '@mui/icons-material/Visibility';
import { homeListItems } from '../ListItems';
import MapSelectionRadio, { MapType } from './MapSelectionRadio';
import DisplaySelection from './DisplaySelection';
import SiteSelect from './SiteSelect';
import DeviceSelect from './DeviceSelect';
import DateSelect from './DateSelect';
import MeasurementMap from './MeasurementMap';
import LineChart from './LineChart';
import { UNITS, MAP_TYPE_CONVERT } from '../utils/measurementMapUtils';
import { solveDisplayOptions } from './DisplaySelection';
import { apiClient } from '@/utils/fetch';

// import { setOptions } from 'leaflet';

const drawerWidth: number = 320;
const maxChartWidth: number = 400;

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
    label: 'Chart',
    name: 'displayGraph',
    checked: true,
  },
  {
    label: 'Data Overlay',
    name: 'displayOverlayData',
    checked: true,
  },
];

function displayValue(displayOptions: DisplayOption[], name: string) {
  for (let option of displayOptions) {
    if (option.name === name && option.checked === true) {
      return true;
    }
  }
  return false;
}

export default function Vis() {
  const [mapType, setMapType] = useState<MapType>('dbm');
  const [sites, setSites] = useState<Site[]>([]);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [siteOptions, setSiteOptions] = useState<SiteOption[]>([]);
  const [selectedSites, setSelectedSites] = useState<SiteOption[]>(siteOptions);
  const [selectedDevices, setSelectedDevices] = useState<DeviceOption[]>([]);
  const [timeFrom, setTimeFrom] = useState<Date>(
    new Date('2021-09-01T00:00:00'),
  );
  const [timeTo, setTimeTo] = useState<Date>(new Date());
  const [displayOptions, setDisplayOptions] = useState<DisplayOption[]>(
    INITIAL_DISPLAY_OPTIONS,
  );

  const [overlayData, setOverlayData] = useState<number>(0);
  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await apiClient.GET('/api/sites');
        if (!data || error) {
          console.log(`Cannot fetch site info: ${error}`);
          return;
        }

        const siteOptions = data.map(({ name, status }) => ({
          label: name,
          value: name,
          status: status,
        }));
        setSites(data);
        setSiteOptions(siteOptions);
        setSelectedSites(siteOptions);
      } catch (error) {
        console.error(`Error while fetching site data: ${error}`);
        return;
      }
    })();
  }, []);
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingLine, setLoadingLine] = useState(true);
  const { height, width } = useWindowDimensions();
  const chartWidth: number = Math.min(width * 0.9 - 50, maxChartWidth);
  const chartHeight: number = 0.42 * chartWidth;
  var drawerOpen: boolean = true;
  var barHeight: number = 64;
  if (width < 600) {
    drawerOpen = false;
    barHeight = 52;
  }
  const [open, setOpen] = React.useState(drawerOpen);

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
              loading={loadingMap}
            />
            <DisplaySelection
              displayOptions={displayOptions}
              setDisplayOptions={setDisplayOptions}
              loading={false}
            />
            <DateSelect
              timeFrom={timeFrom}
              timeTo={timeTo}
              setTimeFrom={setTimeFrom}
              setTimeTo={setTimeTo}
              loading={false}
            />
            <SiteSelect
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              loading={loadingLine || loadingMap}
              allSites={sites}
            />
            {/* <DeviceSelect
              selectedDevices={selectedDevices}
              setSelectedDevices={setSelectedDevices}
              loading={loadingLine || loadingMap}
            /> */}
          </Container>
          <Divider />
          <Container>
            <List>{homeListItems}</List>
          </Container>
        </Drawer>
        <MeasurementMap
          mapType={mapType}
          selectedSites={selectedSites}
          selectedDevices={selectedDevices}
          setLoading={setLoadingMap}
          width={width}
          height={height - barHeight}
          loading={loadingMap}
          top={barHeight}
          allSites={sites}
          cells={selectedCells}
          setCells={setSelectedCells}
          overlayData={overlayData}
          setOverlayData={setOverlayData}
          timeFrom={timeFrom}
          timeTo={timeTo}
        />
      </Box>
      <Box
        component='main'
        sx={{
          backgroundColor: 'transparent',
          overflow: 'none',
          position: 'absolute',
          right: '8px',
          bottom: '20px',
          zIndex: '3',
        }}
      >
        <Fade
          mountOnEnter
          unmountOnExit
          in={displayValue(displayOptions, 'displayGraph')}
        >
          <Card>
            <LineChart
              mapType={mapType}
              offset={0}
              width={chartWidth}
              height={chartHeight}
              selectedSites={selectedSites}
              setLoading={setLoadingLine}
              loading={loadingLine || loadingMap}
              allSites={sites}
              timeFrom={timeFrom}
              timeTo={timeTo}
              setDisplayOptions={setDisplayOptions}
              displayOptions={displayOptions}
            />
          </Card>
        </Fade>
      </Box>

      <Box
        // new box
        component='main'
        sx={{
          backgroundColor: 'transparent',
          overflow: 'none',
          position: 'absolute',
          right: '8px',
          bottom:
            20 +
            (displayValue(displayOptions, 'displayGraph')
              ? chartHeight + 10
              : 0),
          zIndex: '4',
        }}
      >
        <IconButton
          onClick={() => {
            setDisplayOptions(
              solveDisplayOptions(displayOptions, 'displayGraph', true),
            );
          }}
        >
          <Visibility></Visibility>
        </IconButton>
      </Box>
      <Box
        component='main'
        sx={{
          backgroundColor: 'transparent',
          overflow: 'none',
          position: 'absolute',
          right: '8px',
          bottom:
            20 +
            (displayValue(displayOptions, 'displayGraph')
              ? chartHeight + 10
              : +50),
          zIndex: '5',
        }}
      >
        <Fade
          mountOnEnter
          unmountOnExit
          in={displayValue(displayOptions, 'displayOverlayData')}
        >
          <Card sx={{ px: 2, py: 1 }}>
            <Typography align='right' variant='body1' component='div'>
              Average {MAP_TYPE_CONVERT[mapType]}
            </Typography>
            <Typography align='right' variant='h6' component='div'>
              {overlayData
                ? overlayData.toFixed(2) + ' ' + UNITS[mapType]
                : 'Please select the area'}
            </Typography>
          </Card>
        </Fade>
      </Box>
    </ThemeProvider>
  );
}

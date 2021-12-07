import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box'
import MapSelectionRadio, { MapType } from './MapSelectionRadio';
import Navbar from './Navbar';
import SiteSelect from './SiteSelect';
import MeasurementMap from './MeasurementMap';
import 'fontsource-roboto';
import './index.css';
import LineChart from './LineChart';

function App() {
  const [mapType, setMapType] = useState<MapType>('ping');
  const [selectedSites, setSelectedSites] = useState<SidebarOption[]>([]);
  const [loadingMap, setLoadingMap] = useState(true);
  const [loadingLine, setLoadingLine] = useState(true);

  document.title = 'Performance Evaluation';
  return (
    <div className='App'>
      <Navbar />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <SiteSelect
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              loading={loadingLine || loadingMap}
            />
            <MapSelectionRadio
              mapType={mapType}
              setMapType={setMapType}
              loading={loadingLine || loadingMap}
            />
          </Grid>
          <Grid item xs={9}>
            <MeasurementMap
              mapType={mapType}
              selectedSites={selectedSites}
              setLoading={setLoadingMap}
              width={910}
              height={500}
              loading={loadingMap}
            />
            <LineChart
              mapType={mapType}
              offset={500}
              width={910}
              height={200}
              selectedSites={selectedSites}
              setLoading={setLoadingLine}
              loading={loadingLine}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

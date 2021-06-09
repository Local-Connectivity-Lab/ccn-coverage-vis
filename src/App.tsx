import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MapSelectionRadio, { MapType } from './MapSelectionRadio';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MeasurementMap from './MeasurementMap';
import 'fontsource-roboto';
import './index.css';
import LineChart from './LineChart';

function App() {
  const [mapType, setMapType] = useState<MapType>('ping');
  const [selectedSites, setSelectedSites] = useState<SidebarOption[]>([]);
  const [loading, setLoading] = useState(true);

  document.title = 'Performance Evaluation';
  return (
    <div className='App'>
      <Navbar />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Sidebar
              selectedSites={selectedSites}
              setSelectedSites={setSelectedSites}
              loading={loading}
            />
          </Grid>
          <Grid item xs={9}>
            <MapSelectionRadio
              mapType={mapType}
              setMapType={setMapType}
              loading={loading}
            />
            <MeasurementMap
              mapType={mapType}
              selectedSites={selectedSites}
              setLoading={setLoading}
              width={910}
              height={500}
            />
            <LineChart
              mapType={mapType}
              offset={500}
              width={910}
              height={200}
              selectedSites={selectedSites}
            />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

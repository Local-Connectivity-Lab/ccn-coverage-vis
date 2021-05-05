import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MapSelectionRadio, { MapType } from './MapSelectionRadio';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Map from './Map';
import 'fontsource-roboto';
import './index.css';

function App() {
  const [mapType, setMapType] = React.useState<MapType>('ping');

  document.title = 'Performance Evaluation';
  return (
    <div className='App'>
      <Navbar />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <Sidebar />
          </Grid>
          <Grid item xs={9}>
            <MapSelectionRadio mapType={mapType} setMapType={setMapType} />
            <Map mapType={mapType} />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

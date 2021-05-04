import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import MapSelectionRadio from './MapSelectionRadio';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Map from './Map';
import 'fontsource-roboto';
import './index.css';

function App() {
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
            <MapSelectionRadio />
            <Map />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default App;

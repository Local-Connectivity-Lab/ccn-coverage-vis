import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import './App.css';
import MapSelectionRadio from './MapSelectionRadio';
import 'fontsource-roboto';
class App extends React.Component<{}, {}> {
  useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
      },
    }),
  );
  render() {
    return (
      <div className='App'>
        <Container>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <h1>Sidebar</h1>
            </Grid>
            <Grid item xs={9}>
              <MapSelectionRadio />
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default App;

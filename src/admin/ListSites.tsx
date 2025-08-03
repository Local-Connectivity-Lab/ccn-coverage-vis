import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Fab,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { apiClient } from '@/utils/fetch';
import { components } from '@/types/api';

const parseSitesFromJSON = (jsonString: string): components['schemas']['Site'][] => {
  try {
    const parsed = JSON.parse(jsonString);

    if (!Array.isArray(parsed.sites)) {
      throw new Error("Invalid format: 'sites' should be an array");
    }

    const sites: components['schemas']['Site'][] = parsed.sites.map((site: any): components['schemas']['Site'] => {
      return {
        name: site.name,
        latitude: site.latitude,
        longitude: site.longitude,
        status: site.status,
        address: site.address,
        cell_id: site.cell_id,
        color: site.color,
        boundary: site.boundary?.map((point: any) => [point.lat, point.lng] as [number, number]) ?? undefined,
      };
    });

    return sites;
  } catch (error) {
    console.error('Failed to parse sites JSON:', error);
    return [];
  }
};

export default function ListSites() {
  const [sites, setSites] = useState<components['schemas']['Site'][]>([]);
  const handleEdit = (siteName: string) => {
    console.log(`Edit site with ID: ${siteName}`);
    window.open('/admin/create-edit-site', '_self');
  };

  const handleDelete = (siteName: string) => {
    const site = sites.find(s => s.name === siteName);
    if (site) {
      deleteSite(site);
      reloadSites();
    }
  };

  const handleAdd = () => {
    console.log('Add new site');
    window.open('/admin/create-edit-site', '_self')
  };

  const reloadSites = () => {
    apiClient
      .GET('/api/public-sites')
      .then(res => {
        const { data, error } = res;
        if (error || !data) {
          console.log(`Unable to query sites: ${error}`);
          return;
        }
        setSites(parseSitesFromJSON(JSON.stringify(data)));
      })
      .catch(err => {
        return <div></div>;
      });
  };
  useEffect(() => {
    reloadSites();
  });

  const deleteSite = (site: components['schemas']['Site']) => {
    apiClient.DELETE('/api/secure-site', {
      body: site
    }).then(res => {
      const { data, error } = res;
      if (error) {
        console.error(`Failed to delete site: ${error}`);
        return;
      }
      console.log(`Successfully deleted site: ${site.name}`);
      reloadSites();
    }).catch(err => {
      console.error(`Error deleting site: ${err}`);
    });
  };

  const editSite = (site: components['schemas']['Site']) => {
    apiClient.PUT('/api/secure-site', {
      body: site
    }).then(res => {
      const { data, error } = res;
      if (error) {
        console.error(`Failed to edit site: ${error}`);
        return;
      }
      console.log(`Successfully edited site: ${site.name}`);
      reloadSites();
    }).catch(err => {
      console.error(`Error editing site: ${err}`);
    });
  };

  const createSite = (site: components['schemas']['Site']) => {
    apiClient.POST('/api/secure-site', {
      body: site
    }).then(res => {
      const { data, error } = res;
      if (error) {
        console.error(`Failed to create site: ${error}`);
        return;
      }
      console.log(`Successfully created site: ${site.name}`);
      reloadSites();
    }).catch(err => {
      console.error(`Error creating site: ${err}`);
    });
  }
  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant='h4' component='h1' gutterBottom>
          Site Management
        </Typography>

        <List>
          {sites.map(site => (
            <ListItem
              key={site.name}
              sx={{
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                mb: 2,
                bgcolor: 'background.paper',
              }}
            >
              <ListItemText
                primary={
                  <Typography variant='h6' component='div'>
                    {site.name}
                  </Typography>
                }
                sx={{ flexGrow: 1 }}
              />
              <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                <Button
                  variant='contained'
                  color='warning'
                  onClick={() => handleEdit(site.name)}
                  sx={{
                    backgroundColor: '#d4af37',
                    color: 'black',
                    '&:hover': {
                      backgroundColor: '#b8941f',
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => handleDelete(site.name)}
                  sx={{
                    backgroundColor: '#d32f2f',
                    '&:hover': {
                      backgroundColor: '#b71c1c',
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>
      <Fab
        color='primary'
        aria-label='add'
        onClick={handleAdd}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          backgroundColor: '#4caf50',
          '&:hover': {
            backgroundColor: '#388e3c',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
}

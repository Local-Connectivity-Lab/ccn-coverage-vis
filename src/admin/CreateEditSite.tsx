import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import ColorPicker from 'react-pick-color';
import { apiClient } from '@/utils/fetch';
import { siteToSchema } from '@/utils/siteUtils';

interface CellEntry {
  id: string;
  cellId: string;
}

interface BoundaryPoint {
  id: string;
  lat: string;
  lng: string;
}

interface CreateEditSiteProps {
  mode: 'create' | 'edit';
}

export default function CreateEditSite({ mode }: CreateEditSiteProps) {
  const [name, setName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [cells, setCells] = useState<CellEntry[]>([]);
  const [colorEnabled, setColorEnabled] = useState(true);
  const [colorValue, setColorValue] = useState('#fff');
  const [boundaryEnabled, setBoundaryEnabled] = useState(true);
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>([]);

  const editSite = (site: Site) => {
    apiClient
      .PUT('/api/secure-site', {
        body: siteToSchema(site),
      })
      .then(res => {
        const { data, error } = res;
        if (error) {
          console.error(`Failed to edit site: ${error}`);
          return;
        }
        console.log(`Successfully edited site: ${site.name}`);
      })
      .catch(err => {
        console.error(`Error editing site: ${err}`);
      });
  };

  const createSite = (site: Site) => {
    apiClient
      .POST('/api/secure-site', {
        body: siteToSchema(site),
      })
      .then(res => {
        const { data, error } = res;
        if (error) {
          console.error(`Failed to create site: ${error}`);
          return;
        }
        console.log(`Successfully created site: ${site.name}`);
      })
      .catch(err => {
        console.error(`Error creating site: ${err}`);
      });
  };

  const handleBack = () => {
    console.log('Navigate back');
    window.open('/admin/list-sites', '_self');
  };

  const handleSave = () => {
    console.log('Save site');
    if (validateSite()) {
      const site: Site = {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        status: status as SiteStatus,
        address,
        cell_id: cells.map(cell => cell.cellId),
        color: colorEnabled ? colorValue : undefined,
        boundary: boundaryEnabled
          ? boundaryPoints.map(point => [
              parseFloat(point.lat),
              parseFloat(point.lng),
            ])
          : undefined,
      };
      if (mode === 'edit') {
        editSite(site);
      } else {
        createSite(site);
      }
    }
  };

  const addCell = () => {
    const newCell: CellEntry = {
      id: Date.now().toString(),
      cellId: '',
    };
    setCells([...cells, newCell]);
  };

  const deleteCell = (id: string) => {
    setCells(cells.filter(cell => cell.id !== id));
  };

  const updateCellId = (id: string, cellId: string) => {
    setCells(cells.map(cell => (cell.id === id ? { ...cell, cellId } : cell)));
  };

  const addBoundaryPoint = () => {
    const newPoint: BoundaryPoint = {
      id: Date.now().toString(),
      lat: '',
      lng: '',
    };
    setBoundaryPoints([...boundaryPoints, newPoint]);
  };

  const deleteBoundaryPoint = (id: string) => {
    setBoundaryPoints(boundaryPoints.filter(point => point.id !== id));
  };

  const updateBoundaryPoint = (
    id: string,
    field: 'lat' | 'lng',
    value: string,
  ) => {
    setBoundaryPoints(
      boundaryPoints.map(point =>
        point.id === id ? { ...point, [field]: value } : point,
      ),
    );
  };

  const validateSite = (): boolean => {
    if (name === '') {
      alert('Name is required');
      return false;
    }
    if (longitude === '' || isNaN(Number(longitude))) {
      alert('Valid Longitude is required');
      return false;
    }
    if (latitude === '' || isNaN(Number(latitude))) {
      alert('Valid Latitude is required');
      return false;
    }
    if (status === '') {
      alert('Status is required');
      return false;
    }
    if (address === '') {
      alert('Address is required');
      return false;
    }
    if (cells.length === 0) {
      alert('At least one Cell ID is required');
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (mode === 'edit') {
      const urlParams = new URLSearchParams(window.location.search);
      const siteParam = urlParams.get('site');
      if (siteParam) {
        try {
          const siteData = JSON.parse(decodeURIComponent(siteParam));
          setName(siteData.name);
          setLatitude(siteData.latitude.toString());
          setLongitude(siteData.longitude.toString());
          setStatus(siteData.status);
          setAddress(siteData.address);
          setCells(
            siteData.cell_id.map((cellId: string) => ({
              id: Date.now().toString() + cellId,
              cellId: cellId,
            })),
          );
          if (siteData.color) {
            setColorEnabled(true);
            setColorValue(siteData.color);
          }
          if (siteData.boundary) {
            setBoundaryEnabled(true);
            setBoundaryPoints(
              siteData.boundary
                .filter(
                  (point: [number, number]) =>
                    point && point[0] !== null && point[1] !== null,
                )
                .map((point: [number, number], index: number) => ({
                  id: Date.now().toString() + index,
                  lat: point[0].toString(),
                  lng: point[1].toString(),
                })),
            );
          }
        } catch (error) {
          console.error('Failed to parse site data from URL:', error);
        }
      }
    }
  }, [mode]);

  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Button
            variant='contained'
            onClick={handleSave}
            sx={{
              backgroundColor: '#4caf50',
              '&:hover': {
                backgroundColor: '#388e3c',
              },
            }}
          >
            Save
          </Button>
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label='Name'
            value={name}
            onChange={e => setName(e.target.value)}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label='Longitude'
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
            <TextField
              fullWidth
              label='Latitude'
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={e => setStatus(e.target.value)}
              label='Status'
            >
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='confirmed'>Confirmed</MenuItem>
              <MenuItem value='in-conversation'>In Conversation</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label='Address'
            value={address}
            onChange={e => setAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant='h6' sx={{ mr: 2 }}>
              Cells
            </Typography>
            <IconButton
              onClick={addCell}
              sx={{
                backgroundColor: '#4caf50',
                color: 'white',
                width: 24,
                height: 24,
                '&:hover': {
                  backgroundColor: '#388e3c',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {cells.map(cell => (
            <Box
              key={cell.id}
              sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}
            >
              <Typography variant='body2' sx={{ minWidth: 60 }}>
                Cell ID
              </Typography>
              <TextField
                size='small'
                value={cell.cellId}
                onChange={e => updateCellId(cell.id, e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant='contained'
                color='error'
                onClick={() => deleteCell(cell.id)}
                sx={{
                  backgroundColor: '#d32f2f',
                  minWidth: 80,
                  '&:hover': {
                    backgroundColor: '#b71c1c',
                  },
                }}
              >
                Delete
              </Button>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={colorEnabled}
                onChange={e => setColorEnabled(e.target.checked)}
              />
            }
            label='Color'
          />
          {colorEnabled && (
            <ColorPicker
              color={colorValue}
              onChange={color => setColorValue(color.hex)}
            />
          )}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={boundaryEnabled}
                  onChange={e => setBoundaryEnabled(e.target.checked)}
                />
              }
              label='Boundary'
            />
            {boundaryEnabled && (
              <IconButton
                onClick={addBoundaryPoint}
                sx={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  width: 24,
                  height: 24,
                  ml: 2,
                  '&:hover': {
                    backgroundColor: '#388e3c',
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>

          {boundaryEnabled &&
            boundaryPoints.map(point => (
              <Box
                key={point.id}
                sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}
              >
                <Typography variant='body2' sx={{ minWidth: 80 }}>
                  (Lat, Long)
                </Typography>
                <TextField
                  size='small'
                  placeholder='Lat'
                  value={point.lat}
                  onChange={e =>
                    updateBoundaryPoint(point.id, 'lat', e.target.value)
                  }
                  sx={{ flexGrow: 1 }}
                />
                <TextField
                  size='small'
                  placeholder='Long'
                  value={point.lng}
                  onChange={e =>
                    updateBoundaryPoint(point.id, 'lng', e.target.value)
                  }
                  sx={{ flexGrow: 1 }}
                />
                <Button
                  variant='contained'
                  color='error'
                  onClick={() => deleteBoundaryPoint(point.id)}
                  sx={{
                    backgroundColor: '#d32f2f',
                    minWidth: 80,
                    '&:hover': {
                      backgroundColor: '#b71c1c',
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>
            ))}
        </Box>
      </Paper>
    </Container>
  );
}

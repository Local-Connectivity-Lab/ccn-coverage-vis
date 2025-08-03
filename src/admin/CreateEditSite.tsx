import React, { useState } from 'react';
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

interface CellEntry {
  id: string;
  cellId: string;
}

interface BoundaryPoint {
  id: string;
  lat: string;
  lng: string;
}

export default function CreateEditSite() {
  const [name, setName] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [status, setStatus] = useState('');
  const [address, setAddress] = useState('');
  const [cells, setCells] = useState<CellEntry[]>([]);
  const [colorEnabled, setColorEnabled] = useState(true);
  const [colorValue, setColorValue] = useState('');
  const [boundaryEnabled, setBoundaryEnabled] = useState(true);
  const [boundaryPoints, setBoundaryPoints] = useState<BoundaryPoint[]>([]);

  const handleBack = () => {
    console.log('Navigate back');
    window.open('/admin/list-sites', '_self');
  };

  const handleSave = () => {
    console.log('Save site');
  };

  const addCell = () => {
    const newCell: CellEntry = {
      id: Date.now().toString(),
      cellId: ''
    };
    setCells([...cells, newCell]);
  };

  const deleteCell = (id: string) => {
    setCells(cells.filter(cell => cell.id !== id));
  };

  const updateCellId = (id: string, cellId: string) => {
    setCells(cells.map(cell => cell.id === id ? { ...cell, cellId } : cell));
  };

  const addBoundaryPoint = () => {
    const newPoint: BoundaryPoint = {
      id: Date.now().toString(),
      lat: '',
      lng: ''
    };
    setBoundaryPoints([...boundaryPoints, newPoint]);
  };

  const deleteBoundaryPoint = (id: string) => {
    setBoundaryPoints(boundaryPoints.filter(point => point.id !== id));
  };

  const updateBoundaryPoint = (id: string, field: 'lat' | 'lng', value: string) => {
    setBoundaryPoints(boundaryPoints.map(point => 
      point.id === id ? { ...point, [field]: value } : point
    ));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Button
            variant="contained"
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
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
            />
            <TextField
              fullWidth
              label="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
            />
          </Box>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>Cells</Typography>
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

          {cells.map((cell) => (
            <Box key={cell.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
              <Typography variant="body2" sx={{ minWidth: 60 }}>Cell ID</Typography>
              <TextField
                size="small"
                value={cell.cellId}
                onChange={(e) => updateCellId(cell.id, e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                color="error"
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
                onChange={(e) => setColorEnabled(e.target.checked)}
              />
            }
            label="Color"
          />
          {colorEnabled && (
            <TextField
              fullWidth
              value={colorValue}
              onChange={(e) => setColorValue(e.target.value)}
              sx={{ mt: 1 }}
            />
          )}
        </Box>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={boundaryEnabled}
                  onChange={(e) => setBoundaryEnabled(e.target.checked)}
                />
              }
              label="Boundary"
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

          {boundaryEnabled && boundaryPoints.map((point) => (
            <Box key={point.id} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
              <Typography variant="body2" sx={{ minWidth: 80 }}>(Lat, Long)</Typography>
              <TextField
                size="small"
                placeholder="Lat"
                value={point.lat}
                onChange={(e) => updateBoundaryPoint(point.id, 'lat', e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                size="small"
                placeholder="Long"
                value={point.lng}
                onChange={(e) => updateBoundaryPoint(point.id, 'lng', e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button
                variant="contained"
                color="error"
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

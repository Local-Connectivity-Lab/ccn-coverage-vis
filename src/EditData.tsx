import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Loading from './Loading';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import axios from 'axios';
import { API_URL } from './utils/config'
import './utils/fonts.css';
var newSites = "";
export default function EditData() {
  return (
    <h1>EDIT DATA</h1>
  )
}
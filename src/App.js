import React, { useState, useEffect } from 'react';
import './App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    numbers: false,
    alphabets: false,
    highest_lowercase_alphabet: false,
  });

  const handleSubmit = async () => {
    try {
      const parsedInput = JSON.parse(jsonInput);
      const res = await fetch('https://backend-bajaj-4teq.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedInput),
      });
      const data = await res.json();
      setResponse(data);
      setError('');
    } catch (err) {
      setError('Invalid JSON input.');
    }
  };

  const handleFilterChange = (event) => {
    setFilter({ ...filter, [event.target.name]: event.target.checked });
  };

  const renderResponse = () => {
    if (!response) return null;
    const filteredResponse = {};
    Object.keys(filter).forEach((key) => {
      if (filter[key]) {
        filteredResponse[key] = response[key];
      }
    });
    return (
      <Box sx={{ mt: 2 }}>
        {Object.entries(filteredResponse).map(([key, value]) => (
          <Typography key={key} variant="body1">
            {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}: {Array.isArray(value) ? value.join(', ') : value}
          </Typography>
        ))}
      </Box>
    );
  };

  useEffect(() => {
    document.title = "21BIT0299";
  }, []);

  return (
    <Container maxWidth="sm" className="App">
      <Paper elevation={3} sx={{ p: 3, width: '100%', mb: 3 }}>
        <TextField
          fullWidth
          label="API Input"
          variant="outlined"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          helperText={error}
          error={!!error}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
          sx={{ mb: 2 }}
        >
          Submit
        </Button>
        {response && (
          <>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Multi Filter
              </Typography>
              <FormControl component="fieldset" fullWidth>
                <FormGroup>
                  {Object.keys(filter).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={filter[key]}
                          onChange={handleFilterChange}
                          name={key}
                        />
                      }
                      label={key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filtered Response
              </Typography>
              {renderResponse()}
            </Paper>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default App;
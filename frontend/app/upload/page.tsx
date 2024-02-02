"use client"
import {useState} from 'react';
import UploadResume from "./UploadResume";
import EnterJobDes from "./EnterJobDes";
import { Container, Grid, Button, Snackbar, Alert } from "@mui/material";
import { uploadFiles } from "../api/api";

const UploadPage = () => {
    const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            selectedFiles.forEach(file => formData.append('files', file));
            const response = await uploadFiles(formData);
            console.log(response);
            // Set message for successful submission
            setSnackbarMessage('Successfully submitted!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

        }
        catch (err) {
            console.error(err);
            setSnackbarMessage('Error submitting data.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);

        }
    }

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    return (
    <Container sx={{ mt: 4, height:"100vh" }}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <UploadResume selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
            </Grid>
            <Grid item xs={6}>
                <EnterJobDes />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" component="label" fullWidth disabled={!selectedFiles.length} onClick={handleSubmit} sx={{mt: 3}}>
                    Submit
                </Button>
            </Grid>
        </Grid>
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>

    </Container>
  );
};

export default UploadPage;

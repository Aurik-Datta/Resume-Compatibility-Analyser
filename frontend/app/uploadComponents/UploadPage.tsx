"use client"
import {useState} from 'react';
import UploadResume from "./UploadResume";
import EnterJobDes from "./EnterJobDes";
import RankedResumes from './RankedResumes';
import { Container, Grid, Button, Snackbar, Alert } from "@mui/material";
import { analyseCompatibility, CompatibilityListElement } from "../api/api";

const UploadPage = () => {
    const [jobDes, setJobDes] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
    const [compatibilityList, setCompatibilityList] = useState<Array<CompatibilityListElement>>([]); // [{file: File, compatibility: number, compat_skills: Array<string>}]
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleSubmit = async () => {
        if (!selectedFiles.length) {
            setSnackbarMessage('Please select at least one file.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (!jobDes) {
            setSnackbarMessage('Please enter a job description.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        // if there are duplicate files, error
        const fileNames = selectedFiles.map(file => file.name);
        const uniqueFileNames = new Set(fileNames);
        if (uniqueFileNames.size !== fileNames.length) {
            setSnackbarMessage('Please select unique files.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        try {
            const response = await analyseCompatibility(selectedFiles, jobDes);
            console.log(response);
            // sort by score and set state
            const sortedList = response.sort((a: CompatibilityListElement, b: CompatibilityListElement) => b.compatibility - a.compatibility);
            setCompatibilityList(sortedList);
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
    <Container sx={{ mt: 4, minHeight:"100vh" }}>
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <UploadResume selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} />
            </Grid>
            <Grid item xs={6}>
                <EnterJobDes
                    jobDes={jobDes}
                    setJobDes={setJobDes}
                />
            </Grid>
            <Grid item xs={12} sx={{textAlign: 'center'}}>
                <Button variant="contained" color="primary" component="label"  disabled={!selectedFiles.length} onClick={handleSubmit} sx={{mt: 3, pl:5, pr: 5, borderRadius:25}}>
                    Submit
                </Button>
            </Grid>
            <Grid item xs={12}>
                <div hidden={!compatibilityList.length}>
                    <RankedResumes compatibilityList={compatibilityList} />
                </div>
                
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
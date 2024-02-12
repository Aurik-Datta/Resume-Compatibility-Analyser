"use client"
import {useState} from 'react';
import UploadResume from "./UploadResume";
import EnterJobDes from "./EnterJobDes";
import RankedResumes from './RankedResumes';
import HOneFooter from '../components/HOneFooter';
import { Container, Grid, Button, Snackbar, Alert, Box, Backdrop, CircularProgress } from "@mui/material";
import { analyseCompatibility } from "../api/api";
import {CompatibilityListElement, JobDesSkill} from "../utils";

const UploadPage = () => {
    const [reqJobDes, setReqJobDes] = useState<string>('');
    const [prefJobDes, setPrefJobDes] = useState<string>('');
    const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);
    const [sortedList, setSortedList] = useState<Array<CompatibilityListElement>>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [jobDesSkillList, setJobDesSkillList] = useState<Array<JobDesSkill>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [plainTextMode, setPlainTextMode] = useState<boolean>(false);

    const LoadingScreen = () => {
        return (
              <Backdrop
                sx={{ color: '#164296', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading}
              >
                <CircularProgress color="inherit" />
              </Backdrop>
          );
        
    }
    const handleSubmit = async () => {
        if (!selectedFiles.length) {
            setSnackbarMessage('Please select at least one file.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }
        if (!reqJobDes && !prefJobDes) {
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
            setIsLoading(true);
            const response = await analyseCompatibility(selectedFiles, reqJobDes, prefJobDes);
            console.log(response);
            // sort by score and set state
            const sorted = response.sort((a: CompatibilityListElement, b: CompatibilityListElement) => b.compatibility - a.compatibility);
            setSortedList(sorted);
            setJobDesSkillList(response ? response[0].jobDes_skills : []);
            // Set message for successful submission
            setSnackbarMessage('Analysis succesfiul!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

        }
        catch (err) {
            console.error(err);
            setSnackbarMessage('Error submitting data.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);

        }
        setIsLoading(false);
    }

    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    return (
    <Box display="flex" flexDirection="column" minHeight="100vh"> {/* Flex container */}
        <Container sx={{ mt: 4, flex: '1 0 auto' }}> {/* Content container */}
        <Grid container spacing={2}>
            <Grid item xs={6} sx={{paddingRight:"16px"}}>
                <UploadResume selectedFiles={selectedFiles} setSelectedFiles={setSelectedFiles} plainTextMode={plainTextMode} />
            </Grid>
            <Grid item xs={6} sx={{paddingRight:"16px"}}>
                <EnterJobDes
                    prefJobDes={prefJobDes}
                    setPrefJobDes={setPrefJobDes}
                    reqJobDes={reqJobDes}
                    setReqJobDes={setReqJobDes}
                    plainTextMode={plainTextMode}
                    setPlainTextMode={setPlainTextMode}
                />
            </Grid>
            <Grid item xs={12} sx={{textAlign: 'center'}}>
                <Button fullWidth variant="contained" color="primary" component="label"  disabled={!selectedFiles.length} onClick={handleSubmit} sx={{mt: 3, pl:5, pr: 5, borderRadius:25}}>
                    Submit
                </Button>
            </Grid>
            <Grid item xs={12}>
                <div hidden={!sortedList.length}>
                    <RankedResumes sortedList={sortedList} setSortedList={setSortedList} jobDesSkillList={jobDesSkillList} />
                </div>
                
            </Grid>
        </Grid>
        {/* Snackbar for error/success messages */}
        <Snackbar open={snackbarOpen} autoHideDuration={2000} onClose={handleCloseSnackbar}>
            <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
        <LoadingScreen />

        </Container>
        <HOneFooter />
    </Box>
  );
};

export default UploadPage;

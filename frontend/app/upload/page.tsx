"use client"
// app/upload/page.tsx
import React, {useState} from 'react';
import { Button, Typography, Container, Grid } from '@mui/material';
import { uploadFiles } from '../api/api';
const UploadPage = () => {
  // State to store selected files
  const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

    // Function to handle file change
    const handleFileChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFiles(Array.from(event.target.files));
        }
    }
  // Async Function to handle file upload

  const handleUpload = async () => {
    try {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        const response = await uploadFiles(formData);
        console.log(response);
    }
    catch (err) {
        console.error(err);
    }
}
  

  return (
    <Container sx={{ mt: 4 }}>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Upload Resumes</Typography>
            </Grid>

            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Button variant="contained" component="label">
                            Select Files
                            <input
                                type="file"
                                multiple
                                hidden
                                accept = "application/pdf"
                                onChange={handleFileChange()}
                            />
                        </Button>
                    </Grid>
                    <Grid item xs={10}>
                        <Typography variant="body1" align='left'>
                            {selectedFiles.length} files selected
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={handleUpload} hidden={!selectedFiles.length}>
                    Upload
                </Button>
            </Grid>

        </Grid>
    </Container>
  );
};

export default UploadPage;

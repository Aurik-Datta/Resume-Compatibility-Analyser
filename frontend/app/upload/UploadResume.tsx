"use client"
// app/upload/page.tsx
import React from 'react';
import { Button, Typography, Grid, Chip } from "@mui/material"

interface UploadResumeProps {
    selectedFiles: Array<File>;
    setSelectedFiles: (files: Array<File>) => void;
}


const UploadResume = ({ selectedFiles, setSelectedFiles }: UploadResumeProps) => {

    const FileList = () => {
        return (
            <Grid container spacing={1}>
                {selectedFiles.map((file, index) => {
                    return (
                        <Grid item key={index}>
                            <Chip label={file.name} onDelete={() => {
                                const newFiles = selectedFiles.filter((_, i) => i !== index);
                                setSelectedFiles(newFiles);
                            }} />
                        </Grid>
                    )
                })}
            </Grid>
        );
    }

    // Function to handle file change
    const handleFileChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setSelectedFiles([...selectedFiles, ...files]);
        }
    }
    // Async Function to handle file upload

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Upload Resumes</Typography>
            </Grid>

            <Grid item xs={12}>
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

            <Grid item xs={12}>
                <FileList />
            </Grid>
        </Grid>

    );
}

export default UploadResume;

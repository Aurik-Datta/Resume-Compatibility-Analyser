"use client"
// app/upload/page.tsx
import React from 'react';
import { Button, Box, Grid, Chip } from "@mui/material"
import Title from '../components/Title';
import UploadIcon from "../icons/UploadIcon.svg"
import Image from 'next/image';

interface UploadResumeProps {
    selectedFiles: Array<File>;
    setSelectedFiles: (files: Array<File>) => void;
}


const UploadResume = ({ selectedFiles, setSelectedFiles }: UploadResumeProps) => {

    const FileList = () => {
        return (
            <Box
                sx={{
                    width: '100%',
                
                    justifyContent: 'center',
                    border: '1px solid #164296',
                    borderRadius: 1,
                    alignItems: 'center',
                    cursor: 'pointer',
                    minHeight: 70,
                    // maxHeight: 70,
                    // overflowY: 'auto'
                    overFlowX: 'auto'
                }}
            >

                <Grid container spacing={1} padding={1}>
                    {selectedFiles.map((file, index) => {
                        return (
                            <Grid item key={index}>
                                <Chip 
                                    label={file.name} 
                                    onDelete={() => {
                                        const newFiles = selectedFiles.filter((_, i) => i !== index);
                                        setSelectedFiles(newFiles);
                                    }}
                                    color="secondary"
                                    sx={{
                                        fontSize: 12,
                                        fontFamily: 'Fenix',
                                        '& .MuiChip-deleteIcon': {
                                            color: '#164296'
                                        },
                                        '& .MuiChip-label': {
                                            color: '#164296'
                                        }
                                    }} 
                                />
                            </Grid>
                        )
                    })}
                </Grid>
            </Box>
        );
    }

    // Function to handle file change
    const handleFileChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            setSelectedFiles([...selectedFiles, ...files]);
        }
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{textAlign: 'center'}}>
                <Title>Upload Resumes</Title>
            </Grid>

            <Grid item xs={12}>
                <Button
                    fullWidth
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        border: '1px solid #164296',
                        borderRadius: 1,
                        alignItems: 'center',
                        padding: 2  ,
                        cursor: 'pointer',
                    }}
                    component="label"
                >
                    <input
                        type="file"
                        multiple
                        hidden
                        accept = "application/pdf"
                        onChange={handleFileChange()}
                    />
                    <Image src={UploadIcon} alt="Upload Icon" width={50} height={50} />
                </Button>
            </Grid>

            <Grid item xs={12}>
                <FileList />
            </Grid>
        </Grid>

    );
}

export default UploadResume;

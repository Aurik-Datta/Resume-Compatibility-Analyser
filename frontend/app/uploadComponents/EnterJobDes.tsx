"use client"
import { useState } from "react";
import { TextField, Grid, Stack } from "@mui/material";
import Title from "../components/Title";
interface EnterJobDesProps {
    jobDes: string;
    setJobDes: (jobDes: string) => void;
}

const EnterJobDes = ({jobDes, setJobDes}: EnterJobDesProps) => {
    const handleJobDesChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        setJobDes(event.target.value);
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sx={{textAlign: 'center'}}>
                <Title >Enter Job Description</Title>
            </Grid>
            <Grid item xs={12} >
                <TextField
                    multiline
                    minRows={6}
                    maxRows={15}
                    fullWidth
                    value={jobDes}
                    onChange={handleJobDesChange()}
                    variant="outlined"
                    sx = {{
                        '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#164296', }, '&:hover fieldset': { borderColor: '#164296', }}
                    }}
            />
            </Grid>
        </Grid>
    );

}

export default EnterJobDes;
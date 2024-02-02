"use client"
import { useState } from "react";
import { Typography, TextField, Grid } from "@mui/material";

const EnterJobDes = () => {
    const [jobDes, setJobDes] = useState<string>('');
    const handleJobDesChange = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        setJobDes(event.target.value);
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h4">Enter Job Description</Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Job Description"
                    multiline
                    rows={4}
                    fullWidth
                    value={jobDes}
                    onChange={handleJobDesChange()}

                />
            </Grid>
        </Grid>
    );

}

export default EnterJobDes;
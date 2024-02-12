"use client"
import { useState } from "react";
import { TextField, Grid, Stack, Switch } from "@mui/material";
import Title from "../components/Title";
interface EnterJobDesProps {
    reqJobDes: string;
    prefJobDes: string;
    setReqJobDes: (jobDes: string) => void;
    setPrefJobDes: (prefJobDes: string) => void;
    plainTextMode: boolean;
    setPlainTextMode: (plainTextMode: boolean) => void;
}

const EnterJobDes = ({reqJobDes, setReqJobDes, plainTextMode, setPlainTextMode, prefJobDes, setPrefJobDes}: EnterJobDesProps) => {
    const handleJobDesChange = (type: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (type === 'req') {
            setReqJobDes(event.target.value);
        } else {
            setPrefJobDes(event.target.value);
        }
    }
        
    return (
        <Grid container spacing={2}>
            <Grid item xs={10} sx={{textAlign: 'left'}}>
                <Title >
                    {plainTextMode ? 'Enter Job Description (Plaintext)' : 'Enter Job Description (Required and Preferred Skills)' }
                </Title>
            </Grid>
            <Grid item xs={2} sx={{textAlign: 'right'}}>
                <Switch
                    checked={plainTextMode}
                    onChange={() => setPlainTextMode(!plainTextMode)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    size="small"
                />
            </Grid>
            {(plainTextMode) ? 
                <Grid item xs={12} >
                    <TextField
                        multiline
                        minRows={6}
                        maxRows={15}
                        fullWidth
                        value={reqJobDes}
                        onChange={handleJobDesChange('req')}
                        variant="outlined"
                        sx = {{
                            '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#164296', }, '&:hover fieldset': { borderColor: '#164296', }}
                        }}
                    />
                </Grid>
                : 
                <Grid item xs={12}>
                    <Stack spacing={2}>
                        <TextField
                            label="Required Skills"
                            multiline
                            minRows={3}
                            maxRows={15}
                            fullWidth
                            value={reqJobDes}
                            onChange={handleJobDesChange('req')}
                            variant="outlined"
                            sx = {{
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#164296', }, '&:hover fieldset': { borderColor: '#164296', }}
                            }}
                        />
                        <TextField
                            label="Preferred Skills"
                            multiline
                            minRows={3}
                            maxRows={15}
                            fullWidth
                            value={prefJobDes}
                            onChange={handleJobDesChange('pref')}
                            variant="outlined"
                            sx = {{
                                '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: '#164296', }, '&:hover fieldset': { borderColor: '#164296', }}
                            }}
                        />
                    </Stack>
                </Grid> 
                }
        </Grid>
    );

}

export default EnterJobDes;
import React from 'react';
import { CompatibilityListElement } from "../api/api";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Grid, styled, LinearProgress } from "@mui/material";

interface RankedResumesProps {
  compatibilityList: Array<CompatibilityListElement>;
}

const CustomLinearProgress = styled(LinearProgress)({
  height: 10,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
  },
});

const RankedResumes = ({ compatibilityList }: RankedResumesProps) => {
  const sortedList = [...compatibilityList].sort((a, b) => b.compatibility - a.compatibility);

    const jobDesSkills = compatibilityList[0]? compatibilityList[0].jobDes_skills : []; 
  return (
    <div>
      {sortedList.map((item, index) => (
        <Accordion key={item.file_name}>
          <AccordionSummary>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs={1}>
                <Typography>{index + 1}</Typography> {/* Rank */}
              </Grid>
              <Grid item xs={5}>
                <Typography>{item.file_name}</Typography> {/* File Name */}
              </Grid>
              <Grid item xs={6}>
                <CustomLinearProgress variant="determinate" value={item.compatibility * 100} />
                <Typography>{`${(item.compatibility * 100).toFixed(2)}%`}</Typography> {/* Compatibility Score */}
              </Grid>
            </Grid>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="h6">Job Description Skills:</Typography>
            <Grid container spacing={1}>
              {item.jobDes_skills.map((skill) => (
                <Grid item key={skill}>
                  <Chip label={skill} color={item.compat_skills.includes(skill) ? "primary" : "error"} />
                </Grid>
              ))}
            </Grid>
            <Typography variant="h6" sx={{ mt: 2 }}>Resume Skills:</Typography>
            <Grid container spacing={1}>
              {item.resume_skills.map((skill) => (
                <Grid item key={skill}>
                  <Chip label={skill} color={item.compat_skills.includes(skill) ? "primary" : "error"} />
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default RankedResumes;

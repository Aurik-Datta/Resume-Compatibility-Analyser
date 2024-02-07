"use client"
import React, {useState} from 'react';
import { CompatibilityListElement } from "../api/api";
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Grid, styled, LinearProgress, Box, Divider } from "@mui/material";
import Title from '../components/Title';

interface RankedResumesProps {
  sortedList : Array<CompatibilityListElement>;
  setSortedList : (sortedList: Array<CompatibilityListElement>) => void;
  jobDesSkillList : Array<string>;
}

const CustomLinearProgress = styled(LinearProgress)({
  height: 10,
  borderRadius: 5,
  '& .MuiLinearProgress-bar': {
    borderRadius: 5,
  },
});

const RankedResumes = ({ sortedList, setSortedList, jobDesSkillList }: RankedResumesProps) => {
    const [disabledSkills, setDisabledSkills] = useState<Array<string>>([]);
    const handleToggleSkill = (skill: string) => {
        // go through each element in the list and remove the skill if it exists in jobDes_skills
        // while doing this, recalculating the compatibility score
        // set the new compatibilityList
        // re-sort the list
        let deleteMode = false;
        const newSortedList = sortedList.map((item) => {
            if (item.jobDes_skills.includes(skill)) {
                // delete skill from jobDes_skills and compat_skills if exists, and recalculate compatibility
                deleteMode = true;
                const newJobDesSkills = item.jobDes_skills.filter((s) => s !== skill);
                const newCompatSkills = item.compat_skills.filter((s) => s !== skill);
                const newCompatibility = newCompatSkills.length / newJobDesSkills.length;
                return {
                    ...item,
                    jobDes_skills: newJobDesSkills,
                    compat_skills: newCompatSkills,
                    compatibility: newCompatibility
                }
            } else {
                // the skill needs to be added back to jobDes_skills and if it's also in resume_skills, add it to compat_skills
                const newJobDesSkills = [...item.jobDes_skills, skill];
                const newCompatSkills = item.resume_skills.includes(skill) ? [...item.compat_skills, skill] : item.compat_skills;
                const newCompatibility = newCompatSkills.length / newJobDesSkills.length;
                return {
                    ...item,
                    jobDes_skills: newJobDesSkills,
                    compat_skills: newCompatSkills,
                    compatibility: newCompatibility
                }
            }
        }).sort((a, b) => b.compatibility - a.compatibility);
        if (deleteMode) {
            setDisabledSkills([...disabledSkills, skill]);
        } else {
            // remove the skill from the disabledSkills list
            const newDisabledSkills = disabledSkills.filter((s) => s !== skill);
            setDisabledSkills(newDisabledSkills);
        }
        setSortedList(newSortedList);

    }

    const FilterJobDesSkills = () => {
        return (
            <Accordion defaultExpanded={jobDesSkillList.length > 0}>
            <AccordionSummary sx={{ bgcolor: '#164296', color: 'white' }}><Typography>Filter Job Description Skills</Typography></AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={1}>
                    {jobDesSkillList.map((skill) => (
                        <Grid item key={skill}>
                            <Chip label={skill}
                                clickable
                                color={disabledSkills.includes(skill) ? "secondary" : "primary"}
                                sx = {{
                                    '& .MuiChip-label': {
                                        color: !disabledSkills.includes(skill) ? 'white' : '#164296'
                                    }
                                }}
                                onClick={() => handleToggleSkill(skill)}
                            />
                        </Grid>
                        ))}
                    {jobDesSkillList.length === 0 && <Typography>No skills to filter</Typography>}
                    </Grid>
                </AccordionDetails>
            </Accordion>
        );
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Divider variant='middle' />
            </Grid>
            <Grid item xs={12}>
                <Title>Compatibility Scores</Title>
            </Grid>
            <Grid item xs={12}>
                <Box minHeight={100}>
                <FilterJobDesSkills />
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
                            <Chip label={skill} color={item.compat_skills.includes(skill) ? "success" : "error"} />
                            </Grid>
                        ))}
                        </Grid>
                        <Typography variant="h6" sx={{ mt: 2 }}>Resume Skills:</Typography>
                        <Grid container spacing={1}>
                        {item.resume_skills.map((skill) => (
                            <Grid item key={skill}>
                            <Chip label={skill} color={item.compat_skills.includes(skill) ? "success" : "error"} />
                            </Grid>
                        ))}
                        </Grid>
                    </AccordionDetails>
                    </Accordion>
                ))}
                </Box>
            </Grid>
            <Grid item xs={12}>
                <Divider variant='middle' />
            </Grid>

        </Grid>
    );
};

export default RankedResumes;

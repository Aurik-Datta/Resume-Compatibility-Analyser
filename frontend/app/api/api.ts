import axios from 'axios';
import { API_URL } from '../constants';

// interfaces
export interface CompatibilityListElement {
  file_name: string;
  compat_skills: Array<string>;
  compatibility: number;
  resume_skills: Array<string>;
  jobDes_skills: Array<string>;
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const analyseCompatibility : any = async (selectedFiles: Array<File>, jobDes: string) => {
    const resumeFormData = new FormData();
    selectedFiles.forEach((file) => {
      resumeFormData.append('files', file);
    });
    const resume_response = await api.post('/analyseResumes', resumeFormData, {
        headers: {
        'Content-Type': 'multipart/form-data',
        },
    });
    // resume skill list should be a list of lists of strings
    const resume_skill_list = resume_response.data.skills;
    console.log("resume_skill_list", resume_skill_list);

    const jobDes_response = await api.post('/analyseJobDescription', {
        "job_description": jobDes,
    });
    const jobDes_skill_list = jobDes_response.data.skills;
    console.log("jobDes_response", jobDes_skill_list);

    // next step is to calculate how many skills are in common between the job description and the resume
    // so, we will have a list called compatibility_list
    // this will contain objects with the following structure:
    // {file_name: string, compat_skills: Array<string>, compatibility: float}
    // where file_name is the name of the file, compat_skills is the list of skills that are in common between the job description and the resume
    // and compatibility = len(compat_skills) / len(jobDes_skill_list)

    const compatibility_list: Array<CompatibilityListElement>  = [];
    resume_skill_list.forEach((resume_skills : Array<string>, index: number) => {
        const compat_skills = resume_skills.filter((skill) => jobDes_skill_list.includes(skill));
        const compatibility = jobDes_skill_list.length ? compat_skills.length / jobDes_skill_list.length: 0;
        compatibility_list.push({
            file_name: selectedFiles[index].name,
            compat_skills,
            compatibility,
            resume_skills,
            jobDes_skills: jobDes_skill_list,
        });
    });
    return compatibility_list;
} 

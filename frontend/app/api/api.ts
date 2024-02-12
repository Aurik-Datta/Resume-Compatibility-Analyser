import axios from 'axios';
import { API_URL } from '../constants';
import { CompatibilityListElement, JobDesSkill, calculateCompatibility } from '../utils';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const analyseCompatibility : any = async (selectedFiles: Array<File>, reqJobDesUnsan: string, prefJobDesUnsan: string) => {
    const reqJobDes = reqJobDesUnsan.replace(/(\r\n|\n|\r)/gm, " ");
    const prefJobDes = prefJobDesUnsan.replace(/(\r\n|\n|\r)/gm, " ");
    console.log("reqJobDes", reqJobDes);
    console.log("prefJobDes", prefJobDes);
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
    
    const reqJobDes_response = reqJobDes ? 
    (await api.post('/analyseJobDescription', {"job_description": "Required Skills: " + reqJobDes})).data.skills.map((job_skill: string) => ({ skill: job_skill.toLowerCase(), weight: 1 })) :
    [];
    const prefJobDes_response = prefJobDes ?
    (await api.post('/analyseJobDescription', {"job_description": "Preferred Skills: " + prefJobDes})).data.skills.map((job_skill: string) => ({ skill: job_skill.toLowerCase(), weight: 0.5 })) :
    [];
    //const prefJobDes_response: Array<JobDesSkill> = [];
    const jobDes_skill_list: Array<JobDesSkill> = reqJobDes_response.concat(prefJobDes_response) 
    console.log("jobDes_response", jobDes_skill_list);


    const compatibility_list: Array<CompatibilityListElement>  = [];
    resume_skill_list.forEach((resume_skills : Array<string>, index: number) => {
        const compat_skills = jobDes_skill_list.filter((job_skill: JobDesSkill) => resume_skills.includes(job_skill.skill));
        // maxScore = all of the weights of the jobDes_skills added together
        const compatibility = calculateCompatibility(compat_skills, jobDes_skill_list);
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

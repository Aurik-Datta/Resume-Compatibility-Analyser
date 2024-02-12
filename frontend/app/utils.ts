export interface JobDesSkill {
    skill: string;
    weight: number;
  }
  
  // interfaces
export interface CompatibilityListElement {
    file_name: string;
    compat_skills: Array<JobDesSkill>;
    compatibility: number;
    resume_skills: Array<string>;
    jobDes_skills: Array<JobDesSkill>;
}
  

export const calculateCompatibility = (compat_skills: Array<JobDesSkill>, jobDes_skill_list: Array<JobDesSkill>) : number => {
    const maxScore = jobDes_skill_list.reduce((acc, curr) => acc + curr.weight, 0);
    console.log(maxScore)
    const score = compat_skills.reduce((acc, curr) => acc + curr.weight, 0);
    return score / maxScore;    
}
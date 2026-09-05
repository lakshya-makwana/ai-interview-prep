import api from "../api/api";

export async function getDashboard(){

    const result={

        resume:null,

        analysis:null,

        coding_progress:null,

    };

    try{

        const resume=await api.get("/resume/me");

        result.resume=resume.data;

    }

    catch(e){

    }

    try{

        const analysis=await api.get("/analysis/me");

        result.analysis=analysis.data;

    }

    catch(e){

    }

    try{

        const codingProgress=await api.get("/coding/progress/me");

        result.coding_progress=codingProgress.data;

    }

    catch(e){

    }

    return result;

}

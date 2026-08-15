import api from "../api/api";

export async function getDashboard(){

    const result={

        resume:null,

        analysis:null,

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

    return result;

}
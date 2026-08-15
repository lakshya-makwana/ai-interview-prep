import { useEffect,useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardCard from "../components/DashboardCard";

import QuickActions from "../components/QuickActions";

import RecentActivity from "../components/RecentActivity";

import { Grid } from "@mui/material";

import { Typography } from "@mui/material";

import { getDashboard } from "../services/dashboardService";

import { useNavigate } from "react-router-dom";

export default function Dashboard(){

    const [loading,setLoading]=useState(true);
    const navigate = useNavigate();
    const [data,setData]=useState({});

    useEffect(()=>{

        async function load(){

            const response=await getDashboard();

            setData(response);

            setLoading(false);

        }

        load();

    },[]);

    if(loading){

        return(

            <DashboardLayout>

                <Typography>

                    Loading...

                </Typography>

            </DashboardLayout>

        );

    }

    const ats=data.analysis?.ats_score
        ?`${data.analysis.ats_score}%`
        :"--";

    const resume=data.resume
        ?"Uploaded"
        :"Not Uploaded";

    const analysis=data.analysis
        ?"Completed"
        :"Not Available";

    return(

        <DashboardLayout>

            <Typography
                variant="h4"
                sx={{
                    mb:4,
                }}
            >

                Welcome Back 👋

            </Typography>

            <Grid
                container
                spacing={3}
            >

                <Grid
                    size={{
                        xs:12,
                        md:4
                    }}
                >

                    <DashboardCard
                        title="ATS Score"
                        value={ats}
                    />

                </Grid>

                <Grid
                    size={{
                        xs:12,
                        md:4
                    }}
                >

                    <DashboardCard
                        title="Resume"
                        value={resume}
                    />

                </Grid>

                <Grid
                    size={{
                        xs:12,
                        md:4
                    }}
                >

                    <DashboardCard
                        title="Analysis"
                        value={analysis}
                    />

                </Grid>

                <Grid
                    size={{
                        xs:12,
                        md:6
                    }}
                >

                    <QuickActions/>

                </Grid>

                <Grid
                    size={{
                        xs:12,
                        md:6
                    }}
                >

                    <RecentActivity/>

                </Grid>

            </Grid>

        </DashboardLayout>

    );

}
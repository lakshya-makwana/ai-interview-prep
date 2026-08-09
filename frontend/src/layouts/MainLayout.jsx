import { AppBar } from "@mui/material";
import { Toolbar } from "@mui/material";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";

export default function MainLayout({ children }){

    return(

        <>

        <AppBar
            position="static"
            sx={{
                background:"#111827",
                boxShadow:"none",
                borderBottom:"1px solid #1E293B"
            }}
        >

        <Toolbar>

            <Typography
                variant="h6"
                sx={{
                    fontWeight:700
                }}
            >

                AI Interview Prep

            </Typography>

        </Toolbar>

        </AppBar>

        <Box
            sx={{
                p:4
            }}
        >

            {children}

        </Box>

        </>

    );

}
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {

    const navigate = useNavigate();

    return (

        <Card
            sx={{
                height: "100%",
                borderRadius: 4,
            }}
        >

            <CardContent>

                <Typography
                    variant="h5"
                    sx={{ mb: 3 }}
                >
                    Quick Actions
                </Typography>

                <Stack spacing={2}>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate("/analysis")}
                    >
                        Analyze Resume
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/resume")}
                    >
                        Upload Resume
                    </Button>

                    <Button
                        variant="outlined"
                        size="large"
                        onClick={() => navigate("/analysis")}
                    >
                        View Analysis
                    </Button>

                </Stack>

            </CardContent>

        </Card>

    );

}
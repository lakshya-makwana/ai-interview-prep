import {
    Card,
    CardContent,
    Typography,
} from "@mui/material";

export default function SuggestionCard({
    suggestion,
}) {

    return (

        <Card
            sx={{

                background: "#1E293B",

                mb: 2,

                transition: "0.3s",

                "&:hover": {

                    background: "#243449",

                }

            }}
        >

            <CardContent>

                <Typography>

                    💡 {suggestion}

                </Typography>

            </CardContent>

        </Card>

    );

}
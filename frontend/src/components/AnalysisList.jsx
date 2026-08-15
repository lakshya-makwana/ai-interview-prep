import {
    Card,
    CardContent,
    List,
    ListItem,
    Typography,
} from "@mui/material";

export default function AnalysisList({
    title,
    icon,
    items,
}) {
    return (
        <Card
            sx={{
                height: "100%",
                background: "#1E293B",

                transition: "0.3s",

                "&:hover": {

                    transform: "translateY(-6px)",

                    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",

                },

            }}
        >
            <CardContent>

                <Typography
                    variant="h6"
                    sx={{ mb: 2 }}
                >
                    {icon} {title}
                </Typography>

                <List>

                    {items.map((item) => (

                        <ListItem key={item}>

                            {item}

                        </ListItem>

                    ))}

                </List>

            </CardContent>

        </Card>
    );
}
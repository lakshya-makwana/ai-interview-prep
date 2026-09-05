import { Card, CardContent } from "@mui/material";

export default function AppCard({ children, sx = {}, contentSx = {}, ...props }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        border: 1,
        borderColor: "divider",
        ...sx,
      }}
      {...props}
    >
      <CardContent
        sx={{
          p: { xs: 2.5, sm: 3 },
          "&:last-child": {
            pb: { xs: 2.5, sm: 3 },
          },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

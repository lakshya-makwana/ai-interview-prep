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
        borderRadius: 1,
        ...sx,
      }}
      {...props}
    >
      <CardContent
        sx={{
          p: { xs: 1.5, sm: 2 },
          "&:last-child": {
            pb: { xs: 1.5, sm: 2 },
          },
          ...contentSx,
        }}
      >
        {children}
      </CardContent>
    </Card>
  );
}

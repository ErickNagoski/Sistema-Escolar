import { Card, Grid2, Typography } from "@mui/material";

const MainCard = () => {
  return (<Card>
    <Typography>Title</Typography>
    <Grid2 padding={2}>
      <Typography>Content</Typography>
    </Grid2>
  </Card>)
}

export default MainCard;
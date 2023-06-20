import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://ictd.cs.washington.edu/">
        ICTD
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default function Footer() {
  return <Copyright sx={{ mt: 8, mb: 4 }} />;
}

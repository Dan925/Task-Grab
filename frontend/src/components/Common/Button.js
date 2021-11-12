import { Button } from "@mui/material";
import { styled } from "@mui/system";

const CustomBtn = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  "&:hover": {
    backgroundColor: theme.palette.secondary.main,
  },
}));

CustomBtn.defaultProps = {
  size: "large",
  variant: "contained",
};

export default CustomBtn;

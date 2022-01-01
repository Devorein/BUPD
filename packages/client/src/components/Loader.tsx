import { CircularProgress, Typography } from "@mui/material";

interface LoaderProps {
  size: 'small' | 'medium' | 'large'
  label?: string
  classNames?: {
    container?: string
  }
}

export function Loader(props: LoaderProps) {
  const { label, size, classNames: { container = '' } = {} } = props;
  let convertedSize = "";
  if (size === "small")
    convertedSize = "1em";
  else if (size === "medium") {
    convertedSize = "2.5em";
  } else if (size === "large") {
    convertedSize = "5em"
  }

  return <div className={`Loader mb-5 w-full ${container}`}>
    {label && <div className="mb-5">
      <Typography variant="h5" className="Loader-label">{label}</Typography>
    </div>}
    <div className="flex justify-center">
      <CircularProgress size={convertedSize} />
    </div>
  </div>
}
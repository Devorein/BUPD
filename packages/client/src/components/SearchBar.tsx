import SearchIcon from '@mui/icons-material/Search';
import {
  InputAdornment, TextField
} from "@mui/material";
import { grey } from '@mui/material/colors';
import { useState } from 'react';

interface SearchBarProps {
  onClick: (searchValue: string) => void
  placeHolder: string
}

export function SearchBar(props: SearchBarProps) {
  const { onClick, placeHolder } = props;
  const [searchTerm, setSearchTerm] = useState("");
  return <div className="mr-3 w-full shadow-md">
    <TextField
      sx={{
        '& .MuiOutlinedInput-root': {
        }
      }}
      className="rounded-md w-full"
      variant="outlined"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value as string)}
      placeholder={placeHolder}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" className="cursor-pointer">
            <SearchIcon sx={{
              "&": {
                transition: 'fill 150ms ease-in-out, font-size 150ms ease-in-out'
              },
              "&:hover": {
                fill: grey[900],
                fontSize: 30,
                transition: 'fill 150ms ease-in-out, font-size 150ms ease-in-out'
              }
            }} onClick={() => onClick(searchTerm)} />
          </InputAdornment>
        ),
      }}
    />
  </div>
}
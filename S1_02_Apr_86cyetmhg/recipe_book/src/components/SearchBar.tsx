import { TextField, InputAdornment } from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export default function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <TextField
      placeholder="Search recipes..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search />
          </InputAdornment>
        ),
      }}
      sx={{ 
        minWidth: 200,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2
        }
      }}
    />
  );
}
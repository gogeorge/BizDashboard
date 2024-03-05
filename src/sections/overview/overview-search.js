import { useEffect, useState } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import CancelIcon from '@heroicons/react/24/solid/XMarkIcon'
import { Card, Container, InputAdornment, OutlinedInput, SvgIcon, Autocomplete, TextField, Typography } from '@mui/material';

export const OverviewSearch = () => {
  const [searchValue, setSearchValue] = useState('');
  const [jsonData, setJsonData] = useState({});
  const [searchResult, setSearchResult] = useState([])
  const [reset, setReset] = useState(0)
  const [filenames, setFilenames] = useState(new Set())
  const [finalResult, setFinalResult] = useState([])


  useEffect(() => {
    fetch("http://localhost:3001/api")
      .then((res) => {
        return res.json()
      })
      .then((d) => {
        setJsonData(d)
      })
      .catch((error) => console.error("Error fetching data:", error));

  }, []);

  const search = (data, searchTerm, results = []) => {
    const searchRegex = new RegExp(searchTerm, 'gi');
  
    // If the data is an object or array, recursively search through its properties/elements.
    if (typeof data === 'object' && data !== null) {
      for (const key in data) {
        const result = search(data[key], searchTerm, results);
        if (result !== null) {
          const id = data['folderId'] !== undefined ? data['folderId'] : data['id'];
          const type = data['folderId'] !== undefined ? 'folder' : 'file';
          results.push([result, id, type]);
        }
      }
    } else if (typeof data === 'string' && data.match(searchRegex)) {
      return data;
    }
  
    return null;
  };
  
  const handleResult = (fileName) => {
    if (fileName[2] == 'file') {
      console.log(fileName)
      window.open("https://drive.google.com/file/d/" + fileName[1] + "/view")
      console.log(fileName[0], fileName[1])
    } else if (fileName[2] == 'folder') {
      console.log(fileName)
      window.open("https://drive.google.com/drive/folders/" + fileName[1])
      console.log(fileName[0], fileName[1])
    }
    console.log(filenames)
  }

  return (
    <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center'}}>
    <Card sx={{ p: 2, width: '100%' }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search documents and folders"
        onChange={(e) => setSearchValue(e.target.value)}
        endAdornment = {(
        <InputAdornment position="end">
          <SvgIcon
            color="action"
            fontSize="small"
            onClick={() => {
              // search(jsonData, searchValue, searchResult)

                // Assuming your data is named 'jsonData'
                const searchResults = [];
                search(jsonData, searchValue, searchResults);
                
                // Convert the search results array to a set to remove duplicates
                const uniqueSearchResults = new Set(searchResults);
                
                // Convert the set back to an array if needed
                setFinalResult([...uniqueSearchResults])

            }}
          >
            <MagnifyingGlassIcon />
          </SvgIcon>
          <SvgIcon
            color="action"
            fontSize="small"
            onClick={
              () => setFinalResult([''])
            }
            >
            <CancelIcon />
          </SvgIcon>
        </InputAdornment>
      )}
      />
      {
        finalResult.length > 0 ? (
          <div>
            {finalResult.map((elem, index) => (
              <Typography key={index} onClick={() => handleResult(elem)}>
                {/* {console.log(filenames)} */}
                {elem[0]}
              </Typography>
            ))}
          </div>
        ) : null
      }
    </Card>

  </Container>
  )
}

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  FormControl,
  Select,
  CardContent,
  Button,
  Input,
  SvgIcon,
  Grid,
  Paper,
  Typography,
  MenuItem
} from '@mui/material';

// import { BuildingOffice2Icon } from '@heroicons/react/24/solid/BuildingOffice2Icon';
import { Scrollbar } from '../../components/scrollbar';
import { useTheme } from '@mui/material/styles';
import { COUNTRY_CODES } from '../../utils/country-codes';
import { SeverityPill } from 'src/components/severity-pill';



export const AgenciesTable = ({ data }) => {
  const theme = useTheme();
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [editView, setEditView] = useState('')
  const [supplierList, setSupplierList] = useState([''])
  const [agencies, setAgencies] = useState([''])
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [savedValues, setSavedValues] = useState('')
  const [sortedData, setSortedData] = useState([{}])
  const [countries, setCountries] = useState([])
  const [allCountries, setAllCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedValues, setSelectedValues] = useState(Array(countries.length).fill(''));
  const [editingIndex, setEditingIndex] = useState(-1); 

  useEffect(() => {
    let suppliers = data.folders[4].folders
    let sList = []
    let c = []

    for (let i = 0; i < suppliers.length; i++) {
      sList.push(suppliers[i].name)
    }

    setSupplierList(sList.sort())
    setAllCountries(c.sort())


    for (let i = 0; i < COUNTRY_CODES.length; i++) {
      c.push(COUNTRY_CODES[i].name.toUpperCase())
    }

    fetch("http://localhost:3001/agencyTable")
    .then((res) => {
      return res.json()
    })
    .then((d) => {
      console.log(d)
      setSortedData(d.table)
      setCountries(d.countries)

      let agencyList = []

      for (let i = 0; i < d.table.length; i++) {
        agencyList.push(d.table[i].name)
      }

      setAgencies(agencyList)


    })
    .catch((error) => console.error("Error fetching data:", error));

  }, [])

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
    setPage(0); // Reset page to the first page
  }

  const handleCountrySelect = (index, value) => {
    const updatedValues = [...selectedValues];

    updatedValues[index] = value === 'Empty' ? '' : value;
    setSelectedValues(updatedValues);
  };

  const handleAddAgency = async () => {
    console.log(selectedValues, selectedSupplier)

    const response = await fetch('http://localhost:3001/addAgencyTable', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: selectedSupplier, val: selectedValues })
    });

    setEditView('')
  }

  const handleDeleteAgency = async () => {
    const response = await fetch('http://localhost:3001/deleteAgency', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: selectedSupplier })
    });

    setEditView('')
  }

  const handleEditAgency = async () => {
    const combinedValues = savedValues.map((item, index) => {
      // Check if the corresponding element in array2 is different
      if (selectedValues[index] !== undefined) {
        return selectedValues[index]; // Replace with the value from array2
      } 
      return item
    });

    console.log('combi, ', combinedValues, savedValues)

    const response = await fetch('http://localhost:3001/editAgencyTable', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: selectedSupplier, val: combinedValues })
    });
    setEditView('')
  }

  const handleAddCountry = async () => {
    const response = await fetch('http://localhost:3001/addAgencyCountry', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ country: selectedCountry })
    });
    setEditView('')
  }

  const handleEditChange = (index, newValue) => {
    const updatedValues = [...selectedValues];
    updatedValues[index] = newValue;
    setSelectedValues(updatedValues);
  }



  return (
    <Card style={{ paddingBottom: 10}}>
      <Scrollbar>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'name'}
                direction={orderBy === 'name' ? order : 'asc'}
                onClick={() => handleSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            {countries !== undefined && countries.map((cntr, i) => {
              return (           
                <TableCell>
                  {cntr}
                </TableCell>
              )
            })}

          </TableRow>
        </TableHead>
        <TableBody>
        {sortedData
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((item, index) => (
            <TableRow 
              key={item.name}
              >
              <TableCell>
              </TableCell>
              <TableCell align="right">
                <SvgIcon sx={{ 
                  position: 'relative',
                  top: '6px',
                  right: '7px'
                }}>
                  {/* <BuildingOffice2Icon /> */}
                </SvgIcon> 
                <SeverityPill color='primary'>
                  {item.name}
                </SeverityPill>
              </TableCell>
              {item.val !== undefined && item.val.map((v, i) => {
                return (
                  <TableCell key={i}>
                  {v}
                  </TableCell>
                )              
                })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Scrollbar>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // Reset page to the first page
        }}
      />
      <div style={{ padding: 10}}>
        <Button style={{ margin: 5}} onClick={() => setEditView('edit')}>Edit Agency</Button>
        <Button style={{ margin: 5}} variant='contained' onClick={() => setEditView('add')}>Add Agency</Button>
        <Button style={{ margin: 5}} variant='contained' onClick={() => setEditView('del')}>Delete Agency</Button>
        <Button style={{ margin: 5}} variant='contained' onClick={() => setEditView('addCountry')}>Add Country</Button>
      </div>

      <br/>
      {
        editView == 'add' ? (
          <Card style={{padding: 15}}>
            <CardContent>Add Supplier</CardContent>
            <div>
            <FormControl style={{ width: '200px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSupplier}
                  label="Client"
                  onChange={(e) => {
                    setSelectedSupplier(e.target.value)
                  }}
                >
                  {
                    supplierList.map((cl) => (
                      <MenuItem value={cl}>{cl}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <br/><br/>
              {countries.map((country, i) => (
                <Typography variant='body1' key={i}>
                  {country}
                  <Box sx={{ minWidth: 120 }}>
                    <FormControl style={{ width: '200px' }}>
                      <Select
                        labelId={`demo-simple-select-label-${i}`}
                        id={`demo-simple-select-${i}`}
                        value={selectedValues[i]}
                        label="Country"
                        onChange={(e) => handleCountrySelect(i, e.target.value)}
                      >
                        {['Empty', 'Yes', 'No', 'PrB'].map((cl, j) => (
                          <MenuItem key={j} value={cl}>
                            {cl}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Typography>
              ))}
              <br/><br/>
              <Button variant='contained' onClick={() => handleAddAgency()}>Save</Button>
            </div>

          </Card>
        ) : editView == 'edit' ? (
          <Card>
            <CardContent>Select Supplier</CardContent>
            <div style={{padding: 15}}>
            <FormControl style={{ width: '200px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedSupplier}
                  label="Client"
                  onBlur={() => {
                    setSavedValues(sortedData.find(sp => sp.name === selectedSupplier).val)
                    // setEditedVals(true)
                  }}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                >
                  {
                    agencies.map((cl) => (
                      <MenuItem value={cl}>{cl}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
              <br/><br/>
              {savedValues.length > 0 && countries.map((country, i) => (
                <Typography variant='body1' key={i}>
                  {country}
                  {editingIndex === i ? (
                    // <Input
                    //   value={selectedValues[i]}
                    //   onChange={(e) => handleEditChange(i, e.target.value)}
                    // />
                    <FormControl style={{ width: '200px' }}>
                    <Select
                      labelId={`demo-simple-select-label-${i}`}
                      id={`demo-simple-select-${i}`}
                      value={selectedValues[i]}
                      label="Country"
                      onChange={(e) => handleEditChange(i, e.target.value)}
                    >
                      {['Empty', 'Yes', 'No', 'PrB'].map((cl, j) => (
                        <MenuItem key={j} value={cl}>
                          {cl}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  ) : (
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl style={{ width: '200px' }}>
                        <Select
                          labelId={`demo-simple-select-label-${i}`}
                          id={`demo-simple-select-${i}`}
                          value={savedValues[i]}
                          label="Country"
                          onChange={(e) => handleCountrySelect(i, e.target.value)}
                        >
                          {['Empty', 'Yes', 'No', 'PrB'].map((cl, j) => (
                            <MenuItem key={j} value={cl}>
                              {cl}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Button onClick={() => setEditingIndex(i)}>Edit</Button>
                    </Box>
                  )}
                </Typography>
              ))}
              <br/><br/>
              <Button variant='contained' onClick={() => handleEditAgency()}>Save</Button>
            </div>

          </Card>
        ) : editView == 'addCountry' ? (
          <Card>
          <CardContent>Add Country</CardContent>
          <div style={{padding: 15}}>
          <FormControl style={{ width: '200px' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCountry}
                label="Country"
                onBlur={() => {
                  // setSelectedCountry(sortedData.find(sp => sp.name === selectedSupplier).val)
                  // setEditedVals(true)
                }}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                {
                  allCountries.map((cl) => (
                    <MenuItem value={cl}>{cl}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
            <br/><br/>
            <Button variant='contained' onClick={() => handleAddCountry()}>Add</Button>
          </div>

        </Card>
        ) : editView == 'del' ? (
          <Card style={{padding: 15}}>
          <CardContent>Delete Supplier</CardContent>
          <div>
          <FormControl style={{ width: '200px' }}>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedSupplier}
              label="Supplier"
              onChange={(e) => {
                setSelectedSupplier(e.target.value)
              }}
            >
              {
                supplierList.map((cl) => (
                  <MenuItem value={cl}>{cl}</MenuItem>
                ))
              }
            </Select>
            </FormControl>
            <br/><br/>
            <Button variant='contained' onClick={() => handleDeleteAgency()}>Save</Button>
          </div>
        </Card>
        ) : null
      }
    </Card>

  );
};
import { use, useCallback, useEffect, useRef, useState } from 'react';
import BuildingOffice2Icon from '@heroicons/react/24/solid/BuildingOffice2Icon';
import { Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Input, Grid, Button, Autocomplete, TextField, FormControl, Select, MenuItem, OutlinedInput, Chip } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useTheme } from '@mui/material/styles';
import { COUNTRY_CODES } from 'src/utils/country-codes';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export const EditSupplier = ({ onCancel, data, suppliers, clients }) => {
  const theme = useTheme();
  // comp
  const [supplierName, setSupplierName] = useState(data.name)
  const [country, setCountry] = useState(data.country)
  const [countryAgencies, setCountryAgencies] = useState([data.countryAgencies])
  const [address, setAddress] = useState(data.address)
  const [vat, setVAT] = useState(data.vat)
  const [field, setField] = useState(data.field)
  const [webpage, setWebPage] = useState(data.webpage)
  // contacts
  const [countryList, setCountryList] = useState([]);
  const [contacts, setContacts] = useState(data.contacts);
  const [contactList, setContactList] = useState([])
  const [selectedContact, setSelectedContact] = useState({})
  const [contactInfo, setContactInfo] = useState([])
  const [fieldList, setFieldList] = useState([]);
  const [selectedField, setSelectedField] = useState('')
  const [showPopper, setShowPopper] = useState(false)
  const [selectedContactIndex, setSelecteddContactIndex] = useState(null)

  const autocompleteRef = useRef(null);
  const cNameRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cJobTitleRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cEmailRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cFixTelRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cMobTelRefs = Array.from({ length: 5 }).map(() => useRef(null));

  const handleFieldChange = (_, newValue) => {
    setField(newValue);
  };

  const handleFieldInputChange = (_, newInputValue) => {
    setField(newInputValue);
  };

  const handleDeleteOption = (optionToDelete) => {
    const updatedList = fieldList.filter((option) => option !== optionToDelete);
    setFieldList(updatedList);
    setShowPopper(false)
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', jobTitle: '',  email: '', fixTel: '', mobTel: '' }]);
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = [...data.contacts];
    updatedContacts.splice(index, 1);
    console.log(updatedContacts)
    setContacts(updatedContacts);
    data.contacts = [...updatedContacts]
  };

  const handleContactSelection = (e, index) => {
    for (let i = 0; i < contactList.length; i++) {
      if (e.target.value === contactList[i]) {
        setSelectedContact(contactInfo[i])
        setSelecteddContactIndex(index)
      }
    }
  }

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    console.log(value)
    if (value !== '') setContacts(updatedContacts);
  };

  const handleChipChange = (event) => {
    const {
      target: { value },
    } = event;
    setCountryAgencies(
      typeof value === 'string' && value !== '' ? value.split(',') : value,
    );
    console.log('ag', agencies)
  };


  const handleAddSupplier = async () => {
    onCancel()

    contacts.map((ct, i) => {
      ct.name = cNameRefs[i].current.value || cNameRefs[i].current.placeholder
      ct.jobTitle = cJobTitleRefs[i].current.value || cJobTitleRefs[i].current.placeholder
      ct.email = cEmailRefs[i].current.value || cEmailRefs[i].current.placeholder
      ct.fixTel = cFixTelRefs[i].current.value || cFixTelRefs[i].current.placeholder
      ct.mobTel = cMobTelRefs[i].current.value || cMobTelRefs[i].current.placeholder
    })

    fieldList.push(selectedField)

    let newSubfolder = {
      name: supplierName == '' ? data.name : supplierName,
      vat: vat == '' ? data.vat : vat,
      country: country == '' ? data.country.toUpperCase() : country.toUpperCase(),
      countryAgencies: countryAgencies == '' ? data.countryAgencies : countryAgencies,
      address: address == '' ? data.address : address,
      field: field == '' ? data.field : field,
      fieldList: fieldList,
      webpage: webpage == '' ? data.webpage : webpage,
      eid: data.eid,
      folderId: data.folderId,
      contacts: contacts,
      folders: data.folders,
      files: data.files
    };

    // Send the newSubfolder data to the server's API endpoint using POST method
    const response = await fetch('http://localhost:3001/editSupplier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSubfolder)
    });
  }

  useEffect(() => {
    const people = []
    const info = []
    const fields = []
    const countries = []
    let priorFieldList = []

    for (let i = 0; i < COUNTRY_CODES.length; i++) {
      countries.push(COUNTRY_CODES[i].name.toUpperCase())
    }

    for (let i = 0; i < suppliers.length; i++) {
      if (suppliers[i].field !== '') {
        fields.push(suppliers[i].field)
        priorFieldList = suppliers[i].fieldList
      }
      if (suppliers[i].contacts != undefined) {
        for (let j = 0; j < suppliers[i].contacts.length; j++) {
          let cinfo = suppliers[i].contacts[j]
          if (cinfo.name !== '') {
            people.push(cinfo.name)
            info.push(cinfo)
          }
        }
      }
    }

    setContactList(people)
    setContactInfo(info)
    setCountryList(countries.sort())

    let finalFieldList = fields.concat(priorFieldList)
    let uniqueFieldList = [...new Set(finalFieldList)]
    const filteredArray = uniqueFieldList.filter(item => item !== null);
    setFieldList(filteredArray)
  }, [])

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <SvgIcon sx={{width: '4%', height: '4%'}}>
            <BuildingOffice2Icon />
          </SvgIcon>
          <br/><br/><br/><br/>
        </Box>
        <Grid container spacing={2}>
      {/* First container */}
      <Grid item xs={6}>
      <Typography
          align="center"
          gutterBottom
          variant="body1"
        >
          Supplier Name: <Input onChange={(e) => setSupplierName(e.target.value)} value={supplierName}/>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Country:
          <Box sx={{ minWidth: 120 }}>
            <FormControl style={{ width: '200px' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country}
                label="Country"
                onChange={(e) => setCountry(e.target.value)}
              >
                {
                  countryList.map((cl) => (
                    <MenuItem value={cl}>{cl}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Country Agencies: 
          <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={countryAgencies}
                  onChange={handleChipChange}
                  input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        value !== '' ? (<Chip key={value} label={value} />) : null
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {countryList.map((sp) => (
                    <MenuItem
                      key={sp}
                      value={sp}
                      style={getStyles(sp, countryAgencies, theme)}
                    >
                      {sp}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Address: <Input onChange={(e) => setAddress(e.target.value)} value={address}/>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          VAT: <Input onChange={(e) => setVAT(e.target.value)} value={vat}/>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Website: <Input onChange={(e) => setWebPage(e.target.value)} value={webpage}/>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Field: 
          <Box sx={{ minWidth: 120, textAlign: 'center' }}>
            <Autocomplete
              disablePortal
              freeSolo
              options={fieldList}
              sx={{ width: 300, mx: 'auto' }}
              value={selectedField}
              open={fieldList.length > 0 && showPopper}
              onFocus={() => setShowPopper(true)}
              onBlur={() => {
                fieldList.push(selectedField)
              }}
              onChange={handleFieldChange}
              onInputChange={handleFieldInputChange}
              renderInput={(params) => (
                <Box display="flex" alignItems="center">
                  <TextField {...params} label={'Add a field'} ref={autocompleteRef}/>
                </Box>
              )}
              PopperComponent={(props) => (
                showPopper && (
                  <Typography {...props} style={{
                    position: 'absolute',
                    left: autocompleteRef.current ? autocompleteRef.current.getBoundingClientRect().left - 20: auto,
                  }}>
                    {fieldList.map((option) => (
                      <div key={option}
                        style={{
                          backgroundColor: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px',
                          width: '325px',
                        }}
                       >
                        <div style={{ flex: 1 }} onClick={() => {
                          setSelectedField(option)
                          setShowPopper(false)
                        }}>{option}</div>
                          <SvgIcon onClick={() => handleDeleteOption(option)} size="small" color={'grey'}>
                            <XMarkIcon color={'grey'} />
                          </SvgIcon>
                        </div>
                    ))}
                  </Typography>
                )

              )}
            />
          </Box>
        </Typography>
      </Grid>

      {/* Second container */}
      <Grid item xs={6}>
      <div>
      {contacts.map((contact, index) => {
          console.log(index, data.contacts.length)
          return(
            <div>
            <Card 
              key={index}
              style={{ padding: 15 }}
              >
              <Typography align="center" gutterBottom variant="body1">
                Contact Person Name: 
                <Box sx={{ minWidth: 120, textAlign: 'center' }}>
                <Autocomplete
                  disablePortal
                  freeSolo
                  options={contactList}
                  sx={{ width: 300, mx: 'auto' }}
                  onBlur={(e) => {
                    handleContactSelection(e, index)              
                  }}
                  onChange={(e) => {
                    handleInputChange(index, 'name', e.target.value)
                  }}
                  onInputChange={(e) => {
                    handleInputChange(index, 'name', e.target.value)
                  }}
                  renderInput={(params) => <TextField {...params} label={ "Add a contact"} />}
                />
              </Box>
              </Typography>
              <Typography align="center" gutterBottom variant="body1">
              Name: 
              <Input
                value={selectedContactIndex == index ? selectedContact.name : null}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                placeholder={contact.name}
                inputRef={cNameRefs[index]}
              />
            </Typography>
              <Typography align="center" gutterBottom variant="body1">
              Job Title: 
              <Input
                value={selectedContactIndex == index ? selectedContact.jobTitle : null}
                onChange={(e) => handleInputChange(index, 'jobTitle', e.target.value)}
                placeholder={contact.jobTitle}
                inputRef={cJobTitleRefs[index]}
              />
            </Typography>
            <Typography align="center" variant="body1">
              Email: 
              <Input
                value={selectedContactIndex == index ? selectedContact.email : null}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                placeholder={contact.email}
                inputRef={cEmailRefs[index]}
              />
            </Typography>
            <Typography align="center" variant="body1">
              Fix Tel: 
              <Input
                value={selectedContactIndex == index ? selectedContact.fixTel : null}
                onChange={(e) => handleInputChange(index, 'fixTel', e.target.value)}
                placeholder={contact.fixTel}
                inputRef={cFixTelRefs[index]}
              />
            </Typography>
            <Typography align="center" variant="body1">
              Mobile Tel: 
              <Input
                value={selectedContactIndex == index ? selectedContact.mobTel : null}
                onChange={(e) => handleInputChange(index, 'mobTel', e.target.value)}
                placeholder={contact.mobTel}
                inputRef={cMobTelRefs[index]}
              />
            </Typography>
              <br/>
              <center>
                <Button variant="contained" onClick={() => handleDeleteContact(index)}>Delete</Button>
              </center>
            </Card>
            <br/>
            </div>
          )
        // }
      })}
      <center>
        <Button onClick={handleAddContact}>Add Contact</Button>
      </center>
    </div>
      </Grid>
    </Grid>

      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Typography
            color="text.secondary"
            display="inline"
            variant="body1"
          >
            <Button color='secondary' onClick={onCancel}>Cancel</Button>
          </Typography>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body1"
          >
            <Button onClick={handleAddSupplier}>Add</Button>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  )
};

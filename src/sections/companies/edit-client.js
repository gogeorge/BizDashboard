import { useState, useEffect, useRef } from 'react';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Input, Grid, Button, Autocomplete, TextField, FormControl, Select, MenuItem } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';


export const EditClient = ({ onCancel, data, clients }) => {
  // comp
  const [clientName, setClientName] = useState(data.name)
  const [country, setCountry] = useState(data.country)
  const [address, setAddress] = useState(data.address)
  const [webpage, setWebPage] = useState(data.webpage)
  // contacts
  const [contacts, setContacts] = useState(data.contacts);
  const [contactList, setContactList] = useState([])
  const [selectedContact, setSelectedContact] = useState({})
  const [contactInfo, setContactInfo] = useState([])
  const [countryList, setCountryList] = useState([]);
  const [selectedContactIndex, setSelecteddContactIndex] = useState(null)

  const cNameRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cJobTitleRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cEmailRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cFixTelRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cMobTelRefs = Array.from({ length: 5 }).map(() => useRef(null));


  const handleContactSelection = (e, index) => {
    for (let i = 0; i < contactList.length; i++) {
      if (e.target.value === contactList[i]) {
        setSelectedContact(contactInfo[i])
        setSelecteddContactIndex(index)
      }
    }
  }

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', jobTitle: '',  email: '', fixTel: '', mobTel: '' }]);
  }

  const handleDeleteContact = (index) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  }

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...contacts]
    updatedContacts[index][field] = value
    if (value !== '') setContacts(updatedContacts)
  }

  const handleAddClient = async () => {
    onCancel()

    contacts.map((ct, i) => {
      ct.name = cNameRefs[i].current.value || cNameRefs[i].current.placeholder
      ct.jobTitle = cJobTitleRefs[i].current.value || cJobTitleRefs[i].current.placeholder
      ct.email = cEmailRefs[i].current.value || cEmailRefs[i].current.placeholder
      ct.fixTel = cFixTelRefs[i].current.value || cFixTelRefs[i].current.placeholder
      ct.mobTel = cMobTelRefs[i].current.value || cMobTelRefs[i].current.placeholder
    })

    let newSubfolder = {
      name: clientName == '' ? data.name : clientName,
      country: country == '' ? data.country.toUpperCase() : country.toUpperCase(),
      address: address == '' ? data.address : address,
      webpage: webpage == '' ? data.webpage : webpage,
      eid: data.eid,
      folderId: data.folderId,
      contacts: contacts,
      folders: data.folders,
      files: data.files
    };



    // Send the newSubfolder data to the server's API endpoint using POST method
    const response = await fetch('http://localhost:3001/editClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSubfolder)
    })
  }

  useEffect(() => {
    const people = []
    const info = []
    const countries = []

    for (let i = 0; i < clients.length; i++) {
      countries.push(clients[i].name)
      for (let j = 0; j < clients[i].folders.length; j++) {
        for (let k = 0; k < clients[i].folders[j].contacts.length; k++) {
          let cinfo = clients[i].folders[j].contacts[k]
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
            <UsersIcon />
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
          Client Name: <Input onChange={(e) => setClientName(e.target.value)} value={name}/>
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
          Address: <Input onChange={(e) => setAddress(e.target.value)} value={address}/>
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Website: <Input onChange={(e) => setWebPage(e.target.value)} value={webpage}/>
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
            <Button onClick={handleAddClient}>Add</Button>
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
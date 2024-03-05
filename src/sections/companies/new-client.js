import { useCallback, useEffect, useRef, useState } from 'react';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import { Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Input, Grid, Button, FormControl, Select, MenuItem, TextField, Autocomplete } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';


export const NewClient = ({ onCancel, clients }) => {

  const [clientName, setClientName] = useState('')
  const [address, setAddress] = useState('')
  const [webpage, setWebPage] = useState('')

  const [countryPopper, setCountryPopper] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [countryList, setCountryList] = useState([]);
  const [contacts, setContacts] = useState([{ name: '', jobTitle: '', email: '', fixTel: '', mobTel: '' }]);
  const [contactList, setContactList] = useState([])
  const [selectedContact, setSelectedContact] = useState({})
  const [contactInfo, setContactInfo] = useState([])
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
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', jobTitle: '',  email: '', fixTel: '', mobTel: '' }]);
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  };

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    setContacts(updatedContacts);
  };


  useEffect(() => {
    const people = []
    const info = []
    const countries = []


    for (let i = 0; i < clients.length; i++) {
      countries.push(clients[i].name)
      for (let j = 0; j < clients[i].folders.length; j++) {
        if (clients[i].folders[j].contacts != null) {
          for (let k = 0; k < clients[i].folders[j].contacts.length; k++) {
            let cinfo = clients[i].folders[j].contacts[k]
            if (cinfo.name !== '') {
              people.push(cinfo.name)
              info.push(cinfo)
            }
          }
        }
      }
    }
    setContactList(people)
    setContactInfo(info)
    setCountryList(countries.sort())
  }, [])

  const handleAddClient = async () => {
    if (!countryList.includes(selectedCountry)) {
      const response = await fetch('http://localhost:3001/addCountry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ country: selectedCountry.toUpperCase() } )
      })
      const addClient = await response.json().then(data => {
        addClientJSON()
      })
    } else if (countryList.includes(selectedCountry)) {
      addClientJSON()
      console.log('counrty pass')
    } else {
      console.error('country error')
    }

  }

  const addClientJSON = async () => {
    onCancel()

    contacts.map((ct, i) => {
      ct.name = cNameRefs[i].current.value || cNameRefs[i].current.placeholder
      ct.jobTitle = cJobTitleRefs[i].current.value || cJobTitleRefs[i].current.placeholder
      ct.email = cEmailRefs[i].current.value || cEmailRefs[i].current.placeholder
      ct.fixTel = cFixTelRefs[i].current.value || cFixTelRefs[i].current.placeholder
      ct.mobTel = cMobTelRefs[i].current.value || cMobTelRefs[i].current.placeholder
    })
    

    let newSubfolder = {
      name: clientName,
      country: selectedCountry.toUpperCase(),
      address: address,
      webpage: webpage,
      eid: Math.floor(10000000 + Math.random() * 90000000),
      folderId: '',
      dateCreation: new Date(),
      contacts: contacts,
      folders: [],
      files: []
    };

    // Send the newSubfolder data to the server's API endpoint using POST method
    const response = await fetch('http://localhost:3001/addClient', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSubfolder)
    });
  }

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
          Client Name: <Input onChange={(e) => setClientName(e.target.value)} />
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Address: <Input onChange={(e) => setAddress(e.target.value)} />
        </Typography>
        <Typography
          align="center"
          variant="body1"
        >
          Website: <Input onChange={(e) => setWebPage(e.target.value)} />
        </Typography>
        <br/>
        <Typography
          align="center"
          variant="body1"
        >
          Country: 
          <Box sx={{ minWidth: 120, textAlign: 'center' }}>
            <Autocomplete
              disablePortal
              freeSolo
              options={countryList}
              sx={{ width: 300, mx: 'auto' }}
              value={selectedCountry}
              open={countryPopper}
              onFocus={() => setCountryPopper(true)}
              onBlur={() => {
                setCountryPopper(false)
              }}
              onChange={(_, val) => setSelectedCountry(val)}
              onInputChange={(_, val) => setSelectedCountry(val)}
              renderInput={(params) => (
                <Box display="flex" alignItems="center">
                  <TextField {...params} label={'Add a field'}/>
                </Box>
              )}
            />
          </Box>
        </Typography>
      </Grid>

      {/* Second container */}
      <Grid item xs={6}>
      <div>
      {contacts.map((contact, index) => {
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
                    console.log(contacts[index])          
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

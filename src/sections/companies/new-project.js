import { useEffect, useRef, useState } from 'react';
import { Box, Card, CardContent, Divider, Stack, Typography, Input, Grid, Button, TextField, SvgIcon, Autocomplete } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { COUNTRY_CODES } from 'src/utils/country-codes';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Chip from '@mui/material/Chip';
import DocumentChartBarIcon from '@heroicons/react/24/solid/DocumentChartBarIcon';
import { CustomDialog } from 'src/components/custom-dialog';


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


export const NewProject = ({ onCancel, clients, suppliers }) => {
  const theme = useTheme();

  const [project, setProjectName] = useState('')
  const [clientName, setClientName] = useState('')
  const [country, setCountry] = useState('')
  const [supplierNames, setSuppliers] = useState([''])
  const [status, setStatus] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [comments, setComments] = useState('')
  const [interest, setInterest] = useState('')
  const [editor, setEditor] = useState('')

  // contacts
  const [selectedContactIndex, setSelecteddContactIndex] = useState(null)
  const [contacts, setContacts] = useState([{ name: '', jobTitle: '', cid: Math.floor(10000000 + Math.random() * 90000000), email: '', fixTel: '', mobTel: '' }]);
  const [contactList, setContactList] = useState([])
  const [selectedContact, setSelectedContact] = useState({})
  const [contactInfo, setContactInfo] = useState([])

  const cNameRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cJobTitleRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cEmailRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cFixTelRefs = Array.from({ length: 5 }).map(() => useRef(null));
  const cMobTelRefs = Array.from({ length: 5 }).map(() => useRef(null));

  const [emptyRequired, setEmptyRequired] = useState(false)
  const [open, setOpen] = useState(true);
  const [clientList, setClientList] = useState([]);
  const [supplierList, setSupplierList] = useState([]);
  const [countryList, setCountryList] = useState([]);

  const handleContactSelection = (e, index) => {
    for (let i = 0; i < contactList.length; i++) {
      if (e.target.value === contactList[i]) {
        setSelectedContact(contactInfo[i])
        setSelecteddContactIndex(index)
      }
    }
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', jobTitle: '', email: '', fixTel: '', mobTel: '' }]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedContacts = [...contacts];
    updatedContacts[index][field] = value;
    if (value !== '') setContacts(updatedContacts);
  };

  const handleAddProject = async () => {
    onCancel()

      contacts.map((ct, i) => {
        ct.name = cNameRefs[i].current.value || cNameRefs[i].current.placeholder
        ct.jobTitle = cJobTitleRefs[i].current.value || cJobTitleRefs[i].current.placeholder
        ct.email = cEmailRefs[i].current.value || cEmailRefs[i].current.placeholder
        ct.fixTel = cFixTelRefs[i].current.value || cFixTelRefs[i].current.placeholder
        ct.mobTel = cMobTelRefs[i].current.value || cMobTelRefs[i].current.placeholder
      })


    if (project == '' || clientName == '' || country == '' || start == '' || status == '') {
      console.log('pass')
      setEmptyRequired(true)
      return ''
    }

    var countryCamelized = country.split('')[0].toUpperCase() + country.substring(1, country.length).toLowerCase()
    console.log(countryCamelized)
    var loc = COUNTRY_CODES.filter(obj => obj.name == countryCamelized)[0].code;
    var [day, month, year] = start.split('/');
    let rand = Math.floor(1000 + Math.random() * 9000);
    let pid = loc + day + month + year + rand + status.toUpperCase()
    console.log(pid)
    
  
    let newSubfolder = {
      name: project,
      client: clientName,
      country: country.toUpperCase(),
      suppliers: supplierNames,
      status: status,
      start: start,
      end: end,
      comments: comments,
      interest: interest,
      eid: Math.floor(10000000 + Math.random() * 90000000),
      dateCreation: new Date(),
      projectId: pid,
      editor: editor,
      folderId: '',
      contacts: contacts,
      folders: [],
      files: []
    };

    // Send the newSubfolder data to the server's API endpoint using POST method
    const response = await fetch('http://localhost:3001/addProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newSubfolder)
    });
  }

  useEffect(() => {
    const folderClients = []
    const countries = []
    const people = []
    const info = []

    for (let i = 0; i < clients.length; i++) {
      countries.push(clients[i].name)
      for (let j = 0; j < clients[i].folders.length; j++) {
        folderClients.push(clients[i].folders[j].name);
        if (clients[i].folders[j].contacts !== undefined) {
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

    for (let i = 0; i < suppliers.length; i++) {
      if (suppliers[i].contacts !== undefined) {
        for (let j = 0; j < suppliers[i].contacts.length; j++) {
          let cinfo = suppliers[i].contacts[j]
          if (cinfo.name !== '') {
            people.push(cinfo.name)
            info.push(cinfo)
          }
        }
      }
    }

    let sortedClientList = folderClients.sort()
    let sortedCountries = countries.sort()

    setClientList(sortedClientList)
    setCountryList(sortedCountries)
    setContactList(people)
    setContactInfo(info)

    const folderSuppliers = [];

    for (let i = 0; i < suppliers.length; i++) {
      folderSuppliers.push(suppliers[i].name);
    }
  
    setSupplierList(folderSuppliers.sort());
  }, []);

  const handleChange = (event) => {
    setClientName(event.target.value);
  };

  const handleChipChange = (event) => {
    const {
      target: { value },
    } = event;
    setSuppliers(
      typeof value === 'string' && value !== '' ? value.split(',') : value,
    );
  };

  return (
    <Card>
    {
      emptyRequired ? (
        <div>

        <CustomDialog 
          open={true} 
          title={'Required Fields are not complete'}
          desc={'Please fill in Project Name, Client Name, Country and Date'}
          btnText={'Done'}
          close={false}
        />

      </div>) : (
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
            <SvgIcon 
              sx={{width: '4%', height: '4%'}}>
              <DocumentChartBarIcon/>
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
            Project Name<b>*</b>: <Input style={{ width: '300px' }} onChange={(e) => setProjectName(e.target.value)} />
          </Typography>
        <Typography
            align="center"
            gutterBottom
            variant="body1"
          >
            Client Name<b>*</b>: 
            <Box sx={{ minWidth: 120 }}>
              <FormControl style={{ width: '200px' }}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={clientName}
                  label="Client"
                  onChange={(e) => handleChange(e)}
                >
                  {
                    clientList.map((cl) => (
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
            Country<b>*</b>: 
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
            Supplier(s)<b>*</b>: 
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={supplierNames}
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
                  {supplierList.map((sp) => (
                    <MenuItem
                      key={sp}
                      value={sp}
                      style={getStyles(sp, supplierNames, theme)}
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
            Importance: 
            <Box sx={{ minWidth: 120 }}>
            <FormControl style={{ width: '200px' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={interest}
                label="Country"
                onChange={(e) => {
                  setInterest(e.target.value)
                }}
              >
                {
                  ['Low', 'Medium', 'High'].map((cl) => (
                    <MenuItem value={cl}>{cl}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Box>
          </Typography>
          <br/>
          <Typography
            align="center"
            variant="body1"
          >
            Comments:           
              <TextField
                style={{ width: '400px' }}
                multiline
                rows={8}
                onChange={(e) => setComments(e.target.value)} />
          </Typography>
        </Grid>
        {/* Second container */}
        <Grid item xs={6}>
          <Typography
            align="center"
            gutterBottom
            variant="body1"
          >
           Status<b>*</b>: 
          <Box sx={{ minWidth: 120 }}>
            <FormControl style={{ width: '200px' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Country"
                onChange={(e) => setStatus(e.target.value)}
              >
                {
                  ['CANCELLED', 'STANDBY', 'ONGOING', 'COMPLETED'].map((cl) => (
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
            Start Date<b>*</b>: <Input onChange={(e) => setStart(e.target.value)} />
          </Typography>
          <Typography
            align="center"
            variant="body1"
          >
            End Date: <Input onChange={(e) => setEnd(e.target.value)} />
          </Typography>
          <br/>
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
    <br/>
    <Typography
      align="center"
      variant="body1"
    >
      Project Form Created By: <Input onChange={(e) => setEditor(e.target.value)}/>
    </Typography>
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
          <b>*</b> Required Field(s)
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
              <Button onClick={handleAddProject}>Add</Button>
            </Typography>
          </Stack>
        </Stack>
      </Card>
      )
    }
    </Card>
  );
};

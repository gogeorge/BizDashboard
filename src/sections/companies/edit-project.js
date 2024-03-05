import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import DocumentChartBarIcon from '@heroicons/react/24/solid/DocumentChartBarIcon';
import { Chip, OutlinedInput, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Input, Grid, Button, TextField, FormControl, Select, MenuItem, Autocomplete } from '@mui/material';
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
  }
}

export const EditProject = ({ onCancel, data, lists }) => {
    const theme = useTheme();
    const [project, setProjectName] = useState(data.name)
    const [clientName, setClientName] = useState(data.client)
    const [country, setCountry] = useState(data.country)
    const [suppliers, setSuppliers] = useState([...data.suppliers])
    const [status, setStatus] = useState(data.status)
    const [start, setStart] = useState(data.start)
    const [end, setEnd] = useState(data.end)
    const [comments, setComments] = useState(data.comments)
    const [interest, setInterest] = useState(data.interest)
    const [editor, setEditor] = useState(data.editor)

    // contacts
    const [selectedContactIndex, setSelecteddContactIndex] = useState(null)
    const [contacts, setContacts] = useState(data.contacts);
    const [contactList, setContactList] = useState([])
    const [selectedContact, setSelectedContact] = useState({})
    const [contactInfo, setContactInfo] = useState([])

    const [countryList, setCountryList] = useState([]);
    const [clientList, setClientList] = useState([]);
    const [supplierList, setSupplierList] = useState([]);

    const [pidChanges, setPIDChange] = useState([''])

    const cNameRefs = Array.from({ length: 5 }).map(() => useRef(null));
    const cJobTitleRefs = Array.from({ length: 5 }).map(() => useRef(null));
    const cEmailRefs = Array.from({ length: 5 }).map(() => useRef(null));
    const cFixTelRefs = Array.from({ length: 5 }).map(() => useRef(null));
    const cMobTelRefs = Array.from({ length: 5 }).map(() => useRef(null));

    const handleAddContact = () => {
      setContacts([...contacts, { name: '', jobTitle: '',  email: '', fixTel: '', mobTel: '' }]);
    };
  
    const handleDeleteContact = (index) => {
      const updatedContacts = [...contacts];
      updatedContacts.splice(index, 1);
      setContacts(updatedContacts.sort());
    };
  
    const handleInputChange = (index, field, value) => {
      const updatedContacts = [...contacts];
      updatedContacts[index][field] = value;
      if (value !== '') setContacts(updatedContacts.sort());
    };

    const handleContactSelection = (e, index) => {
      for (let i = 0; i < contactList.length; i++) {
        if (e.target.value === contactList[i]) {
          setSelectedContact(contactInfo[i])
          setSelecteddContactIndex(index)
        }
      }
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

      let pid = ''

      if (country !== '' && status !== '' && date !== null) {
        console.log('pass')
        let npid = data.projectId.replace(/\D/g, '');
        let rpid = npid.substring(npid.length - 4)
        var [day, month, year] = date.split('/');

        var countryCamelized = country.split('')[0].toUpperCase() + country.substring(1, country.length).toLowerCase()
        var loc = COUNTRY_CODES.filter(obj => obj.name == countryCamelized)[0].code;

        pid = loc + day + month + year + rpid + status.toUpperCase()
      }

      let modPID = data.projectId; // Initialize modPID with the original project ID

      if (pidChanges.includes('country')) {
        console.log('country changed');
        var countryCamelized = country.charAt(0).toUpperCase() + country.slice(1).toLowerCase();
        console.log(countryCamelized)
        const loc = COUNTRY_CODES.filter(obj => obj.name === countryCamelized)[0].code;
        modPID = loc + modPID.slice(2);
      }
      
      if (pidChanges.includes('date')) {
        console.log('date changed');
        var [day, month, year] = date.split('/');
        const modDate = day + month + year;
        modPID = modPID.slice(0, 2) + modDate + modPID.slice(9);
      }
      
      if (pidChanges.includes('status')) {
        console.log('status changed');
        const modStatus = data.projectId.slice(15);
        modPID = modPID.slice(0, 14) + modStatus;
      }
      
      console.log(modPID); // The final modified project ID

      let newSubfolder = {
          name: project == '' ? data.name : project,
          client: clientName == '' ? data.client : clientName,
          country: country == '' ? data.country.toUpperCase() : country.toUpperCase(),
          suppliers: suppliers == '' ? data.suppliers : suppliers,
          status: status == '' ? data.status : status,
          start: start == '' ? data.start : start,
          end: end == '' ? data.end : end,
          comments: comments == '' ? data.comments : comments,
          interest: interest == '' ? data.interest : interest,
          editor: editor == '' ? data.editor : editor,
          eid: data.eid,
          folderId: data.folderId,
          projectId: pid == '' ? (pidChanges.length > 0 ? modPID : data.projectId) : pid,
          contacts: contacts,
          folders: data.folders,
          files: data.files
      };

      // Send the newSubfolder data to the server's API endpoint using POST method
      const response = await fetch('http://localhost:3001/editProject', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(newSubfolder)
      });

    }

    useEffect(() => {

        const projects = lists.folders[0].folders
        const clients = lists.folders[1].folders
        const suppliers = lists.folders[2].folders

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
          
        const folderSuppliers = [];
    
        for (let i = 0; i < suppliers.length; i++) {
          folderSuppliers.push(suppliers[i].name);
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

        for (let i = 0; i < projects.length; i++) {
          if (projects[i].contacts !== undefined) {
            for (let j = 0; j < projects[i].contacts.length; j++) {
              let cinfo = projects[i].contacts[j]
              if (cinfo.name !== '') {
                people.push(cinfo.name)
                info.push(cinfo)
              }
            }
          }
        }
      
        setClientList(folderClients.sort());
        setSupplierList(folderSuppliers.sort())
        setCountryList(countries.sort())
        setContactList(people)
        setContactInfo(info)

    }, [])

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
            Project Name: <Input style={{ width: '300px' }} onChange={(e) => setProjectName(e.target.value)} value={project}/>
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
            Country:
            <Box sx={{ minWidth: 120 }}>
                <FormControl style={{ width: '200px' }}>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={country}
                    label="Country"
                    onChange={(e) => {
                      setCountry(e.target.value)
                      setPIDChange([...pidChanges, 'country'])
                    }}
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
              {console.log('usestate sup ', suppliers)}
              <FormControl sx={{ m: 1, width: 300 }}>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  value={suppliers.length > 1 ? suppliers : [suppliers, '']}
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
                      style={getStyles(sp, suppliers, theme)}
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
            Comments: <TextField 
                            style={{ width: '400px' }}
                            multiline
                            rows={8}
                            onChange={(e) => setComments(e.target.value)} 
                            value={comments}/>

        </Typography>
        </Grid>

        {/* Second container */}
        <Grid item xs={6}>
        <Typography
            align="center"
            variant="body1"
        >
            Status: 
            <Box sx={{ minWidth: 120 }}>
            <FormControl style={{ width: '200px' }}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={status}
                label="Country"
                onChange={(e) => {
                  setStatus(e.target.value)
                  setPIDChange([...pidChanges, 'status'])
                }}
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
            Start Date: <Input onChange={(e) => setStart(e.target.value)} value={start}/>
        </Typography>
        <Typography
            align="center"
            variant="body1"
        >
            End Date: <Input onChange={(e) => setEnd(e.target.value)} value={end}/>
        </Typography>

          <br/>
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
        <Typography
            align="center"
            variant="body1"
          >
            Project Form Created By: <Input onChange={(e) => setEditor(e.target.value)} value={editor}/>
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
    );
};
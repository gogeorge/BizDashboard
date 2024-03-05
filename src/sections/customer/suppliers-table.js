import { useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  CardContent,
  Button,
  Input,
  SvgIcon,
  Grid,
  Paper,
} from '@mui/material';
import { EditSupplier } from '../companies/edit-supplier';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import BuildingOffice2Icon from '@heroicons/react/24/solid/BuildingOffice2Icon';
import UserCircleIcon from '@heroicons/react/24/solid/UserCircleIcon';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'


export const SuppliersTable = (props) => {
  const {
    data,
    clients
  } = props;

  const [cardVisibility, setCardVisibility] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [addClient, setAddClient] = useState(false)
  const [selectedClient, setSelectedClient] = useState('')
  const [projects, setProjects] = useState([{}])
  const [suppliers, setSuppliers] = useState([{}])
  const [folders, setFolders] = useState([{}])
  const [files, setFiles] = useState([{}])
  const [selectedProjects, setSelectedProjects] = useState([])
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [handleSubmit, setHandleSumbit] = useState(false)
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [DBWarning, setDBWarning] = useState(false)



  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
    setPage(0); // Reset page to the first page
  };


  const sortedData = [...data].sort((a, b) => {
    if (orderBy === 'date') {
      return (order === 'asc' ? 1 : -1) * (new Date(a.date) - new Date(b.date));
    }
    
    // Check if the property exists in both objects
    if (a[orderBy] && b[orderBy]) {
      return (order === 'asc' ? 1 : -1) * (a[orderBy].localeCompare(b[orderBy]));
    }
    
    if (orderBy === 'country') {
      const countryComparison = (a.country || '').localeCompare(b.country || '');
      if (countryComparison !== 0 && a[orderBy] && b[orderBy]) {
        return (order === 'asc' ? 1 : -1) * (a[orderBy].localeCompare(b[orderBy]));
      }
    }

    if (orderBy === 'field') {
      const countryComparison = (a.field || '').localeCompare(b.field || '');
      if (countryComparison !== 0 && a[orderBy] && b[orderBy]) {
        return (order === 'asc' ? 1 : -1) * (a[orderBy].localeCompare(b[orderBy]));
      }
    }
    // Handle the case where the property doesn't exist in one of the objects
    return 0;
  });

  const load = () => {
    if (data.folders != undefined) {
      console.log(data)
      setProjects(data.folders[0].folders)
      setSuppliers(data.folders[4].folders)
    }
  }

  useEffect(() => {
    load()
  }, []);

  const getProject = (val) => {
    console.log('pass', projects, selectedClient)
    const filteredJsonObjects = projects.filter(obj => obj.client === val);
    // selProjects = filteredJsonObjects
    setSelectedProjects(filteredJsonObjects)
    console.log(filteredJsonObjects)
  }

  const getFolders = (val) => {
    setFolders(val.folders)
  }

  const getFiles = (val) => {
    setFiles(val.files)
  }

  const handleButtonClick = () => {
    // Trigger a click event on the hidden file input
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const fileData = e.dataTransfer.files[0];
    if (fileData) {
      const file = {
        preview: URL.createObjectURL(fileData),
        data: fileData,
      };
      setFile(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    var formData = new FormData();
    console.log(file.data)
    formData.append("myFile", file.data);
    formData.append("folder", selectedRowIndex.folderId);
    formData.append("companyType", 3)
    formData.append('country', selectedRowIndex.country)
    const response = await fetch("http://localhost:3001/uploadDrive", {
      method: "POST",
      body: formData,
    });
    const responseWithBody = await response.json();
    if (response) setUrl(responseWithBody.publicUrl);
  };
  const handleFileChange = (e) => {
    if (e.target && e.target.files && e.target.files[0]) {
      const file = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
      };
      setFile(file)
    }
  };


  const reload = async () => {
    const response = await fetch('http://localhost:3001/reload', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'reload'})
    });
  }

  const objectReload = async (obj) => {
    const response = await fetch('http://localhost:3001/objectReload', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: { obj: JSON.stringify(obj), cid: 4 }
    });
  }


  const handleDeleteClient = async (obj) => {
    console.log(obj)
    const response = await fetch('http://localhost:3001/deleteSupplier', {
      method: 'POST', // Change the method to DELETE
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj) // If you don't need to send a body for DELETE, you can remove this line
    });
  }

  return (
    <Card>
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
            <TableCell>
              <TableSortLabel
                active={orderBy === 'country'}
                direction={orderBy === 'country' ? order : 'asc'}
                onClick={() => handleSort('country')}
              >
                Country
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'date'}
                direction={orderBy === 'date' ? order : 'asc'}
                onClick={() => handleSort('date')}
              >
                Date
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'field'}
                direction={orderBy === 'field' ? order : 'asc'}
                onClick={() => handleSort('field')}
              >
                Field
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {sortedData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item, index) => (
              <TableRow 
                key={item.folderId}
                onClick={() => {
                  load()
                  setSelectedRowIndex(item)
                  setCardVisibility(true)
                  setSelectedClient()
                  setDBWarning(false)
                  setHandleSumbit(false)
                  setFile(null)
                  getProject(item.name)
                  getFolders(item)
                  getFiles(item)

              }}
                > {/* Use a unique identifier like 'id' */}
                <TableCell>
                </TableCell>
                <TableCell>
                  <SvgIcon sx={{ 
                    position: 'relative',
                    top: '6px',
                    right: '7px'
                  }}>
                    <BuildingOffice2Icon />
                  </SvgIcon> 
                  {item.name}
                </TableCell>
                <TableCell>{item.country}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.field}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
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

      {/* {getProject()} */}
      {cardVisibility && selectedRowIndex !== null ? (
        <div>
          {DBWarning ? (
            <Typography color={'red'}>WARNING: For any changes on folder or files in Google Drive, you need to click <b>Save DB Changes</b> at the bottom of this page</Typography>
          ) : null}
          <Card style={{ display: 'flex' }}>
          {/* <Button variant='contained' color={'red'}>x</Button> */}
          <CardContent>
            {/* Customize this section to display the details you want */}
            <Typography 
              variant="h5"
              style={{ cursor: "pointer" }}
              onClick={() => window.open('https://drive.google.com/drive/folders/' + selectedRowIndex.folderId)}
            >
              {selectedRowIndex.name}
            </Typography>               <Typography variant="body1">Website: {selectedRowIndex.webpage}</Typography>
            <Typography variant="body1">Country: {selectedRowIndex.country}</Typography>
            <Typography variant="body1">Agency Countries: {selectedRowIndex.agencyCountries}</Typography>
            <Typography variant="body1">Location: {selectedRowIndex.address}</Typography>
            <Typography variant="body1">VAT: {selectedRowIndex.vat}</Typography>
            <Typography variant="body1">Field: {selectedRowIndex.field}</Typography>
            <Typography variant="body1">Contacts:</Typography>
            {selectedRowIndex.contacts.map(cnt => {
              return (<Card key={cnt.cid} style={{ padding: 10 }}>
                <SvgIcon>
                  <UserCircleIcon />
                </SvgIcon>
                <Typography variant='body1' sx={{ textIndent: '20px' }}>
                  Name: {cnt.name} <br/>
                </Typography>
                <Typography variant='body1' sx={{ textIndent: '20px' }}>
                Job Title: {cnt.jobTitle} <br/>
                </Typography>
                <Typography variant='body1' sx={{ textIndent: '20px' }}>
                Fix Tel.: {cnt.fixTel} <br/>
                </Typography>
                <Typography variant='body1' sx={{ textIndent: '20px' }}>
                  Mobile Tel.: {cnt.mobTel} <br/>
                </Typography>
                <Typography variant='body1' sx={{ textIndent: '20px' }}>
                  Email: {cnt.email} <br/>
                </Typography>
              </Card>)
            })}
          </CardContent>
          <CardContent>
            <Typography variant="h5">Folders</Typography>
            {
              folders != undefined ? (
                folders.map((fol) => {
                  return (
                  <Card
                    key={fol.folderId}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      window.open('https://drive.google.com/drive/folders/' + fol.folderId)
                      setDBWarning(false)
                    }}
                    >
                    <CardContent>
                      <Typography variant="h6">{fol.name}</Typography>
                      <Typography variant="body1">{fol.folderId}</Typography>
                    </CardContent>
                  </Card>)
                })
              ) : null
            }
          </CardContent>
          <CardContent>
            <Typography variant="h5">Files</Typography> 
            {
            files != undefined ? (
              files.map((fi) => {
                return ( 
                <Card 
                  key={fi.id}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    window.open("https://drive.google.com/file/d/" + fi.id + "/view")
                    setDBWarning(false)
                  }}
                  >
                  <CardContent>
                    <Typography variant="h6">{fi.name}</Typography>
                    <Typography variant="body1">{fi.id}</Typography>
                  </CardContent>
                </Card>)
              })
            ) : null
            }

          </CardContent>
          <CardContent>

          </CardContent>
          </Card>
          <br/>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ height: '100%', padding: '20px', textAlign: 'center' }}>
                <div style={{position: 'relative', top: 25}}>
                <Button color='secondary' onClick={() => setCardVisibility(false)}>Cancel</Button>
                <Button onClick={() => {
                setAddClient(true)
                setCardVisibility(false)
                }}>Edit</Button>
                <Button onClick={() => {setOpen(true)}} autoFocus>Reload DB</Button>
                {
                    open ? (
                      <Dialog
                        open={open}
                        onClose={() => setOpen(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Warning"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Please contact the admin before reloading the database.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpen(false)} color='secondary'>Cancel</Button>
                          <Button onClick={() => {
                            setOpen(false)
                            reload()
                          }} autoFocus>
                            Reload DB
                          </Button>
                        </DialogActions>
                      </Dialog>
                    ) : null
                  }
                 <Button onClick={() => {setOpenDel(true)}}>Delete</Button>
                {
                openDel ? (
                      <Dialog
                        open={openDel}
                        onClose={() => setOpenDel(false)}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Warning"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete the {selectedRowIndex.name} client? This action cannot be undone.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenDel(false)} color='secondary'>Cancel</Button>
                          <Button onClick={() => {
                            setOpenDel(false)
                            handleDeleteClient(selectedRowIndex)
                          }} autoFocus>
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    ) : null
                  }
                <Button onClick={() => objectReload(selectedRowIndex)}>Save DB Changes</Button>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
              <form onSubmit={handleUpload}>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{
                    border: isDragOver ? '2px dashed #1976D2' : '2px dashed #9E9E9E',
                    padding: '20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {/* <InputLabel htmlFor="file-input">Choose a file</InputLabel> */}
                  <Input
                    type="file"
                    id="file-input"
                    inputRef={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="contained"
                    color={isDragOver ? 'secondary' : 'primary'}
                    onClick={handleButtonClick}
                  >
                    Browse
                  </Button>
                  <Button type="submit" onClick={() => setHandleSumbit(true)}>Submit</Button>

                  {isDragOver && <Typography>Drop the file here</Typography>}
                  {handleSubmit ? (
                    <Typography>
                      File submitted
                      <SvgIcon sx={{ position: 'relative', top: 5, left: 3, color: 'green' }}>
                        <CheckCircleIcon />
                      </SvgIcon>
                    </Typography>
                  ) : file !== null ? (
                    <Typography>{file.data.name}</Typography>
                  ) : null}
                </div>
              </form>
              </Paper>
            </Grid>
          </Grid>
        </div>
        
      ) : addClient ? (
        <EditSupplier 
          onCancel={() => {
            setAddClient(false)
            load()
            }
          } 
          data={selectedRowIndex} 
          suppliers={suppliers} 
          clients={clients}/>
      ) : null
      }
    </Card>
  );
};

















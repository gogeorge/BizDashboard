import { useRef } from 'react';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon, CardContent, Typography, Input, Button, Grid, Paper } from '@mui/material';
import { useState } from 'react';
import { EditProject } from 'src/sections/companies/edit-project';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import UserCircleIcon from '@heroicons/react/24/solid/UserCircleIcon';
import CheckCircleIcon from '@heroicons/react/24/solid/CheckCircleIcon'


export const ProjectSearch = ({ data, lists }) => {

  const [value, setValue] = useState('')
  const [clientResult, setClientResult] = useState([{}])
  const [result, setResult] = useState(false)
  const [folders, setFolders] = useState([{}])
  const [files, setFiles] = useState([{}])
  const [DBWarning, setDBWarning] = useState(false)
  const [addClient, setAddClient] = useState(false)
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [cardVisibility, setCardVisibility] = useState(false);
  const [open, setOpen] = useState(false);
  const [openDel, setOpenDel] = useState(false);
  const [handleSubmit, setHandleSumbit] = useState(false)
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [expanded, setExpanded] = useState(0);

  const calculateLevenshteinDistance = (a, b) => {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
  
    const matrix = [];
  
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }
  
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }
  
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
  
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // Deletion
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j - 1] + cost // Substitution
        );
      }
    }
  
    return matrix[b.length][a.length];
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

  const handleKeyPress = (e) => {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    setResult(false)
    setCardVisibility(true)

    let cli = []
    let fol = []
    let fil = []
    for (let i = 0; i < data.length; i++) {
      let project = data[i].name
      let projectString = project.replace(/\s/g, '').toUpperCase()
      let searchValue = value.replace(/\s/g, '').toUpperCase()
      console.log(searchValue, projectString)
      if (projectString.includes(searchValue) || calculateLevenshteinDistance(project, value.toUpperCase())<=2) {
        let searchSimilarity = calculateLevenshteinDistance(project, value.toUpperCase())
        console.log(searchSimilarity)
        console.log('FOUND: ', i, project)
        console.log('di :', data[i])
        // setClientResult([...clientResult, data[i]])
        cli.push(data[i])
        fol.push(data[i])
        fil.push(data[i])
        
        // getFolders([...folders, data[i]])
        // getFiles([...files, data[i]])
        // console.log(clientResult)
        setResult(true)
      }
    }
    console.log(cli)
    setClientResult(cli)
    setFolders(fol)
    setFiles(fil)
  }


  const handleUpload = async (e) => {
    e.preventDefault();
    var formData = new FormData();
    console.log(file.data)
    formData.append("myFile", file.data);
    formData.append("folder", clientResult[expanded].folderId);
    formData.append("companyType", 3)
    formData.append('country', clientResult[expanded].country)
    const response = await fetch("http://localhost:3001/uploadDrive", {
      method: "POST",
      body: formData,
    });
    const responseWithBody = await response.json();
    if (response) setUrl(responseWithBody.publicUrl);
  };
  const handleFileChange = (e) => {
    console.log(e.target.type)
    const file = {
      preview: URL.createObjectURL(e.target.files[0]),
      data: e.target.files[0],
    };
    setFile(file);
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
      body: JSON.stringify(obj)
    });
  }

  const handleDeleteClient = async (obj) => {
    const response = await fetch('http://localhost:3001/deleteProject', {
      method: 'POST', // Change the method to DELETE
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(obj) 
    });
  }

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search project"
        onKeyPress={(e) => handleKeyPress(e)}
        onChange={(e) => setValue(e.target.value)}
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon
              color="action"
              fontSize="small"
              onClick={() => handleSearch()}
            >
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 500 }}
      />
      {
        !result && cardVisibility ? (
          <Typography color={'red'}>Result not found</Typography>
        ) : null
      }
      {
        result && cardVisibility ? (
          <div>
          {DBWarning ? (
            <Typography color={'red'}>WARNING: For any changes on folder or files in Google Drive, you need to click <b>Save DB Changes</b> at the bottom of this page</Typography>
          ) : null}
          {console.log('pre: ', clientResult.map(c => console.log(c)))}
       {
          clientResult.map((cl, i) => {
          return (<Card style={{ display: 'flex' }}>
            <br/>
              {expanded == i ? (
                <div>
              <CardContent>
                <Typography 
                  variant="h5"
                  onClick={() => { window.open('https://drive.google.com/drive/folders/' + cl.folderId) }}
                  >
                  {cl.name}
                </Typography>
                <Typography variant="h6">{cl.projectId}</Typography>
                <Typography variant="body1" color={'grey'}>{cl.clientQuoId}</Typography>
                <br/>
                <Typography variant="body1">Client: {cl.client}</Typography>
                <Typography variant="body1">Country: {cl.country}</Typography>
                <Typography variant="body1">Supplier(s): {cl.suppliers}</Typography>
                <Typography variant="body1">Date: {cl.date}</Typography>
                <Typography variant="body1">Equipment: {cl.equipment}</Typography>
                <Typography variant="body1">Status: {cl.status}</Typography>
                <Typography variant="body1">Start: {cl.start}</Typography>
                <Typography variant="body1">End: {cl.end}</Typography>
                <Typography variant="body1">Point of Interest: {cl.poi}</Typography>
                <Typography variant="body1">Meetings: {cl.meetings}</Typography>
                <Typography variant="body1">Comments: {cl.comments}</Typography>
                <Typography variant="body1">Interest: {cl.interest}</Typography>
                <Typography variant="body1">Contacts:</Typography>
                {cl.contacts.map(cnt => {
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
                folders[i].folders.map((fol) => {
                  return ( 
                  <Card 
                    key={fol.folderId}
                    onClick={(e) => {
                      window.open('https://drive.google.com/drive/folders/' + fol.folderId)
                      setDBWarning(true)
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
              files[i].files.map((fi) => {
                return ( 
                <Card 
                  key={fi.id}
                  onClick={(e) => {window.open("https://drive.google.com/file/d/" + fi.id + "/view")                     
                  setDBWarning(true)
                }}
                  >
                  <CardContent>
                    <Typography variant="h6">{fi.file}</Typography>
                    <Typography variant="body1">{fi.id}</Typography>
                  </CardContent>
                </Card>)
              })
            ) : null
            }
          </CardContent>
          <br/>
          <Grid container spacing={2} style={{ width: '135%'}}>
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
                            Are you sure you want to delete the {clientResult[expanded].name} project? This action cannot be undone.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={() => setOpenDel(false)} color='secondary'>Cancel</Button>
                          <Button onClick={() => {
                            setOpenDel(false)
                            handleDeleteClient(clientResult[expanded])
                          }} autoFocus>
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    ) : null
                  }
                <Button onClick={() => objectReload(clientResult[expanded])}>Save DB Changes</Button>
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
              ) : (
                <div>
                <CardContent>
              <Typography 
                variant="h5"
                onClick={() => { window.open('https://drive.google.com/drive/folders/' + cl.folderId) }}
                >
                {cl.name}
              </Typography>
              <Typography variant="h6">{cl.projectId}</Typography>
            </CardContent>
            <Grid container spacing={2}>
                    <Grid item xs={6}>
                    <CardContent>
            <Typography variant="h5">Folders</Typography>
            {
              folders[i].folders.length > 0 ? (
                <div>
                  <Card 
                    key={folders[i].folders[0].folderId}
                    onClick={(e) => {
                      window.open('https://drive.google.com/drive/folders/' + folders[i].folders[0].folderId)
                      setDBWarning(true)
                    }}
                    >
                    <CardContent>
                      <Typography variant="h6">{folders[i].folders[0].name}</Typography>
                      <Typography variant="body1">{folders[i].folders[0].folderId}</Typography>
                    </CardContent>
                  </Card>
                </div>
            
              ) : null
            }
          </CardContent>
                    </Grid>
                    <Grid item xs={6}>
                    <CardContent>
            <Typography variant="h5">Files</Typography> 
            {
              files[0].files.length > 0 ? (
                <Card 
                  key={files[0].files[0].id}
                  onClick={(e) => {window.open("https://drive.google.com/file/d/" + files[0].files[0].id + "/view")                     
                  setDBWarning(true)
                }}
                  >
                  {console.log(i, files[0].files[0].file)}
                  <CardContent>
                    <Typography variant="h6">{files[0].files[0].file}</Typography>
                    <Typography variant="body1">{files[0].files[0].id}</Typography>
                  </CardContent>
                </Card>
          ) : null}

          </CardContent>
                    </Grid>
                  </Grid>

                  <center><Typography onClick={() => setExpanded(i)} variant='body1'><b>. . .</b></Typography></center><br/>

            </div>
              )
          }
          </Card>)
          })
        }

          </div>
      ) : addClient ? (
        <EditProject onCancel={() => setAddClient(false)} data={clientResult[expanded]} lists={lists}/>
      ) : null
      }
    </Card>

  )
};



































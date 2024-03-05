import http from 'http';
import url from 'url';
import fs from 'fs';
import { promises as f } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import bodyParser from 'body-parser';
import Multer from "multer";


const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly',
                'https://www.googleapis.com/auth/drive',
                'https://www.googleapis.com/auth/drive.file'
               ]


// these files need to be created, look into Google Drive API for more info
const TOKEN_PATH = join(cwd(), 'token.json');
const CREDENTIALS_PATH = join(cwd(), 'credentials.json');


const fileName = 'data.json'

let users = {
    "admin": [
      {
      "user" : "demo@email.com",
      "password" : "demo1234"
      }
    ]
}

let foundId = ''
let backupFlag = true

async function initBackup() {
    const data = await fs.promises.readFile(fileName, 'utf8');
    const auth = authenticateGoogle();
    const fid = '<backup-gdrive-folder-id>';
    await dailyBackup(data, auth, fid);
    backupFlag = false;
}


// uncomment the following line to automatically backup your json file
// initBackup();


const server = http.createServer(function(req, res) {
    try {
        // Parse the request URL
        const parsedUrl = url.parse(req.url, true);

        // Handle CORS preflight requests
        if (req.method === 'OPTIONS') {
            const allowedOrigin = req.headers.origin || '*';
            res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
            res.writeHead(204); // No content for preflight requests
            res.end();
            return;
        }

        // Handle regular requests
        const allowedOrigin = req.headers.origin || '*';
        res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        
        bodyParser.json()(req, res, function() {

            if (parsedUrl.pathname === '/api' && req.method === 'GET') {
                console.log('db response successful')
                fs.readFile(fileName, 'utf8', (err, data) => {
                    res.end(data)
                });
            } 

            if (parsedUrl.pathname === '/auth' && req.method === 'GET') {
                res.end(JSON.stringify(users))
            } 

            if (parsedUrl.pathname === '/objectReload' && req.method === 'POST') {
                searchInJSONFile({}, req.body.obj, req.body.cid)
            }

            if (parsedUrl.pathname === '/addProject' && req.method === 'POST') {
                let newProject = req.body
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data)
                    DriveAddProject(newProject, folderHierarchy)
                });
            }

            // TO FIX: makes a new json object instead of editing original (for name edit)
            if (parsedUrl.pathname === '/editProject' && req.method === 'POST') {
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data)
                    let editProject = req.body
                    for (let i = 0; i < folderHierarchy.folders[0].folders.length; i++) {
                        if (folderHierarchy.folders[0].folders[i].folderId == editProject.folderId) {
                            console.log(folderHierarchy.folders[0].folders[i].eid, editProject.eid)
                            folderHierarchy.folders[0].folders[i] = editProject
                            console.log(editProject)
                            DriveEditProject(editProject, folderHierarchy)
                            break;
                        }
                    }
                });
            }

            if (parsedUrl.pathname === '/deleteProject' && req.method === 'POST') {
                let delProject = req.body
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data)
                    folderHierarchy.folders[0].folders = folderHierarchy.folders[0].folders.filter(obj => obj.eid !== delProject.eid)
                    writeFilePromise(folderHierarchy)
                        .then(() => {
                            return DriveDeleteProject(delProject);
                        })
                })
            }

            if (parsedUrl.pathname === '/addClient' && req.method === 'POST') {
                let newClient = req.body; // The data sent from the client
                const loc = req.body.country
                fs.readFile(fileName, 'utf8', (err, data) => {
                    console.log(loc)
                    var locnr = 0
                    let folderHierarchy = JSON.parse(data);
    
                    for (let i = 0; i < folderHierarchy.folders[1].folders.length; i++) {
                        if (folderHierarchy.folders[1].folders[i].name == loc) {
                            locnr = i
                            folderHierarchy.folders[1].folders[i].folders.push(newClient);
                            writeFilePromise(folderHierarchy)
                                .then(() => {
                                    return DriveAddClient(newClient, folderHierarchy, locnr);
                                })
                            break;
                        
                        }
                    }
                })
            }
            
            if (parsedUrl.pathname === '/editClient' && req.method === 'POST') {
                let editClient = req.body; 
                const loc = req.body.country
                console.log('editlcient')
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);

                    for (let i = 0; i < folderHierarchy.folders[1].folders.length; i++) {
                        if (folderHierarchy.folders[1].folders[i].name == loc) {
                            console.log('cntry: ', loc)
                            for (let j = 0; j < folderHierarchy.folders[1].folders[i].folders.length; j++) {
                                if (folderHierarchy.folders[1].folders[i].folders[j].folderId == editClient.folderId) {
                                    folderHierarchy.folders[1].folders[i].folders[j] = editClient
                                    console.log(editClient)
                                    writeFilePromise(folderHierarchy)
                                    .then(() => {
                                        return DriveEditClient(editClient);
                                    })
                                    break
                                }
                            }
                        }
                    }
                })
            }
            
            if (parsedUrl.pathname === '/deleteClient' && req.method === 'POST') {
                let delClient = req.body
                let loc = req.body.country
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data)
                    let clients = folderHierarchy.folders[1].folders
                    for (let i = 0; i < clients.length; i++) {
                        if (clients[i].name == loc) {
                            let selectedCountry = folderHierarchy.folders[1].folders[i].folders
                            folderHierarchy.folders[1].folders[i].folders = selectedCountry.filter(obj => obj.folderId !== delClient.folderId)
                            writeFilePromise(folderHierarchy)
                            .then(() => {
                                return DriveDeleteClient(delClient)
                            })
                        }
                    }   
                })
            }
            
            
            if (parsedUrl.pathname === '/addCountry' && req.method === 'POST') {
                let country = req.body.country

                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);
                    DriveAddCountry(country, folderHierarchy)
                })

                res.end(JSON.stringify({ message: 'Country added successfully', country: country }));
            }
            
            
            if (parsedUrl.pathname === '/addSupplier' && req.method === 'POST') {
                const newSupplier = req.body; // The data sent from the client

                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);
                    DriveAddSupplier(newSupplier, folderHierarchy)
                })
            }
            
            if (parsedUrl.pathname === '/editSupplier' && req.method === 'POST') {
                const editSupplier = req.body;

                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);
                
                    for (let i = 0; i < folderHierarchy.folders[2].folders.length; i++) {
                        if (folderHierarchy.folders[2].folders[i].folderId == editSupplier.folderId) {
                            folderHierarchy.folders[2].folders[i] = editSupplier
                            writeFilePromise(folderHierarchy)
                            .then(() => {
                                return DriveEditSupplier(editSupplier)
                            })
                            break
                        }
                    } 
                })
            }
            
            if (parsedUrl.pathname === '/deleteSupplier' && req.method === 'POST') {
                let delSupplier = req.body
                
                fs.readFile(fileName, 'utf8', (err, data) => {
                    const folderHierarchy = JSON.parse(data);
                    let suppliers = folderHierarchy.folders[2].folders
                    for (let i = 0; i < suppliers.length; i++) {
                        if (suppliers[i].name == delSupplier.name) {
                            folderHierarchy.folders[2].folders = folderHierarchy.folders[2].folders.filter(obj => obj.folderId !== delSupplier.folderId)
                            writeFilePromise(folderHierarchy)
                            .then(() => {
                                return DriveDeleteSupplier(delSupplier)
                            })
                            break
                        }
                    }
                })
            }

            if (parsedUrl.pathname === '/uploadDrive' && req.method === 'POST') {
                console.log('file: ' + req.file.name)
                console.log('fid: ' + req.body.folder)
                console.log('type', req.body.companyType)
                console.log('country', req.body.country)
                console.log('pid', req.body.pid)
              
                let folder = req.body.folder
                let id = req.body.companyType
                let country = req.body.country
                let pid = req.body.pid

                let fileData = { file: req.file.filename, id: response.data.id }

                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data)
                    if (id == 3) {
                        for (let i = 0; i < folderHierarchy.folders[id].folders.length; i++) {
                          if (folderHierarchy.folders[id].folders[i].name == country) {
                            for (let j = 0; j < folderHierarchy.folders[id].folders[i].folders.length; j++) {
                              if (folderHierarchy.folders[id].folders[i].folders[j].folderId == folder) {
                                folderHierarchy.folders[id].folders[i].folders[j].files.push(fileData)
                                writeFilePromise(folderHierarchy)
                                .then(() => {
                                    return DriveUpload(req.file, folder, pid)
                                })
                                break
                              }
                            }
                          }
                        }
                    } else if (id == 4) {
                        for (let i = 0; i < folderHierarchy.folders[id].folders.length; i++) {
                          if (folderHierarchy.folders[id].folders[i].folderId == folder) {
                            folderHierarchy.folders[id].folders[i].files.push(fileData)
                            write
                            break
                          }
                        }
                    } else if (id == 0) {
                        for (let i = 0; i < folderHierarchy.folders[id].folders.length; i++) {
                          if (folderHierarchy.folders[id].folders[i].folderId == folder) {
                            let projectFileData = { file: req.file.filename.split('.')[0] + ' ' + pid + '.' + req.file.filename.split('.')[1], id: response.data.id }
                            folderHierarchy.folders[id].folders[i].files.push(projectFileData)
                            break
                          }
                        }
                    }
                })
                
            
            }

        });
        

    } catch (error) {
        // Log the error
        console.error(error);

        // Send a 500 Internal Server Error response
        res.writeHead(500, { 'Content-Type': 'application/json' });
        const response = JSON.stringify({ error: "caught error: " + error });
        res.end(response);
    }
});

server.listen(3001);

///////////////// Secondary functions ///////////////// 

const multer = Multer({
    storage: Multer.diskStorage({
        destination: function (req, file, callback) {
        callback(null, `./uploads`);
        },
        filename: function (req, file, callback) {
        callback(null, file.originalname);
        },
    }),
    limits: {
        fileSize: 500 * 1024 * 1024,
    },
});

const authenticateGoogle = () => {
    const auth = new google.auth.GoogleAuth({
        keyFile: `./service-account.json`,
        scopes: "https://www.googleapis.com/auth/drive",
    });
    return auth;
};

const uploadToGoogleDrive = async (file, auth, folder, pid) => {
    console.log(pid)
    const fileMetadata = {
        name: pid == undefined ? file.filename : file.filename.split('.')[0] + ' ' + pid, 
        parents: [folder],
    };
    
    const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
    };
    
    const driveService = google.drive({ version: "v3", auth });
    
    const response = await driveService.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
    });
    
    console.log(response.data.id)
    
    return response;
};


async function createFolder(name, parentId, authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient });

  const fileMetadata = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: parentId ? [parentId] : [], // Use 'parents' to specify the parent folder ID
  };
  console.log('pass')
  try {
    console.log('in try')
    const response = await drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    });
    console.log(response.data.id)
    return response.data.id; // Return the ID of the newly created folder
  } catch (err) {
    // Handle error
    throw err;
  }
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  // console.log(client)
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function saveCredentials(client) {
  const content = await f.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await f.writeFile(TOKEN_PATH, payload);
}

async function loadSavedCredentialsIfExist() {
  try {
    const content = await f.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

function writeFilePromise(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

async function deleteFolder(folderId, authClient) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  console.log('delete', folderId)
  try {
    await drive.files.delete({
      fileId: folderId,
    });
    console.log(`Folder with ID ${folderId} deleted successfully.`);
  } catch (err) {
    // Handle error
    throw err;
  }
}

const searchInJSONFile = async (json, searchObj, id) => {
    let searchTerm = searchObj.name
    
    fs.readFile(fileName, 'utf8', (err, data) => {
        try {
            const jsonObject = JSON.parse(data);
            if (id === 1) {
              jsonObject.folders[id].folders.find((obj, i) => {
                if (obj.name == searchObj.country) {
                  jsonObject.folders[id].folders[i].folders.find((clientObj, j) => {
                    if (clientObj.name == searchTerm) {
                      console.log('FOUND:: ', clientObj.name)
                      foundId = clientObj.folderId
                      console.log('in ', foundId)
                      retrieveFilesRecursively(clientObj, foundId)
                      .then(async editedObj => {
                        console.log('Found json:', JSON.stringify(editedObj, null, 2));
                        jsonObject.folders[id].folders[i].folders[j] = editedObj
                        writeFilePromise(jsonObject)
                      })
                      .catch(error => {
                        console.error('Error:', error);
                      });
                    }
                  })
                }
              })
            } else if (id === 2) {
              jsonObject.folders[id].folders.find((obj, i) => {
                if (obj.name == searchTerm) {
                  console.log('in ', searchObj.folderId)
                  retrieveFilesRecursively(searchObj, searchObj.folderId)
                  .then(async editedObj => {
                    console.log('Found json:', JSON.stringify(editedObj, null, 2));
                    jsonObject.folders[id].folders[i] = editedObj
                    writeFilePromise(jsonObject)
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
                  
                }
              }) 
            } else if (id === 0) {
              jsonObject.folders[id].folders.find((obj, i) => {
                if (obj.name == searchTerm) {
                  console.log('in ', searchObj.folderId)
                  retrieveFilesRecursively(searchObj, searchObj.folderId)
                  .then(async editedObj => {
                    console.log('Found json:', JSON.stringify(editedObj, null, 2));
                    jsonObject.folders[id].folders[i] = editedObj
                    writeFilePromise(jsonObject)        
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });
                  
                }
              })       
            }
          } catch (err) {
            console.error('Error reading or parsing JSON file:', err);
          }
          console.log('outer: ', foundId)
          return foundId
    })
  
}

const retrieveFilesRecursively = async (jsonObject, folderId) => {
    const authClient = await authorize();
    const drive = google.drive({ version: 'v3', auth: authClient });
  
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name, mimeType)',
    });
  
    const newFiles = res.data.files;
  
    for (const subFolder of newFiles.filter(file => file.mimeType === 'application/vnd.google-apps.folder')) {
      const existingFolder = jsonObject.folders.find(folder => folder.folderId === subFolder.id);
  
      if (!existingFolder) {
        jsonObject.folders.push({
          name: subFolder.name,
          folderId: subFolder.id,
          folders: [],
          files: [],
        });
      }
  
      const nestedFolder = jsonObject.folders.find(folder => folder.folderId === subFolder.id);
      await retrieveFilesRecursively(nestedFolder, subFolder.id);
    }
  
    for (const subFile of newFiles.filter(file => file.mimeType !== 'application/vnd.google-apps.folder')) {
      jsonObject.files.push({
        name: subFile.name,
        id: subFile.id,
      });
    }
  
    return jsonObject
};

async function dailyBackup(file, auth, folder) {
  const fileMetadata = {
    name: 'data-' + new Date() + '.json',
    parents: [folder],
  };

  const media = {
      mimeType: file.mimetype,
      body: file,
  };

  const driveService = google.drive({ version: "v3", auth });

  const response = await driveService.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
  });

  return response;
}

///////////////// Drive Helpers ///////////////// 

async function DriveAddProject(proj, data) {
    const authClient = await authorize()
    const basePID = proj.projectId.substring(0, 14)
    const fid = await createFolder(proj.name + ' | ' + basePID, data.folders[0].folderId, authClient)
    proj.folderId = fid
    data.folders[0].folders.push(proj);
}

async function DriveEditProject(proj, data) {
    const authClient = await authorize()
    const drive = google.drive({ version: 'v3', auth: authClient });
    const basePID = proj.projectId.substring(0, 14)
    
    await drive.files.update({
        fileId: proj.folderId,
        resource: {
            name: proj.name + ' | ' + basePID,
        },
    });
    writeFilePromise(data)
}

async function DriveDeleteProject(proj) {
    const authClient = await authorize()
    try {
        await deleteFolder(proj.folderId, authClient)
    } catch(e) {
        console.log('delete error :: ', e)
    }
}

async function DriveAddClient(cli, data, locnr) {
    const authClient = await authorize()
    const fid = await createFolder(cli.name, data.folders[3].folders[locnr].folderId, authClient)
    cli.folderId = fid
    data.folders[3].folders[locnr].folders.push(cli)
    writeFilePromise(data)
}


async function DriveEditClient(cli) {
    const authClient = await authorize()
    const drive = google.drive({ version: 'v3', auth: authClient });    

    await drive.files.update({
        fileId: cli.folderId,
        resource: {
            name: cli.name,
        },
    });
}

async function DriveDeleteClient(cli) {
    const authClient = await authorize()
      try {
        await deleteFolder(cli.folderId, authClient)
      } catch(e) {
        console.log('delete error :: ', e)
      }
}

async function DriveAddCountry(country, data) {
    const authClient = await authorize()
    const fid = await createFolder(country, data.folders[3].folderId, authClient)
    const countryJSON = {
        name: country,
        folderId: fid, 
        folders: [],
        files: []
    }
    data.folders[3].folders.push(countryJSON);
    writeFilePromise(data)
}


async function DriveAddSupplier(supl, data) {
    const authClient = await authorize()
    const fid = await createFolder(supl.name, data.folders[4].folderId, authClient)
    supl.folderId = fid
    data.folders[4].folders.push(supl)
    writeFilePromise(data)
}

async function DriveEditSupplier(supl) {
    const authClient = await authorize()
    const drive = google.drive({ version: 'v3', auth: authClient });    

    await drive.files.update({
      fileId: supl.folderId,
      resource: {
        name: supl.name,
      },
    });
}

async function DriveDeleteSupplier(supl) {
    const authClient = await authorize()
    const drive = google.drive({ version: 'v3', auth: authClient });    

    await drive.files.update({
      fileId: supl.folderId,
      resource: {
        name: supl.name,
      },
    });
}

async function DriveUpload(file, folder, pid) {
    console.log('async drive upload')
    const auth = authenticateGoogle();
    const response = await uploadToGoogleDrive(file, auth, folder, pid);
}

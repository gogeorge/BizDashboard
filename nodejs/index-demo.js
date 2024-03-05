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
                    folderHierarchy.folders[0].folders.push(newProject);
                    writeFilePromise(folderHierarchy)
                });
            }

            // TO FIX: makes a new json object instead of editing original (for name edit)
            if (parsedUrl.pathname === '/editProject' && req.method === 'POST') {
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data)
                    let editProject = req.body
                    for (let i = 0; i < folderHierarchy.folders[0].folders.length; i++) {
                        if (folderHierarchy.folders[0].folders[i].folderId == editProject.folderId) {
                            folderHierarchy.folders[0].folders[i] = editProject
                            writeFilePromise(folderHierarchy)
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
                        if (folderHierarchy.folders[3].folders[i].name == loc) {
                            locnr = i
                            folderHierarchy.folders[3].folders[i].folders.push(newClient);
                            writeFilePromise(folderHierarchy)
                            break;
                        
                        }
                    }
                })
            }
            
            if (parsedUrl.pathname === '/editClient' && req.method === 'POST') {
                let editClient = req.body; 
                const loc = req.body.country
                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);
                    for (let i = 0; i < folderHierarchy.folders[1].folders.length; i++) {
                        if (folderHierarchy.folders[1].folders[i].name == loc) {
                            console.log('cntry: ', loc)
                            for (let j = 0; j < folderHierarchy.folders[1].folders[i].folders.length; j++) {
                                if (folderHierarchy.folders[1].folders[i].folders[j].folderId == editClient.folderId) {
                                    folderHierarchy.folders[1].folders[i].folders[j] = editClient
                                    writeFilePromise(folderHierarchy)
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
                            let selectedCountry = folderHierarchy.folders[3].folders[i].folders
                            folderHierarchy.folders[1].folders[i].folders = selectedCountry.filter(obj => obj.folderId !== delClient.folderId)
                            writeFilePromise(folderHierarchy)
                        }
                    }   
                })
            }
            
            
            if (parsedUrl.pathname === '/addCountry' && req.method === 'POST') {
                let country = req.body.country

                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);
                    const countryJSON = {
                      name: country,
                      folderId: fid, 
                      folders: [],
                      files: []
                  }
                  folderHierarchy.folders[1].folders.push(countryJSON);
                  writeFilePromise(folderHierarchy)
                })

                res.end(JSON.stringify({ message: 'Country added successfully', country: country }));
            }
            
            
            if (parsedUrl.pathname === '/addSupplier' && req.method === 'POST') {
                const newSupplier = req.body; // The data sent from the client

                fs.readFile(fileName, 'utf8', (err, data) => {
                    let folderHierarchy = JSON.parse(data);
                    folderHierarchy.folders[2].folders.push(newSupplier)
                    writeFilePromise(folderHierarchy)
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
                            folderHierarchy.folders[2].folders = folderHierarchy.folders[4].folders.filter(obj => obj.folderId !== delSupplier.folderId)
                            writeFilePromise(folderHierarchy)
                            break
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
const express = require('express');
const path = require('path');
const app = express();

const { LibraryLoader } = require("./src/library.utilities");
const { PhaserCodeGenerator } = require("./src/code.utilties");

// route all static files in public through the web server
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: "100000kb"}));

app.get('/', (req, res) => {
  // serve all get requests to local with index page of public folder
  res.sendFile(`${__dirname}/public/index.html`);
});

app.get('/phaser/:appname', (req, res) => {
  // serve all get requests to local with index page of public folder
  res.sendFile(`${__dirname}/public/phaser/html/${req.params.appname}.html`);
});

/* Create - POST method */
app.post('/library/data', (req, res) => {
  LibraryLoader.createLibraryData(req.body);
  res.send({success: true, msg: 'Project data created successfully'});
});

/* Create Phaser project - POST method */
app.post('/library/phaser', (req, res) => {
  PhaserCodeGenerator.createPhaserProject(req.body);
  res.send({success: true, msg: 'Phaser project created successfully'});
});

/* Read - GET all PROJECTs method */
app.get('/library/data', (req, res) => {
  let data = LibraryLoader.getLibraryData();
  res.send(data)
});

/* Read - GET PROJECT method */
app.get('/library/data/:appname', (req, res) => {
  let data = LibraryLoader.getAppData(req.params.appname);
  res.send(data)
});

/* Read - PUT PROJECT method */
app.put('/library/data/:appname', (req, res) => {
  LibraryLoader.updateProjectData(req.body);
  res.send({success: true, msg: 'Project data updated successfully'});
});


app.listen(3333, () => {
  console.log('Application listening on port 3333!');
});
# Buslines backend

A simple NodeJS backend for the BusLines app. It includes a JavaScript linter based on the Airbnb styleguide.

## Prerequisites

This project requires [NodeJS](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm) and [MongoDB](https://www.mongodb.com/download-center) to be installed on your system. You should also create a database called
*buslines*. For the LPP data scraping script [Java](https://www.oracle.com/technetwork/java/javase/downloads/index.html) is required for certain parts.


## Install

```console
$ npm install
```
This will install all dependencies as defined in the **package.json** file.

## Usage

```console
$ npm start
```
or, if you wish to run in the development env (stack traces in responses)
```console
$ npm run dev
```
After running the command the server should be listening on **http://localhost:3000**. Should you require the data from LPP in your database, there is a script inside */bin*. You can run it with npm (tested with Linux):
```console
$ npm run lpp
```
This *should* install all the required Python packages, download the PDFs into *pdfs/*, get [tabula](https://github.com/tabulapdf/tabula-java) and parse the data from the PDFs into the Mongo database. In case you already have the PDF files (inside /pdfs).

On a **Linux** machine run:
```console
pip install -r requirements.txt && ./bin/lpp.py -p
```
If you are running **Windows** the command translates to:
```console
pip install -r requirements.txt && bin\lpp.py -p
```

## Documentation

First run the server and then visit the [Swagger documentation](http://localhost:3000/api/v1/docs). The API definitions *should* be updated everytime a change occurs.

## Project structure

Let's talk about the project structue. 

- The [bin](bin/) directory contains scripts, e.g. starting the server or scraping data from websites.
- The [certs](certs/) folder contains the SSL key and certificate for the HTTP/2 server.
- The [config](config/) directory contains various config files (e.g. database connection parameters).
- The [db-queries](db-queries/) directory is where the database queries are defined. It comes with a subdirectory based on the city (Ljubljana or Maribor), and inside of are another set of subdirectories based on the model (LPPRide or LPPStation). There are *queries.js* files in the main folders for easier imports elsewhere.
- The [models](models/) directory contains definitions for our MongoDB datastructures. Bascially Mongoose schemas and models.
- The [routes](routes/) direcftory contains the API routes. If you would wish to add a new endpoint, it should be defined inside this folder.

The [index.js](index.js) file initializes the app with Express, registers the */api/v1* endpoint and sets the production and development error handlers. It also connects to the database and initializes the logger.
All the commands are defined in the [package.json](package.json) file.

## Maintaners

Currently working on the backend:

- [David Rubin](https://github.com/rubinda)
- [Lovro Šarić](https://github.com/lovros)

## License

MIT

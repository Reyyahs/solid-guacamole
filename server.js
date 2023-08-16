const express = require("express");
const path = require("path");
const fsPromises = require("fs").promises;

const PORT = process.env.PORT || 3001;
const app = express();
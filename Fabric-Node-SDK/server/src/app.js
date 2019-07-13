'use strict';

const express = require('express');
const path = require('path');
const app = express();



// Config file
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
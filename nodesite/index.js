const express = require('express');
const app = express();

const port = process.env.PORT || 3000;


// home route
app.get('/', (req, res) =>{
    res.send('bite de cheval')
})

app.listen(port, ()=>{ console.log("Listening to the server on http://localhost:3000")});

require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const express= require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(bodyParser.json());
app.use(cors());



app.post('/message', (req, res) =>{
    const medicines = req.body.medicines || '';

    const response = openai.createCompletion({
        model: "text-davinci-003",
        prompt: generatePrompt(medicines),
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 1024,
    })

    response.then((data) => {
        res.send({message: data.data.choices[0].text})
    });
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});

function generatePrompt(medicines) {
    const capitalizedMedicines = []
   for(let i = 0; i < medicines.length; i++){
     capitalizedMedicines[i] = medicines[i][0].toUpperCase() + medicines[i].slice(1).toLowerCase();
   } 
   return `Determine whether the given list of drugs/medicines interact with each other.
   Drugs/Medicines: Atorvastatin, Albuterol, Losartan
   Answer: No 
   Drugs/Medicines: Bromocriptine, Pseudoephedrine, finasteride, ibuprofen
   Answer: Yes 
   Drugs/Medicines: ${capitalizedMedicines}
   Answer:`;
 }
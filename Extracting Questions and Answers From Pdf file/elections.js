const fs = require('fs');
const pdf = require('pdf-parse');

// Define a function to extract question and answer mappings
async function extractMappings(pdfFilePath, questionKeys) {
  try {
    // Read the PDF file
    const dataBuffer = fs.readFileSync(pdfFilePath);

    // Parse the PDF
    const data = await pdf(dataBuffer);

    // Get the text content from the PDF
    const pdfText = data.text;

    // Initialize an object to store the mappings
    const mappings = {};

    // Loop through the question keys and extract mappings
    questionKeys.forEach((questionKey) => {
      const regex = new RegExp(`${questionKey}([^\\r\\n]*)`, 'g');
      const matches = pdfText.match(regex);

      if (matches) {
        const question = matches[0].trim();
        const answerKeyRegex = /(\d+)\.\s([^\\r\\n]+)/g;
        const answerMappings = {};
        let answerMatch;

        while ((answerMatch = answerKeyRegex.exec(question)) !== null) {
          const answerKey = answerMatch[1];
          const answer = answerMatch[2].trim();
          answerMappings[answerKey] = answer;
        }

        mappings[questionKey] = {
          question,
          answerMappings,
        };
      }
    });

    // Return the mappings as JSON
    return JSON.stringify(mappings, null, 2);
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Usage example
const pdfFilePath = 'path/to/your/pdf/document.pdf';
const questionKeys = ['Q1', 'Q2', 'Q3']; // Replace with your question keys

extractMappings(pdfFilePath, questionKeys)
  .then((result) => {
    if (result) {
      fs.writeFileSync('output.json', result);
      console.log('Mappings extracted and saved to output.json');
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
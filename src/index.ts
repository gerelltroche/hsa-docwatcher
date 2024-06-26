import fs from 'fs';
import { google } from 'googleapis';
import express from 'express';

const app = express()
const PORT = process.env.PORT || 6968

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
)

try {
  const creds = fs.readFileSync('credentials.json')
  oauth2Client.setCredentials(JSON.parse(creds.toString()))
} catch (err) {
  console.log('No credentials found.')
}

app.get("/auth/google", (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/drive"]
  });
  res.redirect(url)
})

app.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync('credentials.json', JSON.stringify(tokens))
  res.send("Success")
})

app.get("/", (req, res) => {
  res.send('WE DO BE OUT HERE')
})

app.listen(PORT, () => {
  console.log('Server listening on port ', PORT)
})

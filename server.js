const express = require("express");
const puppeteer = require("puppeteer-core");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/pdf", async (req, res) => {
  const url = req.body.url;

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const pdf = await page.pdf();
  await browser.close();

  const binaryData = Buffer.from(pdf, "binary");
  const base64String = binaryData.toString("base64");

  res.send(base64String);
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

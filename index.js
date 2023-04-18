const express = require('express');
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const { createCanvas, loadImage, registerFont } = require('canvas');
registerFont("./fonts/myFont.otf", { family: "myFont" })
const fs = require('fs');
const path = require("path");

const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ----- Set EJS as templating engine ----- */
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('image', { dataUri: "" })
})

app.post('/generateImage', async (req, res) => {

    // Dimensions for the image
    const width = 2000;
    const height = 1414;

    // Instantiate the canvas object
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");

    const imagePosition = {
        w: 2000,
        h: 1414,
        x: 0,
        y: 0,
    };

    loadImage("./images/certificate.png").then((image) => {
        const { w, h, x, y } = imagePosition;
        context.drawImage(image, x, y, w, h);

        const post = {
            title: "CERTIFICATE",
        }
        context.font = "bolder 65pt 'PT Sans'";
        context.fillStyle = "#091045";
        let cerCenter = context.measureText(post.title);
        context.fillText(post.title, (1000-(cerCenter.width/2)), 450);

        let course = req.body.course
        const subtitle = {
            title: `Of ${course} Training`
        }
        context.font = "30pt 'PT Sans'";
        context.fillStyle = "#d96838";
        let courseCenter = context.measureText(subtitle.title);
        context.fillText(subtitle.title, (1000-(courseCenter.width/2)), 550);

        let name = req.body.name
        const data = {
            title: name
        }
        context.font = "110pt 'myFont'";
        context.fillStyle = "#000";
        let text = context.measureText(data.title);
        context.fillText(data.title, (1000-(text.width/2)), 790);

        context.font = "20pt 'Gwendolyn'"
        context.fillText("_____________________________________________________________________", 520, 810);

        const content = {
            title: `Has successfully completed the course and has achieved the required`,
            subtitle: `level of competence in ${course}`
        }
        context.font = "25pt 'PT Sans'";
        context.fillStyle = "#091053";
        let paraCenter = context.measureText(content.title);
        context.fillText(content.title, (1000-(paraCenter.width/2)), 880);
        let subCenter = context.measureText(content.subtitle)
        context.fillText(content.subtitle, (1000-(subCenter.width/2)), 930);

        let cerData = req.body.date
        const date = {
            title: cerData
        }
        context.font = "30pt 'PT Sans'";
        context.fillStyle = "#091045";
        context.fillText(date.title, 365, 1100);

        // Write the image to file
        const buffer = canvas.toBuffer("image/png");
        fs.writeFileSync("./images/demo.png", buffer);

        var filePath = path.join(__dirname, '/images/demo.png');
        var stat = fs.statSync(filePath);
        // console.log("stat", stat);

        res.writeHead(200, {
            'Content-Type': 'png',
            'Content-Length': stat.size
        });

        // res.sendFile(__dirname + '/images/demo.png');
        var readStream = fs.createReadStream(filePath);
        readStream.pipe(res);

    });

})

app.listen(port, () => {
    console.log(`SETUP :- Server running at : ${port}`);
})


const Express = require("express");
const fs = require("fs");
const app = Express();
const morgan = require('morgan');

app.use(morgan('tiny'));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.get("/video", (req, res) => {

  // file and fileSize
  const filePath = "/media/video.mp4";
  const { size } = fs.statSync(__dirname + filePath);

  // get range from request headers
  const range = req.headers.range;

  if (range) {
    //get the requested content length
    const parts = range.replace(/bytes=/, "").split("-"),
      start = Number(parts[0]),
      end = parts[1] ? Number(parts[1]) : size - 1,
      contentLength = end - start + 1;

      // Set headers
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // send back partial content
    res.writeHead(206, headers);
    const Stream = fs.createReadStream(__dirname + filePath);
    Stream.pipe(res);
  }
});

app.listen({ port: 3000 }, function (err, address) {
  console.log("connected");
});

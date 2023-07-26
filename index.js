const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");

const app = express();
const port = 5000 || process.env.PORT;
app.use(express.static("public"));

app.use(cors()); // Menambahkan middleware cors
app.use(bodyParser.json());
app.use(cookieParser());
app.use(helmet());
app.use(xss());

// Router dan endpoint lainnya
const router = require("./routes/userRouter");
app.use(router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

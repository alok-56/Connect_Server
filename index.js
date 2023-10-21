const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const DB = require("./Config/Connection");
const userRouter = require("./Route/User");
const globalErrorHandler = require("./Middleware/GlobalError");
const PostRouter = require("./Route/Post");
const CommentRouter = require("./Route/Comments");
const ChatRouter = require("./Route/Chat");
const app = express();
require("dotenv").config();
require('./Socket')


//------------------MIDDLEWARE----------------//
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

//-----------------Api------------------------//
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", PostRouter);
app.use("/api/v1/comment", CommentRouter);
app.use("/api/v1/chat",ChatRouter)
//----------------GLOBAL ERRORS MIDDLEWARE ----//
app.use(globalErrorHandler);

//------------------SERVER LISTENER---------//
const PORT = process.env.PORT || 4500;
app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`);
  DB();
});

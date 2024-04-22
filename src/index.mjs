import express from "express";
import authRouter from './routes/auth.mjs';
import postRouter from './routes/posts.mjs';
import currentUserMiddleware from "./middlewares/currentUserMiddleware.mjs";
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.listen(5000, () => {
    console.log(`Connected with Port ${5000}`);
});

app.use(authRouter);
app.use(postRouter);

app.use('/', (req, res) => {
    res.send("Connected");
})


import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import UserRouter from './routes/user.js'
import InterviewRouter from './routes/interview.js'
import ContactRouter from './routes/contact.js'
import SubscriptionRouter from './routes/subscription.js'
import AdminRouter from './routes/admin.routes.js'
import ResumeRouter from './routes/resume.js'
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// all swagger
const swaggerPath = path.join(__dirname, '../swagger-output.json');
let swaggerDocument = {};
if (fs.existsSync(swaggerPath)) {
  swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
  console.log('✅ Swagger file loaded');
} else {
  console.warn('⚠️ swagger-output.json not found, Swagger docs will be empty');
}


const app=express();
const Port=process.env.PORT;


// all  middlewares
app.use(morgan('dev'));
app.use(
  cors({
    origin: true,   
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




// all routes

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/health',(req,res)=>{
  res.status(200).json({
    message:"Server Running Good"
  })
});


app.use('/api/v1',UserRouter);
app.use("/api/v1/contact" , ContactRouter)
app.use('/api/v1/interview',InterviewRouter);
app.post("/api/v1/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
  res.json({ message: "Logged out successfully" });
});
app.use("/api/v1/subscription",SubscriptionRouter)
app.use("/api/v1/admin",AdminRouter)

app.use("/api/v1/resume" , ResumeRouter)


app.listen(Port,()=>{
  console.log(`Backend Server Started at http://localhost:${Port}/health ||  http://localhost:8082/docs/ 
    `);
  
})




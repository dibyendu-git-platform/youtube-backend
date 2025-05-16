import 'dotenv/config';
import connectDB from './db/index.js';
import { app } from './app.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
});














// (
//     async () => {
//         try {
//             const connection = await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`);
//             console.log('MongoDB connected');
//             app.on("error", (error) => {
//                 console.error('MongoDB connection error:', error);
//             });
//         } catch (error) {
//             console.error('MongoDB connection error:', error);
//             throw error;
//         }
//     }
// )()
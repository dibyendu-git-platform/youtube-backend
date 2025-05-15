import 'dotenv/config';
import connectDB from './db/index.js';

connectDB();














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
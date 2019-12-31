import 'dotenv/config';
import app from './app';

const port = 3050;

app.listen(port, () => {
    console.log(`Server ON port: ${port}`);
});

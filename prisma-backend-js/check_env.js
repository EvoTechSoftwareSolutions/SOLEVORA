import dotenv from 'dotenv';
dotenv.config();

console.log('--- ENV CHECK ---');
console.log('USER:', process.env.GMAIL_USER);
console.log('PASS LENGTH:', process.env.GMAIL_PASS ? process.env.GMAIL_PASS.length : 0);
console.log('PASS (NO SPACES) LENGTH:', process.env.GMAIL_PASS ? process.env.GMAIL_PASS.replace(/\s/g, '').length : 0);
console.log('-----------------');

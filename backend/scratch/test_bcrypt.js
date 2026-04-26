import bcrypt from 'bcrypt';

const test = async () => {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    console.log('Hash generated:', hash);
    const match = await bcrypt.compare(password, hash);
    console.log('Match with itself:', match);
    
    // Check if there are any hidden characters in 'admin123'
    console.log('Password length:', password.length);
    for (let i = 0; i < password.length; i++) {
        console.log(`Char ${i}: ${password[i]} (${password.charCodeAt(i)})`);
    }
};

test();

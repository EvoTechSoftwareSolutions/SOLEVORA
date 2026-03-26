import mysql from 'mysql2/promise';

async function fix() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'solevora_db'
  });

  console.log('Connected. Inspecting Users table indexes...');

  // Get all indexes on the Users table
  const [indexes] = await connection.execute('SHOW INDEX FROM `Users`');

  console.log(`Found ${indexes.length} index entries on Users.`);

  // Group by key name, keep track of which ones are duplicates
  const seen = new Set();
  const toDrop = [];

  for (const row of indexes) {
    const keyName = row['Key_name'];
    if (keyName === 'PRIMARY') continue; // never drop primary key

    if (seen.has(keyName)) {
      // It's a multi-column key entry, skip (already queued)
      continue;
    }
    seen.add(keyName);

    // Check if there are multiple unique indexes on 'email' column
    // We want to keep only one unique index on email, drop the rest
    if (keyName !== 'email' && row['Column_name'] === 'email') {
      toDrop.push(keyName);
    }
  }

  // Also find all non-PRIMARY indexes and deduplicate keeping one per column
  const emailIndexes = indexes.filter(r => r['Column_name'] === 'email' && r['Key_name'] !== 'PRIMARY');
  const uniqueEmailKeys = [...new Set(emailIndexes.map(r => r['Key_name']))];

  console.log(`Email indexes found: ${uniqueEmailKeys.join(', ')}`);

  // Keep the first one, drop the rest
  const keysToRemove = uniqueEmailKeys.slice(1);

  if (keysToRemove.length === 0) {
    console.log('No duplicate email indexes found. The issue may be too many total indexes.');
    // Drop ALL non-primary, non-email indexes and let Sequelize recreate
    const allKeys = [...new Set(indexes.filter(r => r['Key_name'] !== 'PRIMARY').map(r => r['Key_name']))];
    console.log(`Dropping ALL non-primary indexes (${allKeys.length} keys): ${allKeys.join(', ')}`);
    for (const key of allKeys) {
      try {
        await connection.execute(`ALTER TABLE \`Users\` DROP INDEX \`${key}\``);
        console.log(`  Dropped index: ${key}`);
      } catch (e) {
        console.log(`  Could not drop ${key}: ${e.message}`);
      }
    }
  } else {
    for (const key of keysToRemove) {
      try {
        await connection.execute(`ALTER TABLE \`Users\` DROP INDEX \`${key}\``);
        console.log(`  Dropped duplicate email index: ${key}`);
      } catch (e) {
        console.log(`  Could not drop ${key}: ${e.message}`);
      }
    }
  }

  console.log('Done! Restart the backend server now.');
  await connection.end();
}

fix().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});

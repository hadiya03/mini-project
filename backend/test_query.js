const pool = require('./src/db/db.js');
setTimeout(async () => {
  const fs = require('fs');
  // Check all columns of the players table
  const r = await pool.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'players' ORDER BY ordinal_position`);
  fs.writeFileSync('columns_result.json', JSON.stringify(r.rows, null, 2));
  console.log('Done');
  process.exit(0);
}, 2000);

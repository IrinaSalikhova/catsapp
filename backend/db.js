import { createPool } from 'mysql2/promise';

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: '24121972',
    database: 'SocialPrescribing',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
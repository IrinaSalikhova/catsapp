
// Middleware to authenticate using the session token
const authenticateToken = async (req, res, next) => {
    const { token } = req.headers;  // Assuming token is passed in the header
  
    // Check if the token exists in the database and is not expired
    const session = await db.query('SELECT * FROM Sessions WHERE token = ? AND expiresAt > ?', [token, new Date()]);
  
    if (!session) {
      return res.status(403).send('Unauthorized: Invalid or expired token');
    }
  
    // Attach user info to the request for use in route handlers
    req.userId = session.userId;
    next();
  };


// Usage example:
// app.get('/protected', authenticateToken, (req, res) => {
//     res.send(`Hello, user ${req.userId}. You are authorized.`);
//   });

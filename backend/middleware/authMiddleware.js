import jwt from 'jsonwebtoken';

// Bouncer 1: Checks if the user is logged in (Valid Token)
export const verifyToken = (req, res, next) => {
  try {
    // Check if the request has an "Authorization" header
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "Access Denied. Please log in." });
    }

    // Standardize the token format (remove "Bearer " if it's there)
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    // Verify the badge using our secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the user's data (like their ID and Role) to the request so we know who they are
    req.user = verified; 
    
    // Move on to the actual route (let them in!)
    next(); 
  } catch (err) {
    res.status(401).json({ message: "Invalid or Expired Token." });
  }
};

// Bouncer 2: Checks if the logged-in user is an Admin
export const isAdmin = (req, res, next) => {
  // We check the role that we attached in the verifyToken step
  if (req.user && req.user.role === 'Admin') {
    next(); // They are an Admin, let them through!
  } else {
    res.status(403).json({ message: "Access Denied. Admin privileges required to do this." });
  }
};
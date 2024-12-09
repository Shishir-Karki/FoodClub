const { verifyToken } = require("../utils/utils");

const auth = (req, res, next) => {
    try {
        // Log the incoming authorization header for debugging
        console.log('Auth Header:', req.headers.authorization);
        
        const headerToken = req.headers.authorization?.split(" ")[1];
        
        if (!headerToken) {
            return res.status(401).json({
                status: "failed",
                message: "No token provided",
                error: true
            });
        }

        try {
            const decoded = verifyToken(headerToken);
            console.log('Decoded token:', decoded); // For debugging
            
            // Update this to match your token structure
            req.user = {
                _id: decoded.userId,
                role: decoded.role
            };
            
            next();
        } catch (tokenError) {
            console.error('Token verification error:', tokenError);
            return res.status(401).json({
                status: "failed",
                message: "Invalid token",
                error: true
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            status: "failed",
            message: "Authentication failed",
            error: true
        });
    }
};

module.exports = auth;
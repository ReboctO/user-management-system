const jwt = require('jsonwebtoken');
const { secret } = require('../config.json');
const db = require('../_helpers/db');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User')
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        (req, res, next) => {
            // Get token from header
            const token = req.header('Authorization')?.replace('Bearer ', '');
            
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            // Verify token
            jwt.verify(token, secret, { algorithms: ['HS256'] }, (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: 'Invalid token' });
                }
                req.user = decoded;
                next();
            });
        },

        // authorize based on user role
        async (req, res, next) => {
            try {
                const account = await db.Account.findByPk(req.user.id);
                
                if (!account) {
                    return res.status(401).json({ message: 'Account not found' });
                }

                if (roles.length && !roles.includes(account.role)) {
                    return res.status(403).json({ message: 'Forbidden - Insufficient permissions' });
                }

                // Check refresh tokens if needed
                const refreshTokens = await account.getRefreshTokens();
                req.user.ownsToken = !!refreshTokens.find(x => x.token === req.header('Authorization')?.replace('Bearer ', ''));
                
                // Attach account role to request
                req.user.role = account.role;
                next();
            } catch (error) {
                next(error);
            }
        }
    ];
}
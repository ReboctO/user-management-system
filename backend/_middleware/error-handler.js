module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.log('Error handler received:', err);
    
    // Log the full error object for debugging
    if (err instanceof Error) {
        console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
            // If it's a Sequelize error, it may have additional details
            original: err.original ? {
                code: err.original.code,
                errno: err.original.errno,
                sqlMessage: err.original.sqlMessage,
                sqlState: err.original.sqlState
            } : 'N/A'
        });
    }
    
    switch (true){
        case typeof err === 'string':
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            
            console.log(`Sending error response: ${err}`);
            
            return res.status(statusCode).json({message: err});
        case err.name === 'UnauthorizedError':
            return res.status(401).json({message: 'Unauthorized'});
        case err.name === 'SequelizeConnectionError':
            return res.status(503).json({message: 'Database connection failed. Please try again later.'});
        case err.name === 'SequelizeValidationError':
            return res.status(400).json({message: 'Validation error', errors: err.errors.map(e => e.message)});
        case err.name === 'SequelizeForeignKeyConstraintError':
            return res.status(400).json({message: 'Invalid reference to a related record'});
        case err.name === 'SequelizeUniqueConstraintError':
            return res.status(400).json({message: 'A record with this information already exists'});
        case err.name === 'NodemailerError' || (err.message && err.message.includes('SMTP')):
            return res.status(500).json({message: 'Email service unavailable. Your account has been created, but verification email could not be sent.'});
        default:
            return res.status(500).json({message: 'An unexpected error occurred. Please try again later.'});
    }
}
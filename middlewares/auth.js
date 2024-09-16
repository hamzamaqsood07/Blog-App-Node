import jwt from 'jsonwebtoken';

export function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Access denied. No token provided.');

    try {
        const decoded = jwt.verify(token, process.env.jwtPrivateKey);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
}

export function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') return res.status(403).send('Access denied.');
    next();
}

export function isManagerOrAdmin(req, res, next) {
    if (req.user.role !== 'manager' && req.user.role !== 'admin') return res.status(403).send('Access denied.');
    next();
}

export function isDeveloper(req, res, next) {
    if (req.user.role !== 'developer') return res.status(403).send('Access denied.');
    next();
}

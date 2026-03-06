const rateLimitMap = new Map();

const WINDOW = 60000;
const MAX_REQUESTS = 50;

module.exports = (req, res, next) => {

 const ip = req.ip;
 const now = Date.now();

 if (!rateLimitMap.has(ip)) {
   rateLimitMap.set(ip, []);
 }

 const timestamps = rateLimitMap.get(ip).filter(
   time => now - time < WINDOW
 );

 timestamps.push(now);
 rateLimitMap.set(ip, timestamps);

 if (timestamps.length > MAX_REQUESTS) {

   const retryAfter = Math.ceil((WINDOW - (now - timestamps[0])) / 1000);

   return res.status(429).set("Retry-After", retryAfter)
     .json({ error: "Too many requests" });
 }

 next();
};
// Force rebuild marker - updating timestamp to trigger fresh deployment
console.log('Fresh deployment triggered at:', new Date().toISOString());
export const buildTimestamp = Date.now();

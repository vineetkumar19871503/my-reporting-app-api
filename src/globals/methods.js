/**
 * Some global methods that are useful accorss the project files
 */
module.exports = {
    isDev: typeof process.env.NODE_ENV != 'undefined' && process.env.NODE_ENV === 'dev',
    getToday: function () {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.toISOString();
        return d;
    }
}
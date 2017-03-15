let serverUrl = 'http://localhost:8080';

if (process.env.NODE_ENV === 'development') {
    serverUrl = 'http://localhost:8080';
}
if (process.env.NODE_ENV === 'debug') {
    serverUrl = 'http://localhost:8080';
}
if (process.env.NODE_ENV === 'test') {
    serverUrl = 'http://m.test.julewu.com';
}
if (process.env.NODE_ENV === 'production') {
    serverUrl = 'http://m.julewu.com';
}

export default {
    serverUrl,
};

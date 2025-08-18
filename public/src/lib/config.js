const isProduction = import.meta.env.VITE_NODE_ENV === 'production'
const url = isProduction ? 'https://api.example.com' : 'http://localhost:8080'

export { url, isProduction }

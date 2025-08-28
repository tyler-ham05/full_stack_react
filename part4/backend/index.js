const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

const PORT = 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
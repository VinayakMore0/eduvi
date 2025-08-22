// entry point; loads app/index.js and calls app.listen().


require("dotenv").config();
const app = require("./app");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));



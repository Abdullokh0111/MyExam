const bcrypt = require("bcrypt");

const enteredPassword = "Ak011106*";
const storedHash = "$2b$10$WpgYDXLWXYM45hpDRthxLOg3eCGrM4Y3z.iOpdp6Ic5jG4QLTk9Eu";

bcrypt.compare(enteredPassword, storedHash).then(console.log);

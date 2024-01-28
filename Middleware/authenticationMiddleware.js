const jwt = require("jsonwebtoken");


const AuthMiddleware = (req, res, next) => {
  const cookies = req.headers.cookie.split(';')
  const tokenCookie = cookies.find(cookie => cookie.includes('token='));

  if (tokenCookie) {
    // const token = cookie.value()
    const token = tokenCookie.split('token=')[1];

    // const token = req.headers.cookie;
    jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
      if (err) {
        res.redirect("http://localhost/8000/login")
      } else {

        req.token = token
        req.role = decoded.role;
        req.user_Id = decoded.user_id;
        next();
      }
    });
  }

  else {
    res.send("Invalid Session")
  }
};

module.exports = {
  AuthMiddleware,
};
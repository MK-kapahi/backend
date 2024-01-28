const bcrypt = require("bcrypt");

const creatingHashedPass = async (req, res) => {
    const salt = await bcrypt.genSalt(10);

    const hash = await bcrypt.hash(req.body.password, salt);
    console.log(`Hashed Password : ${hash}`);
    return hash;
};


const generateAccessToken = async (client_id, client_secret) => {
    try {
      if (!client_id || !client_secret) {
        throw new Error("MISSING_API_CREDENTIALS");
      }
  
      const auth = Buffer.from(
        client_id + ":" + client_secret,
      ).toString("base64");
  
      const response = await fetch(`https://api-m.sandbox.paypal.com/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      const data = await response.json();
      return data.access_token;
  
    } catch (error) {
      console.log(error)
    }
  
  }
  


module.exports = { creatingHashedPass , generateAccessToken }

import Jwt from "jsonwebtoken";

/* Explain Code 
    This is a Javascript code that exports an asynchronous function named verifyToken, which handles user token verification. This function takes in three parameters: req (HTTP request object), res (HTTP response object), and next (a callback function). This function uses JWT(JSON Web Token) to verify if a user has the authorization to access a protected route.

Inside the try block, the function first retrieves the token from the HTTP request header by calling req.header("Authorization"). If there's no valid token or if the Authorization header is not present in the request header, it will respond with an HTTP 403 error status, meaning "Access Denied".

If a valid token is present, this function checks if the token starts with the string "Bearer". If true, it slices the "Bearer " substring from the token and pass the remaining token for further processing while ignoring any white spaces from the left.

Then, using the Jwt.verify() method provided by the jsonwebtoken library, this function verifies the token's authenticity by comparing it against the server's signing-secret(JWT_SECRET), as defined in the environment file.

If the token verification passes successfully, the function returns control to the next middleware in the request-response cycle by invoking the callback function provided in the next parameter.

However, if an error such as an invalid token, an expired token, or other errors occur during token verification, the function catches the error inside the catch block, sends back an HTTP error response with a JSON object containing an "error" key-value pair, where the error message is set to the value of err.message.

*/

export const verifyToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(403).send("Access Denied");
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
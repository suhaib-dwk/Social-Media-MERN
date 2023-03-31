import User from "../models/User.js";

/* READ */

/* EXPLAIN */
/*
This code exports a function named getUser as a constant with async as key when called retrieves a user from the database by ID and sends it back to the client.

Here is the breakdown of the code:

export const getUser = async (req, res) => { ... }: This line exports getUser function that takes two arguments: req, and res.

req stands for request, which is an HTTP request object containing data and information from the client.
res stands for response, which is also an HTTP response object sent back to the client.
async keyword indicates that the function implementation contains asynchronous operations, where we await the result instead of directly returning it.
try {...} catch (err) {...}: This is a try-catch block which surrounds all the code inside getUser. This means if any errors occur in the try block during execution, the catch block will handle it.

const { id } = req.body;: This destructuring statement extracts the id property from the req.body object. It expects the request to have a body with an "id" property.

const user = await User.findById(id);: This line uses the await operator to retrieve the user object from the User model (presumably through mongoose or a similar database abstraction, since .findById() is not a method available on native JavaScript objects). The user is located based on the id extracted previously.

res.status(200).json(user);: After successfully locating the user, this line uses the res object to send back a JSON-formatted status 200 response containing the found user data.

res.status(404).json({ message: err.message });: If anything goes wrong along the way, such as wrong input or user not being present, this line handles it catching the error thrown, generates a corresponding JSON-format error reponse message, and sends it back to the client via the res.

*/
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* EXPLAIN */
/* 
The given code exports a function named getUserFriends as a constant/immutable function. The function is an asynchronous function that takes in two parameters, req and res, which stands for request and response objects respectively.

Inside the function:

A try-catch block is used to handle any exceptions that may occur during the execution of this function.
A destructured id variable is created from the URL parameters (params) of the request object and it will be used to find the user whose friends have to be returned.
Once the user is obtained from the database using findById method, another await expression is used to fetch all the friends of that particular user using the map() method on the user.friends.
Then, each friend ID is passed to the User.findById() again, but this time using a Promise.all() method instead of individually iterating through them one by one.
Once all the responses are received from friends, the data of the friends is passed through a map() function, which picks only important details such as _id, firstName, lastName, occupation, location, and picturePath.
This dataset of formatted friends is then returned as a JSON response with status 200 in the response object.
If there is any error during the execution of the function, it gets caught by the catch block, and it sends a response back containing a JSON object with a message property that contains the error message.
*/
export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
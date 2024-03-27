const { User } = require('../models');
const userData = [
    {
        username: "mike",
        password: "password12345"
    },
    {
        username: "Xavier",
        password: "password12345"
    },
    {
        username: "Jack",
        password: "password12345"
    }
];

module.exports = async () => {
    const createdUsers = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });

    console.log("Created users:");
    createdUsers.forEach(user => {
        console.log(`ID: ${user.id}, Username: ${user.username}`);
    });

    return createdUsers;
}
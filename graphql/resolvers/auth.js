const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: (args) => {
    return User.findOne({ email: args.userInput.email })
      .then((user) => {
        if (user) {
          throw new Error("User exists already.");
        }
        return bcrypt.hash(args.userInput.password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email: args.userInput.email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((res) => {
        return { ...res._doc, password: null };
      })
      .catch((err) => {
        throw err;
      });
  },
  login: ({ email, password }) => {
    return User.findOne({ email })
      .then((user) => {
        if (!user) {
          throw new Error("Invalid Credentials!");
        }
        return { isPasswordCorrect: bcrypt.compare(password, user.password), user: user };
      })
      .then(({ isPasswordCorrect, user }) => {
        if (!isPasswordCorrect) {
          throw new Error("Invalid Credentials!");
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, "not-so-secret-due-to-being-my-test-project-haha-so-i-will-leave-it-here", { expiresIn: "1h" });
        return { userId: user.id, token: token, tokenExpiration: 1 };
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  },
};

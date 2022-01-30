const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

module.exports = {
  events: () => {
    return Event.find()
      .populate({ path: "creator", populate: { path: "addedEvents" } })
      .then((events) => {
        return events.map((event) => {
          return { ...event._doc };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  bookings: () => {
    return Booking.find()
      .then((bookings) => {
        return bookings.map((booking) => {
          return { ...booking._doc };
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  createEvent: (args) => {
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      //Hardcoded for now, before we have authentication in place
      creator: "61f36e47bcfc7dd982b4545d",
    });
    let createdEvent;
    let eventCreator;
    return event
      .save()
      .then((res) => {
        createdEvent = { ...res._doc };
        return User.findById("61f36e47bcfc7dd982b4545d");
      })
      .then((user) => {
        if (!user) {
          throw new Error("User doesn't exist.");
        }
        eventCreator = user;
        user.addedEvents.push(event);
        return user.save();
      })
      .then((res) => {
        return { ...createdEvent, creator: eventCreator };
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
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
  bookEvent: (args) => {
    const booking = new Booking({
      userId: "61f36e47bcfc7dd982b4545d",
      event: args.eventId,
    });
    let createdBooking;
    return booking
      .save()
      .then((booking) => {
        createdBooking = { ...booking._doc };
        return Promise.all([Event.findById(args.eventId), User.findById("61f36e47bcfc7dd982b4545d")]);
      })
      .then((res) => {
        const event = res[0];
        const user = res[1];
        if (!event) {
          throw new Error("Event doesn't exist.");
        }
        if (!user) {
          throw new Error("User doesn't exist.");
        }

        return { ...createdBooking, event, user };
      })
      .catch((err) => {
        throw err;
      });
  },
  cancelBooking: async (args) => {
    try {
      const deletedBooking = await Booking.findById(args.bookingId).populate("event");
      await Booking.findByIdAndDelete(args.bookingId);
      return deletedBooking.event;
    } catch (err) {
      throw err;
    }
  },
};

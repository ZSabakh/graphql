const Booking = require("../../models/booking");
const User = require("../../models/user");
const Event = require("../../models/event");

module.exports = {
  bookings: (args, req) => {
    if (!req.isAuthorized) {
      throw new Error("Unauthorized!");
    }

    return Booking.find()
      .populate(["event", "user"])
      .then((bookings) => {
        return bookings.map((booking) => {
          return { ...booking._doc };
        });
      })
      .catch((err) => {
        throw err;
      });
  },

  bookEvent: (args, req) => {
    if (!req.isAuthorized) {
      throw new Error("Unauthorized!");
    }

    const booking = new Booking({
      userId: req.userId,
      event: args.eventId,
    });
    let createdBooking;
    return booking
      .save()
      .then((booking) => {
        createdBooking = { ...booking._doc };
        return Promise.all([Event.findById(args.eventId), User.findById(req.userId)]);
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
        console.log(event, user);
        return { ...createdBooking, event, user };
      })
      .catch((err) => {
        throw err;
      });
  },
  cancelBooking: async (args, req) => {
    if (!req.isAuthorized) {
      throw new Error("Unauthorized!");
    }
    try {
      const deletedBooking = await Booking.findById(args.bookingId).populate("event");
      await Booking.findByIdAndDelete(args.bookingId);
      return deletedBooking.event;
    } catch (err) {
      throw err;
    }
  },
};

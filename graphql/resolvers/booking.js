const Booking = require("../../models/booking");
const User = require("../../models/user");
const Event = require("../../models/event");

module.exports = {
  bookings: () => {
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

  bookEvent: (args) => {
    const booking = new Booking({
      userId: "61f36e47bcfc7dd982b4545d",
      event: args.eventId,
    });
    let createdBooking;
    return booking
      .save()
      .then((booking) => {
        console.log("Entered booking.save()");
        createdBooking = { ...booking._doc };
        return Promise.all([Event.findById(args.eventId), User.findById("61f36e47bcfc7dd982b4545d")]);
      })
      .then((res) => {
        console.log("Entered Promise.all()");
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

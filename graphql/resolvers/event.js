const Event = require("../../models/event");
const User = require("../../models/user");

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
  createEvent: (args, req) => {
    if (!req.isAuthorized) {
      throw new Error("Unauthorized!");
    }

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      //Hardcoded for now, before we have authentication in place
      creator: req.userId,
    });
    let createdEvent;
    let eventCreator;
    return event
      .save()
      .then((res) => {
        createdEvent = { ...res._doc };
        return User.findById(req.userId);
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
};

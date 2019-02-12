const Event = require("../../model/event");
const Booking = require("../../model/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
      if(!req.isAuth){
        throw new Error('Not Authenticated')
      }
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  bookEvent: async (args,req) => {
    if(!req.isAuth){
        throw new Error('Not Authenticated')
      }
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    console.log(fetchedEvent);
    const booking = new Booking({
      user: req.userId,
      event: fetchedEvent
    });
    const result = await booking.save();

    const trans = transformBooking(result);

    return transformBooking(result);
  },

  cancelBooking: async (args, req) => {
    if(!req.isAuth){
        throw new Error('Not Authenticated')
      }
    try {
      const booking = await Booking.findById(args.bookingId).populate("event");

      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};

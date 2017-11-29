// import { worker } from "cluster";

const db = require("../models");

// Defining methods for the attendeeController
module.exports = {
    // writes the new attendee to the database
    create: function (req, res) {
        db.Attendee
            .create(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));

    },
    update: function (req, res) {
        // console.log(req.params.uuid)
        var workshopAttending = {}
        db.Attendee
            .find({ where: { uuid: req.params.uuid } })
            .then((attendee) => {
                // console.log(attendee)
                db.WorkshopSelection
                    .find({
                        where: { WorkshopId: req.params.id }
                    })
                    .then((workshop) => {
                        console.log("workshop", workshop.checkedIn)
                        if (workshop.checkedIn === false) {
                            db.WorkshopSelection
                                .update({
                                    checkedIn: 1
                                }, {
                                    where: {
                                        AttendeeId: attendee.id,
                                        WorkshopId: req.params.id
                                    }
                                })
                        } else {
                            console.log("you are already checked in")
                            workshopAttending = "you are already checked in"
                        }

                        workshopAttending = workshop
                        
                        return {
                            workshopAttending,
                            attendee
                        }    
                    })
            .then(result => res.json(result))
            .catch(err => res.status(422).json(err));

        })
    },
    // finds all the attendees in the database
    findAll: function (req, res) {
        db.Attendee
            .findAll(req.body)
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    },
    // removes attendee from the database
    remove: function (req, res) {
        db.Attendee
            .find({ where: { id: req.params.id } })
            .then(dbModel => dbModel.destroy())
            .then(dbModel => res.json(dbModel))
            .catch(err => res.status(422).json(err));
    }
}
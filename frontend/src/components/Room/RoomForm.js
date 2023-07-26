import React, { useState, useEffect } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { bookRoom, getRoomNumbers, updateRoom, getSlots } from "../services";
import { auth } from "../Auth/firebase";
import "../../App.css";

const RoomForm = ({ roomData, update, handleClose }) => {
  const [event, setEvent] = useState(update ? roomData.event : "");
  let [room, setRoom] = useState(update ? roomData.roomNumber : "");
  let [date, setDate] = useState(update ? roomData.event_date : "");
  const [slot, setSlotData] = useState(update ? roomData.slot : "");
  const [phoneNumber, setPhoneNumber] = useState(
    update ? roomData.phoneNumber : ""
  );
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  useEffect(() => {
    async function getData() {
      const data = await getRoomNumbers();
      setAvailableRooms(data);
    }
    getData();
  }, []);

  async function getSlot(){
    if(room === "" || date === "")return;
    const slots = ["9:00-9:30", "9:30-10:00", "10:00-10:30", "10:30-11:00", "11:00-11:30", "11:30-12:00", "1:00-1:30", "1:30-2:00", "2:00-2:30", "2:30-3:00", "3:00-3:30", "3:30-4:00"];
    const bookedSlot = await getSlots(room, date);
    const freeSlots = [];
    slots.forEach((slot) => {
      let flag = 0;
      bookedSlot.forEach((val) => {
        if(val.slot === slot)flag = 1;
      });
      if(flag === 0)freeSlots.push(slot);
    });
    setAvailableSlots(freeSlots);
  }

  const findId = (currentRoom) => {
    if (currentRoom.roomNumber === room) {
      return currentRoom;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !(
        phoneNumber.length > 0 &&
        event.length > 0 &&
        room.length > 0 &&
        date.length > 0 &&
        slot.length > 0
      )
    ) {
      alert("Please fill all the details");
    } else {
      const d = availableRooms.find(findId);
      const user = await auth.currentUser;
      const name = user.displayName;
      const email = user.email;
      const roomDetails = {
        name,
        email,
        event,
        room_id: d ? d.room_id : roomData.room_id,
        previous_rid: roomData ? roomData.room_id : 0,
        room,
        date,
        phoneNumber,
        slot,
      };
      if (update) {
        //Update data in the database here
        const data = await updateRoom(roomDetails);
        console.log(data);
        alert("Room successfully updated");
      } else {
        //Add data to the db here
        await bookRoom(roomDetails);
        console.log(roomDetails);
        alert("Room successfully booked");
      }

      handleClose();
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridPhone">
          <Form.Label>Phone number</Form.Label>
          <Form.Control
            value={phoneNumber}
            type="tel"
            onChange={(e) => setPhoneNumber(e.currentTarget.value)}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridEvent">
          <Form.Label>Event</Form.Label>
          <Form.Control
            onChange={(e) => setEvent(e.currentTarget.value)}
            name="event"
            type="text"
            placeholder="Enter the event"
            value={event}
          />
        </Form.Group>
      </Form.Row>
      <Form.Row>
      <Form.Group as={Col} controlId="formGridRoom">
          <Form.Label>Rooms</Form.Label>
          <Form.Control
            onChange={(e) => {
              room = e.currentTarget.value;
              setRoom(e.currentTarget.value);
              getSlot();
            }}
            as="select"
            value={room}
          >
            {update ? (
              <option>{room}</option>
            ) : (
              <option hidden>Select a room</option>
            )}
            {availableRooms ? (
              availableRooms.map((currentRoom, i) => {
                return <option key={i}>{currentRoom.roomNumber}</option>;
              })
            ) : (
              <option></option>
            )}
          </Form.Control>
        </Form.Group>

      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="formGridDate">
          <Form.Label>Date</Form.Label>
          <Form.Control
            onChange={(e) => {date = e.currentTarget.value;setDate(e.currentTarget.value);getSlot();}}
            value={date}
            type="date"
          />
        </Form.Group>
        <Form.Group as={Col} controlId="formGridTime">
          <Form.Label>Start time</Form.Label>
          <Form.Control
            onChange={(e) => setSlotData(e.currentTarget.value)}
            as = "select"
            value={slot}
          >
            {update ? (
              <option>{slot}</option>
            ) : (
              <option hidden>Select a slot</option>
            )}
            {availableSlots ? (
              availableSlots.map((currentSlot, i) => {
                return <option key={i}>{currentSlot}</option>;
              })
            ) : (
              <option>Select a room</option>
            )}
          </Form.Control>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Button
          style={{ backgroundColor: "#23153c", marginRight: "1rem" }}
          className="auth-button"
          variant="dark"
          type="submit"
        >
          {update ? "Update" : "Submit"}
        </Button>
        <Button onClick={handleClose} variant="dark" type="button">
          Cancel
        </Button>
      </Form.Row>
    </Form>
  );
};

export default RoomForm;

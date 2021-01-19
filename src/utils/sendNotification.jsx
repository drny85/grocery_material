import axios from "axios";

const sendNotification = async (title, body, order) => {
  try {
    axios.post(
      "https://us-central1-grocery-409ef.cloudfunctions.net/sendNotification/sendNotification",
      {
        title: title,
        body: body,
        data: order,
        userId: order.userId,
      }
    );
  } catch (error) {
    console.log("Error from sending notification", error);
  }
};


export default sendNotification
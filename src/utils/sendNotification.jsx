import axios from "axios";

export default async (title, body, order) => {
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

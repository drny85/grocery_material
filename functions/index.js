const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});

// // The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
const express = require("express");
const fetch = require("node-fetch");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.post("/sendNotification", async (req, res) => {
	try {
		const { userId, title, body, data } = req.body;

		const pushToken = await (
			await admin.firestore().collection("appUser").doc(userId).get()
		).data().pushToken;

		const message = {
			to: pushToken,
			sound: "default",
			title: title,
			body: body,
			data: {
				data,
			},
		};


		await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Accept-encoding": "gzip, deflate",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(message),
		});

		//console.log(result.body);

		return res.status(200).send("success");
	} catch (error) {
		console.log(error);
		return res.status(500).send("ERROR");
	}
});

exports.sendNotification = functions.https.onRequest(app);

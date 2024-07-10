import { initializeApp } from "firebase/app";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyA9WZnlm6mgSpvACbJDVVDRoTb4B757_FA",
  authDomain: "tunitest-e022d.firebaseapp.com",
  projectId: "tunitest-e022d",
  storageBucket: "tunitest-e022d.appspot.com",
  messagingSenderId: "41399715162",
  appId: "1:41399715162:web:b60bf8757a4d86c8161f63",
  measurementId: "G-0DF6XDNTNK"
};

const app = initializeApp(firebaseConfig);

const initializeMessaging = async () => {
  try {
    const supported = await isSupported();
    if (supported) {
      const messaging = getMessaging(app);
      console.log("Firebase Messaging is supported and initialized.");
      // Your messaging initialization code here
    } else {
      console.warn("This browser doesn't support Firebase Messaging.");
    }
  } catch (error) {
    console.error("Error initializing Firebase Messaging:", error);
  }
};

initializeMessaging();

export default app;

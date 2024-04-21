import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebase/firebase-config.mjs";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default async function buyerMiddleware(request, response, next) {
    try {
        
        const user_id = request.user_id;
        const userRef = doc(db, "UsersInfo", user_id);
        const userSnap = await getDoc(userRef);

        const user = userSnap.data();

        if (user.activeRole == 'supplier') {
            next();
        }

        response.status(401).json({ message: "Unauthorized." });

    } catch (error) {
        response.status(500).json({ error }); 
    }
}
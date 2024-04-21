import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../../firebase/firebase-config.mjs";

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default async function postMiddleware(request, response, next) {
    try {
        const user_id = request.user_id;
        const userRef = doc(db, "UsersInfo", user_id);
        const userSnap = await getDoc(userRef);

        const user = userSnap.data();

        if (user.activeRole == 'client' && request.body.type == 'open-to-buy') {
            next();
        } else if (user.activeRole == 'supplier' && request.body.type == 'stock-to-sell') {
            next();
        } else {
            response.status(401).json({ message: "Unauthorized." });
        }

    } catch (error) {
        response.status(500).json({ error }); 
    }
}

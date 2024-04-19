import { initializeApp as adminInitializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import serviceAccount from ".././../serviceAccountKey.json" assert { type: "json" };

adminInitializeApp({
    credential: cert(serviceAccount),
});

export default async function currentUserMiddleware(request, response, next) {
    try {
        const auth = getAuth();
        const token = request.headers.authorization.split(" ")[1];

        const decodeValue = await auth.verifyIdToken(token);

        if(decodeValue) {
            request.user_id = decodeValue.user_id;
            return next();
        }

        response.status(401).json({error});
    } catch (error) {
        response.status(400).json({error});
    }
}

import { Router } from "express";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebase-config.mjs";
import { addDoc, collection, doc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import OpenToBuyRequest from "../requests/OpenToBuyRequest.mjs";
import currentUserMiddleware from "../middlewares/currentUserMiddleware.mjs";

const router = Router();

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

router.get("/api/posts/open-to-buy", currentUserMiddleware, async (request, response) => {
    const postsRef = collection(db, "Posts");
    const q = query(postsRef, where("type", "==", "open-to-buy"));
    const querySnapshot = await getDocs(q);

    const result = [];

    querySnapshot.forEach((doc) => {
        result.push({
            postId: doc.id,
            data: doc.data(),
        });
    });

    response.send(result);
});

router.post(
    "/api/posts",
    currentUserMiddleware,
    async (request, response) => {
        try {
            const postRef = collection(db, "Posts");

            if(request.body.type == 'open-to-buy') {
                await addDoc(postRef, new OpenToBuyRequest(request.body, request.user_id));
            }

            return response.status(201).json({
                message: "Post added successfully",
            });

        } catch (error) {
            console.log(`Error Occured: ${error}`);
            response.status(400).json({ error });
        }
    }
);

export default router;

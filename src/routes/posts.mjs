import { Router, response } from "express";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../firebase/firebase-config.mjs";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, setDoc, where } from "firebase/firestore";
import OpenToBuyRequest from "../requests/OpenToBuyRequest.mjs";
import currentUserMiddleware from "../middlewares/currentUserMiddleware.mjs";
import postMiddleware from "../middlewares/postMiddleware.mjs";
import StockToSellRequest from "../requests/StockToSellRequest.mjs";

const router = Router();

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Get all open to buy posts
router.get("/api/posts/open-to-buy", async (request, response) => {
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

router.get('/api/posts/open-to-buy/users/:userId', async (request, response) => {
 
});

// Get all stock to sell posts
router.get("/api/posts/stock-to-sell", async (request, response) => {
    const postsRef = collection(db, "Posts");
    const q = query(postsRef, where("type", "==", "stock-to-sell"));
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

router.get("/api/posts/:postId", async (request, response) => {
    try {
        const postId = request.params.postId;
        const postRef = doc(db, "Posts", postId);
        const postSnap = await getDoc(postRef);

        if (postSnap.exists()) {
            response.status(200).json({
                id: postSnap.id,
                data: postSnap.data()
            });
        } else {
            response.status(404).json({ message: 'No Record Found' });
        }

    } catch (error) {
        response.status(500).json({ error });
    }
})

router.post(
    "/api/posts",
    currentUserMiddleware,
    postMiddleware,
    async (request, response) => {
        try {
            const postRef = collection(db, "Posts");

            if (request.body.type == 'open-to-buy') {
                let requestData = new OpenToBuyRequest(request.body, request.user_id);
                await addDoc(postRef, { ...requestData });
            }

            if(request.body.type == 'stock-to-sell') {
                let requestData = new StockToSellRequest(request.body, request.user_id);
                await addDoc(postRef, { ...requestData });
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

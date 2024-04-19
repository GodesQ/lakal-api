import { Router } from "express";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "../../firebase/firebase-config.mjs";
import { refreshToken } from "firebase-admin/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import UserAuthResponse from "../responses/UserAuthResponse.mjs";
``
const router = Router();

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

router.post("/api/login", async (request, response) => {
    try {
        const { email, password } = request.body;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const docRef = doc(db, "UsersInfo", userCredential.user.uid);
        const docSnap = await getDoc(docRef);

        const userInfo = docSnap.data();

        // Send success response with user data
        return response.status(200).json({
            user: new UserAuthResponse(userCredential.user, userInfo),
            message: "User registered successfully",
        });
        
    } catch (error) {
        console.error("Error when login user:", error);
        return response.status(400).json({ error });
    }
});

// Registration
router.post("/api/register", async (request, response) => {
    try {
        const { email, password, firstname, lastname, role } = request.body;

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        const userInfoRef = doc(db, "UsersInfo", userCredential.user.uid);

        // Set user info document in Firestore
        await setDoc(userInfoRef, {
            firstName: firstname ?? "",
            lastName: lastname ?? "",
            roles: [role ?? "client"],
            activeRole: role ?? "client",
        });

        // Get the newly created user info document data
        const userInfoSnapshot = await getDoc(userInfoRef);
        const userInfoData = userInfoSnapshot.data();

        await sendEmailVerification(userCredential.user);

        // Send success response with user data
        return response.status(201).json({
            user: new UserAuthResponse(userCredential.user, userInfoData),
            message: "User registered successfully",
        });
    } catch (error) {
        // Handle errors
        console.error("Error registering user:", error);
        let errorMessage = "An error occurred while registering the user";

        // You can customize error messages based on error codes
        if (error.code === "auth/email-already-in-use") {
            errorMessage = "Email is already in use";
        } else if (error.code === "auth/weak-password") {
            errorMessage = "Password is too weak";
        }
        // Send error response
        return response.status(400).json({ error: errorMessage });
    }
});

export default router;

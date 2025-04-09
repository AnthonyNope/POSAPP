// firebase/authService.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // 👈 Agregamos esto
import { auth, db } from "./firebaseConfig"; // 👈 Importamos Firestore también

export const registerUser = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

// 👇 Nueva función para obtener el rol
export const getUserRole = async (uid: string): Promise<string | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return data.role || null;
    } else {
      console.log("No user document found");
      return null;
    }
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  user: User | null;
  userDb: UserData | null;
}>({ user: null, userDb: null });

export function AuthProvider({
  children,
}: {
  children?: JSX.Element | JSX.Element[] | string | string[];
}) {
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const db = getFirestore();

  const [user, setUser] = useState<User | null>(null);
  const [userDb, setUserDb] = useState<UserData | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, async function (res) {
      setLoading(true);
      if (res) {
        setUser(res);

        const docRef = doc(db, "users", res.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDb(docSnap.data() as UserData);
        }

        setLoading(false);
      } else {
        setUser(null);
        setUserDb(null);
        setLoading(false);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDb }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

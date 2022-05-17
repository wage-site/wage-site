import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<{
  user: User | null;
  userDb: UserData | null;
  loading: boolean | null;
}>({ user: null, userDb: null, loading: true });

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
  }, [auth, db]);

  return (
    <AuthContext.Provider value={{ user, userDb, loading }}>
      {false ? (
        <div className="w-full h-screen flex flex-row justify-center items-center space-x-2 font-custom">
          <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
          <span>Se incarca...</span>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

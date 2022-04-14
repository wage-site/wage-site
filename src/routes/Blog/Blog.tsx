import { getFirestore } from "firebase/firestore";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function Blog() {
  useDocumentTitle("Blog");

  const db = getFirestore();

  return <div>Blog</div>;
}

export default Blog;

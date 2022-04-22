import {
  collection,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { DateTime } from "luxon";
import { createContext, useCallback, useEffect, useState } from "react";
import { BlogPagePost, BlogPost } from "../routes/Blog/types";

export const BlogContext = createContext<{
  posts: BlogPost[] | null;
  pagePosts: BlogPagePost[] | null;
  nextBatch: () => void;
  loading: boolean;
  moreLoading: boolean;
  morePosts: boolean;
}>({
  posts: null,
  pagePosts: null,
  nextBatch: () => {},
  loading: true,
  moreLoading: false,
  morePosts: true,
});

export function BlogProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[] | string | string[];
}) {
  const [loading, setLoading] = useState(true);
  const [moreLoading, setMoreLoading] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagePosts, setPagePosts] = useState<BlogPagePost[]>([]);

  const [lastKey, setLastKey] = useState("");
  const [morePosts, setMorePosts] = useState(true);

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const db = getFirestore();

  async function nextBatch() {
    if (!morePosts) return;
    setMoreLoading(true);
    const q = query(
      collection(db, "blog"),
      orderBy("dateUploaded", "desc"),
      startAfter(lastKey),
      limit(5)
    );
    const querySnap = await getDocs(q);
    let psts: BlogPost[] = [];
    let pagePsts: BlogPagePost[] = [];
    querySnap.forEach(async function (post) {
      let {
        author,
        authorName,
        title,
        content,
        dateUploaded,
        bannerUrl,
        imageUrls,
        contentPreview,
      } = post.data();
      let date = DateTime.fromJSDate(dateUploaded.toDate()).toLocaleString(
        DateTime.DATE_FULL
      );
      setLastKey(dateUploaded);
      psts.push({
        id: post.id,
        author,
        authorName,
        title,
        content,
        contentPreview,
        dateUploaded,
        imageUrls,
        bannerUrl,
      });
      pagePsts.push({
        id: post.id,
        author,
        authorName,
        title,
        content,
        contentPreview,
        imageUrls,
        dateUploaded: date,
        bannerUrl,
      });
      forceUpdate();
    });

    if (pagePsts.length == 0) {
      setMorePosts(false);
      forceUpdate();
      setMoreLoading(false);
    } else {
      setPosts(posts.concat(psts));
      setPagePosts(pagePosts.concat(pagePsts));
      forceUpdate();
      setMoreLoading(false);
    }
  }

  useEffect(() => {
    (async function () {
      const q = query(
        collection(db, "blog"),
        orderBy("dateUploaded", "desc"),
        limit(5)
      );
      const unsub = onSnapshot(q, function (querySnap) {
        setLoading(true);
        setMorePosts(true);
        let psts: BlogPost[] = [];
        let pagePsts: BlogPagePost[] = [];
        querySnap.forEach(async function (post) {
          let {
            author,
            authorName,
            title,
            content,
            dateUploaded,
            bannerUrl,
            imageUrls,
            contentPreview,
          } = post.data();
          let date = DateTime.fromJSDate(dateUploaded.toDate()).toLocaleString(
            DateTime.DATE_FULL
          );
          setLastKey(dateUploaded);
          psts.push({
            id: post.id,
            author,
            authorName,
            dateUploaded,
            title,
            content,
            bannerUrl,
            imageUrls,
            contentPreview,
          });
          pagePsts.push({
            id: post.id,
            author,
            authorName,
            title,
            content,
            contentPreview,
            dateUploaded: date,
            imageUrls,
            bannerUrl,
          });
          forceUpdate();
        });

        setPosts(psts);
        setPagePosts(pagePsts);
        forceUpdate();
        setLoading(false);
      });
      return unsub;
    })().then((unsub) => {
      return unsub;
    });
  }, []);

  return (
    <BlogContext.Provider
      value={{ posts, pagePosts, loading, nextBatch, moreLoading, morePosts }}
    >
      {children}
    </BlogContext.Provider>
  );
}

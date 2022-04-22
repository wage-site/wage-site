import { Timestamp } from "firebase/firestore";

interface BlogPost {
  id: string;
  author: string;
  authorName: string;
  dateUploaded: Timestamp;
  title: string;
  content: string;
  bannerUrl: string;
  imageUrls?: string[];
  contentPreview: string;
}

type BlogPagePost = Omit<BlogPost, "dateUploaded"> & { dateUploaded: string };

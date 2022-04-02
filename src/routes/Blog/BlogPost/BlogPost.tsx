import { useParams } from "react-router-dom";

function BlogPost() {
  let params = useParams();
  let id = params.id;

  return <div>Post {id}</div>;
}

export default BlogPost;

import { useParams } from "react-router-dom";

function BlogDelete() {
  let params = useParams();
  let id = params.id;

  return <div>Delete {id}</div>;
}

export default BlogDelete;

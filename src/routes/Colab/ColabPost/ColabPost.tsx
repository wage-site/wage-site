import { useParams } from "react-router-dom";

function ColabPost() {
  let params = useParams();
  let id = params.id;

  return <div>Post {id}</div>;
}

export default ColabPost;

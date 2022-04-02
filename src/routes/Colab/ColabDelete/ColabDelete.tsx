import { useParams } from "react-router-dom";

function ColabDelete() {
  let params = useParams();
  let id = params.id;

  return <div>Delete {id}</div>;
}

export default ColabDelete;

import { useParams } from "react-router-dom";

function ColabEdit() {
  let params = useParams();
  let id = params.id;

  return <div>Edit {id}</div>;
}

export default ColabEdit;

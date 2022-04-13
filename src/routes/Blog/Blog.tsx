import { getFirestore } from "firebase/firestore";
import "./Blog.css";

function Blog() {
  const db = getFirestore();

  return <div className="h-full w-full container">
      <div className="grid grid-rows-6 h-3/4 grid-flow-col gap-4 mx-32 mt-14">
          <div className="row-span-6 col-span-2 bg-slate-400">
              <div className="main h-full w-full flex justify-center items-end">
                <div className="text-white grid grid-rows-2 grid-flow-col mb-10">
                  <span className="text-2xl col-span-1 uppercase">titlul celui mai recent articol</span>
                  <span className="flex justify-center">5 iulie 2007</span>
                </div>
              </div>
          </div>

          <div className="col-span-1 row-span-5 h-full bg-slate-100">

            <div className="ctg border-b-4 border-green-300 w-1/2">Articole Recente</div>

              <div className="w-full bg-green-100 h-1/4">
                <div className="grid grid-rows-1 grid-flow-col">
                  <div className="row-span-1 col-span-1">
                    <div className="image w-full h-full"></div>
                  </div>
                  <div>Titlul articolului</div>
                </div>
            </div>
          </div>

          <div className="row-span-1 col-span-1 bg-slate-100">
            <div className="ctg border-b-4 border-green-300 w-1/2">Social Media</div>
          </div>
      </div>
  </div>;
}

export default Blog;

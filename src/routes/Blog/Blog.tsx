import { getFirestore } from "firebase/firestore";
import "./Blog.css";
import social from "../../assets/svg/social-media.svg";
import article from "../../assets/svg/newspaper.svg";

function Blog() {
  const db = getFirestore();

  return <div className="h-full w-full container">

      {/* ultimul articol, alte articole si social media */}

      <div className="grid grid-rows-5 h-3/4  grid-flow-col gap-4 mx-32 mt-14">
          <div className="row-span-6 col-span-2 bg-slate-400">
              <div className="main h-full w-full flex justify-center items-end">
                <div className="text-white grid grid-rows-2 grid-flow-col mb-10">
                  <span className="text-2xl col-span-1 uppercase">titlul celui mai recent articol</span>
                  <span className="flex justify-center">5 iulie 2007</span>
                </div>
              </div>
          </div>

          <div className="col-span-1 row-span-5 h-3/4">

            <div className="ctg border-b-4 border-green-300 flex w-1/2"><img className="w-7 h-7 mx-2" src={article} alt="" />Alte Articole</div>
            <div className="w-full bg-green-100 h-1/4 my-3">
                <div className="flex h-full">
                  <div className="w-1/4 justify-start bg-slate-200">
                      {/* aici imaginea */}
                  </div>
                  <div className="articleBody ml-3">
                    <div className="title font-black text-l">Sunt inapt si nu pot pune imaginea...</div>
                    <p>20 august 2020</p>
                  </div>
              </div>
            </div>

            <div className="w-full bg-green-100 h-1/4 my-3">
                <div className="flex h-full">
                  <div className="w-1/4 justify-start bg-slate-200">
                      {/* aici imaginea */}
                  </div>
                  <div className="articleBody ml-3">
                    <div className="title font-black text-l">background tot alb si la astea</div>
                    <p>20 august 2020</p>
                  </div>
              </div>
            </div>

            <div className="w-full bg-green-100 h-1/4 my-3">
                <div className="flex h-full">
                  <div className="w-1/4 justify-start bg-slate-200">
                      {/* aici imaginea */}
                  </div>
                  <div className="articleBody ml-3">
                    <div className="title font-black text-l">nu e responsive yet</div>
                    <p>20 august 2020</p>
                  </div>
              </div>
            </div>
          </div>

          <div className="row-span-1 col-span-1 bg-slate-100 h-24">
            <div className="ctg border-b-4 border-green-300 flex w-1/2"><img className="w-7 h-7 mx-2" src={social} alt="" />Social Media</div>

                  {/* butoane facebook si instagram */}

          </div>
      </div>

          <div className="articleBody w-1/2 h-2/6 flex mx-32 mt-5 ">
            <div className="justify-start w-2/3 h-full bg-slate-100">
              <img className="articleImage" src="https://i.imgur.com/LtcEtQs.jpeg" alt="" />
            </div>

              <div className="w-full h-full articleText ml-3">
                <div className="title font-black text-xl">Aici vine titlul articolului</div>
                <p>20 august 2020</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel aliquet eros. Maecenas fringilla leo eget sem gravida malesuada. Aliquam varius consectetur arcu et efficitur. Duis lectus ipsum, faucibus eu fringilla id, pharetra vulputate felis. Sed sit amet elit convallis, porta massa ut, sagittis ligula. </p>
              </div>
          </div>

          <div className="articleBody w-1/2 h-2/6 flex mx-32 mt-5 ">
            <div className="justify-start w-2/3 h-full bg-slate-100">
              <img className="articleImage" src="https://i.imgur.com/LtcEtQs.jpeg" alt="" />
            </div>

              <div className="w-full h-full articleText ml-3">
                <div className="title font-black text-xl">Aici vine titlul articolului</div>
                <p>20 august 2020</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel aliquet eros. Maecenas fringilla leo eget sem gravida malesuada. Aliquam varius consectetur arcu et efficitur. Duis lectus ipsum, faucibus eu fringilla id, pharetra vulputate felis. Sed sit amet elit convallis, porta massa ut, sagittis ligula. </p>
              </div>
          </div>

  </div>;
}

export default Blog;

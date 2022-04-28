import {
  faArrowLeft,
  faArrowRight,
  faCircleNotch,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ButtonBack,
  ButtonNext,
  CarouselProvider,
  Slide,
  Slider,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { slider1, slider2 } from "../../assets/image/home";
import { droplet, leaves, recycle } from "../../assets/svg/home/";
import Footer from "../../components/Footer";
import { BlogContext } from "../../context/Blog";
import proiecte from "../../lib/global/proiecte";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function Home() {
  useDocumentTitle("");

  const { pagePosts, loading } = useContext(BlogContext);

  return (
    <div className="overflow-y-auto w-full h-full flex flex-col justify-start items-center scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300">
      <div className="p-4 w-full block sm:hidden">
        <CarouselProvider
          naturalSlideWidth={1.5}
          naturalSlideHeight={0.5}
          totalSlides={2}
          className="relative w-full"
        >
          <Slider className="rounded-lg">
            <Slide index={0} className="relative text-white">
              <img
                src={slider1}
                className="absolute top-0 left-0 h-full w-full object-cover brightness-75"
              />
              <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-start space-y-2 xl:space-y-4 w-[calc(75%)]">
                  <div className="font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl truncate">
                    Impreuna putem salva pamantul
                  </div>
                  <a
                    href="#"
                    className="bg-green-500 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md text-xs sm:text-sm lg:text-base hover:bg-green-600 transition-all duration-200"
                  >
                    Ce pot face?
                  </a>
                </div>
              </div>
            </Slide>
            <Slide index={1} className="relative text-white">
              <img
                src={slider2}
                className="absolute top-0 left-0 h-full w-full object-cover brightness-75"
              />
              <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-start space-y-2 xl:space-y-4 w-[calc(75%)]">
                  <div className="font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl truncate">
                    Vezi cu proprii ochi calitatea aerului
                  </div>
                  <Link
                    to="/proiecte/harta"
                    replace
                    className="bg-green-500 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md text-xs sm:text-sm lg:text-base hover:bg-green-600 transition-all duration-200"
                  >
                    Spre harta
                  </Link>
                </div>
              </div>
            </Slide>
          </Slider>
          <ButtonBack className="absolute top-0 left-0 h-full flex flex-col justify-center items-center p-3 sm:p-4 text-white disabled:opacity-50 transition-all duration-500">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="h-4 w-4 sm:h-6 sm:w-6"
            />
          </ButtonBack>
          <ButtonNext className="absolute top-0 right-0 h-full flex flex-col justify-center items-center p-3 sm:p-4 text-white disabled:opacity-50 transition-all duration-500">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-4 w-4 sm:h-6 sm:w-6"
            />
          </ButtonNext>
        </CarouselProvider>
      </div>
      <div className="p-4 w-full hidden sm:block">
        <CarouselProvider
          naturalSlideWidth={2}
          naturalSlideHeight={0.5}
          totalSlides={2}
          className="relative w-full"
        >
          <Slider className="rounded-lg">
            <Slide index={0} className="relative text-white">
              <img
                src={slider1}
                className="absolute top-0 left-0 h-full w-full object-cover brightness-75"
              />
              <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-start space-y-2 xl:space-y-4 w-[calc(75%)]">
                  <div className="font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl truncate">
                    Impreuna putem salva pamantul
                  </div>
                  <a
                    href="#"
                    className="bg-green-500 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md text-xs sm:text-sm lg:text-base hover:bg-green-600 transition-all duration-200"
                  >
                    Ce pot face?
                  </a>
                </div>
              </div>
            </Slide>
            <Slide index={1} className="relative text-white">
              <img
                src={slider2}
                className="absolute top-0 left-0 h-full w-full object-cover brightness-75"
              />
              <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-start space-y-2 xl:space-y-4 w-[calc(75%)]">
                  <div className="font-semibold text-md sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl truncate">
                    Vezi cu proprii ochi calitatea aerului
                  </div>
                  <Link
                    to="/proiecte/harta"
                    replace
                    className="bg-green-500 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-md text-xs sm:text-sm lg:text-base hover:bg-green-600 transition-all duration-200"
                  >
                    Spre harta
                  </Link>
                </div>
              </div>
            </Slide>
          </Slider>
          <ButtonBack className="absolute top-0 left-0 h-full flex flex-col justify-center items-center p-3 sm:p-4 text-white disabled:opacity-50 transition-all duration-500">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="h-4 w-4 sm:h-6 sm:w-6"
            />
          </ButtonBack>
          <ButtonNext className="absolute top-0 right-0 h-full flex flex-col justify-center items-center p-3 sm:p-4 text-white disabled:opacity-50 transition-all duration-500">
            <FontAwesomeIcon
              icon={faArrowRight}
              className="h-4 w-4 sm:h-6 sm:w-6"
            />
          </ButtonNext>
        </CarouselProvider>
      </div>
      <div className="p-4 px-8 xl:px-36 mt-8 w-2/3 md:w-full flex flex-col justify-start items-center space-y-6 sm:space-y-8 md:space-y-0 md:flex-row md:justify-evenly md:items-start md:space-x-8">
        <div className="flex-1 flex flex-col space-y-1 sm:space-y-2 justify-start items-center h-full">
          <img src={leaves} className="w-14 h-14" />
          <div className="sm:text-lg font-semibold">Reducere</div>
          <div className="text-xs sm:text-sm font-light text-center">
            Nu cumpara produse pe care nu le folosesti! Asigura-te ca ambalajele
            produselor pe care le-ai cumparat pot fii reutilizabile!
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-1 sm:space-y-2 justify-start items-center h-full">
          <img src={droplet} className="w-14 h-14" />
          <div className="sm:text-lg font-semibold">Refolosire</div>
          <div className="text-xs sm:text-sm font-light text-center">
            Este solutia optima pentru a reduce cantitatile de deseuri pe care
            nu le mai folosesti. Gaseste diferite metode de a refolosi deseul!
          </div>
        </div>
        <div className="flex-1 flex flex-col space-y-2 justify-start items-center h-full">
          <img src={recycle} className="w-14 h-14" />
          <div className="sm:text-lg font-semibold">Reciclare</div>
          <div className="text-xs sm:text-sm font-light text-center">
            Transforma materialele considerate deseu in produse noi! Protejeaza
            resursele naturale!
          </div>
        </div>
      </div>
      <div className="mt-8 px-4 w-full flex flex-col justify-start items-center space-y-4">
        <div className="w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-3 after:flex-1 space-x-2 after:bg-black after:opacity-50">
          <Link
            to="/proiecte"
            replace
            className="flex-shrink text-xl font-semibold"
          >
            Proiectele noastre
          </Link>
        </div>
        <div className="w-full h-full grid grid-flow-col grid-rows-1 rounded-lg justify-start items-start overflow-x-auto gap-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300">
          {proiecte.map((proiect) => (
            <div
              className="w-72 h-full flex flex-col justify-start items-center rounded-lg bg-gray-200"
              key={proiect.title}
            >
              <Link
                to={proiect.location}
                replace
                className="relative w-full h-48 rounded-t-lg group"
              >
                <img
                  src={proiect.image}
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                />
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute w-full h-full top-0 left-0 bg-black bg-opacity-70 flex flex-row justify-center items-center space-x-2 rounded-t-lg text-white">
                  <span>Vezi Proiectul</span>
                  <FontAwesomeIcon icon={faArrowRight} />
                </div>
              </Link>
              <div className="w-full h-full p-4 flex flex-col justify-between items-start space-y-3">
                <div className="w-full flex flex-col justify-start items-start space-y-3">
                  <div className="w-full flex flex-col justify-start items-start">
                    <Link
                      to={proiect.location}
                      className="font-semibold group inline-flex flex-row justify-center items-center space-x-2"
                    >
                      <span>{proiect.title}</span>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      />
                    </Link>
                    <div className="font-light text-xs w-full">
                      {proiect.subtitle}
                    </div>
                  </div>
                  <div className="w-full h-px bg-black opacity-20" />
                  <div className="text-xs text-neutral-800">
                    {proiect.details}
                  </div>
                </div>

                <Link
                  to={proiect.location}
                  replace
                  className="inline-flex flex-row justify-center items-center space-x-1.5 py-1 w-full text-center border-2 rounded-lg border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                >
                  <span>Vezi Proiectul</span>
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="w-3.5 h-3.5"
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 px-4 pb-4 w-full flex flex-col justify-start items-center space-y-4">
        <div className="w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-3 after:flex-1 space-x-2 after:bg-black after:opacity-50">
          <Link
            to="/blog"
            replace
            className="flex-shrink text-xl font-semibold"
          >
            Postari recente
          </Link>
        </div>
        <div className="w-full h-full grid grid-flow-col grid-rows-1 rounded-lg justify-start items-start overflow-x-auto gap-4 scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-300">
          {!loading ? (
            pagePosts &&
            pagePosts.slice(0, 4).map((post) => (
              <div
                className="w-72 h-full flex flex-col justify-start items-center rounded-lg bg-gray-200"
                key={post.id}
              >
                <Link
                  to={`/blog/${post.id}`}
                  replace
                  className="relative w-full h-32 rounded-t-lg group"
                >
                  <img
                    src={post.bannerUrl}
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
                  />
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 absolute w-full h-full top-0 left-0 bg-black bg-opacity-70 flex flex-row justify-center items-center space-x-2 rounded-t-lg text-white">
                    <span>Vezi Articolul</span>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </div>
                </Link>
                <div className="w-full h-full p-4 flex flex-col justify-between items-start space-y-3">
                  <div className="w-full flex flex-col justify-start items-start space-y-3">
                    <div className="w-full flex flex-col justify-start items-start">
                      <Link
                        to={`/blog/${post.id}`}
                        className="font-semibold group inline-flex flex-row justify-center items-center space-x-2"
                      >
                        <span>{post.title}</span>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                        />
                      </Link>
                      <div className="font-light text-xs w-full">
                        {post.dateUploaded}
                      </div>
                    </div>
                    <div className="w-full h-px bg-black opacity-20" />
                    <div className="text-xs text-neutral-800">
                      {post.contentPreview.split(" ").slice(0, 50).join(" ")}...
                    </div>
                  </div>

                  <Link
                    to={`/blog/${post.id}`}
                    replace
                    className="inline-flex flex-row justify-center items-center space-x-1.5 py-1 w-full text-center border-2 rounded-lg border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition-all duration-300"
                  >
                    <span>Vezi Articolul</span>
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      className="w-3.5 h-3.5"
                    />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex flex-row justify-center items-center space-x-2">
              <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
              <span>Se incarca...</span>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;

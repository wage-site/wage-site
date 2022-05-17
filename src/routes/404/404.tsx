import { Button } from "../../components/Button";
import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function Page404() {
  useDocumentTitle("404");
  return (
    <>
      <img
        src="/svg/404bg.svg"
        alt=""
        className="-z-10 h-full w-full absolute object-cover opacity-50"
      />
      <div className="h-full w-full flex flex-col justify-center items-center font-custom">
        <div className="text-xl font-bold">Se pare ca te-ai pierdut!</div>
        <div className="text-sm mt-2">Aceasta pagina nu exista</div>
        <Button isLink to="/" type="primary" className="mt-3">
          Inapoi Acasa
        </Button>
      </div>
    </>
  );
}

export default Page404;

import useDocumentTitle from "../../lib/hooks/useDocumentTitle";

function Colab() {
  useDocumentTitle("Colaboratori");

  return <div>
  <div className="ml-10 colaboratori">
    <div className="w-full flex flex-row justify-center items-center after:w-full after:h-px after:ml-3 after:flex-1 space-x-2 after:bg-black after:opacity-50">
      Scoli
    </div>

    <div className="grid grid-cols-3 grid-flow-col gap-4">

      <div className="flex mt-10">
        <div className="w-40 h-40 rounded-full bg-slate-600"> imagine here</div>
        <div className="body w-80 shadow-sd-r rounded-r-lg">
          <div className="title ml-3">Colegiul National "Dinicu Golescu"</div>
          <div className="text-xs mt-5 ml-3"><p>Colegiul national dinicu golescu renumit pentru rezultatele foarte bune la invatatura in incinta scolii sale este da fpoarte cuvinte random deocamdata</p></div>
        </div>
      </div>

      <div className="flex mt-10">
        <div className="w-40 h-40 rounded-full bg-slate-600"> imagine here</div>
        <div className="body w-80 shadow-sd-r rounded-r-lg">
          <div className="title ml-3">Colegiul National "Dinicu Golescu"</div>
          <div className="text-xs mt-5 ml-3"><p>Colegiul national dinicu golescu renumit pentru rezultatele foarte bune la invatatura in incinta scolii sale este da fpoarte cuvinte random deocamdata</p></div>
        </div>
      </div>

      <div className="flex mt-10">
        <div className="w-40 h-40 rounded-full bg-slate-600"> imagine here</div>
        <div className="body w-80 shadow-sd-r rounded-r-lg">
          <div className="title ml-3">Colegiul National "Dinicu Golescu"</div>
          <div className="text-xs mt-5 ml-3"><p>Colegiul national dinicu golescu renumit pentru rezultatele foarte bune la invatatura in incinta scolii sale este da fpoarte cuvinte random deocamdata</p></div>
        </div>
      </div>

    </div>
        
  </div>

  </div>;
}

export default Colab;

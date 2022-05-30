import { lazy, Suspense } from "react";

const concurs = false;

function Wrapper() {
  if (!concurs) {
    const App = lazy(() => import("./App"));
    return (
      <Suspense>
        <App />
      </Suspense>
    );
  } else {
    const HartaOnly = lazy(() => import("./HartaOnly"));
    return (
      <Suspense>
        <HartaOnly />
      </Suspense>
    );
  }
}

export default Wrapper;

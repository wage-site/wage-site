import { useEffect, useRef } from "react";

/**
 * Set custom title on page
 * @param title Title to set on page
 */
function useDocumentTitle(title: string, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title != "" ? `WAGE Team - ${title}` : "WAGE Team";
  }, [title]);

  useEffect(
    () => () => {
      if (!prevailOnUnmount) {
        document.title = defaultTitle.current;
      }
    },
    []
  );
}

export default useDocumentTitle;

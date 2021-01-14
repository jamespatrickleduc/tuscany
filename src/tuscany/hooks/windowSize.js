import { useState, useLayoutEffect } from "react";

export default function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      const { innerWidth, innerHeight } = window;
      if (innerHeight * (4 / 3) <= innerWidth) {
        setSize([window.innerHeight * (4 / 3), window.innerHeight]);
      } else {
        setSize([window.innerWidth, window.innerWidth * (3 / 4)]);
      }
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}

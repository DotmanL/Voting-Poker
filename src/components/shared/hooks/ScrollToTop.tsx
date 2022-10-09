import { useEffect } from "react";
import { useLocation } from "react-router";

type Props = {
  children: JSX.Element;
};
const ScrollToTop = (props: Props) => {
  const { children } = props;

  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return <>{children}</>;
};

export default ScrollToTop;

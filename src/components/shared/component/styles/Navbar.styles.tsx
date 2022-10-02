import styled from "styled-components";

export const Hamburger = styled.div`
  background-color: #27ae60;
  width: 30px;
  height: 3px;
  transition: all 0.2s linear;
  display: flex;
  position: relative;
  z-index: 9995;
  transform: ${(props: any) => (props.hidden ? "rotate(-45deg)" : "inherit")};
  ::before,
  ::after {
    width: 30px;
    height: 3px;
    background-color: #27ae60;
    content: "";
    position: absolute;
    transition: all 0.3s linear;
  }
  ::before {
    transform: ${(props: any) =>
      props.hidden ? "rotate(-90deg) translate(-10px, 0px)" : "rotate(0deg)"};
    top: -10px;
  }
  ::after {
    opacity: ${(props: any) => (props.hidden ? "0" : "1")};
    transform: ${(props: any) =>
      props.hidden ? "rotate(90deg) " : "rotate(0deg)"};
    top: 10px;
  }
`;

export const Navbox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  background-color: white;
  /* border-top: 1.5px solid #eb392e; */
  transition: all 0.1s ease-in;
  top: 0px;
  z-index: 99;
  left: ${(props: any) => (props.open ? "-100%" : "0")};
`;

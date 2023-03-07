import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const content = (
    <CSSTransition
      in={props.show}
      timeout={200}
      classNames="slide-in-left"
      // classNames={{
      //   enterActive: styles["Slide-in-left-enter"],
      //   enterDone: styles["Slide-in-left-enter-active"],
      //   exitActive: styles["Slide-in-left-exit"],
      //   exit: styles["Slide-in-left-exit-active"]
      // }}
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={props.onClick}>{props.children}</aside>
    </CSSTransition>
  );

  return ReactDOM.createPortal(content, document.getElementById("drawer-hook"));
};

export default SideDrawer;

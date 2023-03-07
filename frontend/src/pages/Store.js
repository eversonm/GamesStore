import { useState } from "react";

import Products from "../components/Products/Products";

function Store() {
  const [cartIsShown, setCartIsShown] = useState(false);
  const showCartHandler = () => {
    setCartIsShown(true);
  };

  const hideCartHandler = () => {
    setCartIsShown(false);
  };

  return (
    <>
      {/* {cartIsShown && <Cart onClose={hideCartHandler} />} */}
      {/* <Header onShowCart={showCartHandler} /> */}
      <main>
        <Products />
      </main>
    </>
  );
}

export default Store;

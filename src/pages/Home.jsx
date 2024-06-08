import { useEffect } from "react";
import { Navbar, Main, Footer, Products, ModalWindow } from "../commons";
import { ProductCard } from "../components";
// import { Product } from "../components";
function Home() {
  useEffect(() => {
    fetch('/api/public/hello-world!')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
  })
  return (
    <>
      <Navbar />
      <ModalWindow />
      <ProductCard product={{id: 1}}></ProductCard>
      <Main />
      <Products />
      {/* <Footer /> */}
    </>
  );
}

export default Home;

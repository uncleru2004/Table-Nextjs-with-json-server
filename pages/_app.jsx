import "../styles/global.css";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }) {
  return (
    <>
      <main>
        <Component {...pageProps} />
      </main>
      <hr />
      <footer>(c) 2023</footer>
      <Toaster />
    </>
    
  );
}

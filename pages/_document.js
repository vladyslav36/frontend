// import Document, { Html, Head, Main, NextScript } from "next/document"

// class MyDocument extends Document {
//   static async getInitialProps(ctx) {
//     const initialProps = await Document.getInitialProps(ctx)
//     return { ...initialProps }
//   }

//   render() {
//     return (
//       <Html>
//         <Head />
//         <body>
//           <Main />
//           <NextScript />
//           <div id='modal-root'></div>
//           <div id='slider'></div>
//           <div id='loupe'></div>
//           <div id='confirm'></div>
//         </body>
//       </Html>
//     )
//   }
// }

// export default MyDocument

import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital@0;1&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://kit.fontawesome.com/ab965ee727.js"
          crossorigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
        <div id="modal-root"></div>
        <div id="slider"></div>
        <div id="loupe"></div>
        <div id="confirm"></div>
      </body>
    </Html>
  )
}

import { Html, Head, Main, NextScript } from 'next/document'
import { useContext } from 'react'

export default function Document() {
  // const grey: String = 'bg-[#eee]';

  return (
    <Html lang="en">
      <Head>
        {/* <title>ft_transcendence</title> */}
      </Head>
      <body className={`bg-CusColor_grey`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
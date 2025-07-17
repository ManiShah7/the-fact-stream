// import { useState } from "react";
// import { hcWithType } from "server/dist/server/src/client";

// // const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

// // const client = hcWithType(SERVER_URL);

// // type SignInResponseType = Awaited<
// //   ReturnType<typeof client.api.v1.auth.signin.$post>
// // >;

function App() {
  // const [data, setData] = useState<
  //   Awaited<ReturnType<SignInResponseType["json"]>> | undefined
  // >();

  // async function sendRequest() {
  //   try {
  //     const res = await client.api.v1.auth.signin.$post();
  //     if (!res.ok) {
  //       console.log("Error fetching data");
  //       return;
  //     }
  //     const data = await res.json();
  //     setData(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  return <>Login</>;
}

export default App;

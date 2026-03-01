// // src/hooks/useGoogleLogin.ts
// import * as Google from "expo-auth-session/providers/google";
// import * as WebBrowser from "expo-web-browser";

// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleLogin = () => {
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     webClientId:
//       "833928399680-ecct7n2r9nql0hvi3a6ock281fu8tjgi.apps.googleusercontent.com",
//   });

//   const getGoogleUser = async (accessToken: string) => {
//     const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
//     if (!res.ok) throw new Error("Failed to fetch Google user info");
//     return (await res.json()) as {
//       id: string;
//       email: string;
//       name: string;
//       picture: string;
//       verified_email: boolean;
//     };
//   };

//   return { request, response, promptAsync, getGoogleUser };
// };

import React, { useState } from "react";
import "@dotlottie/player-component";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import firebaseConfig from "../firebase/firebaseConfig";

const SignIn = () => { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const provider = new GoogleAuthProvider();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  console.log(auth);
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setError(null);
        window.location.href = '/';
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
        console.error("SignIn error:", errorMessage);
      });
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(user);
        window.location.href = '/';
        auth.currentUser
          .getIdToken()
          .then((idToken) => {
            
            // fetch("http://localhost:3000/protected", {
            //   method: "GET",
            //   headers: {
            //     Authorization: idToken,
            //   },
            // })
            //   .then((response) => {
            //     if (!response.ok) {
            //       throw new Error("Network response was not ok");
            //     }
            //     console.log("Token sent to server successfully");
            //   })
            //   .catch((error) => {
            //     console.error(
            //       "There was a problem sending the token to the server:",
            //       error
            //     );
            //   });
          })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        setError(error);
        console.log(error.message);
      });
  };

  return (
    <div className="sm:h-screen min-h-screen h-full sm:py-0 py-[10vmin] w-screen bg-gradient-to-br from-pink-50 via-[#e08dc2] to-[#8c3eb0] flex items-center  justify-center">
      <div className="fixed top-0 left-0 filter blur-3xl rounded-full h-[75vw] w-[75vw] translate-x-[-30vw] translate-y-[30vh] bg-gradient-to-tr opacity-55 from-white outline-2 outline outline-white to-indigo-100"></div>
      <div className="sm:h-[80%] h-full w-[80%] bg-white rounded-3xl shadow-xl sm:bg-opacity-45 bg-opacity-10 backdrop-blur-lg flex sm:flex-row flex-col  items-center justify-center ">
        <div className="sm:w-[45%] w-full sm:h-full h-[35vh] opacity-45 bg-white rounded-tl-3xl sm:rounded-bl-3xl sm:rounded-tr-none rounded-tr-3xl  flex items-center justify-center">
          <div className="rounded-3xl">
            <dotlottie-player
              src="/Animation.json"
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>
        <div className="w-[55%] h-full rounded-tr-3xl rounded-br-3xl p-[5%] flex items-center justify-center">
          <div className="flex flex-col w-full items-center justify-around">
            <p className="text-4xl font-bold text-gray-50 mb-4">Sign in</p>
            <div className=" font-semibold text-gray-50 mb-2">
              <p className="mb-1">Email</p>
              <input
                type="email"
                className="sm:h-8 sm:w-64 h-[10vmin] w-[64vmin] mb-2 rounded-lg p-5 bg-transparent outline-gray-50 text-gray-50 outline outline-1 placeholder-gray-50"
                placeholder="johndoe@xyz.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <p className="mb-1">Password</p>
              <div className="rounded-lg mb-2 items-center justify-between outline-gray-50 flex sm:w-64 w-[64vmin]  outline outline-1">
                <input
                  type={showPassword ? "text" : "password"}
                  className="sm:h-8 sm:w-56 h-[10vmin] w-[56vmin] p-5 bg-transparent text-gray-50 outline-none placeholder-gray-50"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? "eye closed.png" : "/eye.png"}
                  className="sm:h-5 sm:w-5 sm:mr-3 mr-[3vmin] h-[5vmin] w-[5vmin] cursor-pointer invert"
                  alt="Toggle Password Visibility"
                  onClick={togglePasswordVisibility}
                />
              </div>

              {error && <p className="sm:w-64 text-sm mt-2">{"error"}</p>}
            </div>

            <button
              type="submit"
              className="sm:h-10 sm:w-64 h-[10vmin] w-[64vmin] mb-2 bg-white rounded-lg"
              onClick={handleSignIn}
            >
              Sign in
            </button>
            <div className="flex items-center justify-around mb-2">
              <div className="bg-gray-50 h-[2px] sm:w-24 w-[24vmin]"></div>
              <p className="text-gray-50 mx-4">OR</p>
              <div className="bg-gray-50 h-[2px] sm:w-24 w-[24vmin]"></div>
            </div>
            <button
              type="submit"
              className="sm:h-10 sm:w-64 mb-6 h-[10vmin] w-[64vmin] bg-white rounded-lg flex items-center justify-center gap-2"
              onClick={handleGoogleSignIn}
            >
              <img
                src="/google.png"
                alt=""
                className="sm:h-5 sm:w-5 h-[5vmin] w-[5vmin]"
              />{" "}
              <p>Continue with Google</p>
            </button>
            <p className="text-gray-50 sm:w-64 mb-2 w-[64vmin]">
              Don&#39;t have an account?{" "}
              <a className="underline" href="http://localhost:5173/signup">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

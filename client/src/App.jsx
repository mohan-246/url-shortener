import { useEffect, useState, useTransition } from "react";
import { initializeApp } from "firebase/app";
import "firebase/auth";
import "./App.css";
import { getAuth } from "firebase/auth";
import firebaseConfig from "./firebase/firebaseConfig";

function App() {
  const [user, setUser] = useState(null);
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [urls, setUrls] = useState([]);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const alertElement = document.getElementById("alert");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        auth.currentUser
          .getIdToken()
          .then((idToken) => {
            fetch(`http://localhost:3001/urls`, {
              method: "GET",
              headers: {
                Authorization: idToken,
              },
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then((data) => {
                setUrls(data.urls);
                console.log(data);
                console.log("urls recieved successfully");
              })
              .catch((error) => {
                console.error(
                  "There was a problem recieving urls from the server:",
                  error.message
                );
              });
          })
          .catch((error) => {
            console.log(error.message);
          });
      } else {
        window.location.href = "/signin";
        setUser(null);
        console.log("User is logged out");
      }
    });
    return () => {
      setUser(null);
    };
  }, [auth]);
  const logoutUser = () => {
    auth
      .signOut()
      .then(() => {
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out user:", error);
      });
  };
  const shortenLink = async (e) => {
    e.preventDefault();
    if(longUrl.trim() === ''){
      window.alert("Enter a URl to convert!")
      return;
    }
    console.log("shortening");
    auth.currentUser
      .getIdToken()
      .then((idToken) => {
        console.log(idToken);
        fetch("http://localhost:3000/shorten", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: idToken,
          },
          body: JSON.stringify({ longUrl: longUrl }),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            console.log("Token sent to server successfully");
            return response.json();
          })
          .then((data) => {
            setShortUrl(data.url.shortUrl);
            setUrls((prev) => [...prev,data.url])
          })
          .catch((error) => {
            console.error(
              "There was a problem sending the token to the server:",
              error.message
            );
          });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const copyToClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alertElement.classList.remove("hidden");
      alertElement.animate(
        [
          { opacity: "0", transform: "translate(-50%, 0)" },
          { opacity: "1", transform: "translate(-50%, -50%)" },
        ],
        {
          duration: 500,
          fill: "forwards",
        }
      );

      setTimeout(() => {
        alertElement.animate(
          [
            { opacity: "1", transform: "translate(-50%, -50%)" },
            { opacity: "0", transform: "translate(-50%, 0)" },
          ],
          {
            duration: 500,
            fill: "forwards",
          }
        );
      }, 3000);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div
        id="alert"
        className="hidden fixed left-[50%] translate-x-[-50%] top-[20%] translate-y-[-50%] z-10 text-sm bg-white bg-opacity-15 text-gray-50  px-4 py-3 rounded-full"
      >
        Copied to clipboard
      </div>
      <div className=" min-h-screen h-full sm:py-0 py-[10vmin] w-screen bg-gradient-to-br from-pink-300 via-[#e08dc2] to-[#8c3eb0] flex flex-col items-center  justify-center">
        {/* <div className="fixed top-0 left-0 filter blur-3xl rounded-full h-[75vw] w-[75vw] translate-x-[-30vw] translate-y-[30vh] bg-gradient-to-tr opacity-55 from-white outline-2 outline outline-white to-indigo-100"></div> */}
        <div className=" fixed top-2 left-0 w-screen h-[10vmin] flex items-center justify-center  text-gray-50 ">
          <div className="h-full sm:w-[65vw] flex pl-10 items-center text-3xl font-bold justify-start">
            Shortify
          </div>
          <div className="flex h-full w-auto  items-center justify-end gap-4 pr-10">
            {user ? (
              <p className="sm:opacity-100 opacity-0">{user.email}</p>
            ) : (
              <button className="sm:opacity-100 opacity-0 sm:h-10 sm:w-32 text h-[5vmin] w-[24vmin] gap-2 flex items-center justify-center text-gray-50 bg-white bg-opacity-25 rounded-full">
                <a href="/signin">Login</a>
                <img
                  src="/signin.png"
                  className="sm:h-5 sm:w-5 h-[2.5vmin] w-[2.5vmin]"
                  alt=""
                />
              </button>
            )}
            <button className="sm:h-10 sm:w-32 text h-[7vmin] w-[24vmin] gap-2 flex items-center justify-center text-gray-50 bg-white bg-opacity-25 rounded-full">
              <p
                onClick={
                  user ? logoutUser : () => (window.location.href = "/signup")
                }
              >
                {user ? "Sign Out" : "Sign Up"}
              </p>
              {user && (
                <img
                  src="/signout.png"
                  className="sm:h-5 sm:w-5 h-[2.5vmin] w-[2.5vmin]"
                  alt=""
                />
              )}
            </button>
          </div>
        </div>
        <div className=" sm:w-[80%] mt-20 w-auto h-[50vh] rounded-3xl flex flex-col items-center justify-evenly p-10 ">
          <p className="sm:text-4xl text-3xl text-center font-bold mb-4 text-gray-50">
            Shorten your loooong links!
          </p>
          <form
            onSubmit={shortenLink}
            className="rounded-full mb-2 items-center justify-between bg-white bg-opacity-45 backdrop-blur-lg  outline-gray-50 flex h-12 sm:w-96 w-auto  outline outline-1"
          >
            <img
              src="/link.png"
              alt=""
              className="sm:h-5 sm:w-5 h-[5vmin] w-[5vmin] ml-4 cursor-pointer invert"
            />
            <input
              type="text"
              className="sm:h-8 text-xl sm:w-56 flex h-[10vmin] w-[45vmin] p-5 bg-transparent text-gray-50 outline-none placeholder-gray-50"
              placeholder="Enter your link"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
            />
            <button
              type="submit"
              className="bg-white text-gray-800 h-full font-semibold sm:text-sm text-xs rounded-full sm:p-3 px-1"
            >
              Shorten now
            </button>
          </form>
          <div>
            {/* <p className="sm:text-2xl text-xl text-center font-bold text-gray-50">
              Here's your short link
            </p> */}
            {shortUrl && <div className="rounded-full mt-2 mb-2 px-2 items-center  bg-white bg-opacity-45 backdrop-blur-lg  outline-gray-50 flex h-12  w-auto  outline outline-1">
              <p className="sm:h-8 text-xl sm:w-56 cursor-text flex h-[10vmin] w-[45vmin] p-5 bg-transparent text-gray-50 outline-none items-center justify-center">
                {shortUrl.slice(0, 25)}
              </p>
              <button
                onClick={copyToClipBoard}
                className="bg-transparent h-full font-semibold sm:text-sm text-xs  rounded-full sm:p-3 px-1"
              >
                <img
                  src="/copy.png"
                  alt=""
                  className="sm:h-5 sm:w-5 h-[5vmin] w-[5vmin]  cursor-pointer"
                />
              </button>
            </div>}
          </div>
        </div>
        {urls.length > 0 && (
          <div className="sm:h-[80%] mb-10 h-full w-[80%] bg-white rounded-3xl shadow-xl sm:bg-opacity-45 bg-opacity-10 backdrop-blur-lg flex sm:flex-row flex-col items-center justify-center">
            <div className="w-full h-full bg-opacity-45 bg-white rounded-3xl flex items-center justify-center">
              <table className="min-w-full divide-y divide-black">
                <thead className="bg-transparent text-gray-800">
                  <tr>
                    <th className="pl-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Long URL
                    </th>
                    <th className=" py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Short URL
                    </th>
                    <th className=" py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="pr-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Clicks
                    </th>
                    
                  </tr>
                </thead>
                <tbody className="bg-transparent divide-y divide-black text-gray-800">
                  {urls.map((url, index) => (
                    <tr key={index}>
                      <td className="pl-6 py-4 cursor-pointer whitespace-nowrap" onClick={() => window.open(url.longUrl, '_blank')}>
                        {url.longUrl}
                      </td>
                      <td className=" py-4 cursor-pointer whitespace-nowrap" onClick={() => window.open(url.shortUrl, '_blank')}>
                        {url.shortUrl}
                      </td>
                      <td className=" py-4 whitespace-nowrap">
                        {url.createdAt.slice(0 , 10)}
                      </td>
                      <td className="pr-6 py-4 whitespace-nowrap">
                        {url.clicks}
                      </td>
                  
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

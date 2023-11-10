export default function LandingPage() {
    return (
      <div className="w-screen h-screen overflow-x-hidden bg-customcolor">
        <div className="flex w-screen items-center justify-evenly text-white font-extrabold mt-5">
          <p className="text-4xl xs:text-xl ">PROTOTYPE</p>
          <a href="/signup"className="text-linkcolor hover:text-white m-3 "  >
            Register
          </a>
          <a href="/api/auth/signin" className="text-linkcolor hover:text-white m-3 " >
            Login
          </a>

        </div>
      </div>
    );
  }
  
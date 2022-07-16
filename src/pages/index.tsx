import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// buat fungsi untuk ngambil gambar di typescript

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Personal Portfolios</title>
        <meta charSet="UTF-8" />
        <meta name="description" content="Hello, I'm Oggie Sutrisna, Im a Laravel Developer from Badung, Indonesia" />
        <meta name="keywords" content="Oggie Sutrisna, oggiesutrisna, sutrisnaoggie, oggiesutrisna, og, oggie, sutrisna," />
        <meta name="author" content="Oggie Sutrisna" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Body */}
      <section className="h-screen w-screen flex justify-center flex-col text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <Image
              alt="No Image Found"
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded-2xl transform hover:-translate-y-2 transition duration-250 ease-in-out"
              src="/IMG_0545.JPG"
              width={400}
              height={400}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                Hello, Im Oggie <br />
                Im a <div className="font-bold">Laravel Developer</div> from
                Bali, Indonesia.
              </h1>
              <p className="leading-relaxed">
                <a href="#portfolios">See My Work</a>
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* End Body */}

      <section className="text-gray-600 body-font" id="portfolios">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3 transform hover:-translate-y-2 transition duration-250 ease-in-out">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <Image
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1576669802367-42e9fd83d9af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    <a href="https://github.com/oggiesutrisna/DokterOne">
                      {" "}
                      DokterOne
                    </a>
                  </h1>
                  <p className="leading-relaxed mb-3">
                    DokterOne adalah aplikasi berbasis web yang dapat membantu
                    para dokter dan perawat dan juga pasien untuk berhubungan
                    langsung tanpa harus datang ke tempat klinik.
                  </p>
                </div>
              </div>
            </div>
            {/* Openers */}
            <div className="p-4 md:w-1/3 transform hover:-translate-y-2 transition duration-250 ease-in-out">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <Image
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    <a href="https://github.com/oggiesutrisna/Simaka">
                      {" "}
                      Simaka{" "}
                    </a>
                  </h1>
                  <p className="leading-relaxed mb-3">
                    Simaka adalah aplikasi Sistem Management Karyawan berbasis
                    web yang dapat membantu anda untuk memanage karyawan
                    karyawan anda.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3 transform hover:-translate-y-2 transition duration-250 ease-in-out">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <Image
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1606318313647-137d1f3b4d3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1477&q=80"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    <a href="https://github.com/oggiesutrisna/MandalicaClinic">
                      {" "}
                      Mandalika Clinic{" "}
                    </a>
                  </h1>
                  <p className="leading-relaxed mb-3">
                    Mandalika Clinic is an open source and Laravel-based
                    project. Some of the elements of the Mandalika Clinic that
                    are not available on other clinic websites are developed in
                    such a way that they are friendly to users later. One of
                    them sends in a list of patients and their queue numbers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-32 max-w-6xl xl:max-w-7xl w-full mx-auto px-4 sm:px-10 space-y-8">
        <a
          href="https://github.com/sponsors/oggiesutrisna"
          target="_blank" rel="noreferrer"
          className="block px-4 sm:px-12 py-12 text-center text-xl sm:text-3xl font-medium text-white transform hover:-translate-y-2 focus:-translate-y-2 transition duration-250 ease-in-out bg-gradient-to-r from-purple-600 to-teal-400 rounded-lg"
        >
          Love my work? Sponsor me on GitHub ❤️
        </a>

        <a
          href="mailto:sutrisna.oggie@gmail.com" rel="noreferrer"
          className="block px-4 sm:px-12 py-12 text-center text-xl sm:text-3xl font-medium text-gray-900 transform hover:-translate-y-2 focus:-translate-y-2 transition duration-250 ease-in-out border-8 border-gray-900 rounded-lg"
        >
          Contact me at sutrisna.oggie@gmail.com
        </a>
      </div>

      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          <a className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900"></a>
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
            © 2022 Oggie Sutrisna --
            <a
              href="https://www.twitter.com/oggiesutrisna"
              target="_blank"
              className="text-gray-600 ml-1"
              rel="noopener noreferrer"
            >
              @oggiesutrisna
            </a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a className="text-gray-500" href="https://github.com/oggiesutrisna">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500" href="https://twitter.com/oggiesutrisna">
              <svg
                fill="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500" href="https://www.instagram.com/oggiesutrisna">
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500" href="https://www.linkedin.com/in/oggie-sutrisna-7195b3139/">
              <svg
                fill="currentColor"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="0"
                className="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="none"
                  d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
                ></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </footer>
    </>
  );
};

export default Home;

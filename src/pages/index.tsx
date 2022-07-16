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
                Hello, I'm Oggie <br />
                I'm a <div className="font-bold">Laravel Developer</div> from Bali, Indonesia.
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
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1576669802367-42e9fd83d9af?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                   <a href="https://github.com/oggiesutrisna/DokterOne"> DokterOne</a>
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
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                   <a href="https://github.com/oggiesutrisna/Simaka"> Simaka </a>
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
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1606318313647-137d1f3b4d3c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1477&q=80"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                   <a href="https://github.com/oggiesutrisna/MandalicaClinic"> Mandalika Clinic </a>
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
		<a href="https://github.com/sponsors/oggiesutrisna" target="_blank" className="block px-4 sm:px-12 py-12 text-center text-xl sm:text-3xl font-medium text-white transform hover:-translate-y-2 focus:-translate-y-2 transition duration-250 ease-in-out bg-gradient-to-r from-purple-600 to-teal-400 rounded-lg">
			Love my work? Sponsor me on GitHub ❤️
		</a>

		<a href="mailto:sutrisna.oggie@gmail.com.com" className="block px-4 sm:px-12 py-12 text-center text-xl sm:text-3xl font-medium text-gray-900 transform hover:-translate-y-2 focus:-translate-y-2 transition duration-250 ease-in-out border-8 border-gray-900 rounded-lg">
			Contact me at sutrisna.oggie@gmail.com
		</a>
	</div>
    </>
  );
};

export default Home;

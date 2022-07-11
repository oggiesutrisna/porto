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
              className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded-2xl"
              src="/IMG_0545.JPG"
              width={400}
              height={400}
            />
            <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                A Dreamer that never stop learning
              </h1>
              <p className="leading-relaxed">
                Oggie Sutrisna is a multitalented individual who is also
                interested in the IT world and wishes to continue learning.
                Oggie Sutrisna has made nearly several applications that have
                been published by old companies due to his ability in the IT
                field to find his passion in the IT field. So, lets take a look
                at the profile and projects that have been completed thus far.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* End Body */}

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-indigo tracking-widest font-medium title-font mb-1">So, who am i then?</h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font text-gray-900">Web Developer | IT Consultant | Programmer | Security Researcher </h1>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-indigo tracking-widest font-medium title-font mb-1">
              Personal Information
            </h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Profile
            </h1>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto h-screen w-screen justify-center flex">
          <div className="w-full">
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Full Name</h2>
                <p className="leading-relaxed">I Putu Oggie Sutrisna Ady, S.Kom.,</p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Date Of Birth</h2>
                <p className="leading-relaxed">Badung December 5, 1996</p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Address</h2>
                <p className="leading-relaxed">Perumahan Permata Anyar, Gang Permata Utama Lukluk Blok C 11 No 22, Badung, Bali, Indonesia</p>
              </div>
            </div>
            <div className="flex relative pb-12">
              <div className="h-full w-10 absolute inset-0 flex items-center justify-center">
              </div>
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Hobbies</h2>
                <p className="leading-relaxed">Playing Games, Badminton, Photography </p>
              </div>
            </div>
            <div className="flex relative">
              <div className="flex-grow pl-4">
                <h2 className="font-medium title-font text-sm text-gray-900 mb-1 tracking-wider">Skills</h2>
                <p className="leading-relaxed">HTML , CSS , Javascript , ReactJs , VueJs, Laravel , Python</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-indigo tracking-widest font-medium title-font mb-1">
              Projects that makes me sweat working on it
            </h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              List of Projects
            </h1>
          </div>
        </div>
      </section>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://dummyimage.com/720x400"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    DokterOne
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
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://dummyimage.com/720x400"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    Simaka
                  </h1>
                  <p className="leading-relaxed mb-3">
                    Simaka adalah aplikasi Sistem Management Karyawan berbasis
                    web yang dapat membantu anda untuk memanage karyawan
                    karyawan anda.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 md:w-1/3">
              <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                <img
                  className="lg:h-48 md:h-36 w-full object-cover object-center"
                  src="https://dummyimage.com/720x400"
                  alt="blog"
                />
                <div className="p-6">
                  <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                    Mandalika Clinic
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
    </>
  );
};

export default Home;

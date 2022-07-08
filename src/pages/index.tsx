import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// buat fungsi untuk ngambil gambar di typescript

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>I Putu Oggie Sutrisna Ady, S.Kom., MOS</title>
      </Head>

      {/* Body */}
      <section className="h-screen w-screen flex-col text-gray-600 body-font overflow-hidden">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-4/5 mx-auto flex flex-wrap">
            <Image
              alt="no image found lol"
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
    </>
  );
};

export default Home;

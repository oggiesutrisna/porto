import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from 'next/link';

// buat fungsi untuk ngambil gambar di typescript


const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>I Putu Oggie Sutrisna Ady, S.Kom., MOS</title>
            </Head>
            {/* Header */}
            <header className="text-gray-600 body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
                        <Link href="/" className="mr-5 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="#" className="mr-5 hover:text-gray-900">
                            Profile
                        </Link>
                        <Link href="#" className="mr-5 hover:text-gray-900">
                            Projects
                        </Link>
                        <Link href="#" className="mr-5 hover:text-gray-900">
                            Contact
                        </Link>
                    </nav>
                </div>
            </header>
            {/* End Header */}

            {/* Body */}
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="lg:w-4/5 mx-auto flex flex-wrap">
                        <Image
                            alt="no image found lol"
                            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded-2xl"
                            src="/IMG_0545.JPG" width={400} height={400}
                        />
                        <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                                Started from the very Beginning
                            </h1>
                            <p className="leading-relaxed">
                                Name     : I Putu Oggie Sutrisna Ady <br />
                                DOB      : Badung, December 5 1996 <br />
                                Domisili : <b>Indonesia</b> <br />
                                Graduated : Computer Science (S1) <br />
                                Language : Indonesia (Native), English (Passive) <br />
                                Skills : <Link href="#">HTML</Link> | <Link href="#">CSS</Link> | <Link href="#">Laravel</Link> | <Link href="#">React</Link> | <Link href="#">Vue</Link> | <Link href="#">Vite</Link> <br />
                                Hobby :
                                - Have a podcast called <Link href="https://open.spotify.com/show/6CJhEdEtADDvyQLO8zqbtQ?si=aa37dd3c5dd64390">MariDiskusi</Link> on Spotify <br />
                                - Watching Movies <br />
                                - Listening Music <br />
                                - Playing Games : <Link href="https://steamcommunity.com/id/melodyeskimo/"> SteamID </Link> <br />
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            {/* End Body */}

            {/* Footer */}
            <footer className="text-gray-600 body-font">
                <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
                    <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">
                        © 2022 Oggie Sutrisna —
                        <Link
                            href="https://twitter.com/osutirsna"
                            className="text-gray-600 ml-1"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            @osutirnsa
                        </Link>
                    </p>
                </div>
            </footer>
            {/* End Footer */}
        </>
    );
};

export default Home;

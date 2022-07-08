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
                        <Link href="#" className="mr-5 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/profiles" className="mr-5 hover:text-gray-900">
                            Profile
                        </Link>
                        <Link href="/projects" className="mr-5 hover:text-gray-900">
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
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-20">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Master Cleanse
                            Reliac Heirloom</h1>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr
                            hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably
                            have not heard of them man bun deep jianbing selfies heirloom.</p>
                    </div>
                    <div className="flex flex-wrap -m-4">
                        <div className="lg:w-1/3 sm:w-1/2 p-4">
                            <div className="flex relative">
                                <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center"
                                     src="https://dummyimage.com/600x360" />
                                    <div
                                        className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                                        <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE
                                            SUBTITLE</h2>
                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">Shooting
                                            Stars</h1>
                                        <p className="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha
                                            leggings jianbing microdosing tousled waistcoat.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="lg:w-1/3 sm:w-1/2 p-4">
                            <div className="flex relative">
                                <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center"
                                     src="https://dummyimage.com/601x361" />
                                    <div
                                        className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                                        <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE
                                            SUBTITLE</h2>
                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">The
                                            Catalyzer</h1>
                                        <p className="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha
                                            leggings jianbing microdosing tousled waistcoat.</p>
                                    </div>
                            </div>
                        </div>
                        <div className="lg:w-1/3 sm:w-1/2 p-4">
                            <div className="flex relative">
                                <Image alt="gallery" className="absolute inset-0 w-full h-full object-cover object-center"
                                     src="https://dummyimage.com/603x363" />
                                    <div
                                        className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100">
                                        <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">THE
                                            SUBTITLE</h2>
                                        <h1 className="title-font text-lg font-medium text-gray-900 mb-3">The 400
                                            Blows</h1>
                                        <p className="leading-relaxed">Photo booth fam kinfolk cold-pressed sriracha
                                            leggings jianbing microdosing tousled waistcoat.</p>
                                    </div>
                            </div>
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

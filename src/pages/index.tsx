import type {NextPage} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

// buat fungsi untuk ngambil gambar di typescript

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Oggie Sutrisna - Mushroom&apos;s Diary</title>

                <meta name="title" content="Oggie Sutrisna - Mushroom's Diary"/>
                <meta name="description" content="Hello, My Name is Oggie Sutrisna and welcome to my Mushroom's Diary"/>
                <meta name="keywords"
                      content="Oggie, Sutrisna, oggie, sutrisna, oggiesutrisna, Oggie Sutrisna, mushroom, diary, mushromms diary,"/>
                <meta name="robots" content="index,follow"/>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
                <meta name="language" content="English"/>
                <meta name="revisit-after" content="7 days"/>
                <meta name="author" content="Oggie Sutrisna"/>

                <meta name="google-site-verification" content="djhZ1nKUHDbH8PTkkpPR46OzQiA71oW4jzBCME5ao60"/>

                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://oggiesutrisna.vercel.app"/>
                <meta property="og:title" content="Oggie Sutrisna - Mushroom's Diary"/>
                <meta property="og:description"
                      content="Hello, My Name is Oggie Sutrisna and welcome to my Mushroom's Diary"/>
                <meta property="og:image" content="https://metatags.io/images/meta-tags.png"/>

                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="twitter:url" content="https://metatags.io/"/>
                <meta property="twitter:title" content="Oggie Sutrisna - Mushroom's Diary"/>
                <meta property="twitter:description"
                      content="Hello, My Name is Oggie Sutrisna and welcome to my Mushroom's Diary"/>
                <meta property="twitter:image" content="https://metatags.io/images/meta-tags.png"/>

            </Head>

            {/*  Body */}
            <div
                className="px-8 pt-4 container mx-auto w-screen md:w-4/5 lg:w-2/5 min-h-screen flex flex-col justify-between">
                <header className="grow-0 shrink-0">
                    <div className="flex flex-row content-between border-b-2 border-solid border-black pb-1 mb-2">
                        <div className="container font-bold">
                            <h1 className="border-0">oggiesutrisna.vercel.app</h1>
                            <h2 className="border-0">Codes, Tips, and make your life even better</h2>
                        </div>
                        <div className="flex flex-col justify-end text-right">
                            <Link href="/">Home</Link>
                            <Link href="/category/blog">Blog (under development)</Link>
                        </div>
                    </div>
                </header>
                <main className="flex flex-col grow">
                    <section className="flex flex-col justify-evenly grow">
                        <div className="justify-center flex py-8 basis-1/3 items-center">
                            <div
                                className="border border-black border-solid w-1/2 h-20 flex flex-col items-center justify-center p-4">
                                <h1 className="border-0 font-normal text-center">General Information</h1>
                            </div>
                        </div>

                        <div className="basis-1/3">
                            <h2 className="border-b border-solid border-black mb-4">Hello:</h2>
                            <div className="prose max-w-none max-h">
                                <p>
                                    Greetings! My name is Oggie Sutrisna. I grew up in Indonesia, Especially in Bali.
                                    Yep, as a Bali-born, So many bule&apos;s in here. before I
                                    made my way and graduated from STMIK Primakara (now. Universitas Primakara). Then, I
                                    had travels so many places and working as a Software Engineer, Junior Web Developer,
                                    and Part-Time Music Producer and DJ in Bali.
                                </p> <br/>
                                <p>
                                    Reach me on <a href="https://instagram.com/oggiesutrisna">Instagram</a>, or need
                                    some project to help or build it? Reach me on
                                    Telegram.
                                </p>
                            </div>
                        </div>

                        <div className="basis-1/3 flex flex-col">
                            <h2 className="text-md uppercase font-bold: border-b border-solid border-black mb-4">
                                Working Experience:
                            </h2>
                            <ol className="flex flex-col justify-between grow">
                                <li className="flex flex-row justify-between mb-1">
                                    <div>Lead Software Engineer @ <Link href="https://unicare-clinic.com/">Unicare
                                        Clinic</Link></div>
                                    <div>2020</div>
                                </li>

                                <li className="flex flex-row justify-between mb-1">
                                    <div>Lead Software Engineer @ <Link
                                        href="https://hydromedicalbali.com/">Hydromedical</Link></div>
                                    <div>2019-2020</div>
                                </li>

                                <li className="flex flex-row justify-between mb-1">
                                    <div>Graphic Designer @ <Link href="#">Varash</Link></div>
                                    <div>2019</div>
                                </li>

                                <li className="flex flex-row justify-between mb-1">
                                    <div>Junior Web Developer @ <Link href="https://diskominfo.badungkab.go.id/">Diskominfo
                                        Badung</Link></div>
                                    <div>2018</div>
                                </li>
                                <li className="flex flex-row justify-between">
                                    <div>Graphic Designer @ <Link href="#">Pondok Software Santha Bodhi</Link></div>
                                    <div>2013</div>
                                </li>
                            </ol>
                        </div>
                    </section>
                </main>
            </div>
            {/*  End Body*/}
        </>
    );
};

export default Home;

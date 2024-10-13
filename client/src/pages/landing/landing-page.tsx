import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Globe from "@/components/ui/globe";
import { VolumeKnob } from "@/components/volume-knob";
import { motion, useInView } from "framer-motion";
import {
  AudioWaveform,
  Headphones,
  Layers,
  Music,
  Piano,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import background_dark from "../../assets/Background_dark1.png";
import background_light from "../../assets/Background_light1.png";

export default function Landing() {
  const { theme } = useTheme();
  const [backgroundImage, setBackgroundImage] = useState("");
  const ref = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const isInView = useInView(ref);
  const isInView2 = useInView(ref2);
  const isInView3 = useInView(ref3);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [changeRandom, setChangeRandom] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 24);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeRandom((prev) => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const randomSelection = Array(60)
      .fill(0)
      .map((_, index) => ({ index, random: Math.random() }))
      .sort((a, b) => a.random - b.random)
      .slice(0, 22)
      .map((item) => item.index);

    setSelectedItems(randomSelection);
  }, [changeRandom]);

  const toggleSelection = (index: number) => {
    setSelectedItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  useEffect(() => {
    if (theme === "dark") {
      setBackgroundImage(`url(${background_dark})`);
    } else if (theme === "light") {
      setBackgroundImage(`url(${background_light})`);
    } else {
      const isDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setBackgroundImage(
        `url(${isDarkMode ? background_dark : background_light})`
      );
    }
  }, [theme]);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundImage, backgroundSize: "cover" }}
    >
      <main className="flex-1">
        <HeroSection />
        <section className="w-full py-12 md:py-24 lg:py-32 border-t-2 border-primary/80">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="text-3xl font-bold sm:text-5xl text-center max-w-2xl mx-auto"
              ref={ref}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: -30 } : {}}
              transition={{ duration: 0.8 }}
            >
              DubJam brings music creation to everyone, in real-time.
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <Piano className="w-8 h-8 mb-2" />
                  <CardTitle>Intuitive Piano Interface</CardTitle>
                </CardHeader>
                <CardContent>
                  Play and record with our easy-to-use virtual piano keyboard.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <AudioWaveform className="w-8 h-8 mb-2" />
                  <CardTitle>Advanced Step Sequencer</CardTitle>
                </CardHeader>
                <CardContent>
                  Create complex rhythms and melodies with our powerful step
                  sequencer.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Layers className="w-8 h-8 mb-2" />
                  <CardTitle>Multi-track Layering</CardTitle>
                </CardHeader>
                <CardContent>
                  Compose rich, multi-layered tracks with unlimited
                  possibilities.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Share2 className="w-8 h-8 mb-2" />
                  <CardTitle>Easy Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  Share your creations with friends or collaborate with other
                  musicians.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Headphones className="w-8 h-8 mb-2" />
                  <CardTitle>High-Quality Sounds</CardTitle>
                </CardHeader>
                <CardContent>
                  Access a wide range of premium instrument sounds and effects.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Music className="w-8 h-8 mb-2" />
                  <CardTitle>Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  Export your music in various formats for use in other
                  applications.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t-2 border-primary/80">
          <div className="container px-4 md:px-6 mx-auto">
            <motion.h2
              className="mx-auto text-3xl max-w-4xl font-bold sm:text-5xl text-center mb-12"
              ref={ref2}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView2 ? { opacity: 1, y: -30 } : {}}
              transition={{ duration: 0.8 }}
            >
              Sequencing, synthesizing, and sharing music has never been easier.
            </motion.h2>
            <div className="max-w-3xl mx-auto px-20 py-12 rounded-lg shadow-2xl relative backdrop-filter backdrop-blur-3xl">
              <div className="absolute top-12 left-4 flex flex-col gap-2">
                {[...Array(5)].map((_, i) => (
                  <VolumeKnob key={i} />
                ))}
              </div>
              <div className="absolute top-12 right-4 flex flex-col gap-2">
                {[...Array(5)].map((_, i) => (
                  <VolumeKnob key={i} />
                ))}
              </div>
              <div className="grid grid-cols-12 gap-2 mb-4">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-8 rounded ${
                      i === currentStep || i === (currentStep + 12) % 24
                        ? "bg-primary"
                        : "bg-gray-200 dark:bg-black-700"
                    }`}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.05 }}
                  ></motion.div>
                ))}
              </div>
              <div className="flex justify-start items-center mb-4 gap-4">
                <Button size="sm">Play</Button>
                <Button size="sm" variant="outline">
                  Stop
                </Button>
                <VolumeKnob />
              </div>
              <div className="grid grid-cols-12 gap-1">
                {[...Array(60)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`h-12 ${
                      selectedItems.includes(i)
                        ? "bg-blue-500"
                        : i % 2 === 0
                        ? "bg-white dark:bg-purple-100/80 ring-2 ring-primary"
                        : "bg-gray-200 dark:bg-green-500 ring-primary ring-2"
                    } rounded`}
                    onClick={() => toggleSelection(i)}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.05 }}
                  ></motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-[4.2rem] border-t-2 border-primary/80">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center z-50">
              <div className="space-y-2">
                <motion.h2
                  className="text-3xl font-bold sm:text-5xl"
                  ref={ref3}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView3 ? { opacity: 1, y: -10 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  Ready to join the fun?
                </motion.h2>
                <p className="mx-auto md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-gray-600 dark:text-white/70">
                  Join a community of music enthusiasts and start creating music
                  together.
                </p>
                <Button size="lg" className="translate-y-4">
                  <Link className="text-xl font-medium" to="/login">
                    Get started
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative flex size-full scale-150 bottom-0 max-w-lg items-center justify-center overflow-hidden rounded-lg border-none bg-none px-40 pb-32 pt-8 md:pb-60 mx-auto mt-20">
              <Globe className="top-12" />
              <div className="pointer-events-none absolute h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.2),rgba(255,220,255,0))]" />
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-purple-400 bg-primary/50">
        <p className="text-sm text-white">
          © {new Date().getFullYear()} DubJam. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <p>
            Made with <span className="text-red-500">❤</span> for{" "}
            <a
              href="https://dubhacks.co"
              className="text-primary underline text-white"
            >
              DubHacks'
            </a>{" "}
            10th Anniversary
          </p>
        </nav>
      </footer>
    </div>
  );
}

export function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.8,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="min-h-screen w-full py-12 md:py-16 lg:py-24 xl:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center space-y-4 text-center">
          <motion.div
            className="-space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="overflow-hidden">
              <motion.h1
                className="text-5xl text-white dark:text-inherit font-bold sm:text-6xl md:text-7xl lg:text-9xl/none mb-2"
                variants={itemVariants}
              >
                Make Music
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="text-5xl font-bold sm:text-6xl md:text-7xl lg:text-9xl/none mb-2 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 text-transparent bg-clip-text"
                variants={itemVariants}
              >
                Collaboratively
              </motion.h1>
            </div>

            <motion.h1
              className="text-5xl text-white dark:text-inherit font-bold sm:text-6xl md:text-7xl lg:text-9xl/none"
              variants={itemVariants}
            >
              With Anyone.
            </motion.h1>
          </motion.div>

          <div className="space-y-4 flex gap-4 flex-col pt-8">
            <motion.p
              className="mx-auto max-w-[700px] text-purple-700 md:text-2xl dark:text-gray-400"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              DubJam is an online music production platform that lets you
              create, share, and collaborate on making music with friends, all
              in <span className="underline">real-time.</span>
            </motion.p>
            <motion.div
              className="space-x-4 scale-150"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.2, duration: 0.5 }}
            >
              <Button size={"lg"}>
                <Link className="text-sm font-medium" to="/login">
                  Get started
                </Link>
              </Button>
              <Button size={"lg"} variant={"outline"}>
                <Link className="text-sm font-medium" to="/about">
                  Learn more
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

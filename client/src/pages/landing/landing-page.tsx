import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { AudioWaveform, Headphones, Layers, Music, Piano, Share2 } from "lucide-react"
import { Link } from "react-router-dom"
import background_dark from "../../assets/Background_dark1.png";
import background_light from "../../assets/Background_light1.png";
import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-provider"

export default function Landing() {
  const { theme } = useTheme();
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    if (theme === 'dark') {
      setBackgroundImage(`url(${background_dark})`);
    } else if (theme === 'light') {
      setBackgroundImage(`url(${background_light})`);
    } else {
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setBackgroundImage(`url(${isDarkMode ? background_dark : background_light})`);
    }
  }, [theme]);

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48" style={{ backgroundImage }}>
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                                    Make Music Collaboratively
                                </h1>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    DubJam is a powerful online music production platform that lets you create, share, and collaborate on music with friends.
                                </p>
                            </div>
                            <div className="space-x-4">
                                <Button>
                                  <Link className="text-sm font-medium" to="/register">
                                    Get started
                                  </Link>
                                </Button>
                                <Button variant="outline">
                                  <Link className="text-sm font-medium" to="/about">
                                    Learn more
                                  </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-neutral-800">
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Key Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                                    Create complex rhythms and melodies with our powerful step sequencer.
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Layers className="w-8 h-8 mb-2" />
                                    <CardTitle>Multi-track Layering</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Compose rich, multi-layered tracks with unlimited possibilities.
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <Share2 className="w-8 h-8 mb-2" />
                                    <CardTitle>Easy Sharing</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    Share your creations with friends or collaborate with other musicians.
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
                                    Export your music in various formats for use in other applications.
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32" style={{ backgroundImage }}>
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Try It Out</h2>
                        <div className="max-w-3xl mx-auto bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-lg">
                            <div className="grid grid-cols-8 gap-2 mb-4">
                                {[...Array(16)].map((_, i) => (
                                    <div key={i} className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <Button size="sm">Play</Button>
                                <Button size="sm" variant="outline">Stop</Button>
                                <div className="flex items-center">
                                    <span className="mr-2 text-sm">Tempo:</span>
                                    <Slider className="w-32" />
                                </div>
                            </div>
                            <div className="grid grid-cols-12 gap-1">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className={`h-12 ${i % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-200 dark:bg-gray-700'} rounded`}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Start Making Music Today</h2>
                                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                                    Join DubJam to start creating music with friends.
                                </p>
                            </div>
                            <div className="w-full max-w-sm space-y-2">
                                <form className="flex space-x-2">
                                    <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                                    <Button type="submit">Sign Up</Button>
                                </form>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    By signing up, you agree to our <Link to="#">Terms of Service</Link> and <Link to="#">Privacy Policy</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 MusicMaker. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" to="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" to="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    )
}
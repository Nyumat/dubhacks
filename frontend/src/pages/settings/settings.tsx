"use client"

import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/clerk-react"
import { Upload } from "lucide-react"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import background_dark from "../../assets/Background_dark1.png"
import background_light from "../../assets/Background_light1.png"

export default function Settings() {
    const [name, setName] = useState("John Doe")
    const [username, setUsername] = useState("johndoe")
    const [email, setEmail] = useState("john@example.com")
    const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const user = useUser();
    const navigate = useNavigate();

    useLayoutEffect(() => {
        if (!user.isSignedIn) {
            navigate("/login")
            toast.error("You must be signed in to view this page.")
        }
        //eslint-disable-next-line
    }, [user])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setAvatarUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        // Here you would typically send the updated profile data to your backend
        console.log("Profile updated:", { name, username, email, avatarUrl })
    }

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
        <div style={{ backgroundImage }}>
            <div className="container mx-auto py-10">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={avatarUrl} alt="Profile picture" />
                                    <AvatarFallback>
                                        {name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="mr-2 h-4 w-4" /> Change Picture
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <Button className="w-full" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
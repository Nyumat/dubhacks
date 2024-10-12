import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

export default function Register() {
    return (
        <div className="bg-gray-1000 min-h-screen flex flex-col items-center py-12 sm:py-24">
            <div className="space-y-4 text-center">
                <div className="text-4xl font-bold">Join the DubJam Community</div>
                <div className="text-sm">Create an account to start making music with friends.</div>
            </div>
            <Card className="w-full max-w-sm p-8 my-6">
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input id="username" placeholder="Username" required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Password" required />
                    </div>
                    <Button className="w-full">Sign in</Button>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        Create account with Google
                    </Button>
                </CardFooter>
            </Card>
            <div className="grid gap-4 w-full max-w-sm">
                <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full">
                        Already have an account? Login
                    </Button>
                </Link>
            </div>
        </div>
    )
}
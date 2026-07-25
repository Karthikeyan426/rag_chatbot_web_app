"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios  from "axios";
import { loginUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AuthenticationError, NetworkError } from "@/lib/exceptions";

const schema = z.object({
    user_name: z.string().min(3),
    password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: FormData) {
        try {
            setLoading(true);
            setError("");

            const res = await loginUser(data);

            localStorage.setItem(
                "access_token",
                res.access_token
            );

            router.push("/documents");
        } catch (err: any) {
            if(axios.isAxiosError(err)) {
                if(err.response?.status === 400) {
                    setError("Invalid credentials");
                }
                else {
                    setError("Something went wrong");
                }
            }
            
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-100 h-90 max-w-md shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-teal-500">
                    Login
                </CardTitle>
            </CardHeader>

            <CardContent >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div>
                        <Label className=" text-teal-500 ">Username</Label>

                        <Input
                            {...register("user_name")}
                            className="bg-white border-gray-300"
                        />

                        <p className="text-red-500 text-sm">
                            {errors.user_name?.message}
                        </p>
                    </div>

                    <div>
                        <Label className="text-teal-500">Password</Label>

                        <Input
                            type="password"
                            {...register("password")}
                            className="bg-white border-gray-300"
                        />

                        <p className="text-red-500 text-sm">
                            {errors.password?.message}
                        </p>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">
                            {error}
                        </p>
                    )}

                    <Button
                        className="w-full bg-teal-500 text-base mt-2"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Login"}
                    </Button>

                     <p className="text-center text-sm text-muted-foreground">
                        Doesn't have an account?{" "}
                        <Link
                            href="/register"
                            className="font-medium underline"
                        >
                            Register
                        </Link>
                    </p>
                    
                </form>
            </CardContent>
        </Card>
    );
}
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const schema = z
    .object({
        user_name: z.string().min(3, "Username must be at least 3 characters"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
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

            await registerUser({
                user_name: data.user_name,
                password: data.password,
            });

            router.push("/login");
        } catch (err: any) {
            setError(
                err.response?.data?.detail ??
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card className="w-100 h-100S max-w-md shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-teal-500">
                    Create Account
                </CardTitle>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div>
                        <Label className="text-teal-500">Username</Label>
                        <Input {...register("user_name")} className="border-gray-300 bg-white"/>
                        <p className="text-sm text-red-500">
                            {errors.user_name?.message}
                        </p>
                    </div>

                    <div>
                        <Label className="text-teal-500">Password</Label>
                        <Input
                            type="password"
                            {...register("password")}
                            className="border-gray-300 bg-white"
                        />
                        <p className="text-sm text-red-500">
                            {errors.password?.message}
                        </p>
                    </div>

                    <div>
                        <Label className="text-teal-500">Confirm Password</Label>
                        <Input
                            type="password"
                            {...register("confirmPassword")}
                            className="border-gray-300 bg-white"
                        />
                        <p className="text-sm text-red-500">
                            {errors.confirmPassword?.message}
                        </p>
                    </div>

                    {error && (
                        <p className="text-sm text-red-500">
                            {error}
                        </p>
                    )}

                    <Button
                        className="w-full text-base bg-teal-500"
                        disabled={loading}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium underline"
                        >
                            Login
                        </Link>
                    </p>

                </form>
            </CardContent>
        </Card>
    );
}
/* eslint-disable @next/next/no-page-custom-font */
"use client"
import { LoginUserDto } from "@/@validations/AuthValidations";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {loginSchema} from "@/@validations/AuthValidations"
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/redux/rest-api/authApi";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Login() {
   const router = useRouter();
   const {register,handleSubmit,formState: { errors },} = useForm<LoginUserDto>({
                           resolver: zodResolver(loginSchema),
                          defaultValues:{
                                  email: "",
                                  password: "",
                          }
   })

  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [loginUser, {isLoading}] = useLoginMutation();

  const onsubmit = async (values:LoginUserDto) => {
               console.log("user values ", values);
               try {
                 const res =  await loginUser({email:values.email,password:values.password}).unwrap();
                 if(res.success===true){
                               router.push("/chat") 
                 }
               } catch (error) {
                  console.log(error);
               }       
  };

  return (
    <div className="min-h-screen bg-[#070711] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* Animated background orbs */}
      <div className="absolute -top-32 -left-32 w-125 h-125 bg-indigo-600 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute -bottom-24 -right-24 w-100 h-100 bg-violet-600 rounded-full blur-[100px] opacity-20 animate-pulse delay-1000" />
      <div className="absolute top-1/3 right-1/4 w-62.5 h-62.5 bg-cyan-500 rounded-full blur-[90px] opacity-10 animate-pulse delay-500" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/4 backdrop-blur-2xl border border-white/[0.07] rounded-3xl p-10 shadow-2xl">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="white" opacity="0.9" />
              <circle cx="9" cy="10" r="1.2" fill="rgba(255,255,255,0.55)" />
              <circle cx="12" cy="10" r="1.2" fill="rgba(255,255,255,0.55)" />
              <circle cx="15" cy="10" r="1.2" fill="rgba(255,255,255,0.55)" />
            </svg>
          </div>
          <span className="text-[19px] font-extrabold text-white/90 tracking-tight font-[Syne]">
            Vibe<span className="text-indigo-400">Chat</span>
          </span>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/60 animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-white/30 font-medium">
            2,418 online now
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[28px] font-extrabold text-white/90 tracking-tight leading-tight mb-1 font-[Syne]">
          Welcome back
        </h1>
        <p className="text-sm text-white/40 mb-8 font-light">
          Sign in to continue your conversations
        </p>

        {/* Social Buttons */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/8 bg-white/3 text-white/60 text-[13px] font-medium hover:bg-white/[0.07] hover:border-white/[0.14] hover:text-white/90 transition-all duration-200 cursor-pointer">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/8 bg-white/3 text-white/60 text-[13px] font-medium hover:bg-white/[0.07] hover:border-white/[0.14] hover:text-white/90 transition-all duration-200 cursor-pointer">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/[0.07]" />
          <span className="text-[11px] text-white/25 font-medium tracking-wide uppercase whitespace-nowrap">
            or with email
          </span>
          <div className="flex-1 h-px bg-white/[0.07]" />
        </div>

        {/* Form Fields */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onsubmit)}>
          {/* Email */}
          <div>
            <label className="block text-[13px] font-medium text-white/45 mb-2 tracking-wide">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
                {...register("email")}
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3.5 text-white/90 text-sm placeholder:text-white/20 outline-none focus:border-indigo-500/60 focus:bg-indigo-500/6 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
            />
             {errors.email && (
          <p className="text-red-500 mt-0.5 text-sm">
            {errors.email.message}
          </p>
        )}
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[13px] font-medium text-white/45 tracking-wide">
                Password
              </label>
              <button className="text-[13px] text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150 cursor-pointer">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3.5 pr-12 text-white/90 text-sm placeholder:text-white/20 outline-none focus:border-indigo-500/60 focus:bg-indigo-500/6 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/65 transition-colors duration-150 cursor-pointer"
              >
                {showPassword ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
             
            </div>
               {errors.password && (
          <p className="text-red-500 text-sm mt-0.5">
            {errors.password.message}
          </p>
        )}
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2.5 mt-1">
            <input
              type="checkbox"
              id="remember"
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
            <label htmlFor="remember" className="text-sm text-white/40 cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 text-white text-[15px] font-semibold tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {(isLoading )? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <>
                Sign in
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
       <Link href="/signup">
          <p className="mt-6 text-center text-sm text-white/35">
          Don&apos;t have an account?{" "}
          <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150 cursor-pointer">
            Create one free
          </button>
        </p>
       </Link>
      </div>
    </div>
  );
}
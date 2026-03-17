/* eslint-disable @next/next/no-page-custom-font */
"use client";
import { createUserSchema, CreateUserSchemaDto } from "@/@validations/AuthValidations";
import { useRegisterMutation } from "@/redux/rest-api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {useForm,Controller} from "react-hook-form";
import { useRouter } from "next/navigation";

export default function Signup() {
   const router = useRouter();  
  const {register,  control,
handleSubmit,formState: { errors },} = useForm<CreateUserSchemaDto>({
                                         resolver: zodResolver(createUserSchema),
                                         defaultValues:{
                                                 email: "",
                                                 password: "",
                                                 username:"",
                                                 fullName:"",
                                                 roleName:"USER",
                                                 mfaEnabled:true
                                         }
  })

  const [showPassword,setShowPassword] = useState(false)

  const [registerUser,{isLoading}] = useRegisterMutation();

  const onsubmit = async(values:CreateUserSchemaDto) =>{
                
                  console.log(values);
                  try {
                      await registerUser(values).unwrap();
                      router.push("/verify-otp?from=signup")
                  } catch (error) {
                    console.log(error);
                  }      
  }


 
  return (
    <div className="min-h-screen bg-[#070711] flex items-center justify-center px-4 py-10 overflow-hidden relative">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* Background orbs */}
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
          <span className="text-[19px] font-extrabold text-white/90 tracking-tight" style={{ fontFamily: "Syne, sans-serif" }}>
            Vibe<span className="text-indigo-400">Chat</span>
          </span>
        </div>

        {/* Heading */}
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow shadow-emerald-400/60 animate-pulse" />
          <span className="text-[11px] uppercase tracking-widest text-white/30 font-medium">Free forever</span>
        </div>
        <h1 className="text-[26px] font-extrabold text-white/90 tracking-tight leading-tight mb-1" style={{ fontFamily: "Syne, sans-serif" }}>
          Create your account
        </h1>
        <p className="text-sm text-white/40 mb-7 font-light">Join thousands of people already chatting</p>

        {/* Fields */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onsubmit)}>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-medium text-white/45 mb-1.5 tracking-wide">
              Email address <span className="text-indigo-400">*</span>
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              className={`w-full bg-white/4 border rounded-xl px-4 py-3 text-white/90 text-sm
                 placeholder:text-white/20 outline-none transition-all duration-200 `}
               />
                  {errors.email && (
          <p className="text-red-500 mt-0.5 text-sm">
            {errors.email.message}
          </p>
        )}
          </div>

          {/* Username */}
          <div>
            <label className="block text-[13px] font-medium text-white/45 mb-1.5 tracking-wide">
              Username <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25 text-sm font-medium">@</span>
              <input
                type="text"
                {...register("username")}
                placeholder="your_username"
                className={`w-full bg-white/4 border rounded-xl pl-8 pr-4 py-3
                   text-white/90 text-sm placeholder:text-white/20 outline-none transition-all duration-200 
                 `}
              />
            </div>
                 {errors.username && (
          <p className="text-red-500 mt-0.5 text-sm">
            {errors.username.message}
          </p>
        )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[13px] font-medium text-white/45 mb-1.5 tracking-wide">
              Password <span className="text-indigo-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password")}
                className={`w-full bg-white/4 border rounded-xl px-4 py-3 pr-12
                   text-white/90 text-sm placeholder:text-white/20 outline-none transition-all duration-200`}     
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/65 transition-colors duration-150 cursor-pointer"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
             {errors.password && (
          <p className="text-red-500 mt-0.5 text-sm">
            {errors.password.message}
          </p>
        )}
            {/* Password strength bar */}
            {/* {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strengthScore ? strengthColor : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-white/35">{strengthLabel} password</p>
              </div>
            )} */}
          </div>

          {/* Full Name (optional) */}
          <div>
            <label className="block text-[13px] font-medium text-white/45 mb-1.5 tracking-wide">
              Full name <span className="text-white/20 text-[11px] font-normal ml-1">optional</span>
            </label>
            <input
              type="text"
              {...register("fullName")}
              placeholder="Jane Doe"
              className="w-full bg-white/4 border border-white/8 rounded-xl px-4 py-3 text-white/90 text-sm placeholder:text-white/20 outline-none focus:border-indigo-500/60 focus:bg-indigo-500/6 focus:ring-2 focus:ring-indigo-500/10 transition-all duration-200"
            />
             {errors.fullName && (
          <p className="text-red-500 mt-0.5 text-sm">
            {errors.fullName.message}
          </p>
        )}
          </div>


          {/* Avatar URL */}
          <div>
            <label className="block text-[13px] font-medium text-white/45 mb-1.5 tracking-wide">
              Avatar URL <span className="text-white/20 text-[11px] font-normal ml-1">optional</span>
            </label>
            <div className="relative flex items-center gap-3">
              {/* <div className="w-9 h-9 rounded-full bg-white/[0.07] border border-white/[0.1] flex items-center justify-center overflow-hidden flex-shrink-0">
                {form.avatarUrl && !errors.avatarUrl ? (
                  <img src={form.avatarUrl} alt="avatar" className="w-full h-full object-cover" onError={() => handleChange("avatarUrl", "")} />
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div> */}
              <input
                type="url"
                placeholder="https://example.com/avatar.png"
                className={`flex-1 bg-white/4 border rounded-xl px-4 py-3 text-white/90 text-sm
                   placeholder:text-white/20 outline-none transition-all duration-200
                 `}
              />
            </div>
          </div>

          {/* MFA Toggle */}
          <div className="flex items-center justify-between py-3.5 px-4 rounded-xl bg-white/3 border border-white/[0.07] mt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(129,140,248,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-medium text-white/75">Two-factor auth</p>
                <p className="text-[11px] text-white/30">Secure your account with MFA</p>
              </div>
            </div>
         <Controller
  name="mfaEnabled"
  control={control}
  render={({ field }) => (
    <button
      type="button"
      onClick={() => field.onChange(!field.value)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 ${
        field.value ? "bg-indigo-500" : "bg-white/10"
      }`}
      style={{ width: 40, height: 22 }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
          field.value ? "left-5.5" : "left-0.5"
        }`}
        style={{ width: 18, height: 18 }}
      />
    </button>
  )}
/>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-1 py-3.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-600 text-white text-[15px] font-semibold tracking-wide shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            ) : (
              <>
                Create account
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>


        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/35">
          Already have an account?{" "}
          <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-150 cursor-pointer">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
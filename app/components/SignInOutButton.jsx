"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const SignInOutButton = () => {
  const { data: session } = useSession();
  if (session && session.user) {
    return (
      <div className="absolute right-4 top-4">
        <button
          onClick={() => signOut()}
          className="text-black bg-main-pink py-1 px-2 rounded-md font-mono font-semibold border-2 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)]"
        >
          Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className="absolute right-4 top-4">
      <button
        onClick={() => signIn()}
        className="text-black bg-main-pink py-1 px-2 rounded-md font-mono border-2 shadow-[2px_2px_2px_2px_rgba(0,0,0,0.3)]"
      >
        Sign In With Google Account
      </button>
    </div>
  );
};

export default SignInOutButton;

"use client"

import { useEffect, useRef, useState } from 'react'
import CardWrapper from "../_components/card-wrapper"
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";

const VerificationWrapper = () => {
  const { data: session, update } = useSession();
  const [error, setError] = useState();
  const [success, setSucccess] = useState();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const ref = useRef<boolean>(false);

  useEffect(() => {
    if (token && session?.user && !ref.current){
      api.post("users/verification-by-token", { token })
        .then((res) => {
          setSucccess(res.data);
          update({...session?.user, isVerified: true});
        })
        .catch((e) => {
          setError(e.response.data.message);
        })

      ref.current = true;
    }
  }, []);

  return (
    <main className="min-h-svh px-8 flex justify-center items-center">
      <CardWrapper
        backButtonLabel={session?.user.role === "USER" ? "Back to home" : "Back to dashboard"}
        backButtonLink={session?.user.role === "USER" ? "/" : "/tenant/dashboard"}
      >
        <h2 className="font-semibold text-xl text-center">VERIFICATION</h2>
        <p className="pb-4 text-sm text-center">Confirming your email</p>
        {!error && !success && <p className="text-center">Loading...</p>}
        {error && (
          <div className="p-4 bg-red-400 bg-opacity-20 rounded-lg text-red-700">
            <p className="mb-2 text-center">{error}.</p>
            <p className="text-center text-sm">Plis sign out and then sing in again to generate new verification token.</p>
          </div>
        )}
        {success && !error && (
          <div className="p-4 bg-green-400 bg-opacity-20 rounded-lg text-green-700">
            <p className="text-center">Verification successful!</p>
          </div>
        )}
      </CardWrapper>
    </main>
  )
}

export default VerificationWrapper

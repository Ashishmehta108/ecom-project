import {auth} from "@/auth"
import { headers } from "next/headers"

export const getUserSession=async ()=>{
   const session= await auth.api.getSession({
        headers:await headers()
    })
    return session

}


// export const isAuthenticated = session != null

// export const user = session?.user || null
// export const userId = user?.id || null
// export const userEmail = user?.email || null
// export const userName = user?.name || null
// export const userImage = user?.image || null


export const signUpViaEmail=async ()=>{
    // await auth.api.signUpEmail()
}


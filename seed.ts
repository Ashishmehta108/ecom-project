import { auth } from "./auth"

export const createAdmin=async()=>{
    const user=await auth.api.createUser({
        body:{
            name:"Admin",
            email:"ashishmehta108@gmail.com",
            password:"Ashish_m108",
            data: { customField: "customValue" },
            role:"admin"
        }
    })
    console.log("user made ",user)
}



const DATABASE_URL=process.env.DATABASE_URL;
const GITHUB_CLIENT_ID=process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET=process.env.GITHUB_CLIENT_SECRET;


if(!DATABASE_URL){
    throw new Error("DATABASE_URL is not defined in environment variables");
}

if(!GITHUB_CLIENT_ID){
    throw new Error("GITHUB_CLIENT_ID is not defined in environment variables");
}

if(!GITHUB_CLIENT_SECRET){
    throw new Error("GITHUB_CLIENT_SECRET is not defined in environment variables");
}

export {
    DATABASE_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET
};
import "dotenv/config";

function getRequiredEnv(name:string){
    const value = process.env[name];
    if(!value){
        throw new Error("Environment varibales missing");
    }

    return value;
}

export const config = {
    port: getRequiredEnv("PORT"),
    supportedDocTypes: getRequiredEnv("SUPPORTED_DOCS")
}
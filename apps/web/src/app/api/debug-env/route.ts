import { NextRequest } from "next/server";

export async function GET(request: NextRequest)
{
    const envVars = {
        SES_REGION: process.env.SES_REGION,
        SES_FROM_EMAIL: process.env.SES_FROM_EMAIL,
        SES_TO_EMAIL: process.env.SES_TO_EMAIL,
        HAS_ACCESS_KEY: !!process.env.SES_AWS_ACCESS_KEY_ID,
        HAS_SECRET_KEY: !!process.env.SES_AWS_SECRET_ACCESS_KEY,
        // Do not log the actual secret values
        ALL_KEYS: Object.keys(process.env).filter(k => !k.includes("SECRET") && !k.includes("KEY")),
    };

    return Response.json({
        message: "Environment Debug",
        env: envVars,
        timestamp: new Date().toISOString()
    });
}

export type User = {
    id: string;
    name: string;
    email: string;
}

export type TwitterInformation = {
    id: string;
    name: string;
    app_key: string;
    app_secret: string;
    access_token: string;
    access_token_secret: string;
}

export type SchedulePrompt = {
    id: string;
    prompt: string;
    schedule: {
        interval: string;
        next_run: string;
        enabled: boolean;
    }
    twitter_id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export type GenerateTweet = {
    id: string;
    prompt: string;
    generated_content: string;
    twitter_id: string;
    created_at: string;
}


import { OAuthConfig, OAuthUserConfig } from "next-auth/providers";

export interface SeznamProfile extends Record<string, any> {
    accountDisplayName: string;
    advert_user_id: string;
    domain: string;
    email: string;
    email_verified: boolean;
    firstname: string;
    lastname: string;
    oauth_user_id: string;
    username: string;
    avatar_url?: string;
}

export default function Seznam<P extends SeznamProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
    return {
        ...options,
        id: "seznam",
        name: "Seznam.cz",
        type: "oauth",
        authorization: {
            url: "https://login.szn.cz/api/v1/oauth/auth",
            params: {
                scope: "identity,avatar",
                response_type: "code",
            },
        },
        token: "https://login.szn.cz/api/v1/oauth/token",
        userinfo: "https://login.szn.cz/api/v1/user",
        client: {
            token_endpoint_auth_method: "client_secret_post",
        },
        checks: ["state"],
        style: {
            brandColor: "#CC0000",
        },
        profile(profile) {
            return {
                id: profile.oauth_user_id,
                email: profile.email,
                image: profile.avatar_url,
                advert_user_id: profile.advert_user_id,
                email_verified: profile.email_verified,
                name: profile.firstname + " " + profile.lastname,
            };
        },
    };
}

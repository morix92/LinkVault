export interface CredentialsDTO {
    username: string;
    password: string;
}

export function validateCredentials(
    data: CredentialsDTO
): string | null {

    if (!data.username) {
        return "Username obbligatorio";
    }

    if (data.username.length < 3) {
        return "Username deve contenere almeno 3 caratteri";
    }

    if (data.username.length > 50) {
        return "Username non può superare 50 caratteri";
    }

    if (!data.password) {
        return "Password obbligatoria";
    }

    if (data.password.length < 8) {
        return "Password deve contenere almeno 8 caratteri";
    }

    return null;
}
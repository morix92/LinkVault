export interface UpdateUserDTO {
    username?: string;
    password?: string;
}

export function validateUpdateUser(
    data: UpdateUserDTO
): string | null {

    if (!data.username && !data.password) {
        return "Specificare almeno un campo da aggiornare";
    }

    if (data.username) {

        if (data.username.length < 3) {
            return "Username deve contenere almeno 3 caratteri";
        }

        if (data.username.length > 50) {
            return "Username non può superare 50 caratteri";
        }
    }

    if (data.password && data.password.length < 8) {
        return "Password deve contenere almeno 8 caratteri";
    }

    return null;
}
export interface CategoryDTO {
    name: string;
}

export function validateCategory(
    data: CategoryDTO
): string | null {

    if (!data.name) {
        return "Nome categoria obbligatorio";
    }

    if (data.name.length < 2) {
        return "Nome categoria troppo corto";
    }

    if (data.name.length > 100) {
        return "Nome categoria troppo lungo";
    }

    return null;
}
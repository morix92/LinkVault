export interface LinkDTO {
    title: string;
    url: string;
    categoryId?: number;
    description?: string;
}

export function validateLink(
    data: LinkDTO
): string | null {

    if (!data.title) {
        return "Titolo obbligatorio";
    }

    if (!data.url) {
        return "URL obbligatorio";
    }

    try {

        new URL(data.url);

    } catch {

        return "URL non valido";
    }

    return null;
}
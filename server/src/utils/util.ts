export function isNullOrUndefined(obj: any | null | undefined): obj is null | undefined {
    return typeof obj === "undefined" || obj === null;
}
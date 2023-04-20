export declare function parseCSV(input: string, customTypes?: CustomTypeDefinition[]): any[];
export type CustomTypeDefinition = {
    name: string;
    parse: (input: string) => unknown;
};

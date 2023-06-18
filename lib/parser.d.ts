export declare function parseCSV(input: string, customTypes?: CustomTypeDefinition[]): any[];
export declare type CustomTypeDefinition = {
    name: string;
    parse: (input: string) => unknown;
};

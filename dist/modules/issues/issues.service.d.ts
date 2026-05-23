export declare const issuesService: {
    createIssueIntoDb: (payload: any, reporter_id: number) => Promise<any>;
    getAllIssuesFromDB: (filters: {
        sort?: string;
        type?: string;
        status?: string;
    }) => Promise<any[]>;
    getSingleIssueFromDB: (id: string) => Promise<any>;
    updateIssueInDB: (id: string, user: {
        id: number;
        role: string;
    }, payload: {
        title?: string;
        description?: string;
        type?: string;
        status?: string;
    }) => Promise<{
        errorStatus: number;
        message: string;
        success?: never;
        data?: never;
    } | {
        success: boolean;
        data: any;
        errorStatus?: never;
        message?: never;
    }>;
    deleteIssueFromDB: (id: string, userRole: string) => Promise<{
        errorStatus: number;
        message: string;
        success?: never;
    } | {
        success: boolean;
        errorStatus?: never;
        message?: never;
    }>;
};
//# sourceMappingURL=issues.service.d.ts.map
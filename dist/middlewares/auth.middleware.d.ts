import type { Request, Response, NextFunction } from "express";
export declare const protect: (req: Request, res: Response, next: NextFunction) => void;
export declare const authMiddleware: {
    protect: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=auth.middleware.d.ts.map
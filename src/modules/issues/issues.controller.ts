import expressAsyncHandler from "express-async-handler";
import type { Request, Response } from "express";
import { issuesService } from "./issues.service";
import responseHandler from "../../utils/response";

const createIssue = expressAsyncHandler(async (req: Request, res: Response) => {
  const reporter_id = (req as any).user?.id;
  const result = await issuesService.createIssueIntoDb(req.body, reporter_id);

  responseHandler(res, {
    statusCode: 201,
    success: true,
    message: "Issue created successfully",
    data: {
      id: result.id,
      title: result.title,
      description: result.description,
      type: result.type,
      status: result.status,
      reporter_id: result.reporter_id,
      created_at: result.created_at,
      updated_at: result.updated_at,
    },
  });
});

const getAllIssues = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { sort, type, status } = req.query;

    const data = await issuesService.getAllIssuesFromDB({
      sort: sort as string,
      type: type as string,
      status: status as string,
    });

    responseHandler(res, {
      statusCode: 200,
      success: true,
      data,
    });
  },
);

const getSingleIssue = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const data = await issuesService.getSingleIssueFromDB(id as string);

    if (!data) {
      res.status(404);
      throw new Error("Requested resource does not exist");
    }

    responseHandler(res, {
      statusCode: 200,
      success: true,
      data,
    });
  },
);

export const issuseController = {
  createIssue,
  getAllIssues,
  getSingleIssue,
};

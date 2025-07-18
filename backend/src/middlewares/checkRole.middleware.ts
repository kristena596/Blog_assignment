import { User } from "@/models";
import { ApiError } from "@/utils";
import { Request, Response, NextFunction } from "express";

const checkUserRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user: User = req.user!;

    const role = user.role.title;
    if (!roles.includes(role)) {
      throw new ApiError({
        status: 403,
        message: "Forbidden",
        errors: [
          {
            role: `You don't have permission to access this resource`,
          },
        ],
        stack: `User role: ${role} is not allowed to access this resource`,
      });
    }
    next();
  };
};

export default checkUserRole;

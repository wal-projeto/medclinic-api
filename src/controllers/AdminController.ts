import type { Request, Response } from 'express';

// req.user = { id: 2, role: "admin" } (só chega aqui se authenticate + authorize deixaram passar)
export class AdminController {
  ping(req: Request, res: Response): void {
    res.status(200).json({ message: 'pong', user: req.user });
  }
}

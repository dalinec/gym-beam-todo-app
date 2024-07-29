import { z } from 'zod';

export const todoListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

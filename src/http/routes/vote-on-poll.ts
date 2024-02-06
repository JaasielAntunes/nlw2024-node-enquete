import { z } from "zod";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

export async function voteOnPoll(app: FastifyInstance) {
  app.post("/polls/:pollId/votes", async (req, res) => {
    const votePollBody = z.object({
      pollOptionId: z.string().uuid(),
    });

    const votePollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = votePollParams.parse(req.params);
    const { pollOptionId } = votePollBody.parse(req.body);

    let { sessionId } = req.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      res.setCookie("sessionId", sessionId, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        signed: true,
      });
    }

    return res.status(201).send({ sessionId });
  });
}

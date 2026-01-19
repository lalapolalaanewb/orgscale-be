import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import clientMongo from "../services/db";
import { getRedisClient } from "../services/redis";
import { wantANumber } from "../utils/handleQuery";

type ContentStatusType =
  | "pending"
  | "correction"
  | "draft"
  | "published"
  | "reviewed";
type DateType = {
  at: Date;
  by: string;
};
type ContentType = {
  _id: string;
  alt: string;
  description: string;
  created_at: Date;
  created_by: string;
  published?: DateType;
  title: string;
  related: string[];
  slug: string;
  status: ContentStatusType;
  subDesc: string;
  tags: string[];
  thumbnailUrl: string;
  updated?: DateType[];
};
type ParamDefaultType = string | string[] | undefined;
const contentStatuses = [
  "pending",
  "correction",
  "draft",
  "published",
  "reviewed",
];

export const getContents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const queries = req.query as Record<string, ParamDefaultType>;
  const limit = wantANumber(queries.limit, 30);
  const page = wantANumber(queries.page, 0);
  const status = queries.status;

  const statuses: string[] = status
    ? typeof status === "string"
      ? contentStatuses.includes(status)
        ? [status]
        : contentStatuses
      : status.filter((s) => contentStatuses.includes(s))
    : contentStatuses;

  try {
    const mongoClient = await clientMongo();
    const contents = await mongoClient
      .db()
      .collection("contents")
      .aggregate<ContentType>([
        {
          $match: {
            ...(statuses.length > 0 &&
              statuses.length !== contentStatuses.length && {
                status: {
                  $in: statuses,
                },
              }),
          },
        },
        {
          $skip: page * limit,
        },
        {
          $limit: limit,
        },
      ])
      .toArray();

    if (!contents) {
      await mongoClient.close();
      res.status(404).json({ success: false, message: "Contents not found" });
      return;
    }

    await mongoClient.close();
    res.status(200).json({
      success: true,
      message: `Successfully get contents.`,
      data: contents,
    });
  } catch (error) {
    console.error(`Something went wrong at /prob-5: `, error);
    res.status(500).json({ success: false, message: "Query failed" });
  }
};

export const getContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params as { slug: string };

  try {
    const redisClient = await getRedisClient();

    const cacheKey = `content:${slug}`;

    // Try cache first
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.status(200).json({
        success: true,
        message: `Successfully get ${slug} data.`,
        data: JSON.parse(cached),
      });
      return;
    }

    // Fallback to DB
    const mongoClient = await clientMongo();
    const content = await mongoClient
      .db()
      .collection("contents")
      .findOne<ContentType>({
        slug,
      });

    if (!content) {
      await mongoClient.close();
      res.status(404).json({ success: false, message: "Content not found" });
      return;
    }

    // Populate cache
    await redisClient.setEx(cacheKey, 60, JSON.stringify(content));

    await mongoClient.close();
    res.status(200).json({
      success: true,
      message: `Successfully get ${slug} data.`,
      data: content,
    });
  } catch (error) {
    console.error(`Something went wrong at /prob-5/${slug ?? "null"}: `, error);
    res.status(500).json({ success: false, message: "Query failed" });
  }
};

export const createContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const body = req.body as Omit<ContentType, "_id">;

  try {
    const mongoClient = await clientMongo();

    const exists = await mongoClient
      .db()
      .collection("contents")
      .findOne(
        {
          slug: body.slug,
        },
        { projection: { _id: 1 } },
      );

    if (exists) {
      await mongoClient.close();
      res.status(404).json({
        success: false,
        message: "Content already exists!",
      });
      return;
    }

    // Update current location (upsert)
    await mongoClient
      .db()
      .collection("contents")
      .insertOne({
        ...body,
        created_at: new Date().toISOString(),
      });

    await mongoClient.close();
    res.status(204).json({
      success: true,
      message: `Successfully create ${body.slug} data`,
    });
  } catch (error) {
    console.error("Something went wrong at /prob-5:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updateContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params as { slug: string };
  const { by, ...others } = req.body as Partial<Omit<ContentType, "_id">> & {
    by: string;
  };

  if (!slug) {
    res.status(400).json({ success: false, message: "Invalid input!" });
    return;
  }

  try {
    const redisClient = await getRedisClient();
    const mongoClient = await clientMongo();

    const exists = await mongoClient
      .db()
      .collection("contents")
      .findOne(
        {
          slug,
        },
        { projection: { _id: 1 } },
      );

    if (!exists) {
      await mongoClient.close();
      res.status(404).json({
        success: false,
        message: "Content not found!",
      });
      return;
    }

    // Update current location (upsert)
    await mongoClient
      .db()
      .collection("contents")
      .updateOne(
        {
          _id:
            typeof exists._id === "string"
              ? ObjectId.createFromHexString(exists._id)
              : exists._id,
        },
        {
          $set: {
            ...others,
          },
          // @ts-expect-error [expected]
          $push: {
            updated: {
              at: new Date(),
              by,
            },
          },
        },
        { upsert: true },
      );

    // Invalidate cache after update
    const cacheKey = `content:${slug}`;
    await redisClient.del(cacheKey);

    await mongoClient.close();
    res.status(204).json({
      success: true,
      message: `Successfully update ${others.slug} data`,
    });
  } catch (error) {
    console.error("Something went wrong at /prob-5:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { slug } = req.params as { slug: string };

  if (!slug) {
    res.status(400).json({ success: false, message: "Invalid query!" });
    return;
  }

  try {
    const redisClient = await getRedisClient();
    const mongoClient = await clientMongo();

    const exists = await mongoClient
      .db()
      .collection("contents")
      .findOne<Pick<ContentType, "_id">>(
        {
          slug,
        },
        {
          projection: {
            _id: 1,
          },
        },
      );

    if (!exists) {
      await mongoClient.close();
      res.status(404).json({
        success: false,
        message: "Content not found!",
      });
      return;
    }

    await mongoClient.db().collection("contents").deleteOne({
      slug,
    });

    // Invalidate cache after update
    const cacheKey = `content:${slug}`;
    await redisClient.del(cacheKey);

    await mongoClient.close();
    res.status(204).json({
      success: true,
      message: `Successfully delete ${slug} data`,
    });
  } catch (error) {
    console.error("Something went wrong at /prob-5:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

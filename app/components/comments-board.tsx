import {
  commentsQueries,
  useDeleteCommentMutation,
  usePostCommentMutation,
} from "~/queries";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { UseQueryResult } from "@tanstack/react-query";
import { Id } from "convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-react";
import { CommentWithUser } from "convex/schema";

type Props = {
  eventId: Id<"events">;
  commentsQuery: UseQueryResult<CommentWithUser[]>;
};
export const CommentsBoard = ({ eventId, commentsQuery }: Props) => {
  commentsQueries.list;
  const { userId } = useAuth();
  const deleteCommentMutation = useDeleteCommentMutation();
  const postCommentMutation = usePostCommentMutation();

  const onSendComment = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const target = formEvent.currentTarget;

    const formData = new FormData(target);
    const text = formData.get("comment") as string;

    postCommentMutation.mutate(
      { eventId, text },
      {
        onSuccess: () => {
          target.reset();
        },
      }
    );
  };

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-lg">Comments</h4>
      <ul>
        {commentsQuery.data?.map((comment) => (
          <li key={comment._id} className="flex items-start mb-4">
            <Avatar className="size-8 mr-2">
              <AvatarImage
                src={comment.user?.pictureUrl}
                alt={comment.user?.username}
              />
            </Avatar>
            <div className="flex flex-col flex-grow">
              <span className="text-sm">
                <span className="font-semibold">
                  {comment.user?.username ?? "???"}
                </span>
                <span className="text-gray-600"> • </span>
                <span className="italic">
                  {new Date(comment._creationTime).toLocaleDateString()}
                </span>
              </span>
              <span className="text-sm text-gray-600">{comment.text}</span>
            </div>
            {comment.user?.externalId === userId && (
              <Button
                variant={"ghost"}
                className="text-destructive hover:text-destructive/80"
                onClick={() =>
                  deleteCommentMutation.mutate({
                    commentId: comment._id,
                  })
                }
              >
                Delete
              </Button>
            )}
          </li>
        ))}
      </ul>
      <form className="flex gap-2" onSubmit={onSendComment}>
        <Input placeholder="Add a comment" name="comment" />
        <Button size={"sm"}>Post</Button>
      </form>
    </div>
  );
};

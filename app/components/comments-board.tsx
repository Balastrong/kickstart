import { useAuth } from "@clerk/clerk-react";
import { Id } from "convex/_generated/dataModel";
import { CommentWithUser } from "convex/schema";
import {
  useDeleteCommentMutation,
  useLikeCommentMutation,
  usePostCommentMutation,
} from "~/queries";
import { formatDateTime } from "~/utils/date";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Props = {
  eventId: Id<"events">;
  commentsQuery: CommentWithUser[];
};
export const CommentsBoard = ({ eventId, commentsQuery }: Props) => {
  const { userId } = useAuth();

  const deleteCommentMutation = useDeleteCommentMutation();
  const postCommentMutation = usePostCommentMutation();
  const likeCommentMutation = useLikeCommentMutation();

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

  const onDeleteComment = (commentId: Id<"comments">) => {
    deleteCommentMutation.mutate({ commentId });
  };

  const onLikeComment = (commentId: Id<"comments">) => {
    likeCommentMutation.mutate({ commentId });
  };

  return (
    <div className="mt-4">
      <h4 className="mb-2 text-lg">Comments</h4>
      <ul>
        {commentsQuery.map((comment) => {
          return (
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
                    {formatDateTime(new Date(comment._creationTime))}
                  </span>
                </span>
                <span className="text-sm text-gray-600">{comment.text}</span>
                <div className="flex items-center">
                  <Button
                    variant={"ghost"}
                    className={"text-primary hover:text-primary/80"}
                    onClick={() => onLikeComment(comment._id)}
                  >
                    Like ({comment.likes?.length ?? 0})
                  </Button>
                  {comment.user?.externalId === userId && (
                    <Button
                      variant={"ghost"}
                      className="text-destructive hover:text-destructive/80"
                      onClick={() => onDeleteComment(comment._id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <form className="flex gap-2" onSubmit={onSendComment}>
        <Input placeholder="Add a comment" name="comment" />
        <Button size={"sm"}>Post</Button>
      </form>
    </div>
  );
};

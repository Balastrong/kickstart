import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Authenticated, Unauthenticated } from "convex/react";
import { EventWithParticipants } from "convex/schema";
import { useState } from "react";
import {
  commentsQueries,
  usePostCommentMutation,
  useRsvpMutation,
} from "~/queries";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";

type Props = {
  event: EventWithParticipants;
};

export const EventCard = ({ event }: Props) => {
  const rsvpMutation = useRsvpMutation();
  const postCommentMutation = usePostCommentMutation();
  const { userId } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const commentsQuery = useQuery(commentsQueries.list(event._id));

  const isParticipating = event.participants.some(
    (participant) => participant.externalId === userId
  );

  const onSendComment = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const target = formEvent.currentTarget;

    const formData = new FormData(target);
    const text = formData.get("comment") as string;

    postCommentMutation.mutate(
      { eventId: event._id, text },
      {
        onSuccess: () => {
          console.log("Comment posted!");
          target.reset();
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>
          {new Date(event.date!).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <h3 className="mb-2">Participants: {event.participants.length}</h3>
        <ul className="flex gap-1 flex-wrap">
          {event.participants.map((participant) => (
            <li key={participant._id}>
              <Avatar className="size-8">
                <AvatarImage
                  src={participant.pictureUrl}
                  alt={participant.name}
                />
              </Avatar>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Authenticated>
          <div className="flex flex-col w-full">
            <div className="flex justify-between w-full">
              {isParticipating ? (
                <Button
                  size={"sm"}
                  variant={"outline"}
                  onClick={() =>
                    rsvpMutation.mutate({ eventId: event._id, going: false })
                  }
                >
                  I changed my mind :(
                </Button>
              ) : (
                <Button
                  size={"sm"}
                  onClick={() =>
                    rsvpMutation.mutate({ eventId: event._id, going: true })
                  }
                >
                  I'm going!
                </Button>
              )}
              <Button
                variant={"secondary"}
                size={"sm"}
                onClick={() => setShowComments((prev) => !prev)}
              >
                {showComments ? "Hide" : "Show"} Comments (
                {commentsQuery.data?.length ?? 0})
              </Button>
            </div>
            {showComments && (
              <div className="mt-4">
                <h4 className="mb-2">Comments</h4>
                <ul>
                  {commentsQuery.data?.map((comment) => (
                    <li key={comment._id}>
                      <div>{comment.text}</div>
                    </li>
                  ))}
                </ul>
                <form className="flex gap-2" onSubmit={onSendComment}>
                  <Input placeholder="Add a comment" name="comment" />
                  <Button size={"sm"}>Post</Button>
                </form>
              </div>
            )}
          </div>
        </Authenticated>
        <Unauthenticated>
          <SignInButton>
            <Button size={"sm"}>Sign in to RSVP</Button>
          </SignInButton>
        </Unauthenticated>
      </CardFooter>
    </Card>
  );
};

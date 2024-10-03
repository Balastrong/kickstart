import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Authenticated, Unauthenticated } from "convex/react";
import { EventWithParticipants } from "convex/schema";
import { useState } from "react";
import {
  commentsQueries,
  useDeleteCommentMutation,
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
import { CommentsBoard } from "./comments-board";

type Props = {
  event: EventWithParticipants;
};

export const EventCard = ({ event }: Props) => {
  const rsvpMutation = useRsvpMutation();
  const { userId } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const commentsQuery = useQuery(commentsQueries.list(event._id));

  const isParticipating = event.participants.some(
    (participant) => participant.externalId === userId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>
          {new Date(event.date).toLocaleDateString()}
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
                  alt={participant.username}
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
              <CommentsBoard
                eventId={event._id}
                commentsQuery={commentsQuery}
              />
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

import { SignInButton, useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { EventWithParticipants } from "convex/schema";
import { useState } from "react";
import { commentsQueries, useRsvpMutation } from "~/queries";
import { formatDate } from "~/utils/date";
import { CommentsBoard } from "./comments-board";
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
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { getRouteApi } from "@tanstack/react-router";

type Props = {
  event: EventWithParticipants;
};

export const EventCard = ({ event }: Props) => {
  const rsvpMutation = useRsvpMutation();
  const { userId } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const { data: comments = [] } = useQuery(commentsQueries.list(event._id));
  const { filters = [] } = getRouteApi("/").useSearch();

  const isParticipating = event.participants.some(
    (participant) => participant.externalId === userId
  );

  return (
    <Card>
      <div className="flex gap-1 pt-6 px-6 -mb-2">
        {event.tags?.map((tag) => (
          <Badge
            key={tag}
            variant={filters.includes(tag) ? "default" : "outline"}
          >
            {tag}
          </Badge>
        ))}
      </div>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>{formatDate(new Date(event.date))}</CardDescription>
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
                {showComments ? "Hide" : "Show"} Comments ({comments.length})
              </Button>
            </div>
            {showComments && (
              <CommentsBoard eventId={event._id} commentsQuery={comments} />
            )}
          </div>
        </Authenticated>
        <Unauthenticated>
          <SignInButton>
            <Button size={"sm"}>Sign in to RSVP</Button>
          </SignInButton>
        </Unauthenticated>
        <AuthLoading>
          <Skeleton className="h-8 w-32" />
        </AuthLoading>
      </CardFooter>
    </Card>
  );
};

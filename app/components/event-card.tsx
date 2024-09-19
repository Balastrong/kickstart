import { SignInButton, useAuth } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated, useConvexAuth } from "convex/react";
import { EventWithParticipants } from "convex/schema";
import { useRsvpMutation } from "~/queries";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";

type Props = {
  event: EventWithParticipants;
};

export const EventCard = ({ event }: Props) => {
  const rsvpMutation = useRsvpMutation();
  const { userId } = useAuth();

  const isParticipating = event.participants.some(
    (participant) => participant.externalId === userId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>Tomorrow</CardDescription>
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
        </Authenticated>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
      </CardFooter>
    </Card>
  );
};

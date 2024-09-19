import { SignInButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
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

type Props = {
  event: EventWithParticipants;
};

export const EventCard = ({ event }: Props) => {
  const rsvpMutation = useRsvpMutation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>Participants:</CardDescription>
        <ul>
          {event.participants.map((participant) => (
            <li key={participant?._id}>{participant?.name}</li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Authenticated>
          <Button onClick={() => rsvpMutation.mutate({ eventId: event._id })}>
            RSVP
          </Button>
        </Authenticated>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
      </CardFooter>
    </Card>
  );
};

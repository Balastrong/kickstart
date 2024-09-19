import { SignInButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Doc } from "convex/_generated/dataModel";
import { useRsvpMutation } from "~/queries";

type Props = {
  event: Doc<"events">;
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
          {event.participants.map((participant, index) => (
            <li key={index}>{participant}</li>
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

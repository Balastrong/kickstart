import { SignInButton } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import { Event } from "~/types";
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
  event: Event;
};

export const EventCard = ({ event }: Props) => {
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
          <Button onClick={() => console.log("Register")}>RSVP</Button>
        </Authenticated>
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
      </CardFooter>
    </Card>
  );
};

import { Event } from "~/types";
import { Card } from "./ui/card";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/tanstack-start";
import { Button } from "./ui/button";

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
        {/* <SignedIn>
          <Button onClick={() => console.log("Register")}>RSVP</Button>
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut> */}
      </CardFooter>
    </Card>
  );
};
